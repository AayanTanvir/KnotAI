import { Dispatch, SetStateAction } from "react";

export const sendMessage = async (
    message: string,
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>
) => {
    const newUserMessage: Message = {
        role: "user",
        content: message,
        isRead: false,
        timestamp: Date.now()
    };

    displayMessage(newUserMessage, setMessages);

    // ADD LLM CALL HERE TO GET READ TIMING ACCORDING TO MOOD
    await sleep(2500);

    setMessages(prev =>
        prev.map(m =>
            m.timestamp === newUserMessage.timestamp
                ? { ...m, isRead: true, readAt: Date.now() }
                : m
        )
    );

    try {
        const lastMessages: Message[] = messages.slice(-14);

        const chatHistory = [...lastMessages, newUserMessage].map(({ role, content }) => ({
            role,
            content
        }));

        const res = await fetch("/api/messages/", {
            method: "POST",
            body: JSON.stringify({ messages: chatHistory }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (res.ok) {
            return data.message;
        } else {
            console.error("error occurred: ", data.error);
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const processResponse = (rawResponse: string) => {
    const processedResponse: Message[] = rawResponse
        .split("<|>")
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(str => {
            return { role: "assistant", content: str, timestamp: Date.now() };
        });

    return { processedResponse };
};

export const getTypingDelay = (message: string) => {
    const charactersPerSecond = 18;
    const typingTime = (message.length / charactersPerSecond) * 1000;

    const humanReactionTime = 300;
    const baseDelay = typingTime + humanReactionTime;

    const fluctuation = 0.8 + Math.random() * 0.4;
    const finalDelay = baseDelay * fluctuation;

    return Math.min(Math.max(finalDelay, 400), 4500);
};

export const displayMessage = (
    { content, role, isRead = false, readAt = null, timestamp }: Message,
    setMessages: Dispatch<SetStateAction<Message[]>>
) => {
    setMessages(prev => {
        return [
            ...prev,
            {
                content: content,
                role: role,
                isRead: isRead,
                readAt: readAt,
                timestamp: timestamp
            }
        ];
    });
};

export const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const getLatestReadMessageIdx = (messages: Message[]) => {
    const latestUserMsg = messages.filter(m => m.role === "user").at(-1);

    if (messages.at(-1)?.role == "assistant" || (latestUserMsg && !latestUserMsg?.isRead)) {
        return undefined;
    }

    return messages
        .map((m, idx) => ({ m, idx }))
        .filter(({ m }) => m.role === "user" && m.isRead)
        .at(-1)?.idx;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default sendMessage;
