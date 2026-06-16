import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      {/* Logo */}
      <View style={styles.header}>
        <Text style={styles.logoIcon}>♛</Text>
        <Text style={styles.logoTitle}>Numisma AI</Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>

      {/* Yapımcı */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YAPIMCI</Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>Dr. Ahmet Bora</Text>
          {"\n"}Numizmatik · Epigrafi · İkonografi Uzmanı{"\n"}Arkeolog
        </Text>
      </View>

      {/* Hakkında */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HAKKINDA</Text>
        <Text style={styles.para}>
          Numisma AI, arkeoloji alanında edinilmiş 20 yıllık bilgi ve tecrübenin
          ışığında hazırlanmıştır. Antik sikkelerin fotoğraf tabanlı tanımlanması,
          sahte tespiti, darphane coğrafyası ve müzayede takibini tek çatı altında
          toplayan bu uygulama; Google Gemini 2.5 Pro yapay zeka altyapısıyla
          her geçen gün daha doğru ve kapsamlı analizler sunmaktadır.
        </Text>
      </View>

      {/* Teşekkür */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TEŞEKKÜR</Text>
        <Text style={styles.para}>
          Uygulamanın yapım ve geliştirme sürecinde desteklerini hiçbir zaman
          esirgemeyen,{"\n\n"}
          <Text style={styles.bold}>Hayri Karaca</Text>
          {",  "}
          <Text style={styles.bold}>Yusuf Akyol</Text>
          {"  ve  "}
          <Text style={styles.bold}>Sarıhanlı Ferhat</Text>
          {"'a"}{"\n\n"}
          en içten teşekkürlerimi sunarım. Bu proje sizlerin desteği ve inancı
          olmadan bu noktaya gelemezdi.
        </Text>
      </View>

      {/* İletişim */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>İLETİŞİM</Text>
        <Text style={styles.para}>
          Ürün: numisma.ai{"\n"}Destek: numisma@ai.com
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>♛ PREMIUM</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Premium header */}
      <View style={styles.premiumHeader}>
        <Text style={styles.premiumTitle}>NUMISMA PREMIUM</Text>
        <Text style={styles.premiumSub}>
          Koleksiyonunuzu bir üst seviyeye taşıyın
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PREMIUM ÖZELLİKLER</Text>
        {FEATURES.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="check-circle" size={13} color="#D4AF37" />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plansSection}>
        <Text style={[styles.sectionTitle, { marginHorizontal: 16 }]}>
          ABONELİK PAKETLERİ
        </Text>
        {PLANS.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            {plan.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{plan.badge}</Text>
              </View>
            )}
            <View style={styles.planRow}>
              <View
                style={[
                  styles.radioCircle,
                  { borderColor: plan.badge ? "#D4AF37" : "#8B7A6A" },
                ]}
              >
                {plan.badge && <View style={styles.radioInner} />}
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>
              <Text style={styles.planPerMonth}>{plan.perMonth}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Notice */}
      <View style={styles.notice}>
        <Feather name="smartphone" size={13} color="#8B7A6A" />
        <Text style={styles.noticeText}>
          Satın alma Google Play Store üzerinden gerçekleştirilir.
        </Text>
      </View>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [styles.cta, pressed && { opacity: 0.8 }]}
        onPress={() =>
          Linking.openURL(
            "https://play.google.com/store/search?q=numisma+ai&c=apps"
          )
        }
      >
        <Text style={styles.ctaText}>GOOGLE PLAY'DE İNCELE</Text>
      </Pressable>

      {/* Legal */}
      <Text style={styles.legal}>
        Abonelik, Google Play hesabınızdan tahsil edilir. Mevcut dönem sona
        ermeden 24 saat önce otomatik yenilenir.
      </Text>

      {/* Divider */}
      <View style={[styles.dividerRow, { marginTop: 24 }]}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>HUKUKİ</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Legal section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>YASAL BİLGİLER</Text>
        <Text style={styles.para}>
          © 2026 Numisma AI. Tüm hakları saklıdır.{"\n"}
          Gizlilik politikası ve kullanım koşulları numisma.ai/legal
          adresinde görüntülenebilir.
        </Text>
      </View>

      {/* Links */}
      <View style={styles.links}>
        <Pressable
          style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
          onPress={() => Linking.openURL("https://numisma.ai")}
        >
          <Feather name="globe" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>Web Sitesi</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
          onPress={() => Linking.openURL("mailto:numisma@ai.com")}
        >
          <Feather name="mail" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>E-posta</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.7 }]}
          onPress={() =>
            Share.share({
              title: "Numisma AI",
              message:
                "Numisma AI — Antik sikke analizi ve koleksiyon yönetimi uygulaması. Google Gemini 2.5 Pro ile desteklenmiştir. https://numisma.ai",
            })
          }
        >
          <Feather name="share-2" size={16} color="#D4AF37" />
          <Text style={styles.linkText}>Uygulamayı Paylaş</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { alignItems: "center", marginBottom: 24 },
  logoIcon: { fontSize: 48, marginBottom: 8 },
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
    gap: 8,
  },
  sectionTitle: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#D4AF37",
    letterSpacing: 2,
    marginBottom: 4,
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2A241E",
  },
  dividerText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#D4AF37",
    letterSpacing: 2,
  },
  premiumHeader: {
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  premiumTitle: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 18,
    color: "#D4AF37",
    letterSpacing: 3,
    marginBottom: 4,
  },
  premiumSub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#8B7A6A",
    textAlign: "center",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#E8DCC8",
    flex: 1,
  },
  plansSection: {
    marginBottom: 12,
    gap: 8,
  },
  planCard: {
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#161412",
    marginHorizontal: 16,
  },
  badge: {
    position: "absolute",
    top: -10,
    left: 16,
    backgroundColor: "#D4AF37",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 9,
    color: "#0D0B07",
    letterSpacing: 1,
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#D4AF37",
  },
  planInfo: { flex: 1 },
  planLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 12,
    color: "#E8DCC8",
    letterSpacing: 1,
  },
  planPrice: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
    color: "#D4AF37",
    marginTop: 2,
  },
  planPerMonth: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
    textAlign: "right",
    maxWidth: 100,
    lineHeight: 14,
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  noticeText: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 12,
    color: "#8B7A6A",
    flex: 1,
  },
  cta: {
    backgroundColor: "#D4AF37",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  ctaText: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 12,
    color: "#0D0B07",
    letterSpacing: 2,
  },
  legal: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 11,
    color: "#6A5A40",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 8,
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
