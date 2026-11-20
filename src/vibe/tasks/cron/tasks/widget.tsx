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
} from "next-vibe/ui/components/alert-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Checkbox } from "next-vibe/ui/components/checkbox";
import { Div } from "next-vibe/ui/components/div";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { BarChart3 } from "next-vibe/ui/components/icons/BarChart3";
import { Clock } from "next-vibe/ui/components/icons/Clock";
import { Eye } from "next-vibe/ui/components/icons/Eye";
import { GitBranch } from "next-vibe/ui/components/icons/GitBranch";
import { History } from "next-vibe/ui/components/icons/History";
import { Layers } from "next-vibe/ui/components/icons/Layers";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Pencil } from "next-vibe/ui/components/icons/Pencil";
import { Play } from "next-vibe/ui/components/icons/Play";
import { Plus } from "next-vibe/ui/components/icons/Plus";
import { RefreshCw } from "next-vibe/ui/components/icons/RefreshCw";
import { Search } from "next-vibe/ui/components/icons/Search";
import { Trash2 } from "next-vibe/ui/components/icons/Trash2";
import { Input } from "next-vibe/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import React, { useCallback, useMemo, useState } from "react";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import { getDefaultTimezone } from "../../../core/i18n/core/localization-utils";
import type { EndpointLogger } from "../../../logger/types";
import { cn } from "../../../unified-ui/_shared/cn";
import { useRelatedEntityNavigation } from "../../../unified-ui/_shared/related-entities";
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetNavigation,
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetUser,
  useWidgetValue,
} from "../../../unified-ui/_shared/use-widget-context";
import { useApiMutation } from "../../../unified-ui/hooks/use-api-mutation";
import { FormAlertWidget } from "../../../unified-ui/widgets/interactive/form-alert/widget";
import { NavigateButtonWidget } from "../../../unified-ui/widgets/interactive/navigate-button/widget";
import { formatCronScheduleShort } from "../../cron-formatter";
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
import { CRON_LIST_PAGE_SIZE } from "./constants";
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

function formatDate(
  value: string | Date | null,
  locale: CountryLanguage,
): string | null {
  return value
    ? (value instanceof Date ? value : new Date(value)).toLocaleString(locale, {
        timeZoneName: "short",
      })
    : null;
}

function getStatusColorClass(status: string): string {
  return STATUS_COLORS[status] ?? "bg-muted text-muted-foreground";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({
  status,
  tTasks,
}: {
  status: typeof CronTaskStatusValue;
  tTasks: ReturnType<typeof tasksScopedTranslation.scopedT>["t"];
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
        getStatusColorClass(status),
      )}
    >
      {tTasks(status)}
    </Span>
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
  locale,
  logger,
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
  locale: CountryLanguage;
  logger: EndpointLogger;
}): React.JSX.Element {
  const lastRunText = formatDate(task.lastExecutedAt, locale);
  const nextRunText = formatDate(task.nextExecutionAt, locale);
  return (
    <Div
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0",
        selected && "bg-primary/5",
      )}
    >
      {/* Checkbox */}
      <Div className="flex-shrink-0 mt-1">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggleSelect(task.id)}
          aria-label={t("widget.action.select", { task: task.displayName })}
        />
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Span className="font-semibold text-sm [overflow-wrap:anywhere]">
            {task.displayName}
          </Span>
          {/* routeId badge */}
          <Span
            className={cn(
              "min-w-0 px-1.5 py-0.5 rounded text-xs font-mono [overflow-wrap:anywhere]",
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
          <Span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {task.enabled
              ? t("widget.create.enabled")
              : t("widget.create.disabled")}
          </Span>
          {task.lastExecutionStatus && (
            <StatusBadge status={task.lastExecutionStatus} tTasks={tTasks} />
          )}
          {task.hidden && <HiddenBadge t={t} />}
        </Div>

        {task.description && (
          <Span className="text-xs text-muted-foreground block mb-1 [overflow-wrap:anywhere]">
            {task.description}
          </Span>
        )}

        <Span className="text-xs text-muted-foreground">
          {formatCronScheduleShort(
            task.schedule,
            getDefaultTimezone(locale),
            locale,
            logger,
          )}
        </Span>

        <Div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Span>
            {t("widget.task.runCount", {
              count: task.executionCount.toLocaleString(locale),
            })}
          </Span>
          <Span>
            {t("widget.task.successCount", {
              count: task.successCount.toLocaleString(locale),
            })}
          </Span>
          <Span>
            {t("widget.task.failureCount", {
              count: task.errorCount.toLocaleString(locale),
            })}
          </Span>
        </Div>
        <Div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Span>
            {t("widget.task.lastRun")} {lastRunText ?? t("widget.task.never")}
          </Span>
          <Span>
            {t("widget.task.nextRun")}{" "}
            {nextRunText ?? t("widget.task.notScheduled")}
          </Span>
        </Div>
      </Div>

      <Div className="col-start-2 flex min-w-0 flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => onHistory(task)}
        >
          <Clock className="h-3.5 w-3.5" />
          {t("widget.action.history")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-success hover:text-success/80"
          onClick={() => onRun(task)}
          aria-label={t("widget.action.runNow")}
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
          aria-label={t("widget.action.view")}
          title={t("widget.action.view")}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onEdit(task)}
          aria-label={t("widget.action.edit")}
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
          aria-label={t("widget.action.delete")}
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
      aria-pressed={active}
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
  const navigateRelated = useRelatedEntityNavigation();
  const t = useWidgetTranslation<typeof endpoints.GET>();
  const locale = useWidgetLocale();
  const { t: tTasks } = tasksScopedTranslation.scopedT(locale);
  const form = useWidgetForm<typeof endpoints.GET>();

  const hasError = useWidgetResponse()?.success === false;
  const isLoading = !hasError && (!data || endpointMutations?.read?.isLoading);
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
  const offset = Math.max(
    0,
    Number.parseInt(form.watch("offset") ?? "", 10) || 0,
  );
  const pageSize = Math.max(
    1,
    Number.parseInt(form.watch("limit") ?? "", 10) || CRON_LIST_PAGE_SIZE,
  );

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

  const executeBulkAction = useCallback(
    (action: "enable" | "disable" | "run" | "delete"): void => {
      const ids = [...selectedIds];
      void bulkMutation
        .mutateAsync({ requestData: { ids, action } })
        .then(async (result) => {
          if (result.success) {
            handleClearSelection();
            const [{ apiClient }, queue] = await Promise.all([
              import("../../../unified-ui/hooks/store"),
              import("../queue/definition"),
            ]);
            await Promise.all([
              endpointMutations?.read?.refetch(),
              apiClient.refetchEndpoint(queue.default.GET, logger),
            ]);
          }
          return undefined;
        });
    },
    [
      selectedIds,
      bulkMutation,
      handleClearSelection,
      endpointMutations,
      logger,
    ],
  );

  // ── Helper: update form fields - auto-submit handles the refetch ─────────
  const patchForm = useCallback(
    (
      patch: Partial<(typeof endpoints.GET)["types"]["RequestOutput"]>,
    ): void => {
      if (!form) {
        return;
      }
      handleClearSelection();
      form.setValue("offset", "0", { shouldDirty: true });
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
    [form, handleClearSelection],
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
      handleClearSelection();
      form.setValue("offset", "0", { shouldDirty: true });
      form.setValue("hidden", value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form, handleClearSelection],
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
      const graphsDef = await import("../../../dataflow/graphs/definition");
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

  const handleTaskHistory = (task: Task): void => {
    navigateRelated(
      async () => (await import("../history/definition")).default.GET,
      {
        data: {
          taskId: task.id,
          offset: 0,
          taskName: "",
          status: "",
          priority: "",
        },
      },
    );
  };

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

  const hasFilters = !!(
    search ||
    priorityValue?.length ||
    categoryValue?.length ||
    activeHiddenFilter !== CronTaskHiddenFilter.VISIBLE ||
    activeStatusTab !== "ALL"
  );

  const changePage = (newOffset: number): void => {
    handleClearSelection();
    form.setValue("offset", String(newOffset), { shouldDirty: true });
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <WidgetShell padding="none" className="min-w-0 gap-0">
      {/* ── Header bar ─────────────────────────────────────────────── */}
      <Div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b">
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
        <Div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 gap-1.5 text-xs"
            onClick={handleNavigateStats}
            aria-label={t("widget.header.stats")}
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
            aria-label={t("widget.header.graphs")}
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
            aria-label={t("widget.header.queue")}
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
            aria-label={t("widget.header.history")}
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
            aria-label={t("widget.header.refresh")}
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
            aria-label={t("widget.header.create")}
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
          aria-label={t(
            allFilteredSelected
              ? "widget.bulk.clearSelection"
              : "widget.bulk.selectAll",
          )}
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
            aria-label={t("get.fields.search.label")}
            onChangeText={(val) => {
              handleClearSelection();
              form.setValue("offset", "0", { shouldDirty: true });
              form.setValue("search", val, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });
            }}
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
          onValueChange={(val) => {
            handleClearSelection();
            form.setValue("offset", "0", { shouldDirty: true });
            form.setValue("sort", val, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        >
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* oxlint-disable-next-line i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_asc">{t("widget.sort.nameAsc")}</SelectItem>
            {/* oxlint-disable-next-line i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_desc">
              {t("widget.sort.nameDesc")}
            </SelectItem>
            <SelectItem value="schedule">
              {t("widget.sort.schedule")}
            </SelectItem>
            {/* oxlint-disable-next-line i18n/no-literal-string -- internal sort key */}
            <SelectItem value="last_run_desc">
              {t("widget.sort.lastRunNewest")}
            </SelectItem>
            {/* oxlint-disable-next-line i18n/no-literal-string -- internal sort key */}
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

      {bulkMutation.error && (
        <Div
          role="alert"
          className="m-4 rounded-md border border-destructive/30 p-3 text-sm text-destructive [overflow-wrap:anywhere]"
        >
          {bulkMutation.error.message}
        </Div>
      )}
      {bulkMutation.data?.success && (
        <Div
          aria-live="polite"
          className="m-4 flex flex-col gap-1 rounded-md border p-3 text-sm"
        >
          <Span className="font-medium">
            {t("widget.bulk.success", {
              succeeded:
                bulkMutation.data.data.succeeded.toLocaleString(locale),
              failed: bulkMutation.data.data.failed.toLocaleString(locale),
            })}
          </Span>
          {bulkMutation.data.data.errors.map(({ id, message }) => (
            <Div
              key={id}
              className="flex flex-wrap gap-x-2 text-xs text-destructive [overflow-wrap:anywhere]"
            >
              <Span className="font-mono">{id}</Span>
              <Span>{message}</Span>
            </Div>
          ))}
        </Div>
      )}

      <FormAlertWidget field={{ className: "m-4" }} />

      {/* ── Loading state ───────────────────────────────────────────── */}
      {isLoading && (
        <Div
          aria-live="polite"
          className="flex flex-col items-center justify-center gap-3 py-16"
        >
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t("widget.loading")}
          </Span>
        </Div>
      )}

      {/* ── Task list ──────────────────────────────────────────────── */}
      {!hasError && !isLoading && filteredTasks.length > 0 && (
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
              locale={locale}
              logger={logger}
            />
          ))}
        </Div>
      )}

      {!hasError && !isLoading && filteredTasks.length === 0 && (
        <EmptyBlock
          icon={<Clock className="size-8" />}
          title={t(
            hasFilters ? "widget.empty.noMatches" : "widget.empty.noTasks",
          )}
          message={t(
            hasFilters
              ? "widget.empty.noMatchesDesc"
              : "widget.empty.noTasksDesc",
          )}
          action={
            hasFilters
              ? {
                  label: t("widget.empty.clearFilters"),
                  onClick: handleClearFilters,
                }
              : { label: t("widget.header.create"), onClick: handleCreate }
          }
        />
      )}
      {!hasError && !isLoading && (offset > 0 || totalTasks > pageSize) && (
        <Div className="flex flex-wrap items-center justify-between gap-2 border-t p-4">
          <Span className="text-sm text-muted-foreground">
            {t("widget.pagination.info", {
              page: Math.floor(offset / pageSize) + 1,
              totalPages: Math.max(1, Math.ceil(totalTasks / pageSize)),
            })}
          </Span>
          <Div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={offset <= 0}
              onClick={() => changePage(Math.max(0, offset - pageSize))}
            >
              {t("widget.pagination.prev")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={offset + pageSize >= totalTasks}
              onClick={() => changePage(offset + pageSize)}
            >
              {t("widget.pagination.next")}
            </Button>
          </Div>
        </Div>
      )}
    </WidgetShell>
  );
}
