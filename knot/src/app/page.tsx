import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabaseServer";
import Button from "@/components/Button";
import { ArrowUpRight } from "lucide-react";
import LogoutBtn from "@/components/LogoutBtn";

export default async function Home() {
    const supabase = await createSupabaseServer();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return (
        <div className="w-full h-full flex items-center justify-center bg-background">
            <div
                className="min-w-1/2 min-h-1/2 rounded-2xl border-foreground-dim border
                            flex justify-center items-center flex-col gap-4"
            >
                <p className="text-sm font-nunito text-foreground/40">{user.email}</p>
                <Button href="/chat" icon={<ArrowUpRight />}>
                    Go to Chat
                </Button>
                <LogoutBtn />
            </div>
        </div>
    );
}
