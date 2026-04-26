/**
 * Cron Tasks Widget
 * Full task management list with status filters, search, sort, bulk selection, and CRUD navigation
 */

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "next-vibe-ui/ui/alert-dialog";
import { Button } from "next-vibe-ui/ui/button";
import { Checkbox } from "next-vibe-ui/ui/checkbox";
import { Div } from "next-vibe-ui/ui/div";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Circle } from "next-vibe-ui/ui/icons/Circle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { Eye } from "next-vibe-ui/ui/icons/Eye";
import { GitBranch } from "next-vibe-ui/ui/icons/GitBranch";
import { History } from "next-vibe-ui/ui/icons/History";
import { Layers } from "next-vibe-ui/ui/icons/Layers";
import { Loader2 } from "next-vibe-ui/ui/icons/Loader2";
import { Pencil } from "next-vibe-ui/ui/icons/Pencil";
import { Play } from "next-vibe-ui/ui/icons/Play";
import { Plus } from "next-vibe-ui/ui/icons/Plus";
import { RefreshCw } from "next-vibe-ui/ui/icons/RefreshCw";
import { Search } from "next-vibe-ui/ui/icons/Search";
import { Trash2 } from "next-vibe-ui/ui/icons/Trash2";
import { XCircle } from "next-vibe-ui/ui/icons/XCircle";
import { Input } from "next-vibe-ui/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe-ui/ui/select";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo, useState } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import { useApiMutation } from "@/app/api/[locale]/system/unified-interface/react/hooks/use-api-mutation";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/widget";
import { useTouchDevice } from "next-vibe-ui/hooks/use-touch-device";

import type {
  CronTaskPriorityDB,
  CronTaskPriorityFilterValue,
  TaskCategoryDB,
} from "../../enum";
import {
  CronTaskEnabledFilter,
  CronTaskHiddenFilter,
  CronTaskPriority,
  CronTaskPriorityOptions,
  CronTaskStatus,
  type CronTaskStatusValue,
  TaskCategoryOptions,
} from "../../enum";
import { scopedTranslation as tasksScopedTranslation } from "../../i18n";
import bulkEndpoints from "../bulk/definition";
import type endpoints from "./definition";
import type { CronTaskListResponseOutput } from "./definition";
import type { CronTasksTranslationKey } from "./i18n";

type Task = CronTaskListResponseOutput["tasks"][number];

interface WidgetProps {
  field: (typeof endpoints.GET)["fields"];
}

// ---------------------------------------------------------------------------
// Constants
// Keyed on enum values (i18n key strings), not plain short strings
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  [CronTaskStatus.RUNNING]: "bg-info/10 text-info",
  [CronTaskStatus.COMPLETED]: "bg-success/10 text-success",
  [CronTaskStatus.FAILED]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.ERROR]: "bg-destructive/10 text-destructive",
  [CronTaskStatus.TIMEOUT]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  [CronTaskStatus.PENDING]: "bg-warning/10 text-warning",
  [CronTaskStatus.SCHEDULED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [CronTaskStatus.CANCELLED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]: "text-destructive",
  [CronTaskPriority.HIGH]: "text-orange-600 dark:text-orange-400",
  [CronTaskPriority.MEDIUM]: "text-info",
  [CronTaskPriority.LOW]: "text-success",
  [CronTaskPriority.BACKGROUND]: "text-gray-500 dark:text-gray-400",
};

type StatusFilterKey =
  | "ALL"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "PENDING"
  | "DISABLED";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(s: string | null): string {
  if (!s) {
    return "";
  }
  return s.slice(0, 16).replace("T", " ");
}

function formatDuration(ms: number | null): string {
  if (ms === null) {
    return "—";
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function successRate(task: Task): number {
  return task.executionCount > 0
    ? Math.round((task.successCount / task.executionCount) * 100)
    : 0;
}

function getStatusColorClass(status: string | null): string {
  if (!status) {
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
  return (
    STATUS_COLORS[status] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({
  status,
  tTasks,
}: {
  status: string | null;
  tTasks: ReturnType<typeof tasksScopedTranslation.scopedT>["t"];
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
        getStatusColorClass(status),
      )}
    >
      {status ? tTasks(status as Parameters<typeof tTasks>[0]) : "—"}
    </Span>
  );
}

function EnabledDot({ enabled }: { enabled: boolean }): React.JSX.Element {
  return (
    <Div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        flexShrink: 0,
        backgroundColor: enabled ? "#22c55e" : "#9ca3af",
      }}
    />
  );
}

function HiddenBadge({
  t,
}: {
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  return (
    <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 line-through">
      {t("widget.task.hiddenBadge")}
    </Span>
  );
}

function TaskRow({
  task,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
  onHistory,
  onRun,
  t,
  tTasks,
  isTouch,
}: {
  task: Task;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onHistory: (task: Task) => void;
  onRun: (task: Task) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  tTasks: ReturnType<typeof tasksScopedTranslation.scopedT>["t"];
  isTouch: boolean;
}): React.JSX.Element {
  const rate = successRate(task);
  const lastRunText = formatDate(task.lastExecutedAt);
  const nextRunText = formatDate(task.nextExecutionAt);
  const avgDurText = formatDuration(task.averageExecutionTime);

  const lastRunColorClass = task.lastExecutionStatus
    ? getStatusColorClass(task.lastExecutionStatus)
    : "";

  return (
    <Div
      className={cn(
        "group flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0",
        selected && "bg-primary/5",
      )}
    >
      {/* Checkbox */}
      <Div className="flex-shrink-0 mt-1">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(task.id)}
          aria-label={`Select ${task.displayName}`}
        />
      </Div>

      {/* Enabled indicator dot */}
      <Div className="flex-shrink-0 mt-1.5">
        <EnabledDot enabled={task.enabled} />
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Span className="font-semibold text-sm truncate">
            {task.displayName}
          </Span>
          {/* routeId badge */}
          <Span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs font-mono",
              "bg-muted text-muted-foreground",
            )}
          >
            {task.routeId}
          </Span>
          {/* System vs user owner chip */}
          {task.owner.type === "system" ? (
            <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {t("widget.task.owner.system")}
            </Span>
          ) : (
            <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              {t("widget.task.owner.user")}
            </Span>
          )}
          <Span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs font-medium",
              "bg-muted text-muted-foreground",
            )}
          >
            {tTasks(task.category)}
          </Span>
          {task.priority && (
            <Span
              className={cn(
                "text-xs font-medium",
                PRIORITY_COLORS[task.priority] ?? "text-muted-foreground",
              )}
            >
              {tTasks(task.priority)}
            </Span>
          )}
          {task.hidden && <HiddenBadge t={t} />}
        </Div>

        {task.description && (
          <Span className="text-xs text-muted-foreground block truncate mb-1">
            {task.description}
          </Span>
        )}

        <Span className="text-xs font-mono text-muted-foreground">
          {task.schedule}
        </Span>

        {/* Stats row (hidden on small screens) */}
        <Div className="hidden sm:flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <Span>
            {t("widget.task.executions")}
            {` ${task.executionCount}/${task.successCount}`}
          </Span>
          <Span>{`${rate}%`}</Span>
          <Span>{avgDurText}</Span>
        </Div>
      </Div>

      {/* Last run */}
      <Div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 min-w-[100px]">
        <Span className="text-xs text-muted-foreground">
          {t("widget.task.lastRun")}
        </Span>
        {lastRunText ? (
          <Span
            className={cn("text-xs px-1 py-0.5 rounded", lastRunColorClass)}
          >
            {lastRunText}
          </Span>
        ) : (
          <Span className="text-xs text-muted-foreground">
            {t("widget.task.never")}
          </Span>
        )}
      </Div>

      {/* Next run */}
      <Div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 min-w-[100px]">
        <Span className="text-xs text-muted-foreground">
          {t("widget.task.nextRun")}
        </Span>
        <Span className="text-xs">
          {nextRunText || t("widget.task.notScheduled")}
        </Span>
      </Div>

      {/* Status badge */}
      <Div className="flex-shrink-0 flex items-center">
        <StatusBadge status={task.lastExecutionStatus} tTasks={tTasks} />
      </Div>

      {/* Action buttons (appear on hover) */}
      <Div
        className={cn(
          "flex-shrink-0 flex items-center gap-1",
          isTouch
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 transition-opacity",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-success hover:text-success/80"
          onClick={() => onRun(task)}
          title={t("widget.action.runNow")}
        >
          <Play className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onView(task)}
          title={t("widget.action.view")}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onHistory(task)}
          title={t("widget.action.history")}
        >
          <Clock className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onEdit(task)}
          title={t("widget.action.edit")}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(task)}
          title={t("widget.action.delete")}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Status filter tab
// ---------------------------------------------------------------------------

function FilterTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}): React.JSX.Element {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "h-7 px-2.5 text-xs gap-1.5 rounded-md",
        active
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
    >
      {label}
      <Span
        className={cn(
          "inline-flex items-center justify-center min-w-[1.125rem] h-4.5 px-1 rounded-full text-xs font-medium",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </Span>
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Bulk action toolbar
// ---------------------------------------------------------------------------

function BulkToolbar({
  selectedCount,
  totalCount,
  allSelected,
  isBulkLoading,
  onSelectAll,
  onClearSelection,
  onBulkEnable,
  onBulkDisable,
  onBulkRun,
  onBulkDelete,
  t,
}: {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  isBulkLoading: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkEnable: () => void;
  onBulkDisable: () => void;
  onBulkRun: () => void;
  onBulkDelete: () => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
}): React.JSX.Element {
  return (
    <Div className="flex items-center gap-2 px-4 py-2 border-b bg-primary/5 flex-wrap">
      {/* Checkbox + count */}
      <Div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={allSelected ? onClearSelection : onSelectAll}
          aria-label={
            allSelected
              ? t("widget.bulk.clearSelection")
              : t("widget.bulk.selectAll")
          }
        />
        <Span className="text-xs font-medium text-primary">
          {t("widget.bulk.selected").replace("{count}", String(selectedCount))}
        </Span>
        <Span className="text-xs text-muted-foreground">/ {totalCount}</Span>
      </Div>

      <Div className="w-px bg-border self-stretch mx-1" />

      {/* Action buttons */}
      <Div className="flex items-center gap-1 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs gap-1.5"
          onClick={onBulkEnable}
          disabled={isBulkLoading}
        >
          {t("widget.bulk.enable")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs gap-1.5"
          onClick={onBulkDisable}
          disabled={isBulkLoading}
        >
          {t("widget.bulk.disable")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs gap-1.5 text-success hover:text-success/80 border-success/30 hover:border-success/50"
          onClick={onBulkRun}
          disabled={isBulkLoading}
        >
          <Play className="h-3 w-3" />
          {t("widget.bulk.runNow")}
        </Button>

        {/* Delete with AlertDialog confirmation */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50"
              disabled={isBulkLoading}
            >
              <Trash2 className="h-3 w-3" />
              {t("widget.bulk.delete")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("widget.bulk.confirmDeleteTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("widget.bulk.confirmDelete").replace(
                  "{count}",
                  String(selectedCount),
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("widget.bulk.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                onClick={onBulkDelete}
              >
                {t("widget.bulk.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Div>

      {/* Loading indicator */}
      {isBulkLoading && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
      )}

      {/* Clear selection */}
      {!isBulkLoading && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground ml-auto"
          onClick={onClearSelection}
        >
          {t("widget.bulk.clearSelection")}
        </Button>
      )}
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export function CronTasksContainer({ field }: WidgetProps): React.JSX.Element {
  const children = field.children;
  const data = useWidgetValue<typeof endpoints.GET>();
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const { t: tTasks } = tasksScopedTranslation.scopedT(locale);
  const form = useWidgetForm<typeof endpoints.GET>();

  const isLoading = endpointMutations?.read?.isLoading;
  const isTouch = useTouchDevice();
  const logger = useWidgetLogger();
  const user = useWidgetUser();

  const tasks: Task[] = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const totalTasks = data?.totalTasks ?? 0;
  const countsByStatus = data?.countsByStatus;
  const countsByHidden = data?.countsByHidden;

  // ── Bulk selection state ──────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Bulk mutation ─────────────────────────────────────────────────────────
  const bulkMutation = useApiMutation(bulkEndpoints.POST, logger, user);

  // ── Search + sort from form state ─────────────────────────────────────
  const search = form.watch("search") ?? "";
  const sort = form.watch("sort") ?? "name_asc";

  // ── Derive active tab from form state ──────────────────────────────────
  const enabledValue = form.watch("enabled");
  const serverStatusRaw = form.watch("status");
  const serverStatus: (typeof CronTaskStatusValue)[] = useMemo(
    () => serverStatusRaw ?? [],
    [serverStatusRaw],
  );

  const activeStatusTab: StatusFilterKey = useMemo((): StatusFilterKey => {
    if (enabledValue === CronTaskEnabledFilter.DISABLED) {
      return "DISABLED";
    }
    if (serverStatus.length === 0) {
      return "ALL";
    }
    if (
      serverStatus.length === 1 &&
      serverStatus[0] === CronTaskStatus.RUNNING
    ) {
      return "RUNNING";
    }
    if (
      serverStatus.length === 1 &&
      serverStatus[0] === CronTaskStatus.COMPLETED
    ) {
      return "COMPLETED";
    }
    if (
      serverStatus.length === 1 &&
      serverStatus[0] === CronTaskStatus.PENDING
    ) {
      return "PENDING";
    }
    if (
      serverStatus.includes(CronTaskStatus.FAILED) ||
      serverStatus.includes(CronTaskStatus.ERROR)
    ) {
      return "FAILED";
    }
    return "ALL";
  }, [enabledValue, serverStatus]);

  // ── Tab counts - from server response (accurate across full DB) ──────────
  const counts = useMemo(() => {
    return {
      all: countsByStatus?.all ?? totalTasks,
      running: countsByStatus?.running ?? 0,
      completed: countsByStatus?.completed ?? 0,
      failed: countsByStatus?.failed ?? 0,
      pending: countsByStatus?.pending ?? 0,
      disabled: countsByStatus?.disabled ?? 0,
    };
  }, [countsByStatus, totalTasks]);

  // ── All filtering is server-side; tasks from server are already filtered ──
  const filteredTasks = tasks;

  // ── Derived selection state ───────────────────────────────────────────────
  const allFilteredSelected =
    filteredTasks.length > 0 &&
    filteredTasks.every((task) => selectedIds.has(task.id));

  // ── Bulk selection handlers ───────────────────────────────────────────────
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(filteredTasks.map((task) => task.id)));
  }, [filteredTasks]);

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ── Bulk action executor ──────────────────────────────────────────────────
  const executeBulkAction = useCallback(
    (action: "enable" | "disable" | "run" | "delete") => {
      const ids = [...selectedIds];
      void bulkMutation
        .mutateAsync({ requestData: { ids, action } })
        .then(async () => {
          handleClearSelection();
          // Update caches optimistically - no refetch needed
          const { apiClient } =
            await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
          const tasksDef = await import("./definition");
          const queueDef = await import("../queue/definition");
          if (action === "delete") {
            apiClient.updateEndpointData(
              tasksDef.default.GET,
              logger,
              (old) => {
                if (!old?.success) {
                  return old;
                }
                return {
                  success: true as const,
                  data: {
                    ...old.data,
                    tasks: old.data.tasks.filter(
                      (task) => !ids.includes(task.id),
                    ),
                    totalTasks: Math.max(0, old.data.totalTasks - ids.length),
                  },
                };
              },
            );
            apiClient.updateEndpointData(
              queueDef.default.GET,
              logger,
              (old) => {
                if (!old?.success) {
                  return old;
                }
                return {
                  success: true as const,
                  data: {
                    ...old.data,
                    tasks: old.data.tasks.filter(
                      (task) => !ids.includes(task.id),
                    ),
                    totalTasks: Math.max(0, old.data.totalTasks - ids.length),
                  },
                };
              },
            );
          } else if (action === "enable" || action === "disable") {
            const enabled = action === "enable";
            apiClient.updateEndpointData(
              tasksDef.default.GET,
              logger,
              (old) => {
                if (!old?.success) {
                  return old;
                }
                return {
                  success: true as const,
                  data: {
                    ...old.data,
                    tasks: old.data.tasks.map((task) =>
                      ids.includes(task.id) ? { ...task, enabled } : task,
                    ),
                  },
                };
              },
            );
            apiClient.updateEndpointData(
              queueDef.default.GET,
              logger,
              (old) => {
                if (!old?.success) {
                  return old;
                }
                return {
                  success: true as const,
                  data: {
                    ...old.data,
                    tasks: old.data.tasks.map((task) =>
                      ids.includes(task.id) ? { ...task, enabled } : task,
                    ),
                  },
                };
              },
            );
          }
          return undefined;
        });
    },
    [selectedIds, bulkMutation, handleClearSelection, logger],
  );

  // ── Helper: update form fields - auto-submit handles the refetch ─────────
  const patchForm = useCallback(
    (
      patch: Partial<(typeof endpoints.GET)["types"]["RequestOutput"]>,
    ): void => {
      if (!form) {
        return;
      }
      if (patch.enabled !== undefined) {
        form.setValue("enabled", patch.enabled, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      if (patch.status !== undefined) {
        form.setValue("status", patch.status, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      if (patch.priority !== undefined) {
        form.setValue("priority", patch.priority, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
      if (patch.category !== undefined) {
        form.setValue("category", patch.category, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    },
    [form],
  );

  // ── Status tab handler - updates server-side filters and refetches ───────
  type RequestOutput = (typeof endpoints.GET)["types"]["RequestOutput"];

  const handleStatusTabChange = useCallback(
    (key: StatusFilterKey): void => {
      if (key === "DISABLED") {
        patchForm({ enabled: CronTaskEnabledFilter.DISABLED, status: [] });
      } else {
        const statusMap: Record<StatusFilterKey, RequestOutput["status"]> = {
          ALL: [],
          RUNNING: [CronTaskStatus.RUNNING],
          COMPLETED: [CronTaskStatus.COMPLETED],
          FAILED: [CronTaskStatus.FAILED, CronTaskStatus.ERROR],
          PENDING: [CronTaskStatus.PENDING],
          DISABLED: [],
        };
        patchForm({
          enabled: CronTaskEnabledFilter.ALL,
          status: statusMap[key],
        });
      }
      handleClearSelection();
    },
    [patchForm, handleClearSelection],
  );

  // ── Priority filter handler ──────────────────────────────────────────────
  const priorityValue = form.watch("priority");
  const activePriority: typeof CronTaskPriorityFilterValue | "" = useMemo(
    () =>
      Array.isArray(priorityValue) && priorityValue.length === 1
        ? (priorityValue[0] ?? "")
        : "",
    [priorityValue],
  );
  const handlePriorityChange = useCallback(
    (value: (typeof CronTaskPriorityDB)[number] | ""): void => {
      patchForm({ priority: value ? [value] : [] });
    },
    [patchForm],
  );

  // ── Category filter handler ──────────────────────────────────────────────
  const categoryValue = form.watch("category");
  const activeCategory: (typeof TaskCategoryDB)[number] | "" = useMemo(
    () =>
      Array.isArray(categoryValue) && categoryValue.length === 1
        ? (categoryValue[0] ?? "")
        : "",
    [categoryValue],
  );
  const handleCategoryChange = useCallback(
    (value: (typeof TaskCategoryDB)[number] | ""): void => {
      patchForm({ category: value ? [value] : [] });
    },
    [patchForm],
  );

  // ── Hidden filter handler ────────────────────────────────────────────────
  const hiddenValue = form.watch("hidden");
  const activeHiddenFilter = hiddenValue ?? CronTaskHiddenFilter.VISIBLE;
  const handleHiddenFilterChange = useCallback(
    (
      value: (typeof CronTaskHiddenFilter)[keyof typeof CronTaskHiddenFilter],
    ): void => {
      if (!form) {
        return;
      }
      form.setValue("hidden", value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form],
  );

  // ── Navigation handlers ──────────────────────────────────────────────────
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavigateStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../stats/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleNavigateGraphs = useCallback((): void => {
    void (async (): Promise<void> => {
      const graphsDef =
        await import("@/app/api/[locale]/system/unified-interface/vibe-sense/graphs/definition");
      navigate(graphsDef.default.GET, {
        data: { search: "cron" },
      });
    })();
  }, [navigate]);

  const handleNavigateHistory = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../history/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleNavigateQueue = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../queue/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.POST, {
        popNavigationOnSuccess: 1,
      });
    })();
  }, [navigate]);

  const handleView = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../[id]/definition");
        navigate(m.default.GET, { urlPathParams: { id: task.id } });
      })();
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../[id]/definition");
        navigate(m.default.PUT, {
          urlPathParams: { id: task.id },
          data: {
            displayName: task.displayName,
            description: task.description ?? undefined,
            schedule: task.schedule,
            enabled: task.enabled,
            hidden: task.hidden,
            priority: task.priority,
            outputMode: task.outputMode,
            timeout: task.timeout ?? undefined,
            retries: task.retries ?? undefined,
            retryDelay: task.retryDelay ?? undefined,
          },
          prefillFromGet: true,
          getEndpoint: m.default.GET,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../[id]/definition");
        navigate(m.default.DELETE, {
          urlPathParams: { id: task.id },
          renderInModal: true,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleTaskHistory = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../history/definition");
        navigate(m.default.GET, {
          data: { taskId: task.id },
        });
      })();
    },
    [navigate],
  );

  const handleRun = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../../execute/definition");
        navigate(m.default.POST, {
          data: { taskId: task.id },
          renderInModal: true,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleClearFilters = useCallback((): void => {
    if (form) {
      form.setValue("search", "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      form.setValue("sort", "name_asc", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      form.setValue("hidden", CronTaskHiddenFilter.VISIBLE, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    patchForm({
      status: [],
      priority: [],
      category: [],
      enabled: CronTaskEnabledFilter.ALL,
    });
  }, [form, patchForm]);

  // ── Tab definitions ───────────────────────────────────────────────────────
  const tabs: Array<{
    key: StatusFilterKey;
    labelKey: CronTasksTranslationKey;
    count: number;
  }> = [
    {
      key: "ALL",
      labelKey: "widget.filter.all",
      count: counts.all,
    },
    {
      key: "RUNNING",
      labelKey: "widget.filter.running",
      count: counts.running,
    },
    {
      key: "COMPLETED",
      labelKey: "widget.filter.completed",
      count: counts.completed,
    },
    {
      key: "FAILED",
      labelKey: "widget.filter.failed",
      count: counts.failed,
    },
    {
      key: "PENDING",
      labelKey: "widget.filter.pending",
      count: counts.pending,
    },
    {
      key: "DISABLED",
      labelKey: "widget.filter.disabled",
      count: counts.disabled,
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <NavigateButtonWidget field={children.backButton} />

        {/* Title + count */}
        <Div className="flex items-center gap-2 mr-auto min-w-0">
          <Span className="font-semibold text-base truncate">
            {t("widget.title")}
          </Span>
          <Span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
            {totalTasks}
          </Span>
        </Div>

        {/* Right-side action buttons */}
        <Div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleNavigateStats}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{t("widget.header.stats")}</Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleNavigateGraphs}
            title={t("widget.header.graphs")}
          >
            <GitBranch className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">
              {t("widget.header.graphs")}
            </Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleNavigateQueue}
          >
            <Layers className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{t("widget.header.queue")}</Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleNavigateHistory}
          >
            <History className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">
              {t("widget.header.history")}
            </Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRefresh}
            title={t("widget.header.refresh")}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleCreate}
          >
            <Plus className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">
              {t("widget.header.create")}
            </Span>
          </Button>
        </Div>
      </Div>

      {/* ── Status filter tabs ──────────────────────────────────────── */}
      <Div className="flex flex-wrap gap-1 px-4 py-2 border-b">
        {tabs.map((tab) => (
          <FilterTab
            key={tab.key}
            label={t(tab.labelKey as Parameters<typeof t>[0])}
            count={tab.count}
            active={activeStatusTab === tab.key}
            onClick={() => handleStatusTabChange(tab.key)}
          />
        ))}

        {/* Visibility separator + toggle */}
        <Div className="w-px bg-border mx-1 self-stretch" />
        <FilterTab
          label={t("widget.filter.visible")}
          count={countsByHidden?.visible ?? 0}
          active={activeHiddenFilter === CronTaskHiddenFilter.VISIBLE}
          onClick={() => handleHiddenFilterChange(CronTaskHiddenFilter.VISIBLE)}
        />
        <FilterTab
          label={t("widget.filter.hiddenOnly")}
          count={countsByHidden?.hidden ?? 0}
          active={activeHiddenFilter === CronTaskHiddenFilter.HIDDEN}
          onClick={() => handleHiddenFilterChange(CronTaskHiddenFilter.HIDDEN)}
        />
        <FilterTab
          label={t("widget.filter.allTasks")}
          count={countsByHidden?.all ?? 0}
          active={activeHiddenFilter === CronTaskHiddenFilter.ALL}
          onClick={() => handleHiddenFilterChange(CronTaskHiddenFilter.ALL)}
        />
      </Div>

      {/* ── Filters + Sort row ──────────────────────────────────────── */}
      <Div className="flex items-center gap-2 px-4 py-2 border-b flex-wrap">
        {/* Select-all checkbox */}
        <Checkbox
          checked={allFilteredSelected}
          onCheckedChange={
            allFilteredSelected ? handleClearSelection : handleSelectAll
          }
        />

        {/* Search */}
        <Div className="relative flex-1 min-w-[140px]">
          <Div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </Div>
          <Input
            type="text"
            value={search}
            onChangeText={(val) =>
              form.setValue("search", val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            placeholder={t("widget.search.placeholder")}
            className="pl-8 h-8 text-sm"
          />
        </Div>

        {/* Priority filter - server-side */}
        <Select
          value={activePriority || "ALL"}
          onValueChange={(v) =>
            handlePriorityChange(
              v === "ALL" ? "" : (v as (typeof CronTaskPriorityDB)[number]),
            )
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {t("widget.filter.allPriorities")}
            </SelectItem>
            {CronTaskPriorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category filter - server-side */}
        <Select
          value={activeCategory || "ALL"}
          onValueChange={(v) =>
            handleCategoryChange(
              v === "ALL" ? "" : (v as (typeof TaskCategoryDB)[number]),
            )
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[110px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {t("widget.filter.allCategories")}
            </SelectItem>
            {TaskCategoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label as Parameters<typeof t>[0])}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sort}
          onValueChange={(val) =>
            form.setValue("sort", val, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_asc">{t("widget.sort.nameAsc")}</SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_desc">
              {t("widget.sort.nameDesc")}
            </SelectItem>
            <SelectItem value="schedule">
              {t("widget.sort.schedule")}
            </SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="last_run_desc">
              {t("widget.sort.lastRunNewest")}
            </SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="executions_desc">
              {t("widget.sort.executionsMost")}
            </SelectItem>
          </SelectContent>
        </Select>
      </Div>

      {/* ── Bulk action toolbar (visible when any selected) ─────────── */}
      {selectedIds.size > 0 && (
        <BulkToolbar
          selectedCount={selectedIds.size}
          totalCount={filteredTasks.length}
          allSelected={allFilteredSelected}
          isBulkLoading={bulkMutation.isPending}
          onSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onBulkEnable={() => executeBulkAction("enable")}
          onBulkDisable={() => executeBulkAction("disable")}
          onBulkRun={() => executeBulkAction("run")}
          onBulkDelete={() => executeBulkAction("delete")}
          t={t}
        />
      )}

      {/* ── Loading state ───────────────────────────────────────────── */}
      {isLoading && (
        <Div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.loading")}
          </Span>
        </Div>
      )}

      {/* ── Task list ──────────────────────────────────────────────── */}
      {!isLoading && filteredTasks.length > 0 && (
        <Div className="divide-y">
          {filteredTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedIds.has(task.id)}
              onToggleSelect={handleToggleSelect}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onHistory={handleTaskHistory}
              onRun={handleRun}
              t={t}
              tTasks={tTasks}
              isTouch={isTouch}
            />
          ))}
        </Div>
      )}

      {/* ── Empty state ────────────────────────────────────────────── */}
      {!isLoading && filteredTasks.length === 0 && (
        <Div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-4">
          {tasks.length === 0 ? (
            <Circle className="h-10 w-10 text-muted-foreground" />
          ) : (
            <XCircle className="h-10 w-10 text-muted-foreground" />
          )}
          <Div className="flex flex-col gap-1">
            <Span className="font-medium text-sm">
              {tasks.length === 0
                ? t("widget.empty.noTasks")
                : t("widget.empty.noMatches")}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {tasks.length === 0
                ? t("widget.empty.noTasksDesc")
                : t("widget.empty.noMatchesDesc")}
            </Span>
          </Div>
          <Div className="flex gap-2">
            {tasks.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                {t("widget.empty.clearFilters")}
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCreate}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {t("widget.header.create")}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
