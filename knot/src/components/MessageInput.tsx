"use client"

import { useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

type MessageInputProps = {
    onSend?: (message: string) => void
    width?: string
}

export default function MessageInput({ onSend, width }: MessageInputProps) {
    const [value, setValue] = useState("")
    const [focused, setFocused] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const isEmpty = value.trim().length === 0
    const maxHeight = 120

    const handleInput = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = "auto"
        el.style.height = Math.min(el.scrollHeight, maxHeight) + "px"
    }

    const handleSend = () => {
        const text = value.trim()
        if (!text) return
        onSend?.(text)
        setValue("")
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div
            className={`
                flex items-end gap-3 rounded-xl px-4 py-3
                bg-background-secondary w-full
                border transition-all duration-100 ease-out
                ${focused
                    ? "border-accent/50"
                    : "border-foreground-dim"
                }
            `}
        >
            <textarea
                ref={textareaRef}
                value={value}
                rows={1}
                placeholder="Type a message..."
                onChange={(e) => setValue(e.target.value)}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="
                    flex-1 bg-transparent outline-none resize-none
                    text-foreground text-sm lg:text-base leading-relaxed
                    placeholder:text-foreground/25
                    font-nunito overflow-y-auto
                    py-0.5
                    scrollbar-thin scrollbar-thumb-foreground-dim
                "
                style={{ maxHeight: maxHeight + "px" }}
            />

            <button
                onClick={handleSend}
                disabled={isEmpty}
                className={`
                    shrink-0 w-8 h-8 rounded-lg
                    flex items-center justify-center
                    transition-all duration-200
                    text-background
                    ${isEmpty
                        ? "bg-foreground-dim cursor-not-allowed"
                        : "bg-accent cursor-pointer hover:opacity-80 active:scale-95"
                    }
                `}
            >
                <ArrowUp size={20} strokeWidth={2.5} />
            </button>
        </div>
    )
}
