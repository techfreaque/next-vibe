/**
 * Custom Widget for Email Statistics
 */

"use client";
import { objectEntries } from "next-vibe/core/utils/object";
import { cn } from "next-vibe/core/utils/utils";
import { Button } from "next-vibe/ui/ui/button";
import { Div } from "next-vibe/ui/ui/div";
import { RefreshCw } from "next-vibe/ui/ui/icons/RefreshCw";
import { Search } from "next-vibe/ui/ui/icons/Search";
import { Input } from "next-vibe/ui/ui/input";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { MetricCard } from "next-vibe/ui/ui/metric-card";
import { MetricGrid } from "next-vibe/ui/ui/metric-grid";
import { ProgressBlock } from "next-vibe/ui/ui/progress-block";
import { SectionGroup } from "next-vibe/ui/ui/section-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/ui/select";
import { Span } from "next-vibe/ui/ui/span";
import { WidgetHeader } from "next-vibe/ui/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import { isValidEnumValue } from "next-vibe/unified-ui/_shared/enum";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import React, { useCallback } from "react";

import type {
  MessageSortFieldValue,
  MessageStatusFilterValue,
  MessageTypeFilterValue,
  SortOrderValue,
} from "../enum";
import {
  MessageSortField,
  MessageSortFieldOptions,
  MessageStatusFilter,
  MessageStatusFilterOptions,
  MessageType,
  MessageTypeFilter,
  MessageTypeFilterOptions,
  SortOrder,
  SortOrderOptions,
} from "../enum";
import { scopedTranslation as messagesScopedTranslation } from "../i18n";
import type definition from "./definition";
import type {
  ChartTypeValue,
  DateRangePresetValue,
  TimePeriodValue,
} from "./enum";
import {
  ChartType,
  ChartTypeOptions,
  DateRangePreset,
  DateRangePresetOptions,
  TimePeriod,
  TimePeriodOptions,
} from "./enum";

export function EmailStatsContainer(): React.JSX.Element {
  const data = useWidgetValue<typeof definition.GET>();
  const t = useWidgetTranslation<typeof definition.GET>();
  const locale = useWidgetLocale();
  const messagesT = messagesScopedTranslation.scopedT(locale).t;
  const { push: navigate } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();
  const isLoading = data === null || data === undefined;

  const timePeriod: typeof TimePeriodValue =
    form.watch("timePeriod") ?? TimePeriod.month;
  const dateRangePreset: typeof DateRangePresetValue =
    form.watch("dateRangePreset") ?? DateRangePreset.last_30_days;
  const chartType: typeof ChartTypeValue =
    form.watch("chartType") ?? ChartType.line;
  const activeStatus: typeof MessageStatusFilterValue =
    form.watch("status") ?? MessageStatusFilter.ANY;
  const activeType: typeof MessageTypeFilterValue =
    form.watch("type") ?? MessageTypeFilter.ANY;
  const sortBy: typeof MessageSortFieldValue =
    form.watch("sortBy") ?? MessageSortField.CREATED_AT;
  const sortOrder: typeof SortOrderValue =
    form.watch("sortOrder") ?? SortOrder.DESC;
  const includeComparison = form.watch("includeComparison") ?? false;

  const handleTimePeriodChange = useCallback(
    (value: string): void => {
      form.setValue("timePeriod", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleDateRangePresetChange = useCallback(
    (value: string): void => {
      form.setValue("dateRangePreset", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleChartTypeChange = useCallback(
    (value: string): void => {
      form.setValue("chartType", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleStatusChange = useCallback(
    (value: string): void => {
      form.setValue("status", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleTypeChange = useCallback(
    (value: string): void => {
      form.setValue("type", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortByChange = useCallback(
    (value: string): void => {
      form.setValue("sortBy", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleSortOrderChange = useCallback(
    (value: string): void => {
      form.setValue("sortOrder", value);
      if (onSubmit) {
        onSubmit();
      }
    },
    [form, onSubmit],
  );

  const handleToggleComparison = useCallback((): void => {
    form.setValue("includeComparison", !includeComparison);
    if (onSubmit) {
      onSubmit();
    }
  }, [form, onSubmit, includeComparison]);

  const handleViewList = (): void => {
    void (async (): Promise<void> => {
      const listDef = await import("../list/definition");
      navigate(listDef.default.GET);
    })();
  };

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  return (
    <WidgetShell>
      <WidgetHeader
        title={t("get.title")}
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleViewList}
            >
              {t("widget.viewList")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              title={t("widget.refresh")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        }
      />

      {/* Filters */}
      <Div className="px-4 pt-3 pb-2 flex flex-col gap-2">
        {/* Time period + date range preset + chart type */}
        <Div className="flex items-center gap-2 flex-wrap">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="h-9 w-[120px] flex-shrink-0">
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
            <SelectTrigger className="h-9 w-[150px] flex-shrink-0">
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
            <SelectTrigger className="h-9 w-[140px] flex-shrink-0">
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
            {t("get.includeComparison.label")}
          </Button>
        </Div>

        {/* Custom date range inputs */}
        {dateRangePreset === DateRangePreset.custom && (
          <Div className="flex items-center gap-2 flex-wrap">
            <Input
              type="date"
              className="h-9 w-[160px] flex-shrink-0 text-sm"
              value={form.watch("dateFrom") ?? ""}
              onChange={(e) => {
                form.setValue("dateFrom", e.target.value);
                if (onSubmit) {
                  onSubmit();
                }
              }}
            />
            <Input
              type="date"
              className="h-9 w-[160px] flex-shrink-0 text-sm"
              value={form.watch("dateTo") ?? ""}
              onChange={(e) => {
                form.setValue("dateTo", e.target.value);
                if (onSubmit) {
                  onSubmit();
                }
              }}
            />
          </Div>
        )}

        {/* Status filter chips - scrollable */}
        <Div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {MessageStatusFilterOptions.map((opt) => {
            const isActive = activeStatus === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleStatusChange(opt.value)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center px-2.5 py-1 h-7 rounded-full text-xs font-medium border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                )}
              >
                {messagesT(opt.label)}
              </Button>
            );
          })}
        </Div>

        {/* Type filter chips - scrollable */}
        <Div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {MessageTypeFilterOptions.map((opt) => {
            const isActive = activeType === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleTypeChange(opt.value)}
                className={cn(
                  "flex-shrink-0 inline-flex items-center px-2.5 py-1 h-7 rounded-full text-xs font-medium border",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                )}
              >
                {messagesT(opt.label)}
              </Button>
            );
          })}
        </Div>

        {/* Search + sort */}
        <Div className="flex items-center gap-2">
          <Div className="flex-1 relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={form.watch("search") ?? ""}
              onChange={(e) => {
                form.setValue("search", e.target.value);
                if (onSubmit) {
                  onSubmit();
                }
              }}
              placeholder={t("widget.search")}
              className="pl-9 h-9"
            />
          </Div>
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="h-9 w-[140px] flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MessageSortFieldOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {messagesT(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={handleSortOrderChange}>
            <SelectTrigger className="h-9 w-[110px] flex-shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SortOrderOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {messagesT(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Div>
      </Div>

      {isLoading ? (
        <LoadingBlock size="lg" />
      ) : (
        <Div className="p-4 flex flex-col gap-4">
          {/* Volume stats */}
          <MetricGrid>
            <MetricCard label={t("widget.total")} value={data.totalEmails} />
            <MetricCard
              label={t("widget.sent")}
              value={data.sentEmails}
              variant="success"
            />
            <MetricCard
              label={t("widget.delivered")}
              value={data.deliveredEmails}
              variant="success"
            />
            <MetricCard
              label={t("widget.opened")}
              value={data.openedEmails}
              variant="info"
            />
            <MetricCard
              label={t("widget.clicked")}
              value={data.clickedEmails}
              variant="info"
            />
            <MetricCard
              label={t("widget.bounced")}
              value={data.bouncedEmails}
              variant="warning"
            />
            <MetricCard
              label={t("widget.failed")}
              value={data.failedEmails}
              variant="danger"
            />
            <MetricCard
              label={t("widget.errors")}
              value={data.emailsWithErrors}
              variant="danger"
            />
          </MetricGrid>

          {/* Engagement rates */}
          <SectionGroup title={t("widget.engagementRates")}>
            <Div className="flex flex-col gap-3">
              <ProgressBlock
                label={t("widget.deliveryRate")}
                value={Math.round(data.deliveryRate * 100)}
                variant="success"
              />
              <ProgressBlock
                label={t("widget.openRate")}
                value={Math.round(data.openRate * 100)}
                variant="default"
              />
              <ProgressBlock
                label={t("widget.clickRate")}
                value={Math.round(data.clickRate * 100)}
                variant="default"
              />
              <ProgressBlock
                label={t("widget.bounceRate")}
                value={Math.round(data.bounceRate * 100)}
                variant="warning"
              />
              <ProgressBlock
                label={t("widget.failureRate")}
                value={Math.round(data.failureRate * 100)}
                variant="danger"
              />
            </Div>
          </SectionGroup>

          {/* By status breakdown */}
          {data.groupedStats.byStatus.length > 0 && (
            <SectionGroup title={t("widget.byStatus")}>
              <Div className="flex flex-col gap-2">
                {data.groupedStats.byStatus.map((row) => (
                  <Div
                    key={row.status}
                    className="flex items-center justify-between text-sm"
                  >
                    <Span>{messagesT(row.status)}</Span>
                    <Span className="font-semibold">{row.count}</Span>
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          )}

          {/* By type breakdown */}
          {Object.keys(data.emailsByType).length > 0 && (
            <SectionGroup title={t("widget.byType")}>
              <Div className="flex flex-col gap-2">
                {objectEntries(data.emailsByType).map(([type, count]) => (
                  <Div
                    key={type}
                    className="flex items-center justify-between text-sm"
                  >
                    <Span>
                      {isValidEnumValue(MessageType, type)
                        ? messagesT(type)
                        : type}
                    </Span>
                    <Span className="font-semibold">{count}</Span>
                  </Div>
                ))}
              </Div>
            </SectionGroup>
          )}

          {/* Performance */}
          <MetricGrid columns={2}>
            <MetricCard
              label={t("widget.avgRetries")}
              value={data.averageRetryCount.toFixed(2)}
            />
            <MetricCard
              label={t("widget.avgDeliveryMs")}
              value={
                data.averageDeliveryTime > 0
                  ? `${Math.round(data.averageDeliveryTime)}ms`
                  : "\u2014"
              }
            />
          </MetricGrid>
        </Div>
      )}
    </WidgetShell>
  );
}
