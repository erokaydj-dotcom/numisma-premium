import { useMemo } from "react";
import { coinTitle, fmtNumber, rarityColor } from "@/lib/collection";
import type { CollectionEntry } from "@/lib/types";

interface Props {
  collection: CollectionEntry[];
}

function parseYear(raw?: string | null): number {
  if (!raw) return 0;
  const match = raw.match(/-?\d+/);
  return match ? parseInt(match[0]) : 0;
}

export default function TimelinePage({ collection }: Props) {
  const sorted = useMemo(() => {
    return collection
      .filter(e => e.inCollection)
      .sort((a, b) => parseYear(a.analysis.identification.yearMinted) - parseYear(b.analysis.identification.yearMinted));
  }, [collection]);

  if (sorted.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full border border-[#3A3020] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-cinzel text-[#C9A84C] tracking-wider">Zaman Tüneli Boş</p>
        <p className="font-mono text-xs text-[#8A7A55]">Koleksiyonunuza sikke ekledikçe zaman tüneli oluşur.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="font-cinzel text-sm text-[#E8DDB5] tracking-widest">ZAMAN TÜNELİ</h2>
        <div className="flex-1" />
        <span className="font-mono text-xs text-[#8A7A55] bg-[#1E1A10] border border-[#3A3020] px-3 py-1 rounded-full">
          {sorted.length} sikke
        </span>
      </div>

      <div className="relative pl-16">
        {/* Vertical Line */}
        <div className="absolute left-[52px] top-0 bottom-0 w-0.5 bg-[#3A3020]" />

        {sorted.map((entry, i) => {
          const id = entry.analysis.identification;
          const year = parseYear(id.yearMinted);
          const r = id.estimatedValueRange;

          return (
            <div key={entry.id} className="relative flex items-start mb-5 gap-0">
              {/* Year label */}
              <div className="absolute left-0 w-11 text-right pt-3 pr-2">
                <p className="font-cinzel text-xs text-[#C9A84C] leading-tight">{id.yearMinted || "?"}</p>
                {year !== 0 && (
                  <p className="font-mono text-[9px] text-[#6A5A40] mt-0.5">{year < 0 ? `MÖ ${Math.abs(year)}` : `MS ${year}`}</p>
                )}
              </div>

              {/* Dot */}
              <div className="absolute left-[46px] top-4 w-3 h-3 rounded-full bg-[#C9A84C] border-2 border-[#0D0B07] z-10 flex-shrink-0" />

              {/* Card */}
              <div className="ml-8 flex-1 bg-[#1E1A10] border border-[#3A3020] rounded-xl p-4 hover:border-[#C9A84C] transition-colors">
                <div className="flex items-center gap-3">
                  {entry.imageUri ? (
                    <img src={entry.imageUri} alt="" className="w-12 h-12 rounded-lg object-cover border border-[#3A3020] flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg border border-[#3A3020] bg-[#16130C] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel text-sm text-[#E8DDB5] truncate">{coinTitle(id)}</p>
                    <p className="font-mono text-xs text-[#8A7A55] mt-0.5 truncate">{id.culture || "—"} · {id.mint || "—"}</p>
                    <div className="flex gap-2 mt-2">
                      {id.rarity && (
                        <span className="px-2 py-0.5 rounded-full border text-[10px] font-mono" style={{ color: rarityColor(id.rarity), borderColor: rarityColor(id.rarity) + "44" }}>
                          {id.rarity}
                        </span>
                      )}
                      {id.grade && (
                        <span className="px-2 py-0.5 rounded-full border border-[#C9A84C44] text-[10px] font-mono text-[#C9A84C]">
                          {id.grade}
                        </span>
                      )}
                    </div>
                  </div>
                  {r && (
                    <div className="text-right flex-shrink-0">
                      <p className="font-cinzel text-sm text-[#C9A84C]">${fmtNumber(r.min)}</p>
                      <p className="font-mono text-[10px] text-[#6A5A40]">—${fmtNumber(r.max)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
