/**
 * Pulse Execution History Widget
 * Card list of pulse cycles with task breakdown and date/status filters
 */

"use client";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Activity } from "next-vibe/ui/components/icons/Activity";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { ChevronDown } from "next-vibe/ui/components/icons/ChevronDown";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { ChevronRight } from "next-vibe/ui/components/icons/ChevronRight";
import { ChevronUp } from "next-vibe/ui/components/icons/ChevronUp";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { TrendingUp } from "next-vibe/ui/components/icons/TrendingUp";
import { XCircle } from "next-vibe/ui/components/icons/XCircle";
import { Span } from "next-vibe/ui/components/span";
import { H1 } from "next-vibe/ui/components/typography";
import React, { useCallback, useMemo, useState } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { toIntlLocale } from "../../../core/i18n/core/language-utils";
import { cn } from "../../../unified-ui/_shared/cn";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetOnSubmit,
  useWidgetTranslation,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { formatDuration } from "../../../unified-ui/analytics/format";
import { DateFieldWidget } from "../../../unified-ui/widgets/form-fields/date-field/widget";
import { NavigateButtonWidget } from "../../../unified-ui/widgets/interactive/navigate-button/widget";
import { PulseExecutionStatus } from "../../enum";
import type endpoints from "./definition";
import type { PulseHistoryResponseOutput } from "./definition";

type Execution = PulseHistoryResponseOutput["executions"][number];

interface WidgetProps {
  field: (typeof endpoints.GET)["fields"];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LIMIT = 50;

type StatusFilter =
  | "widget.filter.all"
  | "widget.filter.success"
  | "widget.filter.failure"
  | "widget.filter.timeout";

const STATUS_FILTER_KEYS: StatusFilter[] = [
  "widget.filter.all",
  "widget.filter.success",
  "widget.filter.failure",
  "widget.filter.timeout",
];

const FILTER_TO_PULSE_STATUS: Partial<Record<StatusFilter, string>> = {
  "widget.filter.success": PulseExecutionStatus.SUCCESS,
  "widget.filter.failure": PulseExecutionStatus.FAILURE,
  "widget.filter.timeout": PulseExecutionStatus.TIMEOUT,
};

const STATUS_COLOR_MAP: Record<string, string> = {
  [PulseExecutionStatus.SUCCESS]: "bg-success/10 text-success",
  [PulseExecutionStatus.FAILURE]: "bg-destructive/10 text-destructive",
  [PulseExecutionStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [PulseExecutionStatus.CANCELLED]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  [PulseExecutionStatus.PENDING]: "bg-warning/10 text-warning",
};

const DEFAULT_STATUS_CLASS =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(value: string, locale: CountryLanguage): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusClass(status: string): string {
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
      ? "text-xl font-bold tabular-nums text-success"
      : variant === "danger"
        ? "text-xl font-bold tabular-nums text-destructive"
        : "text-xl font-bold tabular-nums";

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
      aria-pressed={isActive}
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

// eslint-disable-next-line i18next/no-literal-string
const TASK_LIST_COLORS = {
  blue: "text-info",
  green: "text-success",
  red: "text-destructive",
  muted: "text-muted-foreground",
} as const;

type TaskListColor = keyof typeof TASK_LIST_COLORS;

function TaskList({
  label,
  tasks,
  color,
}: {
  label: string;
  tasks: string[];
  color: TaskListColor;
}): React.JSX.Element | null {
  if (tasks.length === 0) {
    return null;
  }
  return (
    <Div className="flex flex-col gap-0.5">
      <Span className={cn("text-xs font-medium", TASK_LIST_COLORS[color])}>
        {label}
      </Span>
      <Div className="flex flex-wrap gap-1">
        {tasks.map((name, position) => (
          <Span
            key={`${position}:${name}`}
            className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded"
          >
            {name}
          </Span>
        ))}
      </Div>
    </Div>
  );
}

function ExecutionCard({
  execution,
  isExpanded,
  onToggle,
  t,
  locale,
}: {
  execution: Execution;
  isExpanded: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  locale: CountryLanguage;
}): React.JSX.Element {
  const hasDetail =
    execution.tasksExecuted.length > 0 ||
    execution.tasksFailed.length > 0 ||
    execution.tasksSkipped.length > 0;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      <Div className="grid grid-cols-[1fr_auto] items-start gap-2 p-3 @md:flex @md:gap-3">
        {/* Status badge */}
        <Span
          className={cn(
            "mt-0.5 inline-flex shrink-0 items-center justify-self-start rounded-full px-2 py-0.5 text-xs font-medium",
            getStatusClass(execution.status),
          )}
        >
          {t(execution.status)}
        </Span>

        {/* Meta */}
        <Div className="col-span-2 row-start-2 flex min-w-0 flex-1 flex-col gap-0.5">
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs tabular-nums text-muted-foreground">
            <Span>{formatDate(execution.startedAt, locale)}</Span>
            {execution.completedAt && (
              // eslint-disable-next-line i18next/no-literal-string
              <Span>{`→ ${formatDate(execution.completedAt, locale)}`}</Span>
            )}
            {execution.durationMs !== null && (
              <Span>{formatDuration(execution.durationMs, locale)}</Span>
            )}
          </Div>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <Span>
              {t("widget.discovered", {
                count: execution.totalTasksDiscovered,
              })}
            </Span>
            {execution.tasksDue.length > 0 && (
              <Span>
                {t("widget.due", { count: execution.tasksDue.length })}
              </Span>
            )}
            {execution.tasksSucceeded.length > 0 && (
              <Span className="text-success">
                {t("widget.succeeded", {
                  count: execution.tasksSucceeded.length,
                })}
              </Span>
            )}
            {execution.tasksFailed.length > 0 && (
              <Span className="text-destructive">
                {t("widget.failed", { count: execution.tasksFailed.length })}
              </Span>
            )}
          </Div>
        </Div>

        {/* Expand toggle */}
        {hasDetail && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="col-start-2 row-start-1 h-10 shrink-0 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {t("widget.details")}
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}
      </Div>

      {/* Expanded detail */}
      {isExpanded && hasDetail && (
        <Div className="border-t bg-muted/30 p-3 flex flex-col gap-2">
          <TaskList
            label={t("widget.tasksExecuted")}
            tasks={execution.tasksExecuted}
            color="blue"
          />
          <TaskList
            label={t("widget.tasksSucceeded")}
            tasks={execution.tasksSucceeded}
            color="green"
          />
          <TaskList
            label={t("widget.tasksFailed")}
            tasks={execution.tasksFailed}
            color="red"
          />
          <TaskList
            label={t("widget.tasksSkipped")}
            tasks={execution.tasksSkipped}
            color="muted"
          />
        </Div>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function PulseHistoryContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusFilter = form.watch("status") ?? "";
  const offset = form.watch("offset") ?? 0;

  const data = useWidgetValue<typeof endpoints.GET>();
  const summary = data?.summary;
  const totalCount = data?.totalCount ?? 0;
  const isLoading = endpointMutations?.read?.isLoading;

  const executions = useMemo(() => data?.executions ?? [], [data?.executions]);

  const statusCounts = useMemo((): Record<StatusFilter, number> => {
    const counts: Record<StatusFilter, number> = {
      "widget.filter.all": executions.length,
      "widget.filter.success": 0,
      "widget.filter.failure": 0,
      "widget.filter.timeout": 0,
    };
    for (const e of executions) {
      if (e.status === PulseExecutionStatus.SUCCESS) {
        counts["widget.filter.success"]++;
      } else if (e.status === PulseExecutionStatus.FAILURE) {
        counts["widget.filter.failure"]++;
      } else if (e.status === PulseExecutionStatus.TIMEOUT) {
        counts["widget.filter.timeout"]++;
      }
    }
    return counts;
  }, [executions]);

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handlePageChange = useCallback(
    (newOffset: number): void => {
      form.setValue("offset", newOffset);
      if (onSubmit) {
        onSubmit();
      } else {
        endpointMutations?.read?.refetch?.();
      }
    },
    [form, onSubmit, endpointMutations],
  );

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../../cron/stats/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleViewHistory = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../../cron/history/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleStatusFilterChange = useCallback(
    (filter: StatusFilter): void => {
      const statusValue =
        filter === "widget.filter.all"
          ? ""
          : (FILTER_TO_PULSE_STATUS[filter] ?? "");
      form.setValue("status", statusValue, { shouldDirty: true });
      form.setValue("offset", 0, { shouldDirty: true });
      setExpandedId(null);
    },
    [form],
  );

  return (
    <Div className="@container flex min-w-0 flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />

        <H1 className="mr-auto text-2xl font-semibold tracking-tight">
          {t("widget.title")}
          {totalCount > 0 && (
            <Span className="ml-2 text-sm text-muted-foreground font-normal">
              ({totalCount})
            </Span>
          )}
        </H1>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewHistory}
          aria-label={t("widget.header.cronHistory")}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t("widget.header.cronHistory")}
          </Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          aria-label={t("widget.header.stats")}
          className="gap-1.5"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">{t("widget.header.stats")}</Span>
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
            icon={<Activity className="h-3.5 w-3.5 text-muted-foreground" />}
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
            value={new Intl.NumberFormat(toIntlLocale(locale), {
              style: "percent",
              maximumFractionDigits: 1,
            }).format(summary.successRate / 100)}
            icon={<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <SummaryCard
            label={t("widget.summary.avgDuration")}
            value={
              summary.averageDuration === null
                ? "–"
                : formatDuration(summary.averageDuration, locale)
            }
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </Div>
      )}

      {/* ── Filters ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        <Div className="grid grid-cols-2 gap-2">
          <DateFieldWidget fieldName={"startDate"} field={children.startDate} />
          <DateFieldWidget fieldName={"endDate"} field={children.endDate} />
        </Div>

        {/* Status filter chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_KEYS.map((filter) => (
            <StatusChip
              key={filter}
              label={t(filter)}
              count={statusCounts[filter]}
              isActive={
                filter === "widget.filter.all"
                  ? !statusFilter || statusFilter === "widget.filter.all"
                  : statusFilter === (FILTER_TO_PULSE_STATUS[filter] ?? "")
              }
              onClick={() => handleStatusFilterChange(filter)}
            />
          ))}
        </Div>
      </Div>

      {/* ── Loading ── */}
      {isLoading && (
        <Div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Div>
      )}

      {/* ── Card list ── */}
      {!isLoading && (
        <Div className="flex flex-col gap-2 px-4 py-3">
          {executions.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <Activity className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t("widget.empty")}
              </Span>
            </Div>
          ) : (
            executions.map((execution) => (
              <ExecutionCard
                key={execution.id}
                execution={execution}
                isExpanded={expandedId === execution.id}
                onToggle={() =>
                  setExpandedId((prev) =>
                    prev === execution.id ? null : execution.id,
                  )
                }
                t={t}
                locale={locale}
              />
            ))
          )}
        </Div>
      )}

      {/* ── Pagination ── */}
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
            aria-label={t("widget.pagination.prev")}
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
            aria-label={t("widget.pagination.next")}
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
