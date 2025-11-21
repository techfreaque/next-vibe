/**
 * Email Stats Filters Component
 * Filter component specifically for email statistics
 */

"use client";

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
import { RefreshCw } from "next-vibe-ui/ui/icons";
import type { JSX, ReactNode } from "react";
import type { Control } from "react-hook-form";

import {
  EmailSortField,
  EmailStatusFilter,
  EmailTypeFilter,
} from "@/app/api/[locale]/v1/core/emails/messages/enum";
import type { EmailStatsGetRequestTypeOutput } from "@/app/api/[locale]/v1/core/emails/messages/stats/definition";
import type emailStatsEndpoint from "@/app/api/[locale]/v1/core/emails/messages/stats/definition";
import { SortOrder } from "@/app/api/[locale]/v1/core/leads/enum";
import type { EndpointReturn } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/endpoint-types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface EmailStatsFiltersContainerProps {
  locale: CountryLanguage;
  children: ReactNode;
  onRefresh?: () => void;
  title?: string;
  form: EndpointReturn<typeof emailStatsEndpoint>["read"]["form"];
}

interface EmailStatsFiltersProps {
  control: Control<EmailStatsGetRequestTypeOutput>;
}

/**
 * Container for email stats filters with refresh functionality
 */
export function EmailStatsFiltersContainer({
  locale,
  children,
  onRefresh,
  title,
  form,
}: EmailStatsFiltersContainerProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Form form={form}>
      <Div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">
              {title || t("app.admin.emails.stats.common.filter")}
            </CardTitle>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("app.admin.emails.stats.common.refresh")}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">{children}</CardContent>
        </Card>
      </Div>
    </Form>
  );
}

/**
 * Email-specific stats filters
 */
export function EmailStatsFilters({
  control,
}: EmailStatsFiltersProps): JSX.Element {
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
            label: "app.admin.emails.stats.admin.stats.filters.timePeriod",
            options: [
              {
                value: TimePeriod.HOUR,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.hour",
              },
              {
                value: TimePeriod.DAY,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.day",
              },
              {
                value: TimePeriod.WEEK,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.week",
              },
              {
                value: TimePeriod.MONTH,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.month",
              },
              {
                value: TimePeriod.QUARTER,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.quarter",
              },
              {
                value: TimePeriod.YEAR,
                label:
                  "app.admin.emails.stats.admin.stats.filters.timePeriods.year",
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
            label: "app.admin.emails.stats.admin.stats.filters.dateRange",
            options: [
              {
                value: DateRangePreset.TODAY,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.today",
              },
              {
                value: DateRangePreset.YESTERDAY,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.yesterday",
              },
              {
                value: DateRangePreset.LAST_7_DAYS,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.last7Days",
              },
              {
                value: DateRangePreset.LAST_30_DAYS,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.last30Days",
              },
              {
                value: DateRangePreset.LAST_90_DAYS,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.last90Days",
              },
              {
                value: DateRangePreset.THIS_MONTH,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.thisMonth",
              },
              {
                value: DateRangePreset.LAST_MONTH,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.lastMonth",
              },
              {
                value: DateRangePreset.THIS_QUARTER,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.thisQuarter",
              },
              {
                value: DateRangePreset.LAST_QUARTER,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.lastQuarter",
              },
              {
                value: DateRangePreset.THIS_YEAR,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.thisYear",
              },
              {
                value: DateRangePreset.LAST_YEAR,
                label:
                  "app.admin.emails.stats.admin.stats.filters.dateRanges.lastYear",
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
            label: "app.admin.emails.stats.admin.stats.filters.chartType",
            options: [
              {
                value: ChartType.LINE,
                label:
                  "app.admin.emails.stats.admin.stats.filters.chartTypes.line",
              },
              {
                value: ChartType.BAR,
                label:
                  "app.admin.emails.stats.admin.stats.filters.chartTypes.bar",
              },
              {
                value: ChartType.AREA,
                label:
                  "app.admin.emails.stats.admin.stats.filters.chartTypes.area",
              },
            ],
          }}
        />
      </Div>

      {/* Email-specific filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          config={{
            type: "select",
            label: "app.admin.emails.stats.admin.stats.filters.statuses.title",
            options: [
              {
                value: EmailStatusFilter.ALL,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.all",
              },
              {
                value: EmailStatusFilter.SENT,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.sent",
              },
              {
                value: EmailStatusFilter.DELIVERED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.delivered",
              },
              {
                value: EmailStatusFilter.OPENED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.opened",
              },
              {
                value: EmailStatusFilter.CLICKED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.clicked",
              },
              {
                value: EmailStatusFilter.BOUNCED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.bounced",
              },
              {
                value: EmailStatusFilter.FAILED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.failed",
              },
              {
                value: EmailStatusFilter.UNSUBSCRIBED,
                label:
                  "app.admin.emails.stats.admin.stats.filters.statuses.unsubscribed",
              },
            ],
          }}
        />

        {/* Email Type Filter */}
        <EndpointFormField
          control={control}
          name="type"
          config={{
            type: "select",
            label: "app.admin.emails.stats.admin.stats.filters.types.title",
            options: [
              {
                value: EmailTypeFilter.ALL,
                label: "app.admin.emails.stats.admin.stats.filters.types.all",
              },
              {
                value: EmailTypeFilter.LEAD_CAMPAIGN,
                label:
                  "app.admin.emails.stats.admin.stats.filters.types.leadCampaign",
              },
              {
                value: EmailTypeFilter.TRANSACTIONAL,
                label:
                  "app.admin.emails.stats.admin.stats.filters.types.transactional",
              },
              {
                value: EmailTypeFilter.MARKETING,
                label:
                  "app.admin.emails.stats.admin.stats.filters.types.marketing",
              },
              {
                value: EmailTypeFilter.NOTIFICATION,
                label:
                  "app.admin.emails.stats.admin.stats.filters.types.notification",
              },
              {
                value: EmailTypeFilter.SYSTEM,
                label:
                  "app.admin.emails.stats.admin.stats.filters.types.system",
              },
            ],
          }}
        />

        {/* Sort By */}
        <EndpointFormField
          control={control}
          name="sortBy"
          config={{
            type: "select",
            label: "app.admin.emails.stats.admin.stats.filters.sortBy.title",
            options: [
              {
                value: EmailSortField.CREATED_AT,
                label:
                  "app.admin.emails.stats.admin.stats.filters.sortBy.createdAt",
              },
              {
                value: EmailSortField.SENT_AT,
                label:
                  "app.admin.emails.stats.admin.stats.filters.sortBy.sentAt",
              },
              {
                value: EmailSortField.STATUS,
                label:
                  "app.admin.emails.stats.admin.stats.filters.sortBy.status",
              },
              {
                value: EmailSortField.TYPE,
                label: "app.admin.emails.stats.admin.stats.filters.sortBy.type",
              },
            ],
          }}
        />
      </Div>

      {/* Additional filters */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sort Order */}
        <EndpointFormField
          control={control}
          name="sortOrder"
          config={{
            type: "select",
            label: "app.admin.emails.stats.admin.stats.filters.sortOrder.title",
            options: [
              {
                value: SortOrder.DESC,
                label:
                  "app.admin.emails.stats.admin.stats.filters.sortOrder.desc",
              },
              {
                value: SortOrder.ASC,
                label:
                  "app.admin.emails.stats.admin.stats.filters.sortOrder.asc",
              },
            ],
          }}
        />

        {/* Include Comparison Toggle */}
        <EndpointFormField
          control={control}
          name="includeComparison"
          config={{
            type: "checkbox",
            label:
              "app.admin.emails.stats.admin.stats.filters.includeComparison",
            description:
              "app.admin.emails.stats.admin.stats.filters.includeComparisonDescription",
          }}
        />
      </Div>

      {/* Search */}
      <EndpointFormField
        control={control}
        name="search"
        config={{
          type: "text",
          label: "app.admin.emails.stats.admin.stats.filters.search",
          placeholder:
            "app.admin.emails.stats.admin.stats.filters.searchPlaceholder",
        }}
      />
    </Div>
  );
}
