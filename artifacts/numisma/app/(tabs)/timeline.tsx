import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCollection } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";

function parseYear(raw?: string | null): number {
  if (!raw) return 0;
  const match = raw.match(/-?\d+/);
  return match ? parseInt(match[0]) : 0;
}

export default function TimelineScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { coins } = useCollection();

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const sorted = useMemo(() => {
    return [...coins].sort((a, b) => parseYear(a.year) - parseYear(b.year));
  }, [coins]);

  if (sorted.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: "#0D0B07" }]}>
        <View style={[styles.empty, { paddingTop: topPad + 80 }]}>
          <Feather name="clock" size={40} color="#8B7A6A" />
          <Text style={styles.emptyTitle}>Zaman Tüneli Boş</Text>
          <Text style={styles.emptySub}>
            Koleksiyonunuza sikke ekledikçe zaman tüneli oluşur.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: "#0D0B07" }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: "#D4AF37" }]}>
          ZAMAN TÜNELİ
        </Text>
        <Text style={[styles.count, { color: "#8B7A6A" }]}>
          {sorted.length} sikke
        </Text>
      </View>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          {
            paddingBottom:
              Platform.OS === "web" ? 34 + 84 : insets.bottom + 84,
          },
        ]}
        renderItem={({ item }) => {
          const year = parseYear(item.year);
          return (
            <Pressable
              onPress={() =>
                router.push({ pathname: "/result", params: { id: item.id } })
              }
              style={({ pressed }) => [
                styles.card,
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.yearDot}>
                <Text style={styles.yearText}>{item.year || "?"}</Text>
                {year !== 0 && (
                  <Text style={styles.yearEra}>
                    {year < 0 ? `MÖ ${Math.abs(year)}` : `MS ${year}`}
                  </Text>
                )}
              </View>
              <View style={styles.cardLine} />
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.country} · {item.rarity}
                </Text>
              </View>
            </Pressable>
          );
        }}
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
    borderBottomColor: "#2A241E",
  },
  title: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 18,
    letterSpacing: 4,
  },
  count: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  list: { paddingHorizontal: 20, paddingTop: 16 },
  empty: {
    flex: 1,
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 16,
    color: "#D4AF37",
    letterSpacing: 0.5,
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    color: "#8B7A6A",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  yearDot: {
    width: 56,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  yearText: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 12,
    color: "#D4AF37",
  },
  yearEra: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#6A5A40",
    marginTop: 2,
  },
  cardLine: {
    width: 2,
    backgroundColor: "#2A241E",
    borderRadius: 1,
    flex: 1,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: "#2A241E",
  },
  name: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 13,
    color: "#E8DCC8",
  },
  meta: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#8B7A6A",
    marginTop: 2,
  },
});
