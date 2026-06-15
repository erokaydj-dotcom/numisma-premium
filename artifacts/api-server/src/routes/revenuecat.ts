import { Router, type IRouter } from "express";
import {
  GetSubscriptionStatusBody,
  GetSubscriptionStatusResponse,
  GetOfferingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Kullanıcının RevenueCat'teki paket fiyatları (TL)
const PRICE_MAP: Record<string, { price: string; period: string; description: string }> = {
  "$rc_monthly": {
    price: "₺400,00",
    period: "Aylık",
    description: "İstediğin zaman iptal et",
  },
  "$rc_three_month": {
    price: "₺1.000,00",
    period: "3 Aylık",
    description: "Aylık yalnızca ₺333 — 3 ay kesintisiz erişim",
  },
  "$rc_six_month": {
    price: "₺1.500,00",
    period: "6 Aylık",
    description: "Aylık yalnızca ₺250 — 6 ay tam erişim",
  },
  "$rc_annual": {
    price: "₺2.500,00",
    period: "Yıllık",
    description: "Aylık yalnızca ₺208 — En iyi değer",
  },
};

// RevenueCat'te tanımlı paket yoksa fallback listesi
const FALLBACK_PACKAGES = [
  {
    identifier: "$rc_monthly",
    price: "₺400,00",
    period: "Aylık",
    description: "İstediğin zaman iptal et",
  },
  {
    identifier: "$rc_three_month",
    price: "₺1.000,00",
    period: "3 Aylık",
    description: "Aylık yalnızca ₺333 — 3 ay kesintisiz erişim",
  },
  {
    identifier: "$rc_six_month",
    price: "₺1.500,00",
    period: "6 Aylık",
    description: "Aylık yalnızca ₺250 — 6 ay tam erişim",
  },
  {
    identifier: "$rc_annual",
    price: "₺2.500,00",
    period: "Yıllık",
    description: "Aylık yalnızca ₺208 — En iyi değer",
  },
];

// POST /api/revenuecat/status — kullanıcı premium mi kontrol et (V2 API)
router.post("/revenuecat/status", async (req, res) => {
  const parseResult = GetSubscriptionStatusBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { userId } = parseResult.data;
  const apiKey = process.env["REVENUECAT_API_KEY"];
  const projectId = process.env["REVENUECAT_PROJECT_ID"];

  if (!apiKey || !projectId) {
    req.log.info("REVENUECAT_API_KEY or REVENUECAT_PROJECT_ID not set — returning simulation mode");
    const data = GetSubscriptionStatusResponse.parse({
      isPremium: false,
      userId,
      expiresAt: null,
      simulationMode: true,
    });
    res.json(data);
    return;
  }

  try {
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/customers/${encodeURIComponent(userId)}/active_entitlements`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Kullanıcı RevenueCat'te yoksa premium değil demektir
    if (response.status === 404) {
      const data = GetSubscriptionStatusResponse.parse({
        isPremium: false,
        userId,
        expiresAt: null,
        simulationMode: false,
      });
      res.json(data);
      return;
    }

    if (!response.ok) {
      throw new Error(`RevenueCat V2 API returned ${response.status}`);
    }

    const body = await response.json() as {
      items?: Array<{
        entitlement_id?: string;
        entitlement_identifier?: string;
        expires_at?: string | null;
      }>;
    };

    const items = body.items ?? [];
    const premiumEntry = items.find(
      (e) =>
        e.entitlement_identifier === "premium" ||
        e.entitlement_id === "premium"
    );
    const isPremium = items.length > 0;
    const expiresAt = premiumEntry?.expires_at ?? null;

    const data = GetSubscriptionStatusResponse.parse({
      isPremium,
      userId,
      expiresAt,
      simulationMode: false,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "RevenueCat status check failed");
    const data = GetSubscriptionStatusResponse.parse({
      isPremium: false,
      userId,
      expiresAt: null,
      simulationMode: true,
    });
    res.json(data);
  }
});

// GET /api/revenuecat/offerings — abonelik paketlerini çek (V2 API ile bağlantı doğrula)
router.get("/revenuecat/offerings", async (req, res) => {
  const apiKey = process.env["REVENUECAT_API_KEY"];
  const projectId = process.env["REVENUECAT_PROJECT_ID"];

  if (!apiKey || !projectId) {
    req.log.info("REVENUECAT keys not set — returning fallback packages");
    const data = GetOfferingsResponse.parse({
      packages: FALLBACK_PACKAGES,
      connected: false,
    });
    res.json(data);
    return;
  }

  try {
    // V2 API ile offerings listesi — paket identifier'larını al
    const response = await fetch(
      `https://api.revenuecat.com/v2/projects/${projectId}/offerings`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Bağlantı sağlıklı ama offerings çekilemedi — fallback fiyatlarla connected:true dön
      req.log.warn({ status: response.status }, "RevenueCat offerings API error — using price map");
      const data = GetOfferingsResponse.parse({
        packages: FALLBACK_PACKAGES,
        connected: true,
      });
      res.json(data);
      return;
    }

    const body = await response.json() as {
      items?: Array<{
        lookup_key?: string;
        is_current?: boolean;
        packages?: Array<{
          lookup_key?: string;
          product_identifier?: string;
        }>;
      }>;
    };

    const items = body.items ?? [];
    const currentOffering =
      items.find((o) => o.is_current) ?? items[0];

    let packages: typeof FALLBACK_PACKAGES = [];

    if (currentOffering?.packages && currentOffering.packages.length > 0) {
      packages = currentOffering.packages
        .filter((p) => p.lookup_key && PRICE_MAP[p.lookup_key])
        .map((p) => ({
          identifier: p.lookup_key!,
          ...PRICE_MAP[p.lookup_key!]!,
        }));
    }

    // RevenueCat'teki paketler fiyat tablosuyla eşleşmiyorsa fallback kullan
    if (packages.length === 0) {
      packages = FALLBACK_PACKAGES;
    }

    const data = GetOfferingsResponse.parse({
      packages,
      connected: true,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "RevenueCat offerings fetch failed");
    const data = GetOfferingsResponse.parse({
      packages: FALLBACK_PACKAGES,
      connected: false,
    });
    res.json(data);
  }
});

export default router;
