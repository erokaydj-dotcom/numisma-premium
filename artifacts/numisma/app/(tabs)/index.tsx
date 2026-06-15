import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoinCard } from "@/components/CoinCard";
import type { Coin } from "@/context/CollectionContext";
import { useCollection } from "@/context/CollectionContext";
import { useColors } from "@/hooks/useColors";
import { identifyCoin } from "@/utils/coinIdentifier";

const { width } = Dimensions.get("window");

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { coins, addCoin } = useCollection();
  const [scanning, setScanning] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const recentCoins = coins.slice(0, 5);

  async function handleScan() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    setScanning(true);

    try {
      const coin = await identifyCoin(imageUri);
      await addCoin(coin);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({ pathname: "/result", params: { id: coin.id } });
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setScanning(false);
    }
  }

  async function handleCamera() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    setScanning(true);

    try {
      const coin = await identifyCoin(imageUri);
      await addCoin(coin);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({ pathname: "/result", params: { id: coin.id } });
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setScanning(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.appName, { color: colors.primary }]}>
          NUMISMA AI
        </Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          Sikke Tanımlama & Koleksiyon
        </Text>

        <View style={styles.heroSection}>
          <LinearGradient
            colors={["#1A1612", "#0D0B07"]}
            style={styles.heroGradient}
          >
            <View
              style={[
                styles.coinRing,
                { borderColor: colors.primary + "40" },
              ]}
            >
              <View
                style={[
                  styles.coinRingInner,
                  { borderColor: colors.primary + "20" },
                ]}
              >
                <Feather name="camera" size={48} color={colors.primary} />
              </View>
            </View>

            <Text style={[styles.heroTitle, { color: colors.foreground }]}>
              Sikkenizi Tanımlayın
            </Text>
            <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
              Yapay zeka destekli anında tanımlama, değerleme ve envanter
            </Text>

            <View style={styles.actionRow}>
              <Pressable
                onPress={handleCamera}
                disabled={scanning}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Feather name="camera" size={20} color={colors.primary} />
                <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                  Kamera
                </Text>
              </Pressable>

              <Pressable
                onPress={handleScan}
                disabled={scanning}
                style={({ pressed }) => [
                  styles.scanBtn,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed || scanning ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                  },
                ]}
              >
                {scanning ? (
                  <ActivityIndicator color={colors.primaryForeground} size="large" />
                ) : (
                  <Feather name="image" size={28} color={colors.primaryForeground} />
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Feather name="zap" size={20} color={colors.primary} />
                <Text style={[styles.actionBtnLabel, { color: colors.foreground }]}>
                  Hızlı
                </Text>
              </Pressable>
            </View>

            {scanning && (
              <Text style={[styles.scanningText, { color: colors.primary }]}>
                Analiz ediliyor...
              </Text>
            )}
          </LinearGradient>
        </View>

        {recentCoins.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Son Taramalar
              </Text>
              <Pressable onPress={() => router.push("/collection")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  Tümü
                </Text>
              </Pressable>
            </View>
            {recentCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </View>
        )}

        {recentCoins.length === 0 && (
          <View style={styles.emptySection}>
            <View
              style={[
                styles.emptyCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="archive" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                Koleksiyonunuz boş
              </Text>
              <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
                İlk sikkenizi tarayarak başlayın
              </Text>
            </View>
          </View>
        )}

        <View style={styles.statsRow}>
          <StatCard
            colors={colors}
            icon="layers"
            value={coins.length.toString()}
            label="Toplam Sikke"
          />
          <StatCard
            colors={colors}
            icon="star"
            value={coins.filter((c) => c.isFavorite).length.toString()}
            label="Favoriler"
          />
          <StatCard
            colors={colors}
            icon="trending-up"
            value={coins.filter((c) => c.rarity !== "Common").length.toString()}
            label="Nadir"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  colors,
  icon,
  value,
  label,
}: {
  colors: ReturnType<typeof useColors>;
  icon: React.ComponentProps<typeof Feather>["name"];
  value: string;
  label: string;
}) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Feather name={icon} size={16} color={colors.primary} />
      <Text style={[styles.statValue, { color: colors.foreground }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  appName: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 22,
    letterSpacing: 4,
    textAlign: "center",
    marginBottom: 4,
  },
  tagline: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
  },
  heroSection: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 28,
  },
  heroGradient: {
    padding: 28,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C9A84C22",
  },
  coinRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  coinRingInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: "center",
  },
  heroSub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBtn: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  actionBtnLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  scanBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C9A84C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  scanningText: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    marginTop: 16,
    letterSpacing: 1,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 14,
    letterSpacing: 1.5,
  },
  seeAll: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 14,
  },
  emptySection: { marginBottom: 24 },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 9,
    letterSpacing: 0.5,
    textAlign: "center",
  },
});
