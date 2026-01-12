/**
 * Leads Stats Filters Component
 * Provides filtering controls for leads statistics following email stats pattern
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

import type { LeadsStatsRequestOutput } from "@/app/api/[locale]/leads/stats/definition";
import statsEndpoints from "@/app/api/[locale]/leads/stats/definition";
import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import { type CountryLanguage } from "@/i18n/core/config";
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
  locale: CountryLanguage;
}

export function LeadsStatsFilters({
  control,
  locale,
}: LeadsStatsFiltersProps): JSX.Element {
  return (
    <Div className="flex flex-col gap-4">
      {/* Base time and chart filters */}
      <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time Period */}
        <EndpointFormField
          control={control}
          name="timePeriod"
          endpoint={statsEndpoints.GET}
          locale={locale}
        />

        {/* Date Range Preset */}
        <EndpointFormField
          control={control}
          name="dateRangePreset"
          endpoint={statsEndpoints.GET}
          locale={locale}
        />

        {/* Chart Type */}
        <EndpointFormField
          control={control}
          name="chartType"
          endpoint={statsEndpoints.GET}
          locale={locale}
        />

        {/* Status Filter */}
        <EndpointFormField
          control={control}
          name="status"
          endpoint={statsEndpoints.GET}
          locale={locale}
        />

        {/* Country Filter */}
        <EndpointFormField
          control={control}
          name="country"
          endpoint={statsEndpoints.GET}
          locale={locale}
        />

        {/* Source Filter */}
        <EndpointFormField
          control={control}
          name="source"
          endpoint={statsEndpoints.GET}
          locale={locale}
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
