/**
 * Leads Stats Filters Component
 * Provides filtering controls for leads statistics following email stats pattern
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
  LeadSourceFilter,
  LeadStatusFilter,
} from "@/app/api/[locale]/leads/enum";
import type { LeadsStatsRequestOutput } from "@/app/api/[locale]/leads/stats/definition";
import type statsEndpoints from "@/app/api/[locale]/leads/stats/definition";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { CountryFilterOptions, type CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

interface LeadsStatsFiltersContainerProps {
  locale: CountryLanguage;
  children: ReactNode;
  onRefresh?: () => void;
  title?: string;
  form: EndpointReturn<typeof statsEndpoints>["read"]["form"];
}

interface LeadsStatsFiltersProps {
  control: Control<LeadsStatsRequestOutput>;
}

export function LeadsStatsFilters({
  control,
}: LeadsStatsFiltersProps): JSX.Element {
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
            label: "app.admin.leads.leads.admin.filters.timePeriod",
            options: [
              {
                value: TimePeriod.HOUR,
                label: "app.admin.leads.leads.admin.filters.timePeriods.hour",
              },
              {
                value: TimePeriod.DAY,
                label: "app.admin.leads.leads.admin.filters.timePeriods.day",
              },
              {
                value: TimePeriod.WEEK,
                label: "app.admin.leads.leads.admin.filters.timePeriods.week",
              },
              {
                value: TimePeriod.MONTH,
                label: "app.admin.leads.leads.admin.filters.timePeriods.month",
              },
              {
                value: TimePeriod.QUARTER,
                label:
                  "app.admin.leads.leads.admin.filters.timePeriods.quarter",
              },
              {
                value: TimePeriod.YEAR,
                label: "app.admin.leads.leads.admin.filters.timePeriods.year",
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
            label: "app.admin.leads.leads.admin.filters.dateRange",
            options: [
              {
                value: DateRangePreset.TODAY,
                label: "app.admin.leads.leads.admin.filters.dateRanges.today",
              },
              {
                value: DateRangePreset.YESTERDAY,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.yesterday",
              },
              {
                value: DateRangePreset.LAST_7_DAYS,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.last7Days",
              },
              {
                value: DateRangePreset.LAST_30_DAYS,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.last30Days",
              },
              {
                value: DateRangePreset.LAST_90_DAYS,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.last90Days",
              },
              {
                value: DateRangePreset.THIS_MONTH,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.thisMonth",
              },
              {
                value: DateRangePreset.LAST_MONTH,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.lastMonth",
              },
              {
                value: DateRangePreset.THIS_QUARTER,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.thisQuarter",
              },
              {
                value: DateRangePreset.LAST_QUARTER,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.lastQuarter",
              },
              {
                value: DateRangePreset.THIS_YEAR,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.thisYear",
              },
              {
                value: DateRangePreset.LAST_YEAR,
                label:
                  "app.admin.leads.leads.admin.filters.dateRanges.lastYear",
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
            label: "app.admin.leads.leads.admin.filters.chartType",
            options: [
              {
                value: ChartType.LINE,
                label: "app.admin.leads.leads.admin.filters.chartTypes.line",
              },
              {
                value: ChartType.BAR,
                label: "app.admin.leads.leads.admin.filters.chartTypes.bar",
              },
              {
                value: ChartType.AREA,
                label: "app.admin.leads.leads.admin.filters.chartTypes.area",
              },
            ],
          }}
        />

        {/* Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          config={{
            type: "select",
            label: "app.admin.leads.leads.admin.filters.statuses.title",
            options: [
              {
                value: LeadStatusFilter.ALL,
                label: "app.admin.leads.leads.admin.filters.statuses.all",
              },
              {
                value: LeadStatusFilter.NEW,
                label: "app.admin.leads.leads.admin.filters.statuses.new",
              },
              {
                value: LeadStatusFilter.PENDING,
                label: "app.admin.leads.leads.admin.filters.statuses.pending",
              },
              {
                value: LeadStatusFilter.CAMPAIGN_RUNNING,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.campaign_running",
              },
              {
                value: LeadStatusFilter.WEBSITE_USER,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.website_user",
              },
              {
                value: LeadStatusFilter.NEWSLETTER_SUBSCRIBER,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.newsletter_subscriber",
              },
              {
                value: LeadStatusFilter.SIGNED_UP,
                label: "app.admin.leads.leads.admin.filters.statuses.signed_up",
              },
              {
                value: LeadStatusFilter.CONSULTATION_BOOKED,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.consultation_booked",
              },
              {
                value: LeadStatusFilter.SUBSCRIPTION_CONFIRMED,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.subscription_confirmed",
              },
              {
                value: LeadStatusFilter.UNSUBSCRIBED,
                label:
                  "app.admin.leads.leads.admin.filters.statuses.unsubscribed",
              },
              {
                value: LeadStatusFilter.BOUNCED,
                label: "app.admin.leads.leads.admin.filters.statuses.bounced",
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
            label: "app.admin.leads.leads.admin.filters.countries.title",
            options: CountryFilterOptions,
          }}
        />

        {/* Source Filter */}
        <EndpointFormField
          control={control}
          name="source"
          config={{
            type: "select",
            label: "app.admin.leads.leads.admin.filters.sources.title",
            options: [
              {
                value: LeadSourceFilter.ALL,
                label: "app.admin.leads.leads.admin.filters.sources.all",
              },
              {
                value: LeadSourceFilter.WEBSITE,
                label: "app.admin.leads.leads.admin.filters.sources.website",
              },
              {
                value: LeadSourceFilter.SOCIAL_MEDIA,
                label:
                  "app.admin.leads.leads.admin.filters.sources.socialMedia",
              },
              {
                value: LeadSourceFilter.EMAIL_CAMPAIGN,
                label:
                  "app.admin.leads.leads.admin.filters.sources.emailCampaign",
              },
              {
                value: LeadSourceFilter.REFERRAL,
                label: "app.admin.leads.leads.admin.filters.sources.referral",
              },
              {
                value: LeadSourceFilter.CSV_IMPORT,
                label: "app.admin.leads.leads.admin.filters.sources.csvImport",
              },
            ],
          }}
        />
      </Div>
    </Div>
  );
}

/**
 * Container for leads stats filters with refresh functionality
 */
export function LeadsStatsFiltersContainer({
  locale,
  children,
  onRefresh,
  title,
  form,
}: LeadsStatsFiltersContainerProps): JSX.Element {
  const { t } = simpleT(locale);

  return (
    <Form form={form}>
      <Div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-semibold">
              {title || t("app.admin.leads.leads.admin.stats.filter")}
            </CardTitle>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {t("app.admin.leads.leads.admin.stats.refresh")}
              </Button>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">{children}</CardContent>
        </Card>
      </Div>
    </Form>
  );
}
