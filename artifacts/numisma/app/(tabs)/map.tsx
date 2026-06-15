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

const MINTS = [
  { city: "İstanbul", country: "Türkiye", type: "Osmanlı", color: "#D4AF37" },
  { city: "Roma", country: "İtalya", type: "Roma", color: "#8B9A46" },
  { city: "Viyana", country: "Avusturya", type: "Avusturya", color: "#A8A396" },
  { city: "Pariz", country: "Fransa", type: "Fransa", color: "#6B7B8B" },
  { city: "Londra", country: "Birleşik Krallık", type: "Biritanya", color: "#9B4656" },
  { city: "İskenderiye", country: "Mısır", type: "Helenistik", color: "#7B8B6B" },
  { city: "Atina", country: "Yunanistan", type: "Yunan", color: "#6B7B8B" },
  { city: "Barselona", country: "İspanya", type: "İspanya", color: "#8B7B4B" },
  { city: "Nürnberg", country: "Almanya", type: "Almanya", color: "#7B5B8B" },
  { city: "Şanghay", country: "Çin", type: "Çin", color: "#8B5B6B" },
];

export default function MapScreen() {
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
        <Text style={styles.title}>HARİTA</Text>
        <Text style={styles.subtitle}>
          10.000+ tarihi darphane haritası
        </Text>
      </View>

      <View style={styles.notice}>
        <Feather name="map" size={16} color="#D4AF37" />
        <Text style={styles.noticeText}>
          Numisma AI, sikkelerin üretildiği tarihi darphane verilerini
          coğrafi harita üzerinde görselleştirir. Yakında aktif olacak.
        </Text>
      </View>

      <View style={styles.grid}>
        {MINTS.map((m) => (
          <View key={m.city + m.type} style={styles.card}>
            <View style={[styles.dot, { backgroundColor: m.color }]} />
            <Text style={styles.cardCity}>{m.city}</Text>
            <Text style={styles.cardType}>{m.type}</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 8,
  },
  card: {
    width: "47%",
    backgroundColor: "#161412",
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardCity: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 13,
    color: "#E8DCC8",
  },
  cardType: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
  },
});
