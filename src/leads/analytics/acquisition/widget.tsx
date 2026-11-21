"use client";

/**
 * Acquisition report widget (web, CLI, MCP: the analytics components render
 * per platform).
 */

import {
  AnalyticsToolbar,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { Span } from "next-vibe/ui/components/span";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { formatAnalyticsValue } from "next-vibe/unified-ui/analytics/format";
import type { JSX } from "react";

import { FunnelReach, LeadDimension, TrafficFilter } from "../enum";
import type { LeadDrillFilters, LeadSegmentFilters } from "../filters";
import {
  bucketDays,
  DIMENSION_LABEL,
  dimensionFilter,
  DimensionTabs,
  dimensionValueLabel,
  noneRowHint,
  SEGMENT_KEYS,
  segmentChips,
  type SegmentFilterKey,
  SegmentFilterPanel,
  useLeadAnalyticsT,
  useLeadDrill,
} from "../widget-parts";
import type definition from "./definition";

export function AcquisitionReportWidget(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const st = useLeadAnalyticsT(locale);
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const drill = useLeadDrill();
  const isLoading = endpointMutations?.read?.isFetching ?? false;

  const filters: LeadSegmentFilters = {
    traffic: form.watch("traffic"),
    botFamily: form.watch("botFamily"),
    channelType: form.watch("channelType"),
    channel: form.watch("channel"),
    source: form.watch("source"),
    medium: form.watch("medium"),
    campaign: form.watch("campaign"),
    referrerHost: form.watch("referrerHost"),
    landingPath: form.watch("landingPath"),
    refCode: form.watch("refCode"),
    country: form.watch("country"),
    device: form.watch("device"),
    browser: form.watch("browser"),
    os: form.watch("os"),
    ipPrefix: form.watch("ipPrefix"),
    uaFingerprint: form.watch("uaFingerprint"),
  };
  const dimension = form.watch("dimension") ?? LeadDimension.CHANNEL;

  const submit = (): void => {
    onSubmit?.();
  };
  const removeFilter = (key: SegmentFilterKey): void => {
    form.setValue(key, undefined, { shouldDirty: true });
    submit();
  };
  const clearFilters = (): void => {
    for (const key of SEGMENT_KEYS) {
      form.setValue(key, undefined, { shouldDirty: true });
    }
    submit();
  };
  const period = value?.window;
  const inWindow: LeadDrillFilters = period
    ? { createdFrom: period.from, createdTo: period.to }
    : {};
  const stepInWindow = (
    reached: (typeof FunnelReach)[keyof typeof FunnelReach],
  ): LeadDrillFilters =>
    period
      ? { reached, reachedFrom: period.from, reachedTo: period.to }
      : { reached };

  const toolbar = (
    <AnalyticsToolbar
      locale={locale}
      period={period}
      isLoading={isLoading}
      onRefresh={() => endpointMutations?.read?.refetch?.()}
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
      filters={segmentChips(filters, st, removeFilter)}
      onClearFilters={clearFilters}
    />
  );

  if (!value) {
    return (
      <WidgetShell>
        <WidgetHeader title={t("get.title")} />
        {toolbar}
        <LoadingBlock message={t("widget.loading")} />
      </WidgetShell>
    );
  }

  const { kpis, trend, coverage } = value;
  const series = (key: string): number[] =>
    trend.series.find((entry) => entry.key === key)?.values ?? [];
  const leadsTotal = kpis.humanLeads.value + kpis.botLeads.value;
  const botShare = leadsTotal > 0 ? kpis.botLeads.value / leadsTotal : 0;
  const metricLabel = {
    visits: t("widget.humanVisits"),
    visitors: st("leadAnalytics.metrics.visitors"),
    leads: st("leadAnalytics.metrics.leads"),
    humanLeads: st("leadAnalytics.metrics.humanLeads"),
    botLeads: st("leadAnalytics.metrics.botLeads"),
    botShare: st("leadAnalytics.metrics.botShare"),
    signups: st("leadAnalytics.metrics.signups"),
    firstChats: st("leadAnalytics.metrics.firstChats"),
    payers: st("leadAnalytics.metrics.payers"),
  };
  const breakdownColumns = [
    { key: "leads", label: metricLabel.leads },
    {
      key: "botShare",
      label: metricLabel.botShare,
      format: "percent" as const,
      secondary: true,
    },
    {
      key: "visits",
      label: st("leadAnalytics.metrics.visits"),
      secondary: true,
    },
    { key: "signups", label: metricLabel.signups },
    { key: "payers", label: metricLabel.payers },
    {
      key: "revenueUsd",
      label: t("widget.revenue"),
      format: "currency" as const,
      currency: "USD",
      secondary: true,
    },
  ];

  return (
    <WidgetShell>
      <WidgetHeader title={t("get.title")} />
      {toolbar}
      <SectionGroup
        title={t("widget.filtersTitle")}
        subtitle={t("widget.filtersSubtitle")}
        collapsible
        defaultOpen={false}
      >
        <SegmentFilterPanel onApply={submit} applyLabel={t("widget.apply")} />
      </SectionGroup>
      {coverage.visitsSince ? (
        <Span className="text-xs text-muted-foreground">
          {t("widget.coverage", { date: coverage.visitsSince })}
        </Span>
      ) : null}

      <KpiGrid columns={6}>
        <KpiTile
          label={metricLabel.visits}
          value={kpis.humanVisits.value}
          previous={kpis.humanVisits.previous}
          hint={t("widget.botVisitsHint", {
            count: formatAnalyticsValue(kpis.botVisits.value, { locale }),
          })}
          sparkline={series("humanVisits")}
          locale={locale}
          onClick={() =>
            drill({
              ...filters,
              traffic: TrafficFilter.HUMANS,
              ...stepInWindow(FunnelReach.VISITED),
            })
          }
        />
        <KpiTile
          label={metricLabel.humanLeads}
          value={kpis.humanLeads.value}
          previous={kpis.humanLeads.previous}
          sparkline={series("humanLeads")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...inWindow, traffic: TrafficFilter.HUMANS })
          }
        />
        <KpiTile
          label={metricLabel.botLeads}
          value={kpis.botLeads.value}
          previous={kpis.botLeads.previous}
          invertDelta
          tone={botShare > 0.5 ? "warning" : undefined}
          hint={t("widget.botShareHint", {
            percent: formatAnalyticsValue(botShare, {
              format: "percent",
              locale,
            }),
          })}
          sparkline={series("botLeads")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...inWindow, traffic: TrafficFilter.BOTS })
          }
        />
        <KpiTile
          label={metricLabel.signups}
          value={kpis.signups.value}
          previous={kpis.signups.previous}
          sparkline={series("signups")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...stepInWindow(FunnelReach.SIGNED_UP) })
          }
        />
        <KpiTile
          label={metricLabel.firstChats}
          value={kpis.firstChats.value}
          previous={kpis.firstChats.previous}
          sparkline={series("firstChats")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...stepInWindow(FunnelReach.FIRST_CHAT) })
          }
        />
        <KpiTile
          label={metricLabel.payers}
          value={kpis.payers.value}
          previous={kpis.payers.previous}
          tone="positive"
          sparkline={series("payers")}
          locale={locale}
          onClick={() =>
            drill({ ...filters, ...stepInWindow(FunnelReach.PAID) })
          }
        />
      </KpiGrid>

      <Div className="grid min-w-0 grid-cols-1 gap-4 @3xl:grid-cols-2">
        <TimeSeriesChart
          title={t("widget.leadsTitle")}
          subtitle={t("widget.leadsSubtitle")}
          buckets={trend.buckets}
          bucket={value.window.bucket}
          variant="bar"
          locale={locale}
          height={200}
          series={[
            {
              key: "humanLeads",
              label: metricLabel.humanLeads,
              values: series("humanLeads"),
              color: 1,
            },
          ]}
          onBucketClick={(bucketKey) => {
            const days = bucketDays(bucketKey, value.window.bucket);
            drill({
              ...filters,
              traffic: TrafficFilter.HUMANS,
              createdFrom: days.from,
              createdTo: days.to,
            });
          }}
        />
        <TimeSeriesChart
          title={t("widget.conversionsTitle")}
          subtitle={t("widget.conversionsSubtitle")}
          buckets={trend.buckets}
          bucket={value.window.bucket}
          variant="line"
          locale={locale}
          height={200}
          series={[
            {
              key: "signups",
              label: metricLabel.signups,
              values: series("signups"),
              color: 2,
            },
            {
              key: "payers",
              label: metricLabel.payers,
              values: series("payers"),
              color: 5,
            },
          ]}
          onBucketClick={(bucketKey) => {
            const days = bucketDays(bucketKey, value.window.bucket);
            drill({
              ...filters,
              reached: FunnelReach.SIGNED_UP,
              reachedFrom: days.from,
              reachedTo: days.to,
            });
          }}
        />
        <TimeSeriesChart
          title={t("widget.visitsTitle")}
          subtitle={t("widget.visitsSubtitle")}
          buckets={trend.buckets}
          bucket={value.window.bucket}
          variant="line"
          locale={locale}
          height={180}
          series={[
            {
              key: "humanVisits",
              label: metricLabel.visits,
              values: series("humanVisits"),
              color: 1,
            },
            {
              key: "botVisits",
              label: t("widget.botVisits"),
              values: series("botVisits"),
              color: "muted",
            },
          ]}
          onBucketClick={(bucketKey) => {
            const days = bucketDays(bucketKey, value.window.bucket);
            drill({
              ...filters,
              reached: FunnelReach.VISITED,
              reachedFrom: days.from,
              reachedTo: days.to,
            });
          }}
        />
        <TimeSeriesChart
          title={t("widget.botsTitle")}
          subtitle={t("widget.botsSubtitle")}
          buckets={trend.buckets}
          bucket={value.window.bucket}
          variant="bar"
          locale={locale}
          height={180}
          series={[
            {
              key: "botLeads",
              label: metricLabel.botLeads,
              values: series("botLeads"),
              color: "muted",
            },
          ]}
          onBucketClick={(bucketKey) => {
            const days = bucketDays(bucketKey, value.window.bucket);
            drill({
              ...filters,
              traffic: TrafficFilter.BOTS,
              createdFrom: days.from,
              createdTo: days.to,
            });
          }}
        />
      </Div>

      <Div className="grid min-w-0 grid-cols-1 gap-4 ">
        <Div className="flex min-w-0 flex-col gap-2">
          <DimensionTabs
            value={dimension}
            t={st}
            ariaLabel={st("leadAnalytics.dimension.label")}
            onChange={(next) => {
              form.setValue("dimension", next, { shouldDirty: true });
              submit();
            }}
          />
          <BreakdownTable
            title={t("widget.breakdownTitle")}
            subtitle={t("widget.breakdownSubtitle")}
            dimensionLabel={st(DIMENSION_LABEL[dimension])}
            columns={breakdownColumns}
            locale={locale}
            emptyLabel={t("widget.empty")}
            rows={value.breakdown.map((row) => ({
              id: row.key ?? "(none)",
              label: dimensionValueLabel(row.key, st),
              sublabel: noneRowHint(row.key, st),
              values: row.metrics,
              onClick: () =>
                drill({
                  ...filters,
                  ...dimensionFilter(dimension, row.key),
                  ...inWindow,
                }),
            }))}
          />
        </Div>
        <BreakdownTable
          title={t("widget.agentsTitle")}
          subtitle={t("widget.agentsSubtitle")}
          dimensionLabel={st("leadAnalytics.dimension.botFamily")}
          columns={[
            { key: "leads", label: metricLabel.leads },
            { key: "signups", label: metricLabel.signups },
          ]}
          locale={locale}
          emptyLabel={t("widget.empty")}
          rows={value.agents.map((row) => ({
            id: row.key ?? "(none)",
            label: dimensionValueLabel(row.key, st),
            sublabel: noneRowHint(row.key, st),
            values: row.metrics,
            onClick: () =>
              drill({
                ...filters,
                ...dimensionFilter(LeadDimension.BOT_FAMILY, row.key),
                ...inWindow,
              }),
          }))}
        />
      </Div>

      {leadsTotal === 0 && kpis.visits.value === 0 ? (
        <EmptyBlock title={t("widget.empty")} message={t("widget.emptyHint")} />
      ) : null}
    </WidgetShell>
  );
}
