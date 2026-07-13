import { envClient } from "@/config/env-client";

export interface AgentEnvAvailability {
  openRouter: boolean;
  claudeCode: boolean;
  voice: boolean;
  braveSearch: boolean;
  kagiSearch: boolean;
  anySearch: boolean;
  uncensoredAI: boolean;
  freedomGPT: boolean;
  gabAI: boolean;
  veniceAI: boolean;
  scrappey: boolean;
  openAiImages: boolean;
  openAiStt: boolean;
  replicate: boolean;
  falAi: boolean;
  modelsLab: boolean;
  edenAiStt: boolean;
  deepgram: boolean;
  openAiTts: boolean;
  edenAiTts: boolean;
  elevenlabs: boolean;
  /** True when any active connection has isInferenceProvider or forceSystemProvider */
  unbottledSystem: boolean;
  /** True when any active connection has forceSystemProvider — overrides all user model choices */
  unbottledForce: boolean;
}

const agentEnvAvailability: AgentEnvAvailability = (() => {
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
    edenAiStt: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_STT,
    deepgram: envClient.NEXT_PUBLIC_AGENT_DEEPGRAM,
    openAiTts: envClient.NEXT_PUBLIC_AGENT_OPEN_AI_TTS,
    edenAiTts: envClient.NEXT_PUBLIC_AGENT_EDEN_AI_TTS,
    elevenlabs: envClient.NEXT_PUBLIC_AGENT_ELEVENLABS,
    unbottledSystem: false,
    unbottledForce: false,
  };
})();

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
} as const;

export function buildMissingKeyMessage(
  provider: keyof typeof PROVIDER_SETUP_INSTRUCTIONS,
): string {
  const info = PROVIDER_SETUP_INSTRUCTIONS[provider];
  // eslint-disable-next-line i18next/no-literal-string
  return `${info.label} API key not configured. Add ${info.envKey}=<your-key> to your .env file. Get your key at ${info.url}`;
}

/** Env-flag-only availability (no WS state). Safe to call anywhere including client. */
export function getEnvAvailability(): AgentEnvAvailability {
  return agentEnvAvailability;
}

/**
 * Full instance availability — env flags + live WS inference state.
 * Server-side only (async, reads the executor's routing state).
 */
export async function getInstanceAvailability(): Promise<AgentEnvAvailability> {
  const { ExecuteToolRouting } =
    await import("@/app/api/[locale]/remote-connection/routing");
  const { hasSystem, forceSystem } =
    await ExecuteToolRouting.getInstanceInferenceState();
  return {
    ...agentEnvAvailability,
    unbottledSystem: hasSystem,
    unbottledForce: forceSystem,
  };
}
