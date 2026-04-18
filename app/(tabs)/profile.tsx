import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../services/firebase";
import { updateUserProfile } from "../../services/userService";
import { t } from "../locales/translations";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function ProfileScreen() {
  const { colors, theme, toggleTheme, preference, setThemePreference } =
    useTheme();
  const { language, languagePreference, setLanguagePreference } = useLanguage();
  const { user, logout, refreshUser } = useAuth();

  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unitSystem, setUnitSystem] = useState<"Métrico" | "Imperial">(
    "Métrico",
  );
  const [gender, setGender] = useState<"Hombre" | "Mujer" | "">("");
  const [goal, setGoal] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // --- Cambio de contraseña ---
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (!user?.profile) return;

    setFirstName(user.profile.firstName || "");
    setLastName(user.profile.lastName || "");
    setAge(
      user.profile.age !== undefined && user.profile.age !== null
        ? String(user.profile.age)
        : "",
    );
    setWeight(user.profile.weight || "");
    setHeight(user.profile.height || "");
    setUnitSystem(user.profile.unitSystem || "Métrico");
    setGender((user.profile.gender as "Hombre" | "Mujer" | undefined) || "");
    setGoal(user.profile.goal || "");
    setProfileImageUrl(user.profile.profileImageUrl || "");
  }, [user]);

  const handlePickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permiso requerido",
          "Debes conceder permiso para acceder a tus fotos.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const selectedImageUri = result.assets[0].uri;

      setUploadingImage(true);
      setProfileImageUrl(selectedImageUri);

      Alert.alert("Éxito", "Foto de perfil cargada localmente.");
    } catch (error: any) {
      console.log("ERROR AL SELECCIONAR FOTO:", error);
      Alert.alert("Error", "No se pudo cargar la foto de perfil.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!firstName.trim()) {
      Alert.alert("Dato requerido", "Ingresa tu nombre.");
      return;
    }

    if (!lastName.trim()) {
      Alert.alert("Dato requerido", "Ingresa tu apellido.");
      return;
    }

    if (!age.trim() || Number.isNaN(Number(age))) {
      Alert.alert("Dato inválido", "Ingresa una edad válida.");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: Number(age),
        weight: weight.trim(),
        height: height.trim(),
        unitSystem,
        gender: gender || null,
        goal: goal.trim(),
      });

      await refreshUser();

      Alert.alert("Éxito", "Perfil actualizado correctamente.");
    } catch (error: any) {
      console.log("ERROR AL GUARDAR PERFIL:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Campo requerido", "Ingresa tu contraseña actual.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Contraseña débil", "La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("No coinciden", "La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      setChangingPassword(true);
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) throw new Error("Sin sesión activa.");

      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordSection(false);
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
    } catch (error: any) {
      const code = error?.code;
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        Alert.alert("Error", "La contraseña actual es incorrecta.");
      } else if (code === "auth/too-many-requests") {
        Alert.alert("Error", "Demasiados intentos. Inténtalo más tarde.");
      } else {
        Alert.alert("Error", "No se pudo cambiar la contraseña.");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: "FitApp — Tu app de entrenamiento",
        message:
          "¡Entrena con FitApp! Lleva el control de tus rutinas, estado de ánimo y progreso. Descárgala aquí: https://fitapp.example.com",
      });
    } catch {
      Alert.alert("Error", "No se pudo abrir el menú de compartir.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSpace} />

        <View style={styles.headerRow}>
          <Text style={styles.title}>{t(language, "profile")}</Text>

          <Pressable onPress={toggleTheme} style={styles.iconButton}>
            <Ionicons
              name={theme === "dark" ? "sunny" : "moon"}
              size={20}
              color={colors.primary}
            />
          </Pressable>
        </View>

        <Text style={styles.emailText}>{user?.email}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Foto de perfil</Text>

          <View
            style={{
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {profileImageUrl ? (
              <Image
                source={{ uri: profileImageUrl }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  marginBottom: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: "#1E3650",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="person"
                  size={42}
                  color={colors.secondaryText}
                />
              </View>
            )}

            <Pressable
              style={[
                styles.actionButton,
                styles.secondaryButton,
                { width: 180 },
              ]}
              onPress={handlePickImage}
              disabled={uploadingImage}
            >
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                {uploadingImage
                  ? t(language, "loadingPhoto")
                  : t(language, "changePhoto")}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>{t(language, "firstName")}</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t(language, "firstName")}
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "lastName")}</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder={t(language, "lastName")}
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "age")}</Text>
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Ej: 25"
            placeholderTextColor="#8AA0B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "weight")}</Text>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder={unitSystem === "Métrico" ? "Ej: 72" : "Ej: 159"}
            placeholderTextColor="#8AA0B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "height")}</Text>
          <TextInput
            value={height}
            onChangeText={setHeight}
            placeholder={unitSystem === "Métrico" ? "Ej: 175" : "Ej: 5.9"}
            placeholderTextColor="#8AA0B8"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "unitSystem")}</Text>
          <View style={styles.segmentedContainer}>
            <Pressable
              onPress={() => setUnitSystem("Métrico")}
              style={[
                styles.segmentButton,
                unitSystem === "Métrico" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  unitSystem === "Métrico" && styles.segmentTextActive,
                ]}
              >
                Métrico
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setUnitSystem("Imperial")}
              style={[
                styles.segmentButton,
                unitSystem === "Imperial" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  unitSystem === "Imperial" && styles.segmentTextActive,
                ]}
              >
                Imperial
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>{t(language, "gender")}</Text>
          <View style={styles.segmentedContainer}>
            <Pressable
              onPress={() => setGender("Hombre")}
              style={[
                styles.segmentButton,
                gender === "Hombre" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  gender === "Hombre" && styles.segmentTextActive,
                ]}
              >
                Hombre
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setGender("Mujer")}
              style={[
                styles.segmentButton,
                gender === "Mujer" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  gender === "Mujer" && styles.segmentTextActive,
                ]}
              >
                Mujer
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>{t(language, "goal")}</Text>
          <TextInput
            value={goal}
            onChangeText={setGoal}
            placeholder="Ej: Ganar músculo"
            placeholderTextColor="#8AA0B8"
            style={styles.input}
          />

          <Text style={styles.label}>{t(language, "themeMode")}</Text>
          <View style={styles.segmentedContainer}>
            <Pressable
              onPress={() => setThemePreference("system")}
              style={[
                styles.segmentButton,
                preference === "system" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  preference === "system" && styles.segmentTextActive,
                ]}
              >
                {t(language, "automatic")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setThemePreference("light")}
              style={[
                styles.segmentButton,
                preference === "light" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  preference === "light" && styles.segmentTextActive,
                ]}
              >
                {t(language, "light")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setThemePreference("dark")}
              style={[
                styles.segmentButton,
                preference === "dark" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  preference === "dark" && styles.segmentTextActive,
                ]}
              >
                {t(language, "dark")}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.label}>{t(language, "language")}</Text>
          <View style={styles.segmentedContainer}>
            <Pressable
              onPress={() => setLanguagePreference("system")}
              style={[
                styles.segmentButton,
                languagePreference === "system" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  languagePreference === "system" && styles.segmentTextActive,
                ]}
              >
                {t(language, "automatic")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLanguagePreference("es")}
              style={[
                styles.segmentButton,
                languagePreference === "es" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  languagePreference === "es" && styles.segmentTextActive,
                ]}
              >
                {t(language, "spanish")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setLanguagePreference("en")}
              style={[
                styles.segmentButton,
                languagePreference === "en" && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  languagePreference === "en" && styles.segmentTextActive,
                ]}
              >
                {t(language, "english")}
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.actionText, styles.primaryButtonText]}>
            {saving ? "Guardando..." : t(language, "saveChanges")}
          </Text>
        </Pressable>

        {/* ── Seguridad: cambio de contraseña ── */}
        <View style={styles.card}>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPress={() => setShowPasswordSection((v) => !v)}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
                Cambiar contraseña
              </Text>
            </View>
            <Ionicons
              name={showPasswordSection ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.secondaryText}
            />
          </Pressable>

          {showPasswordSection && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Contraseña actual</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Contraseña actual"
                  placeholderTextColor="#8AA0B8"
                  secureTextEntry={!showCurrentPwd}
                  style={[styles.input, { paddingRight: 44 }]}
                />
                <Pressable
                  onPress={() => setShowCurrentPwd((v) => !v)}
                  style={{ position: "absolute", right: 12, top: 12 }}
                >
                  <Ionicons
                    name={showCurrentPwd ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.secondaryText}
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#8AA0B8"
                  secureTextEntry={!showNewPwd}
                  style={[styles.input, { paddingRight: 44 }]}
                />
                <Pressable
                  onPress={() => setShowNewPwd((v) => !v)}
                  style={{ position: "absolute", right: 12, top: 12 }}
                >
                  <Ionicons
                    name={showNewPwd ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.secondaryText}
                  />
                </Pressable>
              </View>

              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor="#8AA0B8"
                  secureTextEntry={!showConfirmPwd}
                  style={[styles.input, { paddingRight: 44 }]}
                />
                <Pressable
                  onPress={() => setShowConfirmPwd((v) => !v)}
                  style={{ position: "absolute", right: 12, top: 12 }}
                >
                  <Ionicons
                    name={showConfirmPwd ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.secondaryText}
                  />
                </Pressable>
              </View>

              <Pressable
                style={[
                  styles.actionButton,
                  styles.primaryButton,
                  { marginTop: 4, marginBottom: 0 },
                ]}
                onPress={handleChangePassword}
                disabled={changingPassword}
              >
                <Text style={[styles.actionText, styles.primaryButtonText]}>
                  {changingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* ── Compartir app ── */}
        <View style={[styles.card, { marginBottom: 12 }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Ionicons name="share-social-outline" size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
              Compartir aplicación
            </Text>
          </View>
          <Text style={[styles.subtitle, { marginBottom: 16 }]}>
            Comparte FitApp con amigos por WhatsApp, email u otras apps.
          </Text>
          <Pressable
            style={[styles.actionButton, styles.secondaryButton, { marginBottom: 0 }]}
            onPress={handleShareApp}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="share-outline" size={18} color={colors.primary} />
              <Text style={[styles.actionText, styles.secondaryButtonText]}>
                Compartir FitApp
              </Text>
            </View>
          </Pressable>
        </View>

        <Pressable
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.actionText, styles.secondaryButtonText]}>
            {t(language, "logout")}
          </Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
