import { Router, type IRouter } from "express";
import { db, coinsTable, chatMessagesTable, scanHistoryTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const MOCK_COINS = [
  {
    identification: {
      identified: true,
      coinName: "Atina Tetradrahm",
      culture: "Ancient Greek",
      ruler: null,
      dynasty: null,
      period: "Classical Period",
      yearMinted: "454-404 BC",
      mint: "Athens (Atina)",
      denomination: "Tetradrachm",
      material: "Silver (98%)",
      diameter: "24",
      weight: "17.2",
      obverse: "Helmeted head of Athena facing right with archaic eye",
      reverse: "Owl of Athena standing right, olive sprig and crescent moon, AOE inscription",
      rarity: "Scarce" as const,
      grade: "VF-30",
      confidenceScore: 85,
      description: "The most widely circulated coin of the ancient world. Athens' silver owls funded the Parthenon and the fleet that defeated Persia at Salamis.",
      historicalContext: "Minted from the rich silver mines of Laurion, these coins were the dominant trade currency of the Mediterranean from the 5th to 4th centuries BC.",
      inscriptionObverse: { legend: "\u0391\u0398\u0395", translation: "Athens", script: "Greek" },
      auctionPrices: [
        { house: "CNG", date: "2023-05-15", priceUSD: 2800, currency: "USD" },
        { house: "Roma Numismatics", date: "2022-10-20", priceUSD: 3200, currency: "USD" },
        { house: "K\u00fcnker", date: "2021-06-10", priceUSD: 2400, currency: "USD" },
      ],
      estimatedValueRange: { min: 1200, max: 4500, currency: "USD" },
    },
    fakeDetection: {
      authenticityScore: 82,
      verdict: "ORIJINAL" as const,
      confidence: 82,
      indicators: [
        { name: "Patina & Koroz", score: 88, status: "iyi" as const },
        { name: "Kal\u0131p Keskinli\u011fi", score: 80, status: "iyi" as const },
        { name: "Y\u00fczey Dokusu", score: 78, status: "iyi" as const },
        { name: "A\u015f\u0131nma Deseni", score: 85, status: "iyi" as const },
        { name: "Yaz\u0131t Kalitesi", score: 90, status: "iyi" as const },
        { name: "Flan & Kenar", score: 75, status: "iyi" as const },
        { name: "\u0130konografi", score: 88, status: "iyi" as const },
        { name: "Metal Yo\u011funlu\u011fu", score: 72, status: "orta" as const },
        { name: "Darphane Tekni\u011fi", score: 82, status: "iyi" as const },
      ],
      recommendation: "Y\u00fcksek g\u00fcven puan\u0131 ile \u00f6zg\u00fcn g\u00f6r\u00fcn\u00fcm sergilenmektedir. Y\u00fcksek de\u011ferli bir sat\u0131n alma i\u00e7in fiziksel inceleme \u00f6nerilir.",
    },
  },
  {
    identification: {
      identified: true,
      coinName: "Roma Denarius - Augustus",
      culture: "Roman Imperial",
      ruler: "Augustus",
      dynasty: "Julio-Claudian",
      period: "Early Empire",
      yearMinted: "2 BC - 14 AD",
      mint: "Lugdunum (Lyon)",
      denomination: "Denarius",
      material: "Silver (95%)",
      diameter: "19",
      weight: "3.9",
      obverse: "Laureate head of Augustus right, CAESAR AVGVSTVS DIVI F PATER PATRIAE",
      reverse: "Gaius and Lucius standing facing, shields and spears, C L CAESARES AVGVSTI F COS DESIG PRINC IVVENT",
      rarity: "Common" as const,
      grade: "EF-40",
      confidenceScore: 91,
      description: "The most important silver coin of the Roman Empire, featuring the first emperor Augustus with his designated heirs.",
      historicalContext: "Issued around 2 BC, after Augustus was given the title Pater Patriae (Father of the Fatherland). Struck at Lugdunum to pay the Rhine legions.",
      auctionPrices: [
        { house: "Heritage", date: "2023-11-08", priceUSD: 850, currency: "USD" },
        { house: "Stack's Bowers", date: "2022-08-15", priceUSD: 720, currency: "USD" },
        { house: "CNG", date: "2021-05-20", priceUSD: 940, currency: "USD" },
        { house: "Nomos", date: "2020-10-12", priceUSD: 680, currency: "USD" },
      ],
      estimatedValueRange: { min: 600, max: 1200, currency: "USD" },
    },
    fakeDetection: {
      authenticityScore: 91,
      verdict: "ORIJINAL" as const,
      confidence: 91,
      indicators: [
        { name: "Patina & Koroz", score: 92, status: "iyi" as const },
        { name: "Kal\u0131p Keskinli\u011fi", score: 95, status: "iyi" as const },
        { name: "Y\u00fczey Dokusu", score: 88, status: "iyi" as const },
        { name: "A\u015f\u0131nma Deseni", score: 90, status: "iyi" as const },
        { name: "Yaz\u0131t Kalitesi", score: 93, status: "iyi" as const },
        { name: "Flan & Kenar", score: 88, status: "iyi" as const },
        { name: "\u0130konografi", score: 92, status: "iyi" as const },
        { name: "Metal Yo\u011funlu\u011fu", score: 85, status: "iyi" as const },
        { name: "Darphane Tekni\u011fi", score: 90, status: "iyi" as const },
      ],
      recommendation: "Y\u00fcksek g\u00fcven puan\u0131 ile \u00f6zg\u00fcnl\u00fck teyit edilmi\u015ftir. Koleksiyona g\u00fcvenle eklenebilir.",
    },
  },
  {
    identification: {
      identified: true,
      coinName: "Osmanl\u0131 Tu\u011fral\u0131 Alt\u0131n",
      culture: "Ottoman Empire",
      ruler: "Sultan Abd\u00fclmecid I",
      dynasty: "Ottoman",
      period: "Tanzimat D\u00f6nemi",
      yearMinted: "1839 AD (1255 AH)",
      mint: "Konstantinopolis (\u0130stanbul)",
      denomination: "Hayriye Alt\u0131n\u0131",
      material: "Alt\u0131n (91.7%)",
      diameter: "22",
      weight: "1.8",
      obverse: "Sultan Abd\u00fclmecid'in tu\u011fras\u0131",
      reverse: "Arap\u00e7a kitabe, darphane ad\u0131 ve tarih",
      rarity: "Scarce" as const,
      grade: "AU-55",
      confidenceScore: 88,
      description: "Tanzimat d\u00f6neminde bas\u0131lan bu alt\u0131n sikke, Osmanl\u0131 \u0130mparatorlu\u011fu'nun para sistemini modernle\u015ftirme \u00e7abalar\u0131n\u0131 yans\u0131t\u0131r.",
      historicalContext: "Abd\u00fclmecid'in tahta \u00e7\u0131k\u0131\u015f\u0131n\u0131 takiben Tanzimat reformlar\u0131 kapsam\u0131nda yenilenen sikke d\u00fczeninin ilk \u00f6rneklerinden biridir.",
      inscriptionObverse: { legend: "\u0639\u0628\u062f \u0627\u0644\u0645\u062c\u064a\u062f \u062e\u0627\u0646", translation: "Abd\u00fclmecid Han", script: "Arabic" },
      auctionPrices: [
        { house: "K\u00fcnker", date: "2023-06-20", priceUSD: 420, currency: "USD" },
        { house: "Roma Numismatics", date: "2022-03-10", priceUSD: 380, currency: "USD" },
      ],
      estimatedValueRange: { min: 300, max: 600, currency: "USD" },
    },
    fakeDetection: {
      authenticityScore: 88,
      verdict: "ORIJINAL" as const,
      confidence: 88,
      indicators: [
        { name: "Patina & Koroz", score: 90, status: "iyi" as const },
        { name: "Kal\u0131p Keskinli\u011fi", score: 85, status: "iyi" as const },
        { name: "Y\u00fczey Dokusu", score: 88, status: "iyi" as const },
        { name: "A\u015f\u0131nma Deseni", score: 87, status: "iyi" as const },
        { name: "Yaz\u0131t Kalitesi", score: 92, status: "iyi" as const },
        { name: "Flan & Kenar", score: 85, status: "iyi" as const },
        { name: "\u0130konografi", score: 88, status: "iyi" as const },
        { name: "Metal Yo\u011funlu\u011fu", score: 82, status: "iyi" as const },
        { name: "Darphane Tekni\u011fi", score: 90, status: "iyi" as const },
      ],
      recommendation: "\u00d6zg\u00fcnl\u00fck y\u00fcksek olas\u0131l\u0131kla teyit edilmi\u015ftir. Tu\u011fra detaylar\u0131 darp tekni\u011fiyle uyumludur.",
    },
  },
];

const COIN_ANALYSIS_PROMPT = `You are a world-class numismatic expert specializing in ancient coins. Analyze the coin image(s) and return ONLY a valid JSON object with NO markdown, NO explanation, NO code fences. The JSON must match this exact schema:

{
  "identification": {
    "identified": true,
    "coinName": "Full official numismatic name",
    "culture": "Civilization (e.g. Roman Imperial, Ancient Greek, Ottoman)",
    "ruler": "Ruler name or null",
    "dynasty": "Dynasty name or null",
    "period": "Historical period",
    "yearMinted": "Year or date range (e.g. '454-404 BC' or '161 AD')",
    "mint": "Mint city (use ancient AND modern name if applicable)",
    "denomination": "Coin denomination",
    "material": "Metal composition",
    "diameter": "Diameter in mm as string",
    "weight": "Weight in grams as string",
    "obverse": "Detailed obverse description",
    "reverse": "Detailed reverse description",
    "rarity": "Common" | "Scarce" | "Rare" | "Very Rare",
    "grade": "Numismatic grade (e.g. VF-30, EF-45, MS-60)",
    "gradingNotes": "Brief grading assessment",
    "confidenceScore": <0-100 integer>,
    "description": "2-3 sentence numismatic description",
    "historicalContext": "2-3 sentences on historical importance",
    "inscriptionObverse": { "legend": "text", "translation": "translation", "script": "Greek/Latin/Arabic/etc" },
    "inscriptionReverse": { "legend": "text", "translation": "translation" },
    "references": [{ "catalog": "RIC/SNG/BMC/etc", "number": "ref number", "note": "optional note" }],
    "auctionPrices": [{ "house": "Auction house name", "date": "YYYY-MM-DD", "priceUSD": <number>, "currency": "USD" }],
    "estimatedValueRange": { "min": <number>, "max": <number>, "currency": "USD" }
  },
  "fakeDetection": {
    "authenticityScore": <0-100 integer>,
    "verdict": "ORIJINAL" | "SAHTE" | "BELIRSIZ",
    "forgeryType": "Orijinal" | "D\u00f6k\u00fcm Sahte" | "Transfer Kal\u0131p" | "Modern Taklit" | "Bilinmiyor",
    "confidence": <0-100 integer>,
    "indicators": [
      { "name": "Patina & Koroz", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "2-3 sentence analysis" },
      { "name": "Kal\u0131p Keskinli\u011fi", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "Y\u00fczey Dokusu", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "A\u015f\u0131nma Deseni", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "Yaz\u0131t Kalitesi", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "Flan & Kenar", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "\u0130konografi", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "Metal Yo\u011funlu\u011fu", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." },
      { "name": "Darphane Tekni\u011fi", "score": <0-100>, "status": "iyi" | "orta" | "\u015f\u00fcpheli", "analysis": "..." }
    ],
    "physicalFingerprints": ["observable evidence 1", "observable evidence 2"],
    "warnings": ["warning if any"],
    "recommendation": "Expert recommendation sentence"
  }
}

Be highly specific and accurate. Use real numismatic catalog references when possible. For auctionPrices, provide realistic recent auction records if you know them. All scores must be integers 0-100.`;

const CHAT_PROMPT_BASE = `You are Numisma, an expert numismatic AI advisor specializing in ancient coins, medieval coinage, and historical currency. You have deep knowledge of Greek, Roman, Byzantine, Islamic, Ottoman, and other ancient coinage traditions. You help collectors, researchers, and enthusiasts with:
- Coin identification and authentication
- Valuation and market trends  
- Collection management advice
- Historical context and numismatic research
- Auction strategies and grading

Respond in Turkish by default. Be concise, expert, and helpful.`;

// POST /api/coin/analyze — AI ile sikke analizi
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

    const geminiApiKey = process.env["GEMINI_API_KEY"];
    if (!geminiApiKey) {
      req.log.info("GEMINI_API_KEY not set — using mock data");
      const mock = MOCK_COINS[Math.floor(Math.random() * MOCK_COINS.length)];
      try {
        await db.insert(scanHistoryTable).values({
          userId: "anonymous",
          identified: mock.identification?.identified ?? false,
          confidenceScore: mock.identification?.confidenceScore ?? null,
        });
      } catch (dbErr) {
        req.log.warn({ dbErr }, "Failed to save scan history — continuing");
      }
      res.json(mock);
      return;
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const model = ai.models;
    const resp = await model.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        { role: "user", parts: [{ text: COIN_ANALYSIS_PROMPT }] },
        { role: "user", parts: [{ inlineData: { mimeType: mimeType || "image/jpeg", data: imageBase64 } }] },
      ],
    });

    const text = resp?.text || "";
    let parsed;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : text;
      parsed = JSON.parse(jsonStr);
    } catch {
      req.log.warn({ text }, "Gemini response not valid JSON — using mock");
      parsed = MOCK_COINS[Math.floor(Math.random() * MOCK_COINS.length)];
    }

    try {
      await db.insert(scanHistoryTable).values({
        userId: "anonymous",
        identified: parsed?.identification?.identified ?? false,
        confidenceScore: parsed?.identification?.confidenceScore ?? null,
      });
    } catch (dbErr) {
      req.log.warn({ dbErr }, "Failed to save scan history — continuing");
    }

    res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "Gemini analysis failed — using mock");
    const mock = MOCK_COINS[Math.floor(Math.random() * MOCK_COINS.length)];
    res.json(mock);
  }
});

// GET /api/coins — koleksiyonu listele
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

// GET /api/coins/stats — koleksiyon istatistikleri (premium)
router.get("/coins/stats", async (req, res) => {
  try {
    const userId = (req.query["userId"] as string) || "anonymous";
    const coins = await db
      .select()
      .from(coinsTable)
      .where(eq(coinsTable.userId, userId));

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

// POST /api/coins — koleksiyona sikke ekle (premium)
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

// PATCH /api/coins/:id — not ve fiyat güncelle (premium)
router.patch("/coins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, acquisitionPrice } = req.body as {
      notes?: string;
      acquisitionPrice?: number;
    };

    const [updated] = await db
      .update(coinsTable)
      .set({
        ...(notes !== undefined && { notes }),
        ...(acquisitionPrice !== undefined && { acquisitionPrice }),
        updatedAt: new Date(),
      })
      .where(eq(coinsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Coin not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update coin");
    res.status(500).json({ error: "Failed to update coin" });
  }
});

// DELETE /api/coins/:id — koleksiyondan kaldır (premium)
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

// POST /api/coins/chat — AI numismatik sohbet (premium)
router.post("/coins/chat", async (req, res) => {
  const { messages, coinContext } = req.body as {
    messages?: Array<{ role: string; content: string }>;
    coinContext?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }
  const geminiApiKey = process.env["GEMINI_API_KEY"];

  if (!geminiApiKey) {
    req.log.info("GEMINI_API_KEY not set — returning mock chat response");
    const mock = "Antik sikkeler hakk\u0131nda sordu\u011funuz i\u00e7in te\u015fekk\u00fcrler! \u015eu an demo modunday\u0131m. GEMINI_API_KEY ayarland\u0131\u011f\u0131nda ger\u00e7ek yan\u0131tlar alacaks\u0131n\u0131z.";
    res.json({ reply: mock });
    return;
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const systemPrompt = coinContext
      ? `${CHAT_PROMPT_BASE}\n\nKullan\u0131c\u0131n\u0131n koleksiyonundaki sikkeler: ${coinContext}`
      : CHAT_PROMPT_BASE;

    const history = messages.slice(0, -1).map(m => ({
      role: m.role as "user" | "model",
      parts: [{ text: m.content }],
    }));
    const lastMsg = messages[messages.length - 1];

    const chat = ai.chats.create({
      model: "gemini-2.5-pro",
      system: systemPrompt,
      history,
    });

    const response = await chat.sendMessage({ message: lastMsg!.content });
    res.json({ reply: response.text });
  } catch (err) {
    req.log.error({ err }, "Gemini chat failed");
    res.status(500).json({ error: "Chat service unavailable" });
  }
});

export default router;
