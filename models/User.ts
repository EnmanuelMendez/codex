export interface UserProfile {
    username?: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    weight?: string;
    height?: string;
    unitSystem?: "Métrico" | "Imperial";
    gender?: "Hombre" | "Mujer";
    goal?: string;
    mood?: string;
    email?: string;
    profileImageUrl?: string;
}

export interface User {
    id: string;
    email: string;
    username?: string;
    onboardingCompleted?: boolean;
    profile?: UserProfile;
}