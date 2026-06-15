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

const FLAGS = [
  { code: "TR", flag: "🇹🇷", label: "Türkçe" },
  { code: "EN", flag: "🇬🇧", label: "English" },
  { code: "AR", flag: "🇸🇦", label: "العربية" },
  { code: "RU", flag: "🇷🇺", label: "Русский" },
];

const TIPS = [
  "Sikkeyi düz ve aydınlık bir zemine koyun",
  "Gölge ve yansımalardan kaçının",
  "Sadece sikke kare içinde görünsün",
  "Net odakta, en az 1080p kalitede çekin",
];

type ScanMode = "single" | "both";

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { coins, addCoin } = useCollection();
  const [scanning, setScanning] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>("single");
  const [activeLang, setActiveLang] = useState("TR");

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
      aspect: scanMode === "both" ? [1, 1] : [1, 1],
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
    <View style={[styles.root, { backgroundColor: "#0D0B07" }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 12, paddingBottom: bottomPad + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={[styles.statusBadge, { borderColor: "#27AE60" }]}>
            <Text style={[styles.statusText, { color: "#27AE60" }]}>
              ÇEVRİMİÇİ
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerMeta}>v2.0</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.brandTitle}>NUMISMA AI</Text>
          <Text style={styles.subtitle}>ANCIENT COIN RECOGNITION</Text>
          <Text style={styles.version}>v2.0</Text>
        </View>

        {/* Language Flags */}
        <View style={styles.langRow}>
          {FLAGS.map((f) => (
            <Pressable
              key={f.code}
              onPress={() => {
                setActiveLang(f.code);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.langChip,
                activeLang === f.code && {
                  borderColor: "#D4AF37",
                  backgroundColor: "#D4AF3722",
                },
              ]}
            >
              <Text style={styles.langFlag}>{f.flag}</Text>
              <Text
                style={[
                  styles.langCode,
                  activeLang === f.code && { color: "#D4AF37" },
                ]}
              >
                {f.code}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Scan Mode */}
        <Text style={styles.sectionLabel}>TARAMA MODU</Text>
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => {
              setScanMode("single");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={[
              styles.modeCard,
              scanMode === "single" && {
                borderColor: "#D4AF37",
                backgroundColor: "#D4AF3711",
              },
            ]}
          >
            <Feather name="image" size={20} color={scanMode === "single" ? "#D4AF37" : "#8B7A6A"} />
            <Text
              style={[
                styles.modeTitle,
                scanMode === "single" && { color: "#D4AF37" },
              ]}
            >
              TEK FOTO
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setScanMode("both");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={[
              styles.modeCard,
              scanMode === "both" && {
                borderColor: "#D4AF37",
                backgroundColor: "#D4AF3711",
              },
            ]}
          >
            <Feather name="layers" size={20} color={scanMode === "both" ? "#D4AF37" : "#8B7A6A"} />
            <Text
              style={[
                styles.modeTitle,
                scanMode === "both" && { color: "#D4AF37" },
              ]}
            >
              ÇİFT YÜZ
            </Text>
          </Pressable>
        </View>

        {/* Camera & Gallery Buttons */}
        <View style={styles.actionGrid}>
          <Pressable
            onPress={handleCamera}
            disabled={scanning}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.actionIconBg}>
              <Feather name="camera" size={28} color="#D4AF37" />
            </View>
            <Text style={styles.actionLabel}>KAMERA</Text>
            <Text style={styles.actionSub}>Anlık Çekim</Text>
          </Pressable>

          <Pressable
            onPress={handleScan}
            disabled={scanning}
            style={({ pressed }) => [
              styles.actionCard,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.actionIconBg}>
              <Feather name="image" size={28} color="#D4AF37" />
            </View>
            <Text style={styles.actionLabel}>GALERİ</Text>
            <Text style={styles.actionSub}>Mevcut Foto</Text>
          </Pressable>
        </View>

        {scanning && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator color="#D4AF37" size="large" />
            <Text style={styles.scanningText}>Analiz ediliyor...</Text>
          </View>
        )}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>EN İYİ SONUÇ İÇİN</Text>
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Text style={styles.tipBullet}>✓</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Recent Scans */}
        {recentCoins.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Son Taramalar</Text>
              <Pressable onPress={() => router.push("/collection")}>
                <Text style={styles.seeAll}>Tümü</Text>
              </Pressable>
            </View>
            {recentCoins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {recentCoins.length === 0 && (
          <View style={styles.emptySection}>
            <View style={styles.emptyCard}>
              <Feather name="archive" size={32} color="#8B7A6A" />
              <Text style={styles.emptyTitle}>Koleksiyonunuz boş</Text>
              <Text style={styles.emptySub}>İlk sikkenizi tarayarak başlayın</Text>
            </View>
          </View>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="layers"
            value={coins.length.toString()}
            label="Toplam Sikke"
          />
          <StatCard
            icon="star"
            value={coins.filter((c) => c.isFavorite).length.toString()}
            label="Favoriler"
          />
          <StatCard
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
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Feather name={icon} size={16} color="#D4AF37" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 16 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerMeta: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
  },

  titleSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: "Cinzel_700Bold",
    fontSize: 24,
    color: "#D4AF37",
    letterSpacing: 6,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 8,
    color: "#8B7A6A",
    letterSpacing: 3,
    marginTop: 4,
    textAlign: "center",
  },
  version: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#8B7A6A",
    marginTop: 2,
  },

  langRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  langChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  langFlag: {
    fontSize: 14,
  },
  langCode: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#8B7A6A",
  },

  sectionLabel: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
    letterSpacing: 2,
    marginBottom: 8,
  },

  modeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  modeCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#161412",
    gap: 8,
  },
  modeTitle: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 11,
    color: "#8B7A6A",
    letterSpacing: 2,
  },

  actionGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#161412",
    gap: 8,
  },
  actionIconBg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#D4AF37",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 11,
    color: "#E8DCC8",
    letterSpacing: 2,
  },
  actionSub: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#8B7A6A",
    letterSpacing: 0.5,
  },

  scanningOverlay: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  scanningText: {
    fontFamily: "CormorantGaramond_400Regular_Italic",
    fontSize: 14,
    color: "#D4AF37",
    letterSpacing: 1,
  },

  tipsCard: {
    borderWidth: 1,
    borderColor: "#2A241E",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#161412",
    marginBottom: 16,
  },
  tipsTitle: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 9,
    color: "#D4AF37",
    letterSpacing: 2,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 10,
    color: "#D4AF37",
    marginTop: 2,
  },
  tipText: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 10,
    color: "#8B7A6A",
    lineHeight: 16,
    flex: 1,
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
    color: "#E8DCC8",
  },
  seeAll: {
    fontFamily: "CormorantGaramond_600SemiBold",
    fontSize: 14,
    color: "#D4AF37",
  },

  emptySection: { marginBottom: 24 },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A241E",
    padding: 32,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#161412",
  },
  emptyTitle: {
    fontFamily: "Cinzel_600SemiBold",
    fontSize: 15,
    letterSpacing: 0.5,
    color: "#E8DCC8",
  },
  emptySub: {
    fontFamily: "CormorantGaramond_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: "#8B7A6A",
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
    borderColor: "#2A241E",
    padding: 14,
    alignItems: "center",
    gap: 6,
    backgroundColor: "#161412",
  },
  statValue: {
    fontFamily: "JetBrainsMono_700Bold",
    fontSize: 20,
    color: "#E8DCC8",
  },
  statLabel: {
    fontFamily: "Cinzel_400Regular",
    fontSize: 9,
    letterSpacing: 0.5,
    textAlign: "center",
    color: "#8B7A6A",
  },
});
