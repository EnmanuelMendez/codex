import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type MoodOption = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

const MOODS: MoodOption[] = [
  {
    id: "energizado",
    name: "Energizado",
    description: "¡Listo para darlo todo!",
    icon: "⚡",
  },
  {
    id: "motivado",
    name: "Motivado",
    description: "Me siento inspirado",
    icon: "🔥",
  },
  {
    id: "tranquilo",
    name: "Tranquilo",
    description: "Paz y equilibrio",
    icon: "🧘",
  },
  {
    id: "cansado",
    name: "Cansado",
    description: "Poca energía hoy",
    icon: "😴",
  },
  {
    id: "estresado",
    name: "Estresado",
    description: "Necesito relajarme",
    icon: "😮‍💨",
  },
  { id: "feliz", name: "Feliz", description: "¡Me siento genial!", icon: "😄" },
];

export default function MoodTrackingScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 28,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "700",
    },
    subtitle: {
      color: colors.secondaryText,
      marginTop: 6,
      marginBottom: 18,
      fontSize: 14,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: 12,
    },
    card: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#1E3650",
      paddingVertical: 14,
      paddingHorizontal: 12,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    cardSelected: {
      borderColor: colors.primary,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#0E1F31",
      borderWidth: 1,
      borderColor: "#2A4360",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    iconCircleSelected: {
      borderColor: colors.primary,
      backgroundColor: "rgba(163,255,18,0.14)",
    },
    icon: {
      fontSize: 24,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
      textAlign: "center",
    },
    cardDescription: {
      color: colors.secondaryText,
      fontSize: 12,
      textAlign: "center",
      lineHeight: 16,
    },
    footerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginTop: 22,
      marginBottom: 10,
    },
    continueButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
    },
    continueButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "800",
    },
    space: {
      flex: 0,
      paddingTop: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>¿Cómo te sientes?</Text>
        <Text style={styles.subtitle}>
          Personalicemos tu entrenamiento según tu estado de ánimo
        </Text>

        <View style={styles.grid}>
          {MOODS.map((mood) => {
            const selected = selectedMoodId === mood.id;

            return (
              <Pressable
                key={mood.id}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => setSelectedMoodId(mood.id)}
              >
                <View
                  style={[
                    styles.iconCircle,
                    selected && styles.iconCircleSelected,
                  ]}
                >
                  <Text style={styles.icon}>{mood.icon}</Text>
                </View>

                <Text style={styles.cardTitle}>{mood.name}</Text>
                <Text style={styles.cardDescription}>{mood.description}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footerTitle}>Tu entrenamiento personalizado</Text>

        <Pressable
          style={styles.continueButton}
          onPress={() => router.push("/(tabs)")}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
