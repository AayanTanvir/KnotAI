import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const supabase = await createSupabaseServer();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isRead, readAt, content } = await request.json();

    try {
        const updatedMessage = await prisma.message.update({
            where: {
                id: id,
                knot: {
                    userId: user.id
                }
            },
            data: {
                ...(isRead !== undefined && { isRead }),
                ...(readAt !== undefined && { readAt: readAt ? new Date(readAt) : null }),
                ...(content !== undefined && { content })
            }
        });

        return Response.json({
            message: {
                ...updatedMessage,
                role: updatedMessage.role.toLowerCase() as "user" | "assistant"
            }
        });
    } catch (error) {
        console.error("Failed to patch message:", error);
        return Response.json({ error: "Message not found or update failed" }, { status: 404 });
    }
}
