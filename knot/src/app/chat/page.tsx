"use client";
import MessageInput from "@/components/MessageInput";
import { useChat } from "@/context/ChatContext";
import { splitIntoMessages } from "@/util/LLMUtils";
import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
    const { selected } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);

    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const displayMessage = ({ senderId, senderName, content }: Message) => {
        setMessages(prev => {
            return [...prev, {
                senderId: senderId,
                senderName: senderName,
                content: content,
                role: senderId == 1 ? "user" : "assistant"
            }]
        });
    }

    const handleSendMessage = async (message: string) => {
        const newUserMessage: Message = {
            senderId: 1,
            senderName: "user",
            content: message,
            role: "user",
        };

        displayMessage(newUserMessage);

        try {
            const chatHistory = messages.map(m => ({
                role: m.role,
                content: m.content
            })).slice(-14);

            const currentChatHistory = [
                ...chatHistory,
                { role: newUserMessage.role, content: newUserMessage.content }
            ];

            console.log(currentChatHistory);

            const res = await fetch("/api/messages/", {
                method: "POST",
                body: JSON.stringify({ messages: currentChatHistory }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await res.json();
            if (res.ok) {
                console.log(data.message);
                const resMessages = splitIntoMessages(data.message);

                for (const message of resMessages) {
                    displayMessage({
                        senderId: 2,
                        senderName: "usman",
                        content: message,
                        role: "assistant",
                    });
                }
            } else {
                console.error("error occurred: ", data.error);
            }

        } catch (err) {
            console.error(err);
        }
    };

    if (selected) {
        return (
             <div className="w-full h-full flex flex-col justify-start items-center">
                <div className="w-full min-h-16 border-b border-foreground-dim
                                flex justify-start items-center px-4 gap-2"

                >
                    <CircleUserRound strokeWidth={1.5} size={40} absoluteStrokeWidth/>
                    <h1 className="text-xl font-nunito">{selected.name}</h1>
                </div>

                <div className="w-full flex-1 flex justify-center overflow-hidden">
                    <div ref={scrollContainerRef} className="w-full min-h-full flex flex-col items-start gap-4 py-6
                                    overflow-y-auto px-[20%]">
                        {messages.map((m, idx) => (
                            <div
                            className={
                                `min-w-6 max-w-[80%] rounded-lg
                                 p-2 px-2.5 border
                                 ${m.senderId == 1 && m.senderName == "user"
                                     ? "ml-auto bg-accent border-foreground-dim"
                                     : "mr-auto bg-foreground-dim border-foreground-dim"
                                 }`
                            }
                            key={idx}
                            >
                                <p className="text-lg font-nunito text-foreground
                                              leading-relaxed whitespace-pre-wrap
                                              wrap-break-word">
                                    {m.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full min-h-20 border-t border-foreground-dim
                                flex justify-center items-center py-5"

                >
                    <div className="w-[60%] h-full flex justify-center items-center">
                        <MessageInput onSend={handleSendMessage}/>
                    </div>
                </div>
             </div>
        )
    }
    else {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <h1 className="font-nunito text-5xl text-semibold text-foreground-dim">
                    Select a <span className="text-accent/50">Knot</span> ...
                </h1>
            </div>
        )
    }
}
