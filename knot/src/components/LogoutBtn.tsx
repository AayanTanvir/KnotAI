"use client";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogoutBtn() {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-nunito text-foreground/40 hover:text-foreground transition-colors"
        >
            Sign out
        </button>
    );
}
