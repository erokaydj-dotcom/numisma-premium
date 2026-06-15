import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Coin } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";

type Props = {
  coin: Coin;
  onFavoriteToggle?: (id: string) => void;
};

const RARITY_COLORS: Record<Coin["rarity"], string> = {
  Common: "#8B7A6A",
  Uncommon: "#6B9E6B",
  Rare: "#4A90D9",
  "Very Rare": "#9B59B6",
  "Extremely Rare": "#C9A84C",
};

export function CoinCard({ coin, onFavoriteToggle }: Props) {
  const colors = useColors();

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/result", params: { id: coin.id } })}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Image
        source={{ uri: coin.imageUri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {coin.name}
          </Text>
          {onFavoriteToggle && (
            <Pressable
              onPress={() => onFavoriteToggle(coin.id)}
              hitSlop={8}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Feather
                name={coin.isFavorite ? "star" : "star"}
                size={16}
                color={coin.isFavorite ? colors.primary : colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>
          {coin.country} · {coin.year}
        </Text>
        <View style={styles.bottomRow}>
          <View
            style={[
              styles.rarityBadge,
              { backgroundColor: RARITY_COLORS[coin.rarity] + "22" },
            ]}
          >
            <Text
              style={[
                styles.rarityText,
                { color: RARITY_COLORS[coin.rarity] },
              ]}
            >
              {coin.rarity}
            </Text>
          </View>
          <Text style={[styles.value, { color: colors.primary }]}>
            {coin.estimatedValue}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  image: {
    width: 90,
    height: 90,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rarityText: {
    fontSize: 11,
    fontWeight: "600",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
