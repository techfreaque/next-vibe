import type {
  PlatformSource,
  VersusKey,
} from "../../compare/_shared/platforms";

export const CHECKED_DATE = "2026-11-24";

export const POST_SLUGS = {
  poe: "poe-alternatives",
  typingMind: "typingmind-alternatives",
} as const;

export type Subject = keyof typeof POST_SLUGS;

export const ALTERNATIVES = {
  poe: [
    "typingMind",
    "openRouter",
    "nanoGpt",
    "venice",
    "chatGpt",
    "libreChat",
    "openWebUi",
  ],
  typingMind: [
    "libreChat",
    "openWebUi",
    "openRouter",
    "poe",
    "nanoGpt",
    "venice",
    "chatGpt",
  ],
} as const;

type Key = Subject | (typeof ALTERNATIVES)[Subject][number];
type Kind =
  | "aggregator"
  | "client"
  | "selfHosted"
  | "gateway"
  | "creativeChat"
  | "singleProvider";

interface Platform {
  name: string;
  kind: Kind;
  sources: readonly PlatformSource[];
  versus?: VersusKey;
}

export const PLATFORMS: Record<Key, Platform> = {
  poe: {
    name: "Poe",
    kind: "aggregator",
    sources: [
      { kind: "pricing", url: "https://poe.com/subscription_plans" },
      {
        kind: "help",
        url: "https://help.poe.com/hc/en-us/articles/19945140063636-Poe-Purchases-FAQs",
      },
      {
        kind: "features",
        url: "https://help.poe.com/hc/en-us/articles/19944206309524-Poe-FAQs",
      },
      { kind: "privacy", url: "https://poe.com/pages/privacy" },
      { kind: "guidelines", url: "https://poe.com/pages/usage-guidelines" },
      {
        kind: "api",
        url: "https://creator.poe.com/docs/external-applications/openai-compatible-api",
      },
      {
        kind: "docs",
        url: "https://help.poe.com/hc/en-us/articles/21921312368020-Poe-Creator-Monetization-FAQs",
      },
    ],
  },
  typingMind: {
    name: "TypingMind",
    kind: "client",
    sources: [
      { kind: "pricing", url: "https://license.typingmind.com/buy" },
      { kind: "features", url: "https://www.typingmind.com/" },
      {
        kind: "docs",
        url: "https://docs.typingmind.com/manage-and-connect-ai-models/activate-multi-model-responses",
      },
    ],
  },
  libreChat: {
    name: "LibreChat",
    kind: "selfHosted",
    sources: [
      { kind: "docs", url: "https://www.librechat.ai/docs" },
      { kind: "features", url: "https://www.librechat.ai/docs/features" },
      { kind: "repo", url: "https://github.com/LibreChat-AI/LibreChat" },
    ],
  },
  openWebUi: {
    name: "Open WebUI",
    kind: "selfHosted",
    sources: [
      { kind: "docs", url: "https://docs.openwebui.com/" },
      { kind: "features", url: "https://docs.openwebui.com/features/" },
      { kind: "terms", url: "https://docs.openwebui.com/license/" },
    ],
  },
  openRouter: {
    name: "OpenRouter Chat",
    kind: "gateway",
    versus: "openRouter",
    sources: [
      { kind: "home", url: "https://openrouter.ai/chat" },
      { kind: "pricing", url: "https://openrouter.ai/pricing" },
      { kind: "help", url: "https://openrouter.ai/docs/faq" },
      { kind: "privacy", url: "https://openrouter.ai/privacy" },
      {
        kind: "docs",
        url: "https://openrouter.ai/docs/guides/privacy/provider-logging",
      },
    ],
  },
  venice: {
    name: "Venice",
    kind: "creativeChat",
    versus: "venice",
    sources: [
      { kind: "pricing", url: "https://venice.ai/pricing" },
      { kind: "privacy", url: "https://venice.ai/privacy" },
      { kind: "help", url: "https://venice.ai/faqs/all" },
    ],
  },
  nanoGpt: {
    name: "NanoGPT",
    kind: "aggregator",
    versus: "nanoGpt",
    sources: [
      { kind: "pricing", url: "https://nano-gpt.com/pricing" },
      { kind: "privacy", url: "https://nano-gpt.com/privacy" },
      { kind: "terms", url: "https://nano-gpt.com/legal/terms-of-service" },
    ],
  },
  chatGpt: {
    name: "ChatGPT Plus",
    kind: "singleProvider",
    sources: [
      {
        kind: "help",
        url: "https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus",
      },
      { kind: "privacy", url: "https://openai.com/consumer-privacy/" },
    ],
  },
};

export const DISCUSSIONS = {
  poe: [
    "https://www.reddit.com/r/PoeAI/comments/1xdauis/so_did_anyone_get_the_email/",
    "https://www.reddit.com/r/PoeAI/comments/1t1h9d6/best_replacement_for_poe/",
  ],
  typingMind: [
    "https://www.reddit.com/r/selfhosted/comments/1m7az19/any_free_alternative_to_typingmind/",
    "https://www.reddit.com/r/TypingMind/comments/1in489p/has_typingmind_hidden_costs_how_has_you/",
  ],
} as const;

export const USD_PRICES = {
  poeStart: 4.99,
  typingStandard: 39,
  typingExtended: 79,
  typingPremium: 79.2,
  typingList: 198,
  venicePro: 18,
  nanoPro: 12,
  plus: 20,
  routerMinimum: 0.8,
} as const;
