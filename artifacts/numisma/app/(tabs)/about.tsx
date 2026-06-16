import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
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
        <Text style={styles.logoIcon}>♛</Text>
        <Text style={styles.logoTitle}>Numisma AI</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YAPIMCI</Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>Dr. Ahmet Bora</Text>
          {"\n"}
          Numizmatik, Epigrafi ve İkonografi Uzmanı
          {"\n"}
          20 yıllık Arkeolog
          {"\n"}
          {"\n"}
          Numisma AI, 20 yıllık arkeolojik tecrübemin birikimi olarak
          hazırlanmış, Google Gemini 2.5 Pro destekli, yapay zeka tabanlı
          bir numismatik uygulamasıdır.
          {"\n"}
          {"\n"}
          Fotoğraf tabanlı sikke tanımlama, sahte tespiti, darphane haritası,
          müzayede takibi ve AI danışman hizmetleri sunar.
          {"\n"}
          {"\n"}
          Ürün: numisma.ai · Destek: numisma@ai.com
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HUKUKİ</Text>
        <Text style={styles.para}>
          © 2026 Numisma AI. Tüm hakları saklıdır.{"\n"}
          Ücret iade, gizlilik politikası ve kullanım koşulları
          numisma.ai/legal adresinde görüntülenebilir.
        </Text>
      </View>

      <View style={styles.links}>
        <Pressable style={styles.linkBtn}>
          <Feather name="globe" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>Web Sitesi</Text>
        </Pressable>
        <Pressable style={styles.linkBtn}>
          <Feather name="mail" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>E-posta</Text>
        </Pressable>
        <Pressable style={styles.linkBtn}>
          <Feather name="share-2" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>Uygulamayı Paylaş</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  logoTitle: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 20,
    color: "#D4AF37",
    letterSpacing: 4,
  },
  version: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    color: "#8B7A6A",
    marginTop: 4,
  },
  section: {
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#161412",
  },
  sectionTitle: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#D4AF37",
    letterSpacing: 2,
    marginBottom: 8,
  },
  para: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#E8DCC8",
    lineHeight: 22,
  },
  bold: {
    fontFamily: "Cinzel_600SemiBold",
    color: "#D4AF37",
  },
  links: {
    marginHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#161412",
  },
  linkText: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 13,
    color: "#E8DCC8",
  },
});
