import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Routine } from "@/models/workout";
import { getRoutineById, getUserRoutines } from "@/services/routineService";
import {
  clearWorkoutState,
  getActiveWorkoutState,
  getSelectedRoutine,
} from "@/services/trainingService";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { createGlobalStyles } from "../styles/createGlobalStyles";

function ProgressCard({
  styles,
  selectedRoutine,
  activeWorkout,
}: {
  styles: any;
  selectedRoutine: Routine | null;
  activeWorkout: any;
}) {
  const total = selectedRoutine?.ejercicios.length || 0;
  const currentIndex = activeWorkout?.currentIndex || 0;
  const completed = activeWorkout?.started ? currentIndex : 0;
  const progress = total > 0 ? completed / total : 0;

  return (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Progreso de hoy</Text>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={styles.progressText}>
        {total > 0
          ? `${completed} de ${total} ejercicios completados`
          : "No hay rutina seleccionada"}
      </Text>
    </View>
  );
}

function ExerciseCard({ exercise, styles }: { exercise: any; styles: any }) {
  const completed = exercise.estado === "Completado";

  return (
    <View style={styles.exerciseCard}>
      <View>
        <Text style={styles.exerciseName}>{exercise.nombre}</Text>
        <Text style={styles.exerciseMeta}>
          {exercise.grupo} • {exercise.detalle}
        </Text>
      </View>
      <View
        style={[
          styles.exerciseStatusBadge,
          completed
            ? styles.exerciseStatusBadgeCompleted
            : styles.exerciseStatusBadgePending,
        ]}
      >
        <Text
          style={[
            styles.exerciseStatusText,
            completed
              ? styles.exerciseStatusTextCompleted
              : styles.exerciseStatusTextPending,
          ]}
        >
          {completed ? "Completado" : "Pendiente"}
        </Text>
      </View>
    </View>
  );
}

function RoutinePickerCard({
  routine,
  onChoose,
  styles,
}: {
  routine: Routine;
  onChoose: (routine: Routine) => void;
  styles: any;
}) {
  return (
    <View style={styles.routineCard}>
      <View style={styles.routineCardAccent} />
      <View style={styles.routineCardContent}>
        <Text style={styles.routineCardTitle}>{routine.nombre}</Text>
        <Text style={styles.routineCardMeta}>
          {routine.ejercicios.length} ejercicios
        </Text>

        <Pressable
          style={[styles.actionButton, styles.primaryButton, { marginTop: 12 }]}
          onPress={() => onChoose(routine)}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Elegir rutina
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [allRoutines, setAllRoutines] = useState<Routine[]>([]);
  const [routineModalVisible, setRoutineModalVisible] = useState(false);

  const loadTrainingData = async () => {
    if (!user) return;

    const [selected, active, routines] = await Promise.all([
      getSelectedRoutine(user.id),
      getActiveWorkoutState(user.id),
      getUserRoutines(user.id),
    ]);

    setActiveWorkout(active);
    setAllRoutines(routines);

    if (selected?.selectedRoutineId) {
      const routine = await getRoutineById(user.id, selected.selectedRoutineId);
      setSelectedRoutine(routine);
    } else {
      setSelectedRoutine(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadTrainingData();
    }, [user]),
  );

  const hasActiveWorkout =
    activeWorkout?.started &&
    !activeWorkout?.completed &&
    !!activeWorkout?.routineId;

  const handleWorkoutPress = async () => {
    if (!user) return;

    if (hasActiveWorkout && selectedRoutine) {
      router.push({
        pathname: "/workout",
        params: {
          routine: JSON.stringify(selectedRoutine),
        },
      });
      return;
    }

    setRoutineModalVisible(true);
  };

  const handleChooseRoutine = (routine: Routine) => {
    setRoutineModalVisible(false);

    router.push({
      pathname: "/mood",
      params: {
        routine: JSON.stringify(routine),
      },
    });
  };

  const handleAbandonRoutine = async () => {
    if (!user) return;

    Alert.alert(
      "Abandonar rutina",
      "¿Seguro que quieres abandonar la rutina actual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Abandonar",
          style: "destructive",
          onPress: async () => {
            await clearWorkoutState(user.id);
            await loadTrainingData();
          },
        },
      ],
    );
  };

  const handleFinishRoutine = async () => {
    if (!user) return;

    Alert.alert(
      "Terminar rutina",
      "¿Deseas marcar la rutina como terminada?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Terminar",
          onPress: async () => {
            await clearWorkoutState(user.id);
            await loadTrainingData();
          },
        },
      ],
    );
  };

  const actionLabel = hasActiveWorkout
    ? "Seguir entrenamiento"
    : "Comenzar entrenamiento";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.homeContent, { paddingBottom: 160 }]}
      >
        <View style={styles.topSpaceLarge} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Inicio</Text>
            <Text style={styles.subtitle}>
              {selectedRoutine
                ? `Rutina del día: ${selectedRoutine.nombre}`
                : "Elige una rutina para entrenar hoy"}
            </Text>
          </View>

          <Pressable
            style={styles.avatarPlaceholder}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.avatarText}>E</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.routineButton}
          onPress={() => router.push("/routines")}
        >
          <Text style={styles.routineButtonText}>Ver Mis Rutinas</Text>
        </Pressable>

        <ProgressCard
          styles={styles}
          selectedRoutine={selectedRoutine}
          activeWorkout={activeWorkout}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.homeSectionTitle}>
            {selectedRoutine
              ? "Ejercicios de la rutina seleccionada"
              : "Sin rutina seleccionada"}
          </Text>
        </View>

        <View style={styles.exerciseList}>
          {selectedRoutine?.ejercicios?.length ? (
            selectedRoutine.ejercicios.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                styles={styles}
              />
            ))
          ) : (
            <Text style={styles.subtitle}>
              Presiona comenzar entrenamiento para elegir una rutina.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.homeFooter}>
        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleWorkoutPress}
          disabled={!hasActiveWorkout && allRoutines.length === 0}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            {actionLabel}
          </Text>
        </Pressable>

        {hasActiveWorkout ? (
          <>
            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleAbandonRoutine}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                Abandonar rutina
              </Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={handleFinishRoutine}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                Terminar rutina
              </Text>
            </Pressable>
          </>
        ) : null}
      </View>

      <Modal visible={routineModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Elige una rutina</Text>

            <ScrollView
              style={{ maxHeight: 350, marginTop: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {allRoutines.length === 0 ? (
                <Text style={styles.emptyText}>No tienes rutinas creadas.</Text>
              ) : (
                allRoutines.map((routine) => (
                  <RoutinePickerCard
                    key={routine.id}
                    routine={routine}
                    onChoose={handleChooseRoutine}
                    styles={styles}
                  />
                ))
              )}
            </ScrollView>

            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setRoutineModalVisible(false)}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}