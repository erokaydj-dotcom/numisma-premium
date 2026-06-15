import { useState } from "react";
import { coinTitle, fmtNumber, rarityColor, verdictColor, saveCollection, updateEntry, removeEntry } from "@/lib/collection";
import type { CollectionEntry } from "@/lib/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  collection: CollectionEntry[];
  onCollectionChange: (c: CollectionEntry[]) => void;
}

export default function CollectionPage({ collection, onCollectionChange }: Props) {
  const [selected, setSelected] = useState<CollectionEntry | null>(null);
  const [tab, setTab] = useState<"list" | "analytics">("list");

  const inCol = collection.filter(e => e.inCollection);

  const totalValue = inCol.reduce((s, e) => {
    const r = e.analysis.identification.estimatedValueRange;
    if (!r) return s;
    return s + (r.min + r.max) / 2;
  }, 0);

  const totalCost = inCol.reduce((s, e) => s + (e.acquisitionPriceUSD || 0), 0);
  const roi = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : null;

  if (selected) {
    return <EntryDetail entry={selected} collection={collection} onCollectionChange={onCollectionChange} onBack={() => setSelected(null)} />;
  }

  if (inCol.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full border border-[#3A3020] flex items-center justify-center">
          <svg className="w-8 h-8 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="font-cinzel text-[#C9A84C] tracking-wider">Koleksiyon Boş</p>
        <p className="font-mono text-xs text-[#8A7A55]">Tarama sonrası "Koleksiyona Ekle" butonuna basarak sikke ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Summary Card */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-60" />
        <div className="p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-3">Koleksiyonum</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="font-cinzel text-2xl text-[#C9A84C]">{inCol.length}</p>
              <p className="font-mono text-xs text-[#8A7A55]">Sikke</p>
            </div>
            <div className="text-center">
              <p className="font-cinzel text-2xl text-[#C9A84C]">${fmtNumber(totalValue)}</p>
              <p className="font-mono text-xs text-[#8A7A55]">Toplam Değer</p>
            </div>
            <div className="text-center">
              <p className="font-cinzel text-2xl" style={{ color: roi !== null ? (roi >= 0 ? "#27AE60" : "#C0392B") : "#8A7A55" }}>
                {roi !== null ? `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%` : "—"}
              </p>
              <p className="font-mono text-xs text-[#8A7A55]">ROI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["list", "analytics"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg font-cinzel text-xs tracking-widest border transition-colors ${tab === t ? "bg-[#C9A84C] text-[#0D0B07] border-[#C9A84C]" : "bg-[#1E1A10] text-[#8A7A55] border-[#3A3020]"}`}
          >
            {t === "list" ? "LİSTE" : "ANALİTİK"}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="space-y-3">
          {inCol.map(entry => {
            const id = entry.analysis.identification;
            const fake = entry.analysis.fakeDetection;
            const r = id.estimatedValueRange;
            return (
              <button
                key={entry.id}
                onClick={() => setSelected(entry)}
                className="w-full bg-[#1E1A10] border border-[#3A3020] rounded-xl p-4 hover:border-[#C9A84C] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  {entry.imageUri ? (
                    <img src={entry.imageUri} alt="" className="w-14 h-14 rounded-lg object-cover border border-[#3A3020] flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg border border-[#3A3020] flex items-center justify-center flex-shrink-0 bg-[#16130C]">
                      <svg className="w-5 h-5 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-sm text-[#E8DDB5] truncate">{coinTitle(id)}</p>
                    <p className="font-mono text-xs text-[#8A7A55] mt-0.5">{id.culture || "—"} · {id.yearMinted || "—"}</p>
                    <div className="flex gap-2 mt-2">
                      {id.rarity && (
                        <span className="px-2 py-0.5 rounded-full border text-xs font-mono" style={{ color: rarityColor(id.rarity), borderColor: rarityColor(id.rarity) + "44" }}>
                          {id.rarity}
                        </span>
                      )}
                      {fake?.verdict && (
                        <span className="px-2 py-0.5 rounded-full border text-xs font-cinzel" style={{ color: verdictColor(fake.verdict), borderColor: verdictColor(fake.verdict) + "44" }}>
                          {fake.verdict}
                        </span>
                      )}
                    </div>
                  </div>
                  {r && (
                    <div className="text-right flex-shrink-0">
                      <p className="font-cinzel text-sm text-[#C9A84C]">${fmtNumber(r.min)}</p>
                      <p className="font-mono text-xs text-[#6A5A40]">—${fmtNumber(r.max)}</p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {tab === "analytics" && <AnalyticsView collection={inCol} />}
    </div>
  );
}

function AnalyticsView({ collection }: { collection: CollectionEntry[] }) {
  const rarityMap: Record<string, number> = {};
  const cultureMap: Record<string, number> = {};

  for (const e of collection) {
    const r = e.analysis.identification.rarity || "Common";
    rarityMap[r] = (rarityMap[r] || 0) + 1;
    const c = e.analysis.identification.culture || "Bilinmiyor";
    cultureMap[c] = (cultureMap[c] || 0) + 1;
  }

  const top5 = [...collection]
    .filter(e => e.analysis.identification.estimatedValueRange)
    .sort((a, b) => {
      const av = a.analysis.identification.estimatedValueRange!;
      const bv = b.analysis.identification.estimatedValueRange!;
      return ((bv.min + bv.max) / 2) - ((av.min + av.max) / 2);
    })
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Rarity Distribution */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
        <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-4">Nadirlik Dağılımı</p>
        {Object.entries(rarityMap).map(([r, cnt]) => (
          <div key={r} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs" style={{ color: rarityColor(r) }}>{r}</span>
              <span className="font-mono text-xs text-[#8A7A55]">{cnt}</span>
            </div>
            <div className="h-1.5 bg-[#16130C] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(cnt / collection.length) * 100}%`, background: rarityColor(r) }} />
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 */}
      {top5.length > 0 && (
        <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-4">En Değerli 5 Sikke</p>
          {top5.map((e, i) => {
            const r = e.analysis.identification.estimatedValueRange!;
            const mid = (r.min + r.max) / 2;
            return (
              <div key={e.id} className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full border border-[#3A3020] flex items-center justify-center flex-shrink-0">
                  <span className="font-cinzel text-xs text-[#C9A84C]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-xs text-[#E8DDB5] truncate">{coinTitle(e.analysis.identification)}</p>
                </div>
                <p className="font-cinzel text-sm text-[#C9A84C] flex-shrink-0">${fmtNumber(mid)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Culture Distribution */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
        <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-4">Medeniyet Dağılımı</p>
        {Object.entries(cultureMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([c, cnt]) => (
          <div key={c} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="font-cormorant text-sm text-[#E8DDB5]">{c}</span>
              <span className="font-mono text-xs text-[#8A7A55]">{cnt}</span>
            </div>
            <div className="h-1 bg-[#16130C] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#C9A84C]" style={{ width: `${(cnt / collection.length) * 100}%`, opacity: 0.6 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntryDetail({ entry, collection, onCollectionChange, onBack }: {
  entry: CollectionEntry;
  collection: CollectionEntry[];
  onCollectionChange: (c: CollectionEntry[]) => void;
  onBack: () => void;
}) {
  const [price, setPrice] = useState(entry.acquisitionPriceUSD ? String(entry.acquisitionPriceUSD) : "");
  const [notes, setNotes] = useState(entry.notes || "");
  const [saved, setSaved] = useState(false);

  const id = entry.analysis.identification;
  const history = entry.valueHistory || [];

  const handleSave = () => {
    const numeric = parseFloat(price.replace(",", "."));
    const updated = updateEntry(collection, entry.id, {
      acquisitionPriceUSD: Number.isFinite(numeric) && numeric > 0 ? numeric : undefined,
      notes: notes.trim() || undefined,
    });
    saveCollection(updated);
    onCollectionChange(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRemove = () => {
    if (!confirm("Koleksiyondan çıkarmak istediğinize emin misiniz?")) return;
    const updated = updateEntry(collection, entry.id, { inCollection: false });
    saveCollection(updated);
    onCollectionChange(updated);
    onBack();
  };

  const chartData = history.map(h => ({
    date: new Date(h.date).toLocaleDateString("tr-TR", { month: "short", day: "numeric" }),
    value: Math.round(h.midUSD),
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 font-cinzel text-xs text-[#8A7A55] tracking-widest hover:text-[#C9A84C] transition-colors">
        ← KOLEKSİYONA DÖN
      </button>

      {entry.imageUri && (
        <img src={entry.imageUri} alt="" className="w-full max-h-64 rounded-xl object-contain border border-[#3A3020]" />
      )}

      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
        <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-1">Sikke</p>
        <h2 className="font-cinzel text-lg text-[#C9A84C]">{coinTitle(id)}</h2>
        <p className="font-mono text-xs text-[#8A7A55] mt-1">{id.culture || "—"} · {id.yearMinted || "—"}</p>
      </div>

      {history.length >= 2 && (
        <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-4">Değer Grafiği (USD)</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#8A7A55", fontSize: 10 }} />
              <YAxis tick={{ fill: "#8A7A55", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#1E1A10", border: "1px solid #3A3020", borderRadius: 8, color: "#E8DDB5" }} />
              <Area type="monotone" dataKey="value" stroke="#C9A84C" fill="url(#goldGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5 space-y-4">
        <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase">Edinim Bilgileri</p>
        <div>
          <label className="font-mono text-xs text-[#8A7A55] tracking-widest">EDİNİM FİYATI (USD)</label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            type="number"
            placeholder="ör. 850"
            className="mt-1 w-full bg-[#16130C] border border-[#3A3020] rounded-lg px-4 py-3 text-[#E8DDB5] font-cormorant text-base focus:border-[#C9A84C] outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#8A7A55] tracking-widest">NOTLAR</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="ör. eBay'den, Roma satıcısı, sertifikalı..."
            rows={3}
            className="mt-1 w-full bg-[#16130C] border border-[#3A3020] rounded-lg px-4 py-3 text-[#E8DDB5] font-cormorant text-base focus:border-[#C9A84C] outline-none resize-none"
          />
        </div>
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#C9A84C] text-[#0D0B07] font-cinzel tracking-widest rounded-lg hover:bg-[#A07830] transition-colors"
        >
          {saved ? "✓ KAYDEDİLDİ" : "KAYDET"}
        </button>
      </div>

      <button
        onClick={handleRemove}
        className="w-full py-3 bg-[#1F0D0D] border border-[#5A1E1E] text-[#C0392B] font-cinzel tracking-widest rounded-lg hover:bg-[#2A0F0F] transition-colors"
      >
        KOLEKSİYONDAN ÇIKAR
      </button>
    </div>
  );
}
