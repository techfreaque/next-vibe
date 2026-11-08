"use client";

import { CONTENT_TIER_ORDER } from "@/_pages/models/_shared/model-facts";
import {
  formatNumber,
  modelHref,
  tierName,
} from "@/_pages/models/_shared/model-format";
import { TierBadge } from "@/_pages/models/_shared/model-ui";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "next-vibe/ui/components/table";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import { type JSX, useMemo, useState } from "react";

import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { Info } from "next-vibe/ui/components/icons/Info";
import {
  Callout,
  Cta,
  CtaBand,
  FeatureCard,
  FeatureGrid,
  PageHero,
  PageSection,
  StatGrid,
} from "../_shared/marketing";
import { scopedTranslation } from "./i18n";
import type { RefusalIndexPageData } from "./page";

type SortKey = "refused" | "hedged" | "answered" | "judged";
type SortDir = "asc" | "desc";

type ModelRow = NonNullable<
  RefusalIndexPageData["leaderboard"]
>["models"][number];

function rateOf(row: ModelRow, key: SortKey): number {
  if (key === "refused") {
    return row.refusedPct;
  }
  if (key === "hedged") {
    return row.hedgedPct;
  }
  if (key === "answered") {
    return row.answeredPct;
  }
  return row.judged;
}

function RateBar({ row }: { row: ModelRow }): JSX.Element {
  return (
    <Div
      className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
      ariaLabel={`${String(row.answeredPct)} / ${String(row.hedgedPct)} / ${String(row.refusedPct)}`}
    >
      <Div style={{ flexGrow: row.answeredPct, flexBasis: 0 }}>
        <Div className="h-full bg-success" />
      </Div>
      <Div style={{ flexGrow: row.hedgedPct, flexBasis: 0 }}>
        <Div className="h-full bg-warning" />
      </Div>
      <Div style={{ flexGrow: row.refusedPct, flexBasis: 0 }}>
        <Div className="h-full bg-destructive" />
      </Div>
    </Div>
  );
}

/** URL slug of a model id (same rule as the /models pages). */
function slugOf(modelId: string): string {
  return modelId.toLowerCase().replaceAll(/[._]+/g, "-");
}

export function RefusalIndexClient({
  locale,
  leaderboard,
}: RefusalIndexPageData): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const [sortKey, setSortKey] = useState<SortKey>("refused");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const models = useMemo(() => leaderboard?.models ?? [], [leaderboard]);
  const sorted = useMemo(
    () =>
      models.toSorted((a, b) => {
        const diff = rateOf(a, sortKey) - rateOf(b, sortKey);
        return (
          (sortDir === "asc" ? diff : -diff) || a.name.localeCompare(b.name)
        );
      }),
    [models, sortKey, sortDir],
  );

  const categoryRows = useMemo(() => {
    const names = leaderboard?.categories ?? [];
    return names.map((category) => {
      const perTier = CONTENT_TIER_ORDER.map((tier) => {
        let judged = 0;
        let refused = 0;
        for (const model of models) {
          if (model.tier !== tier) {
            continue;
          }
          const entry = model.categoryBreakdown.find(
            (item) => item.category === category,
          );
          if (entry) {
            judged += entry.judged;
            refused += entry.refusedPct * entry.judged;
          }
        }
        return { tier, rate: judged > 0 ? refused / judged : null };
      });
      return { category, perTier };
    });
  }, [leaderboard, models]);

  const toggleSort = (key: SortKey): void => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "answered" || key === "judged" ? "desc" : "asc");
    }
  };

  const pct = (value: number): string => `${formatNumber(value, locale)}%`;
  const dateText =
    leaderboard?.runFinishedAt !== null &&
    leaderboard?.runFinishedAt !== undefined
      ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
          new Date(leaderboard.runFinishedAt),
        )
      : "-";

  const header = (key: SortKey, label: string): JSX.Element => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={(): void => toggleSort(key)}
      className={cn(
        "h-8 px-1 text-xs font-semibold uppercase tracking-wide",
        sortKey === key ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      {sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
    </Button>
  );

  return (
    <Div className="min-h-screen bg-background" data-testid="refusal-index">
      <PageHero
        eyebrow={t("hero.eyebrow")}
        eyebrowIcon={BarChart3}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        actions={
          <>
            <Cta href="#leaderboard" label={t("hero.ctaPrimary")} />
            <Cta
              href={`/${locale}/models`}
              label={t("hero.ctaSecondary")}
              variant="secondary"
            />
          </>
        }
      >
        {leaderboard?.hasData && (
          <StatGrid
            items={[
              {
                value: formatNumber(leaderboard.modelCount, locale),
                label: t("stats.models"),
              },
              {
                value: formatNumber(leaderboard.questionCount, locale),
                label: t("stats.questions"),
              },
              {
                value: pct(leaderboard.overall.refusedPct),
                label: t("stats.refusal"),
              },
              { value: dateText, label: t("stats.updated") },
            ]}
          />
        )}
      </PageHero>

      {!leaderboard?.hasData && (
        <PageSection narrow>
          <Callout icon={Info} tone="neutral">
            <P className="m-0 font-semibold">{t("empty.title")}</P>
            <P className="m-0 mt-1">{t("empty.body")}</P>
          </Callout>
        </PageSection>
      )}

      {leaderboard?.hasData && (
        <>
          <PageSection
            id="leaderboard"
            label={t("leaderboard.label")}
            title={t("leaderboard.title")}
            intro={t("leaderboard.intro")}
          >
            <Div className="flex flex-col gap-10">
              {CONTENT_TIER_ORDER.map((tier) => {
                const rows = sorted.filter((row) => row.tier === tier);
                if (rows.length === 0) {
                  return null;
                }
                return (
                  <Div key={tier} data-tier={tier}>
                    <Div className="mb-3 flex items-center gap-3">
                      <TierBadge content={tier} locale={locale} />
                      <Span className="text-sm text-muted-foreground">
                        {`${tierName(tier, locale)} (${String(rows.length)})`}
                      </Span>
                    </Div>
                    <Div className="overflow-x-auto rounded-xl border border-border bg-card">
                      <Table className="w-full min-w-[640px] text-sm">
                        <TableHeader>
                          <TableRow className="border-b border-border text-left">
                            <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              {t("leaderboard.model")}
                            </TableHead>
                            <TableHead className="px-3 py-2">
                              {header("refused", t("leaderboard.refused"))}
                            </TableHead>
                            <TableHead className="px-3 py-2">
                              {header("hedged", t("leaderboard.hedged"))}
                            </TableHead>
                            <TableHead className="px-3 py-2">
                              {header("answered", t("leaderboard.answered"))}
                            </TableHead>
                            <TableHead className="hidden px-3 py-2 sm:table-cell">
                              <Span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {t("leaderboard.trend")}
                              </Span>
                            </TableHead>
                            <TableHead className="hidden px-3 py-2 md:table-cell">
                              {header("judged", t("leaderboard.answers"))}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border">
                          {rows.map((row) => (
                            <TableRow
                              key={row.modelId}
                              data-model={row.modelId}
                            >
                              <TableCell className="px-4 py-3">
                                <Link
                                  href={modelHref(locale, slugOf(row.modelId))}
                                  className="font-medium text-foreground underline-offset-4 hover:underline"
                                >
                                  {row.name}
                                </Link>
                                <Div className="mt-2 max-w-[220px]">
                                  <RateBar row={row} />
                                </Div>
                              </TableCell>
                              <TableCell className="px-3 py-3 font-semibold tabular-nums text-destructive">
                                {pct(row.refusedPct)}
                              </TableCell>
                              <TableCell className="px-3 py-3 tabular-nums text-warning">
                                {pct(row.hedgedPct)}
                              </TableCell>
                              <TableCell className="px-3 py-3 tabular-nums text-success">
                                {pct(row.answeredPct)}
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 tabular-nums text-muted-foreground sm:table-cell">
                                {row.trend === null
                                  ? t("leaderboard.noTrend")
                                  : `${row.trend > 0 ? "+" : ""}${formatNumber(row.trend, locale)} ${t("leaderboard.points")}`}
                              </TableCell>
                              <TableCell className="hidden px-3 py-3 tabular-nums text-muted-foreground md:table-cell">
                                {formatNumber(row.judged, locale)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Div>
                  </Div>
                );
              })}
            </Div>
          </PageSection>

          {categoryRows.length > 0 && (
            <PageSection
              tone="muted"
              label={t("categories.label")}
              title={t("categories.title")}
              intro={t("categories.intro")}
            >
              <Div className="overflow-x-auto rounded-xl border border-border bg-card">
                <Table className="w-full min-w-[480px] text-sm">
                  <TableHeader>
                    <TableRow className="border-b border-border text-left">
                      <TableHead className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("categories.category")}
                      </TableHead>
                      {CONTENT_TIER_ORDER.map((tier) => (
                        <TableHead
                          key={tier}
                          className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {tierName(tier, locale)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-border">
                    {categoryRows.map((row) => (
                      <TableRow key={row.category} data-category={row.category}>
                        <TableCell className="px-4 py-3 font-medium capitalize">
                          {row.category}
                        </TableCell>
                        {row.perTier.map((cell) => (
                          <TableCell
                            key={cell.tier}
                            className="px-3 py-3 tabular-nums"
                          >
                            {cell.rate === null ? "-" : pct(cell.rate)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Div>
            </PageSection>
          )}
        </>
      )}

      <PageSection
        label={t("method.label")}
        title={t("method.title")}
        intro={t("method.intro")}
      >
        <FeatureGrid columns={2}>
          <FeatureCard title={t("method.questions.title")}>
            {t("method.questions.body")}
          </FeatureCard>
          <FeatureCard title={t("method.setup.title")}>
            {t("method.setup.body")}
          </FeatureCard>
          <FeatureCard title={t("method.judge.title")}>
            {t("method.judge.body", {
              judge: leaderboard?.judgeModelName ?? "-",
              version: leaderboard?.judgePromptVersion ?? "-",
            })}
          </FeatureCard>
          <FeatureCard title={t("method.run.title")}>
            {t("method.run.body", {
              date: dateText,
              models: formatNumber(leaderboard?.modelCount ?? 0, locale),
              questions: formatNumber(leaderboard?.questionCount ?? 0, locale),
            })}
          </FeatureCard>
        </FeatureGrid>
        <Div className="mt-8 max-w-3xl">
          <Callout icon={Info} tone="neutral">
            {t("method.caveat")}
          </Callout>
        </Div>
      </PageSection>

      <CtaBand
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        actions={<Cta href={`/${locale}/models`} label={t("cta.action")} />}
      />
    </Div>
  );
}
