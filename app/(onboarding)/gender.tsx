import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function GenderScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const { data, updateData } = useOnboarding();

  const [gender, setGender] = useState<"Hombre" | "Mujer" | "">(
    (data.gender as "Hombre" | "Mujer" | undefined) || "",
  );

  const handleContinue = () => {
    if (!gender) {
      Alert.alert("Dato requerido", "Selecciona un género.");
      return;
    }

    updateData({
      gender,
    });

    router.push("/(onboarding)/goal");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpace} />
      <Text style={styles.titleMedium}>Género</Text>

      <View style={styles.card}>
        {["Hombre", "Mujer"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g as "Hombre" | "Mujer")}
            style={[
              styles.listItem,
              gender === g && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.listItemText,
                gender === g && styles.segmentTextActive,
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
          Continuar
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
