import Button from "@/components/Button";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-background">
            <div className="min-w-1/2 min-h-1/2 rounded-2xl border-foreground-dim border
                            flex justify-center items-center flex-col"
            >
                <Button href="/chat" icon={<ArrowUpRight />}>Start Chatting</Button>
            </div>
        </div>
    );
}
