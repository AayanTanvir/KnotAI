"use client";

import { CircleUserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ProfilePictureProps = {
    size?: number;
    mood: number;
};

const moodColors: Record<number, string> = {
    1: "from-[#4a0000] via-[#dc2626] to-[#7f1d1d]",
    2: "from-[#f97316] via-[#f43f5e] to-[#fb923c]",
    3: "from-[#7BADA8] via-[#4ade80] to-[#86efac]",
    4: "from-[#34d399] via-[#7BADA8] to-[#60a5fa]",
    5: "from-[#1d4ed8] via-[#38bdf8] to-[#3b82f6]"
};

const ProfilePicture = ({ size = 25, mood }: ProfilePictureProps) => {
    const currentMood = mood >= 1 && mood <= 5 ? mood : 3;
    const gradient = moodColors[currentMood];

    const gap = Math.max(2, Math.round(size * 0.08));
    const innerSize = size + gap * 2;
    const outerSize = innerSize + gap * 2;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{ width: outerSize, height: outerSize }}
        >
            <AnimatePresence>
                <motion.div
                    key={currentMood}
                    className={`absolute inset-0 rounded-full bg-linear-to-tr ${gradient}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        opacity: { duration: 0.8, ease: "easeInOut" },
                        rotate: { repeat: Infinity, duration: 4, ease: "linear" }
                    }}
                />
            </AnimatePresence>

            <div
                className="absolute rounded-full bg-background-secondary z-10
                           flex items-center justify-center"
                style={{ width: innerSize, height: innerSize }}
            >
                <CircleUserRound
                    size={size}
                    strokeWidth={1.5}
                    absoluteStrokeWidth
                    className="text-foreground"
                />
            </div>
        </div>
    );
};

export default ProfilePicture;
