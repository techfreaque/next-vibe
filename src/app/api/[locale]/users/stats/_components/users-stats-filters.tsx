/**
 * Users Stats Filters Component
 * Provides filtering controls for users statistics following leads stats pattern
 */

"use client";

import { RefreshCw } from "next-vibe-ui/ui/icons";
import {
  ChartType,
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import type { JSX, ReactNode } from "react";
import type { Control, UseFormReturn } from "react-hook-form";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import {
  UserRoleFilter,
  UserStatusFilter,
} from "@/app/api/[locale]/users/enum";
import type statsEndpoints from "@/app/api/[locale]/users/stats/definition";
import { CountryFilterOptions, type CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UsersStatsFiltersContainerProps {
  locale: CountryLanguage;
  children: ReactNode;
  onRefresh?: () => void;
  title?: string;
  form: EndpointReturn<typeof statsEndpoints>["read"]["form"];
}

type StatsFormData = EndpointReturn<typeof statsEndpoints>["read"] extends {
  form: UseFormReturn<infer T>;
}
  ? T
  : never;

interface UsersStatsFiltersProps {
  control: Control<StatsFormData>;
}

export function UsersStatsFilters({
  control,
}: UsersStatsFiltersProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      {/* Base time and chart filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Period */}
        <EndpointFormField
          control={control}
          name="timePeriod"
          config={{
            type: "select",
            label: "app.admin.users.filters.timePeriod",
            options: [
              {
                value: TimePeriod.HOUR,
                label: "app.admin.users.filters.timePeriods.hour",
              },
              {
                value: TimePeriod.DAY,
                label: "app.admin.users.filters.timePeriods.day",
              },
              {
                value: TimePeriod.WEEK,
                label: "app.admin.users.filters.timePeriods.week",
              },
              {
                value: TimePeriod.MONTH,
                label: "app.admin.users.filters.timePeriods.month",
              },
              {
                value: TimePeriod.QUARTER,
                label: "app.admin.users.filters.timePeriods.quarter",
              },
              {
                value: TimePeriod.YEAR,
                label: "app.admin.users.filters.timePeriods.year",
              },
            ],
          }}
        />

        {/* Date Range Preset */}
        <EndpointFormField
          control={control}
          name="dateRangePreset"
          config={{
            type: "select",
            label: "app.admin.users.filters.dateRange",
            options: [
              {
                value: DateRangePreset.TODAY,
                label: "app.admin.users.filters.dateRanges.today",
              },
              {
                value: DateRangePreset.YESTERDAY,
                label: "app.admin.users.filters.dateRanges.yesterday",
              },
              {
                value: DateRangePreset.LAST_7_DAYS,
                label: "app.admin.users.filters.dateRanges.last7Days",
              },
              {
                value: DateRangePreset.LAST_30_DAYS,
                label: "app.admin.users.filters.dateRanges.last30Days",
              },
              {
                value: DateRangePreset.LAST_90_DAYS,
                label: "app.admin.users.filters.dateRanges.last90Days",
              },
              {
                value: DateRangePreset.THIS_MONTH,
                label: "app.admin.users.filters.dateRanges.thisMonth",
              },
              {
                value: DateRangePreset.LAST_MONTH,
                label: "app.admin.users.filters.dateRanges.lastMonth",
              },
              {
                value: DateRangePreset.THIS_QUARTER,
                label: "app.admin.users.filters.dateRanges.thisQuarter",
              },
              {
                value: DateRangePreset.LAST_QUARTER,
                label: "app.admin.users.filters.dateRanges.lastQuarter",
              },
              {
                value: DateRangePreset.THIS_YEAR,
                label: "app.admin.users.filters.dateRanges.thisYear",
              },
              {
                value: DateRangePreset.LAST_YEAR,
                label: "app.admin.users.filters.dateRanges.lastYear",
              },
            ],
          }}
        />

        {/* Chart Type */}
        <EndpointFormField
          control={control}
          name="chartType"
          config={{
            type: "select",
            label: "app.admin.users.filters.chartType",
            options: [
              {
                value: ChartType.LINE,
                label: "app.admin.users.filters.chartTypes.line",
              },
              {
                value: ChartType.BAR,
                label: "app.admin.users.filters.chartTypes.bar",
              },
              {
                value: ChartType.AREA,
                label: "app.admin.users.filters.chartTypes.area",
              },
            ],
          }}
        />
      </Div>

      {/* User-specific filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          config={{
            type: "select",
            label: "app.admin.users.filters.status",
            options: [
              {
                value: UserStatusFilter.ALL,
                label: "app.admin.users.filters.statuses.all",
              },
              {
                value: UserStatusFilter.ACTIVE,
                label: "app.admin.users.filters.statuses.active",
              },
              {
                value: UserStatusFilter.INACTIVE,
                label: "app.admin.users.filters.statuses.inactive",
              },
              {
                value: UserStatusFilter.EMAIL_VERIFIED,
                label: "app.admin.users.filters.statuses.emailVerified",
              },
              {
                value: UserStatusFilter.EMAIL_UNVERIFIED,
                label: "app.admin.users.filters.statuses.emailUnverified",
              },
            ],
          }}
        />

        {/* Country Filter */}
        <EndpointFormField
          control={control}
          name="country"
          config={{
            type: "select",
            label: "app.admin.users.filters.country",
            options: CountryFilterOptions,
          }}
        />

        {/* Role Filter */}
        <EndpointFormField
          control={control}
          name="role"
          config={{
            type: "select",
            label: "app.admin.users.filters.role",
            options: [
              {
                value: UserRoleFilter.ALL,
                label: "app.admin.users.filters.roles.all",
              },
              {
                value: UserRoleFilter.PUBLIC,
                label: "app.admin.users.filters.roles.public",
              },
              {
                value: UserRoleFilter.CUSTOMER,
                label: "app.admin.users.filters.roles.customer",
              },
              {
                value: UserRoleFilter.PARTNER_ADMIN,
                label: "app.admin.users.filters.roles.partnerAdmin",
              },
              {
                value: UserRoleFilter.ADMIN,
                label: "app.admin.users.filters.roles.admin",
              },
            ],
          }}
        />
      </Div>

      {/* Advanced options */}
      <Div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Include Comparison */}
        <EndpointFormField
          control={control}
          name="includeComparison"
          config={{
            type: "checkbox",
            label: "app.admin.users.filters.includeComparison",
            description: "app.admin.users.filters.includeComparisonDescription",
          }}
        />
      </Div>
    </Div>
  );
}

/**
 * Container for users stats filters with refresh functionality
 */
export function UsersStatsFiltersContainer({
  locale,
  children,
  onRefresh,
  title,
  form,
}: UsersStatsFiltersContainerProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Form form={form}>
      <Div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">
              {title || t("app.admin.common.filter")}
            </CardTitle>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("app.admin.common.refresh")}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">{children}</CardContent>
        </Card>
      </Div>
    </Form>
  );
}
