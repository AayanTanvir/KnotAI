import { Dispatch, SetStateAction } from "react";

export const sendMessage = async (
    message: string,
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>,
    knotId: string
) => {
    // temporary
    const newUserMessage = {
        id: crypto.randomUUID(),
        knotId,
        role: "user" as const,
        content: message,
        isRead: false,
        timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
        const lastMessages: Message[] = messages.slice(-14);

        const chatHistory = [...lastMessages, newUserMessage].map(({ role, content }) => ({
            role,
            content
        }));

        const res = await fetch("/api/messages/", {
            method: "POST",
            body: JSON.stringify({
                messages: chatHistory,
                knotId,
                content: message
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.ok) {
            // replace temporary msg with db msg
            setMessages(prev =>
                prev.filter(msg => msg.id !== newUserMessage.id).concat(data.userMessage)
            );

            if (data.knotMessage?.hasIgnored) {
                return { response: null, leftOnRead: true };
            }

            return { response: processResponse(data.knotMessage), leftOnRead: false };
        } else {
            console.error("error occurred: ", data.error);
            return { response: null, leftOnRead: false };
        }
    } catch (err) {
        console.error(err);
        return { response: null, leftOnRead: false };
    }
};

export const processResponse = (msg: Message) => {
    let response: Message[] | null = null;

    response = msg.content
        .split("<|>")
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0)
        .map((sentence, idx) => {
            return {
                ...msg,
                id: idx === 0 ? msg.id : `${msg.id}-split-${idx}`,
                content: sentence
            };
        });

    return response;
};

export const getTypingDelay = (message: string) => {
    const charactersPerSecond = 6;
    const typingTime = (message.length / charactersPerSecond) * 1000;

    const humanReactionTime = 300;
    const baseDelay = typingTime + humanReactionTime;

    const fluctuation = 0.8 + Math.random() * 0.4;
    const finalDelay = baseDelay * fluctuation;

    return Math.min(Math.max(finalDelay, 400), 4500);
};

export const formatTime = (dateInput: Date | string) => {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    return date
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
        .replace(/\s/g, "")
        .toUpperCase();
};

export const showTimestamp = (messages: Message[], idx: number): boolean => {
    if (idx === 0) return true;

    const current = messages[idx].timestamp;
    const previous = messages[idx - 1].timestamp;

    if (!current || !previous) return false;

    const diffMinutes = (new Date(current).getTime() - new Date(previous).getTime()) / 1000 / 60;

    return diffMinutes > 30;
};

export const formatGroupTime = (ts: Date): string => {
    const date = new Date(ts);
    const now = new Date();

    const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toDateString();
    const yesterdayStr = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    ).toDateString();
    const targetStr = date.toDateString();

    const timeString = date
        .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
        .toUpperCase();

    if (targetStr === todayStr) {
        return timeString;
    }

    if (targetStr === yesterdayStr) {
        return `Yesterday ${timeString}`;
    }

    return date
        .toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
        .toUpperCase();
};

export const fetchChatHistory = async (knotId: string): Promise<Message[]> => {
    try {
        const res = await fetch(`/api/messages?knotId=${knotId}`, {
            method: "GET"
        });

        const data = await res.json();

        if (res.ok) {
            // process assistant msgs and split
            let processedChat: Message[] = [];

            for (const msg of data.messages) {
                if (msg.role === "assistant") {
                    const response = processResponse(msg);
                    if (response) {
                        processedChat.push(...response);
                    } else {
                        processedChat.push(msg);
                    }
                } else {
                    processedChat.push(msg);
                }
            }

            return processedChat;
        } else {
            console.error("Failed to fetch chat history:", data.error);
            return [];
        }
    } catch (err) {
        console.error("Network error fetching chat history:", err);
        return [];
    }
};

export const updateMessage = async (
    msgId: string,
    isRead?: boolean,
    readAt?: Date | string,
    content?: string
): Promise<Message | undefined> => {
    if (isRead === undefined && readAt === undefined && content === undefined) return;

    try {
        const res = await fetch(`/api/messages/${msgId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isRead,
                readAt,
                content
            })
        });

        const data = await res.json();

        if (res.ok) {
            return data.message;
        } else {
            console.error("Failed to update message:", data.error);
        }
    } catch (err) {
        console.error("Network error updating message:", err);
    }
};

export const getLatestMsgs = (messages: Message[], depth: number): Message[] => {
    let userCount = 0;
    let targetIndex = 0;

    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
            userCount++;
            if (userCount === depth) {
                targetIndex = i;
                break;
            }
        }
    }

    if (userCount < depth) {
        return messages;
    }

    return messages.slice(targetIndex);
};

export default sendMessage;
