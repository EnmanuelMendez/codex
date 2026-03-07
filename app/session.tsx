import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

type Participant = {
  id: string;
  nombre: string;
  estado: "Confirmado" | "Pendiente";
};

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: "1", nombre: "Juan", estado: "Confirmado" },
  { id: "2", nombre: "María", estado: "Pendiente" },
  { id: "3", nombre: "Carlos", estado: "Confirmado" },
];

export default function SessionScreen() {
  const { colors } = useTheme();

  const [myStatus, setMyStatus] = useState<"Pendiente" | "Confirmado">(
    "Pendiente",
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
      fontSize: 30,
      fontWeight: "700",
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: "#1E3650",
      marginBottom: 12,
    },
    label: {
      color: colors.secondaryText,
      fontSize: 13,
      marginBottom: 4,
    },
    value: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    participantRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: "#1E3650",
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
    },
    participantName: {
      color: colors.text,
      fontWeight: "600",
    },
    participantStatus: {
      fontWeight: "700",
      fontSize: 13,
    },
    statusConfirmed: {
      color: colors.primary,
    },
    statusPending: {
      color: "#FFBE76",
    },
    confirmButton: {
      marginTop: "auto",
      marginBottom: 20,
      backgroundColor: colors.primary,
      borderRadius: 14,
      alignItems: "center",
      paddingVertical: 14,
    },
    confirmButtonText: {
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

      <Text style={styles.title}>Sesión de entrenamiento</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Rutina</Text>
        <Text style={styles.value}>Rutina de fuerza</Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.value}>Hoy - 18:00</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Participantes</Text>

        {INITIAL_PARTICIPANTS.map((participant) => (
          <View key={participant.id} style={styles.participantRow}>
            <Text style={styles.participantName}>{participant.nombre}</Text>
            <Text
              style={[
                styles.participantStatus,
                participant.estado === "Confirmado"
                  ? styles.statusConfirmed
                  : styles.statusPending,
              ]}
            >
              {participant.estado}
            </Text>
          </View>
        ))}

        <View style={styles.participantRow}>
          <Text style={styles.participantName}>Tú</Text>
          <Text
            style={[
              styles.participantStatus,
              myStatus === "Confirmado"
                ? styles.statusConfirmed
                : styles.statusPending,
            ]}
          >
            {myStatus}
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.confirmButton}
        onPress={() => setMyStatus("Confirmado")}
      >
        <Text style={styles.confirmButtonText}>Confirmar asistencia</Text>
      </Pressable>
    </SafeAreaView>
  );
}
