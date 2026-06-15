import { useState, useRef } from "react";
import { analyzeCoin } from "@/lib/api";
import { addEntry, saveCollection, coinTitle, fmtNumber, rarityColor, verdictColor } from "@/lib/collection";
import type { CoinAnalysis, CollectionEntry } from "@/lib/types";

interface Props {
  collection: CollectionEntry[];
  onCollectionChange: (c: CollectionEntry[]) => void;
}

export default function ScanPage({ collection, onCollectionChange }: Props) {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CoinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setImageUrl(dataUrl);
      setResult(null);
      setError(null);
      setAdded(false);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) return;
    setAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeCoin(imageBase64);
      setResult(data);
    } catch (err) {
      setError("Analiz başarısız oldu. Lütfen net bir sikke fotoğrafı yükleyin.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddToCollection = () => {
    if (!result) return;
    const updated = addEntry(collection, result, imageUrl || undefined);
    saveCollection(updated);
    onCollectionChange(updated);
    setAdded(true);
  };

  const id = result?.identification;
  const fake = result?.fakeDetection;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Upload Area */}
      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border border-[#3A3020] rounded-xl p-8 flex flex-col items-center gap-4 cursor-pointer hover:border-[#C9A84C] transition-colors bg-[#16130C]"
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Coin" className="max-h-64 rounded-lg object-contain" />
        ) : (
          <>
            <div className="w-20 h-20 rounded-full border-2 border-[#3A3020] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-cinzel text-sm text-[#C9A84C] tracking-widest">SİKKE FOTOĞRAFI YÜKLEYİN</p>
              <p className="font-mono text-xs text-[#8A7A55] mt-1">Sürükleyin veya tıklayın · JPG, PNG, WEBP</p>
            </div>
          </>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {imageUrl && (
        <div className="flex gap-3">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex-1 bg-[#C9A84C] text-[#0D0B07] font-cinzel font-bold tracking-widest py-4 rounded-xl hover:bg-[#A07830] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                ANALİZ EDİLİYOR...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                SİKKEYİ TANI · DOĞRULA
              </>
            )}
          </button>
          <button
            onClick={() => { setImageBase64(null); setImageUrl(null); setResult(null); setError(null); setAdded(false); }}
            className="px-4 py-4 bg-[#1E1A10] border border-[#3A3020] rounded-xl text-[#8A7A55] hover:border-[#C9A84C] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-[#1F0D0D] border border-[#5A1E1E] rounded-xl p-4 text-[#C0392B] font-mono text-sm">
          {error}
        </div>
      )}

      {result && id && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-[#C9A84C] to-transparent opacity-60" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-1">Tanımlama</p>
                  <h2 className="font-cinzel text-xl text-[#C9A84C]">{coinTitle(id)}</h2>
                  {id.culture && <p className="font-mono text-xs text-[#8A7A55] mt-1 tracking-wide">{id.culture}</p>}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {id.rarity && (
                      <span className="px-2 py-1 rounded-full border text-xs font-mono" style={{ color: rarityColor(id.rarity), borderColor: rarityColor(id.rarity) + "55" }}>
                        ★ {id.rarity}
                      </span>
                    )}
                    {fake?.verdict && (
                      <span className="px-2 py-1 rounded-full border text-xs font-cinzel tracking-widest" style={{ color: verdictColor(fake.verdict), borderColor: verdictColor(fake.verdict) + "55" }}>
                        {fake.verdict}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-[#8A7A55] tracking-widest">Güven</p>
                  <p className="font-cinzel text-3xl text-[#C9A84C]">{Math.round(id.confidenceScore || 0)}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1.5 bg-[#16130C] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#C9A84C] to-[#8B6914] transition-all" style={{ width: `${id.confidenceScore || 0}%` }} />
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Hükümdar", id.ruler],
              ["Hanedan", id.dynasty],
              ["Basım Yılı", id.yearMinted],
              ["Darphane", id.mint],
              ["Dönem", id.period],
              ["Apans", id.denomination],
              ["Materyal", id.material],
              ["Ebat / Ağırlık", id.diameter && id.weight ? `${id.diameter}mm · ${id.weight}g` : id.diameter || id.weight || null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label as string} className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-4">
                <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-1">{label}</p>
                <p className="font-cormorant text-sm text-[#E8DDB5]">{value}</p>
              </div>
            ))}
          </div>

          {/* Estimated Value */}
          {id.estimatedValueRange && (
            <div className="bg-[#252010] border border-[#3A3020] rounded-xl p-5">
              <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-2">Tahmini Piyasa Değeri</p>
              <p className="font-cinzel text-2xl text-[#C9A84C]">
                ${fmtNumber(id.estimatedValueRange.min)} — ${fmtNumber(id.estimatedValueRange.max)} {id.estimatedValueRange.currency}
              </p>
            </div>
          )}

          {/* Description */}
          {(id.description || id.historicalContext) && (
            <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5 space-y-4">
              {id.description && (
                <div>
                  <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-2">Açıklama</p>
                  <p className="font-cormorant italic text-[#E8DDB5] leading-relaxed">{id.description}</p>
                </div>
              )}
              {id.historicalContext && (
                <div>
                  <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-2">Tarihsel Bağlam</p>
                  <p className="font-cormorant italic text-[#E8DDB5] leading-relaxed">{id.historicalContext}</p>
                </div>
              )}
            </div>
          )}

          {/* Fake Detection */}
          {fake && (
            <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl overflow-hidden">
              <div className="h-0.5 opacity-60" style={{ background: `linear-gradient(to right, ${verdictColor(fake.verdict)}, transparent)` }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase">Özgünlük Analizi</p>
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-lg" style={{ color: verdictColor(fake.verdict) }}>
                      {fake.verdict}
                    </span>
                    <span className="font-mono text-sm text-[#8A7A55]">%{Math.round(fake.authenticityScore)}</span>
                  </div>
                </div>
                {fake.indicators.slice(0, 5).map(ind => (
                  <div key={ind.name} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-xs text-[#8A7A55]">{ind.name}</span>
                      <span className="font-mono text-xs" style={{ color: ind.score >= 75 ? "#27AE60" : ind.score >= 40 ? "#E67E22" : "#C0392B" }}>
                        {ind.score}
                      </span>
                    </div>
                    <div className="h-1 bg-[#16130C] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${ind.score}%`,
                        background: ind.score >= 75 ? "#27AE60" : ind.score >= 40 ? "#E67E22" : "#C0392B"
                      }} />
                    </div>
                  </div>
                ))}
                {fake.recommendation && (
                  <p className="mt-4 font-cormorant italic text-[#8A7A55] text-sm leading-relaxed border-t border-[#2A2418] pt-4">
                    {fake.recommendation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Add to Collection */}
          <button
            onClick={handleAddToCollection}
            disabled={added}
            className="w-full py-4 rounded-xl border font-cinzel tracking-widest text-sm transition-all disabled:opacity-60"
            style={added ? { backgroundColor: "#0D1F14", borderColor: "#1E5A3A", color: "#27AE60" } : { backgroundColor: "#1E1A10", borderColor: "#C9A84C", color: "#C9A84C" }}
          >
            {added ? "✓ KOLEKSİYONA EKLENDİ" : "+ KOLEKSİYONA EKLE"}
          </button>
        </div>
      )}

      {/* Tips */}
      {!imageUrl && (
        <div className="bg-[#1E1A10] border border-[#2A2418] rounded-xl p-5">
          <p className="font-mono text-xs text-[#C9A84C] tracking-widest mb-3">EN İYİ SONUÇ İÇİN</p>
          <ul className="space-y-2">
            {[
              "Sikkeyi düz ve aydınlık bir zemine koyun",
              "Gölge ve yansımalardan kaçının",
              "Sadece sikke kare içinde görünsün",
              "Net odakta, en az 1080p kalitede çekin",
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-[#C9A84C] mt-0.5">·</span>
                <span className="font-mono text-xs text-[#8A7A55] leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
