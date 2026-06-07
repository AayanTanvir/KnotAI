import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: "You are a warm, empathetic AI companion. Avoid robotic phrases, use a relaxed tone, and focus on genuine emotional connection.",
            }
        });

        return NextResponse.json({ message: response.text });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        else {
            return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
        }
    }
}
