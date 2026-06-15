import { useMemo, useState } from "react";
import { coinTitle } from "@/lib/collection";
import type { CollectionEntry } from "@/lib/types";

interface Props {
  collection: CollectionEntry[];
}

const LAT_MIN = 18, LAT_MAX = 58, LNG_MIN = -15, LNG_MAX = 80;
const MAP_W = 760, MAP_H = 380, PAD = 20;

function lngToX(lng: number) { return PAD + ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (MAP_W - PAD * 2); }
function latToY(lat: number) { return PAD + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (MAP_H - PAD * 2); }

const LAND = [
  { label: "EUROPE", x: 200, y: 100, r: 100 },
  { label: "ANATOLIA", x: 450, y: 190, r: 75 },
  { label: "MESOPOTAMIA", x: 530, y: 240, r: 55 },
  { label: "EGYPT", x: 415, y: 300, r: 45 },
  { label: "N.AFRICA", r: 70, x: 255, y: 305 },
  { label: "LEVANT", x: 475, y: 260, r: 32 },
  { label: "CRIMEA", x: 445, y: 95, r: 28 },
  { label: "IRAN", x: 578, y: 210, r: 60 },
];

const MINT_DB: Record<string, { lat: number; lng: number }> = {
  roma: { lat: 41.9, lng: 12.5 }, rome: { lat: 41.9, lng: 12.5 },
  konstantinopolis: { lat: 41.0, lng: 28.9 }, constantinople: { lat: 41.0, lng: 28.9 }, istanbul: { lat: 41.0, lng: 28.9 },
  antakya: { lat: 36.2, lng: 36.2 }, antioch: { lat: 36.2, lng: 36.2 },
  iskenderiye: { lat: 31.2, lng: 29.9 }, alexandria: { lat: 31.2, lng: 29.9 },
  atina: { lat: 37.9, lng: 23.7 }, athens: { lat: 37.9, lng: 23.7 },
  efes: { lat: 37.9, lng: 27.3 }, ephesus: { lat: 37.9, lng: 27.3 },
  korint: { lat: 37.9, lng: 22.9 }, corinth: { lat: 37.9, lng: 22.9 },
  sardes: { lat: 38.5, lng: 28.0 }, sardis: { lat: 38.5, lng: 28.0 },
  nikomedia: { lat: 40.8, lng: 29.9 }, nicomedia: { lat: 40.8, lng: 29.9 },
  thessaloniki: { lat: 40.6, lng: 22.9 }, selanik: { lat: 40.6, lng: 22.9 },
  lugdunum: { lat: 45.7, lng: 4.8 }, lyon: { lat: 45.7, lng: 4.8 },
  mediolanum: { lat: 45.5, lng: 9.2 }, milan: { lat: 45.5, lng: 9.2 },
  karthago: { lat: 36.8, lng: 10.3 }, carthage: { lat: 36.8, lng: 10.3 },
  pergamon: { lat: 39.1, lng: 27.2 },
  smyrna: { lat: 38.4, lng: 27.1 }, izmir: { lat: 38.4, lng: 27.1 },
  ankara: { lat: 39.9, lng: 32.9 }, ancyra: { lat: 39.9, lng: 32.9 },
  londinium: { lat: 51.5, lng: -0.1 }, london: { lat: 51.5, lng: -0.1 },
  lugdunum2: { lat: 48.8, lng: 2.3 }, paris: { lat: 48.8, lng: 2.3 },
  babil: { lat: 32.5, lng: 44.4 }, babylon: { lat: 32.5, lng: 44.4 },
  persepolis: { lat: 29.9, lng: 52.9 },
  sidon: { lat: 33.6, lng: 35.4 },
  tyre: { lat: 33.3, lng: 35.2 },
  pella: { lat: 40.8, lng: 22.5 },
};

function getMintCoords(mint?: string | null): { lat: number; lng: number } | null {
  if (!mint) return null;
  const key = mint.toLowerCase().replace(/[^a-z]/g, "");
  for (const k of Object.keys(MINT_DB)) {
    if (key.includes(k) || k.includes(key.slice(0, 5))) return MINT_DB[k];
  }
  return null;
}

export default function MapPage({ collection }: Props) {
  const [tooltip, setTooltip] = useState<{ coins: CollectionEntry[]; x: number; y: number; mintName: string } | null>(null);

  const mapped = useMemo(() => {
    const groups: Record<string, { coords: { lat: number; lng: number }; coins: CollectionEntry[]; mintName: string }> = {};
    for (const entry of collection.filter(e => e.inCollection)) {
      const mint = entry.analysis.identification.mint;
      const coords = getMintCoords(mint);
      if (!coords) continue;
      const key = `${coords.lat},${coords.lng}`;
      if (!groups[key]) groups[key] = { coords, coins: [], mintName: mint || "" };
      groups[key].coins.push(entry);
    }
    return Object.values(groups);
  }, [collection]);

  const unmapped = useMemo(() => {
    return collection.filter(e => e.inCollection && !getMintCoords(e.analysis.identification.mint));
  }, [collection]);

  if (collection.filter(e => e.inCollection).length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full border border-[#3A3020] flex items-center justify-center">
          <svg className="w-6 h-6 text-[#8A7A55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <p className="font-cinzel text-[#C9A84C] tracking-wider">Harita Boş</p>
        <p className="font-mono text-xs text-[#8A7A55]">Koleksiyonunuza darphane bilgisi olan sikkeler eklendiğinde haritada görünür.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h2 className="font-cinzel text-sm text-[#E8DDB5] tracking-widest">COĞRAFİ HARİTA</h2>
        <span className="font-mono text-xs text-[#8A7A55] bg-[#1E1A10] border border-[#3A3020] px-3 py-1 rounded-full ml-auto">
          {mapped.length} darphane · {mapped.reduce((s, g) => s + g.coins.length, 0)} sikke
        </span>
      </div>

      {/* SVG Map */}
      <div className="relative bg-[#0D0B07] border border-[#3A3020] rounded-xl overflow-hidden">
        <svg width="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ display: "block" }}>
          {/* Grid */}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`v${i}`} x1={PAD + (i * (MAP_W - PAD * 2)) / 7} y1={PAD} x2={PAD + (i * (MAP_W - PAD * 2)) / 7} y2={MAP_H - PAD} stroke="#2A2418" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`h${i}`} x1={PAD} y1={PAD + (i * (MAP_H - PAD * 2)) / 4} x2={MAP_W - PAD} y2={PAD + (i * (MAP_H - PAD * 2)) / 4} stroke="#2A2418" strokeWidth="0.5" />
          ))}

          {/* Land masses */}
          {LAND.map(l => (
            <g key={l.label}>
              <ellipse cx={l.x} cy={l.y} rx={l.r} ry={l.r * 0.6} fill="#1A1608" stroke="#2A2418" strokeWidth="1" />
              <text x={l.x} y={l.y + 4} textAnchor="middle" fill="#3A3020" fontSize="7" fontFamily="monospace" letterSpacing="2">{l.label}</text>
            </g>
          ))}

          {/* Coastline dots */}
          <rect x={PAD} y={PAD} width={MAP_W - PAD * 2} height={MAP_H - PAD * 2} fill="none" stroke="#2A2418" strokeWidth="0.5" rx="4" />

          {/* Mint markers */}
          {mapped.map(group => {
            const x = lngToX(group.coords.lng);
            const y = latToY(group.coords.lat);
            const r = 6 + Math.min(group.coins.length * 2, 10);
            return (
              <g key={`${group.coords.lat},${group.coords.lng}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setTooltip({ coins: group.coins, x, y, mintName: group.mintName })}
                onMouseLeave={() => setTooltip(null)}>
                <circle cx={x} cy={y} r={r + 4} fill="#C9A84C" opacity="0.1" />
                <circle cx={x} cy={y} r={r} fill="#C9A84C" opacity="0.85" />
                <circle cx={x} cy={y} r={r - 2} fill="#0D0B07" opacity="0.4" />
                {group.coins.length > 1 && (
                  <text x={x} y={y + 4} textAnchor="middle" fill="#0D0B07" fontSize="9" fontWeight="bold" fontFamily="monospace">{group.coins.length}</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bg-[#1E1A10] border border-[#C9A84C] rounded-xl p-3 text-xs z-20 shadow-xl pointer-events-none"
            style={{ left: Math.min(tooltip.x, MAP_W - 180), top: tooltip.y - 80, maxWidth: 200 }}
          >
            <p className="font-cinzel text-[#C9A84C] tracking-wider mb-2">{tooltip.mintName}</p>
            {tooltip.coins.slice(0, 3).map(c => (
              <p key={c.id} className="font-cormorant text-[#E8DDB5] truncate">{coinTitle(c.analysis.identification)}</p>
            ))}
            {tooltip.coins.length > 3 && <p className="font-mono text-[#8A7A55] mt-1">+{tooltip.coins.length - 3} daha</p>}
          </div>
        )}
      </div>

      {/* Unmapped */}
      {unmapped.length > 0 && (
        <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-5">
          <p className="font-mono text-xs text-[#8A7A55] tracking-widest uppercase mb-3">Haritasız Sikkeler ({unmapped.length})</p>
          <div className="space-y-2">
            {unmapped.map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#2A2418] last:border-0">
                <p className="font-cinzel text-xs text-[#E8DDB5]">{coinTitle(e.analysis.identification)}</p>
                <p className="font-mono text-xs text-[#8A7A55]">{e.analysis.identification.mint || "Darphane bilinmiyor"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
