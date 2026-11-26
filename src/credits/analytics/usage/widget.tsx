/**
 * Credit Usage Report widget (web, CLI, MCP, native via the analytics components).
 */

"use client";

import {
  type AnalyticsFilterChip,
  AnalyticsSegmented,
  AnalyticsToolbar,
  BreakdownTable,
  type BreakdownTableRow,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AnalyticsRange } from "next-vibe/unified-ui/analytics/enum";
import { formatAnalyticsValue } from "next-vibe/unified-ui/analytics/format";
import type { BreakdownRow } from "next-vibe/unified-ui/analytics/schema";
import { NavigateButtonWidget } from "next-vibe/unified-ui/widgets/interactive/navigate-button/widget";
import type { JSX } from "react";

import { ReportAnalyticsPeriod } from "@/finance/report-analytics-period";

import type definitions from "./definition";
import {
  UsageActor,
  type UsageActorValue,
  UsageCreditKind,
  type UsageCreditKindValue,
} from "./enum";

const DAY_MS = 86_400_000;
const FEATURE_PREFIX = "feature:";
const FUNDING_COLOR: Record<string, 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8> = {
  allowance: 2,
  freeBonus: 6,
  freeUnknown: 8,
  purchased: 1,
  subscription: 3,
  referral: 5,
  adminGrant: 4,
  packUnknown: 7,
};

function bucketEnd(start: string, bucket: "day" | "week" | "month"): string {
  const date = new Date(`${start}T00:00:00.000Z`);
  if (bucket === "day") {
    return start;
  }
  if (bucket === "week") {
    return new Date(date.getTime() + 6 * DAY_MS).toISOString().slice(0, 10);
  }
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1) - DAY_MS,
  )
    .toISOString()
    .slice(0, 10);
}

const ACTORS = [UsageActor.ALL, UsageActor.USERS, UsageActor.GUESTS] as const;
const KINDS = [
  UsageCreditKind.ALL,
  UsageCreditKind.FREE,
  UsageCreditKind.PACK,
  UsageCreditKind.PURCHASED,
  UsageCreditKind.SUBSCRIPTION,
  UsageCreditKind.GRANTS,
] as const;

export function CreditUsageReportWidget({
  field: { children },
}: {
  field: typeof definitions.GET.fields;
}): JSX.Element {
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definitions.GET>();
  const form = useWidgetForm<typeof definitions.GET>();
  const onSubmit = useWidgetOnSubmit();
  const value = useWidgetValue<typeof definitions.GET>();
  const responseOnly = useWidgetResponseOnly();
  const isInteractive = useWidgetIsInteractive() && !responseOnly;
  const { endpointMutations } = useWidgetContext();
  const navigate = useRelatedEntityNavigation();
  const isLoading = endpointMutations?.read?.isFetching ?? false;

  // Interactive surfaces follow the form; CLI/MCP show what the server applied.
  const applied = isInteractive ? undefined : value?.appliedFilters;
  const actor = applied?.actor ?? form.watch("actor") ?? UsageActor.ALL;
  const creditKind =
    applied?.creditKind ?? form.watch("creditKind") ?? UsageCreditKind.ALL;
  const model = applied ? (applied.model ?? undefined) : form.watch("model");
  const feature = applied
    ? (applied.feature ?? undefined)
    : form.watch("feature");
  const provider = applied
    ? (applied.provider ?? undefined)
    : form.watch("provider");
  const includeInternal =
    applied?.includeInternal ?? form.watch("includeInternal") ?? false;

  /** Ledger feature id -> label in the viewer's locale (server-translated). */
  const featureName = (id: string): string =>
    id === "chat" ? t("widget.label.chat") : (value?.featureLabels[id] ?? id);

  const submit = (): void => {
    onSubmit?.();
  };
  const setActor = (next: typeof UsageActorValue): void => {
    form.setValue("actor", next, { shouldDirty: true });
    submit();
  };
  const setKind = (next: typeof UsageCreditKindValue): void => {
    form.setValue("creditKind", next, { shouldDirty: true });
    submit();
  };
  const setText = (
    key: "model" | "feature" | "provider",
    next: string | undefined,
  ): void => {
    form.setValue(key, next, { shouldDirty: true });
    submit();
  };
  const setInternal = (next: boolean): void => {
    form.setValue("includeInternal", next, { shouldDirty: true });
    submit();
  };
  const drillBucket = (start: string): void => {
    if (!value) {
      return;
    }
    form.setValue("range", AnalyticsRange.CUSTOM, { shouldDirty: true });
    form.setValue("from", start, { shouldDirty: true });
    form.setValue("to", bucketEnd(start, value.window.bucket), {
      shouldDirty: true,
    });
    submit();
  };

  const filters: AnalyticsFilterChip[] = [];
  if (actor !== UsageActor.ALL) {
    filters.push({
      key: "actor",
      label: t("widget.filter.actor"),
      value: t(actor),
      onRemove: () => setActor(UsageActor.ALL),
    });
  }
  if (creditKind !== UsageCreditKind.ALL) {
    filters.push({
      key: "creditKind",
      label: t("widget.filter.creditKind"),
      value: t(creditKind),
      onRemove: () => setKind(UsageCreditKind.ALL),
    });
  }
  if (model) {
    filters.push({
      key: "model",
      label: t("widget.filter.model"),
      value: model,
      onRemove: () => setText("model", undefined),
    });
  }
  if (feature) {
    filters.push({
      key: "feature",
      label: t("widget.filter.feature"),
      value: featureName(feature),
      onRemove: () => setText("feature", undefined),
    });
  }
  if (provider) {
    filters.push({
      key: "provider",
      label: t("widget.filter.provider"),
      value: provider,
      onRemove: () => setText("provider", undefined),
    });
  }
  if (includeInternal) {
    filters.push({
      key: "internal",
      label: t("widget.filter.internal"),
      value: "✓",
      onRemove: () => setInternal(false),
    });
  }
  const clearFilters = (): void => {
    form.setValue("actor", UsageActor.ALL, { shouldDirty: true });
    form.setValue("creditKind", UsageCreditKind.ALL, { shouldDirty: true });
    form.setValue("model", undefined, { shouldDirty: true });
    form.setValue("feature", undefined, { shouldDirty: true });
    form.setValue("provider", undefined, { shouldDirty: true });
    form.setValue("includeInternal", false, { shouldDirty: true });
    submit();
  };

  const kpis = value?.kpis;
  const win = value?.window;

  const metricColumns = [
    { key: "credits", label: t("widget.column.credits"), format: "credits" },
    { key: "change", label: t("widget.extra.change"), format: "delta" },
    { key: "usd", label: t("widget.column.usd"), format: "currency" },
    {
      key: "costUsd",
      label: t("widget.column.costUsd"),
      format: "currency",
      secondary: true,
    },
    {
      key: "costCoverage",
      label: t("widget.extra.costedPct"),
      format: "percent",
      secondary: true,
    },
    {
      key: "marginPct",
      label: t("widget.column.marginPct"),
      format: "percent",
    },
    {
      key: "spenders",
      label: t("widget.column.spenders"),
      format: "number",
      secondary: true,
    },
    {
      key: "guestShare",
      label: t("widget.extra.guestPct"),
      format: "percent",
      secondary: true,
    },
  ] as const;

  const breakdownRows = (
    rows: readonly BreakdownRow[],
    noneLabel: string,
    key: "model" | "feature" | "provider",
  ): BreakdownTableRow[] =>
    rows.map((row) => {
      const rowKey = row.key;
      // Model breakdown: media charges record no model, only the feature.
      const featureOnly =
        key === "model" && rowKey?.startsWith(FEATURE_PREFIX)
          ? rowKey.slice(FEATURE_PREFIX.length)
          : null;
      const label =
        rowKey === null
          ? noneLabel
          : featureOnly !== null
            ? featureName(featureOnly)
            : key === "feature"
              ? featureName(rowKey)
              : rowKey;
      return {
        id: rowKey ?? "none",
        label,
        sublabel:
          featureOnly !== null ? t("widget.extra.modelNotRecorded") : undefined,
        values: row.metrics,
        onClick:
          isInteractive && rowKey !== null
            ? (): void =>
                featureOnly !== null
                  ? setText("feature", featureOnly)
                  : setText(key, rowKey)
            : undefined,
      };
    });

  const fundingLabel = (key: string): string => {
    switch (key) {
      case "allowance":
        return t("widget.extra.fundAllowance");
      case "freeBonus":
        return t("widget.extra.fundFreeBonus");
      case "freeUnknown":
        return t("widget.extra.fundFreeUnknown");
      case "purchased":
        return t("widget.extra.fundPurchased");
      case "subscription":
        return t("widget.extra.fundSubscription");
      case "referral":
        return t("widget.extra.fundEarned");
      case "adminGrant":
        return t("widget.extra.fundAdminGrant");
      default:
        return t("widget.extra.fundUnknown");
    }
  };

  const spenderRows: BreakdownTableRow[] = (value?.topSpenders ?? []).map(
    (row) => {
      const last = new Date(row.lastActivity).toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
      });
      const userId = row.userId;
      const leadId = row.leadId;
      return {
        id: userId ?? leadId ?? "unknown",
        label:
          row.email ??
          (userId
            ? userId
            : t("widget.label.guest", { id: (leadId ?? "").slice(0, 8) })),
        sublabel: [
          userId ? t("widget.extra.accountTag") : t("widget.label.guestTag"),
          row.topModel
            ? t("widget.extra.topModel", {
                model: value?.featureLabels[row.topModel] ?? row.topModel,
              })
            : t("widget.extra.modelNotRecorded"),
          t("widget.label.lastActivity", { date: last }),
        ]
          .flatMap((part) => (part ? [part] : []))
          .join(" · "),
        values: {
          credits: row.credits,
          usd: row.usd,
          freeShare: row.freeShare,
          costUsd: row.costUsd,
          marginPct: row.marginPct,
          purchasedShare: row.purchasedShare,
          subscriptionShare: row.subscriptionShare,
          grantsShare: row.grantsShare,
          unknownShare: row.unknownShare,
          transactions: row.transactions,
        },
        onClick: !isInteractive
          ? undefined
          : userId
            ? (): void =>
                navigate(
                  async () =>
                    (await import("@/users/view/definition")).default.GET,
                  { data: { userId } },
                )
            : leadId
              ? (): void =>
                  navigate(
                    async () =>
                      (await import("@/leads/[id]/definition")).default.GET,
                    { urlPathParams: { id: leadId } },
                  )
              : undefined,
      };
    },
  );

  const costedValue = formatAnalyticsValue(kpis?.costedSpendUsd.value ?? 0, {
    format: "currency",
    locale,
  });
  const coverage = formatAnalyticsValue(kpis?.costCoverage.value ?? 0, {
    format: "percent",
    locale,
  });

  return (
    <WidgetShell layout="page" className="min-w-0">
      <WidgetHeader
        size="page"
        title={t("get.title")}
        backButton={
          isInteractive && <NavigateButtonWidget field={children.backButton} />
        }
      />
      <AnalyticsToolbar
        rangeControls={
          <ReportAnalyticsPeriod
            range={form.watch("range")}
            from={form.watch("from")}
            to={form.watch("to")}
            applied={win}
            onChange={({ range, from, to }) => {
              form.setValue("range", range, { shouldDirty: true });
              form.setValue("from", from, { shouldDirty: true });
              form.setValue("to", to, { shouldDirty: true });
              submit();
            }}
          />
        }
        locale={locale}
        period={win}
        isLoading={isLoading}
        onRefresh={isInteractive ? submit : undefined}
        value={{
          range: form.watch("range"),
          granularity: form.watch("granularity"),
          from: form.watch("from"),
          to: form.watch("to"),
        }}
        onChange={(patch) => {
          if (patch.range !== undefined) {
            form.setValue("range", patch.range, { shouldDirty: true });
          }
          if (patch.granularity !== undefined) {
            form.setValue("granularity", patch.granularity, {
              shouldDirty: true,
            });
          }
          if (patch.from !== undefined) {
            form.setValue("from", patch.from, { shouldDirty: true });
          }
          if (patch.to !== undefined) {
            form.setValue("to", patch.to, { shouldDirty: true });
          }
          submit();
        }}
        filters={filters}
        onClearFilters={clearFilters}
      >
        {isInteractive && (
          <>
            <AnalyticsSegmented
              label={t("widget.filter.actor")}
              value={actor}
              onSelect={setActor}
              options={ACTORS.map((option) => ({
                value: option,
                label: t(option),
              }))}
            />
            <AnalyticsSegmented
              label={t("widget.filter.creditKind")}
              value={creditKind}
              onSelect={setKind}
              options={KINDS.map((option) => ({
                value: option,
                label: t(option),
              }))}
            />
            <Button
              type="button"
              variant="ghost"
              aria-pressed={includeInternal}
              disabled={isLoading}
              onClick={() => setInternal(!includeInternal)}
              className={
                includeInternal
                  ? "h-auto whitespace-nowrap rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm"
                  : "h-auto whitespace-nowrap rounded-md border border-dashed px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              }
            >
              {t("widget.includeInternal")}
            </Button>
          </>
        )}
      </AnalyticsToolbar>

      {kpis && win && value && (
        <>
          <KpiGrid columns={4}>
            <KpiTile
              label={t("widget.kpi.creditsSpent")}
              value={kpis.creditsSpent.value}
              previous={kpis.creditsSpent.previous}
              format="credits"
              hint={t("widget.extra.spendersHint", {
                count: String(kpis.activeSpenders.value),
              })}
              locale={locale}
              sparkline={value.spendByKind.series.reduce<number[]>(
                (sum, s) => s.values.map((v, i) => v + (sum[i] ?? 0)),
                [],
              )}
            />
            {creditKind === UsageCreditKind.ALL ? (
              <KpiTile
                label={t("widget.extra.paidShare")}
                value={kpis.paidShare.value}
                previous={kpis.paidShare.previous}
                format="percent"
                deltaTone="neutral"
                hint={t("widget.extra.paidShareHint2", {
                  missing: formatAnalyticsValue(kpis.originMissingShare.value, {
                    format: "percent",
                    locale,
                  }),
                })}
                locale={locale}
                onClick={
                  isInteractive
                    ? () => setKind(UsageCreditKind.PURCHASED)
                    : undefined
                }
              />
            ) : (
              <KpiTile
                label={t("widget.kpi.spendUsd")}
                value={kpis.spendUsd.value}
                previous={kpis.spendUsd.previous}
                format="currency"
                hint={t("widget.hint.spendUsd")}
                locale={locale}
              />
            )}
            <KpiTile
              label={t("widget.kpi.upstreamCostUsd")}
              value={kpis.upstreamCostUsd.value}
              previous={kpis.upstreamCostUsd.previous}
              format="currency"
              invertDelta
              hint={t("widget.hint.upstreamCostUsd", { coverage })}
              locale={locale}
            />
            <KpiTile
              label={t("widget.extra.markup")}
              value={kpis.marginUsd.value}
              previous={kpis.marginUsd.previous}
              format="currency"
              tone={kpis.marginUsd.value < 0 ? "negative" : "positive"}
              hint={t("widget.extra.marginHint2", { value: costedValue })}
              locale={locale}
            />
            <KpiTile
              label={t("widget.extra.markupPct")}
              value={kpis.marginPct.value}
              previous={kpis.marginPct.previous}
              format="percent"
              hint={t("widget.extra.markupPctHint")}
              locale={locale}
            />
            {actor === UsageActor.ALL &&
            creditKind !== UsageCreditKind.PURCHASED &&
            creditKind !== UsageCreditKind.SUBSCRIPTION ? (
              <KpiTile
                label={t("widget.kpi.guestShare")}
                value={kpis.guestShare.value}
                previous={kpis.guestShare.previous}
                format="percent"
                hint={t("widget.hint.guestShare")}
                deltaTone="neutral"
                locale={locale}
                onClick={
                  isInteractive ? () => setActor(UsageActor.GUESTS) : undefined
                }
              />
            ) : (
              <KpiTile
                label={t("widget.kpi.activeSpenders")}
                value={kpis.activeSpenders.value}
                previous={kpis.activeSpenders.previous}
                format="number"
                hint={t("widget.hint.activeSpenders")}
                locale={locale}
              />
            )}
            {creditKind === UsageCreditKind.ALL ? (
              <KpiTile
                label={t("widget.kpi.freeShare")}
                value={kpis.freeShare.value}
                previous={kpis.freeShare.previous}
                format="percent"
                hint={t("widget.hint.freeShare")}
                deltaTone="neutral"
                locale={locale}
                onClick={
                  isInteractive
                    ? () => setKind(UsageCreditKind.FREE)
                    : undefined
                }
              />
            ) : (
              <KpiTile
                label={t("widget.extra.costedSpend")}
                value={kpis.costedSpendUsd.value}
                previous={kpis.costedSpendUsd.previous}
                format="currency"
                hint={t("widget.hint.upstreamCostUsd", { coverage })}
                locale={locale}
              />
            )}
            {creditKind === UsageCreditKind.ALL && (
              <KpiTile
                label={t("widget.extra.freeCost")}
                value={kpis.freeCostUsd.value}
                previous={kpis.freeCostUsd.previous}
                format="currency"
                invertDelta
                hint={t("widget.extra.freeCostHint3", {
                  credits: formatAnalyticsValue(kpis.freeCredits.value, {
                    format: "credits",
                    locale,
                  }),
                  coverage: formatAnalyticsValue(kpis.freeCostCoverage.value, {
                    format: "percent",
                    locale,
                  }),
                })}
                onClick={
                  isInteractive
                    ? () => setKind(UsageCreditKind.FREE)
                    : undefined
                }
                locale={locale}
              />
            )}
          </KpiGrid>

          <Div className="grid min-w-0 gap-4 lg:grid-cols-2">
            <TimeSeriesChart
              title={t("widget.chart.actor")}
              buckets={value.spendByActor.buckets}
              bucket={win.bucket}
              series={value.spendByActor.series.map((s, index) => ({
                key: s.key,
                label:
                  s.key === "guests"
                    ? t("widget.series.guests")
                    : t("widget.series.users"),
                values: s.values,
                color: index === 0 ? 1 : 3,
              }))}
              variant="stacked-bar"
              format="credits"
              locale={locale}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
            <TimeSeriesChart
              title={t("widget.extra.fundingChart")}
              subtitle={t("widget.extra.fundingNote")}
              buckets={value.spendByFunding.buckets}
              bucket={win.bucket}
              series={value.spendByFunding.series.map((s) => ({
                key: s.key,
                label: fundingLabel(s.key),
                values: s.values,
                color: FUNDING_COLOR[s.key] ?? 7,
              }))}
              variant="stacked-bar"
              format="credits"
              locale={locale}
              emptyLabel={t("widget.empty")}
              onBucketClick={isInteractive ? drillBucket : undefined}
            />
          </Div>

          <TimeSeriesChart
            title={t("widget.extra.costChart")}
            subtitle={t("widget.chart.costNote")}
            buckets={value.costVsSpend.buckets}
            bucket={win.bucket}
            series={[
              {
                key: "costedSpendUsd",
                label: t("widget.extra.costedSpend"),
                values:
                  value.costVsSpend.series.find(
                    (s) => s.key === "costedSpendUsd",
                  )?.values ?? [],
                color: 1,
              },
              {
                key: "upstreamCostUsd",
                label: t("widget.series.upstreamCostUsd"),
                values:
                  value.costVsSpend.series.find(
                    (s) => s.key === "upstreamCostUsd",
                  )?.values ?? [],
                color: "warning",
              },
            ]}
            variant="line"
            format="currency"
            locale={locale}
            height={200}
            emptyLabel={t("widget.empty")}
            onBucketClick={isInteractive ? drillBucket : undefined}
          />

          <Div className="flex min-w-0 flex-col gap-4">
            <BreakdownTable
              title={t("widget.breakdown.byModel")}
              subtitle={
                isInteractive ? t("widget.breakdown.drillHint") : undefined
              }
              dimensionLabel={t("widget.breakdown.model")}
              columns={metricColumns}
              rows={breakdownRows(
                value.byModel,
                t("widget.extra.nothingRecorded"),
                "model",
              )}
              locale={locale}
              limit={8}
              emptyLabel={t("widget.empty")}
            />
            <BreakdownTable
              title={t("widget.breakdown.byFeature")}
              subtitle={
                isInteractive ? t("widget.breakdown.drillHint") : undefined
              }
              dimensionLabel={t("widget.breakdown.feature")}
              columns={metricColumns}
              rows={breakdownRows(
                value.byFeature,
                t("widget.label.noFeature"),
                "feature",
              )}
              locale={locale}
              limit={8}
              emptyLabel={t("widget.empty")}
            />
            <BreakdownTable
              title={t("widget.breakdown.byProvider")}
              subtitle={
                isInteractive ? t("widget.breakdown.drillHint") : undefined
              }
              dimensionLabel={t("widget.breakdown.provider")}
              columns={metricColumns}
              rows={breakdownRows(
                value.byProvider,
                t("widget.label.noProvider"),
                "provider",
              )}
              locale={locale}
              limit={8}
              emptyLabel={t("widget.empty")}
            />
            <BreakdownTable
              title={t("widget.breakdown.topSpenders")}
              subtitle={
                isInteractive
                  ? t("widget.breakdown.topSpendersHint")
                  : undefined
              }
              dimensionLabel={t("widget.breakdown.spender")}
              columns={[
                {
                  key: "credits",
                  label: t("widget.column.credits"),
                  format: "credits",
                },
                {
                  key: "usd",
                  label: t("widget.column.usd"),
                  format: "currency",
                  secondary: true,
                },
                {
                  key: "costUsd",
                  label: t("widget.column.costUsd"),
                  format: "currency",
                  secondary: true,
                },
                {
                  key: "marginPct",
                  label: t("widget.column.marginPct"),
                  format: "percent",
                  secondary: true,
                },
                {
                  key: "freeShare",
                  label: t("widget.extra.freePct"),
                  format: "percent",
                },
                {
                  key: "purchasedShare",
                  label: t("widget.extra.boughtPct"),
                  format: "percent",
                },
                {
                  key: "subscriptionShare",
                  label: t("widget.extra.subPct"),
                  format: "percent",
                },
                {
                  key: "grantsShare",
                  label: t("widget.extra.grantsPct"),
                  format: "percent",
                  secondary: true,
                },
                {
                  key: "unknownShare",
                  label: t("widget.extra.unknownPct"),
                  format: "percent",
                  secondary: true,
                },
              ]}
              rows={spenderRows}
              showShare={false}
              locale={locale}
              limit={10}
              emptyLabel={t("widget.empty")}
            />
          </Div>
        </>
      )}
      {!value && !isLoading && (
        <Div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Span>{t("widget.extra.notLoaded")}</Span>
          {isInteractive && (
            <Button type="button" size="sm" variant="outline" onClick={submit}>
              {t("analytics.chart.refresh")}
            </Button>
          )}
        </Div>
      )}
    </WidgetShell>
  );
}
