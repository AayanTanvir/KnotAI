import { prisma } from "@/lib/prisma";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const supabase = await createSupabaseServer();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, personality } = await req.json();

    if (!name?.trim()) {
        return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const knot = await prisma.knot.create({
        data: {
            userId: user.id,
            name,
            personality: personality || ""
        }
    });

    return Response.json({ knot });
}

export async function GET() {
    const supabase = await createSupabaseServer();
    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const knots = await prisma.knot.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" }
    });

    return Response.json({ knots });
}
