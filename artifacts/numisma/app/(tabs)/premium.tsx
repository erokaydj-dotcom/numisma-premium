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

import { useColors } from "@/hooks/useColors";

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
    badgeColor: "#D4AF37",
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

export default function PremiumScreen() {
  const colors = useColors();
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.crownIcon}>♛</Text>
        <Text style={[styles.title, { color: "#D4AF37" }]}>
          NUMISMA PREMIUM
        </Text>
        <Text style={styles.subtitle}>
          Antik sikke koleksiyonunuzu bir üst seviyeye taşıyın
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresCard}>
        {FEATURES.map((f) => (
          <View key={f} style={styles.featureRow}>
            <Feather name="check-circle" size={14} color="#D4AF37" />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plansSection}>
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
                  {
                    borderColor: plan.badge ? "#D4AF37" : "#8B7A6A",
                  },
                ]}
              >
                {plan.badge && (
                  <View style={styles.radioInner} />
                )}
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

      {/* Mobile Notice */}
      <View style={styles.notice}>
        <Feather name="smartphone" size={14} color="#8B7A6A" />
        <Text style={styles.noticeText}>
          Satın alma işlemi Google Play Store üzerinden gerçekleştirilir.
          Numisma AI mobil uygulamasını indirin.
        </Text>
      </View>

      {/* CTA */}
      <Pressable style={styles.cta}>
        <Text style={styles.ctaText}>GOOGLE PLAY'DE İNCELE</Text>
      </Pressable>

      {/* Legal */}
      <Text style={styles.legal}>
        Abonelik, Google Play hesabınızdan tahsil edilir. Mevcut dönem sona
        ermeden 24 saat önce otomatik olarak yenilenir. Google Play
        ayarlarından iptal edebilirsiniz.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  crownIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  title: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 20,
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    color: "#8B7A6A",
    textAlign: "center",
  },
  featuresCard: {
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    backgroundColor: "#161412",
    marginBottom: 24,
    gap: 10,
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
  },
  plansSection: {
    marginHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#161412",
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
  planInfo: {
    flex: 1,
  },
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
  cta: {
    backgroundColor: "#D4AF37",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    alignItems: "center",
    marginBottom: 12,
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
  },
});
