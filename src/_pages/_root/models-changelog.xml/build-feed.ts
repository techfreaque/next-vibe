/**
 * RSS 2.0 feed of the public model changelog. Pure: same entries and text as
 * /[locale]/models/changelog (model-changelog.ts), so the page and the feed
 * can never disagree. Unit-tested in build-feed.test.ts.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type { ModelChangelogEvent } from "next-vibe/agent/models/model-changelog/types";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import { configScopedTranslation } from "@/env/i18n";

import {
  buildChangelogPageView,
  type ChangelogEntryView,
  MODEL_CHANGELOG_FEED_PATH,
  MODEL_CHANGELOG_PATH,
} from "../../models/_shared/model-changelog";
import { scopedTranslation } from "../../models/changelog/i18n";

/** Items per feed; readers only need the recent tail. */
export const MODEL_CHANGELOG_FEED_LIMIT = 100;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function itemDescription(entry: ChangelogEntryView): string {
  const parts = [`${entry.typeLabel}.`];
  if (entry.summary.length > 0) {
    parts.push(entry.summary);
  }
  if (entry.link !== null) {
    parts.push(`${entry.link.prefix} ${entry.link.name}.`);
  }
  return parts.join(" ");
}

export function buildModelChangelogFeed(
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
  baseUrl: string,
  events?: readonly ModelChangelogEvent[],
): string {
  const base = baseUrl.replace(/\/+$/, "");
  const { t } = scopedTranslation.scopedT(locale);
  const { t: configT } = configScopedTranslation.scopedT(locale);
  const appName = configT("appName");
  const view = buildChangelogPageView(locale, availability, events);
  const pageUrl = `${base}/${locale}${MODEL_CHANGELOG_PATH}`;
  const selfUrl = `${base}${MODEL_CHANGELOG_FEED_PATH}?locale=${locale}`;
  const entries = view.months
    .flatMap((month) => month.entries)
    .slice(0, MODEL_CHANGELOG_FEED_LIMIT);

  const lines: string[] = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${escapeXml(t("feed.title", { appName }))}</title>`,
    `    <link>${escapeXml(pageUrl)}</link>`,
    `    <description>${escapeXml(t("feed.description", { appName }))}</description>`,
    `    <language>${escapeXml(getLanguageFromLocale(locale))}</language>`,
    `    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml"/>`,
  ];
  if (view.latestDate !== null) {
    lines.push(`    <lastBuildDate>${rfc822(view.latestDate)}</lastBuildDate>`);
  }
  for (const entry of entries) {
    const link = `${pageUrl}#${entry.id}`;
    lines.push(
      `    <item>`,
      `      <title>${escapeXml(`${entry.title}: ${entry.name}`)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(`model-changelog:${entry.id}`)}</guid>`,
      `      <pubDate>${rfc822(entry.date)}</pubDate>`,
      `      <category>${escapeXml(entry.badge)}</category>`,
      `      <description>${escapeXml(itemDescription(entry))}</description>`,
      `    </item>`,
    );
  }
  lines.push(`  </channel>`, `</rss>`, ``);
  return lines.join("\n");
}
