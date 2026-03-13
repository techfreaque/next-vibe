/**
 * Cron Dashboard Widget — Campaign Monitoring
 * Focused view for the 3 campaign cron tasks with health, history, and alerts.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { CheckCircle2 } from "next-vibe-ui/ui/icons/CheckCircle2";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Play } from "next-vibe-ui/ui/icons/Play";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

import { CronTaskStatus } from "../../enum";
import type definition from "./definition";
import type { CronDashboardResponseOutput } from "./definition";

// ─── Types ────────────────────────────────────────────────────────────────────

type Task = CronDashboardResponseOutput["tasks"][number];
type Stats = CronDashboardResponseOutput["stats"];
type Alert = CronDashboardResponseOutput["alerts"][number];

interface WidgetProps {
  field: {
    value: CronDashboardResponseOutput | null | undefined;
  } & (typeof definition.GET)["fields"];
}

// ─── Campaign task IDs to highlight ──────────────────────────────────────────

const CAMPAIGN_TASK_IDS = [
  "campaign-starter",
  "email-campaigns",
  "bounce-processor",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(s: string | null | undefined): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 16).replace("T", " ");
}

function formatDuration(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  }
  const m = Math.floor(ms / 60000);
  const sec = Math.round((ms % 60000) / 1000);
  return `${m}m ${sec}s`;
}

function getStatusColor(status: string | null): string {
  switch (status) {
    case CronTaskStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case CronTaskStatus.RUNNING:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case CronTaskStatus.FAILED:
    case CronTaskStatus.ERROR:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case CronTaskStatus.TIMEOUT:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case CronTaskStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

function getHealthColor(health: string): string {
  switch (health) {
    case "healthy":
      return "text-green-600 dark:text-green-400";
    case "warning":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-muted-foreground";
  }
}

function getHealthBg(health: string): string {
  switch (health) {
    case "healthy":
      return "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800";
    case "warning":
      return "bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800";
    case "critical":
      return "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
    default:
      return "bg-muted border-border";
  }
}

// ─── Status label ─────────────────────────────────────────────────────────────

function statusLabel(
  status: string | null,
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>,
): string {
  switch (status) {
    case CronTaskStatus.RUNNING:
      return t("widget.status.running");
    case CronTaskStatus.COMPLETED:
      return t("widget.status.completed");
    case CronTaskStatus.FAILED:
      return t("widget.status.failed");
    case CronTaskStatus.ERROR:
      return t("widget.status.error");
    case CronTaskStatus.TIMEOUT:
      return t("widget.status.timeout");
    case CronTaskStatus.PENDING:
      return t("widget.status.pending");
    case CronTaskStatus.SCHEDULED:
      return t("widget.status.scheduled");
    case CronTaskStatus.CANCELLED:
      return t("widget.status.cancelled");
    default:
      return t("widget.status.unknown");
  }
}

// ─── Execution Dots ───────────────────────────────────────────────────────────

function ExecutionDots({
  executions,
}: {
  executions: Task["recentExecutions"];
}): React.JSX.Element {
  if (executions.length === 0) {
    return <Span className="text-xs text-muted-foreground">—</Span>;
  }
  return (
    <Div className="flex gap-1 items-center">
      {executions.map((exec, i) => (
        <Div
          key={i}
          title={`${exec.status}${exec.durationMs !== null ? ` · ${exec.durationMs}ms` : ""}${exec.resultSnippet ? ` · ${exec.resultSnippet}` : ""}`}
          className={cn(
            "w-3 h-3 rounded-full flex-shrink-0",
            exec.status === CronTaskStatus.COMPLETED
              ? "bg-green-500"
              : exec.status === CronTaskStatus.FAILED ||
                  exec.status === CronTaskStatus.ERROR
                ? "bg-red-500"
                : exec.status === CronTaskStatus.RUNNING
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-400",
          )}
        />
      ))}
    </Div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  t,
  onRun,
}: {
  task: Task;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
  onRun: (task: Task) => void;
}): React.JSX.Element {
  const successRate =
    task.executionCount > 0
      ? Math.round((task.successCount / task.executionCount) * 100)
      : null;

  return (
    <Div
      className={cn(
        "rounded-lg border p-4 flex flex-col gap-3",
        !task.enabled && "opacity-60",
      )}
    >
      {/* Header */}
      <Div className="flex items-start justify-between gap-2">
        <Div className="flex flex-col gap-0.5 min-w-0">
          <Div className="flex items-center gap-2">
            <Div
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                task.enabled ? "bg-green-500" : "bg-gray-400",
              )}
            />
            <Span className="font-semibold text-sm truncate">
              {task.displayName}
            </Span>
          </Div>
          {task.description && (
            <Span className="text-xs text-muted-foreground pl-4 truncate">
              {task.description}
            </Span>
          )}
        </Div>
        <Div className="flex items-center gap-1.5 flex-shrink-0">
          <Span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
              getStatusColor(task.lastExecutionStatus),
            )}
          >
            {statusLabel(task.lastExecutionStatus, t)}
          </Span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => {
              onRun(task);
            }}
            title={t("widget.task.runNow")}
          >
            <Play className="h-3.5 w-3.5" />
          </Button>
        </Div>
      </Div>

      {/* Schedule + success rate */}
      <Div className="flex items-center gap-4 text-xs text-muted-foreground">
        <Span className="font-mono">{task.schedule}</Span>
        {successRate !== null && (
          <Span
            className={cn(
              "font-medium",
              successRate >= 95
                ? "text-green-600 dark:text-green-400"
                : successRate >= 80
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-red-600 dark:text-red-400",
            )}
          >
            {successRate}%
          </Span>
        )}
        {task.averageExecutionTime !== null &&
          task.averageExecutionTime > 0 && (
            <Span>{formatDuration(task.averageExecutionTime)}</Span>
          )}
      </Div>

      {/* Recent executions dots */}
      <Div className="flex flex-col gap-1">
        <ExecutionDots executions={task.recentExecutions} />
        {task.lastResultSummary && (
          <Span className="text-xs text-muted-foreground font-mono truncate">
            {task.lastResultSummary}
          </Span>
        )}
      </Div>

      {/* Last / Next run */}
      <Div className="grid grid-cols-2 gap-2 text-xs">
        <Div className="flex flex-col gap-0.5">
          <Span className="text-muted-foreground">
            {t("widget.task.lastRun")}
          </Span>
          <Span>
            {formatDate(task.lastExecutedAt) || t("widget.task.never")}
          </Span>
        </Div>
        <Div className="flex flex-col gap-0.5">
          <Span className="text-muted-foreground">
            {t("widget.task.nextRun")}
          </Span>
          <Span>{formatDate(task.nextExecutionAt) || "—"}</Span>
        </Div>
      </Div>
    </Div>
  );
}

// ─── Alert Card ───────────────────────────────────────────────────────────────

function AlertCard({
  alert,
  t,
}: {
  alert: Alert;
  t: ReturnType<typeof useWidgetTranslation<typeof definition.GET>>;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-3 flex flex-col gap-1">
      <Div className="flex items-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
        <Span className="font-semibold text-sm text-red-700 dark:text-red-300">
          {alert.taskName}
        </Span>
        <Span className="text-xs text-red-600 dark:text-red-400 ml-auto">
          {alert.consecutiveFailures} {t("widget.alerts.failures")}
        </Span>
      </Div>
      {alert.lastError && (
        <Span className="text-xs text-red-600 dark:text-red-400 font-mono pl-5 truncate">
          {alert.lastError}
        </Span>
      )}
    </Div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function CronDashboardContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const t = useWidgetTranslation<typeof definition.GET>();
  const { push: navigate } = useWidgetNavigation();
  const isLoading = endpointMutations?.read?.isLoading;

  const handleRun = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../../execute/definition");
        navigate(m.default.POST, {
          data: { taskId: task.id },
          renderInModal: true,
        });
      })();
    },
    [navigate],
  );

  const campaignTasks = useMemo(
    () =>
      (data?.tasks ?? []).filter((task) => CAMPAIGN_TASK_IDS.includes(task.id)),
    [data?.tasks],
  );

  const allTasks = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const alerts: Alert[] = useMemo(() => data?.alerts ?? [], [data?.alerts]);
  const stats: Stats | null = data?.stats ?? null;

  const handleRefresh = (): void => {
    endpointMutations?.read?.refetch?.();
  };

  if (isLoading && !data) {
    return (
      <Div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <Span className="text-sm text-muted-foreground">
          {t("widget.loading")}
        </Span>
      </Div>
    );
  }

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Div className="flex items-center justify-between gap-2">
        <Span className="font-semibold text-base">{t("widget.title")}</Span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleRefresh}
          title={t("widget.refresh")}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </Div>

      {/* ── System health bar ───────────────────────────────────────────── */}
      {stats && (
        <Div
          className={cn(
            "rounded-lg border p-3 flex items-center gap-3",
            getHealthBg(stats.systemHealth),
          )}
        >
          {stats.systemHealth === "healthy" ? (
            <CheckCircle2
              className={cn(
                "h-5 w-5 flex-shrink-0",
                getHealthColor(stats.systemHealth),
              )}
            />
          ) : (
            <XCircle
              className={cn(
                "h-5 w-5 flex-shrink-0",
                getHealthColor(stats.systemHealth),
              )}
            />
          )}
          <Span
            className={cn(
              "font-semibold text-sm",
              getHealthColor(stats.systemHealth),
            )}
          >
            {t(
              `widget.health.${stats.systemHealth}` as Parameters<typeof t>[0],
            )}
          </Span>
          <Div className="flex items-center gap-4 ml-auto text-xs text-muted-foreground">
            <Span>
              {stats.enabledTasks}/{stats.totalTasks}{" "}
              {t("widget.stats.enabled")}
            </Span>
            {stats.successRate24h !== null && (
              <Span className="font-medium">{stats.successRate24h}%</Span>
            )}
            {stats.failedTasks24h > 0 && (
              <Span className="text-red-600 dark:text-red-400 font-medium">
                {stats.failedTasks24h} {t("widget.stats.failed24h")}
              </Span>
            )}
          </Div>
        </Div>
      )}

      {/* ── Alerts ──────────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <Div className="flex flex-col gap-2">
          <Span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {t("widget.alerts.title")}
          </Span>
          {alerts.map((alert) => (
            <AlertCard key={alert.taskId} alert={alert} t={t} />
          ))}
        </Div>
      )}

      {/* ── Campaign Tasks ───────────────────────────────────────────────── */}
      {campaignTasks.length > 0 ? (
        <Div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {campaignTasks.map((task) => (
            <TaskCard key={task.id} task={task} t={t} onRun={handleRun} />
          ))}
        </Div>
      ) : (
        <Div className="flex flex-col gap-3">
          {allTasks.length === 0 ? (
            <Span className="text-sm text-muted-foreground text-center py-8">
              {t("widget.empty")}
            </Span>
          ) : (
            /* Fallback: show all tasks if campaign-specific ones not present */
            <Div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allTasks
                .filter((task) => !task.hidden)
                .map((task) => (
                  <TaskCard key={task.id} task={task} t={t} onRun={handleRun} />
                ))}
            </Div>
          )}
        </Div>
      )}
    </Div>
  );
}
