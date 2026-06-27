import { callLLM } from "@/util/llmUtils";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
    try {
        const { messages, knotId, content } = await request.json();

        if (!knotId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const dbUserMessage = await prisma.message.create({
            data: {
                knotId,
                role: "USER",
                content: content,
                isRead: false
            }
        });

        const res = await callLLM(messages, 3);

        console.log("response: ", res.text);
        // If message is ignored, don't save or send back.
        if (res.text.includes("<!>")) {
            return NextResponse.json({
                userMessage: {
                    ...dbUserMessage,
                    role: dbUserMessage.role.toLowerCase() as "user"
                },
                knotMessage: {
                    hasIgnored: true
                }
            });
        }

        const dbKnotMessage = await prisma.message.create({
            data: {
                knotId,
                role: "ASSISTANT",
                content: res.text,
                isRead: false
            }
        });

        return NextResponse.json({
            userMessage: {
                ...dbUserMessage,
                role: dbUserMessage.role.toLowerCase() as "user"
            },
            knotMessage: {
                ...dbKnotMessage,
                role: dbKnotMessage.role.toLowerCase() as "assistant"
            }
        });
    } catch (error: unknown) {
        console.error("Database or LLM Error:", error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createSupabaseServer();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const { searchParams } = new URL(request.url);
    const knotId = searchParams.get("knotId");

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    } else if (!knotId) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const knotWithMessages = await prisma.knot.findFirst({
        where: {
            id: knotId,
            userId: user.id
        },
        include: {
            messages: {
                orderBy: {
                    timestamp: "asc"
                }
            }
        }
    });

    if (!knotWithMessages) {
        return Response.json({ error: "Knot not found" }, { status: 404 });
    }

    const messages = knotWithMessages.messages.map(msg => ({
        ...msg,
        role: msg.role.toLowerCase() as "user" | "assistant"
    }));

    return Response.json({ messages });
}
