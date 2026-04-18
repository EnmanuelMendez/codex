import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Routine } from "@/models/workout";
import { startWorkoutState } from "@/services/trainingService";
import { saveUserMood } from "@/services/userMoodService";
import { adjustRoutineByMood, MoodId } from "@/utils/moodTraining";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createGlobalStyles } from "../styles/createGlobalStyles";

type MoodOption = {
  id: MoodId;
  name: string;
  description: string;
  icon: string;
};

const MOODS: MoodOption[] = [
  {
    id: "energizado",
    name: "Energizado",
    description: "Aumenta bastante la intensidad",
    icon: "⚡",
  },
  {
    id: "motivado",
    name: "Motivado",
    description: "Aumenta un poco la intensidad",
    icon: "🔥",
  },
  {
    id: "tranquilo",
    name: "Tranquilo",
    description: "Mantiene la rutina igual",
    icon: "🧘",
  },
  {
    id: "cansado",
    name: "Cansado",
    description: "Reduce un poco la intensidad",
    icon: "😴",
  },
  {
    id: "estresado",
    name: "Estresado",
    description: "Reduce un poco la intensidad",
    icon: "😮‍💨",
  },
  {
    id: "feliz",
    name: "Feliz",
    description: "Aumenta un poco la intensidad",
    icon: "😄",
  },
];

export default function MoodTrackingScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const params = useLocalSearchParams();

  const routineParam = Array.isArray(params.routine)
    ? params.routine[0]
    : params.routine;

  let routine: Routine | null = null;
  try {
    routine = routineParam ? JSON.parse(routineParam) : null;
  } catch {
    routine = null;
  }

  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async (skipMood = false) => {
    if (!user || !routine) return;

    try {
      setLoading(true);

      const finalMood = skipMood ? null : selectedMoodId;

      if (finalMood) {
        await saveUserMood(user.id, finalMood);
      }

      const adjustedRoutine = adjustRoutineByMood(routine, finalMood);

      await startWorkoutState(user.id, adjustedRoutine.id);

      router.replace({
        pathname: "/workout",
        params: {
          routine: JSON.stringify(adjustedRoutine),
        },
      });
    } catch (error) {
      console.log("ERROR INICIANDO ENTRENAMIENTO DESDE MOOD:", error);
      Alert.alert("Error", "No se pudo iniciar el entrenamiento.");
    } finally {
      setLoading(false);
    }
  };

  if (!routine) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topSpace} />
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>¿Cómo te sientes?</Text>
          <Text style={styles.subtitle}>
            Selecciona una rutina antes de elegir tu estado de ánimo
          </Text>

          <View style={styles.grid}>
            {MOODS.map((mood) => (
              <View
                key={mood.id}
                style={[styles.moodCard, { opacity: 0.4 }]}
                pointerEvents="none"
              >
                <View style={styles.moodIconCircle}>
                  <Text style={styles.moodIcon}>{mood.icon}</Text>
                </View>
                <Text style={styles.moodCardTitle}>{mood.name}</Text>
                <Text style={styles.moodCardDescription}>
                  {mood.description}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              backgroundColor: `${colors.primary}18`,
              borderWidth: 1,
              borderColor: `${colors.primary}40`,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                styles.subtitle,
                { color: colors.primary, textAlign: "center", marginBottom: 0 },
              ]}
            >
              Ve a la pestaña Rutinas, elige una y pulsa Iniciar para registrar
              tu estado de ánimo.
            </Text>
          </View>

          <Pressable
            style={[styles.actionButton, styles.primaryButton, { opacity: 0.4 }]}
            disabled
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.secondaryButton, { opacity: 0.4 }]}
            disabled
          >
            <Text style={[styles.actionText, styles.secondaryButtonText]}>
              Saltar esta opción
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSpace} />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>¿Cómo te sientes?</Text>
        <Text style={styles.subtitle}>
          Ajustaremos la intensidad de {routine.nombre} según tu estado de ánimo
        </Text>

        <View style={styles.grid}>
          {MOODS.map((mood) => {
            const selected = selectedMoodId === mood.id;

            return (
              <Pressable
                key={mood.id}
                style={[styles.moodCard, selected && styles.moodCardSelected]}
                onPress={() => setSelectedMoodId(mood.id)}
              >
                <View
                  style={[
                    styles.moodIconCircle,
                    selected && {
                      borderColor: colors.primary,
                      backgroundColor: `${colors.primary}23`,
                    },
                  ]}
                >
                  <Text style={styles.moodIcon}>{mood.icon}</Text>
                </View>

                <Text style={styles.moodCardTitle}>{mood.name}</Text>
                <Text style={styles.moodCardDescription}>
                  {mood.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footerTitle}>Tu entrenamiento personalizado</Text>

        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => handleContinue(false)}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>
            {loading ? "Cargando..." : "Continuar"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => handleContinue(true)}
          disabled={loading}
        >
          <Text style={[styles.actionText, styles.secondaryButtonText]}>
            Saltar esta opción
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
