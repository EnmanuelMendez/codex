import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Exercise, Routine } from "@/models/workout";
import {
    clearWorkoutState,
    getActiveWorkoutState,
    updateWorkoutProgress,
} from "@/services/trainingService";
import { getLocalVideoSource } from "@/utils/localVideos";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Alert,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";
import { createGlobalStyles } from "./styles/createGlobalStyles";

export default function WorkoutScreen() {
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

  const [exercises, setExercises] = useState<Exercise[]>(
    routine?.ejercicios ?? [],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const currentExercise = exercises[currentIndex];
  const localVideoSource = getLocalVideoSource(currentExercise?.videoKey);
  const remoteVideoSource = currentExercise?.videoUrl || null;
  const videoSource = localVideoSource || remoteVideoSource || null;

  const player = useVideoPlayer(videoSource, (playerInstance) => {
    playerInstance.loop = true;
  });

  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !routine) return;

      const active = await getActiveWorkoutState(user.id);

      if (
        active?.started &&
        !active?.completed &&
        active?.routineId === routine.id
      ) {
        setCurrentIndex(active.currentIndex || 0);
      }
    };

    void loadProgress();
  }, [user, routine]);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);

      try {
        player.pause();
      } catch {}
    };
  }, [player]);

  const safePause = useCallback(() => {
    if (!isMounted.current) return;
    try {
      player.pause();
    } catch {}
  }, [player]);

  const safePlay = useCallback(() => {
    if (!isMounted.current) return;
    try {
      player.play();
    } catch {}
  }, [player]);

  const replaceSource = useCallback(
    async (source: any) => {
      if (!isMounted.current) return;

      try {
        await player.replaceAsync(source);
      } catch (error) {
        console.warn("Error al reemplazar la fuente del video", error);
      }
    },
    [player],
  );

  useEffect(() => {
    if (!isMounted.current) return;

    const shouldPlay = modalVisible && isActive && videoSource;

    if (shouldPlay) {
      void replaceSource(videoSource).then(() => {
        safePlay();
      });
    } else {
      safePause();
    }
  }, [modalVisible, isActive, videoSource, replaceSource, safePause, safePlay]);

  useEffect(() => {
    if (!isMounted.current) return;

    if (videoSource && modalVisible && isActive) {
      void replaceSource(videoSource).then(() => {
        safePlay();
      });
    }
  }, [
    currentIndex,
    videoSource,
    modalVisible,
    isActive,
    replaceSource,
    safePlay,
  ]);

  useEffect(() => {
    if (!routine) {
      Alert.alert("Error", "No se pudo cargar la rutina.");
      router.replace("/(tabs)/");
    }
  }, [routine]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!user || !routine) return;

      await updateWorkoutProgress(user.id, {
        routineId: routine.id,
        currentIndex,
        started: true,
        completed: false,
      });
    };

    if (routine && user) {
      void saveProgress();
    }
  }, [currentIndex, user, routine]);

  const startTimer = (seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(seconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);

          if (isMounted.current) {
            setModalVisible(false);
            setIsActive(false);
            safePause();

            setExercises((prevEx) => {
              const updated = [...prevEx];
              if (updated[currentIndex]) {
                updated[currentIndex] = {
                  ...updated[currentIndex],
                  estado: "Completado",
                };
              }
              return updated;
            });

            if (currentIndex + 1 < exercises.length) {
              setCurrentIndex((prevIndex) => prevIndex + 1);
            } else {
              setTimeout(() => {
                if (isMounted.current) {
                  if (user) {
                    void clearWorkoutState(user.id);
                  }

                  Alert.alert(
                    "Rutina completada",
                    "¡Felicidades! Completaste la rutina.",
                    [{ text: "OK", onPress: () => router.replace("/(tabs)/") }],
                  );
                }
              }, 100);
            }
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const handleStartWorkout = () => {
    if (!exercises[currentIndex]) return;

    setIsActive(true);
    setModalVisible(true);

    const duration = exercises[currentIndex].duracionSegundos || 30;
    startTimer(duration);
  };

  const handleStopWorkout = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isMounted.current) {
      setIsActive(false);
      setModalVisible(false);
      setTimeLeft(0);
      safePause();
    }
  };

  if (!routine) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.topSpace} />

        <View style={styles.headerRow}>
          <Pressable onPress={() => router.replace("/(tabs)/")} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>

          <Text style={[styles.title, { flex: 1, textAlign: "center" }]}>
            {routine.nombre}
          </Text>

          <View style={{ width: 44 }} />
        </View>

        <View style={styles.card}>
          {exercises.map((ex) => {
            const hasVideo = !!(ex.videoKey || ex.videoUrl);

            return (
              <View key={ex.id} style={styles.workoutExerciseItem}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{ marginRight: 12 }}>
                    <Text
                      style={
                        ex.estado === "Completado"
                          ? styles.workoutCompleted
                          : styles.workoutPending
                      }
                    >
                      {ex.estado === "Completado" ? "✓" : "○"}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.workoutExerciseName}>{ex.nombre}</Text>
                    <Text style={styles.workoutExerciseDetails}>
                      {ex.series} series •{" "}
                      {ex.repeticiones
                        ? `${ex.repeticiones} reps`
                        : `${ex.duracionSegundos}s`}
                      {ex.maquina ? ` • ${ex.maquina}` : ""}
                    </Text>
                  </View>

                  {hasVideo ? (
                    <Ionicons
                      name="videocam"
                      size={20}
                      color={colors.primary}
                    />
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {!isActive ? (
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleStartWorkout}
          >
            <Text style={[styles.actionText, styles.primaryButtonText]}>
              Iniciar entrenamiento
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleStopWorkout}
          >
            <Text style={[styles.actionText, styles.secondaryButtonText]}>
              Detener
            </Text>
          </Pressable>
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{currentExercise?.nombre}</Text>

            <Text style={styles.progressText}>{timeLeft} segundos</Text>

            {videoSource ? (
              <VideoView
                player={player}
                style={{ width: "100%", height: 200, marginVertical: 10 }}
                nativeControls
                contentFit="contain"
              />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Ionicons name="play-circle" size={60} color={colors.primary} />
                <Text style={{ color: colors.secondaryText, marginTop: 8 }}>
                  Video no disponible
                </Text>
              </View>
            )}

            <Pressable style={styles.closeButton} onPress={handleStopWorkout}>
              <Text style={styles.closeButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
