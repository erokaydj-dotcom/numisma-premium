import type { CoinAnalysis } from "./types";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export async function analyzeCoin(imageBase64: string): Promise<CoinAnalysis> {
  const res = await fetch(`${BASE}/api/coin/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageBase64, mimeType: "image/jpeg" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<CoinAnalysis>;
}

export async function sendChat(messages: Array<{ role: string; content: string }>, coinContext?: string): Promise<string> {
  const res = await fetch(`${BASE}/api/coins/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, coinContext }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json() as { reply: string };
  return data.reply;
}
