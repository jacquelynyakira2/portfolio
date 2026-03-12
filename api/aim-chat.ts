import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createAnthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { buddyId, messages, systemPrompt, isSpecial } = req.body ?? {};

  if (!buddyId || !Array.isArray(messages) || !systemPrompt) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Special buddy (jacquelynyakira) uses Claude Sonnet; regular buddies use Gemini (cheaper)
  if (isSpecial) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
    }
    const anthropic = createAnthropic({ apiKey });
    const history = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content
    }));
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: systemPrompt,
      messages: history,
      maxTokens: 300
    });
    return res.status(200).json({ message: text.trim() });
  }

  // Regular buddies: Gemini 2.5 Flash (~87% cheaper than Claude Haiku)
  const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!googleKey) {
    return res.status(500).json({ error: "GOOGLE_GENERATIVE_AI_API_KEY not configured" });
  }
  const history = messages.slice(-10).map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content
  }));
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    system: systemPrompt,
    messages: history,
    maxTokens: 150
  });
  return res.status(200).json({ message: text.trim() });
}
