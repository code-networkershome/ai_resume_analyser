// OpenRouter API client for LLM inference
// Using google/gemma-2-9b-it model

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_ID = process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it";

if (!OPENROUTER_API_KEY) {
    console.warn("Warning: OPENROUTER_API_KEY not set - AI analysis will fail");
}

const isDev = process.env.NODE_ENV === "development";

export async function getChatCompletion(prompt: string) {
    if (isDev) {
        console.log("[OpenRouter] Starting API call...");
        console.log("[OpenRouter] Model:", MODEL_ID);
    }

    if (!OPENROUTER_API_KEY) {
        console.error("[OpenRouter] ERROR: Missing OPENROUTER_API_KEY");
        throw new Error("Missing OPENROUTER_API_KEY environment variable");
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                "X-Title": "AI Resume Analyzer"
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that always responds with valid JSON. Never include markdown code blocks or any text outside the JSON object."
                    },
                    { role: "user", content: prompt }
                ],
                max_tokens: 5500, // ~5.5K output tokens after 2.5K input prompt
                temperature: 0, // CRITICAL: Set to 0 for deterministic, consistent scores
                seed: 12345, // Add seed for extra reproducibility
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", response.status, errorText);
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        if (isDev) console.log("[OpenRouter] Response received");

        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error("[OpenRouter] Empty content in response:", JSON.stringify(data));
            throw new Error("Empty response from OpenRouter");
        }

        if (isDev) {
            console.log("[OpenRouter] Raw content length:", content.length);
        }

        // Clean the response - remove markdown code blocks if present
        let cleanedContent = content.trim();

        // Remove various markdown code block formats
        cleanedContent = cleanedContent.replace(/^```json\s*/i, '');
        cleanedContent = cleanedContent.replace(/^```\s*/i, '');
        cleanedContent = cleanedContent.replace(/\s*```$/i, '');
        cleanedContent = cleanedContent.trim();

        // Try to extract JSON object if there's extra text
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedContent = jsonMatch[0];
        }

        try {
            return JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error("[OpenRouter] JSON Parse Error. First 500 chars of content:", cleanedContent.substring(0, 500));
            console.error("[OpenRouter] Last 200 chars:", cleanedContent.substring(cleanedContent.length - 200));
            throw new Error(`Failed to parse JSON response: ${parseError}`);
        }
    } catch (error) {
        console.error("OpenRouter Completion Error:", error);
        throw error;
    }
}
