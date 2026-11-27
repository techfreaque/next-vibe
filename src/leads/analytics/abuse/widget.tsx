"use client";

import {
  AnalyticsToolbar,
  BreakdownTable,
  KpiGrid,
  KpiTile,
  TimeSeriesChart,
} from "next-vibe/ui/components/analytics";
import { Div } from "next-vibe/ui/components/div";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { StatusPill } from "next-vibe/ui/components/status-pill";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import { useRelatedEntityNavigation } from "next-vibe/unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { AbuseGroupBy } from "../enum";
import {
  type LeadDrillFilters,
  type LeadSegmentFilters,
  SEGMENT_KEYS,
  type SegmentFilterKey,
} from "../filters";
import {
  CompactSelect,
  dimensionValueLabel,
  segmentChips,
  SegmentFilterPanel,
  useLeadAnalyticsT,
  useLeadDrill,
} from "../widget-parts";
import type definition from "./definition";

const THRESHOLDS = [3, 5, 10, 25, 50, 100] as const;
/** Leads per hour from one cluster that reads as automated. */
const FAST_BURST_PER_HOUR = 5;

export function AbuseReportWidget(): JSX.Element {
  const value = useWidgetValue<typeof definition.GET>();
  const form = useWidgetForm<typeof definition.GET>();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const st = useLeadAnalyticsT(locale);
  const onSubmit = useWidgetOnSubmit();
  const { endpointMutations } = useWidgetContext();
  const drill = useLeadDrill();
  const isLoading = endpointMutations?.read?.isFetching ?? false;
  const navigate = useRelatedEntityNavigation();
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
    localeCountry: form.watch("localeCountry"),
    device: form.watch("device"),
    browser: form.watch("browser"),
    os: form.watch("os"),
    ipPrefix: form.watch("ipPrefix"),
    uaFingerprint: form.watch("uaFingerprint"),
  };
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
    >
      <Div className="flex flex-wrap items-center gap-3">
        <CompactSelect
          label={st("leadAnalytics.abuse.groupBy.label")}
          value={
            form.watch("groupBy") ??
            value?.groupByUsed ??
            AbuseGroupBy.IP_PREFIX
          }
          options={[
            {
              value: AbuseGroupBy.IP_PREFIX,
              label: st(AbuseGroupBy.IP_PREFIX),
            },
            {
              value: AbuseGroupBy.UA_FINGERPRINT,
              label: st(AbuseGroupBy.UA_FINGERPRINT),
            },
          ]}
          onChange={(next) => {
            form.setValue("groupBy", next, { shouldDirty: true });
            submit();
          }}
        />
        <CompactSelect
          label={t("get.fields.minLeads.label")}
          value={String(form.watch("minLeads") ?? value?.minLeadsUsed ?? 10)}
          options={THRESHOLDS.map((threshold) => ({
            value: String(threshold),
            label: t("widget.thresholdOption", { count: threshold }),
          }))}
          onChange={(next) => {
            form.setValue("minLeads", Number(next), { shouldDirty: true });
            submit();
          }}
        />
      </Div>
    </AnalyticsToolbar>
  );
  if (!value) {
    return (
      <WidgetShell layout="page">
        <WidgetHeader size="page" title={t("get.title")} />
        {toolbar}
        <LoadingBlock message={t("widget.loading")} />
      </WidgetShell>
    );
  }

  const { kpis } = value;
  const byUa = value.groupByUsed === AbuseGroupBy.UA_FINGERPRINT;
  const series = (key: string): number[] =>
    value.trend.series.find((entry) => entry.key === key)?.values ?? [];
  const openLead = (id: string): void =>
    navigate(
      () => import("@/leads/[id]/definition").then((m) => m.default.GET),
      {
        urlPathParams: { id },
      },
    );

  return (
    <WidgetShell layout="page">
      <WidgetHeader size="page" title={t("get.title")} />
      {toolbar}
      <SectionGroup
        title={t("widget.filtersTitle")}
        subtitle={t("widget.filtersSubtitle")}
        collapsible
        defaultOpen={false}
      >
        <SegmentFilterPanel onApply={submit} applyLabel={t("widget.apply")} />
      </SectionGroup>
      <KpiGrid columns={4}>
        <KpiTile
          label={t(byUa ? "widget.flaggedAgents" : "widget.flaggedPrefixes")}
          value={kpis.flaggedClusters.value}
          previous={kpis.flaggedClusters.previous}
          invertDelta
          tone={kpis.flaggedClusters.value > 0 ? "warning" : undefined}
          hint={t("widget.thresholdHint", { count: value.minLeadsUsed })}
          locale={locale}
        />
        <KpiTile
          label={t("widget.flaggedLeads")}
          value={kpis.flaggedLeads.value}
          previous={kpis.flaggedLeads.previous}
          invertDelta
          hint={t("widget.flaggedShare", {
            percent: Math.round(kpis.flaggedShare * 100),
          })}
          sparkline={series("flagged")}
          locale={locale}
        />
        <KpiTile
          label={t("widget.freeCredits")}
          value={kpis.freeCredits.value}
          previous={kpis.freeCredits.previous}
          format="credits"
          invertDelta
          hint={t("widget.freeCreditsHint")}
          locale={locale}
        />
        <KpiTile
          label={t("widget.burners")}
          value={kpis.burners.value}
          previous={kpis.burners.previous}
          invertDelta
          hint={t("widget.burnersHint")}
          locale={locale}
        />
      </KpiGrid>

      <TimeSeriesChart
        title={t("widget.trendTitle")}
        subtitle={t("widget.trendSubtitle", { count: value.minLeadsUsed })}
        buckets={value.trend.buckets}
        bucket={value.window.bucket}
        variant="bar"
        locale={locale}
        height={200}
        series={[
          {
            key: "flagged",
            label: t("widget.seriesFlagged"),
            values: series("flagged"),
            color: "negative",
          },
        ]}
      />

      <BreakdownTable
        title={t(byUa ? "widget.clustersUaTitle" : "widget.clustersIpTitle")}
        subtitle={t("widget.clustersSubtitle", { rate: FAST_BURST_PER_HOUR })}
        dimensionLabel={t(byUa ? "widget.userAgent" : "widget.prefix")}
        locale={locale}
        limit={15}
        emptyLabel={t("widget.noClusters", { count: value.minLeadsUsed })}
        columns={[
          { key: "leads", label: st("leadAnalytics.metrics.leads") },
          {
            key: "distinctOther",
            label: t(byUa ? "widget.prefixes" : "widget.agents"),
          },
          { key: "signups", label: st("leadAnalytics.metrics.signups") },
          {
            key: "freeCredits",
            label: st("leadAnalytics.metrics.freeCredits"),
            format: "credits",
          },
          {
            key: "perHour",
            label: t("widget.perHour"),
            format: "decimal",
          },
          {
            key: "botShare",
            label: st("leadAnalytics.metrics.botShare"),
            format: "percent",
            secondary: true,
          },
        ]}
        rows={value.clusters.map((row) => ({
          id: row.key,
          marker:
            row.perHour >= FAST_BURST_PER_HOUR ? (
              <StatusPill status={t("widget.fast")} variant="danger" />
            ) : undefined,
          label: byUa ? (row.sample ?? row.key) : row.key,
          sublabel: `${byUa ? row.key : (row.sample ?? "")} · ${row.firstSeen} → ${row.lastSeen}`,
          values: {
            leads: row.leads,
            distinctOther: row.distinctOther,
            signups: row.signups,
            freeCredits: row.freeCredits,
            botShare: row.botShare,
            perHour: row.perHour,
          },
          onClick: () =>
            drill({
              ...filters,
              ...inWindow,
              ...(byUa ? { uaFingerprint: row.key } : { ipPrefix: row.key }),
            }),
        }))}
      />

      <BreakdownTable
        title={t("widget.burnersTitle")}
        subtitle={t("widget.burnersSubtitle")}
        dimensionLabel={t("widget.lead")}
        locale={locale}
        limit={10}
        emptyLabel={t("widget.noBurners")}
        columns={[
          {
            key: "credits",
            label: st("leadAnalytics.metrics.freeCredits"),
            format: "credits",
          },
          { key: "tx", label: t("widget.requests") },
        ]}
        rows={value.burners.map((row) => ({
          id: row.leadId,
          label:
            row.label ??
            [
              t("widget.noIp"),
              dimensionValueLabel(row.botFamily, st),
              row.country ? dimensionValueLabel(row.country, st) : null,
            ]
              .filter((part): part is string => Boolean(part))
              .join(" · "),
          sublabel: [
            row.leadId.slice(0, 8),
            row.ipPrefix,
            dimensionValueLabel(row.botFamily, st),
            row.country ? dimensionValueLabel(row.country, st) : null,
            row.lastAt,
          ]
            .filter((part): part is string => Boolean(part))
            .join(" · "),
          values: { credits: row.credits, tx: row.tx },
          onClick: () => openLead(row.leadId),
        }))}
      />
    </WidgetShell>
  );
}
