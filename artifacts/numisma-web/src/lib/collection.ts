import type { CollectionEntry, CoinAnalysis, ValueSnapshot } from "./types";

const STORAGE_KEY = "numisma_web_collection_v1";

export function loadCollection(): CollectionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CollectionEntry[];
  } catch {
    return [];
  }
}

export function saveCollection(entries: CollectionEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // quota exceeded
  }
}

export function addEntry(entries: CollectionEntry[], analysis: CoinAnalysis, imageUri?: string): CollectionEntry[] {
  const r = analysis.identification.estimatedValueRange;
  const snap: ValueSnapshot | null = r && (r.min || r.max) ? {
    date: new Date().toISOString(),
    minUSD: r.min || 0,
    maxUSD: r.max || 0,
    midUSD: ((r.min || 0) + (r.max || 0)) / 2,
    label: "İlk Analiz",
  } : null;

  const entry: CollectionEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ts: new Date().toLocaleString("tr-TR"),
    imageUri: imageUri || null,
    analysis,
    inCollection: true,
    valueHistory: snap ? [snap] : [],
  };

  return [entry, ...entries].slice(0, 100);
}

export function updateEntry(entries: CollectionEntry[], id: string, patch: Partial<CollectionEntry>): CollectionEntry[] {
  return entries.map(e => e.id === id ? { ...e, ...patch } : e);
}

export function removeEntry(entries: CollectionEntry[], id: string): CollectionEntry[] {
  return entries.filter(e => e.id !== id);
}

export function fmtNumber(n: number | undefined | null): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

export function coinTitle(id?: CoinAnalysis["identification"] | null): string {
  return id?.coinName?.trim() || "Bilinmeyen Sikke";
}

export function safeStr(v: string | null | undefined): string {
  return v && v.trim().length > 0 ? v : "—";
}

export function rarityColor(rarity?: string | null): string {
  const v = (rarity || "").toLowerCase();
  if (v.includes("very")) return "#A060E0";
  if (v.includes("rare")) return "#E05050";
  if (v.includes("scarce")) return "#C4A040";
  return "#999999";
}

export function verdictColor(verdict?: string): string {
  if (verdict === "ORIJINAL") return "#27AE60";
  if (verdict === "SAHTE") return "#C0392B";
  return "#E67E22";
}
