import { useTheme } from "@/context/ThemeContext";
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
import { Friend } from "../../models/friend";
import { FriendRequest } from "../../models/friendRequest";

const USERS: Friend[] = [
  { id: "u1", name: "Juan Pérez", email: "juan@corex.app" },
  { id: "u2", name: "María López", email: "maria@corex.app" },
  { id: "u3", name: "Carlos Ruiz", email: "carlos@corex.app" },
  { id: "u4", name: "Laura Gómez", email: "laura@corex.app" },
];

const INITIAL_FRIENDS: Friend[] = [
  { id: "f1", name: "Pedro Silva", email: "pedro@corex.app" },
  { id: "f2", name: "Ana Torres", email: "ana@corex.app" },
];

const INITIAL_RECEIVED_REQUESTS: FriendRequest[] = [
  {
    id: "r1",
    name: "María López",
    email: "maria@corex.app",
    status: "received",
  },
  {
    id: "r2",
    name: "Carlos Ruiz",
    email: "carlos@corex.app",
    status: "received",
  },
];

function UserCard({ user, onSend, sent, colors }: any) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: "#1E3650",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          {user.name}
        </Text>
        <Text
          style={{ color: colors.secondaryText, fontSize: 12, marginTop: 2 }}
        >
          {user.email}
        </Text>
      </View>

      <Pressable
        onPress={() => onSend(user)}
        disabled={sent}
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: 8,
          paddingHorizontal: 12,
          opacity: sent ? 0.55 : 1,
        }}
      >
        <Text
          style={{ color: colors.background, fontWeight: "700", fontSize: 12 }}
        >
          {sent ? "Enviada" : "Enviar"}
        </Text>
      </Pressable>
    </View>
  );
}

function RequestCard({ request, onAccept, colors }: any) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: "#1E3650",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          {request.name}
        </Text>
        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
          {request.email}
        </Text>
      </View>

      <Pressable
        onPress={() => onAccept(request)}
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.primary,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: "rgba(163,255,18,0.12)",
        }}
      >
        <Text
          style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}
        >
          Aceptar
        </Text>
      </Pressable>
    </View>
  );
}

function FriendCard({ friend, colors }: any) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: "#1E3650",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 11,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontWeight: "700" }}>
          {friend.name}
        </Text>
        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
          {friend.email}
        </Text>
      </View>

      <View
        style={{
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.primary,
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: "rgba(163,255,18,0.12)",
        }}
      >
        <Text
          style={{ color: colors.primary, fontWeight: "700", fontSize: 11 }}
        >
          Amigo
        </Text>
      </View>
    </View>
  );
}

export default function FriendsScreen() {
  const { colors } = useTheme();

  const [searchEmail, setSearchEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState(
    INITIAL_RECEIVED_REQUESTS,
  );

  const filteredUsers = useMemo(() => {
    const query = searchEmail.trim().toLowerCase();
    if (!query) return USERS;
    return USERS.filter((user) => user.email.toLowerCase().includes(query));
  }, [searchEmail]);

  const sendRequest = (user: Friend) => {
    if (sentRequests.some((r) => r.email === user.email)) return;
    setSentRequests((prev) => [...prev, { ...user, status: "sent" }]);
  };

  const acceptRequest = (request: FriendRequest) => {
    setReceivedRequests((prev) =>
      prev.filter((item) => item.id !== request.id),
    );
    setFriends((prev) => {
      if (prev.some((f) => f.email === request.email)) return prev;
      return [
        ...prev,
        { id: request.id, email: request.email, name: request.name },
      ];
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    title: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "700",
    },
    subtitle: {
      color: colors.secondaryText,
      marginTop: 4,
      marginBottom: 16,
    },
    section: {
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#1E3650",
      padding: 14,
      marginBottom: 14,
    },
    sectionTitle: {
      color: colors.secondaryText,
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 10,
    },
    searchInput: {
      backgroundColor: "#7b91ab",
      borderWidth: 1,
      borderColor: "#1E3650",
      borderRadius: 12,
      color: colors.text,
      paddingHorizontal: 12,
      paddingVertical: 11,
      marginBottom: 10,
    },
    list: {
      gap: 8,
    },
    emptyText: {
      color: colors.secondaryText,
      fontSize: 13,
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
        <Text style={styles.title}>Amigos</Text>
        <Text style={styles.subtitle}>
          Busca usuarios y comparte tus rutinas
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buscar por email</Text>
          <TextInput
            value={searchEmail}
            onChangeText={setSearchEmail}
            placeholder="ejemplo@correo.com"
            placeholderTextColor={colors.secondaryText}
            style={styles.searchInput}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.list}>
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onSend={sendRequest}
                sent={sentRequests.some((r) => r.email === user.email)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
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
                  onAccept={acceptRequest}
                  colors={colors}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu lista de amigos</Text>
          <View style={styles.list}>
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} colors={colors} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
