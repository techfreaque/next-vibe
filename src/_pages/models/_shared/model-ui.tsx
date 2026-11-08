"use client";

/**
 * Shared visual pieces for the public /models pages: tier badge, model icon
 * and the reserved sample-answers slot.
 */

import type { ContentLevelValue } from "next-vibe/agent/skills/enum";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { Icon } from "next-vibe/unified-ui/widgets/form-fields/icon-field/icon-component";
import type { JSX } from "react";

import { scopedTranslation as refusalScopedTranslation } from "next-vibe/agent/refusal-index/i18n";
import type { ModelStatsResponseOutput } from "next-vibe/agent/refusal-index/model/[modelId]/definition";
import { Link } from "next-vibe/ui/components/link";
import { H3, P } from "next-vibe/ui/components/typography";

import { PageSection } from "../../story/_shared/marketing";
import { scopedTranslation } from "../i18n";
import type { ModelFacts } from "./model-facts";
import { formatNumber, tierName, tierTone } from "./model-format";

export function TierBadge({
  content,
  locale,
  className,
}: {
  content: typeof ContentLevelValue;
  locale: CountryLanguage;
  className?: string;
}): JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tierTone(content),
        className,
      )}
    >
      {tierName(content, locale)}
    </Span>
  );
}

export function ModelIcon({
  facts,
  size = "md",
}: {
  facts: Pick<ModelFacts, "icon">;
  size?: "sm" | "md" | "lg";
}): JSX.Element {
  return (
    <Div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground",
        size === "sm" && "h-9 w-9",
        size === "md" && "h-11 w-11",
        size === "lg" && "h-14 w-14",
      )}
    >
      <Icon
        icon={facts.icon}
        className={cn(
          size === "sm" && "h-4 w-4",
          size === "md" && "h-5 w-5",
          size === "lg" && "h-7 w-7",
        )}
      />
    </Div>
  );
}

/**
 * Refusal Index block of a model page: the model's answered / hedged / refused
 * rates from the latest benchmark run plus the sample answers an admin approved.
 * Renders only an invisible marker while no published run covers this model -
 * never placeholder copy.
 */
export function SampleAnswersSlot({
  modelId,
  locale,
  stats,
}: {
  modelId: ModelFacts["id"];
  locale: CountryLanguage;
  stats: ModelStatsResponseOutput | null;
}): JSX.Element {
  if (stats === null || !stats.hasData || stats.judged === 0) {
    return (
      <Div
        className="hidden"
        data-slot="sample-answers"
        data-model-id={modelId}
      />
    );
  }
  const { t } = scopedTranslation.scopedT(locale);
  const { t: rt } = refusalScopedTranslation.scopedT(locale);
  const date =
    stats.runFinishedAt === null
      ? "-"
      : new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          new Date(stats.runFinishedAt),
        );
  const questionOf = (
    sample: ModelStatsResponseOutput["samples"][number],
  ): string =>
    (locale.startsWith("de")
      ? sample.questionDe
      : locale.startsWith("pl")
        ? sample.questionPl
        : null) ?? sample.questionEn;
  const pct = (value: number): string => `${formatNumber(value, locale)}%`;

  return (
    <PageSection
      tone="muted"
      label={t("refusal.heading")}
      title={t("refusal.heading")}
      intro={t("refusal.intro", { model: stats.name, date })}
    >
      <Div data-slot="sample-answers" data-model-id={modelId}>
        <Div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(
            [
              ["refused", stats.refusedPct, "text-destructive"],
              ["hedged", stats.hedgedPct, "text-warning"],
              ["answered", stats.answeredPct, "text-success"],
            ] as const
          ).map(([key, value, tone]) => (
            <Div
              key={key}
              data-refusal-stat={key}
              className="rounded-xl border border-border bg-card px-5 py-4"
            >
              <Div className={cn("text-3xl font-semibold tabular-nums", tone)}>
                {pct(value)}
              </Div>
              <Div className="mt-1 text-sm text-muted-foreground">
                {t(`refusal.${key}`)}
              </Div>
            </Div>
          ))}
        </Div>
        <P className="mt-4 text-sm text-muted-foreground">
          {stats.rank !== null &&
            `${t("refusal.rank", { rank: stats.rank, total: stats.rankedModels })}. `}
          {t("refusal.judged", { count: formatNumber(stats.judged, locale) })}
          {stats.trend !== null &&
            `. ${t("refusal.trend", { delta: `${stats.trend > 0 ? "+" : ""}${formatNumber(stats.trend, locale)}` })}`}
        </P>

        {stats.categoryBreakdown.length > 0 && (
          <Div className="mt-8">
            <H3 className="mb-3 text-base font-semibold">
              {t("refusal.categories")}
            </H3>
            <Div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
              {stats.categoryBreakdown.map((entry) => (
                <Div
                  key={entry.category}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <Span className="font-medium capitalize">
                    {entry.category}
                  </Span>
                  <Span className="tabular-nums text-muted-foreground">
                    {`${pct(entry.refusedPct)} / ${pct(entry.hedgedPct)} / ${pct(entry.answeredPct)}`}
                  </Span>
                </Div>
              ))}
            </Div>
          </Div>
        )}

        {stats.samples.length > 0 && (
          <Div className="mt-10" data-testid="refusal-samples">
            <H3 className="text-base font-semibold">
              {t("refusal.samplesHeading")}
            </H3>
            <P className="mb-4 mt-1 text-sm text-muted-foreground">
              {t("refusal.samplesIntro")}
            </P>
            <Div className="flex flex-col gap-4">
              {stats.samples.map((sample) => (
                <Div
                  key={sample.id}
                  className="rounded-xl border border-border bg-card p-4 md:p-5"
                >
                  <Div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                    <Span className="rounded-full border border-border px-2 py-0.5 capitalize">
                      {sample.category}
                    </Span>
                    <Span className="rounded-full border border-border px-2 py-0.5 font-semibold">
                      {rt(sample.verdict)}
                    </Span>
                  </Div>
                  <P className="m-0 text-sm font-semibold [overflow-wrap:anywhere]">
                    {questionOf(sample)}
                  </P>
                  <P className="mt-2 whitespace-pre-line text-sm text-muted-foreground [overflow-wrap:anywhere]">
                    {sample.answerExcerpt}
                  </P>
                  {sample.judgeReason !== "" && (
                    <P className="mt-2 text-xs text-muted-foreground">
                      {`${t("refusal.judge")}: ${sample.judgeReason}`}
                    </P>
                  )}
                </Div>
              ))}
            </Div>
          </Div>
        )}

        <Div className="mt-6">
          <Link
            href={`/${locale}/story/refusal-index`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("refusal.methodCta")}
          </Link>
        </Div>
      </Div>
    </PageSection>
  );
}
