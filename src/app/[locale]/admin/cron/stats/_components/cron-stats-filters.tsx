/**
 * Cron Stats Filters Component
 * Provides filtering controls for cron statistics following leads stats pattern
 */

"use client";

import { RefreshCw } from "lucide-react";
import {
  DateRangePreset,
  TimePeriod,
} from "next-vibe/shared/types/stats-filtering.schema";
import { Form } from "next-vibe-ui/ui";
import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import type { JSX, ReactNode } from "react";
import type { Control } from "react-hook-form";

import type statsEndpoints from "@/app/api/[locale]/v1/core/system/tasks/cron/stats/definition";
import {
  CronTaskPriorityFilter,
  CronTaskStatusFilter,
  PulseHealthStatus,
} from "@/app/api/[locale]/v1/core/system/tasks/enum";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/endpoint/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface CronStatsFiltersContainerProps {
  locale: CountryLanguage;
  children: ReactNode;
  onRefresh?: () => void;
  title?: string;
  form: EndpointReturn<typeof statsEndpoints>["read"]["form"];
}

interface CronStatsFiltersProps {
  control: EndpointReturn<typeof statsEndpoints>["read"]["form"]["control"];
}

/**
 * Container for cron stats filters with refresh functionality
 */
export function CronStatsFiltersContainer({
  locale,
  children,
  onRefresh,
  title,
  form,
}: CronStatsFiltersContainerProps): JSX.Element {
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

export function CronStatsFilters({
  control,
}: CronStatsFiltersProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Time Period Filters */}
      <EndpointFormField
        name="timePeriod"
        control={control}
        config={{
          type: "select",
          label: "admin.dashboard.cron.stats.filters.timePeriod",
          placeholder: "admin.dashboard.cron.stats.filters.selectTimePeriod",
          options: [
            {
              value: TimePeriod.HOUR,
              label: "admin.dashboard.cron.stats.filters.timePeriods.hour",
            },
            {
              value: TimePeriod.DAY,
              label: "admin.dashboard.cron.stats.filters.timePeriods.day",
            },
            {
              value: TimePeriod.WEEK,
              label: "admin.dashboard.cron.stats.filters.timePeriods.week",
            },
            {
              value: TimePeriod.MONTH,
              label: "admin.dashboard.cron.stats.filters.timePeriods.month",
            },
          ],
        }}
      />

      <EndpointFormField
        name="dateRangePreset"
        control={control}
        config={{
          type: "select",
          label: "admin.dashboard.cron.stats.filters.dateRange",
          placeholder: "admin.dashboard.cron.stats.filters.selectDateRange",
          options: [
            {
              value: DateRangePreset.TODAY,
              label: "admin.dashboard.cron.stats.filters.dateRanges.today",
            },
            {
              value: DateRangePreset.YESTERDAY,
              label: "admin.dashboard.cron.stats.filters.dateRanges.yesterday",
            },
            {
              value: DateRangePreset.LAST_7_DAYS,
              label: "admin.dashboard.cron.stats.filters.dateRanges.last7Days",
            },
            {
              value: DateRangePreset.LAST_30_DAYS,
              label: "admin.dashboard.cron.stats.filters.dateRanges.last30Days",
            },
            {
              value: DateRangePreset.LAST_90_DAYS,
              label: "admin.dashboard.cron.stats.filters.dateRanges.last90Days",
            },
            {
              value: DateRangePreset.THIS_MONTH,
              label: "admin.dashboard.cron.stats.filters.dateRanges.thisMonth",
            },
            {
              value: DateRangePreset.LAST_MONTH,
              label: "admin.dashboard.cron.stats.filters.dateRanges.lastMonth",
            },
          ],
        }}
      />

      {/* Task Filters */}
      <EndpointFormField
        name="taskName"
        control={control}
        config={{
          type: "text",
          label: "admin.dashboard.cron.stats.filters.taskName",
          placeholder: "admin.dashboard.cron.stats.filters.enterTaskName",
        }}
      />

      <EndpointFormField
        name="taskStatus"
        control={control}
        config={{
          type: "select",
          label: "admin.dashboard.cron.stats.filters.taskStatus",
          placeholder: "admin.dashboard.cron.stats.filters.selectTaskStatus",
          options: Object.values(CronTaskStatusFilter).map((status) => ({
            value: status,
            label:
              `admin.dashboard.cron.stats.filters.status.${status}` as const,
          })),
        }}
      />

      <EndpointFormField
        name="taskPriority"
        control={control}
        config={{
          type: "select",
          label: "admin.dashboard.cron.stats.filters.taskPriority",
          placeholder: "admin.dashboard.cron.stats.filters.selectTaskPriority",
          options: Object.values(CronTaskPriorityFilter).map((priority) => ({
            value: priority,
            label:
              `admin.dashboard.cron.stats.filters.priority.${priority}` as const,
          })),
        }}
      />

      <EndpointFormField
        name="healthStatus"
        control={control}
        config={{
          type: "select",
          label: "admin.dashboard.cron.stats.filters.healthStatus",
          placeholder: "admin.dashboard.cron.stats.filters.selectHealthStatus",
          options: Object.values(PulseHealthStatus).map((status) => ({
            value: status,
            label:
              `admin.dashboard.cron.stats.filters.health.${status}` as const,
          })),
        }}
      />

      {/* Performance Filters */}
      <EndpointFormField
        name="minDuration"
        control={control}
        config={{
          type: "number",
          label: "admin.dashboard.cron.stats.filters.minDuration",
          placeholder: "admin.dashboard.cron.stats.filters.enterMinDuration",
        }}
      />

      <EndpointFormField
        name="maxDuration"
        control={control}
        config={{
          type: "number",
          label: "admin.dashboard.cron.stats.filters.maxDuration",
          placeholder: "admin.dashboard.cron.stats.filters.enterMaxDuration",
        }}
      />

      {/* Boolean Filters */}
      <EndpointFormField
        name="includeDisabled"
        control={control}
        config={{
          type: "checkbox",
          label: "admin.dashboard.cron.stats.filters.includeDisabled",
        }}
      />

      <EndpointFormField
        name="includeSystemTasks"
        control={control}
        config={{
          type: "checkbox",
          label: "admin.dashboard.cron.stats.filters.includeSystemTasks",
        }}
      />

      <EndpointFormField
        name="hasRecentFailures"
        control={control}
        config={{
          type: "checkbox",
          label: "admin.dashboard.cron.stats.filters.hasRecentFailures",
        }}
      />

      <EndpointFormField
        name="hasTimeout"
        control={control}
        config={{
          type: "checkbox",
          label: "admin.dashboard.cron.stats.filters.hasTimeout",
        }}
      />

      {/* Search */}
      <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <EndpointFormField
          name="search"
          control={control}
          config={{
            type: "text",
            label: "admin.dashboard.cron.stats.filters.search",
            placeholder: "admin.dashboard.cron.stats.filters.searchPlaceholder",
          }}
        />
      </div>
    </div>
  );
}
