import { useMemo, useState } from "react";
import { coinTitle, fmtNumber } from "@/lib/collection";
import type { CollectionEntry } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";

interface Props {
  collection: CollectionEntry[];
}

type AuctionEntry = {
  house: string;
  date: string;
  priceUSD: number;
  currency: string;
  coinName: string;
  coinId: string;
};

function parseDateSort(d: string) {
  const m = d.match(/(\d{4})/);
  return m ? parseInt(m[1]) : 0;
}

export default function AuctionPage({ collection }: Props) {
  const [sortBy, setSortBy] = useState<"price" | "date" | "house">("price");
  const [houseFilter, setHouseFilter] = useState<string | null>(null);

  const allAuctions = useMemo<AuctionEntry[]>(() => {
    const result: AuctionEntry[] = [];
    for (const e of collection.filter(c => c.inCollection)) {
      const prices = e.analysis.identification.auctionPrices;
      if (!prices) continue;
      for (const p of prices) {
        result.push({
          house: p.house || "Bilinmiyor",
          date: p.date || "",
          priceUSD: p.priceUSD || 0,
          currency: p.currency || "USD",
          coinName: coinTitle(e.analysis.identification),
          coinId: e.id,
        });
      }
    }
    return result;
  }, [collection]);

  const houses = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of allAuctions) map.set(a.house, (map.get(a.house) || 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [allAuctions]);

  const sorted = useMemo(() => {
    const filtered = houseFilter ? allAuctions.filter(a => a.house === houseFilter) : allAuctions;
    if (sortBy === "price") return [...filtered].sort((a, b) => b.priceUSD - a.priceUSD);
    if (sortBy === "date") return [...filtered].sort((a, b) => parseDateSort(b.date) - parseDateSort(a.date));
    return [...filtered].sort((a, b) => a.house.localeCompare(b.house));
  }, [allAuctions, sortBy, houseFilter]);

  const totalValue = sorted.reduce((s, a) => s + a.priceUSD, 0);
  const avgValue = sorted.length > 0 ? totalValue / sorted.length : 0;
  const maxEntry = sorted.length > 0 ? sorted.reduce((m, a) => a.priceUSD > m.priceUSD ? a : m, sorted[0]) : null;

  // Chart data: top 8 by price
  const chartData = [...allAuctions]
    .sort((a, b) => b.priceUSD - a.priceUSD)
    .slice(0, 8)
    .map(a => ({ name: a.house.slice(0, 10), value: a.priceUSD, coin: a.coinName }));

  if (allAuctions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full border border-[#3A3020] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <p className="font-cinzel text-[#C9A84C] tracking-wider">Müzayede Verisi Yok</p>
        <p className="font-mono text-xs text-[#8A7A55]">AI analizi ile taranan sikkelerin müzayede geçmişi burada görünür.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Summary */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-60" />
        <div className="p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-3">Müzayede Özeti</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <p className="font-cinzel text-2xl text-[#C9A84C]">{sorted.length}</p>
              <p className="font-mono text-xs text-[#8A7A55]">Satış</p>
            </div>
            <div className="text-center">
              <p className="font-cinzel text-2xl text-[#C9A84C]">${fmtNumber(avgValue)}</p>
              <p className="font-mono text-xs text-[#8A7A55]">Ort. Fiyat</p>
            </div>
            <div className="text-center">
              <p className="font-cinzel text-2xl text-[#C9A84C]">{houses.length}</p>
              <p className="font-mono text-xs text-[#8A7A55]">Müzayedeci</p>
            </div>
          </div>
          {maxEntry && (
            <div className="flex items-center gap-2 bg-[#252010] rounded-lg px-3 py-2">
              <svg className="w-3 h-3 text-[#C9A84C] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <p className="font-mono text-xs text-[#8A7A55]">
                Rekor: <span className="text-[#C9A84C]">${fmtNumber(maxEntry.priceUSD)}</span> · {maxEntry.coinName} · {maxEntry.house}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-4">En Yüksek Satışlar (USD)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ left: -10 }}>
              <XAxis dataKey="name" tick={{ fill: "#8A7A55", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8A7A55", fontSize: 10 }} tickFormatter={v => `$${fmtNumber(v)}`} />
              <Tooltip
                contentStyle={{ background: "#1E1A10", border: "1px solid #3A3020", borderRadius: 8, color: "#E8DDB5" }}
                formatter={(val: number) => [`$${fmtNumber(val)}`, "Fiyat"]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.coin || ""}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#C9A84C" : `rgba(201,168,76,${0.7 - i * 0.07})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* House Filter */}
      {houses.length > 1 && (
        <div>
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-2">Müzayedeci</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setHouseFilter(null)}
              className={`px-3 py-1 rounded-full border text-xs font-mono transition-colors ${!houseFilter ? "bg-[#252010] border-[#C9A84C] text-[#C9A84C]" : "bg-[#1E1A10] border-[#3A3020] text-[#8A7A55]"}`}
            >
              Tümü ({allAuctions.length})
            </button>
            {houses.map(([h, cnt]) => (
              <button
                key={h}
                onClick={() => setHouseFilter(houseFilter === h ? null : h)}
                className={`px-3 py-1 rounded-full border text-xs font-mono transition-colors ${houseFilter === h ? "bg-[#252010] border-[#C9A84C] text-[#C9A84C]" : "bg-[#1E1A10] border-[#3A3020] text-[#8A7A55]"}`}
              >
                {h} ({cnt})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-2">
        {(["price", "date", "house"] as const).map(s => {
          const labels = { price: "FIYAT", date: "TARİH", house: "HOUSE" };
          return (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`flex-1 py-2 rounded-lg text-xs font-cinzel tracking-widest border transition-colors ${sortBy === s ? "bg-[#C9A84C] text-[#0D0B07] border-[#C9A84C]" : "bg-[#1E1A10] text-[#8A7A55] border-[#3A3020]"}`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {sorted.map((a, i) => (
          <div key={`${a.coinId}-${i}`} className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-[#3A3020] flex items-center justify-center flex-shrink-0">
              <span className="font-cinzel text-xs text-[#C9A84C]">{i + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-cinzel text-sm text-[#E8DDB5] truncate">{a.coinName}</p>
              <p className="font-mono text-xs text-[#8A7A55] mt-0.5">{a.house} · {a.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-cinzel text-base text-[#C9A84C]">${fmtNumber(a.priceUSD)}</p>
              <p className="font-mono text-xs text-[#8A7A55]">{a.currency}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
