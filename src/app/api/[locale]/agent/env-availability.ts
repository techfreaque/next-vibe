/**
 * Agent Environment Availability
 *
 * Exposes which AI provider keys are configured as boolean flags.
 * Reads from NEXT_PUBLIC_AGENT_* client env vars - set automatically by the
 * vibe runtime (environment.ts) from the server-side API keys before build.
 * Safe to import in both server and client code (no server-only dependency).
 */

import { envClient } from "@/config/env-client";

export interface AgentEnvAvailability {
  /** Main LLM routing - most models require this */
  openRouter: boolean;
  /** Claude Code provider - auto-detected from `claude` CLI or set via CLAUDE_CODE_ENABLED */
  claudeCode: boolean;
  /** Voice / Text-to-Speech via Eden AI */
  voice: boolean;
  /** Brave web search */
  braveSearch: boolean;
  /** Kagi FastGPT search */
  kagiSearch: boolean;
  /** At least one search provider is available */
  anySearch: boolean;
  /** Uncensored AI provider */
  uncensoredAI: boolean;
  /** FreedomGPT provider */
  freedomGPT: boolean;
  /** Gab AI provider */
  gabAI: boolean;
  /** Venice AI provider */
  veniceAI: boolean;
  /** Scrappey (web scraping) */
  scrappey: boolean;
  /** OpenAI Images API (DALL-E, gpt-image-1) */
  openAiImages: boolean;
  /** OpenAI STT (Whisper direct API) */
  openAiStt: boolean;
  /** Replicate (Flux Pro, SDXL, video models) */
  replicate: boolean;
  /** Fal.ai (fast image and video inference) */
  falAi: boolean;
  /** ModelsLab (music generation, text-to-video) */
  modelsLab: boolean;
  /** Unbottled AI provider (remote cloud instance) */
  unbottled: boolean;
  /** Eden AI STT */
  edenAiStt: boolean;
  /** Deepgram STT */
  deepgram: boolean;
  /** OpenAI TTS - requires OPENAI_API_KEY */
  openAiTts: boolean;
  /** Eden AI TTS - requires EDEN_AI_API_KEY */
  edenAiTts: boolean;
  /** ElevenLabs TTS - requires ELEVENLABS_API_KEY */
  elevenlabs: boolean;
}

/**
 * Singleton for env availability - reads from NEXT_PUBLIC_AGENT_* client vars.
 * Evaluated once at module load time. Safe to import anywhere.
 */
export const agentEnvAvailability: AgentEnvAvailability = (() => {
  const braveSearch = envClient.NEXT_PUBLIC_AGENT_BRAVE_SEARCH;
  const kagiSearch = envClient.NEXT_PUBLIC_AGENT_KAGI_SEARCH;

  return {
    openRouter: envClient.NEXT_PUBLIC_AGENT_OPEN_ROUTER,
    claudeCode: envClient.NEXT_PUBLIC_AGENT_CLAUDE_CODE,
    voice: envClient.NEXT_PUBLIC_AGENT_VOICE,
    braveSearch,
    kagiSearch,
    anySearch: braveSearch || kagiSearch,
    uncensoredAI: envClient.NEXT_PUBLIC_AGENT_UNCENSORED_AI,
    freedomGPT: envClient.NEXT_PUBLIC_AGENT_FREEDOM_GPT,
    gabAI: envClient.NEXT_PUBLIC_AGENT_GAB_AI,
    veniceAI: envClient.NEXT_PUBLIC_AGENT_VENICE_AI,
    scrappey: envClient.NEXT_PUBLIC_AGENT_SCRAPPEY,
    openAiImages: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_IMAGES,
    openAiStt: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_STT,
    replicate: envClient.NEXT_PUBLIC_AGENT_REPLICATE,
    falAi: envClient.NEXT_PUBLIC_AGENT_FAL_AI,
    modelsLab: envClient.NEXT_PUBLIC_AGENT_MODELS_LAB,
    unbottled: envClient.NEXT_PUBLIC_AGENT_UNBOTTLED,
    edenAiStt: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_STT,
    deepgram: envClient.NEXT_PUBLIC_AGENT_DEEPGRAM,
    openAiTts: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_TTS,
    edenAiTts: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_TTS,
    elevenlabs: envClient.NEXT_PUBLIC_AGENT_ELEVENLABS,
  };
})();

/**
 * Setup instructions per provider.
 * Used to show actionable messages when a feature is used without the key configured.
 */
export const PROVIDER_SETUP_INSTRUCTIONS = {
  openRouter: {
    envKey: "OPENROUTER_API_KEY",
    url: "https://openrouter.ai/keys",
    label: "OpenRouter",
  },
  claudeCode: {
    envKey: "CLAUDE_CODE_ENABLED",
    url: "https://claude.ai/code",
    label: "Claude Code",
  },
  voice: {
    envKey: "EDEN_AI_API_KEY",
    url: "https://app.edenai.run/user/settings#api",
    label: "Eden AI (Voice/TTS)",
  },
  braveSearch: {
    envKey: "BRAVE_SEARCH_API_KEY",
    url: "https://api.search.brave.com/app/keys",
    label: "Brave Search",
  },
  kagiSearch: {
    envKey: "KAGI_API_KEY",
    url: "https://kagi.com/settings?p=api",
    label: "Kagi",
  },
  uncensoredAI: {
    envKey: "UNCENSORED_AI_API_KEY",
    url: "https://uncensored.ai",
    label: "Uncensored.ai",
  },
  freedomGPT: {
    envKey: "FREEDOMGPT_API_KEY",
    url: "https://freedomgpt.com",
    label: "FreedomGPT",
  },
  gabAI: {
    envKey: "GAB_AI_API_KEY",
    url: "https://gab.ai",
    label: "Gab AI",
  },
  veniceAI: {
    envKey: "VENICE_AI_API_KEY",
    url: "https://venice.ai",
    label: "Venice AI",
  },
  scrappey: {
    envKey: "SCRAPPEY_API_KEY",
    url: "https://scrappey.com",
    label: "Scrappey",
  },
  openAiImages: {
    envKey: "OPENAI_API_KEY",
    url: "https://platform.openai.com/api-keys",
    label: "OpenAI Images (DALL-E)",
  },
  replicate: {
    envKey: "REPLICATE_API_TOKEN",
    url: "https://replicate.com/account/api-tokens",
    label: "Replicate",
  },
  falAi: {
    envKey: "FAL_AI_API_KEY",
    url: "https://fal.ai/dashboard/keys",
    label: "Fal.ai",
  },
  modelsLab: {
    envKey: "MODELSLAB_API_KEY",
    url: "https://modelslab.com/account/api",
    label: "ModelsLab",
  },
  unbottled: {
    envKey: "UNBOTTLED_CLOUD_CREDENTIALS",
    url: "https://unbottled.ai",
    label: "Unbottled AI",
  },
  openAiStt: {
    envKey: "OPENAI_API_KEY",
    url: "https://platform.openai.com/api-keys",
    label: "OpenAI Whisper (STT)",
  },
  edenAiStt: {
    envKey: "EDEN_AI_API_KEY",
    url: "https://app.edenai.run/user/settings#api",
    label: "Eden AI (STT)",
  },
  deepgram: {
    envKey: "DEEPGRAM_API_KEY",
    url: "https://console.deepgram.com",
    label: "Deepgram",
  },
  openAiTts: {
    envKey: "OPENAI_API_KEY",
    url: "https://platform.openai.com/api-keys",
    label: "OpenAI TTS",
  },
  edenAiTts: {
    envKey: "EDEN_AI_API_KEY",
    url: "https://app.edenai.run/user/settings#api",
    label: "Eden AI TTS",
  },
  elevenlabs: {
    envKey: "ELEVENLABS_API_KEY",
    url: "https://elevenlabs.io/app/settings/api-keys",
    label: "ElevenLabs",
  },
} as const satisfies Record<
  Exclude<keyof AgentEnvAvailability, "anySearch">,
  { envKey: string; url: string; label: string }
>;

/**
 * Build a user-friendly error message with setup instructions.
 */
export function buildMissingKeyMessage(
  provider: keyof Omit<AgentEnvAvailability, "anySearch">,
): string {
  const info = PROVIDER_SETUP_INSTRUCTIONS[provider];
  // eslint-disable-next-line i18next/no-literal-string
  return `${info.label} API key not configured. Add ${info.envKey}=<your-key> to your .env file. Get your key at ${info.url}`;
}
