/**
 * Server-rendered markup for the model changelog: the dated entry rows, the
 * month-grouped list on /models/changelog and the "What changed" section on
 * every model page. Plain markup, no state or effects; every string is
 * resolved in the page loader (model-changelog.ts) and passed in as data.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Li } from "next-vibe/ui/components/li";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H2, P } from "next-vibe/ui/components/typography";
import { Ul } from "next-vibe/ui/components/ul";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import type { JSX } from "react";

import {
  CardLink,
  CONTAINER,
  PageSection,
} from "../../story/_shared/marketing";
import { scopedTranslation as changelogTranslation } from "../changelog/i18n";
import type {
  ChangelogEntryView,
  ChangelogMonthView,
  ModelHistoryView,
} from "./model-changelog";
import { MODEL_CHANGELOG_PATH } from "./model-changelog-paths";
import { TierBadge } from "./model-ui";

const BADGE_TONES: Record<ChangelogEntryView["type"], string> = {
  added: "border-success/30 bg-success/10 text-success",
  restored: "border-success/30 bg-success/10 text-success",
  replaces: "border-primary/25 bg-primary/10 text-primary",
  legacy: "border-border bg-muted text-muted-foreground",
  removed: "border-destructive/30 bg-destructive/10 text-destructive",
  repriced: "border-info/30 bg-info/10 text-info",
  tier: "border-warning/30 bg-warning/10 text-warning",
};

function EventBadge({ entry }: { entry: ChangelogEntryView }): JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_TONES[entry.type],
      )}
    >
      {entry.badge}
    </Span>
  );
}

function ModelName({ entry }: { entry: ChangelogEntryView }): JSX.Element {
  return entry.href === null ? (
    <Span className="font-semibold text-foreground">{entry.name}</Span>
  ) : (
    <Link
      href={entry.href}
      className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
    >
      {entry.name}
    </Link>
  );
}

function EntryDetail({
  entry,
}: {
  entry: ChangelogEntryView;
}): JSX.Element | null {
  if (entry.summary.length === 0 && entry.link === null) {
    return null;
  }
  return (
    <P className="m-0 text-sm leading-relaxed text-pretty text-muted-foreground">
      {entry.summary}
      {entry.link !== null && (
        <>
          {entry.summary.length > 0 ? " " : null}
          {entry.link.prefix}{" "}
          {entry.link.href === null ? (
            <Span className="font-medium text-foreground">
              {entry.link.name}
            </Span>
          ) : (
            <Link
              href={entry.link.href}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {entry.link.name}
            </Link>
          )}
        </>
      )}
    </P>
  );
}

/**
 * One dated row. `showModel` is off on a model's own page, where the model
 * name would repeat the page title.
 */
export function ChangelogEntryRow({
  entry,
  locale,
  showModel = true,
}: {
  entry: ChangelogEntryView;
  locale: CountryLanguage;
  showModel?: boolean;
}): JSX.Element {
  return (
    <Li
      id={entry.id}
      className="flex scroll-mt-24 flex-col gap-2 px-4 py-4 sm:flex-row sm:gap-6 sm:px-5"
    >
      <Span className="shrink-0 pt-0.5 text-sm font-medium text-muted-foreground tabular-nums sm:w-28">
        {entry.dateLabel}
      </Span>
      <Div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <EventBadge entry={entry} />
          {showModel && <ModelName entry={entry} />}
          {showModel && (
            <Span className="text-sm text-muted-foreground">
              {entry.typeLabel}
            </Span>
          )}
          {showModel && entry.type !== "repriced" && (
            <TierBadge content={entry.content} locale={locale} />
          )}
        </Div>
        {/* The tier badge already says it for new models in the full list. */}
        {!(showModel && entry.type === "added") && (
          <EntryDetail entry={entry} />
        )}
      </Div>
    </Li>
  );
}

function EntryList({
  entries,
  locale,
  showModel = true,
}: {
  entries: readonly ChangelogEntryView[];
  locale: CountryLanguage;
  showModel?: boolean;
}): JSX.Element {
  return (
    <Ul className="m-0 list-none divide-y divide-border overflow-hidden rounded-xl border border-border bg-card p-0">
      {entries.map((entry) => (
        <ChangelogEntryRow
          key={entry.id}
          entry={entry}
          locale={locale}
          showModel={showModel}
        />
      ))}
    </Ul>
  );
}

/** The full changelog, one block per month, newest first. */
export function ModelChangelogList({
  months,
  locale,
}: {
  months: readonly ChangelogMonthView[];
  locale: CountryLanguage;
}): JSX.Element {
  const { t } = changelogTranslation.scopedT(locale);
  if (months.length === 0) {
    return (
      <Div className={`${CONTAINER} py-12`}>
        <P className="m-0 text-muted-foreground">{t("list.empty")}</P>
      </Div>
    );
  }
  return (
    <Div
      data-testid="model-changelog"
      className={`${CONTAINER} flex flex-col gap-12 py-12 md:py-16`}
    >
      {months.map((month) => (
        <Div key={month.key} id={month.key} className="scroll-mt-20">
          <Div className="mb-4 flex items-baseline justify-between gap-4">
            <H2 className="border-none pb-0 text-2xl font-semibold tracking-tight md:text-3xl">
              {month.label}
            </H2>
            <Span className="shrink-0 text-sm text-muted-foreground">
              {t("list.count", { count: month.entries.length })}
            </Span>
          </Div>
          <EntryList entries={month.entries} locale={locale} />
        </Div>
      ))}
    </Div>
  );
}

/** "What changed" on a model page: its dated entries plus a link to the full log. */
export function ModelHistorySection({
  locale,
  model,
  history,
}: {
  locale: CountryLanguage;
  model: string;
  history: ModelHistoryView;
}): JSX.Element {
  const { t } = changelogTranslation.scopedT(locale);
  const hasEntries = history.entries.length > 0;
  return (
    <PageSection
      id="what-changed"
      title={t("model.heading")}
      intro={
        hasEntries
          ? t("model.intro", { model })
          : t("model.none", { model, date: history.trackingStartLabel })
      }
      narrow
    >
      <Div data-testid="model-history" className="flex flex-col gap-4">
        {hasEntries && (
          <EntryList
            entries={history.entries}
            locale={locale}
            showModel={false}
          />
        )}
        <Div>
          <CardLink
            href={`/${locale}${MODEL_CHANGELOG_PATH}`}
            label={t("model.link")}
          />
        </Div>
      </Div>
    </PageSection>
  );
}
