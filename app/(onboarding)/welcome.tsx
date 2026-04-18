import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center", padding: 24 },
      ]}
    >
      <Text style={styles.title}>Bienvenido a COREX</Text>
      <Text
        style={[styles.subtitle, { textAlign: "center", marginBottom: 24 }]}
      >
        Personalizaremos tu experiencia para mejores resultados
      </Text>

      <Pressable
        style={[
          styles.actionButton,
          styles.primaryButton,
          { paddingHorizontal: 28 },
        ]}
        onPress={() => router.push("/(onboarding)/basic-info")}
      >
        <Text style={[styles.actionText, styles.primaryButtonText]}>
          Comenzar
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
