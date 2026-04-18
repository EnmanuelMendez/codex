import { useOnboarding } from "@/context/OnboardingContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function BasicInfoScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const { data, updateData } = useOnboarding();

  const [age, setAge] = useState(data.age ? String(data.age) : "");

  const handleContinue = () => {
    const parsedAge = parseInt(age.trim(), 10);

    if (!age.trim() || Number.isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert("Dato inválido", "Ingresa una edad válida.");
      return;
    }

    updateData({
      age: parsedAge,
    });

    router.push("/(onboarding)/body");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpace} />
      <Text style={styles.titleMedium}>Información básica</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Edad"
          placeholderTextColor="#8AA0B8"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          style={styles.inputCompact}
        />
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
