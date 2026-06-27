interface Knot {
    id: string;
    userId: number;
    name: string;
    personality: string;
    mood: number;
    createdAt: Date;
    messages: Message[];
}

interface Message {
    id: string;
    knotId: string;
    role: "user" | "assistant";
    content: string;
    isRead?: boolean;
    readAt?: Date | null;
    timestamp: Date;
}
