export type FriendRequest = {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromUsername: string;
    fromEmail: string;
    fromName: string;
    status: "pending" | "accepted" | "rejected";
    type: "friend_request";
};