import { HfInference } from "@huggingface/inference";

if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Missing HUGGINGFACE_API_KEY environment variable");
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const MODEL_ID = process.env.HUGGINGFACE_MODEL || "Qwen/Qwen2.5-7B-Instruct";

export async function getChatCompletion(prompt: string) {
    try {
        const response = await hf.chatCompletion({
            model: MODEL_ID,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that always responds with valid JSON. Never include markdown code blocks or any text outside the JSON object.",
                },
                { role: "user", content: prompt },
            ],
            max_tokens: 4096,
            temperature: 0.1,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("Empty response from Hugging Face");
        }

        // Clean the response - remove markdown code blocks if present
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith("```json")) {
            cleanedContent = cleanedContent.slice(7);
        } else if (cleanedContent.startsWith("```")) {
            cleanedContent = cleanedContent.slice(3);
        }
        if (cleanedContent.endsWith("```")) {
            cleanedContent = cleanedContent.slice(0, -3);
        }
        cleanedContent = cleanedContent.trim();

        return JSON.parse(cleanedContent);
    } catch (error) {
        console.error("Hugging Face Completion Error:", error);
        throw error;
    }
}
