/**
 * Cron Stats Filters Component
 * Provides filtering controls for cron statistics following leads stats pattern
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "next-vibe-ui/ui/card";
import { Div } from "next-vibe-ui/ui/div";
import { EndpointFormField } from "next-vibe-ui/ui/form/endpoint-form-field";
import { Form } from "next-vibe-ui/ui/form/form";
import { RefreshCw } from "next-vibe-ui/ui/icons";
import type { JSX, ReactNode } from "react";

import type { EndpointReturn } from "@/app/api/[locale]/system/unified-interface/react/hooks/endpoint-types";
import statsEndpoints from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/definition";
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
  locale: CountryLanguage;
}

// No-op submit handler for filter forms - changes are handled by form field onChange events
const noOpSubmit = (): void => {
  // Filter form submission is handled by form field changes
};

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
    <Form form={form} onSubmit={noOpSubmit} className="flex flex-col gap-4">
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
    </Form>
  );
}

export function CronStatsFilters({
  control,
  locale,
}: CronStatsFiltersProps): JSX.Element {
  return (
    <Div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Time Period Filters */}
      <EndpointFormField
        name="timePeriod"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="dateRangePreset"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      {/* Task Filters */}
      <EndpointFormField
        name="taskName"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="taskStatus"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="taskPriority"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="healthStatus"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      {/* Performance Filters */}
      <EndpointFormField
        name="minDuration"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="maxDuration"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      {/* Boolean Filters */}
      <EndpointFormField
        name="includeDisabled"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="includeSystemTasks"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="hasRecentFailures"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      <EndpointFormField
        name="hasTimeout"
        control={control}
        endpoint={statsEndpoints.GET}
        locale={locale}
      />

      {/* Search */}
      <Div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
        <EndpointFormField
          name="search"
          control={control}
          endpoint={statsEndpoints.GET}
          locale={locale}
        />
      </Div>
    </Div>
  );
}
