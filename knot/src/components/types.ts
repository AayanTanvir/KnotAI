interface Knot {
    id: number;
    name: string;
    personality?: string;
    userId: number;
    mood: number;
    createdAt: Date;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    isRead?: boolean;
    readAt?: number | null;
    timestamp: number;
}
