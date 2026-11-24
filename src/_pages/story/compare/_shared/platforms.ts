/**
 * Competitor facts for the comparison pages, verified on each platform's own
 * pages on COMPARE_CHECKED_DATE (pricing, features, privacy, API docs). Every
 * number here has a source URL in `sources`. Prices are the platform's own
 * USD list prices; copy formats them per locale and never repeats them.
 *
 * Re-verify everything (and bump the date) before changing a single price.
 * Our own side is never here: it is read from config at render time
 * (./us-facts.ts).
 */

import { ApiProvider } from "next-vibe/agent/models/models";

import type { UpstreamProvider } from "./us-facts";

/** Day every competitor fact below was last checked on its source page. */
export const COMPARE_CHECKED_DATE = "2026-11-17";
/** Day the comparison pages first shipped. */
export const COMPARE_PUBLISHED_DATE = "2026-11-17";
/** Latest re-check of any single platform (newest `checkedDate` below). */
export const COMPARE_LATEST_CHECK_DATE = "2026-11-24";

export const COMPARE_BASE_PATH = "/story/compare";
export const COMPARE_HUB_PATH = `${COMPARE_BASE_PATH}/uncensored-ai-platforms`;

export const PLATFORM_KEYS = [
  "venice",
  "uncensoredAi",
  "nanoGpt",
  "openRouter",
  "freedomGpt",
  "gabAi",
  "janitorAi",
  "sillyTavern",
  "characterAi",
  "kindroid",
  "nomi",
  "crushOn",
  "ollama",
  "lmStudio",
] as const;

export type PlatformKey = (typeof PLATFORM_KEYS)[number];

export type PlatformKind =
  | "uncensoredChat"
  | "aggregator"
  | "router"
  | "roleplay"
  | "frontend"
  | "companion"
  | "filteredChat"
  | "local";

export type BillingPeriod = "month" | "quarter" | "year" | "once";

export interface PlatformPlan {
  /** The platform's own plan name (a proper name, never translated). */
  name: string;
  /** USD list price. */
  price: number;
  period: BillingPeriod;
}

export type SourceKind =
  | "home"
  | "pricing"
  | "features"
  | "models"
  | "privacy"
  | "terms"
  | "guidelines"
  | "api"
  | "docs"
  | "help"
  | "repo"
  | "blog"
  | "appStore"
  | "paper";

export interface PlatformSource {
  kind: SourceKind;
  url: string;
}

export type Availability = "yes" | "no" | "partial";

export interface PlatformData {
  key: PlatformKey;
  name: string;
  url: string;
  kind: PlatformKind;
  /** Usable without paying (any free tier or free local use). */
  freeTier: boolean;
  /** Pay per use (tokens/credits) without a subscription. */
  payAsYouGo: boolean;
  /** Paid plans, cheapest first. Empty when there is none. */
  plans: readonly PlatformPlan[];
  /** Developer API: "partial" = local server or bring-your-own-key only. */
  api: Availability;
  openSource: Availability;
  selfHost: boolean;
  media: { image: Availability; video: Availability; voice: Availability };
  /** Set when we serve this platform's models through its API. */
  upstream: UpstreamProvider | null;
  sources: readonly PlatformSource[];
  /** Set when this platform was re-verified after COMPARE_CHECKED_DATE. */
  checkedDate?: string;
}

/**
 * Filled from the 2026-11-17 research pass. Keep in PLATFORM_KEYS order.
 * Kindroid and Nomi sell through checkout pages behind a login: their
 * prices are the US App Store listing (web checkout can be cheaper).
 */
export const PLATFORMS: Record<PlatformKey, PlatformData> = {
  venice: {
    key: "venice",
    name: "Venice.ai",
    url: "https://venice.ai",
    kind: "uncensoredChat",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Pro", price: 18, period: "month" },
      { name: "Pro Plus", price: 68, period: "month" },
      { name: "Max", price: 200, period: "month" },
    ],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "yes", voice: "yes" },
    upstream: ApiProvider.VENICE_AI,
    sources: [
      { kind: "pricing", url: "https://venice.ai/pricing" },
      { kind: "privacy", url: "https://venice.ai/privacy" },
      { kind: "models", url: "https://docs.venice.ai/overview/models" },
      { kind: "api", url: "https://docs.venice.ai/overview/pricing" },
      { kind: "docs", url: "https://docs.venice.ai/overview/vvv-diem" },
      {
        kind: "help",
        url: "https://featurebase.venice.ai/help/articles/6462141-how-do-i-disable-the-mature-filter",
      },
    ],
  },
  uncensoredAi: {
    key: "uncensoredAi",
    name: "uncensored.ai",
    url: "https://uncensored.ai",
    kind: "uncensoredChat",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Pro", price: 9.99, period: "month" },
      { name: "Pro Annual", price: 99.99, period: "year" },
    ],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "no", video: "no", voice: "yes" },
    upstream: ApiProvider.UNCENSORED_AI,
    // Re-checked 2026-11-24: pricing (3 free responses a day, Pro $9.99/month
    // or $99.99/year locked for life), API page ($0.05 per inference,
    // UncensoredAI v1.2, 32,768 context), privacy policy (not used for
    // training, Parasail AI processes messages).
    checkedDate: "2026-11-24",
    sources: [
      { kind: "pricing", url: "https://uncensored.ai/pricing" },
      { kind: "api", url: "https://uncensored.ai/api" },
      { kind: "features", url: "https://uncensored.ai/what-is-uai" },
      { kind: "privacy", url: "https://uncensored.ai/privacy-policy" },
      { kind: "terms", url: "https://uncensored.ai/terms-of-service" },
    ],
  },
  nanoGpt: {
    key: "nanoGpt",
    name: "NanoGPT",
    url: "https://nano-gpt.com",
    kind: "aggregator",
    freeTier: true,
    payAsYouGo: true,
    plans: [{ name: "PRO", price: 12, period: "month" }],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "yes", voice: "yes" },
    upstream: ApiProvider.NANO_GPT,
    sources: [
      { kind: "pricing", url: "https://nano-gpt.com/pricing" },
      { kind: "privacy", url: "https://nano-gpt.com/privacy" },
      { kind: "terms", url: "https://nano-gpt.com/terms" },
      { kind: "models", url: "https://api.nano-gpt.com/api/v1/models" },
      { kind: "docs", url: "https://nano-gpt.com/llms-full.txt" },
    ],
  },
  openRouter: {
    key: "openRouter",
    name: "OpenRouter",
    url: "https://openrouter.ai",
    kind: "router",
    freeTier: true,
    payAsYouGo: true,
    plans: [],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "partial", video: "partial", voice: "partial" },
    upstream: ApiProvider.OPENROUTER,
    // Re-checked 2026-11-24: pricing page (5.5% fee, 50/1,000 free requests
    // a day), data-collection guide, terms (18+, CSAM screening) and the
    // public models API (474 models, 15 free, 142 moderated).
    checkedDate: "2026-11-24",
    sources: [
      { kind: "pricing", url: "https://openrouter.ai/pricing" },
      {
        kind: "privacy",
        url: "https://openrouter.ai/docs/guides/privacy/data-collection",
      },
      { kind: "terms", url: "https://openrouter.ai/terms" },
      { kind: "models", url: "https://openrouter.ai/api/v1/models" },
    ],
  },
  freedomGpt: {
    key: "freedomGpt",
    name: "FreedomGPT",
    url: "https://www.freedomgpt.com",
    kind: "aggregator",
    freeTier: true,
    payAsYouGo: false,
    plans: [{ name: "Pro", price: 20, period: "month" }],
    api: "yes",
    openSource: "partial",
    selfHost: true,
    media: { image: "yes", video: "yes", voice: "partial" },
    upstream: ApiProvider.FREEDOMGPT,
    sources: [
      { kind: "home", url: "https://www.freedomgpt.com/" },
      { kind: "pricing", url: "https://chat.freedomgpt.com/pricing" },
      {
        kind: "blog",
        url: "https://www.freedomgpt.com/blog/what-is-uncensored-ai",
      },
      { kind: "privacy", url: "https://www.freedomgpt.com/privacy-policy" },
      { kind: "api", url: "https://docs.freedomgpt.com/" },
      { kind: "repo", url: "https://github.com/ohmplatform/FreedomGPT" },
    ],
  },
  gabAi: {
    key: "gabAi",
    name: "Gab AI",
    url: "https://gab.ai",
    kind: "aggregator",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Plus", price: 20, period: "month" },
      { name: "Plus", price: 200, period: "year" },
      { name: "Plus Premium", price: 999, period: "year" },
    ],
    api: "yes",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "yes", voice: "yes" },
    upstream: ApiProvider.GAB_AI,
    // Re-checked 2026-11-24: home page ("214 models. One account."),
    // pricing (Plus $20/month or $200/year, Plus Premium $999/year, packs
    // from $10 for 700 credits, 250 signup credits), API page (Plus or Plus
    // Premium required), terms (18+, no sexually explicit content, automated
    // scanning) and privacy policy (last updated 2026-11-09: content used to
    // improve models, provider requests "not anonymous").
    checkedDate: "2026-11-24",
    sources: [
      { kind: "home", url: "https://gab.ai/" },
      { kind: "pricing", url: "https://gab.ai/pricing" },
      { kind: "api", url: "https://gab.ai/api" },
      { kind: "privacy", url: "https://gab.ai/privacy-policy" },
      { kind: "terms", url: "https://gab.ai/terms-of-service" },
    ],
  },
  janitorAi: {
    key: "janitorAi",
    name: "Janitor AI",
    url: "https://janitorai.com",
    kind: "roleplay",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "janitor+", price: 12.99, period: "month" },
      { name: "janitor+", price: 99, period: "year" },
    ],
    api: "partial",
    openSource: "no",
    selfHost: false,
    media: { image: "no", video: "no", voice: "no" },
    upstream: null,
    sources: [
      { kind: "pricing", url: "https://janitorai.com/plus" },
      {
        kind: "help",
        url: "https://help.janitorai.com/en/article/faq-subscription-janitorai-1o8ccf2/",
      },
      {
        kind: "help",
        url: "https://help.janitorai.com/en/article/faq-whats-the-difference-between-limited-and-limitless-b78orr/",
      },
      {
        kind: "help",
        url: "https://help.janitorai.com/en/article/faq-mobile-app-moderation-vttat8/",
      },
      {
        kind: "docs",
        url: "https://help.janitorai.com/en/article/tldr-quickstart-proxy-instructions-1x0fptu/",
      },
      { kind: "privacy", url: "https://janitorai.com/policy" },
      { kind: "terms", url: "https://janitorai.com/term" },
    ],
  },
  sillyTavern: {
    key: "sillyTavern",
    name: "SillyTavern",
    url: "https://sillytavern.app",
    kind: "frontend",
    freeTier: true,
    payAsYouGo: false,
    plans: [],
    api: "partial",
    openSource: "yes",
    selfHost: true,
    media: { image: "partial", video: "no", voice: "partial" },
    upstream: null,
    sources: [
      { kind: "docs", url: "https://docs.sillytavern.app/" },
      {
        kind: "docs",
        url: "https://docs.sillytavern.app/usage/api-connections/",
      },
      { kind: "repo", url: "https://github.com/SillyTavern/SillyTavern" },
    ],
  },
  characterAi: {
    key: "characterAi",
    name: "Character.AI",
    url: "https://character.ai",
    kind: "filteredChat",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "c.ai lite", price: 4.99, period: "month" },
      { name: "c.ai+", price: 94.99, period: "year" },
    ],
    api: "no",
    openSource: "no",
    selfHost: false,
    media: { image: "no", video: "no", voice: "yes" },
    upstream: null,
    sources: [
      { kind: "pricing", url: "https://character.ai/subscribe" },
      {
        kind: "help",
        url: "https://support.character.ai/hc/en-us/articles/56173313531675-About-c-ai-lite",
      },
      {
        kind: "help",
        url: "https://support.character.ai/hc/en-us/articles/15063955587611-What-about-NSFW",
      },
      {
        kind: "help",
        url: "https://support.character.ai/hc/en-us/articles/53182286684059-What-is-Age-Assurance",
      },
      { kind: "privacy", url: "https://character.ai/privacy" },
    ],
  },
  kindroid: {
    key: "kindroid",
    name: "Kindroid",
    url: "https://kindroid.ai",
    kind: "companion",
    freeTier: false,
    payAsYouGo: false,
    plans: [
      { name: "Subscription", price: 15.99, period: "month" },
      { name: "Subscription", price: 42.99, period: "quarter" },
      { name: "Subscription", price: 159.99, period: "year" },
    ],
    api: "partial",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "yes", voice: "yes" },
    upstream: null,
    sources: [
      { kind: "docs", url: "https://kindroid.ai/v2/docs/subscriptions/" },
      {
        kind: "appStore",
        url: "https://apps.apple.com/us/app/kindroid-your-personal-ai/id6451038161",
      },
      {
        kind: "docs",
        url: "https://kindroid.ai/v2/docs/moderation-guidelines/",
      },
      { kind: "docs", url: "https://kindroid.ai/v2/docs/age-verification/" },
      { kind: "privacy", url: "https://kindroid.ai/v2/docs/kindroid-legal/" },
      { kind: "api", url: "https://kindroid.ai/v2/docs/api-documentation/" },
    ],
  },
  nomi: {
    key: "nomi",
    name: "Nomi",
    url: "https://nomi.ai",
    kind: "companion",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Launch", price: 9.99, period: "month" },
      { name: "Standard", price: 15.99, period: "month" },
      { name: "Standard", price: 39.99, period: "quarter" },
      { name: "Standard", price: 99.99, period: "year" },
    ],
    api: "partial",
    openSource: "no",
    selfHost: false,
    media: { image: "yes", video: "no", voice: "yes" },
    upstream: null,
    sources: [
      {
        kind: "appStore",
        url: "https://apps.apple.com/us/app/nomi-ai-companion-with-a-soul/id6450270929",
      },
      { kind: "features", url: "https://nomi.ai/ai-girlfriend/" },
      {
        kind: "help",
        url: "https://nomi.ai/nomi-knowledge/getting-started-nomi-selfies/",
      },
      { kind: "privacy", url: "https://nomi.ai/privacy-policy/" },
      { kind: "terms", url: "https://nomi.ai/terms-of-service/" },
      { kind: "api", url: "https://api.nomi.ai/docs/" },
    ],
  },
  crushOn: {
    key: "crushOn",
    name: "CrushOn.AI",
    url: "https://crushon.ai",
    kind: "roleplay",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Standard", price: 5.99, period: "month" },
      { name: "Premium", price: 14.99, period: "month" },
      { name: "Luxe", price: 39.99, period: "month" },
      { name: "Elite", price: 89.99, period: "month" },
      { name: "Imperial", price: 199.99, period: "month" },
    ],
    api: "no",
    openSource: "no",
    selfHost: false,
    media: { image: "no", video: "no", voice: "yes" },
    upstream: null,
    sources: [
      { kind: "pricing", url: "https://crushon.ai/pricing" },
      { kind: "privacy", url: "https://crushon.ai/privacy-policy" },
      { kind: "guidelines", url: "https://crushon.ai/community-guidelines" },
    ],
  },
  ollama: {
    key: "ollama",
    name: "Ollama",
    url: "https://ollama.com",
    kind: "local",
    freeTier: true,
    payAsYouGo: true,
    plans: [
      { name: "Pro", price: 20, period: "month" },
      { name: "Max", price: 100, period: "month" },
      { name: "Team", price: 500, period: "month" },
    ],
    api: "yes",
    openSource: "yes",
    selfHost: true,
    media: { image: "no", video: "no", voice: "partial" },
    upstream: null,
    sources: [
      { kind: "pricing", url: "https://ollama.com/pricing" },
      { kind: "repo", url: "https://github.com/ollama/ollama" },
      { kind: "docs", url: "https://docs.ollama.com/faq" },
      {
        kind: "api",
        url: "https://docs.ollama.com/api/openai-compatibility",
      },
      { kind: "models", url: "https://ollama.com/search?q=abliterated" },
    ],
  },
  lmStudio: {
    key: "lmStudio",
    name: "LM Studio",
    url: "https://lmstudio.ai",
    kind: "local",
    freeTier: true,
    payAsYouGo: false,
    plans: [
      { name: "Bionic+", price: 20, period: "month" },
      { name: "Pro", price: 100, period: "month" },
    ],
    api: "yes",
    openSource: "no",
    selfHost: true,
    media: { image: "no", video: "no", voice: "partial" },
    upstream: null,
    sources: [
      { kind: "pricing", url: "https://lmstudio.ai/pricing" },
      { kind: "blog", url: "https://lmstudio.ai/blog/free-for-work" },
      {
        kind: "api",
        url: "https://lmstudio.ai/docs/developer/openai-compat",
      },
      {
        kind: "docs",
        url: "https://lmstudio.ai/docs/app/system-requirements",
      },
    ],
  },
};

/** Background reading cited in the methodology (abliteration). */
export const ABLITERATION_SOURCES: readonly PlatformSource[] = [
  { kind: "paper", url: "https://arxiv.org/abs/2406.11717" },
  { kind: "blog", url: "https://huggingface.co/blog/mlabonne/abliteration" },
];

/** The "unbottled.ai vs X" pages, in nav order. */
export const VERSUS_KEYS = [
  "venice",
  "characterAi",
  "janitorAi",
  "nanoGpt",
  "freedomGpt",
  "gabAi",
  "uncensoredAi",
  "openRouter",
] as const satisfies readonly PlatformKey[];

export type VersusKey = (typeof VERSUS_KEYS)[number];

export const VERSUS_SLUGS: Record<VersusKey, string> = {
  venice: "unbottled-vs-venice",
  characterAi: "unbottled-vs-character-ai",
  janitorAi: "unbottled-vs-janitor-ai",
  nanoGpt: "unbottled-vs-nanogpt",
  freedomGpt: "unbottled-vs-freedomgpt",
  gabAi: "unbottled-vs-gab-ai",
  uncensoredAi: "unbottled-vs-uncensored-ai",
  openRouter: "unbottled-vs-openrouter",
};

/** Day each versus page first shipped (Article datePublished). */
export const VERSUS_PUBLISHED_DATES: Record<VersusKey, string> = {
  venice: COMPARE_PUBLISHED_DATE,
  characterAi: COMPARE_PUBLISHED_DATE,
  janitorAi: COMPARE_PUBLISHED_DATE,
  nanoGpt: COMPARE_PUBLISHED_DATE,
  freedomGpt: COMPARE_PUBLISHED_DATE,
  gabAi: "2026-11-24",
  uncensoredAi: "2026-11-24",
  openRouter: "2026-11-24",
};

/** Day this platform's facts were last verified on its own pages. */
export function platformCheckedDate(key: PlatformKey): string {
  return PLATFORMS[key].checkedDate ?? COMPARE_CHECKED_DATE;
}

export function versusPath(key: VersusKey): string {
  return `${COMPARE_BASE_PATH}/${VERSUS_SLUGS[key]}`;
}

export function isVersusKey(key: PlatformKey): key is VersusKey {
  return VERSUS_KEYS.some((versus) => versus === key);
}

/** Every comparison page with the day its facts were last verified (sitemap). */
export function listCompareEntries(): { path: string; lastmod: string }[] {
  return [
    { path: COMPARE_HUB_PATH, lastmod: COMPARE_LATEST_CHECK_DATE },
    ...VERSUS_KEYS.map((key) => ({
      path: versusPath(key),
      lastmod: platformCheckedDate(key),
    })),
  ];
}
