/**
 * Custom Widget for Cron History
 * Card list with collapsible result/error details and date range filter
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { Activity } from "next-vibe-ui/ui/icons/Activity";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { ChevronDown } from "next-vibe-ui/ui/icons/ChevronDown";
import { ChevronLeft } from "next-vibe-ui/ui/icons/ChevronLeft";
import { ChevronRight } from "next-vibe-ui/ui/icons/ChevronRight";
import { ChevronUp } from "next-vibe-ui/ui/icons/ChevronUp";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { TrendingUp } from "next-vibe-ui/ui/icons/TrendingUp";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Pre } from "next-vibe-ui/ui/pre";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { DateFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/widget";
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";

import { CronTaskStatus, type CronTaskStatusValue } from "../../enum";
import type endpoints from "./definition";
import type { CronHistoryResponseOutput } from "./definition";

type Execution = CronHistoryResponseOutput["executions"][number];

interface WidgetProps {
  field: (typeof endpoints.GET)["fields"];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LIMIT = 50;

type StatusFilter =
  | "ALL"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "TIMEOUT"
  | "CANCELLED";

const STATUS_FILTER_KEYS: StatusFilter[] = [
  "ALL",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "TIMEOUT",
  "CANCELLED",
];

const STATUS_FILTER_LABEL_KEYS: Record<
  StatusFilter,
  | "widget.filter.all"
  | "widget.filter.running"
  | "widget.filter.completed"
  | "widget.filter.failed"
  | "widget.filter.timeout"
  | "widget.filter.cancelled"
> = {
  ALL: "widget.filter.all",
  RUNNING: "widget.filter.running",
  COMPLETED: "widget.filter.completed",
  FAILED: "widget.filter.failed",
  TIMEOUT: "widget.filter.timeout",
  CANCELLED: "widget.filter.cancelled",
};

const STATUS_COLOR_MAP: Record<string, string> = {
  [CronTaskStatus.RUNNING]: "bg-info/10 text-info",
  [CronTaskStatus.COMPLETED]: "bg-success/10 text-success",
  [CronTaskStatus.FAILED]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.ERROR]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskStatus.PENDING]: "bg-warning/10 text-warning",
  [CronTaskStatus.CANCELLED]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  [CronTaskStatus.SKIPPED]:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const DEFAULT_STATUS_CLASS =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

const SUMMARY_VALUE_CLASS_SUCCESS =
  "text-xl font-bold tabular-nums text-success";
const SUMMARY_VALUE_CLASS_DANGER =
  "text-xl font-bold tabular-nums text-destructive";
const SUMMARY_VALUE_CLASS_DEFAULT = "text-xl font-bold tabular-nums";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(s: string | null): string {
  return s ? s.slice(0, 16).replace("T", " ") : "—";
}

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function getStatusColorClass(status: string): string {
  return STATUS_COLOR_MAP[status] ?? DEFAULT_STATUS_CLASS;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "success" | "danger" | "default";
}): React.JSX.Element {
  const valueClass =
    variant === "success"
      ? SUMMARY_VALUE_CLASS_SUCCESS
      : variant === "danger"
        ? SUMMARY_VALUE_CLASS_DANGER
        : SUMMARY_VALUE_CLASS_DEFAULT;

  return (
    <Div className="flex flex-col gap-1 rounded-lg border bg-card p-3">
      <Div className="flex items-center gap-1.5">
        {icon}
        <Span className="text-xs text-muted-foreground">{label}</Span>
      </Div>
      <Span className={valueClass}>{String(value)}</Span>
    </Div>
  );
}

function StatusChip({
  label,
  count,
  isActive,
  onClick,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
        isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-transparent text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {label}
      <Span
        className={cn(
          "inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 rounded-full text-[10px] font-semibold",
          isActive
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </Span>
    </Button>
  );
}

function ExecutionCard({
  execution,
  expandedSection,
  onToggle,
  t,
}: {
  execution: Execution;
  expandedSection: "error" | "result" | null;
  onToggle: (section: "error" | "result") => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  const hasError = Boolean(execution.error);
  const hasResult =
    execution.result && Object.keys(execution.result).length > 0;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      {/* Card header row */}
      <Div className="flex items-start gap-3 p-3">
        {/* Status badge */}
        <Span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5",
            getStatusColorClass(execution.status),
          )}
        >
          {t(execution.status as Parameters<typeof t>[0])}
        </Span>

        {/* Task name + meta */}
        <Div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <Span className="font-medium text-sm">{execution.taskName}</Span>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-mono">
            <Span>{formatDate(execution.startedAt)}</Span>
            {execution.completedAt && (
              // eslint-disable-next-line i18next/no-literal-string
              <Span>{`\u2192 ${formatDate(execution.completedAt)}`}</Span>
            )}
            <Span className="font-sans tabular-nums">
              {formatDuration(execution.durationMs)}
            </Span>
            {execution.environment && (
              <Span className="bg-muted px-1 rounded">
                {execution.environment}
              </Span>
            )}
          </Div>
        </Div>

        {/* Expand buttons */}
        <Div className="flex items-center gap-1 flex-shrink-0">
          {hasResult && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggle("result")}
              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              {t("widget.result")}
              {expandedSection === "result" ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
          {hasError && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggle("error")}
              className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive/80"
            >
              {t("widget.error.label")}
              {expandedSection === "error" ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
          )}
        </Div>
      </Div>

      {/* Error preview inline when collapsed */}
      {hasError && expandedSection !== "error" && execution.error && (
        <Div
          className="px-3 pb-2 text-xs text-destructive truncate cursor-pointer"
          onClick={() => onToggle("error")}
        >
          {execution.error.message}
        </Div>
      )}

      {/* Expanded: error */}
      {expandedSection === "error" && hasError && (
        <Div className="border-t border-destructive/30 bg-destructive/10 p-3 flex flex-col gap-2">
          {execution.error && (
            <>
              <Div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <Span className="text-xs font-semibold text-destructive">
                  {execution.error.errorType.errorKey}
                </Span>
              </Div>
              <Span className="text-sm text-destructive whitespace-pre-wrap break-words">
                {execution.error.message}
              </Span>
              {execution.error.messageParams &&
                Object.keys(execution.error.messageParams).length > 0 && (
                  <Pre className="text-xs text-destructive font-mono bg-destructive/10 rounded p-2 overflow-auto">
                    {JSON.stringify(execution.error.messageParams, null, 2)}
                  </Pre>
                )}
            </>
          )}
        </Div>
      )}

      {/* Expanded: result */}
      {expandedSection === "result" && hasResult && (
        <Div className="border-t bg-muted/40 p-3">
          <Pre className="text-xs font-mono text-foreground overflow-auto max-h-48 whitespace-pre-wrap break-words">
            {JSON.stringify(execution.result, null, 2)}
          </Pre>
        </Div>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function CronHistoryContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const form = useWidgetForm();

  // expandedId: "<executionId>:<section>"
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusFilter: typeof CronTaskStatusValue | "ALL" =
    form.watch("status") ?? "ALL";
  const offset = form.watch("offset") ?? 0;

  const value = useWidgetValue<typeof endpoints.GET>();
  const summary = value?.summary;
  const totalCount = value?.totalCount ?? 0;

  const isLoading = endpointMutations?.read?.isLoading;

  const executions = useMemo(
    () => value?.executions ?? [],
    [value?.executions],
  );

  const statusCounts: Record<StatusFilter, number> = {
    ALL: value?.statusCounts?.all ?? 0,
    RUNNING: value?.statusCounts?.running ?? 0,
    COMPLETED: value?.statusCounts?.completed ?? 0,
    FAILED: value?.statusCounts?.failed ?? 0,
    TIMEOUT: value?.statusCounts?.timeout ?? 0,
    CANCELLED: value?.statusCounts?.cancelled ?? 0,
  };

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handlePageChange = useCallback(
    (newOffset: number): void => {
      form.setValue("offset", newOffset);
    },
    [form],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewTasks = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../tasks/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../stats/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleViewPulse = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../../pulse/history/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleStatusFilterChange = useCallback(
    (filter: StatusFilter): void => {
      const statusValue = filter === "ALL" ? "" : CronTaskStatus[filter];
      form.setValue("status", statusValue);
      setExpandedId(null);
    },
    [form],
  );

  const handleToggle = useCallback(
    (executionId: string, section: "error" | "result"): void => {
      const key = `${executionId}:${section}`;
      setExpandedId((prev) => (prev === key ? null : key));
    },
    [],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />

        <Span className="font-semibold text-base mr-auto">
          {t("widget.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </Span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewTasks}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.header.tasks")}</Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1.5"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.header.stats")}</Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewPulse}
          className="gap-1.5"
        >
          <Activity className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.header.pulse")}</Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t("widget.header.refresh")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* ── Summary bar ── */}
      {summary && (
        <Div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 border-b">
          <SummaryCard
            label={t("widget.summary.total")}
            value={summary.totalExecutions}
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <SummaryCard
            label={t("widget.summary.successful")}
            value={summary.successfulExecutions}
            icon={<CheckCircle className="h-3.5 w-3.5 text-success" />}
            variant="success"
          />
          <SummaryCard
            label={t("widget.summary.failed")}
            value={summary.failedExecutions}
            icon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
            variant="danger"
          />
          <SummaryCard
            label={t("widget.summary.successRate")}
            value={`${Math.round(summary.successRate)}%`}
            icon={<TrendingUp className="h-3.5 w-3.5 text-success" />}
            variant="success"
          />
          <SummaryCard
            label={t("widget.summary.avgDuration")}
            value={formatDuration(summary.averageDuration)}
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </Div>
      )}

      {/* ── Filters ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        {/* Task name search */}
        <TextFieldWidget fieldName={"taskName"} field={children.taskName} />

        {/* Date range */}
        <Div className="grid grid-cols-2 gap-2">
          <DateFieldWidget fieldName={"startDate"} field={children.startDate} />
          <DateFieldWidget fieldName={"endDate"} field={children.endDate} />
        </Div>

        {/* Status filter chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_KEYS.map((filter) => (
            <StatusChip
              key={filter}
              label={t(STATUS_FILTER_LABEL_KEYS[filter])}
              count={statusCounts[filter]}
              isActive={
                filter === "ALL"
                  ? !statusFilter || statusFilter === "ALL"
                  : statusFilter === CronTaskStatus[filter]
              }
              onClick={() => handleStatusFilterChange(filter)}
            />
          ))}
        </Div>
      </Div>

      {/* ── Loading state ── */}
      {isLoading && (
        <Div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      )}

      {/* ── Card list ── */}
      {!isLoading && (
        <Div className="flex flex-col gap-2 px-4 py-3">
          <FormAlertWidget field={{}} />
          {executions.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t("widget.empty")}
              </Span>
            </Div>
          ) : (
            executions.map((execution) => {
              const expandedSection = expandedId?.startsWith(execution.id)
                ? expandedId.split(":")[1]
                : undefined;
              const key: "error" | "result" | null =
                expandedSection === "error" || expandedSection === "result"
                  ? expandedSection
                  : null;
              return (
                <ExecutionCard
                  key={execution.id}
                  execution={execution}
                  expandedSection={key}
                  onToggle={(section) => handleToggle(execution.id, section)}
                  t={t}
                />
              );
            })
          )}
        </Div>
      )}

      {/* ── Pagination footer ── */}
      <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <Span>
          {t("widget.pagination.info", {
            page: currentPage,
            totalPages,
            total: totalCount,
          })}
        </Span>
        <Div className="flex gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={offset <= 0}
            onClick={() => handlePageChange(Math.max(0, offset - LIMIT))}
          >
            <ChevronLeft className="h-4 w-4" />
            <Span className="hidden sm:inline ml-1">
              {t("widget.pagination.prev")}
            </Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(offset + LIMIT)}
          >
            <Span className="hidden sm:inline mr-1">
              {t("widget.pagination.next")}
            </Span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
