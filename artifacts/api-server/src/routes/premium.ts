import { Router, type IRouter } from "express";
import { db, premiumCodesTable, userPremiumTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";

const router: IRouter = Router();

const RedeemBody = z.object({
  userId: z.string().min(1),
  code: z.string().min(1).toUpperCase(),
});

const CheckBody = z.object({
  userId: z.string().min(1),
});

// POST /api/premium/redeem — kodu kullan, kullanıcıyı premium yap
router.post("/premium/redeem", async (req, res) => {
  const parsed = RedeemBody.safeParse({
    ...req.body,
    code: (req.body.code ?? "").toString().toUpperCase().trim(),
  });

  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Geçersiz istek" });
    return;
  }

  const { userId, code } = parsed.data;

  try {
    const [found] = await db
      .select()
      .from(premiumCodesTable)
      .where(eq(premiumCodesTable.code, code))
      .limit(1);

    if (!found) {
      res.status(404).json({ success: false, error: "Kod bulunamadı" });
      return;
    }

    if (found.isUsed) {
      res.status(409).json({ success: false, error: "Bu kod daha önce kullanılmış" });
      return;
    }

    // Kodu kullanıldı olarak işaretle
    await db
      .update(premiumCodesTable)
      .set({ isUsed: true, usedBy: userId, usedAt: new Date() })
      .where(eq(premiumCodesTable.code, code));

    // Kullanıcının premium bitiş tarihini hesapla
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + found.durationDays);

    // Mevcut premium kaydı var mı kontrol et
    const [existing] = await db
      .select()
      .from(userPremiumTable)
      .where(eq(userPremiumTable.userId, userId))
      .limit(1);

    if (existing) {
      // Süreyi uzat (mevcut bitiş tarihinin üzerine ekle)
      const base = existing.expiresAt > new Date() ? existing.expiresAt : new Date();
      const newExpiry = new Date(base);
      newExpiry.setDate(newExpiry.getDate() + found.durationDays);

      await db
        .update(userPremiumTable)
        .set({ isPremium: true, expiresAt: newExpiry, updatedAt: new Date() })
        .where(eq(userPremiumTable.userId, userId));

      res.json({
        success: true,
        isPremium: true,
        expiresAt: newExpiry.toISOString(),
        durationDays: found.durationDays,
        message: `Premium ${found.durationDays} gün uzatıldı`,
      });
    } else {
      await db.insert(userPremiumTable).values({
        userId,
        isPremium: true,
        expiresAt,
        redeemedCode: code,
      });

      res.json({
        success: true,
        isPremium: true,
        expiresAt: expiresAt.toISOString(),
        durationDays: found.durationDays,
        message: `Premium ${found.durationDays} gün aktif edildi`,
      });
    }
  } catch (err) {
    req.log.error({ err }, "Premium redeem failed");
    res.status(500).json({ success: false, error: "Sunucu hatası" });
  }
});

// POST /api/premium/check — kullanıcı premium mu?
router.post("/premium/check", async (req, res) => {
  const parsed = CheckBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ isPremium: false, error: "Geçersiz istek" });
    return;
  }

  const { userId } = parsed.data;

  try {
    const [record] = await db
      .select()
      .from(userPremiumTable)
      .where(
        and(
          eq(userPremiumTable.userId, userId),
          eq(userPremiumTable.isPremium, true),
          gt(userPremiumTable.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!record) {
      res.json({ isPremium: false, expiresAt: null });
      return;
    }

    res.json({
      isPremium: true,
      expiresAt: record.expiresAt.toISOString(),
      daysLeft: Math.ceil(
        (record.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      ),
    });
  } catch (err) {
    req.log.error({ err }, "Premium check failed");
    res.status(500).json({ isPremium: false, error: "Sunucu hatası" });
  }
});

// GET /api/premium/validate/:code — kodu doğrula (kullanmadan önce)
router.get("/premium/validate/:code", async (req, res) => {
  const code = (req.params["code"] ?? "").toUpperCase().trim();
  if (!code) {
    res.status(400).json({ valid: false, error: "Kod eksik" });
    return;
  }

  try {
    const [found] = await db
      .select()
      .from(premiumCodesTable)
      .where(eq(premiumCodesTable.code, code))
      .limit(1);

    if (!found) {
      res.json({ valid: false, error: "Kod bulunamadı" });
      return;
    }

    if (found.isUsed) {
      res.json({ valid: false, error: "Bu kod kullanılmış", usedBy: found.usedBy });
      return;
    }

    res.json({
      valid: true,
      durationDays: found.durationDays,
      message: `${found.durationDays} günlük premium aktivasyonu`,
    });
  } catch (err) {
    req.log.error({ err }, "Premium validate failed");
    res.status(500).json({ valid: false, error: "Sunucu hatası" });
  }
});

export default router;
