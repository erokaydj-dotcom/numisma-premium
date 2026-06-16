import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AuctionPrice } from "@/context/CollectionContext";
import { useCollection } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";

const RARITY_COLORS: Record<string, string> = {
  Common: "#8B7A6A",
  Uncommon: "#6B9E6B",
  Rare: "#4A90D9",
  "Very Rare": "#9B59B6",
  "Extremely Rare": "#D4AF37",
};

const VERDICT_COLORS: Record<string, string> = {
  ORIJINAL: "#6B9E6B",
  SAHTE: "#E74C3C",
  BELIRSIZ: "#E67E22",
};

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("tr-TR", { year: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getCoin, removeCoin, toggleFavorite } = useCollection();

  const coin = getCoin(id ?? "");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!coin) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.center, { paddingTop: topPad + 80 }]}>
          <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.foreground }]}>
            Sikke bulunamadı
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: colors.primary }]}>Geri dön</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  async function handleFavorite() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(coin!.id);
  }

  async function handleDelete() {
    Alert.alert(
      "Sil",
      `"${coin!.name}" koleksiyondan kaldırılsın mı?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            removeCoin(coin!.id);
            router.back();
          },
        },
      ]
    );
  }

  const rarityColor = RARITY_COLORS[coin.rarity] ?? colors.mutedForeground;
  const verdictColor =
    coin.verdict ? (VERDICT_COLORS[coin.verdict] ?? "#8B7A6A") : "#8B7A6A";

  const auctionPrices: AuctionPrice[] = coin.auctionPrices ?? [];
  const sortedPrices = [...auctionPrices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const maxPrice = auctionPrices.length
    ? Math.max(...auctionPrices.map((p) => p.priceUSD))
    : null;
  const avgPrice = auctionPrices.length
    ? Math.round(auctionPrices.reduce((s, p) => s + p.priceUSD, 0) / auctionPrices.length)
    : null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Coin image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: coin.imageUri }} style={styles.coinImage} contentFit="cover" />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.imageGradient}
          />
          <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.topBarBtn,
                { backgroundColor: colors.card + "CC", opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable
                onPress={handleFavorite}
                style={({ pressed }) => [
                  styles.topBarBtn,
                  { backgroundColor: colors.card + "CC", opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather
                  name="star"
                  size={20}
                  color={coin.isFavorite ? colors.primary : colors.foreground}
                />
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                  styles.topBarBtn,
                  { backgroundColor: colors.card + "CC", opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather name="trash-2" size={20} color={colors.destructive} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Badges */}
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: rarityColor + "22" }]}>
              <Text style={[styles.badgeText, { color: rarityColor }]}>{coin.rarity}</Text>
            </View>
            {coin.verdict && (
              <View style={[styles.badge, { backgroundColor: verdictColor + "22" }]}>
                <Feather
                  name={coin.verdict === "ORIJINAL" ? "check-circle" : "alert-triangle"}
                  size={10}
                  color={verdictColor}
                />
                <Text style={[styles.badgeText, { color: verdictColor }]}>{coin.verdict}</Text>
              </View>
            )}
            {coin.confidenceScore != null && (
              <View style={[styles.badge, { backgroundColor: "#D4AF3722" }]}>
                <Text style={[styles.badgeText, { color: "#D4AF37" }]}>
                  {coin.confidenceScore}% güven
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.coinName, { color: colors.foreground }]}>{coin.name}</Text>
          <Text style={[styles.coinMeta, { color: colors.mutedForeground }]}>
            {[coin.culture, coin.period, coin.year].filter(Boolean).join(" · ")}
          </Text>

          {/* Value box */}
          <View
            style={[
              styles.valueBox,
              { backgroundColor: colors.card, borderColor: colors.primary + "40" },
            ]}
          >
            <Text style={[styles.valueLabel, { color: colors.mutedForeground }]}>
              TAHMİNİ DEĞER
            </Text>
            <Text style={[styles.valueAmount, { color: colors.primary }]}>
              {coin.estimatedValue}
            </Text>
            <View style={styles.valueRow}>
              <Text style={[styles.gradeText, { color: colors.mutedForeground }]}>
                {coin.grade}
              </Text>
              {coin.authenticityScore != null && (
                <View style={styles.authRow}>
                  <View
                    style={[
                      styles.authBar,
                      {
                        backgroundColor: "#2A241E",
                        width: 60,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.authFill,
                        {
                          width: `${coin.authenticityScore}%` as unknown as number,
                          backgroundColor: verdictColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.authScore, { color: verdictColor }]}>
                    {coin.authenticityScore}%
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Auction prices */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            MÜZAYEDE FİYATLARI
          </Text>

          {auctionPrices.length > 0 ? (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              {/* Summary row */}
              <View style={styles.auctionSummary}>
                <View style={styles.auctionSummaryItem}>
                  <Text style={[styles.auctionSummaryLabel, { color: colors.mutedForeground }]}>
                    Son Satış
                  </Text>
                  <Text style={[styles.auctionSummaryValue, { color: colors.primary }]}>
                    {sortedPrices[0] ? formatUSD(sortedPrices[0].priceUSD) : "—"}
                  </Text>
                  <Text style={[styles.auctionHouse, { color: colors.mutedForeground }]}>
                    {sortedPrices[0]?.house ?? ""}
                  </Text>
                </View>
                <View style={styles.auctionDividerV} />
                <View style={styles.auctionSummaryItem}>
                  <Text style={[styles.auctionSummaryLabel, { color: colors.mutedForeground }]}>
                    Ortalama
                  </Text>
                  <Text style={[styles.auctionSummaryValue, { color: colors.foreground }]}>
                    {avgPrice ? formatUSD(avgPrice) : "—"}
                  </Text>
                  <Text style={[styles.auctionHouse, { color: colors.mutedForeground }]}>
                    {auctionPrices.length} kayıt
                  </Text>
                </View>
                <View style={styles.auctionDividerV} />
                <View style={styles.auctionSummaryItem}>
                  <Text style={[styles.auctionSummaryLabel, { color: colors.mutedForeground }]}>
                    En Yüksek
                  </Text>
                  <Text style={[styles.auctionSummaryValue, { color: colors.primary }]}>
                    {maxPrice ? formatUSD(maxPrice) : "—"}
                  </Text>
                  <Text style={[styles.auctionHouse, { color: colors.mutedForeground }]}>
                    {coin.valueCurrency ?? "USD"}
                  </Text>
                </View>
              </View>

              {/* Records */}
              <View style={[styles.auctionDividerH, { backgroundColor: colors.border }]} />
              {sortedPrices.map((p, i) => (
                <React.Fragment key={`${p.house}-${p.date}`}>
                  {i > 0 && (
                    <View style={[styles.auctionDividerH, { backgroundColor: colors.border }]} />
                  )}
                  <View style={styles.auctionRecord}>
                    <View style={styles.auctionRecordLeft}>
                      <Text style={[styles.auctionRecordHouse, { color: colors.foreground }]}>
                        {p.house}
                      </Text>
                      <Text style={[styles.auctionRecordDate, { color: colors.mutedForeground }]}>
                        {formatDate(p.date)}
                      </Text>
                    </View>
                    <Text style={[styles.auctionRecordPrice, { color: colors.primary }]}>
                      {formatUSD(p.priceUSD)}
                    </Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.auctionSummary}>
                {coin.estimatedValueMin != null && (
                  <View style={styles.auctionSummaryItem}>
                    <Text style={[styles.auctionSummaryLabel, { color: colors.mutedForeground }]}>
                      Min Tahmin
                    </Text>
                    <Text style={[styles.auctionSummaryValue, { color: colors.foreground }]}>
                      {formatUSD(coin.estimatedValueMin)}
                    </Text>
                  </View>
                )}
                {coin.estimatedValueMax != null && (
                  <>
                    <View style={styles.auctionDividerV} />
                    <View style={styles.auctionSummaryItem}>
                      <Text
                        style={[styles.auctionSummaryLabel, { color: colors.mutedForeground }]}
                      >
                        Maks Tahmin
                      </Text>
                      <Text style={[styles.auctionSummaryValue, { color: colors.primary }]}>
                        {formatUSD(coin.estimatedValueMax)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
              <View style={[styles.auctionDividerH, { backgroundColor: colors.border }]} />
              <View style={styles.auctionRecord}>
                <Text style={[styles.noDataText, { color: colors.mutedForeground }]}>
                  Kayıtlı müzayede verisi bulunamadı
                </Text>
              </View>
            </View>
          )}

          {/* Specs */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ÖZELLİKLER</Text>
          <View
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <SpecRow label="Bileşim" value={coin.composition} colors={colors} />
            <SpecRow label="Çap" value={coin.diameter} colors={colors} divider />
            <SpecRow label="Ağırlık" value={coin.weight} colors={colors} divider />
            <SpecRow label="Sınıf" value={coin.grade} colors={colors} divider />
            <SpecRow label="Nominal" value={coin.denomination} colors={colors} divider />
            {coin.mint && (
              <SpecRow label="Darphane" value={coin.mint} colors={colors} divider />
            )}
            {coin.ruler && (
              <SpecRow label="Hükümdar" value={coin.ruler} colors={colors} divider />
            )}
          </View>

          {/* Obverse / Reverse */}
          {(coin.obverse || coin.reverse) && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                ÖN / ARKA YÜZ
              </Text>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {coin.obverse && (
                  <View style={styles.faceRow}>
                    <View style={[styles.faceLabelBox, { backgroundColor: "#D4AF3722" }]}>
                      <Text style={[styles.faceLabelText, { color: "#D4AF37" }]}>ÖN</Text>
                    </View>
                    <Text style={[styles.faceDesc, { color: colors.foreground }]}>
                      {coin.obverse}
                    </Text>
                  </View>
                )}
                {coin.obverse && coin.reverse && (
                  <View style={[styles.auctionDividerH, { backgroundColor: colors.border }]} />
                )}
                {coin.reverse && (
                  <View style={styles.faceRow}>
                    <View style={[styles.faceLabelBox, { backgroundColor: "#4A90D922" }]}>
                      <Text style={[styles.faceLabelText, { color: "#4A90D9" }]}>ARKA</Text>
                    </View>
                    <Text style={[styles.faceDesc, { color: colors.foreground }]}>
                      {coin.reverse}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {/* Historical context */}
          {coin.historicalContext && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                TARİHSEL BAĞLAM
              </Text>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.description, { color: colors.mutedForeground }]}>
                  {coin.historicalContext}
                </Text>
              </View>
            </>
          )}

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>AÇIKLAMA</Text>
          <View
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.description, { color: colors.mutedForeground }]}>
              {coin.description}
            </Text>
            {coin.gradingNotes && (
              <Text style={[styles.gradingNotes, { color: colors.mutedForeground }]}>
                {"\n"}📋 {coin.gradingNotes}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SpecRow({
  label,
  value,
  colors,
  divider,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
  divider?: boolean;
}) {
  return (
    <>
      {divider && (
        <View style={[styles.auctionDividerH, { backgroundColor: colors.border }]} />
      )}
      <View style={styles.specRow}>
        <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.specValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {},
  center: { flex: 1, alignItems: "center", gap: 12, paddingHorizontal: 20 },
  notFoundText: { fontFamily: "Cinzel_600SemiBold", fontSize: 18, letterSpacing: 0.5 },
  backLink: { fontFamily: "CormorantGaramond_400Regular", fontSize: 16 },
  imageContainer: { height: 320, position: "relative" },
  coinImage: { width: "100%", height: 320 },
  imageGradient: { position: "absolute", bottom: 0, left: 0, right: 0, height: 120 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  topBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarRight: { flexDirection: "row", gap: 8 },
  content: { padding: 20 },
  badgeRow: { flexDirection: "row", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontFamily: "Cinzel_400Regular", fontSize: 9, letterSpacing: 1 },
  coinName: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: 6,
    lineHeight: 30,
  },
  coinMeta: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  valueBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  valueLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  valueAmount: { fontFamily: "JetBrainsMono_700Bold", fontSize: 28, marginBottom: 8 },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  gradeText: { fontFamily: "CormorantGaramond_400Regular", fontSize: 14 },
  authRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  authBar: { height: 4, borderRadius: 2, overflow: "hidden" },
  authFill: { height: 4, borderRadius: 2 },
  authScore: { fontFamily: "JetBrainsMono_400Regular", fontSize: 11 },
  sectionTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 4,
  },
  card: { borderRadius: 14, borderWidth: 1, marginBottom: 24, overflow: "hidden" },
  auctionSummary: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  auctionSummaryItem: { flex: 1, alignItems: "center", gap: 2 },
  auctionSummaryLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 9,
    letterSpacing: 1,
  },
  auctionSummaryValue: { fontFamily: "JetBrainsMono_400Regular", fontSize: 14 },
  auctionHouse: { fontFamily: "CormorantGaramond_400Regular", fontSize: 11 },
  auctionDividerV: { width: 1, backgroundColor: "#2A241E", marginVertical: 4 },
  auctionDividerH: { height: 1 },
  auctionRecord: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  auctionRecordLeft: { gap: 2 },
  auctionRecordHouse: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  auctionRecordDate: { fontFamily: "CormorantGaramond_400Regular", fontSize: 12 },
  auctionRecordPrice: { fontFamily: "JetBrainsMono_400Regular", fontSize: 14 },
  noDataText: { fontFamily: "CormorantGaramond_400Regular", fontSize: 13 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  specLabel: { fontFamily: "Cinzel_400Regular", fontSize: 11, letterSpacing: 0.5 },
  specValue: { fontFamily: "JetBrainsMono_400Regular", fontSize: 12, maxWidth: "60%" },
  faceRow: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    alignItems: "flex-start",
  },
  faceLabelBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
  },
  faceLabelText: { fontFamily: "Cinzel_700Bold", fontSize: 9, letterSpacing: 1 },
  faceDesc: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  description: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    lineHeight: 24,
    padding: 16,
  },
  gradingNotes: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 13,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
