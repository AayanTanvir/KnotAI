import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { createSupabaseServer } from "@/lib/supabaseServer";

type RouteParams = {
    params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;

        const supabase = await createSupabaseServer();
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages } = await request.json();
        if (!messages || !Array.isArray(messages)) {
            return Response.json({ error: "Invalid or missing messages array" }, { status: 400 });
        }

        const knot = await prisma.knot.findUnique({
            where: { id, userId: user.id },
            select: { mood: true }
        });

        if (!knot) {
            return Response.json({ error: "Knot not found" }, { status: 404 });
        }

        const chatHistory = messages
            .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join("\n");

        const res = await generateText({
            model: groq("llama-3.1-8b-instant"),
            system: `You are an emotional evaluation subsystem. Analyze the recent dialogue context between the USER and the ASSISTANT.
                     Based on the user's recent tone, sentiment, and treatment of the companion, adjust the companion's current emotional mood value.

                     Current Mood Value: ${knot.mood}

                     Scale Matrix:
                     1 = Distant/Hostile (User is rude, boring, or neglectful)
                     2 = Irritated/Cold (User is annoying or overly demanding)
                     3 = Neutral/Passive (Standard casual interaction)
                     4 = Happy/Warm (User is friendly, kind, or interesting)
                     5 = Affectionate/Clinging (User is extremely sweet, loving, or comforting)

                     CRITICAL: You must output ONLY a raw single integer from 1 to 5 representing the new mood value. Do not write any explanations, markdown, or extra characters.`,
            prompt: `Recent Chat History:\n${chatHistory}\n\nEvaluate and return the single digit mood value now:`
        });

        const extractedDigit = res.text.trim();
        const newMood = parseInt(extractedDigit, 10);

        let finalMood = newMood;
        if (isNaN(newMood) || newMood < 1 || newMood > 5) {
            console.warn(`LLM returned invalid mood "${res.text}". Keeping current mood.`);
            finalMood = knot.mood;
        }
        const updatedKnot = await prisma.knot.update({
            where: { id },
            data: { mood: finalMood },
            select: { mood: true }
        });

        return Response.json({ mood: updatedKnot.mood });
    } catch (error) {
        console.error("Mood evaluation API route failed:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
