/**
 * Email Stats Filters Component
 * Filter component specifically for email statistics
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { RefreshCw } from "next-vibe-ui/ui/icons";
import type { JSX, ReactNode } from "react";
import type { Control } from "react-hook-form";

import type { EmailStatsGetRequestTypeOutput } from "@/app/api/[locale]/emails/messages/stats/definition";
import emailStatsEndpoint from "@/app/api/[locale]/emails/messages/stats/definition";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
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
  locale: CountryLanguage;
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
export function EmailStatsFilters({ control, locale }: EmailStatsFiltersProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      {/* Base time and chart filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Period */}
        <EndpointFormField
          control={control}
          name="timePeriod"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />

        {/* Date Range Preset */}
        <EndpointFormField
          control={control}
          name="dateRangePreset"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />

        {/* Chart Type */}
        <EndpointFormField
          control={control}
          name="chartType"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />
      </Div>

      {/* Email-specific filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />

        {/* Email Type Filter */}
        <EndpointFormField
          control={control}
          name="type"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />

        {/* Sort By */}
        <EndpointFormField
          control={control}
          name="sortBy"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />
      </Div>

      {/* Additional filters */}
      <Div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sort Order */}
        <EndpointFormField
          control={control}
          name="sortOrder"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />

        {/* Include Comparison Toggle */}
        <EndpointFormField
          control={control}
          name="includeComparison"
          endpoint={emailStatsEndpoint.GET}
          locale={locale}
        />
      </Div>

      {/* Search */}
      <EndpointFormField
        control={control}
        name="search"
        locale={locale}
        endpoint={emailStatsEndpoint.GET}
      />
    </Div>
  );
}
