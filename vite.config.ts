import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import autoImport from "unplugin-auto-import/vite";
import path from "path";
import type { IncomingMessage, ServerResponse } from "node:http";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Vite plugin that handles /api/aim-chat inside the dev server — no separate process needed.
function aimChatApiPlugin() {
  return {
    name: "aim-chat-api",
    configureServer(server: {
      middlewares: {
        use: (
          path: string,
          fn: (req: IncomingMessage, res: ServerResponse) => void
        ) => void;
      };
    }) {
      server.middlewares.use(
        "/api/aim-chat",
        (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }
          let body = "";
          req.on("data", (chunk: Buffer) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              const { buddyId, messages, systemPrompt, isSpecial } = JSON.parse(body);
              if (!buddyId || !Array.isArray(messages) || !systemPrompt) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid request body" }));
                return;
              }
              const history = messages
                .slice(-10)
                .map((m: { role: string; content: string }) => ({
                  role: m.role as "user" | "assistant",
                  content: m.content
                }));
              const { generateText } = await import("ai");
              const { google } = await import("@ai-sdk/google");
              const maxTokens = isSpecial ? 300 : 150;
              const result = await generateText({
                model: google("gemini-2.5-flash"),
                system: systemPrompt,
                messages: history,
                maxTokens
              });
              const text = result.text;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: text.trim() }));
            } catch (err) {
              console.error("[aim-chat-api]", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "LLM request failed" }));
            }
          });
        }
      );
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    unocss(),
    react(),
    autoImport({
      imports: ["react"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/hooks", "src/stores", "src/components/**"]
    }),
    aimChatApiPlugin()
  ],
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`
    }
  }
});
