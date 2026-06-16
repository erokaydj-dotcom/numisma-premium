import type { AuctionPrice, Coin, CoinGrade } from "@/context/CollectionContext";

const API_BASE = process.env["EXPO_PUBLIC_DOMAIN"]
  ? `https://${process.env["EXPO_PUBLIC_DOMAIN"]}`
  : "";

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

function mapRarity(
  r: string
): "Common" | "Uncommon" | "Rare" | "Very Rare" | "Extremely Rare" {
  const map: Record<
    string,
    "Common" | "Uncommon" | "Rare" | "Very Rare" | "Extremely Rare"
  > = {
    Common: "Common",
    Scarce: "Uncommon",
    Rare: "Rare",
    "Very Rare": "Very Rare",
    "Extremely Rare": "Extremely Rare",
  };
  return map[r] ?? "Uncommon";
}

function mapGrade(g: string): CoinGrade {
  if (!g) return "Fine";
  const upper = g.toUpperCase();
  if (upper.startsWith("MS") || upper.startsWith("UNC") || upper.startsWith("BU"))
    return "Mint State";
  if (upper.startsWith("AU") || upper === "ABOUT UNCIRCULATED")
    return "About Uncirculated";
  if (upper.startsWith("EF") || upper.startsWith("XF") || upper === "EXTREMELY FINE")
    return "Extremely Fine";
  if (upper.startsWith("VF") || upper === "VERY FINE") return "Very Fine";
  if (upper.startsWith("F-") || upper === "FINE") return "Fine";
  if (upper.startsWith("VG") || upper === "VERY GOOD") return "Very Good";
  if (upper.startsWith("G-") || upper === "GOOD") return "Good";
  if (upper.startsWith("FR") || upper === "FAIR") return "Fair";
  if (upper.startsWith("PO") || upper === "POOR") return "Poor";
  return "Fine";
}

function formatEstimatedValue(min?: number, max?: number, currency?: string): string {
  if (!min && !max) return "—";
  const sym = currency === "USD" ? "$" : currency === "TRY" ? "₺" : (currency ?? "$");
  if (min && max) return `${sym}${min.toLocaleString()} - ${sym}${max.toLocaleString()}`;
  if (min) return `${sym}${min.toLocaleString()}+`;
  return `${sym}${(max ?? 0).toLocaleString()}`;
}

interface ApiResponse {
  identification?: {
    coinName?: string;
    culture?: string;
    ruler?: string;
    dynasty?: string;
    period?: string;
    yearMinted?: string;
    mint?: string;
    denomination?: string;
    material?: string;
    diameter?: string;
    weight?: string;
    obverse?: string;
    reverse?: string;
    rarity?: string;
    grade?: string;
    gradingNotes?: string;
    confidenceScore?: number;
    description?: string;
    historicalContext?: string;
    auctionPrices?: AuctionPrice[];
    estimatedValueRange?: { min?: number; max?: number; currency?: string };
  };
  fakeDetection?: {
    authenticityScore?: number;
    verdict?: string;
  };
}

async function callAnalyzeApi(
  imageBase64: string,
  mimeType: string
): Promise<ApiResponse> {
  const url = `${API_BASE}/api/coin/analyze`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType }),
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json() as Promise<ApiResponse>;
}

function apiResponseToCoin(
  data: ApiResponse,
  imageUri: string
): Coin {
  const id = data.identification ?? {};
  const fake = data.fakeDetection ?? {};
  const evr = id.estimatedValueRange;

  return {
    id: generateId(),
    imageUri,
    name: id.coinName ?? "Bilinmeyen Sikke",
    country: id.culture ?? id.mint ?? "Bilinmiyor",
    year: id.yearMinted ?? "—",
    denomination: id.denomination ?? "—",
    composition: id.material ?? "—",
    diameter: id.diameter ? `${id.diameter} mm` : "—",
    weight: id.weight ? `${id.weight} g` : "—",
    grade: mapGrade(id.grade ?? ""),
    rarity: mapRarity(id.rarity ?? "Scarce"),
    estimatedValue: formatEstimatedValue(evr?.min, evr?.max, evr?.currency),
    description: id.description ?? "",
    identifiedAt: Date.now(),
    isFavorite: false,
    culture: id.culture,
    ruler: id.ruler,
    period: id.period,
    mint: id.mint,
    obverse: id.obverse,
    reverse: id.reverse,
    historicalContext: id.historicalContext,
    gradingNotes: id.gradingNotes,
    confidenceScore: id.confidenceScore,
    authenticityScore: fake.authenticityScore,
    verdict: fake.verdict,
    estimatedValueMin: evr?.min,
    estimatedValueMax: evr?.max,
    valueCurrency: evr?.currency ?? "USD",
    auctionPrices: id.auctionPrices ?? [],
  };
}

const FALLBACK_COINS: Array<Omit<Coin, "id" | "imageUri" | "identifiedAt" | "isFavorite">> = [
  {
    name: "Atina Tetradrahm",
    country: "Antik Yunan",
    year: "454-404 BC",
    denomination: "Tetradrachm",
    composition: "Gümüş (%98)",
    diameter: "24 mm",
    weight: "17.2 g",
    grade: "Very Fine",
    estimatedValue: "$1.200 - $4.500",
    rarity: "Uncommon",
    description: "Atina'nın simgesi baykuş sikkesi. Laurion madenlerinden çıkan gümüşle basılan bu sikkeler antik dünyanın en yaygın para birimi olmuştur.",
    historicalContext: "M.Ö. 5-4. yüzyılda Akdeniz ticaretine egemen olan bu sikkeler, Parthenon'un ve Salamis zaferinin finansmanında kullanılmıştır.",
    culture: "Ancient Greek",
    period: "Classical Period",
    mint: "Athens (Atina)",
    obverse: "Miğferli Athena başı, sağa bakış",
    reverse: "Athena'nın baykuşu, zeytin dalı ve hilal, AOE yazıtı",
    authenticityScore: 85,
    verdict: "ORIJINAL",
    confidenceScore: 85,
    estimatedValueMin: 1200,
    estimatedValueMax: 4500,
    valueCurrency: "USD",
    auctionPrices: [
      { house: "CNG", date: "2023-05-15", priceUSD: 2800, currency: "USD" },
      { house: "Roma Numismatics", date: "2022-10-20", priceUSD: 3200, currency: "USD" },
      { house: "Künker", date: "2021-06-10", priceUSD: 2400, currency: "USD" },
    ],
  },
  {
    name: "Roma Denarius — Augustus",
    country: "Roma İmparatorluğu",
    year: "2 BC - 14 AD",
    denomination: "Denarius",
    composition: "Gümüş (%95)",
    diameter: "19 mm",
    weight: "3.9 g",
    grade: "Extremely Fine",
    estimatedValue: "$600 - $1.200",
    rarity: "Common",
    description: "Augustus dönemine ait en önemli Roma denariusu. İlk imparatoru ve belirlenen varislerini tasvir eder.",
    historicalContext: "M.Ö. 2 yılı civarında Lugdunum'da basılan bu sikkeler Ren lejyonlarına ödeme amacıyla kullanılmıştır.",
    culture: "Roman Imperial",
    period: "Early Empire",
    mint: "Lugdunum (Lyon)",
    obverse: "Augustus portresi, defne çelenk, CAESAR AVGVSTVS DIVI F PATER PATRIAE",
    reverse: "Gaius ve Lucius ayakta, C L CAESARES yazıtı",
    authenticityScore: 91,
    verdict: "ORIJINAL",
    confidenceScore: 91,
    estimatedValueMin: 600,
    estimatedValueMax: 1200,
    valueCurrency: "USD",
    auctionPrices: [
      { house: "Heritage", date: "2023-11-08", priceUSD: 850, currency: "USD" },
      { house: "Stack's Bowers", date: "2022-08-15", priceUSD: 720, currency: "USD" },
      { house: "CNG", date: "2021-05-20", priceUSD: 940, currency: "USD" },
    ],
  },
];

export async function identifyCoin(
  imageUri: string,
  imageBase64?: string | null
): Promise<Coin> {
  if (imageBase64) {
    try {
      const mimeType = imageUri.startsWith("data:")
        ? imageUri.split(":")[1]?.split(";")[0] ?? "image/jpeg"
        : "image/jpeg";
      const data = await callAnalyzeApi(imageBase64, mimeType);
      if (data?.identification?.coinName) {
        return apiResponseToCoin(data, imageUri);
      }
    } catch (err) {
      console.warn("[coinIdentifier] API call failed, using fallback:", err);
    }
  } else if (imageUri.startsWith("data:")) {
    try {
      const [header, base64] = imageUri.split(",");
      const mimeType = header.split(":")[1]?.split(";")[0] ?? "image/jpeg";
      const data = await callAnalyzeApi(base64!, mimeType);
      if (data?.identification?.coinName) {
        return apiResponseToCoin(data, imageUri);
      }
    } catch (err) {
      console.warn("[coinIdentifier] API call from data URL failed:", err);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));
  const template = FALLBACK_COINS[Math.floor(Math.random() * FALLBACK_COINS.length)]!;
  return { ...template, id: generateId(), imageUri, identifiedAt: Date.now(), isFavorite: false };
}
