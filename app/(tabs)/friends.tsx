import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
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
import { Friend } from "../../models/friend";
import { FriendRequest } from "../../models/friendRequest";
import {
  acceptFriendRequest,
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  rejectFriendRequest,
  removeFriend,
  searchUsers,
  sendFriendRequest,
} from "../../services/friendService";
import { createGlobalStyles } from "../styles/createGlobalStyles";

type SearchUserItem = {
  id: string;
  username: string;
  email: string;
  name: string;
};

function UserCard({
  user,
  onSend,
  sent,
  styles,
}: {
  user: SearchUserItem;
  onSend: (user: SearchUserItem) => void;
  sent: boolean;
  styles: any;
}) {
  return (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{user.name || user.username}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.userEmail}>@{user.username}</Text>
      </View>

      <Pressable
        onPress={() => onSend(user)}
        disabled={sent}
        style={[styles.sendButton, sent && styles.sendButtonDisabled]}
      >
        <Text style={styles.sendButtonText}>{sent ? "Enviada" : "Enviar"}</Text>
      </Pressable>
    </View>
  );
}

function RequestCard({
  request,
  onAccept,
  onReject,
  styles,
}: {
  request: FriendRequest;
  onAccept: (request: FriendRequest) => void;
  onReject: (request: FriendRequest) => void;
  styles: any;
}) {
  return (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{request.fromName}</Text>
        <Text style={styles.userEmail}>{request.fromEmail}</Text>
        <Text style={styles.userEmail}>@{request.fromUsername}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Pressable
          onPress={() => onAccept(request)}
          style={styles.acceptButton}
        >
          <Text style={styles.acceptButtonText}>Aceptar</Text>
        </Pressable>

        <Pressable
          onPress={() => onReject(request)}
          style={styles.rejectButton}
        >
          <Text style={styles.rejectButtonText}>Rechazar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FriendCard({
  friend,
  onRemove,
  styles,
}: {
  friend: Friend;
  onRemove: (friend: Friend) => void;
  styles: any;
}) {
  return (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{friend.name}</Text>
        <Text style={styles.userEmail}>{friend.email}</Text>
        <Text style={styles.userEmail}>@{friend.username}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <View style={styles.friendBadge}>
          <Text style={styles.friendBadgeText}>Amigo</Text>
        </View>

        <Pressable onPress={() => onRemove(friend)} style={styles.rejectButton}>
          <Text style={styles.rejectButtonText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function FriendsScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { user } = useAuth();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUserItem[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [friendsData, sentData, receivedData] = await Promise.all([
        getFriends(user.id),
        getSentFriendRequests(user.id),
        getReceivedFriendRequests(user.id),
      ]);

      setFriends(friendsData);
      setSentRequests(sentData);
      setReceivedRequests(receivedData);
    } catch (error) {
      console.log("ERROR CARGANDO AMIGOS:", error);
      Alert.alert("Error", "No se pudieron cargar los datos de amigos.");
    }
  };

  useEffect(() => {
    void loadData();
  }, [user]);

  const handleSearch = async (value: string) => {
    setSearchText(value);

    if (!user) return;

    const trimmed = value.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchUsers(user.id, trimmed);

      const filtered = results.filter((result) => {
        const alreadyFriend = friends.some(
          (friend) => friend.friendUserId === result.id,
        );

        const alreadySent = sentRequests.some(
          (request) =>
            request.toUserId === result.id && request.status === "pending",
        );

        return !alreadyFriend && !alreadySent;
      });

      setSearchResults(filtered);
    } catch (error) {
      console.log("ERROR BUSCANDO USUARIOS:", error);
    }
  };

  const handleSendRequest = async (targetUser: SearchUserItem) => {
    if (!user) return;

    try {
      await sendFriendRequest(
        {
          id: user.id,
          username: user.username || "",
          email: user.email,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
        targetUser,
      );

      Alert.alert("Éxito", "Solicitud enviada.");
      await loadData();
      await handleSearch(searchText);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "No se pudo enviar la solicitud.");
    }
  };

  const handleAcceptRequest = async (request: FriendRequest) => {
    if (!user) return;

    try {
      await acceptFriendRequest(
        {
          id: user.id,
          username: user.username || "",
          email: user.email,
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
        request,
      );

      Alert.alert("Éxito", "Solicitud aceptada.");
      await loadData();
    } catch {
      Alert.alert("Error", "No se pudo aceptar la solicitud.");
    }
  };

  const handleRejectRequest = async (request: FriendRequest) => {
    try {
      await rejectFriendRequest(request.id);
      await loadData();
    } catch {
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
    }
  };

  const handleRemoveFriend = async (friend: Friend) => {
    if (!user) return;

    Alert.alert(
      "Eliminar amigo",
      `¿Quieres eliminar a ${friend.name} de tu lista de amigos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await removeFriend(user.id, friend.friendUserId);
              await loadData();
            } catch {
              Alert.alert("Error", "No se pudo eliminar el amigo.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topSpaceLarge} />
      <ScrollView
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Amigos</Text>
        <Text style={styles.subtitle}>
          Busca usuarios y comparte tus rutinas
        </Text>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Buscar por username o email</Text>

          <TextInput
            value={searchText}
            onChangeText={handleSearch}
            placeholder="usuario o correo"
            placeholderTextColor={colors.secondaryText}
            style={[styles.input, { marginBottom: styles.list.gap }]}
            autoCapitalize="none"
          />

          <View style={styles.list}>
            {searchResults.length === 0 && searchText.trim() ? (
              <Text style={styles.emptyText}>No se encontraron usuarios.</Text>
            ) : (
              searchResults.map((searchUser) => (
                <UserCard
                  key={searchUser.id}
                  user={searchUser}
                  onSend={handleSendRequest}
                  sent={sentRequests.some(
                    (request) => request.toUserId === searchUser.id,
                  )}
                  styles={styles}
                />
              ))
            )}
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Solicitudes recibidas</Text>

          {receivedRequests.length === 0 ? (
            <Text style={styles.emptyText}>
              No tienes solicitudes pendientes.
            </Text>
          ) : (
            <View style={styles.list}>
              {receivedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={handleAcceptRequest}
                  onReject={handleRejectRequest}
                  styles={styles}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Tu lista de amigos</Text>

          {friends.length === 0 ? (
            <Text style={styles.emptyText}>Todavía no tienes amigos.</Text>
          ) : (
            <View style={styles.list}>
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                  styles={styles}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
