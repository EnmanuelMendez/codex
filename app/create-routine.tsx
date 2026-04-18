import { t } from "@/app/locales/translations";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ExerciseCatalogItem } from "@/models/workout";
import {
  addRoutineExercise,
  createRoutineDraft,
  getAvailableExercises,
  getRoutineExercises,
  updateRoutine,
} from "@/services/routineService";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { createGlobalStyles } from "./styles/createGlobalStyles";

export default function CreateRoutineScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [routineName, setRoutineName] = useState("");
  const [restSeconds, setRestSeconds] = useState("60");
  const [catalog, setCatalog] = useState<ExerciseCatalogItem[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("12");
  const [routineId, setRoutineId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedExercise = catalog.find((x) => x.id === selectedExerciseId);

  const loadCatalog = async () => {
    try {
      const data = await getAvailableExercises();
      setCatalog(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los ejercicios.");
    }
  };

  const loadExercises = async (id: string) => {
    if (!user) return;
    const data = await getRoutineExercises(user.id, id);
    setExercises(data);
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const ensureDraftRoutine = async (): Promise<string | null> => {
    if (!user) return null;
    if (routineId) return routineId;

    if (!routineName.trim()) {
      Alert.alert("Dato requerido", "Ingresa el nombre de la rutina.");
      return null;
    }

    const parsedRest = Number(restSeconds);
    if (Number.isNaN(parsedRest) || parsedRest < 0) {
      Alert.alert("Dato inválido", "Ingresa un descanso válido.");
      return null;
    }

    const newRoutineId = await createRoutineDraft(user.id, {
      nombre: routineName.trim(),
      descansoSegundos: parsedRest,
    });

    setRoutineId(newRoutineId);
    return newRoutineId;
  };

  const handleAddExercise = async () => {
    if (!user) return;

    if (!selectedExercise) {
      Alert.alert("Dato requerido", "Selecciona un ejercicio.");
      return;
    }

    const parsedSets = Number(sets);
    const parsedReps = Number(reps);

    if (Number.isNaN(parsedSets) || parsedSets <= 0) {
      Alert.alert("Dato inválido", "Ingresa una cantidad de series válida.");
      return;
    }

    if (Number.isNaN(parsedReps) || parsedReps <= 0) {
      Alert.alert(
        "Dato inválido",
        "Ingresa una cantidad de repeticiones válida.",
      );
      return;
    }

    try {
      setLoading(true);

      const currentRoutineId = await ensureDraftRoutine();
      if (!currentRoutineId) return;

      await addRoutineExercise(user.id, currentRoutineId, {
        exercise: selectedExercise,
        sets: parsedSets,
        reps: parsedReps,
        order: exercises.length + 1,
      });

      await loadExercises(currentRoutineId);

      setSelectedExerciseId("");
      setSets("3");
      setReps("12");
    } catch (error) {
      console.log("ERROR AL AGREGAR EJERCICIO:", error);
      Alert.alert("Error", "No se pudo agregar el ejercicio.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!user) return;

    const currentRoutineId = await ensureDraftRoutine();
    if (!currentRoutineId) return;

    await updateRoutine(user.id, currentRoutineId, {
      nombre: routineName.trim(),
      descansoSegundos: Number(restSeconds),
    });

    router.replace("/(tabs)/routines");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSpace} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>{t(language, "createRoutine")}</Text>

          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Text style={{ color: colors.text }}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t(language, "routineName")}</Text>
          <TextInput
            value={routineName}
            onChangeText={setRoutineName}
            placeholder={t(language, "routineName")}
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "restSeconds")}</Text>
          <TextInput
            value={restSeconds}
            onChangeText={setRestSeconds}
            placeholder="60"
            keyboardType="numeric"
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t(language, "selectExercise")}</Text>

          {catalog.map((exercise) => (
            <Pressable
              key={exercise.id}
              onPress={() => setSelectedExerciseId(exercise.id)}
              style={[
                styles.listItem,
                selectedExerciseId === exercise.id &&
                  styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.listItemText,
                  selectedExerciseId === exercise.id &&
                    styles.segmentTextActive,
                ]}
              >
                {exercise.nombre} - {exercise.grupo}
              </Text>
            </Pressable>
          ))}

          <Text style={styles.label}>{t(language, "sets")}</Text>
          <TextInput
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
            placeholder="3"
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "reps")}</Text>
          <TextInput
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="12"
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleAddExercise}
            disabled={loading}
          >
            <Text style={[styles.actionText, styles.primaryButtonText]}>
              {loading ? t(language, "saving") : t(language, "addExercise")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t(language, "exerciseOrder")}</Text>

          {exercises.length === 0 ? (
            <Text style={styles.subtitle}>
              {t(language, "noExercisesAdded")}
            </Text>
          ) : (
            exercises.map((exercise, index) => (
              <View key={exercise.id} style={styles.listItem}>
                <Text style={styles.listItemText}>
                  {index + 1}. {exercise.nombre} · {exercise.series} x{" "}
                  {exercise.repeticiones}
                </Text>
              </View>
            ))
          )}
        </View>

        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleFinish}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            {t(language, "finishRoutine")}
          </Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
