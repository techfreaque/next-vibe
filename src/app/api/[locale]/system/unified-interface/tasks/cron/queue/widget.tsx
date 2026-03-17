/**
 * Cron Queue Widget
 * Upcoming task execution queue sorted by next run time, with countdown timers
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
import { AlertTriangle } from "next-vibe-ui/ui/icons/AlertTriangle";
import { BarChart3 } from "next-vibe-ui/ui/icons/BarChart3";
import { CheckCircle } from "next-vibe-ui/ui/icons/CheckCircle";
import { Circle } from "next-vibe-ui/ui/icons/Circle";
import { Clock } from "next-vibe-ui/ui/icons/Clock";
import { History } from "next-vibe-ui/ui/icons/History";
import { List } from "next-vibe-ui/ui/icons/List";
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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";
import { useTouchDevice } from "@/hooks/use-touch-device";

import cronTaskIdDefinition from "../[id]/definition";
import cronTasksDefinition from "../tasks/definition";
import cronHistoryDefinition from "../history/definition";
import executeDefinition from "../../execute/definition";
import bulkEndpoints from "../bulk/definition";
import type {
  CronTaskPriorityDB,
  TaskCategoryDB,
  CronTaskPriorityFilterValue,
  TaskCategoryValue,
} from "../../enum";
import {
  CronTaskHiddenFilter,
  CronTaskPriority,
  CronTaskPriorityOptions,
  CronTaskStatus,
  TaskCategoryOptions,
} from "../../enum";
import { scopedTranslation as tasksScopedTranslation } from "../../i18n";
import type endpoints from "./definition";
import type { CronQueueListResponseOutput } from "./definition";

type Task = CronQueueListResponseOutput["tasks"][number];

interface WidgetProps {
  field: {
    value: CronQueueListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
}

// ---------------------------------------------------------------------------
// Constants
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
  [CronTaskStatus.SCHEDULED]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  [CronTaskStatus.CANCELLED]:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]: "text-red-600 dark:text-red-400",
  [CronTaskPriority.HIGH]: "text-orange-600 dark:text-orange-400",
  [CronTaskPriority.MEDIUM]: "text-blue-600 dark:text-blue-400",
  [CronTaskPriority.LOW]: "text-green-600 dark:text-green-400",
  [CronTaskPriority.BACKGROUND]: "text-gray-500 dark:text-gray-400",
};

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

/**
 * Format relative time until/since a timestamp.
 * Returns e.g. "in 5m 30s", "2h ago", "overdue", "just now"
 */
function formatRelativeTime(
  isoString: string | null,
  inLabel: string,
  agoLabel: string,
  justNowLabel: string,
  overdueLabel: string,
): { text: string; isOverdue: boolean; isSoon: boolean } {
  if (!isoString) {
    return { text: "", isOverdue: false, isSoon: false };
  }
  const diffMs = new Date(isoString).getTime() - Date.now();
  const absDiff = Math.abs(diffMs);

  if (absDiff < 10000) {
    return { text: justNowLabel, isOverdue: false, isSoon: true };
  }

  const isFuture = diffMs > 0;
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let text: string;
  if (days > 0) {
    text = `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    text = `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    text = `${minutes}m ${seconds % 60}s`;
  } else {
    text = `${seconds}s`;
  }

  if (isFuture) {
    return {
      text: `${inLabel} ${text}`,
      isOverdue: false,
      isSoon: diffMs < 60000,
    };
  }

  // Past: could be overdue (no run since scheduled time) or just last ran
  return {
    text: diffMs < 0 ? `${overdueLabel} ${text}` : `${text} ${agoLabel}`,
    isOverdue: true,
    isSoon: false,
  };
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
// Countdown cell — re-renders every second
// ---------------------------------------------------------------------------

function CountdownCell({
  nextExecutionAt,
  inLabel,
  agoLabel,
  justNowLabel,
  overdueLabel,
  notScheduledLabel,
}: {
  nextExecutionAt: string | null;
  inLabel: string;
  agoLabel: string;
  justNowLabel: string;
  overdueLabel: string;
  notScheduledLabel: string;
}): React.JSX.Element {
  const [, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return (): void => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!nextExecutionAt) {
    return (
      <Span className="text-xs text-muted-foreground">{notScheduledLabel}</Span>
    );
  }

  const { text, isOverdue, isSoon } = formatRelativeTime(
    nextExecutionAt,
    inLabel,
    agoLabel,
    justNowLabel,
    overdueLabel,
  );

  return (
    <Span
      className={cn(
        "text-xs font-mono font-medium",
        isOverdue && "text-red-600 dark:text-red-400",
        isSoon && !isOverdue && "text-amber-600 dark:text-amber-400",
        !isOverdue && !isSoon && "text-foreground",
      )}
    >
      {text}
    </Span>
  );
}

// ---------------------------------------------------------------------------
// Queue row
// ---------------------------------------------------------------------------

function QueueRow({
  task,
  position,
  selected,
  onToggleSelect,
  onEdit,
  onHistory,
  onRun,
  t,
  tTasks,
  isTouch,
}: {
  task: Task;
  position: number;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (task: Task) => void;
  onHistory: (task: Task) => void;
  onRun: (task: Task) => void;
  t: ReturnType<typeof useWidgetTranslation<typeof endpoints.GET>>;
  tTasks: ReturnType<typeof tasksScopedTranslation.scopedT>["t"];
  isTouch: boolean;
}): React.JSX.Element {
  const nextRunText = formatDate(task.nextExecutionAt);
  const lastRunText = formatDate(task.lastExecutedAt);

  const hasFailures =
    task.consecutiveFailures > 0 ||
    task.lastExecutionStatus === CronTaskStatus.FAILED ||
    task.lastExecutionStatus === CronTaskStatus.ERROR;

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

      {/* Position number */}
      <Div className="flex-shrink-0 w-6 text-center mt-0.5">
        <Span className="text-xs text-muted-foreground font-mono">
          {position}
        </Span>
      </Div>

      {/* Countdown — most important info */}
      <Div className="flex-shrink-0 flex flex-col items-end gap-0.5 min-w-[90px]">
        <CountdownCell
          nextExecutionAt={task.nextExecutionAt}
          inLabel={t("widget.queue.in")}
          agoLabel={t("widget.queue.ago")}
          justNowLabel={t("widget.queue.justNow")}
          overdueLabel={t("widget.queue.overdue")}
          notScheduledLabel={t("widget.queue.notScheduled")}
        />
        <Span className="text-xs text-muted-foreground font-mono">
          {nextRunText || "—"}
        </Span>
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex flex-wrap items-center gap-1.5 mb-0.5">
          <Span className="font-semibold text-sm truncate">
            {task.displayName}
          </Span>
          <Span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs font-mono",
              "bg-muted text-muted-foreground",
            )}
          >
            {task.routeId}
          </Span>
          {task.userId === null ? (
            <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {t("widget.queue.owner.system")}
            </Span>
          ) : (
            <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
              {t("widget.queue.owner.user")}
            </Span>
          )}
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
          {task.hidden && (
            <Span className="px-1.5 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 line-through">
              {t("widget.queue.hiddenBadge")}
            </Span>
          )}
          {hasFailures && (
            <Span className="flex items-center gap-0.5 text-xs text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              {task.consecutiveFailures > 0 ? task.consecutiveFailures : ""}
            </Span>
          )}
        </Div>

        <Span className="text-xs font-mono text-muted-foreground">
          {task.schedule}
        </Span>

        {/* Stats */}
        <Div className="hidden sm:flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <Span>
            {t("widget.queue.lastRun")}
            {` `}
            {lastRunText ? (
              <Span
                className={cn(
                  "px-1 py-0.5 rounded",
                  getStatusColorClass(task.lastExecutionStatus),
                )}
              >
                {lastRunText}
              </Span>
            ) : (
              t("widget.queue.never")
            )}
          </Span>
          {task.lastExecutionStatus && (
            <Span
              className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
                getStatusColorClass(task.lastExecutionStatus),
              )}
            >
              {tTasks(task.lastExecutionStatus as Parameters<typeof tTasks>[0])}
            </Span>
          )}
          {task.averageExecutionTime !== null && (
            <Span>{formatDuration(task.averageExecutionTime)} avg</Span>
          )}
        </Div>
      </Div>

      {/* Action buttons */}
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
          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 dark:text-green-400"
          onClick={() => onRun(task)}
          title={t("widget.action.run")}
        >
          <Play className="h-3.5 w-3.5" />
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
      </Div>
    </Div>
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
          className="h-7 px-2.5 text-xs gap-1.5 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
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

export function CronQueueContainer({ field }: WidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
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

  // ── Bulk selection state ──────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Bulk mutation ─────────────────────────────────────────────────────────
  const bulkMutation = useApiMutation(bulkEndpoints.POST, logger, user);

  // ── Search from form state ────────────────────────────────────────────────
  const search = form.watch("search") ?? "";

  // ── Patch form helper ─────────────────────────────────────────────────────
  const patchForm = useCallback(
    (
      patch: Partial<(typeof endpoints.GET)["types"]["RequestOutput"]>,
    ): void => {
      if (!form) {
        return;
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
      if (patch.hidden !== undefined) {
        form.setValue("hidden", patch.hidden, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    },
    [form],
  );

  // ── Priority filter ───────────────────────────────────────────────────────
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

  // ── Category filter ───────────────────────────────────────────────────────
  const categoryValue = form.watch("category");
  const activeCategory: typeof TaskCategoryValue | "all" = useMemo(
    () =>
      Array.isArray(categoryValue) && categoryValue.length === 1
        ? (categoryValue[0] ?? "")
        : "all",
    [categoryValue],
  );
  const handleCategoryChange = useCallback(
    (value: (typeof TaskCategoryDB)[number] | ""): void => {
      patchForm({ category: value ? [value] : [] });
    },
    [patchForm],
  );

  // ── Hidden filter ─────────────────────────────────────────────────────────
  const hiddenValue = form.watch("hidden");
  const activeHiddenFilter = hiddenValue ?? CronTaskHiddenFilter.ALL;

  // All filtering is server-side; tasks from server are already filtered
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
          // Update caches optimistically — no refetch needed
          const { apiClient } =
            await import("@/app/api/[locale]/system/unified-interface/react/hooks/store");
          const tasksDef = await import("../tasks/definition");
          const queueDef = await import("./definition");
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

  // ── Navigation handlers ───────────────────────────────────────────────────
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavigateTasks = useCallback((): void => {
    navigate(cronTasksDefinition.GET, {});
  }, [navigate]);

  const handleNavigateHistory = useCallback((): void => {
    navigate(cronHistoryDefinition.GET, {});
  }, [navigate]);

  const handleNavigateStats = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("../stats/definition");
      navigate(m.default.GET, {});
    })();
  }, [navigate]);

  const handleCreate = useCallback((): void => {
    navigate(cronTasksDefinition.POST, {
      popNavigationOnSuccess: 1,
    });
  }, [navigate]);

  const handleEdit = useCallback(
    (task: Task): void => {
      navigate(cronTaskIdDefinition.PUT, {
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
        popNavigationOnSuccess: 1,
      });
    },
    [navigate],
  );

  const handleTaskHistory = useCallback(
    (task: Task): void => {
      navigate(cronHistoryDefinition.GET, {
        data: { taskId: task.id },
      });
    },
    [navigate],
  );

  const handleRun = useCallback(
    (task: Task): void => {
      navigate(executeDefinition.POST, {
        data: { taskId: task.id },
        renderInModal: true,
        popNavigationOnSuccess: 1,
      });
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
    }
    patchForm({
      priority: [],
      category: [],
      hidden: CronTaskHiddenFilter.ALL,
    });
  }, [form, patchForm]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Div className="flex flex-col gap-0">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <Div className="flex items-center gap-2 px-4 py-3 border-b">
        <NavigateButtonWidget field={children.backButton} />

        <Div className="flex items-center gap-2 mr-auto min-w-0">
          <Span className="font-semibold text-base truncate">
            {t("widget.title")}
          </Span>
          <Span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full flex-shrink-0">
            {totalTasks}
          </Span>
        </Div>

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
            onClick={handleNavigateTasks}
          >
            <List className="h-3.5 w-3.5" />
            <Span className="hidden sm:inline">{t("widget.header.tasks")}</Span>
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

      {/* ── Bulk toolbar (shown when items are selected) ─────────────── */}
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

      {/* ── Filters row ─────────────────────────────────────────────── */}
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

        {/* Visibility filter */}
        <Select
          value={activeHiddenFilter}
          onValueChange={(v) =>
            patchForm({
              hidden:
                v as (typeof CronTaskHiddenFilter)[keyof typeof CronTaskHiddenFilter],
            })
          }
        >
          <SelectTrigger className="h-8 w-auto min-w-[100px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={CronTaskHiddenFilter.ALL}>
              {t("widget.filter.allTasks")}
            </SelectItem>
            <SelectItem value={CronTaskHiddenFilter.VISIBLE}>
              {t("widget.filter.visible")}
            </SelectItem>
            <SelectItem value={CronTaskHiddenFilter.HIDDEN}>
              {t("widget.filter.hiddenOnly")}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Priority filter */}
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

        {/* Category filter */}
        <Select<typeof TaskCategoryValue | "all">
          value={activeCategory}
          onValueChange={(v) => handleCategoryChange(v === "all" ? "" : v)}
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
      </Div>

      {/* ── Loading ──────────────────────────────────────────────────── */}
      {isLoading && (
        <Div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.loading")}
          </Span>
        </Div>
      )}

      {/* ── Queue list ───────────────────────────────────────────────── */}
      {!isLoading && filteredTasks.length > 0 && (
        <Div className="divide-y">
          {filteredTasks.map((task, index) => (
            <QueueRow
              key={task.id}
              task={task}
              position={index + 1}
              selected={selectedIds.has(task.id)}
              onToggleSelect={handleToggleSelect}
              onEdit={handleEdit}
              onHistory={handleTaskHistory}
              onRun={handleRun}
              t={t}
              tTasks={tTasks}
              isTouch={isTouch}
            />
          ))}
        </Div>
      )}

      {/* ── Empty state ──────────────────────────────────────────────── */}
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
        </Div>
      )}
    </Div>
  );
}
