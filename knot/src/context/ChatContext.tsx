"use client"
import { createContext, useContext, useState } from "react";

type ChatContextType = {
  selected: Knot | null
  setSelected: (contact: Knot | null) => void
}

const ChatContext = createContext<ChatContextType | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Knot | null>(null)

  return (
    <ChatContext.Provider value={{ selected, setSelected }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used inside ChatProvider")
  return ctx
}
