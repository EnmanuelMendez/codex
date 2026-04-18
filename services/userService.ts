import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export type FirestoreUserProfile = {
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    onboardingCompleted?: boolean;
    age?: number;
    weight?: string;
    height?: string;
    unitSystem?: "Métrico" | "Imperial";
    gender?: "Hombre" | "Mujer";
    goal?: string;
    mood?: string;
    profileImageUrl?: string;
};

export type FirestoreUserWithId = FirestoreUserProfile & {
    id: string;
};

export const getUserProfile = async (
    uid: string,
): Promise<FirestoreUserProfile | null> => {
    const refDoc = doc(db, "users", uid);
    const snap = await getDoc(refDoc);

    return snap.exists() ? (snap.data() as FirestoreUserProfile) : null;
};

export const getUserByUsername = async (
    username: string,
): Promise<FirestoreUserWithId | null> => {
    const normalizedUsername = username.trim().toLowerCase();

    const q = query(
        collection(db, "users"),
        where("username", "==", normalizedUsername),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const userDoc = snapshot.docs[0];
    const data = userDoc.data() as FirestoreUserProfile;

    return {
        id: userDoc.id,
        ...data,
    };
};

export const usernameExists = async (username: string): Promise<boolean> => {
    const existingUser = await getUserByUsername(username);
    return !!existingUser;
};

export const createUserProfile = async (
    uid: string,
    data: {
        email: string;
        username: string;
        firstName?: string;
        lastName?: string;
    },
): Promise<void> => {
    await setDoc(doc(db, "users", uid), {
        email: data.email.trim(),
        username: data.username.trim().toLowerCase(),
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
        onboardingCompleted: false,
        profileImageUrl: "",
    });
};

export const updateUserProfile = async (
    uid: string,
    data: {
        firstName?: string;
        lastName?: string;
        age?: number | null;
        weight?: string;
        height?: string;
        unitSystem?: "Métrico" | "Imperial";
        gender?: "Hombre" | "Mujer" | null;
        goal?: string;
        profileImageUrl?: string;
    },
): Promise<void> => {
    await updateDoc(doc(db, "users", uid), {
        ...data,
    });
};

export const completeOnboarding = async (
    uid: string,
    data: {
        age?: number;
        weight?: string;
        height?: string;
        unitSystem?: "Métrico" | "Imperial";
        gender?: "Hombre" | "Mujer";
        goal?: string;
    },
): Promise<void> => {
    await updateDoc(doc(db, "users", uid), {
        ...data,
        onboardingCompleted: true,
    });
};