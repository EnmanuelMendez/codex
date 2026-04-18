import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { Exercise, ExerciseCatalogItem, Routine } from "../models/workout";
import { db } from "./firebase";

export const getAvailableExercises = async (): Promise<ExerciseCatalogItem[]> => {
    const snapshot = await getDocs(collection(db, "exercises"));

    return snapshot.docs.map((d) => {
        const data = d.data();

        return {
            id: d.id,
            nombre: data.name || "",
            grupo: data.group || "",
            detalle: data.detail || "",
            maquina: data.machine || "",
            videoUrl: data.videoUrl || "",
            videoKey: data.videoKey || "",
        };
    });
};

export const createRoutineDraft = async (
    uid: string,
    data: {
        nombre: string;
        descansoSegundos: number;
    },
): Promise<string> => {
    const ref = await addDoc(collection(db, "users", uid, "routines"), {
        name: data.nombre.trim(),
        creatorId: uid,
        creatorName: "Creada por ti",
        participants: [],
        restSeconds: data.descansoSegundos,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return ref.id;
};

export const updateRoutine = async (
    uid: string,
    routineId: string,
    data: {
        nombre?: string;
        descansoSegundos?: number;
    },
): Promise<void> => {
    const payload: Record<string, any> = {
        updatedAt: serverTimestamp(),
    };

    if (data.nombre !== undefined) {
        payload.name = data.nombre.trim();
    }

    if (data.descansoSegundos !== undefined) {
        payload.restSeconds = data.descansoSegundos;
    }

    await updateDoc(doc(db, "users", uid, "routines", routineId), payload);
};

export const addRoutineExercise = async (
    uid: string,
    routineId: string,
    data: {
        exercise: ExerciseCatalogItem;
        sets: number;
        reps: number;
        order: number;
    },
): Promise<void> => {
    await addDoc(collection(db, "users", uid, "routines", routineId, "exercises"), {
        exerciseCatalogId: data.exercise.id,
        name: data.exercise.nombre,
        group: data.exercise.grupo,
        detail: data.exercise.detalle || "",
        sets: data.sets,
        reps: data.reps,
        durationSeconds: null,
        machine: data.exercise.maquina || "",
        videoUrl: data.exercise.videoUrl || "",
        videoKey: data.exercise.videoKey || "",
        order: data.order,
        status: "Pendiente",
        createdAt: serverTimestamp(),
    });

    await updateRoutine(uid, routineId, {});
};

export const getRoutineExercises = async (
    uid: string,
    routineId: string,
): Promise<Exercise[]> => {
    const q = query(
        collection(db, "users", uid, "routines", routineId, "exercises"),
        orderBy("order", "asc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => {
        const data = d.data();

        return {
            id: d.id,
            exerciseId: data.exerciseCatalogId || d.id,
            nombre: data.name || "",
            grupo: data.group || "",
            detalle: data.detail || "",
            estado: data.status || "Pendiente",
            series: data.sets || 0,
            repeticiones: data.reps || undefined,
            duracionSegundos:
                data.durationSeconds === null || data.durationSeconds === ""
                    ? undefined
                    : data.durationSeconds,
            maquina: data.machine || "",
            videoUrl: data.videoUrl || "",
            videoKey: data.videoKey || "",
            order: data.order || 0,
        };
    });
};

export const getUserRoutines = async (uid: string): Promise<Routine[]> => {
    const snapshot = await getDocs(collection(db, "users", uid, "routines"));

    const routines = await Promise.all(
        snapshot.docs.map(async (d) => {
            const data = d.data();
            const ejercicios = await getRoutineExercises(uid, d.id);

            return {
                id: d.id,
                nombre: data.name || "",
                ejercicios,
                creador: data.creatorName || "Creada por ti",
                participantes: data.participants || [],
                descansoSegundos: data.restSeconds || 60,
            } as Routine;
        }),
    );

    return routines;
};

export const getRoutineById = async (
    uid: string,
    routineId: string,
): Promise<Routine | null> => {
    const refDoc = doc(db, "users", uid, "routines", routineId);
    const snap = await getDoc(refDoc);

    if (!snap.exists()) return null;

    const data = snap.data();
    const ejercicios = await getRoutineExercises(uid, routineId);

    return {
        id: snap.id,
        nombre: data.name || "",
        ejercicios,
        creador: data.creatorName || "Creada por ti",
        participantes: data.participants || [],
        descansoSegundos: data.restSeconds || 60,
    };
};

export const deleteRoutineExercise = async (
    uid: string,
    routineId: string,
    exerciseId: string,
): Promise<void> => {
    await deleteDoc(
        doc(db, "users", uid, "routines", routineId, "exercises", exerciseId),
    );
};

export const deleteRoutine = async (
    uid: string,
    routineId: string,
): Promise<void> => {
    const exercises = await getRoutineExercises(uid, routineId);

    await Promise.all(
        exercises.map((exercise) =>
            deleteDoc(
                doc(db, "users", uid, "routines", routineId, "exercises", exercise.id),
            ),
        ),
    );

    await deleteDoc(doc(db, "users", uid, "routines", routineId));
};