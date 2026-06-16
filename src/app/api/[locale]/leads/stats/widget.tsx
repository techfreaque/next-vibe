/**
 * Leads Stats Custom Widget
 * Rich analytics dashboard for leads statistics
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Download } from "next-vibe-ui/ui/icons/Download";
import { Filter } from "next-vibe-ui/ui/icons/Filter";
import { List } from "next-vibe-ui/ui/icons/List";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Upload } from "next-vibe-ui/ui/icons/Upload";
import { Users } from "next-vibe-ui/ui/icons/Users";
import { Zap } from "next-vibe-ui/ui/icons/Zap";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { MetricCard } from "next-vibe-ui/ui/metric-card";
import { MetricGrid } from "next-vibe-ui/ui/metric-grid";
import { SectionGroup } from "next-vibe-ui/ui/section-group";
import { Span } from "next-vibe-ui/ui/span";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import React, { useCallback, useMemo, useState } from "react";

import {
  LeadSource,
  LeadSourceFilter,
  LeadStatus,
  LeadStatusFilter,
} from "@/app/api/[locale]/leads/enum";
import {
  type LeadsTranslationKey,
  scopedTranslation as leadsScopedTranslation,
} from "@/app/api/[locale]/leads/i18n";
import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";
import { NumberFieldWidget } from "next-vibe-ui/unified/form-fields/number-field/widget";
import { SelectFieldWidget } from "next-vibe-ui/unified/form-fields/select-field/widget";
import { TextFieldWidget } from "next-vibe-ui/unified/form-fields/text-field/widget";
import { NavigateButtonWidget } from "next-vibe-ui/unified/interactive/navigate-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

// ─── Trend computation ────────────────────────────────────────────────────────

type TrendDirection = "up" | "down" | "neutral";

interface ActivityRecord {
  timestamp?: string;
  createdAt?: string;
}

function computeTrend(recentActivity: ActivityRecord[]): TrendDirection {
  if (!recentActivity.length) {
    return "neutral";
  }
  const now = Date.now();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  const recent = recentActivity.slice(0, 10);
  const recentCount = recent.filter((a) => {
    const ts = a.timestamp ?? a.createdAt;
    if (!ts) {
      return false;
    }
    return now - new Date(ts).getTime() < twoDaysMs;
  }).length;
  if (recentCount > recent.length * 0.6) {
    return "up";
  }
  if (recentCount < recent.length * 0.3) {
    return "down";
  }
  return "neutral";
}

// ─── Date range helpers ───────────────────────────────────────────────────────

function getWeekRange(locale: string): { from: string; to: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    }),
    to: sunday.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    }),
  };
}

function getMonthRange(locale: string): { from: string; to: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: first.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
    }),
    to: last.toLocaleDateString(locale, { month: "short", day: "numeric" }),
  };
}

// ─── Clickable bar row (for By Status / By Source) ────────────────────────────

function ClickableBarRow({
  category,
  value,
  percentage,
  barColor,
  max,
  onClick,
  leadsT,
}: {
  category: LeadsTranslationKey;
  value: number;
  percentage?: number;
  barColor: string;
  max: number;
  onClick?: () => void;
  leadsT: ReturnType<typeof leadsScopedTranslation.scopedT>["t"];
}): React.JSX.Element {
  const widthPercent = `${(value / max) * 100}%`;
  return (
    <Div
      className={cn(
        "flex items-center gap-2 rounded px-1 py-0.5",
        onClick && "cursor-pointer hover:bg-muted/60 transition-colors",
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick();
              }
            }
          : undefined
      }
    >
      <Span className="text-xs text-muted-foreground w-28 truncate flex-shrink-0">
        {leadsT(category)}
      </Span>
      <Div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <Div
          style={{
            width: widthPercent,
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: barColor,
          }}
        />
      </Div>
      <Span className="text-xs tabular-nums w-10 text-right">{value}</Span>
      {percentage !== null && percentage !== undefined && (
        <Span className="text-xs text-muted-foreground w-10 text-right">
          {percentage.toFixed(0)}%
        </Span>
      )}
      {onClick && (
        <Filter className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-60" />
      )}
    </Div>
  );
}

// ─── Grouped stats section (plain, no navigation) ─────────────────────────────

function GroupedStatsSection({
  title,
  items,
  colorMap,
  leadsT,
}: {
  title: string;
  items:
    | Array<{
        category: LeadsTranslationKey;
        value: number;
        percentage?: number;
      }>
    | undefined;
  colorMap?: Record<string, string>;
  leadsT: ReturnType<typeof leadsScopedTranslation.scopedT>["t"];
}): React.JSX.Element | null {
  if (!items?.length) {
    return null;
  }
  const top = items.slice(0, 8);
  const max = Math.max(...top.map((i) => i.value), 1);

  return (
    <SectionGroup title={title}>
      <Div className="flex flex-col gap-1">
        {top.map((item) => (
          <ClickableBarRow
            key={item.category}
            category={item.category}
            value={item.value}
            percentage={item.percentage}
            barColor={colorMap?.[item.category] ?? "hsl(var(--primary))"}
            max={max}
            leadsT={leadsT}
          />
        ))}
      </Div>
    </SectionGroup>
  );
}

function RawGroupedStatsSection({
  title,
  items,
  colorMap,
}: {
  title: string;
  items:
    | Array<{ category: string; value: number; percentage?: number }>
    | undefined;
  colorMap?: Record<string, string>;
}): React.JSX.Element | null {
  if (!items?.length) {
    return null;
  }
  const top = items.slice(0, 8);
  const max = Math.max(...top.map((i) => i.value), 1);

  return (
    <SectionGroup title={title}>
      <Div className="flex flex-col gap-1">
        {top.map((item) => (
          <Div
            key={item.category}
            className="flex items-center gap-2 rounded px-1 py-0.5"
          >
            <Span className="text-xs text-muted-foreground w-28 truncate flex-shrink-0">
              {item.category}
            </Span>
            <Div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <Div
                style={{
                  width: `${(item.value / max) * 100}%`,
                  height: "100%",
                  borderRadius: "9999px",
                  backgroundColor:
                    colorMap?.[item.category] ?? "hsl(var(--primary))",
                }}
              />
            </Div>
            <Span className="text-xs tabular-nums w-10 text-right">
              {item.value}
            </Span>
            {item.percentage !== null && item.percentage !== undefined && (
              <Span className="text-xs text-muted-foreground w-10 text-right">
                {item.percentage.toFixed(0)}%
              </Span>
            )}
          </Div>
        ))}
      </Div>
    </SectionGroup>
  );
}

// ─── Conversion funnel visualization ─────────────────────────────────────────

function ConversionFunnel({
  data,
  funnelTitle,
  stageLabels,
}: {
  data: typeof definition.GET.types.ResponseOutput | null | undefined;
  funnelTitle: string;
  stageLabels: {
    totalLeads: string;
    campaignRunning: string;
    signedUp: string;
    subscriptionConfirmed: string;
  };
}): React.JSX.Element | null {
  if (!data) {
    return null;
  }

  const funnelStages: Array<{
    key: keyof typeof definition.GET.types.ResponseOutput;
    label: string;
    color: string;
  }> = [
    {
      key: "totalLeads",
      label: stageLabels.totalLeads,
      color: "#3b82f6",
    },
    {
      key: "campaignRunningLeads",
      label: stageLabels.campaignRunning,
      color: "#a855f7",
    },
    {
      key: "signedUpLeads",
      label: stageLabels.signedUp,
      color: "#14b8a6",
    },
    {
      key: "subscriptionConfirmedLeads",
      label: stageLabels.subscriptionConfirmed,
      color: "#22c55e",
    },
  ];

  const stages = funnelStages.map((s) => ({
    ...s,
    value: (data[s.key] as number | null | undefined) ?? 0,
  }));

  const topValue = stages[0]?.value ?? 1;
  if (topValue === 0) {
    return null;
  }

  return (
    <Div className="rounded-lg border bg-card p-4">
      <Span className="text-sm font-semibold mb-3 block">{funnelTitle}</Span>
      <Div className="flex flex-col gap-3">
        {stages.map((stage, idx) => {
          const pct = topValue > 0 ? (stage.value / topValue) * 100 : 0;
          const dropPct =
            idx > 0 && (stages[idx - 1]?.value ?? 0) > 0
              ? (1 - stage.value / (stages[idx - 1]?.value ?? 1)) * 100
              : null;
          return (
            <Div key={stage.key} className="flex flex-col gap-1">
              <Div className="flex items-center justify-between text-xs">
                <Span className="text-muted-foreground">{stage.label}</Span>
                <Div className="flex items-center gap-2">
                  {dropPct !== null && dropPct > 0 && (
                    <Span className="text-destructive">
                      -{dropPct.toFixed(1)}%
                    </Span>
                  )}
                  <Span className="font-medium tabular-nums">
                    {stage.value.toLocaleString()}
                  </Span>
                  <Span className="text-muted-foreground w-12 text-right tabular-nums">
                    {pct.toFixed(1)}%
                  </Span>
                </Div>
              </Div>
              <Div className="h-4 bg-muted rounded-full overflow-hidden">
                <Div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    borderRadius: "9999px",
                    backgroundColor: stage.color,
                    transition: "all 0.15s",
                  }}
                />
              </Div>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

// ─── Status color map matching list widget ────────────────────────────────────

const STATUS_BAR_COLORS: Record<string, string> = {
  "enums.leadStatus.new": "#3b82f6",
  "enums.leadStatus.pending": "#eab308",
  "enums.leadStatus.campaignRunning": "#a855f7",
  "enums.leadStatus.websiteUser": "#06b6d4",
  "enums.leadStatus.newsletterSubscriber": "#6366f1",
  "enums.leadStatus.inContact": "#f97316",
  "enums.leadStatus.signedUp": "#14b8a6",
  "enums.leadStatus.subscriptionConfirmed": "#22c55e",
  "enums.leadStatus.unsubscribed": "#9ca3af",
  "enums.leadStatus.bounced": "#ef4444",
  "enums.leadStatus.invalid": "#b91c1c",
};

const SOURCE_BAR_COLORS: Record<string, string> = {
  "enums.leadSource.website": "#3b82f6",
  "enums.leadSource.referral": "#22c55e",
  "enums.leadSource.socialMedia": "#ec4899",
  "enums.leadSource.emailCampaign": "#eab308",
  "enums.leadSource.csvImport": "#f97316",
};

// ─── Enum mappings for navigation ────────────────────────────────────────────

type LeadStatusValue = (typeof LeadStatus)[keyof typeof LeadStatus];
type LeadStatusFilterValue =
  (typeof LeadStatusFilter)[keyof typeof LeadStatusFilter];
type LeadSourceValue = (typeof LeadSource)[keyof typeof LeadSource];
type LeadSourceFilterValue =
  (typeof LeadSourceFilter)[keyof typeof LeadSourceFilter];

const LEAD_STATUS_TO_FILTER: Record<LeadStatusValue, LeadStatusFilterValue> = {
  [LeadStatus.NEW]: LeadStatusFilter.NEW,
  [LeadStatus.PENDING]: LeadStatusFilter.PENDING,
  [LeadStatus.CAMPAIGN_RUNNING]: LeadStatusFilter.CAMPAIGN_RUNNING,
  [LeadStatus.WEBSITE_USER]: LeadStatusFilter.WEBSITE_USER,
  [LeadStatus.NEWSLETTER_SUBSCRIBER]: LeadStatusFilter.NEWSLETTER_SUBSCRIBER,
  [LeadStatus.IN_CONTACT]: LeadStatusFilter.IN_CONTACT,
  [LeadStatus.SIGNED_UP]: LeadStatusFilter.SIGNED_UP,
  [LeadStatus.SUBSCRIPTION_CONFIRMED]: LeadStatusFilter.SUBSCRIPTION_CONFIRMED,
  [LeadStatus.UNSUBSCRIBED]: LeadStatusFilter.UNSUBSCRIBED,
  [LeadStatus.BOUNCED]: LeadStatusFilter.BOUNCED,
  [LeadStatus.INVALID]: LeadStatusFilter.INVALID,
};

const LEAD_SOURCE_TO_FILTER: Record<LeadSourceValue, LeadSourceFilterValue> = {
  [LeadSource.WEBSITE]: LeadSourceFilter.WEBSITE,
  [LeadSource.SOCIAL_MEDIA]: LeadSourceFilter.SOCIAL_MEDIA,
  [LeadSource.EMAIL_CAMPAIGN]: LeadSourceFilter.EMAIL_CAMPAIGN,
  [LeadSource.REFERRAL]: LeadSourceFilter.REFERRAL,
  [LeadSource.CSV_IMPORT]: LeadSourceFilter.CSV_IMPORT,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function LeadsStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation<typeof definition.GET>();
  const leadsT = leadsScopedTranslation.scopedT(locale).t;
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm<typeof definition.GET>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const data = useWidgetValue<typeof definition.GET>();

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleApplyFilters = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const groupedStats = data?.groupedStats;
  const recentActivity = useMemo(
    () => data?.recentActivity ?? [],
    [data?.recentActivity],
  );
  const topCampaigns = useMemo(
    () => data?.topPerformingCampaigns ?? [],
    [data?.topPerformingCampaigns],
  );
  const topSources = useMemo(
    () => data?.topPerformingSources ?? [],
    [data?.topPerformingSources],
  );

  // Derive trend from recent activity
  const trend = useMemo(() => computeTrend(recentActivity), [recentActivity]);

  // Date ranges
  const weekRange = useMemo(() => getWeekRange(locale), [locale]);
  const monthRange = useMemo(() => getMonthRange(locale), [locale]);

  // ── Navigation handlers ──────────────────────────────────────────────────

  const handleViewAllLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleSearchLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("@/app/api/[locale]/leads/list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleExportLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const exportDef =
        await import("@/app/api/[locale]/leads/export/definition");
      navigate(exportDef.default.GET);
    })();
  }, [navigate]);

  const handleImportLeads = useCallback((): void => {
    void (async (): Promise<void> => {
      const importDef =
        await import("@/app/api/[locale]/leads/import/definition");
      navigate(importDef.default.POST);
    })();
  }, [navigate]);

  const handleBatchUpdate = useCallback((): void => {
    void (async (): Promise<void> => {
      const batchDef =
        await import("@/app/api/[locale]/leads/batch/definition");
      navigate(batchDef.default.PATCH);
    })();
  }, [navigate]);

  const handleNavigateToStatus = useCallback(
    (category: LeadStatusValue): void => {
      void (async (): Promise<void> => {
        const listDef =
          await import("@/app/api/[locale]/leads/list/definition");
        const filterValue = LEAD_STATUS_TO_FILTER[category];
        if (filterValue) {
          navigate(listDef.default.GET, {
            data: { statusFilters: { status: [filterValue] } },
          });
        }
      })();
    },
    [navigate],
  );

  const handleNavigateToSource = useCallback(
    (category: LeadSourceValue): void => {
      void (async (): Promise<void> => {
        const listDef =
          await import("@/app/api/[locale]/leads/list/definition");
        const filterValue = LEAD_SOURCE_TO_FILTER[category];
        if (filterValue) {
          navigate(listDef.default.GET, {
            data: { statusFilters: { source: [filterValue] } },
          });
        }
      })();
    },
    [navigate],
  );

  // ── Clickable By Status section ──────────────────────────────────────────

  const byStatusItems = groupedStats?.byStatus;
  const bySourceItems = groupedStats?.bySource;
  const byStatusMax = Math.max(
    ...(byStatusItems?.map((i) => i.value) ?? [1]),
    1,
  );
  const bySourceMax = Math.max(
    ...(bySourceItems?.map((i) => i.value) ?? [1]),
    1,
  );

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("widget.title")}
        backButton={<NavigateButtonWidget field={children.backButton} />}
        actions={
          <Div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title={t("widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </Div>
        }
      />

      {/* Quick action buttons */}
      <Div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleViewAllLeads}
          className="gap-1.5 h-8 text-xs"
        >
          <List className="h-3.5 w-3.5" />
          {t("widget.viewAllLeads")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSearchLeads}
          className="gap-1.5 h-8 text-xs"
        >
          <Search className="h-3.5 w-3.5" />
          {t("widget.searchLeads")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleExportLeads}
          className="gap-1.5 h-8 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          {t("widget.export")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImportLeads}
          className="gap-1.5 h-8 text-xs"
        >
          <Upload className="h-3.5 w-3.5" />
          {t("widget.import")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleBatchUpdate}
          className="gap-1.5 h-8 text-xs"
        >
          <Zap className="h-3.5 w-3.5" />
          {t("widget.batchUpdate")}
        </Button>
      </Div>

      {/* Filters toggle */}
      <Div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setFiltersOpen((v) => !v);
          }}
          className="flex items-center gap-1.5 h-8 text-xs"
        >
          <Filter className="h-3.5 w-3.5" />
          {t("widget.filters")}
        </Button>
      </Div>

      {/* Filter panel */}
      {filtersOpen && (
        <Div className="rounded-lg border p-4 flex flex-col gap-3 bg-muted/20">
          <Div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <SelectFieldWidget
              fieldName="timePeriod"
              field={children.timePeriod}
            />
            <SelectFieldWidget
              fieldName="dateRangePreset"
              field={children.dateRangePreset}
            />
            <SelectFieldWidget
              fieldName="chartType"
              field={children.chartType}
            />
            <SelectFieldWidget fieldName="status" field={children.status} />
            <SelectFieldWidget fieldName="source" field={children.source} />
            <SelectFieldWidget fieldName="country" field={children.country} />
            <SelectFieldWidget fieldName="language" field={children.language} />
            <SelectFieldWidget
              fieldName="campaignStage"
              field={children.campaignStage}
            />
            <SelectFieldWidget
              fieldName="comparisonPeriod"
              field={children.comparisonPeriod}
            />
            <SelectFieldWidget fieldName="sortBy" field={children.sortBy} />
            <SelectFieldWidget
              fieldName="sortOrder"
              field={children.sortOrder}
            />
            <TextFieldWidget fieldName="search" field={children.search} />
            <TextFieldWidget
              fieldName="journeyVariant"
              field={children.journeyVariant}
            />
            {(
              [
                "dateFrom",
                "dateTo",
                "createdAfter",
                "createdBefore",
                "updatedAfter",
                "updatedBefore",
              ] as const
            ).map((key) => (
              <Div key={key} className="flex flex-col gap-1">
                <Span className="text-xs text-muted-foreground">
                  {t(children[key].label)}
                </Span>
                <Input
                  type="date"
                  value={((): string => {
                    const v = form.watch(key);
                    return v instanceof Date
                      ? v.toISOString().slice(0, 10)
                      : "";
                  })()}
                  onChange={(e) => {
                    form.setValue(key, new Date(e.target.value));
                  }}
                  className="h-9"
                />
              </Div>
            ))}
            <NumberFieldWidget
              fieldName="minEmailsOpened"
              field={children.minEmailsOpened}
            />
            <NumberFieldWidget
              fieldName="minEmailsClicked"
              field={children.minEmailsClicked}
            />
            <NumberFieldWidget
              fieldName="minEmailsSent"
              field={children.minEmailsSent}
            />
          </Div>
          <Div className="flex flex-wrap gap-3">
            {(
              [
                "includeComparison",
                "hasEngagement",
                "isConverted",
                "hasSignedUp",
                "hasConfirmedSubscription",
                "hasBusinessName",
                "hasContactName",
                "hasPhone",
                "hasWebsite",
                "hasNotes",
                "hasUserId",
                "emailVerified",
              ] as const
            ).map((key) => (
              <Label
                key={key}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={form.watch(key) ?? false}
                  onCheckedChange={(checked) => {
                    form.setValue(key, checked === true);
                  }}
                />
                <Span className="text-sm">{t(children[key].label)}</Span>
              </Label>
            ))}
          </Div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleApplyFilters}
            className="self-start"
          >
            {t("widget.applyFilters")}
          </Button>
        </Div>
      )}

      {/* KPI overview */}
      <MetricGrid columns={4}>
        <MetricCard
          label={t("widget.totalLeads")}
          value={data?.totalLeads ?? 0}
          trend={trend}
        />
        <MetricCard
          label={t("widget.activeLeads")}
          value={data?.activeLeads ?? 0}
          variant="info"
          trend={trend}
        />
        <MetricCard
          label={t("widget.converted")}
          value={data?.convertedLeads ?? 0}
          variant="success"
          trend={trend}
        />
        <MetricCard
          label={t("widget.conversionRate")}
          value={`${((data?.conversionRate ?? 0) * 100).toFixed(1)}%`}
          variant="success"
          trend={trend}
        />
      </MetricGrid>

      {/* Email performance */}
      <MetricGrid columns={4}>
        <MetricCard
          label={t("widget.openRate")}
          value={`${((data?.averageOpenRate ?? 0) * 100).toFixed(1)}%`}
          variant="info"
        />
        <MetricCard
          label={t("widget.clickRate")}
          value={`${((data?.averageClickRate ?? 0) * 100).toFixed(1)}%`}
          variant="info"
        />
        <MetricCard
          label={t("widget.unsubscribeRate")}
          value={`${((data?.signupRate ?? 0) * 100).toFixed(1)}%`}
        />
        <MetricCard
          label={t("widget.newThisMonth")}
          value={data?.leadsCreatedThisMonth ?? 0}
          variant="info"
        />
      </MetricGrid>

      {/* New leads timeline */}
      <SectionGroup title={t("widget.newLeadsTimeline")}>
        <MetricGrid columns={3}>
          <MetricCard
            label={`${t("widget.today")} (${new Date().toLocaleDateString(locale, { month: "short", day: "numeric" })})`}
            value={data?.leadsCreatedToday ?? 0}
          />
          <MetricCard
            label={`${t("widget.thisWeek")} (${weekRange.from} ${t("widget.dateSeparator")} ${weekRange.to})`}
            value={data?.leadsCreatedThisWeek ?? 0}
          />
          <MetricCard
            label={`${t("widget.thisMonth")} (${monthRange.from} ${t("widget.dateSeparator")} ${monthRange.to})`}
            value={data?.leadsCreatedThisMonth ?? 0}
          />
        </MetricGrid>
      </SectionGroup>

      {/* Conversion funnel */}
      <ConversionFunnel
        data={data}
        funnelTitle={t("widget.conversionFunnel")}
        stageLabels={{
          totalLeads: t("widget.funnelTotalLeads"),
          campaignRunning: t("widget.funnelCampaignRunning"),
          signedUp: t("widget.funnelSignedUp"),
          subscriptionConfirmed: t("widget.funnelSubscriptionConfirmed"),
        }}
      />

      {/* Grouped stats breakdown */}
      {groupedStats && (
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Status - clickable rows */}
          {byStatusItems && byStatusItems.length > 0 && (
            <SectionGroup
              title={t("widget.byStatus")}
              subtitle={t("widget.clickToFilter")}
            >
              <Div className="flex flex-col gap-1">
                {byStatusItems.slice(0, 8).map((item) => (
                  <ClickableBarRow
                    key={item.category}
                    category={item.category}
                    value={item.value}
                    percentage={item.percentage}
                    barColor={
                      STATUS_BAR_COLORS[item.category] ?? "hsl(var(--primary))"
                    }
                    max={byStatusMax}
                    onClick={() => handleNavigateToStatus(item.category)}
                    leadsT={leadsT}
                  />
                ))}
              </Div>
            </SectionGroup>
          )}

          {/* By Source - clickable rows */}
          {bySourceItems && bySourceItems.length > 0 && (
            <SectionGroup
              title={t("widget.bySource")}
              subtitle={t("widget.clickToFilter")}
            >
              <Div className="flex flex-col gap-1">
                {bySourceItems.slice(0, 8).map((item) => (
                  <ClickableBarRow
                    key={item.category}
                    category={item.category}
                    value={item.value}
                    percentage={item.percentage}
                    barColor={
                      SOURCE_BAR_COLORS[item.category] ?? "hsl(var(--primary))"
                    }
                    max={bySourceMax}
                    onClick={() => handleNavigateToSource(item.category)}
                    leadsT={leadsT}
                  />
                ))}
              </Div>
            </SectionGroup>
          )}

          <RawGroupedStatsSection
            title={t("widget.byCountry")}
            items={groupedStats.byCountry}
          />
          <GroupedStatsSection
            title={t("widget.byCampaignStage")}
            items={groupedStats.byCampaignStage}
            leadsT={leadsT}
          />
        </Div>
      )}

      {/* Top performing campaigns */}
      {topCampaigns.length > 0 && (
        <SectionGroup title={t("widget.topPerformingCampaigns")}>
          <Div className="flex flex-col gap-2">
            {topCampaigns.slice(0, 5).map((campaign, i) => (
              <Div key={i} className="flex items-center gap-3 text-sm">
                <Span className="w-5 text-muted-foreground text-xs">
                  {i + 1}.
                </Span>
                <Span className="flex-1 truncate">{campaign.campaignName}</Span>
                {campaign.openRate !== null &&
                  campaign.openRate !== undefined && (
                    <Span className="text-xs text-muted-foreground">
                      {(campaign.openRate * 100).toFixed(1)}
                      {t("widget.openRateSuffix")}
                    </Span>
                  )}
                {campaign.leadsGenerated !== null &&
                  campaign.leadsGenerated !== undefined && (
                    <Span className="text-xs font-medium">
                      {campaign.leadsGenerated.toLocaleString()}
                    </Span>
                  )}
              </Div>
            ))}
          </Div>
        </SectionGroup>
      )}

      {/* Top sources */}
      {topSources.length > 0 && (
        <SectionGroup title={t("widget.topSources")}>
          <Div className="flex items-center justify-end -mt-2 mb-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={handleViewAllLeads}
            >
              <Users className="h-3 w-3 mr-1" />
              {t("widget.viewAll")}
            </Button>
          </Div>
          <Div className="flex flex-col gap-2">
            {topSources.slice(0, 5).map((src, i) => {
              const sourceName = leadsT(src.source);
              return (
                <Button
                  key={i}
                  type="button"
                  variant="ghost"
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 transition-colors w-full justify-start h-auto"
                  onClick={() => {
                    handleNavigateToSource(src.source);
                  }}
                >
                  <Span className="w-5 text-muted-foreground text-xs">
                    {i + 1}.
                  </Span>
                  <Span className="flex-1 truncate">{sourceName}</Span>
                  {src.conversionRate !== null &&
                    src.conversionRate !== undefined && (
                      <Span className="text-xs text-muted-foreground">
                        {(src.conversionRate * 100).toFixed(1)}
                        {t("widget.conversionRateSuffix")}
                      </Span>
                    )}
                  {src.leadsGenerated !== null &&
                    src.leadsGenerated !== undefined && (
                      <Span className="text-xs font-medium">
                        {src.leadsGenerated.toLocaleString()}
                      </Span>
                    )}
                  <Filter className="h-3 w-3 text-muted-foreground opacity-60 flex-shrink-0" />
                </Button>
              );
            })}
          </Div>
        </SectionGroup>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <SectionGroup title={t("widget.recentActivity")}>
          <Div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {recentActivity.slice(0, 20).map((act, i) => (
              <Div
                key={i}
                className="flex items-start gap-3 text-sm py-1 border-b last:border-0"
              >
                <Div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                <Div className="flex-1 min-w-0">
                  <Span className="text-muted-foreground text-xs">
                    {leadsT(act.type)}
                  </Span>
                  {act.leadEmail && (
                    <Span className="ml-2 truncate">{act.leadEmail}</Span>
                  )}
                  {act.details?.status && (
                    <Span className="ml-2 text-xs text-muted-foreground">
                      ({leadsT(act.details.status)})
                    </Span>
                  )}
                </Div>
                {act.timestamp && (
                  <Span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(act.timestamp).toLocaleDateString(locale)}
                  </Span>
                )}
              </Div>
            ))}
          </Div>
        </SectionGroup>
      )}
    </WidgetShell>
  );
}
