"use client";
import { useChat } from "@/context/ChatContext";
import { CircleUserRound } from "lucide-react";

const ChatSidebar = () => {
    const { selected, setSelected } = useChat();

    const sampleKnots: Knot[] = [
        {
            id: 1,
            name: "Usman",
        },
        {
            id: 2,
            name: "Merry",
        },
        {
            id: 3,
            name: "Linda",
        },
    ]

    return (
        <div className="bg-background-secondary w-1/5 h-full border-r
                       border-foreground-dim flex flex-col justify-start items-start p-4"
        >
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Knots</h1>

            <div className="w-full flex-1 mt-5 flex flex-col justify-start items-start gap-2">
                {sampleKnots.map((knot) => (
                    <div
                    key={knot.id}
                    className={`w-full min-h-12 rounded-sm transition-colors hover:bg-accent-dim
                               flex justify-start items-center px-3 py-1 gap-4 cursor-pointer
                               ${selected?.id == knot.id ? "bg-accent-dim" : ""}`}
                    onClick={() => {setSelected(knot)}}
                    >
                        <CircleUserRound strokeWidth={1.5}/>
                        <h1 className="text-lg font-nunito">{knot.name}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatSidebar
