import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { validateEmail, validatePassword } from "@/utils/validators";
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

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un email válido.");
      return;
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(email.trim(), password);

      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setError("");

      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 2000);
    } catch {
      setError("El registro falló. Por favor, inténtalo de nuevo.");
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
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 20,
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
    success: {
      color: "#6BFF9A",
      marginBottom: 8,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

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

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirma la contraseña"
        placeholderTextColor="#8AA0B8"
        secureTextEntry
        style={styles.input}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
      {!!success && <Text style={styles.success}>{success}</Text>}

      <Pressable
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={styles.buttonText}>Regístrate</Text>
        )}
      </Pressable>

      <Link href="/(auth)/login" style={styles.link}>
        ¿Ya tienes una cuenta? Inicia Sesión
      </Link>
    </View>
  );
}
