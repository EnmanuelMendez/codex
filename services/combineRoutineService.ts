import {
    addDoc,
    collection,
    serverTimestamp,
} from "firebase/firestore";
import { Exercise } from "../models/workout";
import { db } from "./firebase";
import { getRoutineById } from "./routineService";
import { getUserSelectedRoutine } from "./trainingService";

const normalizeExerciseName = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const deduplicateExercises = (exercises: Exercise[]): Exercise[] => {
    const seen = new Set<string>();
    const result: Exercise[] = [];

    for (const exercise of exercises) {
        const key = normalizeExerciseName(exercise.nombre);

        if (!seen.has(key)) {
            seen.add(key);
            result.push(exercise);
        }
    }

    return result;
};

export const combineSelectedRoutinesWithFriend = async (
    currentUserId: string,
    friendUserId: string,
    friendName: string,
): Promise<string> => {
    const currentSelected = await getUserSelectedRoutine(currentUserId);
    const friendSelected = await getUserSelectedRoutine(friendUserId);

    if (!currentSelected?.selectedRoutineId) {
        throw new Error("Debes seleccionar primero tu rutina del día.");
    }

    if (!friendSelected?.selectedRoutineId) {
        throw new Error("Tu amigo no tiene una rutina seleccionada.");
    }

    const currentRoutine = await getRoutineById(
        currentUserId,
        currentSelected.selectedRoutineId,
    );

    const friendRoutine = await getRoutineById(
        friendUserId,
        friendSelected.selectedRoutineId,
    );

    if (!currentRoutine) {
        throw new Error("No se pudo cargar tu rutina seleccionada.");
    }

    if (!friendRoutine) {
        throw new Error("No se pudo cargar la rutina seleccionada de tu amigo.");
    }

    const combinedExercises = deduplicateExercises([
        ...currentRoutine.ejercicios,
        ...friendRoutine.ejercicios,
    ]).map((exercise, index) => ({
        ...exercise,
        order: index + 1,
        estado: "Pendiente" as const,
    }));

    const combinedRoutineRef = await addDoc(
        collection(db, "users", currentUserId, "routines"),
        {
            name: `Combinada: ${currentRoutine.nombre} + ${friendRoutine.nombre}`,
            creatorId: currentUserId,
            creatorName: "Rutina combinada",
            participants: [currentUserId, friendUserId],
            restSeconds:
                currentRoutine.descansoSegundos ||
                friendRoutine.descansoSegundos ||
                60,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            combined: true,
            combinedWithUserId: friendUserId,
            combinedWithName: friendName,
            sourceRoutineIds: [currentRoutine.id, friendRoutine.id],
        },
    );

    await Promise.all(
        combinedExercises.map((exercise) =>
            addDoc(
                collection(
                    db,
                    "users",
                    currentUserId,
                    "routines",
                    combinedRoutineRef.id,
                    "exercises",
                ),
                {
                    exerciseCatalogId: exercise.exerciseId || "",
                    name: exercise.nombre,
                    group: exercise.grupo,
                    detail: exercise.detalle || "",
                    sets: exercise.series || 1,
                    reps: exercise.repeticiones || 0,
                    durationSeconds: exercise.duracionSegundos ?? null,
                    machine: exercise.maquina || "",
                    videoUrl: exercise.videoUrl || "",
                    videoKey: exercise.videoKey || "",
                    order: exercise.order || 0,
                    status: "Pendiente",
                    createdAt: serverTimestamp(),
                },
            ),
        ),
    );

    return combinedRoutineRef.id;
};