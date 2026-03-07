import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

type Exercise = {
  nombre: string;
  detalle: string;
};

type RoutineDetail = {
  nombre: string;
  creador: string;
  ejercicios: Exercise[];
};

const ROUTINE_DETAILS: Record<string, RoutineDetail> = {
  "1": {
    nombre: "Rutina de fuerza",
    creador: "Creada por ti",
    ejercicios: [
      { nombre: "Press de banca", detalle: "4 series · 10 repeticiones" },
      { nombre: "Sentadillas", detalle: "4 series · 12 repeticiones" },
      { nombre: "Remo con mancuerna", detalle: "3 series · 12 repeticiones" },
      { nombre: "Peso muerto", detalle: "3 series · 8 repeticiones" },
    ],
  },
  "2": {
    nombre: "Rutina de cardio",
    creador: "Creada por ti",
    ejercicios: [
      { nombre: "Burpees", detalle: "3 series · 12 repeticiones" },
      { nombre: "Mountain climbers", detalle: "3 series · 45 segundos" },
      { nombre: "Jumping jacks", detalle: "4 series · 40 segundos" },
      { nombre: "Cuerda", detalle: "10 minutos continuos" },
    ],
  },
  "3": {
    nombre: "Rutina de core",
    creador: "Creada por ti",
    ejercicios: [
      { nombre: "Plancha frontal", detalle: "3 series · 45 segundos" },
      { nombre: "Crunch abdominal", detalle: "3 series · 20 repeticiones" },
      { nombre: "Elevación de piernas", detalle: "3 series · 15 repeticiones" },
      { nombre: "Plancha lateral", detalle: "3 series · 30 segundos por lado" },
    ],
  },
};

export default function RoutineDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const routine = (id && ROUTINE_DETAILS[id]) || {
    nombre: "Rutina personalizada",
    creador: "Creada por ti",
    ejercicios: [
      { nombre: "Ejercicio 1", detalle: "3 series · 12 repeticiones" },
      { nombre: "Ejercicio 2", detalle: "3 series · 15 repeticiones" },
    ],
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "700",
    },
    subtitle: {
      color: colors.primary,
      marginTop: 4,
      marginBottom: 16,
      fontWeight: "600",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      borderColor: "#1E3650",
      borderWidth: 1,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    exerciseRow: {
      backgroundColor: colors.card,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#1E3650",
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    exerciseName: {
      color: colors.text,
      fontWeight: "700",
    },
    exerciseDetail: {
      color: colors.secondaryText,
      marginTop: 2,
    },
    sessionButton: {
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: 11,
      alignItems: "center",
      backgroundColor: "rgba(163, 255, 18, 0.12)",
    },
    sessionButtonText: {
      color: colors.primary,
      fontWeight: "700",
    },
    footerActions: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: colors.background,
      gap: 10,
    },
    editButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    editButtonText: {
      color: colors.background,
      fontWeight: "800",
      fontSize: 15,
    },
    deleteButton: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#FF6B6B",
      backgroundColor: "rgba(255, 107, 107, 0.08)",
    },
    deleteButtonText: {
      color: "#FF8E8E",
      fontWeight: "700",
      fontSize: 15,
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
        <Text style={styles.title}>{routine.nombre}</Text>
        <Text style={styles.subtitle}>{routine.creador}</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.sessionButton}
            onPress={() => router.push("/session")}
          >
            <Text style={styles.sessionButtonText}>
              Ver sesión de entrenamiento
            </Text>
          </Pressable>

          <Text style={styles.sectionTitle}>Ejercicios de la rutina</Text>

          {routine.ejercicios.map((exercise) => (
            <View key={exercise.nombre} style={styles.exerciseRow}>
              <Text style={styles.exerciseName}>{exercise.nombre}</Text>
              <Text style={styles.exerciseDetail}>{exercise.detalle}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footerActions}>
        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/create-routine")}
        >
          <Text style={styles.editButtonText}>Editar rutina</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => router.push("/(tabs)/routines")}
        >
          <Text style={styles.deleteButtonText}>Eliminar rutina</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
