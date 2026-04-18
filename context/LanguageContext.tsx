import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage = "system" | "es" | "en";
export type ResolvedLanguage = "es" | "en";

type LanguageContextType = {
  languagePreference: AppLanguage;
  language: ResolvedLanguage;
  setLanguagePreference: (value: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const LANGUAGE_STORAGE_KEY = "corex_language_preference";

function resolveSystemLanguage(): ResolvedLanguage {
  const locale = Localization.getLocales()?.[0];
  const code = locale?.languageCode?.toLowerCase();

  return code === "en" ? "en" : "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [languagePreference, setLanguagePreferenceState] =
    useState<AppLanguage>("system");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (saved === "system" || saved === "es" || saved === "en") {
          setLanguagePreferenceState(saved);
        }
      } finally {
        setIsReady(true);
      }
    };

    loadLanguagePreference();
  }, []);

  const language: ResolvedLanguage = useMemo(() => {
    if (languagePreference === "system") {
      return resolveSystemLanguage();
    }

    return languagePreference;
  }, [languagePreference]);

  const setLanguagePreference = async (value: AppLanguage) => {
    setLanguagePreferenceState(value);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, value);
  };

  const value = useMemo(
    () => ({
      languagePreference,
      language,
      setLanguagePreference,
    }),
    [languagePreference, language],
  );

  if (!isReady) {
    return null;
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
