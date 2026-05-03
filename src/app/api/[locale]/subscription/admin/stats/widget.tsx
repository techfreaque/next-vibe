/**
 * Subscription Admin Stats Custom Widget
 * Revenue, subscription, credit and referral analytics dashboard
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { SelectFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/select-field/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";

import type definition from "./definition";

interface CustomWidgetProps {
  field: (typeof definition.GET)["fields"];
}

const variantColorMap: Record<
  "default" | "success" | "warning" | "danger" | "info",
  string | undefined
> = {
  default: undefined,
  success: "#16a34a",
  warning: "#ca8a04",
  danger: "#dc2626",
  info: "#2563eb",
};

function StatCard({
  label,
  value,
  format = "number",
  variant = "default",
}: {
  label: string;
  value: number | null | undefined;
  format?: "number" | "percent" | "compact" | "currency";
  variant?: "default" | "success" | "warning" | "danger" | "info";
}): React.JSX.Element {
  const variantColor = variantColorMap[variant];

  const formatted = useMemo(() => {
    if (value === null || value === undefined) {
      return "\u2014";
    }
    if (format === "percent") {
      return `${(value * 100).toFixed(1)}%`;
    }
    if (format === "currency") {
      return `$${(value / 100).toFixed(2)}`;
    }
    if (format === "compact" && value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toLocaleString();
  }, [value, format]);

  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Div className="text-xs text-muted-foreground">{label}</Div>
      <Div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          ...(variantColor !== undefined ? { color: variantColor } : {}),
        }}
      >
        {formatted}
      </Div>
    </Div>
  );
}

function BarChartSection({
  title,
  items,
}: {
  title: string;
  items: Array<{ x: string; y: number; label?: string }> | undefined;
}): React.JSX.Element | null {
  if (!items?.length) {
    return null;
  }
  const top = items.slice(0, 8);
  const max = Math.max(...top.map((i) => i.y), 1);

  return (
    <Div className="rounded-lg border bg-card p-4">
      <Span className="text-sm font-semibold mb-3 block">{title}</Span>
      <Div className="flex flex-col gap-2">
        {top.map((item) => (
          <Div key={item.x} className="flex items-center gap-2">
            <Span className="text-xs text-muted-foreground w-28 truncate flex-shrink-0">
              {(item.label ?? item.x).replace(/_/g, " ")}
            </Span>
            <Div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <Div
                style={{
                  width: `${(item.y / max) * 100}%`,
                  height: "100%",
                  borderRadius: "9999px",
                  backgroundColor: "#3b82f6",
                }}
              />
            </Div>
            <Span className="text-xs tabular-nums w-16 text-right">
              {item.y >= 100
                ? `$${(item.y / 100).toFixed(0)}`
                : item.y.toLocaleString()}
            </Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

export function SubscriptionStatsContainer({
  field,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.GET>();
  const onSubmit = useWidgetOnSubmit();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const data = useWidgetValue<typeof definition.GET>();

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewList = useCallback((): void => {
    void (async (): Promise<void> => {
      const listDef = await import("../list/definition");
      navigate(listDef.default.GET);
    })();
  }, [navigate]);

  const handleApplyFilters = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const revenueStats = data?.revenueStats;
  const subscriptionStats = data?.subscriptionStats;
  const intervalStats = data?.intervalStats;
  const creditStats = data?.creditStats;
  const referralStats = data?.referralStats;
  const growthMetrics = data?.growthMetrics;
  const generatedAt = data?.businessInsights?.generatedAt;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">{t("get.title")}</Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setFiltersOpen((v) => !v);
          }}
          title="Filters"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
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

      {/* Filter panel */}
      {filtersOpen && (
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Span className="text-sm font-semibold">
            {t("get.timePeriodOptions.title")}
          </Span>
          <Div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectFieldWidget
              fieldName={"timePeriodOptions.timePeriod"}
              field={children.timePeriodOptions.children.timePeriod}
            />
            <SelectFieldWidget
              fieldName={"timePeriodOptions.dateRangePreset"}
              field={children.timePeriodOptions.children.dateRangePreset}
            />
          </Div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleApplyFilters}
            className="self-start"
          >
            {t("widget.refresh")}
          </Button>
        </Div>
      )}

      {/* Action buttons */}
      <Div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewList}
        >
          {t("get.response.subscriptionStats.title")}
        </Button>
      </Div>

      {/* Revenue KPIs */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.revenueStats.mrr.label")}
          value={revenueStats?.mrr}
          format="currency"
          variant="success"
        />
        <StatCard
          label={t("get.response.revenueStats.arr.label")}
          value={revenueStats?.arr}
          format="currency"
          variant="success"
        />
        <StatCard
          label={t("get.response.revenueStats.totalRevenue.label")}
          value={revenueStats?.totalRevenue}
          format="currency"
          variant="info"
        />
        <StatCard
          label={t("get.response.revenueStats.avgOrderValue.label")}
          value={revenueStats?.avgOrderValue}
          format="currency"
          variant="info"
        />
      </Div>

      {/* Subscription KPIs */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.subscriptionStats.activeCount.label")}
          value={subscriptionStats?.activeCount}
          variant="success"
        />
        <StatCard
          label={t("get.response.subscriptionStats.trialingCount.label")}
          value={subscriptionStats?.trialingCount}
          variant="info"
        />
        <StatCard
          label={t("get.response.subscriptionStats.canceledCount.label")}
          value={subscriptionStats?.canceledCount}
          variant="warning"
        />
        <StatCard
          label={t("get.response.subscriptionStats.churnRate.label")}
          value={subscriptionStats?.churnRate}
          format="percent"
          variant="warning"
        />
      </Div>

      {/* Interval breakdown */}
      <Div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t("get.response.intervalStats.monthlyCount.label")}
          value={intervalStats?.monthlyCount}
          variant="info"
        />
        <StatCard
          label={t("get.response.intervalStats.yearlyCount.label")}
          value={intervalStats?.yearlyCount}
          variant="success"
        />
        <StatCard
          label={t("get.response.intervalStats.yearlyRevenuePct.label")}
          value={intervalStats?.yearlyRevenuePct}
          format="percent"
          variant="info"
        />
      </Div>

      {/* Credit KPIs */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.creditStats.totalPurchased.label")}
          value={creditStats?.totalPurchased}
          format="compact"
          variant="success"
        />
        <StatCard
          label={t("get.response.creditStats.totalSpent.label")}
          value={creditStats?.totalSpent}
          format="compact"
          variant="warning"
        />
        <StatCard
          label={t("get.response.creditStats.packsSold.label")}
          value={creditStats?.packsSold}
          format="compact"
          variant="info"
        />
        <StatCard
          label={t("get.response.creditStats.avgPackSize.label")}
          value={creditStats?.avgPackSize}
          format="compact"
          variant="info"
        />
      </Div>

      {/* Referral KPIs */}
      <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label={t("get.response.referralStats.totalReferrals.label")}
          value={referralStats?.totalReferrals}
          variant="info"
        />
        <StatCard
          label={t("get.response.referralStats.conversionRate.label")}
          value={referralStats?.conversionRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("get.response.referralStats.totalEarned.label")}
          value={referralStats?.totalEarned}
          format="currency"
          variant="success"
        />
        <StatCard
          label={t("get.response.referralStats.pendingPayouts.label")}
          value={referralStats?.pendingPayouts}
          format="currency"
          variant="warning"
        />
      </Div>

      {/* Charts */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartSection
          title={t("get.response.growthMetrics.revenueChart.label")}
          items={growthMetrics?.revenueChart}
        />
        <BarChartSection
          title={t("get.response.growthMetrics.subscriptionChart.label")}
          items={growthMetrics?.subscriptionChart}
        />
      </Div>

      {/* Generated at */}
      {generatedAt && (
        <Div className="text-xs text-muted-foreground text-right">
          {t("get.response.businessInsights.generatedAt.label")}{" "}
          {generatedAt.toLocaleString()}
        </Div>
      )}
    </Div>
  );
}
