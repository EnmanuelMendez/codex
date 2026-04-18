import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { Friend } from "../models/friend";
import { FriendRequest } from "../models/friendRequest";
import { db } from "./firebase";

type SearchUserResult = {
    id: string;
    username: string;
    email: string;
    name: string;
};

export const searchUsers = async (
    currentUserId: string,
    search: string,
): Promise<SearchUserResult[]> => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) return [];

    const usersSnapshot = await getDocs(collection(db, "users"));

    return usersSnapshot.docs
        .map((docSnap) => {
            const data = docSnap.data();
            const firstName = data.firstName || "";
            const lastName = data.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim();

            return {
                id: docSnap.id,
                username: data.username || "",
                email: data.email || "",
                name: fullName,
            };
        })
        .filter((user) => {
            if (user.id === currentUserId) return false;

            return (
                user.email.toLowerCase().includes(normalized) ||
                user.username.toLowerCase().includes(normalized) ||
                user.name.toLowerCase().includes(normalized)
            );
        });
};

export const getFriends = async (uid: string): Promise<Friend[]> => {
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

export const getReceivedFriendRequests = async (
    uid: string,
): Promise<FriendRequest[]> => {
    const q = query(
        collection(db, "user_friend_request"),
        where("toUserId", "==", uid),
        where("status", "==", "pending"),
        where("type", "==", "friend_request"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
            id: docSnap.id,
            fromUserId: data.fromUserId || "",
            toUserId: data.toUserId || "",
            fromUsername: data.fromUsername || "",
            fromEmail: data.fromEmail || "",
            fromName: data.fromName || "",
            status: data.status || "pending",
            type: "friend_request",
        };
    });
};

export const getSentFriendRequests = async (
    uid: string,
): Promise<FriendRequest[]> => {
    const q = query(
        collection(db, "user_friend_request"),
        where("fromUserId", "==", uid),
        where("status", "==", "pending"),
        where("type", "==", "friend_request"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
            id: docSnap.id,
            fromUserId: data.fromUserId || "",
            toUserId: data.toUserId || "",
            fromUsername: data.fromUsername || "",
            fromEmail: data.fromEmail || "",
            fromName: data.fromName || "",
            status: data.status || "pending",
            type: "friend_request",
        };
    });
};

export const sendFriendRequest = async (
    currentUser: {
        id: string;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
    },
    targetUser: {
        id: string;
        username: string;
        email: string;
        name: string;
    },
): Promise<void> => {
    const existingSent = query(
        collection(db, "user_friend_request"),
        where("fromUserId", "==", currentUser.id),
        where("toUserId", "==", targetUser.id),
        where("status", "==", "pending"),
        where("type", "==", "friend_request"),
    );

    const existingReceived = query(
        collection(db, "user_friend_request"),
        where("fromUserId", "==", targetUser.id),
        where("toUserId", "==", currentUser.id),
        where("status", "==", "pending"),
        where("type", "==", "friend_request"),
    );

    const sentSnap = await getDocs(existingSent);
    const receivedSnap = await getDocs(existingReceived);

    if (!sentSnap.empty || !receivedSnap.empty) {
        throw new Error("Ya existe una solicitud pendiente entre estos usuarios.");
    }

    await addDoc(collection(db, "user_friend_request"), {
        fromUserId: currentUser.id,
        toUserId: targetUser.id,
        fromUsername: currentUser.username,
        fromEmail: currentUser.email,
        fromName:
            `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim(),
        status: "pending",
        type: "friend_request",
        createdAt: serverTimestamp(),
    });
};

export const acceptFriendRequest = async (
    currentUser: {
        id: string;
        username: string;
        email: string;
        firstName?: string;
        lastName?: string;
    },
    request: FriendRequest,
): Promise<void> => {
    const currentUserName =
        `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();

    // 1. marcar request como aceptado
    await updateDoc(doc(db, "user_friend_request", request.id), {
        status: "accepted",
    });

    // 2. crear amigo en el usuario actual
    await setDoc(doc(db, "users", currentUser.id, "friends", request.fromUserId), {
        friendUserId: request.fromUserId,
        username: request.fromUsername,
        email: request.fromEmail,
        name: request.fromName,
        createdAt: serverTimestamp(),
    });

    // 3. crear amigo en el usuario que envió la solicitud
    await setDoc(doc(db, "users", request.fromUserId, "friends", currentUser.id), {
        friendUserId: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        name: currentUserName,
        createdAt: serverTimestamp(),
    });
};

export const rejectFriendRequest = async (
    requestId: string,
): Promise<void> => {
    await updateDoc(doc(db, "user_friend_request", requestId), {
        status: "rejected",
    });
};

export const removeFriend = async (
    currentUserId: string,
    friendUserId: string,
): Promise<void> => {
    await deleteDoc(doc(db, "users", currentUserId, "friends", friendUserId));
    await deleteDoc(doc(db, "users", friendUserId, "friends", currentUserId));
};