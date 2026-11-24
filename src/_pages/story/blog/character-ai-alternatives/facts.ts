import {
  type PlatformData,
  PLATFORMS,
  type PlatformSource,
} from "../../compare/_shared/platforms";

export const CHECKED_DATE = "2026-11-24";

export const ALTERNATIVES = [
  "janitorAi",
  "sillyTavern",
  "chub",
  "crushOn",
  "spicyChat",
  "kindroid",
  "nomi",
  "venice",
  "nanoGpt",
] as const;

export const TABLE_KEYS = [...ALTERNATIVES, "characterAi"] as const;

export const SWITCH_SOURCES = [
  ["filtering", "https://www.reddit.com/r/CharacterAI/comments/1mv5p1x/"],
  [
    "continuity",
    "https://www.reddit.com/r/CharacterAIrunaways/comments/1v7cahp/",
  ],
  ["oldSite", "https://www.reddit.com/r/CAIRevolution/comments/1vd2md5/"],
] as const;

type ArticlePlatform = Omit<PlatformData, "key" | "sources" | "upstream"> & {
  sources: readonly PlatformSource[];
};

export const RESEARCH: Record<(typeof TABLE_KEYS)[number], ArticlePlatform> = {
  characterAi: {
    ...PLATFORMS.characterAi,
    plans: [
      { name: "(c.ai) lite", price: 4.99, period: "month" },
      { name: "c.ai+", price: 9.99, period: "month" },
      { name: "c.ai+", price: 94.99, period: "year" },
    ],
    media: { image: "yes", video: "yes", voice: "yes" },
    sources: [
      { kind: "home", url: "https://character.ai/" },
      {
        kind: "pricing",
        url: "https://support.character.ai/hc/en-us/articles/51248493096987-c-ai-Summer-Flash-Sale-Offer-Terms",
      },
      {
        kind: "help",
        url: "https://support.character.ai/hc/en-us/articles/56173313531675-About-c-ai-lite",
      },
      {
        kind: "guidelines",
        url: "https://support.character.ai/hc/en-us/articles/15063955587611-What-about-NSFW",
      },
      {
        kind: "blog",
        url: "https://blog.character.ai/continuing-to-build-upon-our-safety-priorities/",
      },
      {
        kind: "privacy",
        url: "https://support.character.ai/hc/en-us/articles/42788047758747-How-do-I-manage-update-my-model-training-settings",
      },
    ],
  },
  janitorAi: {
    ...PLATFORMS.janitorAi,
    sources: [
      {
        kind: "help",
        url: "https://help.janitorai.com/en/article/faq-subscription-janitorai-1o8ccf2/",
      },
      {
        kind: "appStore",
        url: "https://apps.apple.com/us/app/janitor-interactive-stories/id6692609366",
      },
      {
        kind: "guidelines",
        url: "https://help.janitorai.com/en/article/faq-whats-the-difference-between-limited-and-limitless-b78orr/",
      },
      {
        kind: "docs",
        url: "https://help.janitorai.com/en/article/tldr-quickstart-proxy-instructions-1x0fptu/",
      },
      {
        kind: "features",
        url: "https://help.janitorai.com/en/article/faq-mobile-app-moderation-vttat8/",
      },
    ],
  },
  sillyTavern: {
    ...PLATFORMS.sillyTavern,
    sources: [
      { kind: "docs", url: "https://docs.sillytavern.app/" },
      {
        kind: "api",
        url: "https://docs.sillytavern.app/usage/api-connections/",
      },
      { kind: "privacy", url: "https://docs.sillytavern.app/usage/faq/" },
    ],
  },
  chub: {
    name: "Chub AI",
    url: "https://chub.ai/",
    kind: "roleplay",
    freeTier: true,
    payAsYouGo: false,
    plans: [{ name: "Mars", price: 20, period: "month" }],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "no", voice: "yes" },
    sources: [
      { kind: "pricing", url: "https://chub.ai/mars" },
      {
        kind: "api",
        url: "https://docs.chub.ai/docs/the-basics/api-connections",
      },
      {
        kind: "docs",
        url: "https://docs.chub.ai/docs/advanced-setups/lorebooks",
      },
      {
        kind: "features",
        url: "https://docs.chub.ai/docs/the-basics/just-chatting",
      },
      { kind: "terms", url: "https://chub.ai/tos" },
    ],
  },
  crushOn: {
    ...PLATFORMS.crushOn,
    url: "https://chat.crushon.ai/",
    sources: [
      { kind: "features", url: "https://chat.crushon.ai/" },
      {
        kind: "pricing",
        url: "https://chat.crushon.ai/blog/ai-character-chat-unlimited-messages-limits",
      },
      {
        kind: "privacy",
        url: "https://companion.crushon.ai/blog/can-ai-character-creators-see-your-chats/",
      },
    ],
  },
  spicyChat: {
    name: "SpicyChat",
    url: "https://spicychat.ai/",
    kind: "roleplay",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Get a Taste", price: 60, period: "year" },
      { name: "True Supporter", price: 199.95, period: "year" },
      { name: "I’m All In", price: 299.95, period: "year" },
    ],
    api: "no",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "no", voice: "partial" },
    sources: [
      {
        kind: "pricing",
        url: "https://spicychat.ai/plan-comparison/annual_plans",
      },
      {
        kind: "help",
        url: "https://support.spicychat.ai/support/solutions/articles/153000260533-plans-and-what-s-included",
      },
      {
        kind: "features",
        url: "https://docs.spicychat.ai/product-guides/premium-features",
      },
      { kind: "guidelines", url: "https://docs.spicychat.ai/" },
      {
        kind: "privacy",
        url: "https://support.spicychat.ai/support/solutions/articles/153000260635-how-spicychat-generates-messages",
      },
    ],
  },
  kindroid: {
    ...PLATFORMS.kindroid,
    sources: [
      { kind: "docs", url: "https://kindroid.ai/v2/docs/subscriptions/" },
      {
        kind: "appStore",
        url: "https://apps.apple.com/us/app/kindroid-your-personal-ai/id6451038161",
      },
      {
        kind: "guidelines",
        url: "https://kindroid.ai/v2/docs/moderation-guidelines/",
      },
      { kind: "privacy", url: "https://kindroid.ai/v2/docs/kindroid-legal/" },
    ],
  },
  nomi: {
    ...PLATFORMS.nomi,
    sources: [
      {
        kind: "pricing",
        url: "https://nomi.ai/ai-today/replika-vs-nomi-2026-finding-enduring-ai-companionship/",
      },
      { kind: "features", url: "https://nomi.ai/ai-girlfriend/" },
      { kind: "help", url: "https://wiki.nomi.ai/Does_Nomi_offer_refunds%3F" },
      { kind: "terms", url: "https://nomi.ai/terms-of-service/" },
      { kind: "privacy", url: "https://nomi.ai/privacy-policy/" },
    ],
  },
  venice: {
    ...PLATFORMS.venice,
    sources: [
      { kind: "pricing", url: "https://venice.ai/pricing" },
      {
        kind: "features",
        url: "https://venice.ai/blog/venice-vs-character-ai",
      },
      { kind: "privacy", url: "https://venice.ai/privacy" },
      {
        kind: "help",
        url: "https://featurebase.venice.ai/help/articles/6462141-how-do-i-disable-the-mature-filter",
      },
    ],
  },
  nanoGpt: {
    ...PLATFORMS.nanoGpt,
    sources: [
      { kind: "pricing", url: "https://nano-gpt.com/pricing" },
      { kind: "models", url: "https://nano-gpt.com/models" },
      { kind: "terms", url: "https://nano-gpt.com/legal/terms-of-service" },
      { kind: "privacy", url: "https://nano-gpt.com/privacy" },
      { kind: "docs", url: "https://nano-gpt.com/llms-full.txt" },
      { kind: "help", url: "https://nano-gpt.com/get-started" },
    ],
  },
};
