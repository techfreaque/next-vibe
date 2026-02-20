/**
 * Users Stats Custom Widget
 * Rich analytics dashboard for users statistics
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { Filter, RefreshCw, UserPlus, Users } from "next-vibe-ui/ui/icons";
import { Label } from "next-vibe-ui/ui/label";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
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
      return "—";
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
            <Span className="text-xs tabular-nums w-10 text-right">
              {item.y}
            </Span>
          </Div>
        ))}
      </Div>
    </Div>
  );
}

export function UsersStatsContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();
  const onSubmit = useWidgetOnSubmit();
  const form = useWidgetForm();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const data = field.value;

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewUsers = useCallback((): void => {
    router.push(`/${locale}/admin/users/list`);
  }, [router, locale]);

  const handleCreateUser = useCallback((): void => {
    router.push(`/${locale}/admin/users/create`);
  }, [router, locale]);

  const handleApplyFilters = useCallback((): void => {
    if (onSubmit) {
      onSubmit();
    } else {
      endpointMutations?.read?.refetch?.();
    }
  }, [onSubmit, endpointMutations]);

  const includeComparison: boolean =
    (form?.watch("timePeriodOptions.includeComparison") as
      | boolean
      | undefined) ?? false;

  const overviewStats = data?.overviewStats;
  const paymentStats = data?.paymentStats;
  const emailStats = data?.emailStats;
  const growthMetrics = data?.growthMetrics;
  const roleDistribution = data?.roleDistribution;
  const subscriptionStats = data?.subscriptionStats;
  const generatedAt = data?.businessInsights?.generatedAt;

  // Derive averageRevenuePerUser from totalRevenue / totalUsers
  const averageRevenuePerUser = useMemo(() => {
    const total = paymentStats?.totalRevenue;
    const users = overviewStats?.totalUsers;
    if (
      total === null ||
      total === undefined ||
      users === null ||
      users === undefined ||
      users === 0
    ) {
      return null;
    }
    return Math.round(total / users);
  }, [paymentStats?.totalRevenue, overviewStats?.totalUsers]);

  // Build country breakdown from growthChart as a proxy (not available directly)
  // roleChart and subscriptionChart are available
  const roleChartItems = roleDistribution?.roleChart;
  const subscriptionChartItems = subscriptionStats?.subscriptionChart;
  const growthChartItems = growthMetrics?.growthChart;

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Users className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t("app.api.users.stats.widget.headerTitle")}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setFiltersOpen((v) => !v);
          }}
          title={t("app.api.users.stats.widget.filters")}
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.users.stats.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Filter panel */}
      {filtersOpen && (
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Span className="text-sm font-semibold">
            {t("app.api.users.stats.widget.filtersTitle")}
          </Span>
          <Div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <TextFieldWidget
              fieldName={`${fieldName}.basicFilters.search`}
              field={children.basicFilters.children.search}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.basicFilters.status`}
              field={children.basicFilters.children.status}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.basicFilters.role`}
              field={children.basicFilters.children.role}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.subscriptionFilters.subscriptionStatus`}
              field={children.subscriptionFilters.children.subscriptionStatus}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.subscriptionFilters.paymentMethod`}
              field={children.subscriptionFilters.children.paymentMethod}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.locationFilters.country`}
              field={children.locationFilters.children.country}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.locationFilters.language`}
              field={children.locationFilters.children.language}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.timePeriodOptions.timePeriod`}
              field={children.timePeriodOptions.children.timePeriod}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.timePeriodOptions.dateRangePreset`}
              field={children.timePeriodOptions.children.dateRangePreset}
            />
            <SelectFieldWidget
              fieldName={`${fieldName}.timePeriodOptions.chartType`}
              field={children.timePeriodOptions.children.chartType}
            />
          </Div>
          <Label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={includeComparison}
              onCheckedChange={(checked) => {
                form?.setValue(
                  "timePeriodOptions.includeComparison",
                  checked === true,
                );
              }}
            />
            <Span className="text-sm">
              {children.timePeriodOptions.children.includeComparison.label}
            </Span>
          </Label>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleApplyFilters}
            className="self-start"
          >
            {t("app.api.users.stats.widget.applyFilters")}
          </Button>
        </Div>
      )}

      {/* Action buttons */}
      <Div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewUsers}
        >
          <Users className="h-4 w-4 mr-1" />
          {t("app.api.users.stats.widget.viewUsers")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCreateUser}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          {t("app.api.users.stats.widget.createUser")}
        </Button>
      </Div>

      {/* KPI overview: user counts */}
      <Div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard
          label={t("app.api.users.stats.widget.labelTotalUsers")}
          value={overviewStats?.totalUsers}
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelActiveUsers")}
          value={overviewStats?.activeUsers}
          variant="success"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelNewToday")}
          value={growthMetrics?.timeSeriesData?.usersCreatedToday}
          variant="info"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelNewThisWeek")}
          value={growthMetrics?.timeSeriesData?.usersCreatedThisWeek}
          variant="info"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelNewThisMonth")}
          value={growthMetrics?.timeSeriesData?.usersCreatedThisMonth}
          variant="info"
        />
      </Div>

      {/* KPI revenue */}
      <Div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t("app.api.users.stats.widget.labelTotalRevenue")}
          value={paymentStats?.totalRevenue}
          format="currency"
          variant="success"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelAvgRevenuePerUser")}
          value={averageRevenuePerUser}
          format="currency"
          variant="info"
        />
      </Div>

      {/* Email / newsletter stats */}
      <Div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t("app.api.users.stats.widget.labelEmailVerified")}
          value={emailStats?.emailVerifiedUsers}
          variant="success"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelVerificationRate")}
          value={emailStats?.verificationRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelEmailUnverified")}
          value={emailStats?.emailUnverifiedUsers}
          variant="warning"
        />
      </Div>

      {/* Performance rates */}
      <Div className="grid grid-cols-3 gap-3">
        <StatCard
          label={t("app.api.users.stats.widget.labelGrowthRate")}
          value={growthMetrics?.performanceRates?.growthRate}
          format="percent"
          variant="success"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelLeadUserCvr")}
          value={growthMetrics?.performanceRates?.leadToUserConversionRate}
          format="percent"
          variant="info"
        />
        <StatCard
          label={t("app.api.users.stats.widget.labelRetentionRate")}
          value={growthMetrics?.performanceRates?.retentionRate}
          format="percent"
          variant="success"
        />
      </Div>

      {/* Grouped breakdowns as bar charts */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BarChartSection
          title={t("app.api.users.stats.widget.chartByRole")}
          items={roleChartItems}
        />
        <BarChartSection
          title={t("app.api.users.stats.widget.chartBySubscriptionStatus")}
          items={subscriptionChartItems}
        />
        <BarChartSection
          title={t("app.api.users.stats.widget.chartGrowthOverTime")}
          items={growthChartItems}
        />
      </Div>

      {/* Recent signups (time-series summary) */}
      <Div className="rounded-lg border bg-card p-4">
        <Span className="text-sm font-semibold mb-3 block">
          {t("app.api.users.stats.widget.recentSignupsSummary")}
        </Span>
        <Div className="flex flex-col gap-2">
          {[
            {
              label: t("app.api.users.stats.widget.rowToday"),
              value: growthMetrics?.timeSeriesData?.usersCreatedToday,
            },
            {
              label: t("app.api.users.stats.widget.rowThisWeek"),
              value: growthMetrics?.timeSeriesData?.usersCreatedThisWeek,
            },
            {
              label: t("app.api.users.stats.widget.rowThisMonth"),
              value: growthMetrics?.timeSeriesData?.usersCreatedThisMonth,
            },
            {
              label: t("app.api.users.stats.widget.rowLastMonth"),
              value: growthMetrics?.timeSeriesData?.usersCreatedLastMonth,
            },
          ].map((row) => (
            <Div
              key={row.label}
              className="flex items-center justify-between text-sm py-1 border-b last:border-0"
            >
              <Span className="text-muted-foreground">{row.label}</Span>
              <Span className="font-medium tabular-nums">
                {row.value !== null && row.value !== undefined
                  ? row.value.toLocaleString()
                  : "—"}
              </Span>
            </Div>
          ))}
        </Div>
      </Div>

      {/* Generated at */}
      {generatedAt && (
        <Div className="text-xs text-muted-foreground text-right">
          {t("app.api.users.stats.widget.generatedAt")}{" "}
          {generatedAt.toLocaleString()}
        </Div>
      )}
    </Div>
  );
}
