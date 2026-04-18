import { Routine } from "@/models/workout";

export type MoodId =
    | "energizado"
    | "motivado"
    | "tranquilo"
    | "cansado"
    | "estresado"
    | "feliz";

export const adjustRoutineByMood = (
    routine: Routine,
    moodId?: MoodId | null,
): Routine => {
    if (!moodId) return routine;

    let setsDelta = 0;

    switch (moodId) {
        case "energizado":
            setsDelta = 2;
            break;
        case "motivado":
            setsDelta = 1;
            break;
        case "feliz":
            setsDelta = 1;
            break;
        case "tranquilo":
            setsDelta = 0;
            break;
        case "cansado":
            setsDelta = -1;
            break;
        case "estresado":
            setsDelta = -1;
            break;
        default:
            setsDelta = 0;
            break;
    }

    return {
        ...routine,
        ejercicios: routine.ejercicios.map((exercise) => ({
            ...exercise,
            series: Math.max(1, (exercise.series || 1) + setsDelta),
        })),
    };
};