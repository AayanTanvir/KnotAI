"use client";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"login" | "signup">("login");

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const { error } =
            mode === "login"
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/chat");
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-background">
            <div className="flex flex-col gap-6 w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col gap-1 mb-2">
                    <h1 className="text-3xl font-nunito text-foreground">Knot AI</h1>
                    <p className="text-sm font-nunito text-foreground/40">
                        {mode === "login" ? "Welcome back." : "Create your account."}
                    </p>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-foreground-dim border border-foreground-dim
                                   rounded-xl px-4 py-3 text-foreground font-nunito
                                   placeholder:text-foreground/30 text-sm
                                   focus:outline-none focus:border-accent/50
                                   transition-colors"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                        className="w-full bg-foreground-dim border border-foreground-dim
                                   rounded-xl px-4 py-3 text-foreground font-nunito
                                   placeholder:text-foreground/30 text-sm
                                   focus:outline-none focus:border-accent/50
                                   transition-colors"
                    />
                </div>

                {/* Error */}
                {error && <p className="text-red-400 text-xs font-nunito">{error}</p>}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/30
                               text-accent font-nunito text-sm rounded-xl py-3
                               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
                </button>

                {/* Toggle */}
                <p className="text-center text-xs font-nunito text-foreground/30">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setMode(mode === "login" ? "signup" : "login")}
                        className="text-accent/70 hover:text-accent transition-colors"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
