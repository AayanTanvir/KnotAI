"use client"
import { motion, AnimatePresence } from "framer-motion"

type TypingIndicatorProps = {
    isTyping: boolean
}

const TypingIndicator = ({ isTyping }: TypingIndicatorProps) => {
    return (
        <AnimatePresence>
            {isTyping && (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-6 px-2.5 py-4 rounded-full bg-foreground-dim flex justify-center items-center gap-1"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-foreground"
                            animate={{ y: [0, -2.5, 0] }}
                            transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default TypingIndicator
