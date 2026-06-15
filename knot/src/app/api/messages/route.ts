import { callLLM } from "@/util/LLMUtils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();
        const res = await callLLM(messages, 3);

        return NextResponse.json({ message: res.text });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
        }
    }
}
