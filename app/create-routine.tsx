import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const FRIENDS = ["Juan", "María", "Carlos", "Laura"];

export default function CreateRoutineScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [selectedFriends, setSelectedFriends] = useState<string[]>([
    "Juan",
    "María",
  ]);

  const selectedText = useMemo(() => {
    if (selectedFriends.length === 0) return "Sin amigos seleccionados";
    return `Seleccionados: ${selectedFriends.join(", ")}`;
  }, [selectedFriends]);

  const toggleFriend = (friend: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friend)
        ? prev.filter((name) => name !== friend)
        : [...prev, friend],
    );
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
      marginBottom: 16,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      borderColor: "#1E3650",
      borderWidth: 1,
      marginBottom: 14,
    },
    label: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 6,
    },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#1E3650",
      paddingHorizontal: 12,
      paddingVertical: 11,
    },
    sectionTitle: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 12,
    },
    row: {
      flexDirection: "row",
      gap: 10,
    },
    rowItem: {
      flex: 1,
    },
    addButton: {
      marginTop: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: 11,
      alignItems: "center",
      backgroundColor: "rgba(163, 255, 18, 0.12)",
    },
    addButtonText: {
      color: colors.primary,
      fontWeight: "700",
    },
    examplesCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      borderColor: "#1E3650",
      borderWidth: 1,
      marginBottom: 14,
    },
    examplesTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    exampleRow: {
      color: colors.secondaryText,
      marginBottom: 6,
    },
    shareCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 14,
      borderColor: "#1E3650",
      borderWidth: 1,
    },
    shareTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    chipsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    friendChip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: "#2A4360",
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.card,
    },
    friendChipSelected: {
      borderColor: colors.primary,
      backgroundColor: "rgba(163, 255, 18, 0.16)",
    },
    friendChipText: {
      color: colors.secondaryText,
      fontWeight: "600",
    },
    friendChipTextSelected: {
      color: colors.primary,
    },
    selectedFriendsText: {
      marginTop: 10,
      color: colors.secondaryText,
      fontSize: 13,
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
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      alignItems: "center",
      paddingVertical: 14,
    },
    saveButtonText: {
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
        <Text style={styles.title}>Crear rutina</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre de la rutina</Text>
          <TextInput
            placeholder="Ej: Rutina de tren superior"
            placeholderTextColor={colors.secondaryText}
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Ejercicios</Text>

          <Text style={styles.label}>Nombre del ejercicio</Text>
          <TextInput
            placeholder="Ej: Flexiones"
            placeholderTextColor={colors.secondaryText}
            style={styles.input}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Series</Text>
              <TextInput
                placeholder="3"
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Repeticiones</Text>
              <TextInput
                placeholder="12"
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
              />
            </View>
          </View>

          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>Agregar ejercicio</Text>
          </Pressable>
        </View>

        <View style={styles.examplesCard}>
          <Text style={styles.examplesTitle}>Ejercicios agregados</Text>
          <Text style={styles.exampleRow}>
            Flexiones – 3 series – 12 repeticiones
          </Text>
          <Text style={styles.exampleRow}>
            Sentadillas – 3 series – 15 repeticiones
          </Text>
        </View>

        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>Compartir con amigos</Text>
          <View style={styles.chipsWrap}>
            {FRIENDS.map((friend) => {
              const selected = selectedFriends.includes(friend);
              return (
                <Pressable
                  key={friend}
                  onPress={() => toggleFriend(friend)}
                  style={[
                    styles.friendChip,
                    selected && styles.friendChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.friendChipText,
                      selected && styles.friendChipTextSelected,
                    ]}
                  >
                    {friend}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.selectedFriendsText}>{selectedText}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.saveButton}
          onPress={() => router.push("/(tabs)/routines")}
        >
          <Text style={styles.saveButtonText}>Guardar rutina</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
