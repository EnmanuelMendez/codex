import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await login(username.trim(), password);
    } catch (err: any) {
      setError(err?.message || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>COREX</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Usuario"
        placeholderTextColor="#8AA0B8"
        autoCapitalize="none"
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

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Iniciar Sesión
          </Text>
        )}
      </Pressable>

      <Link href="/(auth)/register" style={styles.linkText}>
        ¿No tienes una cuenta? Regístrate
      </Link>
    </View>
  );
}
