/**
 * Blog post registry - one place for slug, publication date and index order.
 * Dates are the day each post first shipped (first commit of its page).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

export const BLOG_POST_DATES = {
  "freedomgpt-alternatives": "2026-11-24",
  "gab-ai-alternatives": "2026-11-24",
  "nofiltergpt-alternatives": "2026-11-23",
  "deepseek-uncensored": "2026-11-22",
  "grok-alternative": "2026-11-22",
  "claude-without-filters": "2026-11-22",
  "openrouter-alternatives": "2026-11-22",
  "best-uncensored-llm": "2026-11-22",
  "uncensored-ai-writer": "2026-11-22",
  "unbiased-ai-chatbot": "2026-11-22",
  "ai-chat-no-sign-up": "2026-11-22",
  "uncensored-llm-without-gpu": "2026-11-21",
  "uncensored-llm-api": "2026-11-21",
  "chatgpt-jailbreak-alternative": "2026-11-21",
  "venice-ai-alternatives": "2026-11-21",
  "character-ai-alternatives": "2026-11-19",
  "abliterated-vs-uncensored-models": "2026-11-19",
  "uncensored-ai-image-generator": "2026-11-17",
  "ai-roleplay-without-filter": "2026-11-17",
  "ai-music-and-voice-generators": "2026-11-16",
  "ai-video-generators-compared": "2026-11-15",
  "openai-anthropic-compatible-api": "2026-11-15",
  "chatgpt-alternative-without-filters": "2026-11-13",
  "unbottled-api-in-coding-tools": "2026-11-12",
  "uncensored-models-what-each-is-good-at": "2026-11-09",
  "model-refresh-uncensored-providers": "2026-11-07",
  "whats-new-november-2026": "2026-11-06",
  "hermes-thea-two-way-remote": "2026-11-06",
  "interactive-coding-agent": "2026-11-06",
  "e2e-tests-found-real-bugs": "2026-11-06",
  "whats-new-may-2026": "2026-05-04",
  "whats-new-april-2026": "2026-04-06",
  "one-endpoint-every-surface": "2026-04-03",
  "skill-sharing-economy": "2026-03-30",
  "referral-for-beginners": "2026-03-30",
  "referral-for-developers": "2026-03-30",
  "referral-for-affiliate-pros": "2026-03-30",
  "one-codebase-13-platforms": "2026-03-28",
  "type-checker-made-ai-stop-lying": "2026-03-28",
  "dead-trading-bot-to-monitoring-engine": "2026-03-28",
} as const;

export type BlogPostSlug = keyof typeof BLOG_POST_DATES;

const postDateFormatters = new Map<
  ReturnType<typeof getLanguageFromLocale>,
  Intl.DateTimeFormat
>();

/** "4 May 2026" / "4. Mai 2026" / "4 maja 2026" - UTC so SSR and client agree. */
export function formatPostDate(
  slug: BlogPostSlug,
  locale: CountryLanguage,
): string {
  const language = getLanguageFromLocale(locale);
  let formatter = postDateFormatters.get(language);
  if (formatter === undefined) {
    formatter = new Intl.DateTimeFormat(language, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    postDateFormatters.set(language, formatter);
  }
  return formatter.format(new Date(`${BLOG_POST_DATES[slug]}T00:00:00Z`));
}
