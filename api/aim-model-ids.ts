/**
 * AIM chat — Google Gemini model IDs (single source of truth for API + Vite dev + scripts).
 *
 * Default: cheapest high-volume tier in the Gemini 3 line (stable).
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite
 */
export const AIM_MODEL_DEFAULT = "gemini-3.1-flash-lite";

/**
 * Special buddy (`isSpecial`): higher-quality flash tier (works on Gemini free tier).
 * Pro/preview models require billing and return quota errors on free keys.
 * @see https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash
 */
export const AIM_MODEL_SPECIAL = "gemini-2.5-flash";
