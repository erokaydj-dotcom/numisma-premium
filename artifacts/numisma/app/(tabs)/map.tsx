import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MINTS = [
  {
    city: "İstanbul",
    country: "Türkiye",
    type: "Osmanlı",
    color: "#D4AF37",
    detail:
      "Konstantinopolis Darphanesi — M.Ö. 330'dan Osmanlı dönemine kadar kesintisiz faaliyet gösteren dünyanın en köklü darphanelerinden biri. Bizans ve Osmanlı sikkelerinin merkezi.",
    period: "M.Ö. 330 – M.S. 1922",
  },
  {
    city: "Roma",
    country: "İtalya",
    type: "Roma",
    color: "#8B9A46",
    detail:
      "Roma Darphanesi (Zecca di Roma) — M.Ö. 269'da kurulan bu darphane, denarius ve aureus gibi dünyaca ünlü Roma sikkelerini üretmiştir.",
    period: "M.Ö. 269 – M.S. 1870",
  },
  {
    city: "Viyana",
    country: "Avusturya",
    type: "Avusturya",
    color: "#A8A396",
    detail:
      "Viyana Darphanesi (Münze Österreich) — 1194'ten bu yana kesintisiz faaliyet gösteren, Maria Theresa Taler'inin üretildiği tarihi darphane.",
    period: "M.S. 1194 – günümüz",
  },
  {
    city: "Pariz",
    country: "Fransa",
    type: "Fransa",
    color: "#6B7B8B",
    detail:
      "Paris Darphanesi (Monnaie de Paris) — 864'ten bu yana sürekli faaliyet gösteren dünyanın en eski devlet kurumlarından biri.",
    period: "M.S. 864 – günümüz",
  },
  {
    city: "Londra",
    country: "Birleşik Krallık",
    type: "Britanya",
    color: "#9B4656",
    detail:
      "Kraliyet Darphanesi (Royal Mint) — M.S. 886'da Kral Alfred döneminde kurulan, pound sterlingin ve sovereign altınının anavatanı.",
    period: "M.S. 886 – günümüz",
  },
  {
    city: "İskenderiye",
    country: "Mısır",
    type: "Helenistik",
    color: "#7B8B6B",
    detail:
      "İskenderiye Darphanesi — Ptolemaios hanedanı döneminde Akdeniz'in en önemli sikke merkezlerinden biri. Altın tetradrahm üretimi ile tanınır.",
    period: "M.Ö. 305 – M.S. 296",
  },
  {
    city: "Atina",
    country: "Yunanistan",
    type: "Yunan",
    color: "#6B7B8B",
    detail:
      "Atina Darphanesi — Antik dünyanın en prestijli sikkesi olan 'baykuşlu' Atina tetradrahmasının üretim merkezi. Laurion gümüş madenleriyle beslenmiştir.",
    period: "M.Ö. 510 – M.Ö. 38",
  },
  {
    city: "Barselona",
    country: "İspanya",
    type: "İspanya",
    color: "#8B7B4B",
    detail:
      "Barselona Darphanesi — Katalonya bölgesinin tarihi sikke merkezi. Ortaçağ Hristiyan krallıklarının altın ve gümüş sikkelerini üretmiştir.",
    period: "M.S. 1339 – 1849",
  },
  {
    city: "Nürnberg",
    country: "Almanya",
    type: "Almanya",
    color: "#7B5B8B",
    detail:
      "Nürnberg Darphanesi — Orta Çağ Avrupa'sının en büyük ticaret kentlerinden birinde faaliyet gösteren, Kutsal Roma İmparatorluğu sikkelerinin üretim merkezi.",
    period: "M.S. 1135 – 1806",
  },
  {
    city: "Şanghay",
    country: "Çin",
    type: "Çin",
    color: "#8B5B6B",
    detail:
      "Şanghay Darphanesi — Çin'in en büyük modern darphanesi. Tarihsel olarak Qing hanedanı döneminden bu yana faaliyet göstermektedir.",
    period: "M.S. 1897 – günümüz",
  },
];

type Mint = (typeof MINTS)[number];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [selected, setSelected] = useState<Mint | null>(null);

  async function handlePress(mint: Mint) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(mint);
  }

  return (
    <>
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
            10.000+ tarihi darphane veritabanı
          </Text>
        </View>

        <View style={styles.notice}>
          <Feather name="map" size={16} color="#D4AF37" />
          <Text style={styles.noticeText}>
            Sikkelerin üretildiği tarihi darphaneler. Detayları görmek için
            bir karta dokunun.
          </Text>
        </View>

        <View style={styles.grid}>
          {MINTS.map((m) => (
            <Pressable
              key={m.city + m.type}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handlePress(m)}
            >
              <View style={[styles.dot, { backgroundColor: m.color }]} />
              <Text style={styles.cardCity}>{m.city}</Text>
              <Text style={styles.cardCountry}>{m.country}</Text>
              <Text style={styles.cardType}>{m.type}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.modal} onPress={() => {}}>
            {selected && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalDot,
                      { backgroundColor: selected.color },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalCity}>{selected.city}</Text>
                    <Text style={styles.modalCountry}>
                      {selected.country} · {selected.type}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setSelected(null)}
                    style={styles.closeBtn}
                  >
                    <Feather name="x" size={18} color="#8B7A6A" />
                  </Pressable>
                </View>
                <View style={styles.modalDivider} />
                <Text style={styles.modalPeriod}>{selected.period}</Text>
                <Text style={styles.modalDetail}>{selected.detail}</Text>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
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
  cardPressed: {
    backgroundColor: "#1E1A15",
    borderColor: "#D4AF3755",
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardCity: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 13,
    color: "#E8DCC8",
  },
  cardCountry: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 11,
    color: "#6A5A40",
  },
  cardType: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#0D0B07CC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#161412",
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  modalDot: { width: 12, height: 12, borderRadius: 6 },
  modalCity: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 18,
    color: "#E8DCC8",
    letterSpacing: 1,
  },
  modalCountry: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 13,
    color: "#8B7A6A",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0D0B07",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDivider: { height: 1, backgroundColor: "#2A241E", marginBottom: 12 },
  modalPeriod: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#D4AF37",
    letterSpacing: 1,
    marginBottom: 10,
  },
  modalDetail: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    color: "#E8DCC8",
    lineHeight: 24,
  },
});
