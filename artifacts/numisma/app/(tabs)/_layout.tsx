import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";


function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "camera.viewfinder", selected: "camera.viewfinder" }} />
        <Label>Tara</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="collection">
        <Icon sf={{ default: "archivebox", selected: "archivebox.fill" }} />
        <Label>Koleksiyon</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="timeline">
        <Icon sf={{ default: "clock", selected: "clock.fill" }} />
        <Label>Zaman</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chat">
        <Icon sf={{ default: "bubble.left", selected: "bubble.left.fill" }} />
        <Label>Sohbet</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="premium">
        <Icon sf={{ default: "star", selected: "star.fill" }} />
        <Label>Premium</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="map">
        <Icon sf={{ default: "map", selected: "map.fill" }} />
        <Label>Harita</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="auction">
        <Icon sf={{ default: "hammer", selected: "hammer.fill" }} />
        <Label>Müzayede</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <Icon sf={{ default: "info.circle", selected: "info.circle.fill" }} />
        <Label>Hakkında</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D4AF37",
        tabBarInactiveTintColor: "#8B7A6A",
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#0D0B07",
          borderTopWidth: 1,
          borderTopColor: "#2A241E",
          elevation: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarBackground: () => null,
        tabBarLabelStyle: {
          fontFamily: "JetBrainsMono_400Regular",
          fontSize: 9,
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "TARA",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="camera.viewfinder" tintColor={color} size={24} />
            ) : (
              <Feather name="camera" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "KOLEKSİYON",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="archivebox" tintColor={color} size={24} />
            ) : (
              <Feather name="archive" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: "ZAMAN",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="clock" tintColor={color} size={24} />
            ) : (
              <Feather name="clock" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "SOHBET",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="bubble.left" tintColor={color} size={24} />
            ) : (
              <Feather name="message-circle" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: "PREMIUM",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="star.fill" tintColor={color} size={24} />
            ) : (
              <Feather name="star" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "HARİTA",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="map" tintColor={color} size={24} />
            ) : (
              <Feather name="map" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="auction"
        options={{
          title: "MÜZAYEDE",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="hammer.fill" tintColor={color} size={24} />
            ) : (
              <Feather name="globe" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "HAKKINDA",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="info.circle" tintColor={color} size={24} />
            ) : (
              <Feather name="info" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
