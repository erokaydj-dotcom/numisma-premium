import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { loadCollection, saveCollection } from "@/lib/collection";
import type { CollectionEntry, TabId } from "@/lib/types";
import ScanPage from "@/pages/ScanPage";
import CollectionPage from "@/pages/CollectionPage";
import TimelinePage from "@/pages/TimelinePage";
import MapPage from "@/pages/MapPage";
import AuctionPage from "@/pages/AuctionPage";
import ChatPage from "@/pages/ChatPage";
import PremiumPage from "@/pages/PremiumPage";
import AboutPage from "@/pages/AboutPage";

const queryClient = new QueryClient();

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  {
    id: "scan",
    label: "TARA",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "collection",
    label: "KOLEKSİYON",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    id: "timeline",
    label: "ZAMAN",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "map",
    label: "HARİTA",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    id: "auction",
    label: "MÜZAYEDE",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "SOHBET",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "premium",
    label: "PREMIUM",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    id: "about",
    label: "HAKKINDA",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function MainApp() {
  const [tab, setTab] = useState<TabId>("scan");
  const [collection, setCollection] = useState<CollectionEntry[]>([]);

  useEffect(() => {
    setCollection(loadCollection());
  }, []);

  const handleCollectionChange = (c: CollectionEntry[]) => {
    setCollection(c);
    saveCollection(c);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0D0B07] text-[#E8DDB5] overflow-hidden">
      {/* Header */}
      <header className="border-b border-[#3A3020] bg-[#16130C] flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-cinzel text-xl text-[#C9A84C] tracking-widest">NUMISMA AI</h1>
            <p className="font-mono text-[9px] text-[#8A7A55] tracking-widest mt-0.5">ANCIENT COIN RECOGNITION · PREMIUM WEB</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#27AE60]" />
            <span className="font-mono text-xs text-[#8A7A55]">ÇEVRİMİÇİ</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-5xl mx-auto px-2">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map(t => {
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-2 px-3 py-3 flex-shrink-0 border-b-2 transition-all font-cinzel text-[10px] tracking-widest"
                  style={{
                    borderBottomColor: isActive ? "#C9A84C" : "transparent",
                    color: isActive ? "#C9A84C" : "#6A5A40",
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.55 }}>{t.icon}</span>
                  <span className="hidden md:block">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={`flex-1 overflow-y-auto ${tab === "chat" ? "flex flex-col" : ""}`}>
        {tab === "scan" && <ScanPage collection={collection} onCollectionChange={handleCollectionChange} />}
        {tab === "collection" && <CollectionPage collection={collection} onCollectionChange={handleCollectionChange} />}
        {tab === "timeline" && <TimelinePage collection={collection} />}
        {tab === "map" && <MapPage collection={collection} />}
        {tab === "auction" && <AuctionPage collection={collection} />}
        {tab === "chat" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <ChatPage collection={collection} />
          </div>
        )}
        {tab === "premium" && <PremiumPage />}
  {tab === "about" && <AboutPage />}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={MainApp} />
            <Route component={MainApp} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
