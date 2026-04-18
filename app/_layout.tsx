import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();
  const { colors, theme } = useTheme();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const rootSegment = segments[0];

    const inAuth = rootSegment === "(auth)";
    const inOnboarding = rootSegment === "(onboarding)";
    const inTabs = rootSegment === "(tabs)";
    const inWorkout = rootSegment === "workout";
    const inCreateRoutine = rootSegment === "create-routine";
    const inEditRoutine = rootSegment === "edit-routine";

    if (!user && !inAuth) {
      router.replace("/(auth)/login");
      return;
    }

    if (user && !user.onboardingCompleted && !inOnboarding) {
      router.replace("/(onboarding)/welcome");
      return;
    }

    if (
      user &&
      user.onboardingCompleted &&
      !inTabs &&
      !inWorkout &&
      !inCreateRoutine &&
      !inEditRoutine
    ) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="workout" />
        <Stack.Screen name="create-routine" />
        <Stack.Screen name="edit-routine/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
