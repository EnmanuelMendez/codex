import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Exercise = {
  id: string;
  nombre: string;
  grupo: string;
  detalle: string;
  estado: "Pendiente" | "Completado";
};

const EXERCISES: Exercise[] = [
  {
    id: "1",
    nombre: "Flexiones",
    grupo: "Pecho",
    detalle: "3 x 12",
    estado: "Completado",
  },
  {
    id: "2",
    nombre: "Sentadillas",
    grupo: "Piernas",
    detalle: "3 x 15",
    estado: "Completado",
  },
  {
    id: "3",
    nombre: "Plancha",
    grupo: "Core",
    detalle: "45 segundos",
    estado: "Pendiente",
  },
  {
    id: "4",
    nombre: "Burpees",
    grupo: "Cardio",
    detalle: "3 x 10",
    estado: "Pendiente",
  },
  {
    id: "5",
    nombre: "Zancadas",
    grupo: "Piernas",
    detalle: "2 x 12 por lado",
    estado: "Pendiente",
  },
  {
    id: "6",
    nombre: "Mountain climbers",
    grupo: "Cardio",
    detalle: "30 segundos",
    estado: "Pendiente",
  },
];

function ProgressCard({ colors }: any) {
  const progress = 0.5;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 12,
        }}
      >
        Progreso de hoy
      </Text>

      <View
        style={{
          height: 12,
          width: "100%",
          borderRadius: 999,
          backgroundColor: "#1C3349",
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            height: "100%",
            borderRadius: 999,
            width: `${progress * 100}%`,
            backgroundColor: colors.primary,
          }}
        />
      </View>

      <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
        3 de 6 ejercicios completados
      </Text>
    </View>
  );
}

function ExerciseCard({
  exercise,
  colors,
}: {
  exercise: Exercise;
  colors: any;
}) {
  const completed = exercise.estado === "Completado";

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#1E3650",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          {exercise.nombre}
        </Text>
        <Text
          style={{ color: colors.secondaryText, fontSize: 13, marginTop: 4 }}
        >
          {exercise.grupo} • {exercise.detalle}
        </Text>
      </View>

      <View
        style={{
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderWidth: 1,
          backgroundColor: completed ? "rgba(163,255,18,0.18)" : "#1F2F41",
          borderColor: completed ? "rgba(163,255,18,0.5)" : "#36506E",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: completed ? colors.primary : "#BFD0E1",
          }}
        >
          {exercise.estado}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 120,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "700",
    },
    subtitle: {
      color: colors.secondaryText,
      fontSize: 15,
      marginTop: 2,
    },
    avatarPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: "#1E3650",
      alignItems: "center",
      justifyContent: "center",
    },
    avatarText: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 18,
    },
    sectionHeader: {
      marginBottom: 10,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 20,
      fontWeight: "700",
    },
    exerciseList: {
      gap: 10,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 20,
      backgroundColor: colors.background,
    },
    startButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      paddingVertical: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    startButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: "800",
    },
    routineButton: {
      backgroundColor: "#8AA0B8",
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 20,
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    routineButtonText: {
      color: "#0B1A2A",
      fontWeight: "700",
      fontSize: 16,
    },
    space: {
      flex: 0,
      paddingTop: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.space} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Inicio</Text>
            <Text style={styles.subtitle}>Entrenamiento de hoy</Text>
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

        <ProgressCard colors={colors} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ejercicios del día</Text>
        </View>

        <View style={styles.exerciseList}>
          {EXERCISES.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              colors={colors}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>Comenzar entrenamiento</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
