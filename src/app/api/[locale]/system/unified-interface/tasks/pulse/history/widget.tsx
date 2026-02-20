/**
 * Pulse Execution History Widget
 * Card list of pulse cycles with task breakdown and date/status filters
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  BarChart3,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Loader2,
  RefreshCw,
  TrendingUp,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetOnSubmit,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { DateFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/date-field/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { PulseExecutionStatus } from "../../enum";
import type endpoints from "./definition";
import type { PulseHistoryResponseOutput } from "./definition";

type Execution = PulseHistoryResponseOutput["executions"][number];

interface WidgetProps {
  field: {
    value: PulseHistoryResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LIMIT = 50;

type StatusFilter = "ALL" | "SUCCESS" | "FAILURE" | "TIMEOUT";

const STATUS_FILTER_KEYS: StatusFilter[] = [
  "ALL",
  "SUCCESS",
  "FAILURE",
  "TIMEOUT",
];

const STATUS_COLOR_MAP: Record<string, string> = {
  [PulseExecutionStatus.SUCCESS]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [PulseExecutionStatus.FAILURE]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [PulseExecutionStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [PulseExecutionStatus.CANCELLED]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  [PulseExecutionStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

const DEFAULT_STATUS_CLASS =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(s: string | null | undefined): string {
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
      ? "text-xl font-bold tabular-nums text-green-600 dark:text-green-400"
      : variant === "danger"
        ? "text-xl font-bold tabular-nums text-red-600 dark:text-red-400"
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
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  red: "text-red-600 dark:text-red-400",
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
        {tasks.map((t) => (
          <Span
            key={t}
            className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded"
          >
            {t}
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
}: {
  execution: Execution;
  isExpanded: boolean;
  onToggle: () => void;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const hasDetail =
    execution.tasksExecuted.length > 0 ||
    execution.tasksFailed.length > 0 ||
    execution.tasksSkipped.length > 0;

  return (
    <Div className="rounded-lg border bg-card overflow-hidden">
      <Div className="flex items-start gap-3 p-3">
        {/* Status badge */}
        <Span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 mt-0.5",
            getStatusClass(execution.status),
          )}
        >
          {t(execution.status)}
        </Span>

        {/* Meta */}
        <Div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground font-mono">
            <Span>{formatDate(execution.startedAt)}</Span>
            {execution.completedAt && (
              // eslint-disable-next-line i18next/no-literal-string
              <Span>{`→ ${formatDate(execution.completedAt)}`}</Span>
            )}
            <Span className="font-sans tabular-nums">
              {formatDuration(execution.durationMs)}
            </Span>
          </Div>
          <Div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.discovered",
                { count: execution.totalTasksDiscovered },
              )}
            </Span>
            {execution.tasksDue.length > 0 && (
              <Span>
                {t(
                  "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.due",
                  { count: execution.tasksDue.length },
                )}
              </Span>
            )}
            {execution.tasksSucceeded.length > 0 && (
              <Span className="text-green-600 dark:text-green-400">
                {t(
                  "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.succeeded",
                  { count: execution.tasksSucceeded.length },
                )}
              </Span>
            )}
            {execution.tasksFailed.length > 0 && (
              <Span className="text-red-600 dark:text-red-400">
                {t(
                  "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.failed",
                  { count: execution.tasksFailed.length },
                )}
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
            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.details",
            )}
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
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.tasksExecuted",
            )}
            tasks={execution.tasksExecuted}
            color="blue"
          />
          <TaskList
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.tasksSucceeded",
            )}
            tasks={execution.tasksSucceeded}
            color="green"
          />
          <TaskList
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.tasksFailed",
            )}
            tasks={execution.tasksFailed}
            color="red"
          />
          <TaskList
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.tasksSkipped",
            )}
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
  fieldName,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const onSubmit = useWidgetOnSubmit();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const statusFilter: string = form?.watch("status") ?? "ALL";
  const offset = Number(form?.watch("offset") ?? 0);

  const value = field.value;
  const summary = value?.summary;
  const totalCount = value?.totalCount ?? 0;
  const isLoading = endpointMutations?.read?.isLoading;

  const executions = useMemo(
    () => value?.executions ?? [],
    [value?.executions],
  );

  const statusCounts = useMemo((): Record<StatusFilter, number> => {
    const counts: Record<StatusFilter, number> = {
      ALL: executions.length,
      SUCCESS: 0,
      FAILURE: 0,
      TIMEOUT: 0,
    };
    for (const e of executions) {
      if (e.status === PulseExecutionStatus.SUCCESS) {
        counts.SUCCESS++;
      } else if (e.status === PulseExecutionStatus.FAILURE) {
        counts.FAILURE++;
      } else if (e.status === PulseExecutionStatus.TIMEOUT) {
        counts.TIMEOUT++;
      }
    }
    return counts;
  }, [executions]);

  const currentPage = Math.floor(offset / LIMIT) + 1;
  const totalPages = Math.ceil(totalCount / LIMIT) || 1;

  const handlePageChange = useCallback(
    (newOffset: number): void => {
      form?.setValue("offset", newOffset);
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
    router.push(`/${locale}/admin/cron/stats`);
  }, [router, locale]);

  const handleViewHistory = useCallback((): void => {
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale]);

  const handleStatusFilterChange = useCallback(
    (filter: StatusFilter): void => {
      const statusValue = filter === "ALL" ? "" : PulseExecutionStatus[filter];
      form?.setValue("status", statusValue);
      setExpandedId(null);
      endpointMutations?.read?.refetch?.();
    },
    [form, endpointMutations],
  );

  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />

        <Span className="font-semibold text-base mr-auto">
          {t(
            "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.title",
          )}
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
          onClick={handleViewHistory}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.header.cronHistory",
            )}
          </Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1.5"
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.header.stats",
            )}
          </Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t(
            "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.header.refresh",
          )}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* ── Summary bar ── */}
      {summary && (
        <Div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 border-b">
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.summary.total",
            )}
            value={summary.totalExecutions}
            icon={<Activity className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.summary.successful",
            )}
            value={summary.successfulExecutions}
            icon={<CheckCircle className="h-3.5 w-3.5 text-green-500" />}
            variant="success"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.summary.failed",
            )}
            value={summary.failedExecutions}
            icon={<XCircle className="h-3.5 w-3.5 text-red-500" />}
            variant="danger"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.summary.successRate",
            )}
            value={`${Math.round(summary.successRate)}%`}
            icon={<TrendingUp className="h-3.5 w-3.5 text-green-500" />}
            variant="success"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.summary.avgDuration",
            )}
            value={formatDuration(summary.averageDuration)}
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </Div>
      )}

      {/* ── Filters ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        <Div className="grid grid-cols-2 gap-2">
          <DateFieldWidget
            fieldName={`${fieldName}.startDate`}
            field={children.startDate}
          />
          <DateFieldWidget
            fieldName={`${fieldName}.endDate`}
            field={children.endDate}
          />
        </Div>

        {/* Status filter chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_KEYS.map((filter) => (
            <StatusChip
              key={filter}
              label={t(
                `app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.filter.${filter.toLowerCase()}`,
              )}
              count={statusCounts[filter]}
              isActive={
                filter === "ALL"
                  ? !statusFilter || statusFilter === "ALL"
                  : statusFilter === PulseExecutionStatus[filter]
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
                {t(
                  "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.empty",
                )}
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
              />
            ))
          )}
        </Div>
      )}

      {/* ── Pagination ── */}
      <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <Span>
          {t(
            "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.pagination.info",
            { page: currentPage, totalPages, total: totalCount },
          )}
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
              {t(
                "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.pagination.prev",
              )}
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
              {t(
                "app.api.system.unifiedInterface.tasks.pulseSystem.history.widget.pagination.next",
              )}
            </Span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
