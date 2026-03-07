import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email.trim(), password);
      router.replace("/(tabs)");
    } catch {
      setError("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 24,
      backgroundColor: colors.background,
    },
    title: {
      color: colors.text,
      fontSize: 36,
      fontWeight: "700",
      marginBottom: 8,
    },
    subtitle: {
      color: colors.text,
      opacity: 0.85,
      marginBottom: 24,
    },
    input: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 12,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: "center",
      paddingVertical: 12,
      marginTop: 4,
    },
    buttonText: {
      color: colors.background,
      fontWeight: "700",
    },
    link: {
      color: colors.primary,
      textAlign: "center",
      marginTop: 18,
    },
    error: {
      color: "#FF7373",
      marginBottom: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COREX</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Correo"
        placeholderTextColor="#8AA0B8"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        placeholderTextColor="#8AA0B8"
        secureTextEntry
        style={styles.input}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </Pressable>

      <Link href="/(auth)/register" style={styles.link}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </View>
  );
}
