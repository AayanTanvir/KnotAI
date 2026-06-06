import ChatSidebar from "@/components/ChatSidebar";
import { ChatProvider } from "@/context/ChatContext";

export default function ChatLayout({ children } : Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ChatProvider>
            <div className="h-full flex">
                <ChatSidebar />
                {children}
            </div>
        </ChatProvider>
    )
}
