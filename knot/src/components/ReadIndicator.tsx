"use client";
import { motion, AnimatePresence } from "framer-motion";
import { formatTime, getLatestReadMessageIdx } from "@/util/chatUtils";

type ReadIndicatorProps = {
    message: Message;
};

const ReadIndicator = ({ message }: ReadIndicatorProps) => {
    return (
        <AnimatePresence>
            <motion.div
                className="w-full flex justify-end mr-1 mt-0.5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <span className="text-xs font-nunito text-foreground-dim text-nowrap">
                    Read <span className="text-[10px]">{formatTime(message.readAt as Date)}</span>
                </span>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReadIndicator;
