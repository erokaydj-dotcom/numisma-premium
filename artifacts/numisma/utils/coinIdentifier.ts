import type { Coin, CoinGrade } from "@/context/CollectionContext";

const MOCK_COINS: Array<Omit<Coin, "id" | "imageUri" | "identifiedAt" | "isFavorite">> = [
  {
    name: "Morgan Silver Dollar",
    country: "Amerika Birleşik Devletleri",
    year: "1878",
    denomination: "1 Dolar",
    composition: "% 90 Gümüş, % 10 Bakır",
    diameter: "38.1 mm",
    weight: "26.73 g",
    grade: "Very Fine" as CoinGrade,
    estimatedValue: "$85 - $120",
    rarity: "Uncommon",
    description:
      "Morgan Doları, Amerika Birleşik Devletleri Darphanesi tarafından 1878-1904 ve 1921 yılları arasında basılmış efsanevi bir gümüş sikke. Ön yüzde özgürlük tanrıçasının sola bakan profili, arka yüzde ise kartal motifi yer almaktadır.",
  },
  {
    name: "Osmanlı Altın Sikke (Tuğralı)",
    country: "Osmanlı İmparatorluğu",
    year: "1839",
    denomination: "1 Altın",
    composition: "% 91.7 Altın",
    diameter: "22 mm",
    weight: "3.5 g",
    grade: "Extremely Fine" as CoinGrade,
    estimatedValue: "₺12.000 - ₺18.000",
    rarity: "Rare",
    description:
      "Sultan Abdülmecid dönemine ait tuğralı Osmanlı altın sikkesi. Ön yüzde Osmanlı tuğrası ve dönemin hicri tarihi, arka yüzde ise süslü Osmanlı yazısı bulunmaktadır. İstanbul Darphanesi ürünü.",
  },
  {
    name: "Denarius - Marcus Aurelius",
    country: "Roma İmparatorluğu",
    year: "M.S. 161",
    denomination: "Denarius",
    composition: "% 79 Gümüş, % 21 Bakır",
    diameter: "18 mm",
    weight: "3.4 g",
    grade: "Good" as CoinGrade,
    estimatedValue: "$180 - $280",
    rarity: "Rare",
    description:
      "Roma İmparatoru Marcus Aurelius dönemine ait gümüş Denarius. Stoik filozof-imparatorun sağ profili ön yüzde, arka yüzde ise Roma tanrılarından biri tasvir edilmiştir.",
  },
  {
    name: "British Sovereign",
    country: "Birleşik Krallık",
    year: "1913",
    denomination: "1 Sovereign",
    composition: "% 91.67 Altın",
    diameter: "22.05 mm",
    weight: "7.98 g",
    grade: "About Uncirculated" as CoinGrade,
    estimatedValue: "£650 - £850",
    rarity: "Uncommon",
    description:
      "V. Kral George dönemi British Sovereign altın sikkesi. Ön yüzde kral portresi, arka yüzde George ile ejderha sahnesi yer almaktadır. İngiliz darphane geleneğinin simgesi.",
  },
  {
    name: "Türkiye Cumhuriyeti 50 Kuruş",
    country: "Türkiye",
    year: "1947",
    denomination: "50 Kuruş",
    composition: "% 83.5 Gümüş",
    diameter: "24 mm",
    weight: "5.0 g",
    grade: "Fine" as CoinGrade,
    estimatedValue: "₺800 - ₺1.200",
    rarity: "Uncommon",
    description:
      "Türkiye Cumhuriyeti erken dönem gümüş 50 Kuruş sikkesi. Ön yüzde İsmet İnönü portresi, arka yüzde ay-yıldız ve Cumhuriyet amblemi yer almaktadır.",
  },
];

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

export async function identifyCoin(imageUri: string): Promise<Coin> {
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 1000)
  );

  const template = MOCK_COINS[Math.floor(Math.random() * MOCK_COINS.length)];

  return {
    ...template,
    id: generateId(),
    imageUri,
    identifiedAt: Date.now(),
    isFavorite: false,
  };
}
