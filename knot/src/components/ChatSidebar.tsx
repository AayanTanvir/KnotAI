"use client";
import { useChat } from "@/context/ChatContext";
import { CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";
import Modal from "@/components/Modal";

const ChatSidebar = () => {
    const { selected, setSelected } = useChat();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [personality, setPersonality] = useState("");
    const [loading, setLoading] = useState(false);
    const [knots, setKnots] = useState<Knot[]>([]);

    useEffect(() => {
        fetch("/api/knots")
            .then(res => res.json())
            .then(data => setKnots(data.knots ?? []))
            .catch(err => console.error("Failed to fetch knots:", err));
    }, []);

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);

        const res = await fetch("/api/knots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, personality })
        });

        const data = await res.json();

        if (res.ok) {
            setKnots(prev => [data.knot, ...prev]);
            setIsModalOpen(false);
            setName("");
            setPersonality("");
        } else {
            console.error(data.error);
        }

        setLoading(false);
    };

    return (
        <div
            className="bg-background-secondary w-1/5 h-full border-r
                       border-foreground-dim flex flex-col justify-start items-start p-4"
        >
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Knot AI</h1>

            <div className="w-full flex-1 mt-5 flex flex-col justify-start items-start gap-2">
                {knots.map(knot => (
                    <div
                        key={knot.id}
                        className={`w-full min-h-12 rounded-sm transition-colors hover:bg-accent-dim
                                    flex justify-start items-center px-3 py-1 gap-4 cursor-pointer
                                    ${selected?.id == knot.id ? "bg-accent-dim" : ""}`}
                        onClick={() => setSelected(knot)}
                    >
                        <CircleUserRound strokeWidth={1.5} />
                        <h1 className="text-lg font-nunito">{knot.name}</h1>
                    </div>
                ))}

                <div
                    className="w-full min-h-12 transition-colors hover:bg-accent-dim border-foreground-dim
                               border flex justify-center items-center px-3 py-1 gap-4 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <h1 className="text-lg font-nunito">Create</h1>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create a Knot">
                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-foreground-dim border border-foreground-dim
                                   rounded-xl px-4 py-3 text-foreground font-nunito
                                   placeholder:text-foreground/30 text-sm
                                   focus:outline-none focus:border-accent/50
                                   transition-colors"
                    />
                    <textarea
                        placeholder="Describe their personality..."
                        value={personality}
                        onChange={e => setPersonality(e.target.value)}
                        rows={4}
                        className="w-full bg-foreground-dim border border-foreground-dim
                                   rounded-xl px-4 py-3 text-foreground font-nunito
                                   placeholder:text-foreground/30 text-sm
                                   focus:outline-none focus:border-accent/50
                                   transition-colors resize-none"
                    />
                </div>

                <button
                    onClick={handleCreate}
                    disabled={loading || !name.trim()}
                    className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/30
                               text-accent font-nunito text-sm rounded-xl py-3 mt-2
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating..." : "Create Knot"}
                </button>
            </Modal>
        </div>
    );
};

export default ChatSidebar;
