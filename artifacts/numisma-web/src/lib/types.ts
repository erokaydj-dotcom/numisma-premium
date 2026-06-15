export interface AuctionPrice {
  house: string;
  date: string;
  priceUSD: number;
  currency: string;
}

export interface EstimatedValueRange {
  min: number;
  max: number;
  currency: string;
}

export interface CoinInscription {
  legend: string;
  translation?: string;
  script?: string;
}

export interface CatalogReference {
  catalog: string;
  number: string;
  note?: string;
}

export interface FakeIndicator {
  name: string;
  score: number;
  status: "iyi" | "orta" | "şüpheli";
  analysis?: string;
}

export interface FakeDetection {
  authenticityScore: number;
  verdict: "ORIJINAL" | "SAHTE" | "BELIRSIZ";
  forgeryType?: string;
  confidence: number;
  indicators: FakeIndicator[];
  physicalFingerprints?: string[];
  warnings?: string[];
  recommendation?: string;
}

export interface CoinIdentification {
  identified: boolean;
  coinName: string;
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
  rarity?: "Common" | "Scarce" | "Rare" | "Very Rare";
  grade?: string;
  gradingNotes?: string;
  confidenceScore: number;
  description?: string;
  historicalContext?: string;
  inscriptionObverse?: CoinInscription;
  inscriptionReverse?: CoinInscription;
  references?: CatalogReference[];
  auctionPrices?: AuctionPrice[];
  estimatedValueRange?: EstimatedValueRange;
}

export interface CoinAnalysis {
  identification: CoinIdentification;
  fakeDetection: FakeDetection;
}

export interface CollectionEntry {
  id: string;
  ts: string;
  imageUri?: string | null;
  analysis: CoinAnalysis;
  inCollection?: boolean;
  acquiredAt?: string;
  acquisitionPriceUSD?: number;
  notes?: string;
  valueHistory?: ValueSnapshot[];
}

export interface ValueSnapshot {
  date: string;
  midUSD: number;
  minUSD: number;
  maxUSD: number;
  label?: string;
}

export type TabId = "scan" | "collection" | "timeline" | "map" | "auction" | "chat" | "premium" | "about";
