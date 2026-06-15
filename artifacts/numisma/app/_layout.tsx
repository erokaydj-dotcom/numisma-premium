import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
  useFonts as useCinzelFonts,
} from "@expo-google-fonts/cinzel";
import {
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_600SemiBold,
  useFonts as useCormorantFonts,
} from "@expo-google-fonts/cormorant-garamond";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
  useFonts as useJetBrainsFonts,
} from "@expo-google-fonts/jetbrains-mono";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CollectionProvider } from "@/context/CollectionContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="result"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [cinzelLoaded, cinzelError] = useCinzelFonts({
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
  });
  const [cormorantLoaded, cormorantError] = useCormorantFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_400Regular_Italic,
    CormorantGaramond_600SemiBold,
  });
  const [jetbrainsLoaded, jetbrainsError] = useJetBrainsFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const fontsLoaded = cinzelLoaded && cormorantLoaded && jetbrainsLoaded;
  const fontError = cinzelError || cormorantError || jetbrainsError;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <CollectionProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </CollectionProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
