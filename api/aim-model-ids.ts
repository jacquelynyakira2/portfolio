/**
 * AIM chat — Google Gemini model IDs (single source of truth for API + Vite dev + scripts).
 *
 * Default: cheapest high-volume tier in the Gemini 3 line (stable).
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite
 */
export const AIM_MODEL_DEFAULT = "gemini-3.1-flash-lite";

/**
 * Special buddy (`isSpecial`): strongest available Gemini 3.1 reasoning tier (preview).
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview
 */
export const AIM_MODEL_SPECIAL = "gemini-3.1-pro-preview";
