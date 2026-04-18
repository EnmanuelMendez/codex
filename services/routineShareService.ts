import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { Friend } from "../models/friend";
import { RoutineShare } from "../models/routineShare";
import { db } from "./firebase";

export const shareRoutineWithFriend = async (
    ownerUserId: string,
    targetUserId: string,
    routineId: string,
): Promise<void> => {
    const shareId = `${ownerUserId}_${routineId}_${targetUserId}`;

    const existingQuery = query(
        collection(db, "routine_shares"),
        where("ownerUserId", "==", ownerUserId),
        where("targetUserId", "==", targetUserId),
        where("routineId", "==", routineId),
        where("status", "==", "pending"),
        where("type", "==", "routine_share"),
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
        throw new Error("Ya existe una solicitud de rutina pendiente para este amigo.");
    }

    const routineSnap = await getDoc(doc(db, "users", ownerUserId, "routines", routineId));
    const ownerSnap = await getDoc(doc(db, "users", ownerUserId));

    const routineData = routineSnap.exists() ? routineSnap.data() : null;
    const ownerData = ownerSnap.exists() ? ownerSnap.data() : null;

    const ownerName = `${ownerData?.firstName || ""} ${ownerData?.lastName || ""}`.trim();

    await setDoc(doc(db, "routine_shares", shareId), {
        routineId,
        routineName: routineData?.name || "",
        ownerUserId,
        ownerName,
        targetUserId,
        status: "pending",
        type: "routine_share",
        createdAt: serverTimestamp(),
    });
};

export const getShareableFriends = async (uid: string): Promise<Friend[]> => {
    const snapshot = await getDocs(collection(db, "users", uid, "friends"));

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
            id: docSnap.id,
            friendUserId: data.friendUserId || "",
            username: data.username || "",
            email: data.email || "",
            name: data.name || "",
        };
    });
};

export const getReceivedRoutineShares = async (
    uid: string,
): Promise<RoutineShare[]> => {
    const q = query(
        collection(db, "routine_shares"),
        where("targetUserId", "==", uid),
        where("status", "==", "pending"),
        where("type", "==", "routine_share"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
            id: docSnap.id,
            routineId: data.routineId || "",
            routineName: data.routineName || "",
            ownerUserId: data.ownerUserId || "",
            ownerName: data.ownerName || "",
            targetUserId: data.targetUserId || "",
            status: data.status || "pending",
            type: "routine_share",
        };
    });
};

export const rejectRoutineShare = async (shareId: string): Promise<void> => {
    await updateDoc(doc(db, "routine_shares", shareId), {
        status: "rejected",
    });
};

export const acceptRoutineShare = async (
    currentUserId: string,
    share: RoutineShare,
): Promise<void> => {
    const sourceRoutineRef = doc(db, "users", share.ownerUserId, "routines", share.routineId);
    const sourceRoutineSnap = await getDoc(sourceRoutineRef);

    if (!sourceRoutineSnap.exists()) {
        throw new Error("La rutina compartida ya no existe.");
    }

    const sourceRoutineData = sourceRoutineSnap.data();

    const targetRoutineRef = await addDoc(collection(db, "users", currentUserId, "routines"), {
        name: sourceRoutineData.name || share.routineName || "Rutina compartida",
        creatorId: share.ownerUserId,
        creatorName: share.ownerName || "Rutina compartida",
        participants: [share.ownerUserId, currentUserId],
        restSeconds: sourceRoutineData.restSeconds || 60,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sharedFromRoutineId: share.routineId,
        sharedFromUserId: share.ownerUserId,
    });

    const sourceExercisesSnap = await getDocs(
        collection(db, "users", share.ownerUserId, "routines", share.routineId, "exercises"),
    );

    await Promise.all(
        sourceExercisesSnap.docs.map((exerciseDoc) => {
            const data = exerciseDoc.data();

            return addDoc(
                collection(db, "users", currentUserId, "routines", targetRoutineRef.id, "exercises"),
                {
                    exerciseCatalogId: data.exerciseCatalogId || "",
                    name: data.name || "",
                    group: data.group || "",
                    detail: data.detail || "",
                    sets: data.sets || 0,
                    reps: data.reps || 0,
                    durationSeconds:
                        data.durationSeconds === "" ? null : data.durationSeconds ?? null,
                    machine: data.machine || "",
                    videoUrl: data.videoUrl || "",
                    videoKey: data.videoKey || "",
                    order: data.order || 0,
                    status: "Pendiente",
                    createdAt: serverTimestamp(),
                },
            );
        }),
    );

    await updateDoc(doc(db, "routine_shares", share.id), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        copiedRoutineId: targetRoutineRef.id,
    });
};