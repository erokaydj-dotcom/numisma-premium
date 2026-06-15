const FEATURES = [
  "Sınırsız sikke analizi",
  "Çift yüz (obverse + reverse) analiz",
  "9 indikatörlü sahte tespit motoru",
  "Numismatik AI danışman (sınırsız sohbet)",
  "Coğrafi darphane haritası",
  "Müzayede fiyat geçmişi ve grafikler",
  "Koleksiyon değer takibi",
  "391.138+ sikke veritabanı eşleştirme",
  "Çevrimdışı önbellek erişimi",
  "4 dil desteği (TR · EN · AR · RU)",
];

const PLANS = [
  {
    id: "annual",
    label: "Yıllık",
    price: "₺2.500 / yıl",
    perMonth: "Aylık yalnızca ₺208",
    badge: "EN İYİ DEĞER",
    badgeColor: "#C9A84C",
  },
  {
    id: "monthly",
    label: "Aylık",
    price: "₺400 / ay",
    perMonth: "İstediğinde iptal et",
    badge: null,
  },
  {
    id: "quarterly",
    label: "3 Aylık",
    price: "₺1.000 / 3 ay",
    perMonth: "₺333 / ay",
    badge: null,
  },
  {
    id: "semi",
    label: "6 Aylık",
    price: "₺1.500 / 6 ay",
    perMonth: "₺250 / ay",
    badge: null,
  },
];

export default function PremiumPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl">♛</div>
        <h1 className="font-cinzel text-2xl text-[#C9A84C] tracking-widest">NUMISMA PREMIUM</h1>
        <p className="font-cormorant text-[#8A7A55] text-base leading-relaxed">
          Antik sikke koleksiyonunuzu bir üst seviyeye taşıyın
        </p>
      </div>

      {/* Features */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-6 space-y-3">
        {FEATURES.map(f => (
          <div key={f} className="flex items-center gap-3">
            <svg className="w-4 h-4 text-[#C9A84C] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="font-cormorant text-[#E8DDB5]">{f}</span>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="space-y-3">
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className="relative bg-[#1E1A10] border rounded-xl p-5"
            style={{ borderColor: plan.badge ? "#C9A84C" : "#3A3020" }}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-5 bg-[#C9A84C] text-[#0D0B07] font-cinzel text-xs tracking-widest px-3 py-0.5 rounded-full">
                {plan.badge}
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{ borderColor: plan.badge ? "#C9A84C" : "#8A7A55" }}
              >
                {plan.badge && <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />}
              </div>
              <div className="flex-1">
                <p className="font-cinzel text-sm text-[#E8DDB5] tracking-wider">{plan.label}</p>
                <p className="font-cormorant text-lg text-[#C9A84C] mt-0.5">{plan.price}</p>
              </div>
              <p className="font-mono text-xs text-[#8A7A55] text-right max-w-[120px] leading-relaxed">
                {plan.perMonth}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Notice */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-4 flex items-start gap-3">
        <svg className="w-4 h-4 text-[#8A7A55] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="font-cormorant text-sm text-[#8A7A55] leading-relaxed">
          Satın alma işlemi Google Play Store üzerinden gerçekleştirilir. Numisma AI mobil uygulamasını indirin.
        </p>
      </div>

      {/* CTA */}
      <a
        href="https://play.google.com/store"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-4 bg-[#C9A84C] text-[#0D0B07] font-cinzel tracking-widest text-center rounded-xl hover:bg-[#A07830] transition-colors"
      >
        GOOGLE PLAY'DE İNCELE
      </a>

      {/* Legal */}
      <p className="font-cormorant text-xs text-[#6A5A40] text-center leading-relaxed">
        Abonelik, Google Play hesabınızdan tahsil edilir. Mevcut dönem sona ermeden 24 saat önce
        otomatik olarak yenilenir. Google Play ayarlarından iptal edebilirsiniz.
      </p>
    </div>
  );
}
