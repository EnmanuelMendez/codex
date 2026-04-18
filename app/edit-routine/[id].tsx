import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  deleteRoutine,
  deleteRoutineExercise,
  getRoutineById,
  updateRoutine,
} from "@/services/routineService";
import { router, useLocalSearchParams } from "expo-router";
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
import { t } from "../locales/translations";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function EditRoutineScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [routine, setRoutine] = useState<any>(null);
  const [routineName, setRoutineName] = useState("");
  const [restSeconds, setRestSeconds] = useState("60");

  const loadRoutine = async () => {
    if (!user || !id) return;

    const data = await getRoutineById(user.id, id);
    setRoutine(data);
    setRoutineName(data?.nombre || "");
    setRestSeconds(String(data?.descansoSegundos || 60));
  };

  useEffect(() => {
    void loadRoutine();
  }, [id, user]);

  const handleSave = async () => {
    if (!user || !id) return;

    await updateRoutine(user.id, id, {
      nombre: routineName.trim(),
      descansoSegundos: Number(restSeconds),
    });

    Alert.alert("Éxito", "Rutina actualizada.");
    await loadRoutine();
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!user || !id) return;

    await deleteRoutineExercise(user.id, id, exerciseId);
    await loadRoutine();
  };

  const handleDeleteRoutine = async () => {
    if (!user || !id) return;

    await deleteRoutine(user.id, id);
    router.replace("/(tabs)/routines");
  };

  if (!routine) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSpace} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>{t(language, "editRoutine")}</Text>

          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Text style={{ color: colors.text }}>←</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t(language, "routineName")}</Text>
          <TextInput
            value={routineName}
            onChangeText={setRoutineName}
            style={styles.input}
            placeholder={t(language, "routineName")}
            placeholderTextColor="#8AA0B8"
          />

          <Text style={styles.label}>{t(language, "restSeconds")}</Text>
          <TextInput
            value={restSeconds}
            onChangeText={setRestSeconds}
            style={styles.input}
            keyboardType="numeric"
            placeholder="60"
            placeholderTextColor="#8AA0B8"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>{t(language, "exerciseOrder")}</Text>

          {routine.ejercicios.map((exercise: any, index: number) => (
            <View key={exercise.id} style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemText}>
                  {index + 1}. {exercise.nombre} · {exercise.series} x{" "}
                  {exercise.repeticiones}
                </Text>
              </View>

              <Pressable onPress={() => handleDeleteExercise(exercise.id)}>
                <Text style={{ color: "#ff6b6b", fontWeight: "700" }}>
                  {t(language, "delete")}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleSave}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            {t(language, "saveChanges")}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleDeleteRoutine}
        >
          <Text style={[styles.actionText, styles.secondaryButtonText]}>
            {t(language, "deleteRoutine")}
          </Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
