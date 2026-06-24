"use client";
import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from "react";

type ChatContextType = {
    currentKnot: Knot | null;
    setCurrentKnot: Dispatch<SetStateAction<Knot | null>>;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [currentKnot, setCurrentKnot] = useState<Knot | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const context = useMemo(
        () => ({
            currentKnot,
            setCurrentKnot,
            messages,
            setMessages
        }),
        [currentKnot, messages]
    );

    return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used inside ChatProvider");
    return ctx;
}
