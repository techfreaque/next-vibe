"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { KpiTile } from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle2 } from "next-vibe/ui/components/icons/CheckCircle2";
import { Span } from "next-vibe/ui/components/span";
import { H3, P } from "next-vibe/ui/components/typography";
import {
  type Context,
  createContext,
  type JSX,
  useContext,
  useEffect,
} from "react";

import { scopedTranslation as analyticsCopy } from "../analytics/i18n";
import type { CategorySummary } from "./category-summary";
import { formatDocDate, formatMoney } from "./format-money";

export type LandingCountsPublisher = (
  counts: readonly { alias: string; count: number }[],
) => void;

declare global {
  var __vibeLandingCountsContext:
    | Context<LandingCountsPublisher | null>
    | undefined;
}

/**
 * A category landing provides this so the summary it embeds can report record
 * counts for the landing's "Work with" shortcuts. HMR-stable identity.
 */
export const LandingCountsContext: Context<LandingCountsPublisher | null> =
  (globalThis.__vibeLandingCountsContext ??=
    createContext<LandingCountsPublisher | null>(null));

export function CategorySummaryPanel<TLabel extends string>({
  summary,
  locale,
  translate,
  onOpen,
  attentionTitle,
  clearLabel,
  unavailable,
  recentTitle,
  sectionName,
  emptyRecent,
  section,
}: {
  summary: CategorySummary<TLabel>;
  locale: CountryLanguage;
  translate: (key: TLabel, params?: { count: number }) => string;
  onOpen?: (
    drill: CategorySummary<TLabel>["attention"][number]["drill"],
  ) => void;
  attentionTitle: string;
  clearLabel: string;
  unavailable: string;
  recentTitle: string;
  sectionName?: string;
  emptyRecent?: string;
  section?: "metrics" | "attention" | "recent";
}): JSX.Element {
  const ui = analyticsCopy.scopedT(locale).t;
  const publishCounts = useContext(LandingCountsContext);
  const counts = summary.destinationCounts;
  useEffect(() => {
    if (publishCounts && counts?.length) {
      publishCounts(counts);
    }
  }, [publishCounts, counts]);
  const from = formatDocDate(summary.from, locale);
  const to = formatDocDate(summary.to, locale);
  const metrics = (
    <>
      {summary.kpis.map((metric) => {
        const target = metric.drill;
        // Tint a tile only when an alert points at that tile alone.
        const severity =
          target &&
          summary.kpis.filter((other) => other.drill?.alias === target.alias)
            .length === 1
            ? summary.attention.find(
                (alert) => alert.drill.alias === target.alias,
              )?.severity
            : undefined;
        const label = translate(metric.label);
        return (
          <KpiTile
            key={metric.label}
            wrapLabel
            label={metric.currency ? `${label} (${metric.currency})` : label}
            tone={
              severity === "danger"
                ? "negative"
                : severity === "warning"
                  ? "warning"
                  : "default"
            }
            value={metric.value}
            previous={metric.previous}
            invertDelta={metric.invertDelta}
            locale={locale}
            currency={metric.currency}
            format={metric.format === "money" ? "currency" : metric.format}
            sparkline={metric.sparkline}
            drillHint={target?.alias}
            className="min-w-0 gap-1.5 px-3 py-2.5 @md:gap-2 @md:px-4 @md:py-3 dark:[&_.text-destructive]:text-red-300 [&>span:nth-child(2)]:break-words [&>span:nth-child(2)]:text-lg @2xl:[&>span:nth-child(2)]:text-2xl [&_svg]:h-6 @md:[&_svg]:h-8"
            onClick={target && onOpen ? (): void => onOpen(target) : undefined}
          />
        );
      })}
    </>
  );
  const attention =
    summary.attentionAvailable && summary.attention.length === 0 ? (
      <Div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5">
        <CheckCircle2
          className="size-4 shrink-0 text-success"
          aria-hidden="true"
        />
        <P className="text-sm text-muted-foreground">{clearLabel}</P>
      </Div>
    ) : (
      <Div className="space-y-1 rounded-lg border bg-card p-3">
        <H3 className="border-0 text-sm font-semibold">{attentionTitle}</H3>
        {summary.attention.length ? (
          summary.attention.map((alert) => {
            const text = translate(alert.label, { count: alert.count });
            return (
              <Div
                key={alert.label}
                className="flex min-w-0 items-center gap-2"
              >
                <Span
                  aria-hidden="true"
                  className={
                    alert.severity === "danger"
                      ? "h-2 w-2 shrink-0 rounded-full bg-destructive"
                      : alert.severity === "warning"
                        ? "h-2 w-2 shrink-0 rounded-full bg-warning"
                        : "h-2 w-2 shrink-0 rounded-full bg-info"
                  }
                />
                <Div className="min-w-0 flex-1">
                  {sectionName && (
                    <P className="text-xs font-medium text-muted-foreground">
                      {sectionName}
                    </P>
                  )}
                  <P className="text-sm">{text}</P>
                </Div>
                {onOpen && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    aria-label={ui("analytics.reviewItem", { item: text })}
                    onClick={() => onOpen(alert.drill)}
                  >
                    {ui("analytics.review")}
                  </Button>
                )}
              </Div>
            );
          })
        ) : (
          <P className="text-sm text-muted-foreground">
            {summary.attentionAvailable ? clearLabel : unavailable}
          </P>
        )}
      </Div>
    );
  const recent = (
    <Div className="rounded-lg border bg-card p-3">
      <H3 className="border-0 pb-1 text-sm font-semibold">{recentTitle}</H3>
      {summary.recent.length === 0 && emptyRecent && (
        <P className="pt-1 text-sm text-muted-foreground">{emptyRecent}</P>
      )}
      <Div className="flex flex-col divide-y">
        {summary.recent.map((row) => {
          const text = row.label ? translate(row.label) : row.title;
          const amount =
            row.detail?.kind === "money"
              ? formatMoney(row.detail.amount, row.detail.currency, locale)
              : undefined;
          const context = [
            row.subject,
            row.detail?.kind === "name" ? row.detail.value : undefined,
          ]
            .filter(Boolean)
            .join(" · ");
          const time = new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(row.at));
          const body = (
            <>
              <Span className="min-w-0 break-words text-sm font-medium">
                {text}
              </Span>
              <Span className="shrink-0 whitespace-nowrap text-end text-sm font-semibold tabular-nums">
                {amount}
              </Span>
              <Span className="min-w-0 break-words text-xs text-muted-foreground">
                {context}
              </Span>
              <Span className="shrink-0 whitespace-nowrap text-end text-xs tabular-nums text-muted-foreground">
                {time}
              </Span>
            </>
          );
          const rowClass =
            "grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3 gap-y-0.5 py-2 text-start";
          return onOpen ? (
            <Button
              key={row.at + row.drill.alias + (row.subject ?? "")}
              type="button"
              variant="ghost"
              size="unset"
              className={`${rowClass} h-auto rounded-none px-1 font-normal whitespace-normal hover:bg-muted/50`}
              onClick={() => onOpen(row.drill)}
            >
              {body}
            </Button>
          ) : (
            <Div
              key={row.at + row.drill.alias + (row.subject ?? "")}
              className={`${rowClass} px-1`}
            >
              {body}
            </Div>
          );
        })}
      </Div>
    </Div>
  );
  if (section === "recent") {
    return recent;
  }
  if (section === "metrics") {
    return metrics;
  }
  if (section === "attention") {
    return attention;
  }
  return (
    <Div className="min-w-0 space-y-3 @md:space-y-4">
      <P className="text-xs text-muted-foreground">
        {from === to ? from : `${from} – ${to}`}
      </P>
      <Div
        className={
          summary.kpis.length === 3
            ? "grid grid-cols-2 gap-2 [&>:last-child]:col-span-2 @2xl:grid-cols-3 @2xl:[&>:last-child]:col-span-1"
            : "grid grid-cols-2 gap-2 @2xl:grid-cols-4"
        }
      >
        {metrics}
      </Div>
      {attention}
      {(summary.recent.length > 0 || emptyRecent) && recent}
    </Div>
  );
}
