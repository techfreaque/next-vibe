/**
 * Leads Stats Custom Widget
 * Rich analytics dashboard for leads statistics
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Download,
  Filter,
  List,
  Minus,
  RefreshCw,
  Search,
  Upload,
  Users,
  Zap,
} from "next-vibe-ui/ui/icons";
import { Input } from "next-vibe-ui/ui/input";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NumberFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/number-field/react";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/react";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type definition from "./definition";

type GetResponseOutput = typeof definition.GET.types.ResponseOutput;

interface CustomWidgetProps {
  field: {
    value: GetResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

// ─── Trend computation ────────────────────────────────────────────────────────

type TrendDirection = "up" | "down" | "neutral";

interface ActivityRecord {
  timestamp?: string;
  createdAt?: string;
}

function computeTrend(recentActivity: ActivityRecord[]): TrendDirection {
  // Use the recentActivity timestamps to proxy a trend — if more than half of
  // the last-10 items are within the past 2 days, we call it "up".
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

function getWeekRange(): { from: string; to: string } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    from: monday.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    to: sunday.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  };
}

function getMonthRange(): { from: string; to: string } {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    from: first.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    to: last.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendIcon({
  direction,
  className,
}: {
  direction: TrendDirection;
  className?: string;
}): React.JSX.Element {
  if (direction === "up") {
    return (
      <ArrowUp
        className={cn("h-3 w-3 text-green-500 dark:text-green-400", className)}
      />
    );
  }
  if (direction === "down") {
    return (
      <ArrowDown
        className={cn("h-3 w-3 text-red-500 dark:text-red-400", className)}
      />
    );
  }
  return <Minus className={cn("h-3 w-3 text-muted-foreground", className)} />;
}

function StatCard({
  label,
  value,
  format = "number",
  variant = "default",
  trend,
}: {
  label: string;
  value: number | null | undefined;
  format?: "number" | "percent" | "compact";
  variant?: "default" | "success" | "warning" | "danger" | "info";
  trend?: TrendDirection;
}): React.JSX.Element {
  const variantClass = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
    info: "text-blue-600 dark:text-blue-400",
  }[variant];

  const formatted = useMemo(() => {
    if (value === null || value === undefined) {
      return "—";
    }
    if (format === "percent") {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (format === "compact" && value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  }, [value, format]);

  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Div className="flex items-center justify-between">
        <Span className="text-xs text-muted-foreground">{label}</Span>
        {trend !== null && trend !== undefined && (
          <TrendIcon direction={trend} />
        )}
      </Div>
      <Span className={cn("text-2xl font-bold tabular-nums", variantClass)}>
        {formatted}
      </Span>
    </Div>
  );
}

// ─── Clickable bar row (for By Status / By Source) ────────────────────────────

function ClickableBarRow({
  category,
  value,
  percentage,
  barColor,
  max,
  onClick,
  t,
}: {
  category: string;
  value: number;
  percentage?: number;
  barColor: string;
  max: number;
  onClick?: () => void;
  t: (key: string) => string;
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
        {t(category)}
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
  t,
}: {
  title: string;
  items:
    | Array<{ category: string; value: number; percentage?: number }>
    | undefined;
  colorMap?: Record<string, string>;
  t: (key: string) => string;
}): React.JSX.Element | null {
  if (!items?.length) {
    return null;
  }
  const top = items.slice(0, 8);
  const max = Math.max(...top.map((i) => i.value), 1);

  return (
    <Div className="rounded-lg border bg-card p-4">
      <Span className="text-sm font-semibold mb-3 block">{title}</Span>
      <Div className="flex flex-col gap-1">
        {top.map((item) => (
          <ClickableBarRow
            key={item.category}
            category={item.category}
            value={item.value}
            percentage={item.percentage}
            barColor={colorMap?.[item.category] ?? "hsl(var(--primary))"}
            max={max}
            t={t}
          />
        ))}
      </Div>
    </Div>
  );
}

// ─── Conversion funnel visualization ─────────────────────────────────────────

function ConversionFunnel({
  data,
  funnelTitle,
  stageLabels,
}: {
  data: GetResponseOutput | null | undefined;
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
    key: keyof GetResponseOutput;
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
                    <Span className="text-red-500 dark:text-red-400">
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
  "app.api.leads.enums.leadStatus.new": "#3b82f6",
  "app.api.leads.enums.leadStatus.pending": "#eab308",
  "app.api.leads.enums.leadStatus.campaignRunning": "#a855f7",
  "app.api.leads.enums.leadStatus.websiteUser": "#06b6d4",
  "app.api.leads.enums.leadStatus.newsletterSubscriber": "#6366f1",
  "app.api.leads.enums.leadStatus.inContact": "#f97316",
  "app.api.leads.enums.leadStatus.signedUp": "#14b8a6",
  "app.api.leads.enums.leadStatus.subscriptionConfirmed": "#22c55e",
  "app.api.leads.enums.leadStatus.unsubscribed": "#9ca3af",
  "app.api.leads.enums.leadStatus.bounced": "#ef4444",
  "app.api.leads.enums.leadStatus.invalid": "#b91c1c",
};

const SOURCE_BAR_COLORS: Record<string, string> = {
  "app.api.leads.enums.leadSource.website": "#3b82f6",
  "app.api.leads.enums.leadSource.referral": "#22c55e",
  "app.api.leads.enums.leadSource.socialMedia": "#ec4899",
  "app.api.leads.enums.leadSource.emailCampaign": "#eab308",
  "app.api.leads.enums.leadSource.csvImport": "#f97316",
};

// ─── Quick action buttons ─────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "outline" | "ghost" | "default" | "secondary";
}

function QuickActionButton({
  label,
  icon,
  onClick,
  variant = "outline",
}: QuickActionProps): React.JSX.Element {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-1.5 h-8 text-xs"
    >
      {icon}
      {label}
    </Button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LeadsStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm<typeof definition.GET>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const data = field.value;

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
  const weekRange = useMemo(() => getWeekRange(), []);
  const monthRange = useMemo(() => getMonthRange(), []);

  // ── Navigation handlers ──────────────────────────────────────────────────

  const handleViewAllLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleSearchLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleExportLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/export`);
  }, [router, locale]);

  const handleImportLeads = useCallback((): void => {
    router.push(`/${locale}/admin/leads/import`);
  }, [router, locale]);

  const handleBatchUpdate = useCallback((): void => {
    router.push(`/${locale}/admin/leads/batch`);
  }, [router, locale]);

  const handleNavigateToStatus = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

  const handleNavigateToSource = useCallback((): void => {
    router.push(`/${locale}/admin/leads/list`);
  }, [router, locale]);

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
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <BarChart2 className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.leads.stats.widget.title")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.leads.stats.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Quick action buttons */}
      <Div className="flex flex-wrap gap-2">
        <QuickActionButton
          label={t("app.api.leads.stats.widget.viewAllLeads")}
          icon={<List className="h-3.5 w-3.5" />}
          onClick={handleViewAllLeads}
          variant="default"
        />
        <QuickActionButton
          label={t("app.api.leads.stats.widget.searchLeads")}
          icon={<Search className="h-3.5 w-3.5" />}
          onClick={handleSearchLeads}
        />
        <QuickActionButton
          label={t("app.api.leads.stats.widget.export")}
          icon={<Download className="h-3.5 w-3.5" />}
          onClick={handleExportLeads}
        />
        <QuickActionButton
          label={t("app.api.leads.stats.widget.import")}
          icon={<Upload className="h-3.5 w-3.5" />}
          onClick={handleImportLeads}
        />
        <QuickActionButton
          label={t("app.api.leads.stats.widget.batchUpdate")}
          icon={<Zap className="h-3.5 w-3.5" />}
          onClick={handleBatchUpdate}
        />
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
          {t("app.api.leads.stats.widget.filters")}
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
                  value={String(form?.watch(key) ?? "")}
                  onChange={(e) => {
                    form?.setValue(key, new Date(e.target.value));
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
                  checked={(form?.watch(key) as boolean | undefined) ?? false}
                  onCheckedChange={(checked) => {
                    form?.setValue(key, checked === true);
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
            {t("app.api.leads.stats.widget.applyFilters")}
          </Button>
        </Div>
      )}

      {/* KPI overview */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("app.api.leads.stats.widget.totalLeads")}
          value={data?.totalLeads}
          trend={trend}
        />
        <StatCard
          label={t("app.api.leads.stats.widget.activeLeads")}
          value={data?.activeLeads}
          variant="info"
          trend={trend}
        />
        <StatCard
          label={t("app.api.leads.stats.widget.converted")}
          value={data?.convertedLeads}
          variant="success"
          trend={trend}
        />
        <StatCard
          label={t("app.api.leads.stats.widget.conversionRate")}
          value={data?.conversionRate}
          format="percent"
          variant="success"
          trend={trend}
        />
      </Div>

      {/* Email performance */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("app.api.leads.stats.widget.openRate")}
          value={data?.averageOpenRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("app.api.leads.stats.widget.clickRate")}
          value={data?.averageClickRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("app.api.leads.stats.widget.unsubscribeRate")}
          value={data?.signupRate}
          format="percent"
          variant="default"
        />
        <StatCard
          label={t("app.api.leads.stats.widget.newThisMonth")}
          value={data?.leadsCreatedThisMonth}
          variant="info"
        />
      </Div>

      {/* New leads timeline — with explicit date ranges */}
      <Div className="rounded-lg border bg-card p-4">
        <Span className="text-sm font-semibold mb-3 block">
          {t("app.api.leads.stats.widget.newLeadsTimeline")}
        </Span>
        <Div className="grid grid-cols-3 gap-3">
          <Div className="flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {t("app.api.leads.stats.widget.today")} (
              {new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
              )
            </Span>
            <Span className="text-2xl font-bold tabular-nums">
              {data?.leadsCreatedToday?.toLocaleString() ??
                t("app.api.leads.stats.widget.emDash")}
            </Span>
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {t("app.api.leads.stats.widget.thisWeek")} ({weekRange.from}{" "}
              {t("app.api.leads.stats.widget.dateSeparator")} {weekRange.to})
            </Span>
            <Span className="text-2xl font-bold tabular-nums">
              {data?.leadsCreatedThisWeek?.toLocaleString() ??
                t("app.api.leads.stats.widget.emDash")}
            </Span>
          </Div>
          <Div className="flex flex-col gap-1">
            <Span className="text-xs text-muted-foreground">
              {t("app.api.leads.stats.widget.thisMonth")} ({monthRange.from}{" "}
              {t("app.api.leads.stats.widget.dateSeparator")} {monthRange.to})
            </Span>
            <Span className="text-2xl font-bold tabular-nums">
              {data?.leadsCreatedThisMonth?.toLocaleString() ??
                t("app.api.leads.stats.widget.emDash")}
            </Span>
          </Div>
        </Div>
      </Div>

      {/* Conversion funnel */}
      <ConversionFunnel
        data={data}
        funnelTitle={t("app.api.leads.stats.widget.conversionFunnel")}
        stageLabels={{
          totalLeads: t("app.api.leads.stats.widget.funnelTotalLeads"),
          campaignRunning: t(
            "app.api.leads.stats.widget.funnelCampaignRunning",
          ),
          signedUp: t("app.api.leads.stats.widget.funnelSignedUp"),
          subscriptionConfirmed: t(
            "app.api.leads.stats.widget.funnelSubscriptionConfirmed",
          ),
        }}
      />

      {/* Grouped stats breakdown */}
      {groupedStats && (
        <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By Status — clickable rows */}
          {byStatusItems && byStatusItems.length > 0 && (
            <Div className="rounded-lg border bg-card p-4">
              <Div className="flex items-center gap-2 mb-3">
                <Span className="text-sm font-semibold">
                  {t("app.api.leads.stats.widget.byStatus")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.stats.widget.clickToFilter")}
                </Span>
              </Div>
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
                    onClick={() => handleNavigateToStatus()}
                    t={t}
                  />
                ))}
              </Div>
            </Div>
          )}

          {/* By Source — clickable rows */}
          {bySourceItems && bySourceItems.length > 0 && (
            <Div className="rounded-lg border bg-card p-4">
              <Div className="flex items-center gap-2 mb-3">
                <Span className="text-sm font-semibold">
                  {t("app.api.leads.stats.widget.bySource")}
                </Span>
                <Span className="text-xs text-muted-foreground">
                  {t("app.api.leads.stats.widget.clickToFilter")}
                </Span>
              </Div>
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
                    onClick={() => handleNavigateToSource()}
                    t={t}
                  />
                ))}
              </Div>
            </Div>
          )}

          <GroupedStatsSection
            title={t("app.api.leads.stats.widget.byCountry")}
            items={groupedStats.byCountry}
            t={t}
          />
          <GroupedStatsSection
            title={t("app.api.leads.stats.widget.byCampaignStage")}
            items={groupedStats.byCampaignStage}
            t={t}
          />
        </Div>
      )}

      {/* Top performing campaigns */}
      {topCampaigns.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Span className="text-sm font-semibold mb-3 block">
            {t("app.api.leads.stats.widget.topPerformingCampaigns")}
          </Span>
          <Div className="flex flex-col gap-2">
            {topCampaigns.slice(0, 5).map((campaign, i) => {
              return (
                <Div key={i} className="flex items-center gap-3 text-sm">
                  <Span className="w-5 text-muted-foreground text-xs">
                    {i + 1}.
                  </Span>
                  <Span className="flex-1 truncate">
                    {t(campaign.campaignName)}
                  </Span>
                  {campaign.openRate !== null &&
                    campaign.openRate !== undefined && (
                      <Span className="text-xs text-muted-foreground">
                        {(campaign.openRate * 100).toFixed(1)}
                        {t("app.api.leads.stats.widget.openRateSuffix")}
                      </Span>
                    )}
                  {campaign.leadsGenerated !== null &&
                    campaign.leadsGenerated !== undefined && (
                      <Span className="text-xs font-medium">
                        {campaign.leadsGenerated.toLocaleString()}
                      </Span>
                    )}
                </Div>
              );
            })}
          </Div>
        </Div>
      )}

      {/* Top sources */}
      {topSources.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center justify-between mb-3">
            <Span className="text-sm font-semibold">
              {t("app.api.leads.stats.widget.topSources")}
            </Span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-2"
              onClick={handleViewAllLeads}
            >
              <Users className="h-3 w-3 mr-1" />
              {t("app.api.leads.stats.widget.viewAll")}
            </Button>
          </Div>
          <Div className="flex flex-col gap-2">
            {topSources.slice(0, 5).map((src, i) => {
              const sourceName = t(src.source);
              return (
                <Button
                  key={i}
                  type="button"
                  variant="ghost"
                  className="flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 transition-colors w-full justify-start h-auto"
                  onClick={() => {
                    handleNavigateToSource();
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
                        {t("app.api.leads.stats.widget.conversionRateSuffix")}
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
        </Div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Span className="text-sm font-semibold mb-3 block">
            {t("app.api.leads.stats.widget.recentActivity")}
          </Span>
          <Div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {recentActivity.slice(0, 20).map((act, i) => {
              return (
                <Div
                  key={i}
                  className="flex items-start gap-3 text-sm py-1 border-b last:border-0"
                >
                  <Div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <Div className="flex-1 min-w-0">
                    <Span className="text-muted-foreground text-xs">
                      {t(act.type)}
                    </Span>
                    {act.leadEmail && (
                      <Span className="ml-2 truncate">{act.leadEmail}</Span>
                    )}
                    {act.details?.status && (
                      <Span className="ml-2 text-xs text-muted-foreground">
                        ({t(act.details.status)})
                      </Span>
                    )}
                  </Div>
                  {act.timestamp && (
                    <Span className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date(act.timestamp).toLocaleDateString()}
                    </Span>
                  )}
                </Div>
              );
            })}
          </Div>
        </Div>
      )}
    </Div>
  );
}
