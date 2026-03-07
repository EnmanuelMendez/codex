import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

type Routine = {
  id: string;
  nombre: string;
  ejercicios: number;
  creador: string;
  participantes: string[];
};

const ROUTINES: Routine[] = [
  {
    id: "1",
    nombre: "Rutina de fuerza",
    ejercicios: 6,
    creador: "Creada por ti",
    participantes: ["Juan", "María", "Pedro"],
  },
  {
    id: "2",
    nombre: "Rutina de cardio",
    ejercicios: 5,
    creador: "Creada por ti",
    participantes: ["Carlos", "Laura", "Ana"],
  },
  {
    id: "3",
    nombre: "Rutina de core",
    ejercicios: 4,
    creador: "Creada por ti",
    participantes: ["María", "Diego"],
  },
];

function AvatarStack({
  participants,
  colors,
}: {
  participants: string[];
  colors: any;
}) {
  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      {participants.slice(0, 3).map((name, index) => (
        <View
          key={name}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: "#0E1F31",
            borderWidth: 1,
            borderColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: index === 0 ? 0 : -10,
          }}
        >
          <Text
            style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}
          >
            {name[0]}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function RoutinesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 20,
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
      marginTop: 2,
    },
    createButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    createButtonText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 14,
    },
    list: {
      gap: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#1E3650",
      overflow: "hidden",
      flexDirection: "row",
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 9,
      shadowOffset: { width: 0, height: 5 },
      elevation: 3,
    },
    cardAccent: {
      width: 6,
      backgroundColor: colors.primary,
    },
    cardContent: {
      padding: 14,
      flex: 1,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 6,
    },
    cardMeta: {
      color: colors.secondaryText,
      fontSize: 14,
    },
    cardCreator: {
      color: colors.primary,
      fontSize: 13,
      marginTop: 8,
      fontWeight: "600",
    },
    participantsLabel: {
      color: colors.secondaryText,
      fontSize: 13,
      marginTop: 10,
    },
    space: {
      paddingTop: 30,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space} />

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Rutinas</Text>
          <Text style={styles.subtitle}>Rutinas compartidas</Text>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push("/create-routine")}
        >
          <Text style={styles.createButtonText}>Crear rutina</Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {ROUTINES.map((routine) => (
          <Pressable
            key={routine.id}
            style={styles.card}
            onPress={() => router.push(`/${routine.id}`)}
          >
            <View style={styles.cardAccent} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{routine.nombre}</Text>
              <Text style={styles.cardMeta}>
                {routine.ejercicios} ejercicios
              </Text>

              <Text style={styles.cardCreator}>{routine.creador}</Text>

              <Text style={styles.participantsLabel}>
                Participantes: {routine.participantes.join(", ")}
              </Text>

              <AvatarStack
                participants={routine.participantes}
                colors={colors}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
