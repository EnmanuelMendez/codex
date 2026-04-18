import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const saveUserMood = async (
    uid: string,
    mood: string,
): Promise<void> => {
    await addDoc(collection(db, "user_moods"), {
        userId: uid,
        mood,
        createdAt: serverTimestamp(),
    });
};