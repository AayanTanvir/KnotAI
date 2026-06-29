"use client";
import { fetchChatHistory } from "@/util/chatUtils";
import { getLocalStorageItem, setLocalStorageItem } from "@/util/utils";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

type ChatContextType = {
    currentKnot: Knot | null;
    setCurrentKnot: Dispatch<SetStateAction<Knot | null>>;
    messages: Message[];
    setMessages: Dispatch<SetStateAction<Message[]>>;
    userMsgCount: number;
    setUserMsgCount: Dispatch<SetStateAction<number>>;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [currentKnot, setCurrentKnot] = useState<Knot | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userMsgCount, setUserMsgCount] = useState<number>(0);

    useEffect(() => {
        const syncHistory = async () => {
            if (!currentKnot?.id) return;
            const chatHistory = await fetchChatHistory(currentKnot.id);
            setMessages(chatHistory);
        };

        syncHistory();
    }, [currentKnot?.id]);

    useEffect(() => {
        const localCount = getLocalStorageItem("user_msg_count");

        if (localCount == null) {
            setLocalStorageItem("user_msg_count", 0);
            setUserMsgCount(0);
        } else {
            setUserMsgCount(Number(localCount));
        }
    }, []);

    const context = useMemo(
        () => ({
            currentKnot,
            setCurrentKnot,
            messages,
            setMessages,
            userMsgCount,
            setUserMsgCount
        }),
        [currentKnot, messages, userMsgCount]
    );

    return <ChatContext.Provider value={context}>{children}</ChatContext.Provider>;
}

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used inside ChatProvider");
    return ctx;
}
