import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateReply(
    pastMessages: string[],
    userMessage: string
): Promise<string> {

    const messages = [
        ...pastMessages.map((text) => ({
            role: "user" as const,
            content: text
        })),
        {
            role: "user" as const,
            content: userMessage
        }
    ];

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages
    });

    return response.choices[0].message.content ?? "";
}
