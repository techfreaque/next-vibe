/**
 * Custom Widget for Cron Task Detail View
 * Full-featured task profile with execution stats, navigation, edit, delete, and history.
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  TrendingUp,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { CronTaskPriority, CronTaskStatus } from "../../../enum";
import type endpoints from "./definition";
import type { CronTaskGetResponseOutput } from "./definition";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Task = CronTaskGetResponseOutput["task"];

interface WidgetProps {
  field: {
    value: CronTaskGetResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Status / Priority color maps
// Keyed on enum values (i18n key strings), not plain short strings
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
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
};

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  [CronTaskPriority.HIGH]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskPriority.MEDIUM]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  [CronTaskPriority.LOW]:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  [CronTaskPriority.BACKGROUND]:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

function formatDate(s: string | null | undefined, never: string): string {
  if (!s) {
    return never;
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
    return `${(ms / 1000).toFixed(1)}s`;
  }
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Badge({
  label,
  className,
}: {
  label: string;
  className: string;
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        className,
      )}
    >
      {label}
    </Span>
  );
}

function StatCard({
  icon,
  value,
  label,
  iconColor,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconColor: string;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col items-center gap-1 p-4 rounded-lg border bg-card text-center">
      <Div style={{ color: iconColor, marginBottom: "2px" }}>{icon}</Div>
      <Div
        style={{
          fontWeight: 700,
          fontSize: "1.5rem",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.2,
        }}
      >
        {String(value)}
      </Div>
      <Div className="text-xs text-muted-foreground text-center">{label}</Div>
    </Div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col gap-0.5">
      <Div className="text-xs text-muted-foreground">{label}</Div>
      <Div className="text-sm">{children}</Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function CronTaskDetailContainer({
  field,
}: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const { push: navigate } = useWidgetNavigation();
  const { endpointMutations } = useWidgetContext();
  const locale = useWidgetLocale();
  const router = useRouter();
  const children = field.children;

  const isLoading = endpointMutations?.read?.isLoading;
  const task: Task | null | undefined = field.value?.task;

  // ── Navigation: edit task ──
  const handleEdit = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.PUT, {
        urlPathParams: { id: task.id },
        prefillFromGet: true,
        getEndpoint: m.default.GET,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate, task]);

  // ── Navigation: delete task ──
  const handleDelete = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.DELETE, {
        urlPathParams: { id: task.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate, task]);

  // ── Navigation: history ──
  const handleHistory = useCallback((): void => {
    if (!task?.id) {
      return;
    }
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale, task]);

  // ── Refresh ──
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <Div className="flex items-center justify-center h-full min-h-64 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // ── Not found state ──
  if (field.value && !task) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <XCircle className="h-8 w-8 text-muted-foreground" />
        <Div className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.notFound",
          )}
        </Div>
      </Div>
    );
  }

  // ── No data yet ──
  if (!task) {
    return (
      <Div className="flex items-center justify-center h-full min-h-64 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Div>
    );
  }

  // ── Computed values ──
  const successRate =
    task.executionCount > 0
      ? Math.round((task.successCount / task.executionCount) * 100)
      : 0;

  const neverLabel = t(
    "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.never",
  );

  const statusColorClass = task.lastExecutionStatus
    ? (STATUS_COLORS[task.lastExecutionStatus] ??
      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")
    : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  const priorityColorClass =
    PRIORITY_COLORS[task.priority] ??
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <Div className="flex flex-col gap-0 pb-8">
      {/* ── Top action bar ── */}
      <Div className="flex items-center gap-2 p-4 border-b sticky top-0 bg-background z-10">
        <NavigateButtonWidget field={children.backButton} />

        <Div className="flex-1 min-w-0">
          <Div className="font-bold text-lg truncate leading-tight">
            {task.name}
          </Div>
        </Div>

        <Div className="flex items-center gap-1 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleHistory}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.history",
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.edit",
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.delete",
            )}
          </Button>
        </Div>
      </Div>

      <Div className="px-4 pt-4 flex flex-col gap-4">
        {/* ── Header: name + enabled badge ── */}
        <Div className="flex flex-wrap items-center gap-3 pb-1">
          <Div className="text-2xl font-bold leading-snug">{task.name}</Div>
          <Badge
            label={
              task.enabled
                ? t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.enabled",
                  )
                : t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.disabled",
                  )
            }
            className={
              task.enabled
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            }
          />
        </Div>

        {task.description && (
          <Div className="text-sm text-muted-foreground -mt-2">
            {task.description}
          </Div>
        )}

        {/* ── Identity section ── */}
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.identity",
            )}
          </Div>
          <Div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.id",
              )}
            >
              <Div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.78rem",
                  color: "var(--muted-foreground)",
                  wordBreak: "break-all",
                }}
              >
                {task.id}
              </Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.version",
              )}
            >
              <Div>{task.version}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.category",
              )}
            >
              <Badge
                label={t(task.category)}
                className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.priority",
              )}
            >
              <Badge label={t(task.priority)} className={priorityColorClass} />
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.schedule",
              )}
            >
              <Div
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  background: "var(--muted)",
                  borderRadius: "4px",
                  padding: "1px 6px",
                  display: "inline-block",
                }}
              >
                {task.schedule}
              </Div>
            </InfoRow>
            {task.timezone && (
              <InfoRow
                label={t(
                  "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timezone",
                )}
              >
                <Div>{task.timezone}</Div>
              </InfoRow>
            )}
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.createdAt",
              )}
            >
              <Div>{formatDate(task.createdAt, neverLabel)}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.updatedAt",
              )}
            >
              <Div>{formatDate(task.updatedAt, neverLabel)}</Div>
            </InfoRow>
          </Div>
        </Div>

        {/* ── Execution stats row: 4 stat cards ── */}
        <Div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            value={task.executionCount}
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.stats.totalExecutions",
            )}
            iconColor="#2563eb"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5" />}
            value={task.successCount}
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.stats.successful",
            )}
            iconColor="#16a34a"
          />
          <StatCard
            icon={<XCircle className="h-5 w-5" />}
            value={task.errorCount}
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.stats.errors",
            )}
            iconColor="#dc2626"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            value={`${successRate}%`}
            label={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.stats.successRate",
            )}
            iconColor="#9333ea"
          />
        </Div>

        {/* ── Success rate progress bar ── */}
        <Div className="rounded-lg border p-4 flex flex-col gap-2">
          <Div className="flex items-center justify-between">
            <Div className="text-xs font-medium text-muted-foreground">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.stats.successRate",
              )}
            </Div>
            <Div
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#16a34a",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {successRate}%
            </Div>
          </Div>
          <Div className="bg-muted rounded-full h-2 overflow-hidden">
            <Div
              style={{
                width: `${Math.min(successRate, 100)}%`,
                backgroundColor: "#22c55e",
                height: "8px",
                borderRadius: "9999px",
                transition: "width 0.3s",
              }}
            />
          </Div>
        </Div>

        {/* ── Timing section ── */}
        <Div className="rounded-lg border p-4 flex flex-col gap-3">
          <Div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground pb-1 border-b">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timingSection",
            )}
          </Div>
          <Div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.avgDuration",
              )}
            >
              <Div>{formatDuration(task.averageExecutionTime)}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.lastDuration",
              )}
            >
              <Div>{formatDuration(task.lastExecutionDuration)}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.lastRun",
              )}
            >
              <Div className="flex flex-wrap items-center gap-1">
                <Div>{formatDate(task.lastExecutedAt, neverLabel)}</Div>
                {task.lastExecutionStatus && (
                  <Badge
                    label={t(task.lastExecutionStatus)}
                    className={statusColorClass}
                  />
                )}
              </Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.nextRun",
              )}
            >
              <Div>{formatDate(task.nextExecutionAt, neverLabel)}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.timeout",
              )}
            >
              <Div>{formatDuration(task.timeout)}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.retries",
              )}
            >
              <Div>{task.retries ?? "—"}</Div>
            </InfoRow>
            <InfoRow
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.timing.retryDelay",
              )}
            >
              <Div>{formatDuration(task.retryDelay)}</Div>
            </InfoRow>
          </Div>
        </Div>

        {/* ── Last execution error (conditional) ── */}
        {task.lastExecutionError && (
          <Div
            style={{
              border: "1px solid #fca5a5",
              background: "rgba(239,68,68,0.04)",
              borderRadius: "0.5rem",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <Div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
              <Div className="text-xs font-semibold uppercase tracking-wide text-red-600">
                {t(
                  "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.lastExecutionError",
                )}
              </Div>
            </Div>
            <Div
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#dc2626",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {task.lastExecutionError}
            </Div>
          </Div>
        )}

        {/* ── Bottom action row ── */}
        <Div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="gap-1.5"
          >
            <Pencil className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.edit",
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleHistory}
            className="gap-1.5"
          >
            <Clock className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.history",
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.refresh",
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.task.widget.delete",
            )}
          </Button>
        </Div>
      </Div>
    </Div>
  );
}
