import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoinCard } from "@/components/CoinCard";
import type { Coin } from "@/context/CollectionContext";
import { useCollection } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";

type SortOption = "newest" | "oldest" | "value" | "favorites";

export default function CollectionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { coins, toggleFavorite } = useCollection();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [filterFavorites, setFilterFavorites] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filtered = useMemo(() => {
    let list = [...coins];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.year.includes(q)
      );
    }

    if (filterFavorites) {
      list = list.filter((c) => c.isFavorite);
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => b.identifiedAt - a.identifiedAt);
        break;
      case "oldest":
        list.sort((a, b) => a.identifiedAt - b.identifiedAt);
        break;
      case "favorites":
        list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        break;
    }

    return list;
  }, [coins, search, sort, filterFavorites]);

  async function handleFavorite(id: string) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(id);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          KOLEKSİYON
        </Text>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>
          {coins.length} sikke
        </Text>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Ara..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilterFavorites((v) => !v)}
            style={[
              styles.filterChip,
              {
                backgroundColor: filterFavorites
                  ? colors.primary + "22"
                  : colors.card,
                borderColor: filterFavorites ? colors.primary : colors.border,
              },
            ]}
          >
            <Feather
              name="star"
              size={12}
              color={filterFavorites ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.filterChipText,
                {
                  color: filterFavorites
                    ? colors.primary
                    : colors.mutedForeground,
                },
              ]}
            >
              Favoriler
            </Text>
          </Pressable>

          {(["newest", "oldest", "favorites"] as SortOption[]).map((s) => {
            const labels: Record<SortOption, string> = {
              newest: "Yeni",
              oldest: "Eski",
              value: "Değer",
              favorites: "Favori",
            };
            const active = sort === s;
            return (
              <Pressable
                key={s}
                onPress={() => setSort(s)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? colors.primary + "22"
                      : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: active ? colors.primary : colors.mutedForeground },
                  ]}
                >
                  {labels[s]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoinCard coin={item} onFavoriteToggle={handleFavorite} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 84 },
        ]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="archive" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {search || filterFavorites ? "Sonuç bulunamadı" : "Koleksiyon boş"}
            </Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              {search || filterFavorites
                ? "Farklı bir arama deneyin"
                : "Tara sekmesinden sikke ekleyin"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 18,
    letterSpacing: 4,
    marginBottom: 2,
  },
  count: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 13,
    marginBottom: 14,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "CormorantGaramond_400Regular",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  list: { paddingHorizontal: 20, paddingTop: 16 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
});
