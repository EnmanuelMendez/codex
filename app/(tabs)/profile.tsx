import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme();

  const [unitSystem, setUnitSystem] = useState<"Métrico" | "Imperial">(
    "Métrico",
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 18,
    },
    space: {
      flex: 0.5,
      paddingTop: 0,
      paddingHorizontal: 0,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 20,
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 6,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: "#1E3650",
      color: colors.text,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    segmentedContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#1E3650",
      padding: 4,
      marginTop: 2,
    },
    segmentButton: {
      flex: 1,
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    segmentButtonActive: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      color: "#AFC0D3",
      fontWeight: "600",
    },
    segmentTextActive: {
      color: colors.background,
      fontWeight: "700",
    },
    actionButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 12,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderColor: colors.primary,
      borderWidth: 1,
    },
    actionText: {
      fontSize: 16,
      fontWeight: "700",
    },
    primaryText: {
      color: colors.background,
    },
    secondaryText: {
      color: colors.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space}></View>
      <Text style={styles.title}>Perfil</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={styles.label}>Cambiar Tema</Text>

        <Pressable
          onPress={toggleTheme}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: "#1E3650",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={theme === "dark" ? "sunny" : "moon"}
            size={22}
            color={colors.primary}
          />
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#8AA0B8"
          style={styles.input}
        />

        <Text style={styles.label}>Peso</Text>
        <TextInput
          placeholder={unitSystem === "Métrico" ? "Ej: 72 kg" : "Ej: 159 lb"}
          placeholderTextColor="#8AA0B8"
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Altura</Text>
        <TextInput
          placeholder={unitSystem === "Métrico" ? "Ej: 175 cm" : "Ej: 5'9\""}
          placeholderTextColor="#8AA0B8"
          style={styles.input}
        />

        <Text style={styles.label}>Sistema de unidades</Text>

        <View style={styles.segmentedContainer}>
          <Pressable
            onPress={() => setUnitSystem("Métrico")}
            style={[
              styles.segmentButton,
              unitSystem === "Métrico" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                unitSystem === "Métrico" && styles.segmentTextActive,
              ]}
            >
              Métrico
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setUnitSystem("Imperial")}
            style={[
              styles.segmentButton,
              unitSystem === "Imperial" && styles.segmentButtonActive,
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                unitSystem === "Imperial" && styles.segmentTextActive,
              ]}
            >
              Imperial
            </Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={[styles.actionButton, styles.primaryButton]}>
        <Text style={[styles.actionText, styles.primaryText]}>
          Guardar cambios
        </Text>
      </Pressable>

      <Pressable
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={[styles.actionText, styles.secondaryText]}>
          Cerrar sesión
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
