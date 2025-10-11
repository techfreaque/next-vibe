/**
 * Users Stats Filters Component
 * Provides filtering controls for users statistics following leads stats pattern
 */

"use client";

import { RefreshCw } from "lucide-react";
import {
  ChartType,
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX, ReactNode } from "react";
import type { Control } from "react-hook-form";

import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import {
  UserRoleFilter,
  UserStatusFilter,
} from "@/app/api/[locale]/v1/core/users/enum";
import type { UserStatsRequestType } from "@/app/api/[locale]/v1/core/users/stats/definition";
import type statsEndpoints from "@/app/api/[locale]/v1/core/users/stats/definition";
import { Countries, type CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface UsersStatsFiltersContainerProps {
  locale: CountryLanguage;
  children: ReactNode;
  onRefresh?: () => void;
  title?: string;
  form: EndpointReturn<typeof statsEndpoints>["read"]["form"];
}

interface UsersStatsFiltersProps {
  control: Control<Partial<UserStatsRequestType>>;
}

export function UsersStatsFilters({
  control,
}: UsersStatsFiltersProps): JSX.Element {
  return (
    <div className="space-y-4">
      {/* Base time and chart filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Period */}
        <EndpointFormField
          control={control}
          name="timePeriod"
          config={{
            type: "select",
            label: "users.admin.filters.timePeriod",
            options: [
              {
                value: TimePeriod.HOUR,
                label: "users.admin.filters.timePeriods.hour",
              },
              {
                value: TimePeriod.DAY,
                label: "users.admin.filters.timePeriods.day",
              },
              {
                value: TimePeriod.WEEK,
                label: "users.admin.filters.timePeriods.week",
              },
              {
                value: TimePeriod.MONTH,
                label: "users.admin.filters.timePeriods.month",
              },
              {
                value: TimePeriod.QUARTER,
                label: "users.admin.filters.timePeriods.quarter",
              },
              {
                value: TimePeriod.YEAR,
                label: "users.admin.filters.timePeriods.year",
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
            label: "users.admin.filters.dateRange",
            options: [
              {
                value: DateRangePreset.TODAY,
                label: "users.admin.filters.dateRanges.today",
              },
              {
                value: DateRangePreset.YESTERDAY,
                label: "users.admin.filters.dateRanges.yesterday",
              },
              {
                value: DateRangePreset.LAST_7_DAYS,
                label: "users.admin.filters.dateRanges.last7Days",
              },
              {
                value: DateRangePreset.LAST_30_DAYS,
                label: "users.admin.filters.dateRanges.last30Days",
              },
              {
                value: DateRangePreset.LAST_90_DAYS,
                label: "users.admin.filters.dateRanges.last90Days",
              },
              {
                value: DateRangePreset.THIS_MONTH,
                label: "users.admin.filters.dateRanges.thisMonth",
              },
              {
                value: DateRangePreset.LAST_MONTH,
                label: "users.admin.filters.dateRanges.lastMonth",
              },
              {
                value: DateRangePreset.THIS_QUARTER,
                label: "users.admin.filters.dateRanges.thisQuarter",
              },
              {
                value: DateRangePreset.LAST_QUARTER,
                label: "users.admin.filters.dateRanges.lastQuarter",
              },
              {
                value: DateRangePreset.THIS_YEAR,
                label: "users.admin.filters.dateRanges.thisYear",
              },
              {
                value: DateRangePreset.LAST_YEAR,
                label: "users.admin.filters.dateRanges.lastYear",
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
            label: "users.admin.filters.chartType",
            options: [
              {
                value: ChartType.LINE,
                label: "users.admin.filters.chartTypes.line",
              },
              {
                value: ChartType.BAR,
                label: "users.admin.filters.chartTypes.bar",
              },
              {
                value: ChartType.AREA,
                label: "users.admin.filters.chartTypes.area",
              },
            ],
          }}
        />
      </div>

      {/* User-specific filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          config={{
            type: "select",
            label: "users.admin.filters.status",
            options: [
              {
                value: UserStatusFilter.ALL,
                label: "users.admin.filters.statuses.all",
              },
              {
                value: UserStatusFilter.ACTIVE,
                label: "users.admin.filters.statuses.active",
              },
              {
                value: UserStatusFilter.INACTIVE,
                label: "users.admin.filters.statuses.inactive",
              },
              {
                value: UserStatusFilter.EMAIL_VERIFIED,
                label: "users.admin.filters.statuses.emailVerified",
              },
              {
                value: UserStatusFilter.EMAIL_UNVERIFIED,
                label: "users.admin.filters.statuses.emailUnverified",
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
            label: "leads.admin.filters.countries.title",
            options: [
              {
                value: Countries.DE,
                label: "leads.admin.filters.countries.de",
              },
              {
                value: Countries.PL,
                label: "leads.admin.filters.countries.pl",
              },
            ],
          }}
        />

        {/* Role Filter */}
        <EndpointFormField
          control={control}
          name="role"
          config={{
            type: "select",
            label: "users.admin.filters.role",
            options: [
              {
                value: UserRoleFilter.ALL,
                label: "users.admin.filters.roles.all",
              },
              {
                value: UserRoleFilter.PUBLIC,
                label: "users.admin.filters.roles.public",
              },
              {
                value: UserRoleFilter.CUSTOMER,
                label: "users.admin.filters.roles.customer",
              },
              {
                value: UserRoleFilter.PARTNER_ADMIN,
                label: "users.admin.filters.roles.partnerAdmin",
              },
              {
                value: UserRoleFilter.ADMIN,
                label: "users.admin.filters.roles.admin",
              },
            ],
          }}
        />
      </div>

      {/* Advanced options */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Include Comparison */}
        <EndpointFormField
          control={control}
          name="includeComparison"
          config={{
            type: "checkbox",
            label: "users.admin.filters.includeComparison",
            description: "users.admin.filters.includeComparisonDescription",
          }}
        />
      </div>
    </div>
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
    <Form form={form} onSubmit={() => {}} className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">
            {title || t("common.filter")}
          </CardTitle>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t("common.refresh")}
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </Form>
  );
}
