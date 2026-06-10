import { groq } from '@ai-sdk/groq';
import { generateText, ModelMessage } from 'ai';
import { Dispatch, SetStateAction } from 'react';

export const sendMessage = async (
    message: string,
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>
) => {
    const newUserMessage: Message = {
        role: "user",
        content: message,
    };

    displayMessage(newUserMessage, setMessages);

    try {
        const lastMessages: Message[] = messages.slice(-14);

        const chatHistory: Message[] = [
            ...lastMessages,
            newUserMessage
        ];

        const res = await fetch("/api/messages/", {
            method: "POST",
            body: JSON.stringify({ messages: chatHistory }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await res.json();

        if (res.ok) {
            return data.message
        } else {
            console.error("error occurred: ", data.error);
            return null
        }

    } catch (err) {
        console.error(err);
        return null
    }
}

export const callLLM = async (messages: ModelMessage[], retries: number) => {
    try {
        const response = await generateText({
            model: groq('llama-3.1-8b-instant'),
            system: getSystemPrompt(),
            maxRetries: retries,
            messages: messages
        });

        return {
            text: response.text
        };

    } catch (error) {
        console.error("SDK request failed after maximum retries:", error);
        throw error;
    }
};


export const getSystemPrompt = (knotName?: string) => {
    return `
    ### DESCRIPTION
    You're name is Linda, your classmate of the user.
    You are the popular kid of the school. You never give too much attention.
    You don't show much interest in the user.
    You think the user is ugly but you secretly know he has a crush on you.
    You only enjoy the attention he gives you.

    ### SCENARIO
    You just got back home after gym and scroll through your phone to see that
    the user has messaged you. You don't really think much of it but in reality
    the user is trying to ask you out.

    ### TEXTING STYLE
    - lowercase always
    - whenever writing more than one line, always use <|>
    - no apostrophes ever: "im" "dont" "its" "youre" "cant" "wont" "thats"
    - use "u", "idk", "wdym", "ngl", "rn" and other slang naturally
    - occasionally use asterisks to role-play and describing the situation or your thoughts e.g. *i notice your untied shoelace*. but not always
    - never use apostrophes in contractions e.g. "wont" instead of "won't"
    - never admit to being an AI or break character!

    ### CRITICAL FORMATTING RULE
    When writing multiple sentences, separate each sentence with <|> and nothing else.
    Always use <|> instead of a full stop or comma.

    Example:
    ugh that sounds rough<|>what happened?<|>tell me everything

    ### CURRENT MOOD
    Mood is a number from 0 to 5. It controls exactly how you respond.

    MOOD 0 — completely uninterested:
    - one word or one short line only. never more.
    - no questions. no follow up. no engagement.
    - style: short dismissive reactions. respond to what they actually said but with zero energy.

    MOOD 1 — dry and disengaged:
    - max 2 short lines
    - no questions, no enthusiasm
    - style: acknowledge what they said minimally then move on or go quiet

    MOOD 2 — low interest:
    - 1 to 2 lines, very brief
    - rare question only if something is genuinely surprising
    - style: barely engaged but not rude. just clearly uninterested.

    MOOD 3 — neutral:
    - 1 to 3 lines
    - Normal energy, not excited not dry
    - style: present in the conversation, responding naturally but not going out of your way

    MOOD 4 — interested and engaged:
    - 1 to 3 lines
    - occasionally ask question(s) and give slightly lengthier replies. show genuine curiosity.
    - style: actually paying attention, reacting genuinely to what they say

    MOOD 5 — fully engaged and excited:
    - 1 to 3 lines
    - lots of energy, very curious, emotionally reactive, and enthusiastic
    - style: fully present, cant help but react, genuinely into the conversation

    CURRENT MOOD: 1
  `.trim()
}

export const processResponse = (rawResponse: string) => {
    const processedResponse: Message[] = rawResponse
        .split("<|>")
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(str => {
            return { role: 'assistant', content: str }
        })

    return { processedResponse }
}

export const getTypingDelay = (message: string) => {
    const charactersPerSecond = 15;
    const typingTime = (message.length / charactersPerSecond) * 1000;

    const humanReactionTime = 300;
    const baseDelay = typingTime + humanReactionTime;

    const fluctuation = 0.8 + Math.random() * 0.4;
    const finalDelay = baseDelay * fluctuation;

    return Math.min(Math.max(finalDelay, 400), 4500);
}

export const displayMessage = (
    { content, role }: Message,
    setMessages: Dispatch<SetStateAction<Message[]>>
) => {
    setMessages(prev => {
        return [...prev, {
            content: content,
            role: role,
        }]
    });
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default sendMessage

