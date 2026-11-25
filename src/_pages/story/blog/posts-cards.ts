/**
 * Blog post cards - title, category, excerpt and read time per post, in index
 * order (newest first). One source for the blog index, the BlogPosting
 * structured data on each post and /llms.txt.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";

import { FEEDBACK_REWARD_CREDITS } from "@/credits/constants";

import { scopedTranslation } from "./i18n";
import { type BlogPostSlug, formatPostDate } from "./posts-meta";

/** i18n key under `posts.*` for each post, in display order. */
const POST_CARD_KEYS = [
  ["claude-alternatives", "claudeAlternatives"],
  ["nanogpt-alternatives", "nanoGptAlternatives"],
  ["sillytavern-alternatives", "sillyTavernAlternatives"],
  ["crushon-ai-alternatives", "crushOnAiAlternatives"],
  ["chub-ai-alternatives", "chubAiAlternatives"],
  ["poe-alternatives", "poeAlternatives"],
  ["typingmind-alternatives", "typingMindAlternatives"],
  ["janitor-ai-alternatives", "janitorAiAlternatives"],
  ["free-uncensored-ai", "freeUncensoredAi"],
  ["freedomgpt-alternatives", "freedomGptAlternatives"],
  ["gab-ai-alternatives", "gabAiAlternatives"],
  ["nofiltergpt-alternatives", "noFilterGptAlternatives"],
  ["deepseek-uncensored", "deepseekUncensored"],
  ["grok-alternative", "grokAlternative"],
  ["claude-without-filters", "claudeWithoutFilters"],
  ["openrouter-alternatives", "openrouterAlternatives"],
  ["best-uncensored-llm", "bestUncensoredLlm"],
  ["uncensored-ai-writer", "uncensoredWriter"],
  ["unbiased-ai-chatbot", "unbiasedChatbot"],
  ["ai-chat-no-sign-up", "noSignUp"],
  ["uncensored-llm-without-gpu", "noGpu"],
  ["uncensored-llm-api", "uncensoredApi"],
  ["chatgpt-jailbreak-alternative", "jailbreak"],
  ["venice-ai-alternatives", "veniceAlternatives"],
  ["character-ai-alternatives", "characterAiAlternatives"],
  ["abliterated-vs-uncensored-models", "abliteratedExplained"],
  ["uncensored-ai-image-generator", "imageGenerators"],
  ["ai-roleplay-without-filter", "roleplayWithoutFilter"],
  ["ai-music-and-voice-generators", "musicVoice"],
  ["ai-video-generators-compared", "videoGenerators"],
  ["openai-anthropic-compatible-api", "compatibleApi"],
  ["chatgpt-alternative-without-filters", "chatgptAlternative"],
  ["unbottled-api-in-coding-tools", "codingTools"],
  ["uncensored-models-what-each-is-good-at", "uncensoredGuide"],
  ["model-refresh-uncensored-providers", "modelRefresh"],
  ["whats-new-november-2026", "whatsNewNovember2026"],
  ["hermes-thea-two-way-remote", "hermesThea"],
  ["interactive-coding-agent", "codingAgent"],
  ["e2e-tests-found-real-bugs", "e2eTests"],
  ["whats-new-may-2026", "whatsNewMay2026"],
  ["whats-new-april-2026", "whatsNewApril2026"],
  ["one-endpoint-every-surface", "oneEndpoint"],
  ["skill-sharing-economy", "skillSharingEconomy"],
  ["one-codebase-13-platforms", "oneCodebase"],
  ["type-checker-made-ai-stop-lying", "typeChecker"],
  ["dead-trading-bot-to-monitoring-engine", "tradingBot"],
  ["referral-for-beginners", "referralBeginners"],
  ["referral-for-developers", "referralDevelopers"],
  ["referral-for-affiliate-pros", "referralAffiliatePros"],
] as const satisfies readonly (readonly [BlogPostSlug, string])[];

/** Every post slug, newest first. */
export const BLOG_POST_SLUGS: readonly BlogPostSlug[] = POST_CARD_KEYS.map(
  ([slug]) => slug,
);

/** Compile-time guard: a post added to posts-meta must get a card here. */
type MissingCard = Exclude<BlogPostSlug, (typeof POST_CARD_KEYS)[number][0]>;
const EVERY_POST_HAS_A_CARD: [MissingCard] extends [never] ? true : never =
  true;
void EVERY_POST_HAS_A_CARD;

export interface BlogPostCard {
  slug: BlogPostSlug;
  /** Locale-less path, e.g. "/story/blog/<slug>". */
  path: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  /** Pre-formatted publication date. */
  date: string;
}

const postCardKeys = new Map<BlogPostSlug, (typeof POST_CARD_KEYS)[number][1]>(
  POST_CARD_KEYS,
);

function postCard(
  slug: BlogPostSlug,
  key: (typeof POST_CARD_KEYS)[number][1],
  locale: CountryLanguage,
  t: ReturnType<typeof scopedTranslation.scopedT>["t"],
): BlogPostCard {
  return {
    slug,
    path: `/story/blog/${slug}`,
    title: t(`posts.${key}.title`),
    category: t(`posts.${key}.category`),
    excerpt: t(`posts.${key}.excerpt`, { credits: FEEDBACK_REWARD_CREDITS }),
    readTime: t(`posts.${key}.readTime`),
    date: formatPostDate(slug, locale),
  };
}

/** Every blog post card for a locale, newest first. */
export function listBlogPostCards(locale: CountryLanguage): BlogPostCard[] {
  const { t } = scopedTranslation.scopedT(locale);
  return POST_CARD_KEYS.map(([slug, key]) => postCard(slug, key, locale, t));
}

export function getBlogPostCard(
  slug: BlogPostSlug,
  locale: CountryLanguage,
): BlogPostCard | undefined {
  const key = postCardKeys.get(slug);
  return key === undefined
    ? undefined
    : postCard(slug, key, locale, scopedTranslation.scopedT(locale).t);
}
