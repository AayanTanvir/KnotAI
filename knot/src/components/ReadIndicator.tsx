"use client";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime, getLatestReadMessageIdx } from "@/util/chatUtils";

type ReadIndicatorProps = {
    messages: Message[];
    msgIdx: number;
};

const ReadIndicator = ({ messages, msgIdx }: ReadIndicatorProps) => {
    const hasReplied = messages.at(-1)?.role == "assistant";
    if (hasReplied) return;

    const readMsgIdx = getLatestReadMessageIdx(messages);
    const message = messages[msgIdx];

    const canShow = message.role === "user" && message.isRead && readMsgIdx === msgIdx;

    return (
        <AnimatePresence>
            {canShow && message.readAt && (
                <motion.div
                    className="w-full flex justify-end mr-1 mt-0.5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    <span className="text-xs font-nunito text-foreground-dim text-nowrap">
                        Read {formatTime(message.readAt)}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReadIndicator;
