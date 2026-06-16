import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type CoinGrade =
  | "Poor"
  | "Fair"
  | "Good"
  | "Very Good"
  | "Fine"
  | "Very Fine"
  | "Extremely Fine"
  | "About Uncirculated"
  | "Mint State";

export type AuctionPrice = {
  house: string;
  date: string;
  priceUSD: number;
  currency: string;
};

export type Coin = {
  id: string;
  imageUri: string;
  name: string;
  country: string;
  year: string;
  denomination: string;
  composition: string;
  diameter: string;
  weight: string;
  grade: CoinGrade;
  estimatedValue: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Extremely Rare";
  description: string;
  identifiedAt: number;
  isFavorite: boolean;
  culture?: string;
  ruler?: string;
  period?: string;
  mint?: string;
  obverse?: string;
  reverse?: string;
  historicalContext?: string;
  gradingNotes?: string;
  confidenceScore?: number;
  authenticityScore?: number;
  verdict?: string;
  estimatedValueMin?: number;
  estimatedValueMax?: number;
  valueCurrency?: string;
  auctionPrices?: AuctionPrice[];
};

type CollectionContextType = {
  coins: Coin[];
  addCoin: (coin: Coin) => Promise<void>;
  removeCoin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getCoin: (id: string) => Coin | undefined;
  isLoading: boolean;
};

const STORAGE_KEY = "@numisma_collection";

const CollectionContext = createContext<CollectionContextType | null>(null);

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCoins();
  }, []);

  async function loadCoins() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setCoins(JSON.parse(data));
      }
    } catch (e) {
      console.error("Failed to load collection:", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveCoins(updated: Coin[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const addCoin = useCallback(async (coin: Coin) => {
    setCoins((prev) => {
      const updated = [coin, ...prev];
      saveCoins(updated);
      return updated;
    });
  }, []);

  const removeCoin = useCallback(async (id: string) => {
    setCoins((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveCoins(updated);
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setCoins((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
      );
      saveCoins(updated);
      return updated;
    });
  }, []);

  const getCoin = useCallback(
    (id: string) => coins.find((c) => c.id === id),
    [coins]
  );

  return (
    <CollectionContext.Provider
      value={{ coins, addCoin, removeCoin, toggleFavorite, getCoin, isLoading }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used within CollectionProvider");
  return ctx;
}
