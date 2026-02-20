/**
 * Agent Environment Availability
 *
 * Server-side utility that exposes which AI provider keys are configured.
 * Use this to gate features and show setup instructions instead of hard errors.
 */

import "server-only";

import { agentEnv } from "./env";

export interface AgentEnvAvailability {
  /** Main LLM routing - most models require this */
  openRouter: boolean;
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
}

/**
 * Returns which AI provider integrations are currently configured.
 * A key is "available" if it is non-empty.
 */
export function getAgentEnvAvailability(): AgentEnvAvailability {
  const braveSearch = Boolean(agentEnv.BRAVE_SEARCH_API_KEY);
  const kagiSearch = Boolean(agentEnv.KAGI_API_KEY);

  return {
    openRouter: Boolean(agentEnv.OPENROUTER_API_KEY),
    voice: Boolean(agentEnv.EDEN_AI_API_KEY),
    braveSearch,
    kagiSearch,
    anySearch: braveSearch || kagiSearch,
    uncensoredAI: Boolean(agentEnv.UNCENSORED_AI_API_KEY),
    freedomGPT: Boolean(agentEnv.FREEDOMGPT_API_KEY),
    gabAI: Boolean(agentEnv.GAB_AI_API_KEY),
    veniceAI: Boolean(agentEnv.VENICE_AI_API_KEY),
    scrappey: Boolean(agentEnv.SCRAPPEY_API_KEY),
  };
}

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
