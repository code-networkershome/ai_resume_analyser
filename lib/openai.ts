import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatCompletion(prompt: string) {
    try {
        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.1,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("Empty response from OpenAI");
        }

        return JSON.parse(content);
    } catch (error) {
        console.error("OpenAI Completion Error:", error);
        throw error;
    }
}
