import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function BodyScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const { data, updateData } = useOnboarding();

  const [weight, setWeight] = useState(data.weight || "");
  const [height, setHeight] = useState(data.height || "");
  const [unit, setUnit] = useState<"Métrico" | "Imperial">(
    data.unitSystem || "Métrico",
  );

  const handleContinue = () => {
    if (!weight.trim()) {
      Alert.alert("Dato requerido", "Ingresa tu peso.");
      return;
    }

    if (!height.trim()) {
      Alert.alert("Dato requerido", "Ingresa tu altura.");
      return;
    }

    updateData({
      weight: weight.trim(),
      height: height.trim(),
      unitSystem: unit,
    });

    router.push("/(onboarding)/gender");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpace} />
      <Text style={styles.titleMedium}>Tu cuerpo</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Peso"
          placeholderTextColor="#8AA0B8"
          value={weight}
          onChangeText={setWeight}
          style={styles.inputCompact}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Altura"
          placeholderTextColor="#8AA0B8"
          value={height}
          onChangeText={setHeight}
          style={styles.inputCompact}
          keyboardType="numeric"
        />

        <View style={styles.row}>
          <Pressable
            onPress={() => setUnit("Métrico")}
            style={[
              styles.segmentButtonCompact,
              unit === "Métrico" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                unit === "Métrico" && styles.segmentTextActive,
              ]}
            >
              Métrico
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setUnit("Imperial")}
            style={[
              styles.segmentButtonCompact,
              unit === "Imperial" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                unit === "Imperial" && styles.segmentTextActive,
              ]}
            >
              Imperial
            </Text>
          </Pressable>
        </View>
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
