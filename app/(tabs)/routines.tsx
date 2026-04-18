import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Friend } from "@/models/friend";
import { RoutineShare } from "@/models/routineShare";
import { Routine } from "@/models/workout";
import { combineSelectedRoutinesWithFriend } from "@/services/combineRoutineService";
import { getUserRoutines } from "@/services/routineService";
import {
  acceptRoutineShare,
  getReceivedRoutineShares,
  getShareableFriends,
  rejectRoutineShare,
  shareRoutineWithFriend,
} from "@/services/routineShareService";
import {
  getSelectedRoutine,
  setSelectedRoutine as saveSelectedRoutine,
} from "@/services/trainingService";
import { useFocusEffect, useRouter } from "expo-router";
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
import { t } from "../locales/translations";
import { createGlobalStyles } from "../styles/createGlobalStyles";

function AvatarStack({
  participants,
  colors,
}: {
  participants: string[];
  colors: any;
}) {
  if (!participants.length) return null;

  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      {participants.slice(0, 3).map((name, index) => (
        <View
          key={`${name}-${index}`}
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

function ShareFriendCard({
  friend,
  onShare,
  styles,
}: {
  friend: Friend;
  onShare: (friend: Friend) => void;
  styles: any;
}) {
  return (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{friend.name}</Text>
        <Text style={styles.userEmail}>{friend.email}</Text>
        <Text style={styles.userEmail}>@{friend.username}</Text>
      </View>

      <Pressable onPress={() => onShare(friend)} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Enviar</Text>
      </Pressable>
    </View>
  );
}

function CombineFriendCard({
  friend,
  onCombine,
  styles,
}: {
  friend: Friend;
  onCombine: (friend: Friend) => void;
  styles: any;
}) {
  return (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{friend.name}</Text>
        <Text style={styles.userEmail}>{friend.email}</Text>
        <Text style={styles.userEmail}>@{friend.username}</Text>
      </View>

      <Pressable onPress={() => onCombine(friend)} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Combinar</Text>
      </Pressable>
    </View>
  );
}

function RoutineShareCard({
  share,
  onAccept,
  onReject,
  styles,
}: {
  share: RoutineShare;
  onAccept: (share: RoutineShare) => void;
  onReject: (share: RoutineShare) => void;
  styles: any;
}) {
  return (
    <View style={styles.routineCard}>
      <View style={styles.routineCardAccent} />
      <View style={styles.routineCardContent}>
        <Text style={styles.routineCardTitle}>
          {share.routineName || "Rutina compartida"}
        </Text>

        <Text style={styles.routineCardCreator}>
          Compartida por: {share.ownerName || share.ownerUserId}
        </Text>

        <Pressable
          style={[styles.actionButton, styles.primaryButton, { marginTop: 12 }]}
          onPress={() => onAccept(share)}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Aceptar
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => onReject(share)}
        >
          <Text style={[styles.actionText, styles.secondaryButtonText]}>
            Rechazar
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RoutinesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [combineModalVisible, setCombineModalVisible] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [receivedShares, setReceivedShares] = useState<RoutineShare[]>([]);

  const loadRoutines = async () => {
    if (!user) return;
    const data = await getUserRoutines(user.id);
    setRoutines(data);
  };

  const loadSelectedRoutine = async () => {
    if (!user) return;
    const data = await getSelectedRoutine(user.id);
    setSelectedRoutineId(data?.selectedRoutineId || null);
  };

  const loadFriends = async () => {
    if (!user) return;
    const data = await getShareableFriends(user.id);
    setFriends(data);
  };

  const loadReceivedShares = async () => {
    if (!user) return;
    const data = await getReceivedRoutineShares(user.id);
    setReceivedShares(data);
  };

  useFocusEffect(
    useCallback(() => {
      void loadRoutines();
      void loadSelectedRoutine();
      void loadReceivedShares();
    }, [user]),
  );

  const handleStartRoutine = (routine: Routine) => {
    router.push({
      pathname: "/workout",
      params: { routine: JSON.stringify(routine) },
    });
  };

  const handleSelectRoutine = async (routine: Routine) => {
    if (!user) return;

    try {
      await saveSelectedRoutine(user.id, routine.id);
      setSelectedRoutineId(routine.id);
      Alert.alert("Éxito", "Rutina seleccionada como rutina del día.");
    } catch {
      Alert.alert("Error", "No se pudo seleccionar la rutina.");
    }
  };

  const handleOpenShare = async (routine: Routine) => {
    setSelectedRoutine(routine);
    await loadFriends();
    setShareModalVisible(true);
  };

  const handleOpenCombine = async () => {
    if (!user) return;

    if (!selectedRoutineId) {
      Alert.alert(
        "Selecciona una rutina",
        "Primero debes seleccionar tu rutina del día antes de combinarla.",
      );
      return;
    }

    await loadFriends();
    setCombineModalVisible(true);
  };

  const handleShareWithFriend = async (friend: Friend) => {
    if (!user || !selectedRoutine) return;

    try {
      await shareRoutineWithFriend(
        user.id,
        friend.friendUserId,
        selectedRoutine.id,
      );

      Alert.alert("Éxito", t(language, "shareSent"));
      setShareModalVisible(false);
      setSelectedRoutine(null);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "No se pudo compartir la rutina.",
      );
    }
  };

  const handleCombineWithFriend = async (friend: Friend) => {
    if (!user) return;

    try {
      await combineSelectedRoutinesWithFriend(
        user.id,
        friend.friendUserId,
        friend.name,
      );

      Alert.alert("Éxito", "Rutina combinada creada correctamente.");
      setCombineModalVisible(false);
      await loadRoutines();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "No se pudieron combinar las rutinas.",
      );
    }
  };

  const handleAcceptShare = async (share: RoutineShare) => {
    if (!user) return;

    try {
      await acceptRoutineShare(user.id, share);
      Alert.alert("Éxito", t(language, "routineAccepted"));
      await loadRoutines();
      await loadReceivedShares();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "No se pudo aceptar la rutina compartida.",
      );
    }
  };

  const handleRejectShare = async (share: RoutineShare) => {
    try {
      await rejectRoutineShare(share.id);
      Alert.alert("Éxito", t(language, "routineRejected"));
      await loadReceivedShares();
    } catch {
      Alert.alert("Error", "No se pudo rechazar la rutina compartida.");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.space} />

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{t(language, "routines")}</Text>
            <Text style={styles.subtitle}>{t(language, "sharedRoutines")}</Text>
          </View>

          <Pressable
            style={styles.createButton}
            onPress={() => router.push("/create-routine")}
          >
            <Text style={styles.createButtonText}>
              {t(language, "createRoutine")}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.actionButton, styles.primaryButton, { marginBottom: 16 }]}
          onPress={handleOpenCombine}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Combinar con amigo
          </Text>
        </Pressable>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {t(language, "receivedRoutineShares")}
          </Text>

          {receivedShares.length === 0 ? (
            <Text style={styles.emptyText}>{t(language, "noRoutineShares")}</Text>
          ) : (
            <View style={styles.routineList}>
              {receivedShares.map((share) => (
                <RoutineShareCard
                  key={share.id}
                  share={share}
                  onAccept={handleAcceptShare}
                  onReject={handleRejectShare}
                  styles={styles}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.routineList}>
          {routines.map((routine) => {
            const isSelected = selectedRoutineId === routine.id;

            return (
              <View key={routine.id} style={styles.routineCard}>
                <View style={styles.routineCardAccent} />

                <View style={styles.routineCardContent}>
                  <Text style={styles.routineCardTitle}>{routine.nombre}</Text>
                  <Text style={styles.routineCardMeta}>
                    {routine.ejercicios.length} ejercicios
                  </Text>
                  <Text style={styles.routineCardCreator}>{routine.creador}</Text>
                  <Text style={styles.routineParticipantsLabel}>
                    Participantes:{" "}
                    {routine.participantes.length
                      ? routine.participantes.join(", ")
                      : "Ninguno"}
                  </Text>

                  {isSelected ? (
                    <Text
                      style={{
                        color: colors.primary,
                        fontWeight: "700",
                        marginTop: 8,
                      }}
                    >
                      Rutina del día seleccionada
                    </Text>
                  ) : null}

                  <AvatarStack
                    participants={routine.participantes}
                    colors={colors}
                  />

                  <Pressable
                    style={[
                      styles.actionButton,
                      styles.primaryButton,
                      { marginTop: 12 },
                    ]}
                    onPress={() => handleStartRoutine(routine)}
                  >
                    <Text style={[styles.actionText, styles.primaryButtonText]}>
                      {t(language, "start")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => handleSelectRoutine(routine)}
                  >
                    <Text style={[styles.actionText, styles.secondaryButtonText]}>
                      Seleccionar rutina
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => router.push(`/edit-routine/${routine.id}`)}
                  >
                    <Text style={[styles.actionText, styles.secondaryButtonText]}>
                      {t(language, "edit")}
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => handleOpenShare(routine)}
                  >
                    <Text style={[styles.actionText, styles.secondaryButtonText]}>
                      {t(language, "share")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={shareModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t(language, "shareRoutine")}</Text>

            <Text style={styles.subtitle}>{t(language, "selectFriend")}</Text>

            <ScrollView
              style={{ maxHeight: 300, marginTop: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {friends.length === 0 ? (
                <Text style={styles.emptyText}>
                  {t(language, "noFriendsToShare")}
                </Text>
              ) : (
                friends.map((friend) => (
                  <ShareFriendCard
                    key={friend.id}
                    friend={friend}
                    onShare={handleShareWithFriend}
                    styles={styles}
                  />
                ))
              )}
            </ScrollView>

            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => {
                setShareModalVisible(false);
                setSelectedRoutine(null);
              }}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                {t(language, "close")}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={combineModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Combinar rutinas</Text>

            <Text style={styles.subtitle}>
              Se combinará tu rutina seleccionada con la rutina seleccionada de tu amigo.
            </Text>

            <ScrollView
              style={{ maxHeight: 300, marginTop: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {friends.length === 0 ? (
                <Text style={styles.emptyText}>
                  No tienes amigos disponibles para combinar.
                </Text>
              ) : (
                friends.map((friend) => (
                  <CombineFriendCard
                    key={friend.id}
                    friend={friend}
                    onCombine={handleCombineWithFriend}
                    styles={styles}
                  />
                ))
              )}
            </ScrollView>

            <Pressable
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setCombineModalVisible(false)}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                Cerrar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}