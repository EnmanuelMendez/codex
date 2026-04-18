import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useMemo } from "react";
import { t } from "../locales/translations";
import { createGlobalStyles } from "../styles/createGlobalStyles";

export default function TabLayout() {
  const { colors } = useTheme();
  const { language } = useLanguage(); // Idioma actual
  const styles = useMemo(() => createGlobalStyles(colors), [colors]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#8AA0B8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t(language, "home"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="routines"
        options={{
          title: t(language, "routines"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: t(language, "friends"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="mood"
        options={{
          title: t(language, "mood"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="happy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t(language, "profile"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="task-inventory"
        options={{
          title: t(language, "inventory"),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
