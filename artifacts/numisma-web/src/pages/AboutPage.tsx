export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-5xl">📜</div>
        <h1 className="font-cinzel text-2xl text-[#C9A84C] tracking-widest">HAKKINDA</h1>
        <p className="font-cormorant text-[#8A7A55] text-base leading-relaxed">
          Numisma AI — Dünyanın en kapsamlı numismatik AI platformu
        </p>
      </div>

      {/* Expert */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-6 space-y-4">
        <h2 className="font-cinzel text-lg text-[#C9A84C] tracking-widest">PROGRAM YAPICISI</h2>
        <div className="space-y-2">
          <p className="font-cinzel text-xl text-[#E8DDB5]">Dr. Ahmet Bora</p>
          <p className="font-cormorant text-[#8A7A55] text-sm leading-relaxed">
            Numismatik, Epigrafi ve İkonografi Uzmanı
          </p>
        </div>
        <p className="font-cormorant text-[#8A7A55] text-sm leading-relaxed">
          Dr. Ahmet Bora, antik sikkeler üzerinde 20+ yıllık akademik ve sahada araştırma deneyimine sahiptir.
          Numisma AI'nin bilgi altyapısını ve 391.000+ sikke veritabanının içeriğini oluşturmuştur.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-6 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="font-cinzel text-2xl text-[#C9A84C]">391.000+</p>
          <p className="font-mono text-[10px] text-[#8A7A55] tracking-widest mt-1">SİKKE</p>
        </div>
        <div className="text-center">
          <p className="font-cinzel text-2xl text-[#C9A84C]">50</p>
          <p className="font-mono text-[10px] text-[#8A7A55] tracking-widest mt-1">MEDENİYET</p>
        </div>
        <div className="text-center">
          <p className="font-cinzel text-2xl text-[#C9A84C]">AI</p>
          <p className="font-mono text-[10px] text-[#8A7A55] tracking-widest mt-1">ANALİZ</p>
        </div>
        <div className="text-center">
          <p className="font-cinzel text-2xl text-[#C9A84C]">9</p>
          <p className="font-mono text-[10px] text-[#8A7A55] tracking-widest mt-1">SAHTE İNDİKATÖR</p>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl p-6 space-y-4">
        <h2 className="font-cinzel text-lg text-[#C9A84C] tracking-widest">İLETİŞİM</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-mono text-sm text-[#E8DDB5]">numismaai@gmail.com</span>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#C9A84C]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span className="font-mono text-sm text-[#E8DDB5]">Telegram: Ahmetbora</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center font-mono text-[10px] text-[#8A7A55] tracking-widest">
        NUMISMA AI v1.0 · NUMISMATIC INTELLIGENCE
      </p>
    </div>
  );
}
