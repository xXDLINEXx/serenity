import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AudioProvider } from "@/contexts/AudioContext";
import ErrorBoundary from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="player" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="cdn-player" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="debug-json" options={{ headerShown: true, title: "Debug JSON" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView testID="gesture-root">
        <AudioProvider>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
        </AudioProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
