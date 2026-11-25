/**
 * Public model changelog view: turns the generated registry history
 * (src/generated/model-changelog, built by `vibe gen` from the git history of
 * the model registry files) into translated, display-ready rows for the
 * /models/changelog page, the "What changed" section on every model page and
 * the RSS feed. Pure + server-safe; all text is resolved here in the viewer's
 * locale, so the pages only render data.
 */

import type { AgentEnvAvailability } from "next-vibe/agent/env-availability";
import type {
  ModelChangelogContent,
  ModelChangelogEvent,
  ModelChangelogEventType,
  ModelChangelogModelType,
  ModelChangelogPriceChange,
} from "next-vibe/agent/models/model-changelog/types";
import {
  ContentLevel,
  type ContentLevelValue,
} from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { getLanguageFromLocale } from "next-vibe/core/i18n/core/language-utils";

import {
  MODEL_CHANGELOG_EVENTS,
  MODEL_CHANGELOG_TRACKING_START,
} from "@/generated/model-changelog";

import { scopedTranslation as changelogTranslation } from "../changelog/i18n";
import { scopedTranslation as modelsTranslation } from "../i18n";
import { listAllCatalogEntries } from "./model-catalog-entries";
import { toModelSlug } from "./model-facts";
import { modelHref, tierName } from "./model-format";

export {
  MODEL_CHANGELOG_FEED_PATH,
  MODEL_CHANGELOG_PATH,
} from "./model-changelog-paths";

/** Entries a model page shows before linking to the full changelog. */
export const MODEL_HISTORY_LIMIT = 8;

const CONTENT_LEVELS: Record<ModelChangelogContent, typeof ContentLevelValue> =
  {
    mainstream: ContentLevel.MAINSTREAM,
    open: ContentLevel.OPEN,
    uncensored: ContentLevel.UNCENSORED,
  };

export interface ChangelogLink {
  /** Lead-in text, e.g. "Replaced by" */
  prefix: string;
  name: string;
  /** Locale-prefixed model page; null when the model has no public page here. */
  href: string | null;
}

export interface ChangelogEntryView {
  /** Stable anchor id */
  id: string;
  /** YYYY-MM-DD */
  date: string;
  dateLabel: string;
  type: ModelChangelogEventType | "replaces";
  badge: string;
  /** Long label, e.g. "New model" (feed item titles) */
  title: string;
  name: string;
  /** Locale-prefixed model page; null when the model has no public page here. */
  href: string | null;
  /** "Chat", "Images", ... */
  typeLabel: string;
  content: typeof ContentLevelValue;
  summary: string;
  link: ChangelogLink | null;
}

export interface ChangelogMonthView {
  /** YYYY-MM */
  key: string;
  label: string;
  entries: ChangelogEntryView[];
}

export interface ChangelogPageView {
  months: ChangelogMonthView[];
  total: number;
  stats: { added: number; legacy: number; repriced: number };
  /** YYYY-MM-DD of the newest entry; null when empty */
  latestDate: string | null;
  latestDateLabel: string | null;
  trackingStart: string;
  trackingStartLabel: string;
}

export interface ModelHistoryView {
  entries: ChangelogEntryView[];
  /** Entries beyond MODEL_HISTORY_LIMIT, only on the full changelog */
  more: number;
  trackingStartLabel: string;
}

function parseDay(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function formatChangelogDate(
  date: string,
  locale: CountryLanguage,
): string {
  return new Intl.DateTimeFormat(getLanguageFromLocale(locale), {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parseDay(date));
}

function formatMonth(date: string, locale: CountryLanguage): string {
  return new Intl.DateTimeFormat(getLanguageFromLocale(locale), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDay(date));
}

function formatPercent(
  change: ModelChangelogPriceChange,
  locale: CountryLanguage,
): string {
  const ratio =
    change.from === 0 ? 1 : Math.abs(change.to - change.from) / change.from;
  return new Intl.NumberFormat(getLanguageFromLocale(locale), {
    style: "percent",
    maximumFractionDigits: ratio < 0.1 ? 1 : 0,
  }).format(ratio);
}

/** "type:modelId" → public page slug, for every model with a page here. */
function buildSlugIndex(
  availability: AgentEnvAvailability,
): Map<string, string> {
  const index = new Map<string, string>();
  const all = listAllCatalogEntries({ availability });
  for (const entries of Object.values(all)) {
    for (const entry of entries) {
      if (entry.slug !== null) {
        index.set(entry.key, entry.slug);
      }
    }
  }
  return index;
}

interface ViewContext {
  locale: CountryLanguage;
  slugs: Map<string, string>;
}

function hrefFor(
  ctx: ViewContext,
  type: ModelChangelogModelType,
  id: string,
): string | null {
  const slug = ctx.slugs.get(`${type}:${id}`);
  return slug === undefined ? null : modelHref(ctx.locale, slug);
}

function priceSummary(
  changes: readonly ModelChangelogPriceChange[],
  locale: CountryLanguage,
): string {
  const { t } = changelogTranslation.scopedT(locale);
  return changes
    .map((change) =>
      t(change.to > change.from ? "summary.priceUp" : "summary.priceDown", {
        metric: t(`metric.${change.metric}`),
        percent: formatPercent(change, locale),
      }),
    )
    .join(" · ");
}

function toEntryView(
  event: ModelChangelogEvent,
  ctx: ViewContext,
): ChangelogEntryView {
  const { locale } = ctx;
  const { t } = changelogTranslation.scopedT(locale);
  const { t: modelsT } = modelsTranslation.scopedT(locale);
  const typeLabel = modelsT(`catalog.types.${event.modelType}`);
  const content = CONTENT_LEVELS[event.content];
  let summary: string;
  let link: ChangelogLink | null = null;
  switch (event.type) {
    case "added":
      summary = t("summary.added", { tier: tierName(content, locale) });
      break;
    case "legacy":
      summary = t("summary.legacy");
      if (
        event.successorId !== undefined &&
        event.successorName !== undefined
      ) {
        link = {
          prefix: t("summary.replacedBy"),
          name: event.successorName,
          href: hrefFor(ctx, event.modelType, event.successorId),
        };
      }
      break;
    case "restored":
      summary = t("summary.restored");
      break;
    case "tier":
      summary = t("summary.tier", {
        from: tierName(
          CONTENT_LEVELS[event.fromContent ?? event.content],
          locale,
        ),
        to: tierName(content, locale),
      });
      break;
    case "repriced":
      summary = priceSummary(event.priceChanges ?? [], locale);
      break;
    case "removed":
      summary = t("summary.removed");
      break;
  }
  return {
    id: `${event.date}-${event.type}-${toModelSlug(event.modelId)}`,
    date: event.date,
    dateLabel: formatChangelogDate(event.date, locale),
    type: event.type,
    badge: t(`badge.${event.type}`),
    title: t(`title.${event.type}`),
    name: event.name,
    href: hrefFor(ctx, event.modelType, event.modelId),
    typeLabel,
    content,
    summary,
    link,
  };
}

/** The successor's side of a legacy event: "Took over from <old model>". */
function toReplacesView(
  event: ModelChangelogEvent,
  ctx: ViewContext,
): ChangelogEntryView {
  const { t } = changelogTranslation.scopedT(ctx.locale);
  const base = toEntryView(event, ctx);
  return {
    ...base,
    id: `${event.date}-replaces-${toModelSlug(event.modelId)}`,
    type: "replaces",
    badge: t("badge.replaces"),
    title: t("badge.replaces"),
    summary: "",
    link: { prefix: t("summary.replaces"), name: event.name, href: base.href },
  };
}

/** Every changelog entry as display rows, newest first, grouped by month. */
export function buildChangelogPageView(
  locale: CountryLanguage,
  availability: AgentEnvAvailability,
  events: readonly ModelChangelogEvent[] = MODEL_CHANGELOG_EVENTS,
): ChangelogPageView {
  const ctx: ViewContext = { locale, slugs: buildSlugIndex(availability) };
  const months: ChangelogMonthView[] = [];
  const stats = { added: 0, legacy: 0, repriced: 0 };
  for (const event of events) {
    if (
      event.type === "added" ||
      event.type === "legacy" ||
      event.type === "repriced"
    ) {
      stats[event.type] += 1;
    }
    const key = event.date.slice(0, 7);
    let month = months.at(-1);
    if (month?.key !== key) {
      month = { key, label: formatMonth(event.date, locale), entries: [] };
      months.push(month);
    }
    month.entries.push(toEntryView(event, ctx));
  }
  const latestDate = events[0]?.date ?? null;
  return {
    months,
    total: events.length,
    stats,
    latestDate,
    latestDateLabel:
      latestDate === null ? null : formatChangelogDate(latestDate, locale),
    trackingStart: MODEL_CHANGELOG_TRACKING_START,
    trackingStartLabel: formatChangelogDate(
      MODEL_CHANGELOG_TRACKING_START,
      locale,
    ),
  };
}

/** One model's own events plus the legacy models it replaced, newest first. */
export function buildModelHistoryView(
  locale: CountryLanguage,
  modelType: ModelChangelogModelType,
  slug: string,
  availability: AgentEnvAvailability,
  events: readonly ModelChangelogEvent[] = MODEL_CHANGELOG_EVENTS,
): ModelHistoryView {
  const ctx: ViewContext = { locale, slugs: buildSlugIndex(availability) };
  const entries: ChangelogEntryView[] = [];
  for (const event of events) {
    if (event.modelType !== modelType) {
      continue;
    }
    if (toModelSlug(event.modelId) === slug) {
      entries.push(toEntryView(event, ctx));
    } else if (
      event.type === "legacy" &&
      event.successorId !== undefined &&
      toModelSlug(event.successorId) === slug
    ) {
      entries.push(toReplacesView(event, ctx));
    }
  }
  return {
    entries: entries.slice(0, MODEL_HISTORY_LIMIT),
    more: Math.max(0, entries.length - MODEL_HISTORY_LIMIT),
    trackingStartLabel: formatChangelogDate(
      MODEL_CHANGELOG_TRACKING_START,
      locale,
    ),
  };
}

/** Newest entry date, for the sitemap lastmod. */
export function latestModelChangelogDate(): string | null {
  return MODEL_CHANGELOG_EVENTS[0]?.date ?? null;
}
