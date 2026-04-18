import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type TrainingSelection = {
    selectedRoutineId: string | null;
    selectedAt?: any;
};

export type ActiveWorkoutState = {
    routineId: string | null;
    currentIndex: number;
    started: boolean;
    completed: boolean;
    updatedAt?: any;
};

const getSelectionRef = (uid: string) =>
    doc(db, "users", uid, "app_state", "training_selection");

const getWorkoutRef = (uid: string) =>
    doc(db, "users", uid, "app_state", "active_workout");

export const setSelectedRoutine = async (
    uid: string,
    routineId: string,
): Promise<void> => {
    await setDoc(getSelectionRef(uid), {
        selectedRoutineId: routineId,
        selectedAt: serverTimestamp(),
    });
};

export const getSelectedRoutine = async (
    uid: string,
): Promise<TrainingSelection | null> => {
    const snap = await getDoc(getSelectionRef(uid));
    return snap.exists() ? (snap.data() as TrainingSelection) : null;
};

export const getUserSelectedRoutine = async (
    uid: string,
): Promise<TrainingSelection | null> => {
    const snap = await getDoc(getSelectionRef(uid));
    return snap.exists() ? (snap.data() as TrainingSelection) : null;
};

export const clearSelectedRoutine = async (uid: string): Promise<void> => {
    await setDoc(getSelectionRef(uid), {
        selectedRoutineId: null,
        selectedAt: serverTimestamp(),
    });
};

export const startWorkoutState = async (
    uid: string,
    routineId: string,
): Promise<void> => {
    await setDoc(getWorkoutRef(uid), {
        routineId,
        currentIndex: 0,
        started: true,
        completed: false,
        updatedAt: serverTimestamp(),
    });
};

export const updateWorkoutProgress = async (
    uid: string,
    data: {
        routineId: string;
        currentIndex: number;
        started: boolean;
        completed: boolean;
    },
): Promise<void> => {
    await setDoc(
        getWorkoutRef(uid),
        {
            ...data,
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );
};

export const getActiveWorkoutState = async (
    uid: string,
): Promise<ActiveWorkoutState | null> => {
    const snap = await getDoc(getWorkoutRef(uid));
    return snap.exists() ? (snap.data() as ActiveWorkoutState) : null;
};

export const clearWorkoutState = async (uid: string): Promise<void> => {
    await setDoc(getWorkoutRef(uid), {
        routineId: null,
        currentIndex: 0,
        started: false,
        completed: false,
        updatedAt: serverTimestamp(),
    });
};