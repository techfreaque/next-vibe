/**
 * Custom Widget for Cron History
 * Displays cron task execution history with summary, filters, table and pagination
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
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
import { TextFieldWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/form-fields/text-field/react";
import { FormAlertWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/form-alert/react";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { CronTaskStatus } from "../../enum";
import type endpoints from "./definition";
import type { CronHistoryResponseOutput } from "./definition";

type Execution = CronHistoryResponseOutput["executions"][number];

interface WidgetProps {
  field: {
    value: CronHistoryResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LIMIT = 50;

// Status filter identifiers — used only as local UI state keys, not compared to execution.status
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

// Maps execution.status (enum i18n key values) to Tailwind color classes
const STATUS_COLOR_MAP: Record<string, string> = {
  [CronTaskStatus.RUNNING]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [CronTaskStatus.COMPLETED]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [CronTaskStatus.FAILED]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskStatus.ERROR]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  [CronTaskStatus.CANCELLED]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  [CronTaskStatus.SKIPPED]:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const DEFAULT_STATUS_CLASS =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

// Summary card color variants — defined as constants to avoid JSX literal string warnings
const SUMMARY_VALUE_CLASS_SUCCESS =
  "text-xl font-bold tabular-nums text-green-600 dark:text-green-400";
const SUMMARY_VALUE_CLASS_DANGER =
  "text-xl font-bold tabular-nums text-red-600 dark:text-red-400";
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

function ExecutionRow({
  execution,
  isExpanded,
  onToggleExpand,
  t,
}: {
  execution: Execution;
  isExpanded: boolean;
  onToggleExpand: () => void;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const hasError = Boolean(execution.error);

  return (
    <>
      <Div
        className={cn(
          "grid grid-cols-7 gap-2 py-2.5 border-b border-border/50 text-sm items-start transition-colors",
          hasError
            ? "cursor-pointer hover:bg-red-50/50 dark:hover:bg-red-950/20"
            : "hover:bg-muted/30",
        )}
        onClick={hasError ? onToggleExpand : undefined}
      >
        {/* Task Name */}
        <Div className="flex flex-col gap-0.5 min-w-0">
          <Span className="font-medium truncate">{execution.taskName}</Span>
          <Span className="text-xs text-muted-foreground font-mono truncate">
            {execution.taskId.slice(0, 8)}
          </Span>
        </Div>

        {/* Status badge */}
        <Div className="flex items-center">
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              getStatusColorClass(execution.status),
            )}
          >
            {t(execution.status)}
          </Span>
        </Div>

        {/* Duration */}
        <Span className="tabular-nums text-xs pt-1">
          {formatDuration(execution.durationMs)}
        </Span>

        {/* Started */}
        <Span className="text-xs pt-1 text-muted-foreground font-mono">
          {formatDate(execution.startedAt)}
        </Span>

        {/* Completed */}
        <Span className="text-xs pt-1 text-muted-foreground font-mono">
          {formatDate(execution.completedAt)}
        </Span>

        {/* Environment */}
        <Div className="flex items-center">
          {execution.environment ? (
            <Span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground">
              {execution.environment}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">—</Span>
          )}
        </Div>

        {/* Error preview */}
        <Div className="flex items-center min-w-0">
          {hasError ? (
            <Span className="text-xs text-red-500 dark:text-red-400 truncate">
              {isExpanded
                ? t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.error.collapse",
                  )
                : (execution.error?.message ?? "")}
            </Span>
          ) : (
            <Span className="text-xs text-muted-foreground">—</Span>
          )}
        </Div>
      </Div>

      {/* Expanded error detail */}
      {isExpanded && hasError && execution.error && (
        <Div className="border border-red-200 dark:border-red-800 rounded-md mx-2 mb-2 p-3 bg-red-50 dark:bg-red-950/30">
          <Div className="flex items-center gap-2 mb-2">
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <Span className="text-xs font-semibold text-red-700 dark:text-red-300">
              {execution.error.errorType}
            </Span>
          </Div>
          <Span className="text-sm text-red-800 dark:text-red-200 whitespace-pre-wrap break-words block">
            {execution.error.message}
          </Span>
          {execution.error.messageParams &&
            Object.keys(execution.error.messageParams).length > 0 && (
              <Div className="mt-2 text-xs text-red-600 dark:text-red-400 font-mono bg-red-100 dark:bg-red-900/40 rounded p-2">
                {JSON.stringify(execution.error.messageParams, null, 2)}
              </Div>
            )}
        </Div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function CronHistoryContainer({
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

  // Stable reference for executions array
  const executions = useMemo(
    () => value?.executions ?? [],
    [value?.executions],
  );

  // Counts per status chip (from current page executions)
  const statusCounts = useMemo((): Record<StatusFilter, number> => {
    const counts: Record<StatusFilter, number> = {
      ALL: executions.length,
      RUNNING: 0,
      COMPLETED: 0,
      FAILED: 0,
      TIMEOUT: 0,
      CANCELLED: 0,
    };
    for (const e of executions) {
      if (e.status === CronTaskStatus.RUNNING) {
        counts.RUNNING++;
      } else if (e.status === CronTaskStatus.COMPLETED) {
        counts.COMPLETED++;
      } else if (
        e.status === CronTaskStatus.FAILED ||
        e.status === CronTaskStatus.ERROR ||
        e.status === CronTaskStatus.TIMEOUT
      ) {
        counts.FAILED++;
        if (e.status === CronTaskStatus.TIMEOUT) {
          counts.TIMEOUT++;
        }
      } else if (e.status === CronTaskStatus.CANCELLED) {
        counts.CANCELLED++;
      }
    }
    return counts;
  }, [executions]);

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewTasks = useCallback((): void => {
    router.push(`/${locale}/admin/cron/tasks`);
  }, [router, locale]);

  const handleViewStats = useCallback((): void => {
    router.push(`/${locale}/admin/cron/stats`);
  }, [router, locale]);

  const handleStatusFilterChange = useCallback(
    (filter: StatusFilter): void => {
      const statusValue = filter === "ALL" ? "" : CronTaskStatus[filter];
      form?.setValue("status", statusValue);
      setExpandedId(null);
      endpointMutations?.read?.refetch?.();
    },
    [form, endpointMutations],
  );

  const handleToggleExpand = useCallback((id: string): void => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ── */}
      <Div className="flex items-center gap-2 p-4 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />

        <Span className="font-semibold text-base mr-auto">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.title",
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
          onClick={handleViewTasks}
          className="gap-1.5"
        >
          <Clock className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.header.tasks",
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
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.header.stats",
            )}
          </Span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.header.refresh",
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
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.summary.total",
            )}
            value={summary.totalExecutions}
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.summary.successful",
            )}
            value={summary.successfulExecutions}
            icon={<CheckCircle className="h-3.5 w-3.5 text-green-500" />}
            variant="success"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.summary.failed",
            )}
            value={summary.failedExecutions}
            icon={<XCircle className="h-3.5 w-3.5 text-red-500" />}
            variant="danger"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.summary.successRate",
            )}
            value={`${Math.round(summary.successRate)}%`}
            icon={<TrendingUp className="h-3.5 w-3.5 text-green-500" />}
            variant="success"
          />
          <SummaryCard
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.summary.avgDuration",
            )}
            value={formatDuration(summary.averageDuration)}
            icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
          />
        </Div>
      )}

      {/* ── Search + filter chips row ── */}
      <Div className="flex flex-col gap-2 px-4 py-3 border-b">
        {/* Text search bound to request field */}
        <TextFieldWidget
          fieldName={`${fieldName}.taskName`}
          field={children.taskName}
        />

        {/* Status filter chips */}
        <Div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_KEYS.map((filter) => (
            <StatusChip
              key={filter}
              label={t(
                `app.api.system.unifiedInterface.tasks.cronSystem.history.widget.filter.${filter.toLowerCase()}`,
              )}
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

      {/* ── Execution table ── */}
      {!isLoading && (
        <Div className="flex flex-col px-4 py-2">
          <FormAlertWidget field={{}} />
          {/* Table header */}
          <Div className="grid grid-cols-7 gap-2 py-2 border-b text-xs font-medium text-muted-foreground">
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.taskName",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.status",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.duration",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.started",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.completed",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.environment",
              )}
            </Span>
            <Span>
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.col.error",
              )}
            </Span>
          </Div>

          {/* Table body */}
          {executions.length === 0 ? (
            <Div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t(
                  "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.empty",
                )}
              </Span>
            </Div>
          ) : (
            <Div className="flex flex-col">
              {executions.map((execution) => (
                <ExecutionRow
                  key={execution.id}
                  execution={execution}
                  isExpanded={expandedId === execution.id}
                  onToggleExpand={() => handleToggleExpand(execution.id)}
                  t={t}
                />
              ))}
            </Div>
          )}
        </Div>
      )}

      {/* ── Pagination footer ── */}
      <Div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <Span>
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.pagination.info",
            {
              page: currentPage,
              totalPages,
              total: totalCount,
            },
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
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.pagination.prev",
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
                "app.api.system.unifiedInterface.tasks.cronSystem.history.widget.pagination.next",
              )}
            </Span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
