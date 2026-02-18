/**
 * Custom Widget for Email Statistics
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Loader2, RefreshCw } from "next-vibe-ui/ui/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { SortOrder, SortOrderOptions } from "../../imap-client/enum";
import {
  EmailSortField,
  EmailSortFieldOptions,
  EmailStatusFilter,
  EmailStatusFilterOptions,
  EmailTypeFilter,
  EmailTypeFilterOptions,
} from "../enum";
import type definition from "./definition";
import type { EmailStatsGetResponseTypeOutput } from "./definition";
import {
  ChartType,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodOptions,
} from "./enum";

interface CustomWidgetProps {
  field: {
    value: EmailStatsGetResponseTypeOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
  fieldName: string;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color?: string;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border p-4 flex flex-col gap-1">
      <Span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {label}
      </Span>
      <Div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: color ?? "inherit",
        }}
      >
        {value}
      </Div>
    </Div>
  );
}

function RateBar({
  label,
  rate,
  color,
}: {
  label: string;
  rate: number;
  color: string;
}): React.JSX.Element {
  const pct = Math.min(100, Math.max(0, Math.round(rate * 100)));
  return (
    <Div className="flex flex-col gap-1">
      <Div className="flex items-center justify-between text-xs">
        <Span className="text-muted-foreground">{label}</Span>
        <Span className="font-semibold">{pct}%</Span>
      </Div>
      <Div className="h-2 rounded-full bg-muted overflow-hidden">
        <Div
          style={{
            width: `${String(pct)}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "9999px",
            transition: "width 0.3s ease",
          }}
        />
      </Div>
    </Div>
  );
}

export function EmailStatsContainer({
  field,
  fieldName,
}: CustomWidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const t = useWidgetTranslation();
  const locale = useWidgetLocale();
  const router = useRouter();
  const { endpointMutations } = useWidgetContext();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const isLoading = data === null || data === undefined;

  const timePeriod: string = form?.watch("timePeriod") ?? TimePeriod.month;
  const dateRangePreset: string =
    form?.watch("dateRangePreset") ?? DateRangePreset.last_30_days;
  const chartType: string = form?.watch("chartType") ?? ChartType.line;
  const activeStatus: string = form?.watch("status") ?? EmailStatusFilter.ANY;
  const activeType: string = form?.watch("type") ?? EmailTypeFilter.ANY;
  const sortBy: string = form?.watch("sortBy") ?? EmailSortField.CREATED_AT;
  const sortOrder: string = form?.watch("sortOrder") ?? SortOrder.DESC;
  const includeComparison: boolean = form?.watch("includeComparison") ?? false;

  const handleTimePeriodChange = useCallback(
    (value: string): void => {
      form?.setValue("timePeriod", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleDateRangePresetChange = useCallback(
    (value: string): void => {
      form?.setValue("dateRangePreset", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleChartTypeChange = useCallback(
    (value: string): void => {
      form?.setValue("chartType", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleStatusChange = useCallback(
    (value: string): void => {
      form?.setValue("status", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleTypeChange = useCallback(
    (value: string): void => {
      form?.setValue("type", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortByChange = useCallback(
    (value: string): void => {
      form?.setValue("sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form?.setValue("sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleToggleComparison = useCallback((): void => {
    form?.setValue("includeComparison", !includeComparison);
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit, includeComparison]);

  const handleViewList = (): void => {
    router.push(`/${locale}/admin/emails/list`);
  };

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  return (
    <Div className="flex flex-col gap-0">
      {/* Header */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Span className="font-semibold text-base">
          {t("app.api.emails.messages.stats.get.title")}
        </Span>
        <Div className="flex-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewList}
        >
          {t("app.api.emails.messages.stats.widget.viewList")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("app.api.emails.messages.stats.widget.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* Filters */}
      <Div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        {/* Time period + date range preset + chart type */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="h-9 min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TimePeriodOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={dateRangePreset}
            onValueChange={handleDateRangePresetChange}
          >
            <SelectTrigger className="h-9 min-w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DateRangePresetOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={handleChartTypeChange}>
            <SelectTrigger className="h-9 min-w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ChartTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleToggleComparison}
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
              includeComparison
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
            )}
          >
            {t("app.api.emails.messages.stats.get.includeComparison.label")}
          </Button>
        </Div>

        {/* Status + type filter chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {EmailStatusFilterOptions.map((opt) => {
            const isActive = activeStatus === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(opt.value)}
                className={
                  isActive
                    ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                    : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }
              >
                {t(opt.label)}
              </Button>
            );
          })}
        </Div>

        <Div className="flex items-center gap-1.5 flex-wrap">
          {EmailTypeFilterOptions.map((opt) => {
            const isActive = activeType === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleTypeChange(opt.value)}
                className={
                  isActive
                    ? "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-primary text-primary-foreground border-primary"
                    : "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }
              >
                {t(opt.label)}
              </Button>
            );
          })}
        </Div>

        {/* Search + sort */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Div className="flex-1 min-w-[160px]">
            <TextFieldWidget
              fieldName={`${fieldName}.search`}
              field={children.search}
            />
          </Div>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="h-9 min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EmailSortFieldOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="h-9 min-w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SortOrderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
      </Div>

      {isLoading ? (
        <Div className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      ) : (
        <Div className="p-4 flex flex-col gap-6">
          {/* Volume stats */}
          <Div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label={t("app.api.emails.messages.stats.widget.total")}
              value={data.totalEmails}
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.sent")}
              value={data.sentEmails}
              color="#22c55e"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.delivered")}
              value={data.deliveredEmails}
              color="#10b981"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.opened")}
              value={data.openedEmails}
              color="#3b82f6"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.clicked")}
              value={data.clickedEmails}
              color="#8b5cf6"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.bounced")}
              value={data.bouncedEmails}
              color="#f97316"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.failed")}
              value={data.failedEmails}
              color="#ef4444"
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.errors")}
              value={data.emailsWithErrors}
              color="#dc2626"
            />
          </Div>

          {/* Engagement rates */}
          <Div className="rounded-lg border p-4 flex flex-col gap-3">
            <Span className="text-sm font-semibold">
              {t("app.api.emails.messages.stats.widget.engagementRates")}
            </Span>
            <RateBar
              label={t("app.api.emails.messages.stats.widget.deliveryRate")}
              rate={data.deliveryRate}
              color="#10b981"
            />
            <RateBar
              label={t("app.api.emails.messages.stats.widget.openRate")}
              rate={data.openRate}
              color="#3b82f6"
            />
            <RateBar
              label={t("app.api.emails.messages.stats.widget.clickRate")}
              rate={data.clickRate}
              color="#8b5cf6"
            />
            <RateBar
              label={t("app.api.emails.messages.stats.widget.bounceRate")}
              rate={data.bounceRate}
              color="#f97316"
            />
            <RateBar
              label={t("app.api.emails.messages.stats.widget.failureRate")}
              rate={data.failureRate}
              color="#ef4444"
            />
          </Div>

          {/* By status breakdown */}
          {data.groupedStats.byStatus.length > 0 && (
            <Div className="rounded-lg border p-4">
              <Span className="text-sm font-semibold block mb-3">
                {t("app.api.emails.messages.stats.widget.byStatus")}
              </Span>
              <Div className="flex flex-col gap-2">
                {data.groupedStats.byStatus.map((row) => (
                  <Div
                    key={row.status}
                    className="flex items-center justify-between text-sm"
                  >
                    <Span>{t(row.status)}</Span>
                    <Span className="font-semibold">{row.count}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          )}

          {/* By type breakdown */}
          {Object.keys(data.emailsByType).length > 0 && (
            <Div className="rounded-lg border p-4">
              <Span className="text-sm font-semibold block mb-3">
                {t("app.api.emails.messages.stats.widget.byType")}
              </Span>
              <Div className="flex flex-col gap-2">
                {Object.entries(data.emailsByType).map(([type, count]) => (
                  <Div
                    key={type}
                    className="flex items-center justify-between text-sm"
                  >
                    <Span>{t(type)}</Span>
                    <Span className="font-semibold">{count}</Span>
                  </Div>
                ))}
              </Div>
            </Div>
          )}

          {/* Performance */}
          <Div className="grid grid-cols-2 gap-3">
            <StatCard
              label={t("app.api.emails.messages.stats.widget.avgRetries")}
              value={data.averageRetryCount.toFixed(2)}
            />
            <StatCard
              label={t("app.api.emails.messages.stats.widget.avgDeliveryMs")}
              value={
                data.averageDeliveryTime > 0
                  ? `${Math.round(data.averageDeliveryTime)}ms`
                  : "—"
              }
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}
