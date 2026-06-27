"use client";
import { motion } from "framer-motion";
import ReadIndicator from "./ReadIndicator";

type MessageBubbleProps = {
    msg: Message;
    idx: number;
    messages: Message[];
};

const MessageBubble = ({ msg, idx, messages }: MessageBubbleProps) => {
    const isUser = msg.role === "user";
    const isLatest = messages.at(-1)?.id === msg.id;

    return (
        <motion.div
            className={`min-w-6 max-w-[80%] flex flex-col items-end
                ${isUser ? "ml-auto" : "mr-auto"}
            `}
            initial={{ opacity: 0.6, x: isUser ? 10 : -10, y: 4 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8
            }}
        >
            <div
                className={`w-fit rounded-2xl p-2 px-2.5 border
                    ${
                        isUser
                            ? "bg-accent border-foreground-dim rounded-br-xs"
                            : "bg-foreground-dim border-foreground-dim rounded-bl-xs"
                    }`}
            >
                <p className="text-lg font-nunito text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {msg.content}
                </p>
            </div>
            {isUser && isLatest && msg.isRead && msg.readAt && <ReadIndicator message={msg} />}
        </motion.div>
    );
};

export default MessageBubble;
