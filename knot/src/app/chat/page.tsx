"use client";
import { useChat } from "@/context/ChatContext";

export default function ChatPage() {
    const { selected } = useChat();

    return (
        <div className="w-full h-full flex justify-center items-center">
            {selected ? (
                <h1 className="font-nunito text-5xl text-semibold text-foreground-dim">
                    {selected.name}
                </h1>
            ) : (
                <h1 className="font-nunito text-5xl text-semibold text-foreground-dim">
                    Select a <span className="text-accent/50">Knot</span> ...
                </h1>
            )}
        </div>
    )
}
