export type FriendRequest = {
    id: string;
    email: string;
    name: string;
    status: 'sent' | 'received';
};