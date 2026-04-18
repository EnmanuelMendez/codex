import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { getUserByUsername } from "./userService";

export const login = async (usernameOrEmail: string, password: string) => {
    const value = usernameOrEmail.trim();

    try {
        let emailToUse = value;
        const isEmail = value.includes("@");

        if (!isEmail) {
            console.log("🔍 Buscando usuario por username:", value);

            const userData = await getUserByUsername(value);

            console.log("✅ Resultado de búsqueda:", userData);

            if (!userData || !userData.email) {
                throw new Error("Usuario no encontrado.");
            }

            emailToUse = userData.email;
        }

        console.log("🔐 Intentando login con email:", emailToUse);

        return signInWithEmailAndPassword(auth, emailToUse, password);
    } catch (error) {
        console.log("🔥 ERROR EN LOGIN:", error);
        throw error;
    }
};

export const register = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};