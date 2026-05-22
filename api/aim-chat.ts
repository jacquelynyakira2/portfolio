import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// Inlined for Vercel Node ESM — extensionless ./aim-model-ids imports crash at cold start.
// Keep in sync with api/aim-model-ids.ts (used by Vite dev + scripts).
const AIM_MODEL_DEFAULT = "gemini-3.1-flash-lite";
const AIM_MODEL_SPECIAL = "gemini-2.5-flash";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { buddyId, messages, systemPrompt, isSpecial } = req.body ?? {};

  if (!buddyId || !Array.isArray(messages) || !systemPrompt) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return res.status(500).json({ error: "GOOGLE_GENERATIVE_AI_API_KEY not configured" });
  }

  const modelId = isSpecial ? AIM_MODEL_SPECIAL : AIM_MODEL_DEFAULT;
  const maxTokens = isSpecial ? 300 : 150;

  const history = messages.slice(-10).map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content
  }));

  try {
    const { text } = await generateText({
      model: google(modelId),
      system: systemPrompt,
      messages: history,
      maxTokens
    });

    return res
      .status(200)
      .json({ message: text.trim(), provider: "google", model: modelId });
  } catch (err) {
    console.error("[aim-chat]", err);
    return res.status(500).json({ error: "LLM request failed" });
  }
}
