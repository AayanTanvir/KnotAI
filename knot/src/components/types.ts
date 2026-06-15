interface Knot {
    id: number;
    name: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    isRead?: boolean;
    readAt?: number | null;
    timestamp: number;
}
