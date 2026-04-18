import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function GoalScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const { data, updateData } = useOnboarding();

  const [goal, setGoal] = useState(data.goal || "");

  const goals = ["Perder grasa", "Ganar músculo", "Mantenerse"];

  const handleContinue = () => {
    if (!goal) {
      Alert.alert("Dato requerido", "Selecciona un objetivo.");
      return;
    }

    updateData({
      goal,
    });

    router.push("/(onboarding)/complete");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpace} />
      <Text style={styles.titleMedium}>Objetivo</Text>

      <View style={styles.card}>
        {goals.map((g) => (
          <Pressable
            key={g}
            onPress={() => setGoal(g)}
            style={[styles.listItem, goal === g && styles.segmentButtonActive]}
          >
            <Text
              style={[
                styles.listItemText,
                goal === g && styles.segmentTextActive,
              ]}
            >
              {g}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.flexFill} />

      <Pressable
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleContinue}
      >
        <Text style={[styles.actionText, styles.primaryButtonText]}>
          Finalizar
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
