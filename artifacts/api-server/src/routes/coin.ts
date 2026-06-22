import { Router, type IRouter } from "express";
import { db, coinsTable, chatMessagesTable, scanHistoryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();

const COIN_ANALYSIS_PROMPT = `You are a world-class numismatic expert specializing in ancient coins. Analyze the coin image and return ONLY a valid JSON object with NO markdown, NO explanation, NO code fences. The JSON must match this exact schema:

{
  "identification": {
    "identified": true,
    "coinName": "Full official numismatic name",
    "culture": "Civilization (e.g. Roman Imperial, Ancient Greek, Ottoman)",
    "ruler": "Ruler name or null",
    "dynasty": "Dynasty name or null",
    "period": "Historical period",
    "yearMinted": "Year or date range",
    "mint": "Mint city",
    "denomination": "Coin denomination",
    "material": "Metal composition",
    "diameter": "Diameter in mm as string",
    "weight": "Weight in grams as string",
    "obverse": "Detailed obverse description",
    "reverse": "Detailed reverse description",
    "rarity": "Common" ,
    "grade": "Numismatic grade",
    "confidenceScore": 85,
    "description": "2-3 sentence numismatic description",
    "historicalContext": "2-3 sentences on historical importance",
    "inscriptionObverse": { "legend": "text", "translation": "translation", "script": "Greek/Latin/Arabic/etc" },
    "inscriptionReverse": { "legend": "text", "translation": "translation" },
    "auctionPrices": [{ "house": "Auction house name", "date": "YYYY-MM-DD", "priceUSD": 1000, "currency": "USD" }],
    "estimatedValueRange": { "min": 100, "max": 500, "currency": "USD" }
  },
  "fakeDetection": {
    "authenticityScore": 85,
    "verdict": "ORIJINAL",
    "confidence": 85,
    "indicators": [
      { "name": "Patina & Koroz", "score": 85, "status": "iyi" },
      { "name": "Kalip Keskinligi", "score": 85, "status": "iyi" },
      { "name": "Yuzey Dokusu", "score": 85, "status": "iyi" },
      { "name": "Asınma Deseni", "score": 85, "status": "iyi" },
      { "name": "Yazit Kalitesi", "score": 85, "status": "iyi" },
      { "name": "Flan & Kenar", "score": 85, "status": "iyi" },
      { "name": "Ikonografi", "score": 85, "status": "iyi" },
      { "name": "Metal Yogunlugu", "score": 85, "status": "iyi" },
      { "name": "Darphane Teknigi", "score": 85, "status": "iyi" }
    ],
    "recommendation": "Expert recommendation"
  }
}

IMPORTANT: Analyze the ACTUAL coin in the image. Do not return generic data. Be specific about what you see.`;

const CHAT_PROMPT_BASE = `You are Numisma, an expert numismatic AI advisor specializing in ancient coins, medieval coinage, and historical currency. You have deep knowledge of Greek, Roman, Byzantine, Islamic, Ottoman, and other ancient coinage traditions. Respond in Turkish by default. Be concise, expert, and helpful.`;

// POST /api/coin/analyze
router.post("/coin/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body as {
      imageBase64?: string;
      mimeType?: string;
    };

    if (!imageBase64 || !mimeType) {
      res.status(400).json({ error: "imageBase64 ve mimeType gerekli" });
      return;
    }

    const anthropicKey = process.env["ANTHROPIC_API_KEY"];
    if (!anthropicKey) {
      res.status(500).json({ error: "ANTHROPIC_API_KEY ayarlanmamis" });
      return;
    }

    const client = new Anthropic({ apiKey: anthropicKey });

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: COIN_ANALYSIS_PROMPT,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      parsed = JSON.parse(jsonStr);
    } catch {
      res.status(500).json({ error: "AI yaniti parse edilemedi", raw: text });
      return;
    }

    try {
      await db.insert(scanHistoryTable).values({
        userId: "anonymous",
        identified: parsed?.identification?.identified ?? false,
        confidenceScore: parsed?.identification?.confidenceScore ?? null,
      });
    } catch (dbErr) {
      req.log.warn({ dbErr }, "Failed to save scan history");
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Claude analysis failed");
    res.status(500).json({ error: "Analiz basarisiz" });
  }
});

// GET /api/coins
router.get("/coins", async (req, res) => {
  try {
    const userId = (req.query["userId"] as string) || "anonymous";
    const coins = await db
      .select()
      .from(coinsTable)
      .where(eq(coinsTable.userId, userId))
      .orderBy(desc(coinsTable.addedAt));
    res.json(coins);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch coins");
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

// GET /api/coins/stats
router.get("/coins/stats", async (req, res) => {
  try {
    const userId = (req.query["userId"] as string) || "anonymous";
    const coins = await db.select().from(coinsTable).where(eq(coinsTable.userId, userId));
    const totalValue = coins.reduce((sum, c) => {
      const mid = ((c.estimatedValueMin ?? 0) + (c.estimatedValueMax ?? 0)) / 2;
      return sum + mid;
    }, 0);
    const totalCost = coins.reduce((sum, c) => sum + (c.acquisitionPrice ?? 0), 0);
    res.json({
      totalCoins: coins.length,
      totalEstimatedValue: Math.round(totalValue),
      totalAcquisitionCost: Math.round(totalCost),
      roi: totalCost > 0 ? Math.round(((totalValue - totalCost) / totalCost) * 100) : 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch stats");
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// POST /api/coins
router.post("/coins", async (req, res) => {
  try {
    const body = req.body as {
      userId?: string;
      analysis: Record<string, unknown>;
      acquisitionPrice?: number;
      notes?: string;
    };
    const analysis = body.analysis;
    const id = analysis?.identification as Record<string, unknown> | undefined;
    const [coin] = await db.insert(coinsTable).values({
      userId: body.userId || "anonymous",
      coinName: (id?.coinName as string) || "Bilinmeyen Sikke",
      culture: id?.culture as string | null,
      ruler: id?.ruler as string | null,
      dynasty: id?.dynasty as string | null,
      period: id?.period as string | null,
      yearMinted: id?.yearMinted as string | null,
      mint: id?.mint as string | null,
      denomination: id?.denomination as string | null,
      material: id?.material as string | null,
      diameter: id?.diameter as string | null,
      weight: id?.weight as string | null,
      obverse: id?.obverse as string | null,
      reverse: id?.reverse as string | null,
      rarity: id?.rarity as string | null,
      grade: id?.grade as string | null,
      confidenceScore: id?.confidenceScore as number | null,
      description: id?.description as string | null,
      historicalContext: id?.historicalContext as string | null,
      estimatedValueMin: (id?.estimatedValueRange as Record<string, number> | null)?.min ?? null,
      estimatedValueMax: (id?.estimatedValueRange as Record<string, number> | null)?.max ?? null,
      authenticityScore: (analysis?.fakeDetection as Record<string, number> | null)?.authenticityScore ?? null,
      verdict: (analysis?.fakeDetection as Record<string, string> | null)?.verdict ?? null,
      acquisitionPrice: body.acquisitionPrice ?? null,
      notes: body.notes ?? null,
      fullAnalysis: analysis,
    }).returning();
    res.status(201).json(coin);
  } catch (err) {
    req.log.error({ err }, "Failed to save coin");
    res.status(500).json({ error: "Failed to save coin" });
  }
});

// PATCH /api/coins/:id
router.patch("/coins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, acquisitionPrice } = req.body as { notes?: string; acquisitionPrice?: number };
    const [updated] = await db.update(coinsTable).set({
      ...(notes !== undefined && { notes }),
      ...(acquisitionPrice !== undefined && { acquisitionPrice }),
      updatedAt: new Date(),
    }).where(eq(coinsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Coin not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update coin");
    res.status(500).json({ error: "Failed to update coin" });
  }
});

// DELETE /api/coins/:id
router.delete("/coins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(coinsTable).where(eq(coinsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete coin");
    res.status(500).json({ error: "Failed to delete coin" });
  }
});

// POST /api/coins/chat
router.post("/coins/chat", async (req, res) => {
  const { messages, coinContext } = req.body as {
    messages?: Array<{ role: string; content: string }>;
    coinContext?: string;
  };
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }
  const anthropicKey = process.env["ANTHROPIC_API_KEY"];
  if (!anthropicKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY ayarlanmamis" });
    return;
  }
  try {
    const client = new Anthropic({ apiKey: anthropicKey });
    const systemPrompt = coinContext
      ? `${CHAT_PROMPT_BASE}\n\nKullanicinin koleksiyonundaki sikkeler: ${coinContext}`
      : CHAT_PROMPT_BASE;
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });
    const reply = response.content[0].type === "text" ? response.content[0].text : "";
    res.json({ reply });
  } catch (err) {
    req.log.error({ err }, "Claude chat failed");
    res.status(500).json({ error: "Chat service unavailable" });
  }
});

export default router;
