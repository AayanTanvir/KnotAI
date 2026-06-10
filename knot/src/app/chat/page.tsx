"use client";
import MessageInput from "@/components/MessageInput";
import TypingIndicator from "@/components/TypingIndicator";
import { useChat } from "@/context/ChatContext";
import sendMessage, { displayMessage, getTypingDelay, processResponse, sleep } from "@/util/chatUtils";
import { CircleUserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
    const { selected, messages, setMessages } = useChat();
    const [isReplying, setIsReplying] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isReplying]);

    const handleSendMessage = async (message: string) => {
        const rawResponse = await sendMessage(message, messages, setMessages);
        const { processedResponse } = processResponse(rawResponse);

        for (const msg of processedResponse) {
            const sendDelay = getTypingDelay(msg.content);
            console.log(sendDelay);

            setIsReplying(true);
            await sleep(sendDelay);
            setIsReplying(false);

            displayMessage(msg, setMessages)

            await sleep(300);
        }
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
                    <div ref={scrollContainerRef} className="w-full min-h-full flex flex-col items-start gap-4 py-6
                                    overflow-y-auto px-[20%]">
                        {messages.map((m, idx) => (
                            <div
                            className={
                                `min-w-6 max-w-[80%] rounded-lg
                                 p-2 px-2.5 border
                                 ${m.role == "user"
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
                        <TypingIndicator isTyping={isReplying}/>
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
