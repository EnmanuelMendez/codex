import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "../models/User";
import * as authService from "../services/authService";
import { auth } from "../services/firebase";
import * as userService from "../services/userService";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: {
    age?: number;
    weight?: string;
    height?: string;
    unitSystem?: "Métrico" | "Imperial";
    gender?: "Hombre" | "Mujer";
    goal?: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  let profile = await userService.getUserProfile(firebaseUser.uid);

  if (!profile) {
    await userService.createUserProfile(firebaseUser.uid, {
      email: firebaseUser.email ?? "",
      username: firebaseUser.email?.split("@")[0] ?? firebaseUser.uid,
      firstName: "",
      lastName: "",
    });

    profile = await userService.getUserProfile(firebaseUser.uid);
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    username: profile?.username ?? "",
    onboardingCompleted: profile?.onboardingCompleted ?? false,
    profile: {
      username: profile?.username,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      age: profile?.age,
      weight: profile?.weight,
      height: profile?.height,
      unitSystem: profile?.unitSystem,
      gender: profile?.gender,
      goal: profile?.goal,
      mood: profile?.mood,
      email: profile?.email,
      profileImageUrl: profile?.profileImageUrl,
    },
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      setUser(null);
      return;
    }

    const mappedUser = await mapFirebaseUser(firebaseUser);
    setUser(mappedUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const mappedUser = await mapFirebaseUser(firebaseUser);
          setUser(mappedUser);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,

      login: async (usernameOrEmail: string, password: string) => {
        await authService.login(usernameOrEmail, password);
      },

      register: async (
        email: string,
        password: string,
        username: string,
        firstName?: string,
        lastName?: string,
      ) => {
        const exists = await userService.usernameExists(username);

        if (exists) {
          throw new Error("Ese nombre de usuario ya está en uso.");
        }

        const credential = await authService.register(email, password);

        await userService.createUserProfile(credential.user.uid, {
          email: email.trim(),
          username,
          firstName,
          lastName,
        });
      },

      logout: async () => {
        await authService.logout();
      },

      completeOnboarding: async (data) => {
        if (!user) return;

        await userService.completeOnboarding(user.id, data);

        setUser((prev) =>
          prev
            ? {
                ...prev,
                onboardingCompleted: true,
                profile: {
                  ...prev.profile,
                  ...data,
                },
              }
            : null,
        );
      },

      refreshUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
