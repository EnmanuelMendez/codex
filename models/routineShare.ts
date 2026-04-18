export type RoutineShare = {
    id: string;
    routineId: string;
    routineName?: string;
    ownerUserId: string;
    ownerName?: string;
    targetUserId: string;
    status: "pending" | "accepted" | "rejected";
    type: "routine_share";
};