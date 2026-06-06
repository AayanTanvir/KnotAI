"use client";
import MessageInput from "@/components/MessageInput";
import { useChat } from "@/context/ChatContext";
import { CircleUserRound } from "lucide-react";

export default function ChatPage() {
    const { selected } = useChat();

    if (selected) {
        return (
             <div className="w-full h-full flex flex-col justify-start items-center">
                <div className="w-full min-h-16 border-b border-foreground-dim
                                flex justify-start items-center px-4 gap-2"

                >
                    <CircleUserRound strokeWidth={1.5} size={40} absoluteStrokeWidth/>
                    <h1 className="text-xl font-nunito">{selected.name}</h1>
                </div>

                <div className="w-full flex-1 ">

                </div>

                <div className="w-full min-h-20 border-t border-foreground-dim
                                flex justify-center items-center py-5"

                >
                    <div className="w-[60%] h-full flex justify-center items-center">
                        <MessageInput />
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
