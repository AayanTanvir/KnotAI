"use client";
import MessageInput from "@/components/MessageInput";
import { useChat } from "@/context/ChatContext";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";

export default function ChatPage() {
    const { selected } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);

    function handleSendMessage(message: string) {
        setMessages(prev => {
            return [...prev, {
                senderId: 1,
                senderName: "user",
                message: message,
            }]
        });
    }

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
                    <div className="w-full min-h-full flex flex-col items-start gap-4 py-6
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
                                    {m.message}
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
