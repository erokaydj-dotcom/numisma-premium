# Numisma Premium

Antik sikkeleri AI ile analiz eden, sahte tespiti yapan ve koleksiyon yöneten premium numismatik uygulama.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API sunucusunu başlat (port 5000)
- `pnpm run typecheck` — tüm paketleri typecheck et
- `pnpm run build` — typecheck + build
- `pnpm --filter @workspace/api-spec run codegen` — OpenAPI spec'ten hook ve Zod şemalarını yeniden üret
- `pnpm --filter @workspace/db run push` — DB şemasını uygula (dev only)
- Required env: `DATABASE_URL` — Postgres bağlantı stringi

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (Railway & Replit uyumlu)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (OpenAPI spec'ten)
- Build: esbuild (CJS bundle)
- AI: Google Gemini 2.5 Flash (sikke analizi + sohbet)
- Payments: RevenueCat V2 API (premium abonelik)

## Where things live

- **DB Schema**: `lib/db/src/schema/coins.ts` — coins, chat_messages, scan_history tabloları
- **API Spec**: `lib/api-spec/openapi.yaml` — tüm endpoint tanımları
- **API Routes**: `artifacts/api-server/src/routes/` — coin.ts, revenuecat.ts, health.ts
- **Zod Schemas**: `lib/api-zod/src/generated/api.ts`
- **React Hooks**: `lib/api-client-react/src/generated/api.ts`

## Architecture decisions

- RevenueCat V2 API kullanılıyor (V1 ile uyumsuz yeni secret key formatı)
- RevenueCat offerings fiyatları sunucu tarafında hardcode edilmiş (REST API fiyat döndürmüyor, SDK özelliği)
- DB bağlantısı hem `RAILWAY_DATABASE_URL` hem `DATABASE_URL`'yi destekliyor
- Gemini API key yoksa mock coin verisi döndürülüyor (graceful fallback)
- RevenueCat key yoksa simülasyon modu aktif

## Product

- Sikke fotoğrafından AI analizi (kültür, dönem, değer, özgünlük skoru)
- Sahte sikke tespiti (9 farklı gösterge)
- Koleksiyon yönetimi (premium)
- AI numismatik sohbet (premium)
- Koleksiyon istatistikleri ve ROI hesaplama (premium)
- RevenueCat abonelik sistemi: ₺400/ay, ₺1.000/3ay, ₺1.500/6ay, ₺2.500/yıl

## User preferences

- Türkçe arayüz ve yanıtlar
- Railway'de deploy edilecek
- RevenueCat V2 API key kullanılıyor (sk_ ile başlar)
- Fiyatlar TL cinsinden

## Gotchas

- RevenueCat V2 secret key, V1 endpoint'leriyle çalışmaz — her zaman `/v2/projects/{id}/...` kullan
- `REVENUECAT_PROJECT_ID` env var'ı gerekli (şu an: `e53eb2f8`)
- Railway'de SSL gerekiyor: `ssl: { rejectUnauthorized: false }`
- Offerings endpoint RevenueCat'ten fiyat almıyor — fiyatlar `PRICE_MAP`'te tanımlı

## Pointers

- `pnpm-workspace` skill'i için workspace yapısı, TypeScript kurulumu ve paket detayları
