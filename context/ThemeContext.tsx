import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { COLORS, ThemePreference, ThemeType } from "../utils/colors";

type ThemeContextType = {
  theme: ThemeType;
  preference: ThemePreference;
  colors: typeof COLORS.dark;
  toggleTheme: () => void;
  setThemePreference: (value: ThemePreference) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "corex_theme_preference";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (saved === "system" || saved === "dark" || saved === "light") {
          setPreference(saved);
        }
      } finally {
        setIsReady(true);
      }
    };

    loadThemePreference();
  }, []);

  const theme: ThemeType = useMemo(() => {
    if (preference === "dark") return "dark";
    if (preference === "light") return "light";
    return systemScheme === "dark" ? "dark" : "light";
  }, [preference, systemScheme]);

  const setThemePreference = async (value: ThemePreference) => {
    setPreference(value);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, value);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    void setThemePreference(next);
  };

  const value = useMemo(
    () => ({
      theme,
      preference,
      colors: COLORS[theme],
      toggleTheme,
      setThemePreference,
    }),
    [theme, preference],
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
