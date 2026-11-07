/**
 * Blog post registry - one place for slug, publication date and index order.
 * Dates are the day each post first shipped (first commit of its page).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

export const BLOG_POST_DATES = {
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

/** "4 May 2026" / "4. Mai 2026" / "4 maja 2026" - UTC so SSR and client agree. */
export function formatPostDate(
  slug: BlogPostSlug,
  locale: CountryLanguage,
): string {
  return new Intl.DateTimeFormat(getLanguageFromLocale(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${BLOG_POST_DATES[slug]}T00:00:00Z`));
}
