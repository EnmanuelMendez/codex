import { useAuth } from "@/context/AuthContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function CompleteScreen() {
  const { completeOnboarding } = useAuth();
  const { data, resetData } = useOnboarding();
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    try {
      setLoading(true);

      await completeOnboarding({
        age: data.age,
        weight: data.weight,
        height: data.height,
        unitSystem: data.unitSystem,
        gender: data.gender,
        goal: data.goal,
      });

      resetData();
      router.replace("/(tabs)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.centeredContainer}>
      <Text style={styles.titleMedium}>Todo listo 🚀</Text>

      <Pressable
        style={[
          styles.actionButton,
          styles.primaryButton,
          { paddingHorizontal: 28 },
        ]}
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Ir al inicio
          </Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}
