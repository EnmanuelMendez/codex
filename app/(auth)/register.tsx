import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { validateEmail, validatePassword } from "@/utils/validators";
import { Link, router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!username.trim()) {
      setError("Debes ingresar un nombre de usuario.");
      return;
    }
    if (!firstName.trim()) {
      setError("Debes ingresar tu nombre.");
      return;
    }
    if (!lastName.trim()) {
      setError("Debes ingresar tu apellido.");
      return;
    }
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
      await register(
        email.trim(),
        password,
        username.trim(),
        firstName.trim(),
        lastName.trim(),
      );
      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => {
        router.replace("/(auth)/login");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.message || "El registro falló. Por favor, inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre de usuario"
        placeholderTextColor="#8AA0B8"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Nombre"
        placeholderTextColor="#8AA0B8"
        style={styles.input}
      />

      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Apellido"
        placeholderTextColor="#8AA0B8"
        style={styles.input}
      />

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

      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!!success && <Text style={styles.successText}>{success}</Text>}

      <Pressable
        style={[styles.actionButton, styles.primaryButton]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            Regístrate
          </Text>
        )}
      </Pressable>

      <Link href="/(auth)/login" style={styles.linkText}>
        ¿Ya tienes una cuenta? Inicia Sesión
      </Link>
    </ScrollView>
  );
}
