/**
 * Local API server for development — runs alongside Vite on port 3001.
 * Vite proxies /api/* here. Loads .env.local automatically.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { AIM_MODEL_DEFAULT, AIM_MODEL_SPECIAL } from "../api/aim-model-ids";

const PORT = 3001;
const app = express();
app.use(express.json());

app.post("/api/aim-chat", async (req, res) => {
  const { buddyId, messages, systemPrompt, isSpecial } = req.body ?? {};

  if (!buddyId || !Array.isArray(messages) || !systemPrompt) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const history = messages.slice(-10).map((m: { role: string; content: string }) => ({
    role: m.role as "user" | "assistant",
    content: m.content
  }));

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    res.status(500).json({ error: "GOOGLE_GENERATIVE_AI_API_KEY not set" });
    return;
  }

  const modelId = isSpecial ? AIM_MODEL_SPECIAL : AIM_MODEL_DEFAULT;
  const maxOutputTokens = isSpecial ? 300 : 150;

  try {
    const { text } = await generateText({
      model: google(modelId),
      system: systemPrompt,
      messages: history,
      maxOutputTokens
    });
    res.json({ message: text.trim(), provider: "google", model: modelId });
  } catch (err) {
    console.error("[dev-api] error:", err);
    res.status(500).json({ error: "LLM request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[dev-api] AIM chat API → http://localhost:${PORT}/api/aim-chat`);
});
