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

import { useCollection } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";

const RARITY_COLORS: Record<string, string> = {
  Common: "#8B7A6A",
  Uncommon: "#6B9E6B",
  Rare: "#4A90D9",
  "Very Rare": "#9B59B6",
  "Extremely Rare": "#C9A84C",
};

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
            <Text style={[styles.backLink, { color: colors.primary }]}>
              Geri dön
            </Text>
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
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
            removeCoin(coin!.id);
            router.back();
          },
        },
      ]
    );
  }

  const rarityColor = RARITY_COLORS[coin.rarity] ?? colors.mutedForeground;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: coin.imageUri }}
            style={styles.coinImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", colors.background]}
            style={styles.imageGradient}
          />

          <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.topBarBtn,
                {
                  backgroundColor: colors.card + "CC",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable
                onPress={handleFavorite}
                style={({ pressed }) => [
                  styles.topBarBtn,
                  {
                    backgroundColor: colors.card + "CC",
                    opacity: pressed ? 0.7 : 1,
                  },
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
                  {
                    backgroundColor: colors.card + "CC",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Feather name="trash-2" size={20} color={colors.destructive} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.nameRow}>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "22" }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {coin.rarity}
              </Text>
            </View>
          </View>

          <Text style={[styles.coinName, { color: colors.foreground }]}>
            {coin.name}
          </Text>
          <Text style={[styles.coinMeta, { color: colors.mutedForeground }]}>
            {coin.country} · {coin.year} · {coin.denomination}
          </Text>

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
            <Text style={[styles.gradeText, { color: colors.mutedForeground }]}>
              {coin.grade}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Özellikler
          </Text>

          <View
            style={[
              styles.specsGrid,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <SpecRow label="Bileşim" value={coin.composition} colors={colors} />
            <SpecRow label="Çap" value={coin.diameter} colors={colors} divider />
            <SpecRow label="Ağırlık" value={coin.weight} colors={colors} divider />
            <SpecRow label="Durum" value={coin.grade} colors={colors} divider />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            Açıklama
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {coin.description}
          </Text>
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
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
      <View style={styles.specRow}>
        <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
          {label}
        </Text>
        <Text style={[styles.specValue, { color: colors.foreground }]}>
          {value}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {},
  center: { flex: 1, alignItems: "center", gap: 12, paddingHorizontal: 20 },
  notFoundText: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  backLink: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 16,
  },
  imageContainer: {
    height: 320,
    position: "relative",
  },
  coinImage: {
    width: "100%",
    height: 320,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
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
  topBarRight: {
    flexDirection: "row",
    gap: 8,
  },
  content: {
    padding: 20,
  },
  nameRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  coinName: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 24,
    letterSpacing: 0.5,
    marginBottom: 6,
    lineHeight: 32,
  },
  coinMeta: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 16,
    marginBottom: 20,
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
  valueAmount: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 32,
    marginBottom: 6,
  },
  gradeText: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 12,
    marginTop: 4,
  },
  specsGrid: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
    overflow: "hidden",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  specLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  specValue: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 13,
  },
  description: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    lineHeight: 24,
  },
});
