import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AUCTIONS = [
  {
    coin: "Osmanlİ Tuğralı Altın",
    price: "₺18.500",
    date: "15 Kasım 2025",
    house: "Antik Koleksiyon",
    status: "Kapalı",
  },
  {
    coin: "Roma Denarius - Marcus Aurelius",
    price: "$2.100",
    date: "20 Kasım 2025",
    house: "Heritage Auctions",
    status: "Açık",
  },
  {
    coin: "Morgan Silver Dollar 1878",
    price: "$145",
    date: "22 Kasım 2025",
    house: "Stack's Bowers",
    status: "Açık",
  },
  {
    coin: "British Sovereign 1913",
    price: "£750",
    date: "01 Aralık 2025",
    house: "Baldwin's",
    status: "Açık",
  },
  {
    coin: "Türkiye 50 Kuruş 1947",
    price: "₺1.200",
    date: "10 Aralık 2025",
    house: "Arif Efendi Müzayede",
    status: "Açık",
  },
];

export default function AuctionScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: "#0D0B07" }]}
      contentContainerStyle={{
        paddingTop: topPad + 16,
        paddingBottom: insets.bottom + 84,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>MÜZAYEDE</Text>
        <Text style={styles.subtitle}>
          Canlı müzayede takibi ve fiyat geçmişi
        </Text>
      </View>

      <View style={styles.notice}>
        <Feather name="activity" size={16} color="#D4AF37" />
        <Text style={styles.noticeText}>
          Dünya çapındaki antik sikke müzayedeleri canlı takip edilir.
          Premium üyeler için fiyat geçmişi grafikleri.
        </Text>
      </View>

      <View style={styles.list}>
        {AUCTIONS.map((a, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.coinName}>{a.coin}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{a.status}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.meta}>
                {a.house} · {a.date}
              </Text>
              <Text style={styles.price}>{a.price}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 20,
    color: "#D4AF37",
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#8B7A6A",
    marginTop: 4,
  },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#161412",
  },
  noticeText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 13,
    color: "#8B7A6A",
    lineHeight: 18,
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    backgroundColor: "#161412",
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coinName: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 13,
    color: "#E8DCC8",
    flex: 1,
  },
  badge: {
    backgroundColor: "#2A241E",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
  },
  meta: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#6A5A40",
  },
  price: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 14,
    color: "#D4AF37",
  },
});
