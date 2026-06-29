"use client";
import MessageBubble from "@/components/MessageBubble";
import MessageInput from "@/components/MessageInput";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/context/ChatContext";
import sendMessage, {
    formatGroupTime,
    getLatestMsgs,
    getTypingDelay,
    showTimestamp,
    updateMessage
} from "@/util/chatUtils";
import { randomBetween, setLocalStorageItem, sleep } from "@/util/utils";
import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
    const { currentKnot, messages, setMessages, userMsgCount, setUserMsgCount } = useChat();
    const [isReplying, setIsReplying] = useState(false);

    // auto scroll on new message
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, isReplying]);

    const handleSendMessage = async (message: string) => {
        const { response, leftOnRead } = await sendMessage(
            message,
            messages,
            setMessages,
            currentKnot!.id
        );

        // read user message after random delay
        // TODO: need adjust with mood later
        await sleep(randomBetween(1000, 5000));
        readMsgs();

        await handleMoodEvaluation(5);

        if (leftOnRead && response == null) return;

        // Display message with typing indicator
        for (const msg of response!) {
            const sendDelay = getTypingDelay(msg.content);

            // -- SHOW TYPING INDICATOR FOR DURATION sendDelay --
            setIsReplying(true);
            await sleep(sendDelay);
            setIsReplying(false);
            // --

            setMessages(prev => [...prev, msg]);
        }
    };

    const readMsgs = () => {
        setMessages(prev =>
            prev.map(msg => {
                if (msg.role === "user" && !msg.isRead) {
                    const now = new Date();

                    updateMessage(msg.id, true, now);

                    return { ...msg, isRead: true, readAt: now };
                }
                return msg;
            })
        );
    };

    // Handle mood every n messages
    const handleMoodEvaluation = async (n: number) => {
        const nextCount = userMsgCount + 1;
        if (nextCount >= n) {
            //const newMood = await evaluateMood(currentKnot!, getLatestMsgs(messages, 5));

            const res = await fetch(`/api/knots/${currentKnot?.id}/evaluate-mood`, {
                method: "POST",
                body: JSON.stringify({
                    messages: getLatestMsgs(messages, n)
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await res.json();
            console.log("New mood: ", data.mood);

            setUserMsgCount(0);
            setLocalStorageItem("user_msg_count", 0);
        } else {
            setUserMsgCount(nextCount);
            setLocalStorageItem("user_msg_count", nextCount);
        }
    };

    if (currentKnot) {
        return (
            <div className="w-full h-full flex flex-col justify-start items-center">
                <div
                    className="w-full min-h-16 border-b border-foreground-dim
                                flex justify-start items-center px-4 gap-2"
                >
                    <CircleUserRound strokeWidth={1.5} size={40} absoluteStrokeWidth />
                    <h1 className="text-xl font-nunito">{currentKnot.name}</h1>
                </div>

                <div className="w-full flex-1 flex justify-center overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="w-full min-h-full flex flex-col items-start gap-2 py-6
                                    overflow-y-auto px-[20%]"
                    >
                        {messages.map((m, idx) => (
                            <div key={m.id} className="w-full flex flex-col">
                                {showTimestamp(messages, idx) && (
                                    <div className="w-full flex justify-center my-1">
                                        <span className="text-xs text-foreground-dim font-nunito">
                                            {formatGroupTime(m.timestamp!)}
                                        </span>
                                    </div>
                                )}
                                <MessageBubble messages={messages} msg={m} />
                            </div>
                        ))}

                        <TypingIndicator isTyping={isReplying} />
                    </div>
                </div>

                <div
                    className="w-full min-h-20 border-t border-foreground-dim
                                flex justify-center items-center py-5"
                >
                    <div className="w-[60%] h-full flex justify-center items-center">
                        <MessageInput onSend={handleSendMessage} />
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="font-nunito text-5xl text-semibold text-foreground-dim">
                    Select a <span className="text-accent/50">Knot</span> ...
                </h1>
            </div>
        );
    }
}
