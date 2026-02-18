/**
 * Cron Tasks Widget
 * Full task management list with status filters, search, sort, and CRUD navigation
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  BarChart3,
  CheckCircle,
  Circle,
  Clock,
  Eye,
  History,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "next-vibe-ui/ui/icons";
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
import {
  useWidgetContext,
  useWidgetForm,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type { CronTaskPriorityDB, TaskCategoryDB } from "../../enum";
import {
  CronTaskEnabledFilter,
  CronTaskPriority,
  CronTaskPriorityOptions,
  CronTaskStatus,
  TaskCategoryOptions,
} from "../../enum";
import type endpoints from "./definition";
import type { CronTaskListResponseOutput } from "./definition";

type Task = CronTaskListResponseOutput["tasks"][number];

interface WidgetProps {
  field: {
    value: CronTaskListResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Constants
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
  t,
}: {
  status: string | null;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  return (
    <Span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium",
        getStatusColorClass(status),
      )}
    >
      {status ? t(status) : "—"}
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

function TaskRow({
  task,
  onView,
  onEdit,
  onDelete,
  onHistory,
  t,
}: {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onHistory: () => void;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const rate = successRate(task);
  const lastRunText = formatDate(task.lastExecutedAt);
  const nextRunText = formatDate(task.nextExecutionAt);
  const avgDurText = formatDuration(task.averageExecutionTime);

  const lastRunColorClass = task.lastExecutionStatus
    ? getStatusColorClass(task.lastExecutionStatus)
    : "";

  return (
    <Div className="group flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b last:border-b-0">
      {/* Enabled indicator dot */}
      <Div className="flex-shrink-0 mt-1.5">
        <EnabledDot enabled={task.enabled} />
      </Div>

      {/* Main content */}
      <Div className="flex-1 min-w-0">
        <Div className="flex flex-wrap items-center gap-2 mb-0.5">
          <Span className="font-semibold text-sm truncate">{task.name}</Span>
          <Span
            className={cn(
              "px-1.5 py-0.5 rounded text-xs font-medium",
              "bg-muted text-muted-foreground",
            )}
          >
            {t(task.category)}
          </Span>
          {task.priority && (
            <Span
              className={cn(
                "text-xs font-medium",
                PRIORITY_COLORS[task.priority] ?? "text-muted-foreground",
              )}
            >
              {t(task.priority)}
            </Span>
          )}
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
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.task.executions",
            )}
            {` ${task.executionCount}/${task.successCount}`}
          </Span>
          <Span>{`${rate}%`}</Span>
          <Span>{avgDurText}</Span>
        </Div>
      </Div>

      {/* Last run */}
      <Div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 min-w-[100px]">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.task.lastRun",
          )}
        </Span>
        {lastRunText ? (
          <Span
            className={cn("text-xs px-1 py-0.5 rounded", lastRunColorClass)}
          >
            {lastRunText}
          </Span>
        ) : (
          <Span className="text-xs text-muted-foreground">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.task.never",
            )}
          </Span>
        )}
      </Div>

      {/* Next run */}
      <Div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0 min-w-[100px]">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.task.nextRun",
          )}
        </Span>
        <Span className="text-xs">
          {nextRunText ||
            t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.task.notScheduled",
            )}
        </Span>
      </Div>

      {/* Status badge */}
      <Div className="flex-shrink-0 flex items-center">
        <StatusBadge status={task.lastExecutionStatus} t={t} />
      </Div>

      {/* Action buttons (appear on hover) */}
      <Div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onView(task)}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.action.view",
          )}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onHistory()}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.action.history",
          )}
        >
          <Clock className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onEdit(task)}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.action.edit",
          )}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(task)}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.action.delete",
          )}
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
// Main widget
// ---------------------------------------------------------------------------

export function CronTasksContainer({ field }: WidgetProps): React.JSX.Element {
  const children = field.children;
  const data = field.value;
  const { endpointMutations } = useWidgetContext();
  const { push: navigate } = useWidgetNavigation();
  const t = useWidgetTranslation();
  const router = useRouter();
  const locale = useWidgetLocale();
  const form = useWidgetForm<typeof endpoints.GET>();

  const isLoading = endpointMutations?.read?.isLoading;

  const tasks: Task[] = useMemo(() => data?.tasks ?? [], [data?.tasks]);
  const totalTasks = data?.totalTasks ?? 0;

  // ── Local state: search + sort (client-side only) ─────────────────────
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name_asc");

  // ── Derive active tab from form state ──────────────────────────────────
  const enabledValue = form?.watch("enabled");
  const serverStatusRaw = form?.watch("status");
  const serverStatus: string[] = useMemo(
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

  // ── Tab counts — show counts from returned tasks (server-filtered) ───────
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      running: tasks.filter(
        (t) => t.lastExecutionStatus === CronTaskStatus.RUNNING,
      ).length,
      completed: tasks.filter(
        (t) => t.lastExecutionStatus === CronTaskStatus.COMPLETED,
      ).length,
      failed: tasks.filter(
        (t) =>
          t.lastExecutionStatus === CronTaskStatus.FAILED ||
          t.lastExecutionStatus === CronTaskStatus.ERROR,
      ).length,
      pending: tasks.filter(
        (t) => t.lastExecutionStatus === CronTaskStatus.PENDING,
      ).length,
      disabled: tasks.filter((t) => !t.enabled).length,
    };
  }, [tasks]);

  // ── Client-side search + sort only (status/enabled filtered server-side) ──
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false) ||
          t.category.toLowerCase().includes(q),
      );
    }

    const sorted = [...result];
    if (sort === "name_asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name_desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "schedule") {
      sorted.sort((a, b) => a.schedule.localeCompare(b.schedule));
    } else if (sort === "last_run_desc") {
      sorted.sort((a, b) => {
        const aTime = a.lastExecutedAt ?? "";
        const bTime = b.lastExecutedAt ?? "";
        return bTime.localeCompare(aTime);
      });
    } else if (sort === "executions_desc") {
      sorted.sort((a, b) => b.executionCount - a.executionCount);
    }
    return sorted;
  }, [tasks, search, sort]);

  // ── Helper: update form fields the same way FormField/Controller widgets do ─
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

  // ── Status tab handler — updates server-side filters and refetches ───────
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
    },
    [patchForm],
  );

  // ── Priority filter handler ──────────────────────────────────────────────
  const priorityValue = form?.watch("priority");
  const activePriority: string = useMemo(
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
  const categoryValue = form?.watch("category");
  const activeCategory: string = useMemo(
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

  // ── Navigation handlers ──────────────────────────────────────────────────
  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavigateStats = useCallback((): void => {
    router.push(`/${locale}/admin/cron/stats`);
  }, [router, locale]);

  const handleNavigateHistory = useCallback((): void => {
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale]);

  const handleCreate = useCallback((): void => {
    void (async (): Promise<void> => {
      const m = await import("./definition");
      navigate(m.default.POST, {});
    })();
  }, [navigate]);

  const handleView = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../task/[id]/definition");
        navigate(m.default.GET, { urlPathParams: { id: task.id } });
      })();
    },
    [navigate],
  );

  const handleEdit = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../task/[id]/definition");
        navigate(m.default.PUT, {
          urlPathParams: { id: task.id },
          data: {
            name: task.name,
            description: task.description ?? undefined,
            schedule: task.schedule,
            enabled: task.enabled,
            priority: task.priority,
            timeout: task.timeout ?? undefined,
            retries: task.retries ?? undefined,
          },
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (task: Task): void => {
      void (async (): Promise<void> => {
        const m = await import("../task/[id]/definition");
        navigate(m.default.DELETE, {
          urlPathParams: { id: task.id },
          renderInModal: true,
          popNavigationOnSuccess: 1,
        });
      })();
    },
    [navigate],
  );

  const handleTaskHistory = useCallback((): void => {
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale]);

  const handleClearFilters = useCallback((): void => {
    setSearch("");
    setSort("name_asc");
    patchForm({
      status: [],
      priority: [],
      category: [],
      enabled: CronTaskEnabledFilter.ALL,
    });
  }, [patchForm]);

  // ── Tab definitions ───────────────────────────────────────────────────────
  const tabs: Array<{ key: StatusFilterKey; labelKey: string; count: number }> =
    [
      {
        key: "ALL",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.all",
        count: counts.all,
      },
      {
        key: "RUNNING",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.running",
        count: counts.running,
      },
      {
        key: "COMPLETED",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.completed",
        count: counts.completed,
      },
      {
        key: "FAILED",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.failed",
        count: counts.failed,
      },
      {
        key: "PENDING",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.pending",
        count: counts.pending,
      },
      {
        key: "DISABLED",
        labelKey:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.disabled",
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
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.title",
            )}
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
            <Span className="hidden sm:inline">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.header.stats",
              )}
            </Span>
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
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.header.history",
              )}
            </Span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRefresh}
            title={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.header.refresh",
            )}
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
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.header.create",
              )}
            </Span>
          </Button>
        </Div>
      </Div>

      {/* ── Status filter tabs ──────────────────────────────────────── */}
      <Div className="flex flex-wrap gap-1 px-4 py-2 border-b">
        {tabs.map((tab) => (
          <FilterTab
            key={tab.key}
            label={t(tab.labelKey)}
            count={tab.count}
            active={activeStatusTab === tab.key}
            onClick={() => handleStatusTabChange(tab.key)}
          />
        ))}
      </Div>

      {/* ── Filters + Sort row ──────────────────────────────────────── */}
      <Div className="flex items-center gap-2 px-4 py-2 border-b flex-wrap">
        {/* Search (local client-side — no server search field) */}
        <Div className="relative flex-1 min-w-[140px]">
          <Div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </Div>
          <Input
            type="text"
            value={search}
            onChangeText={setSearch}
            placeholder={t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.search.placeholder",
            )}
            className="pl-8 h-8 text-sm"
          />
        </Div>

        {/* Priority filter — server-side */}
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
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.allPriorities",
              )}
            </SelectItem>
            {CronTaskPriorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category filter — server-side */}
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
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.filter.allCategories",
              )}
            </SelectItem>
            {TaskCategoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(opt.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort (client-side — no server sort field) */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-8 w-auto min-w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_asc">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.sort.nameAsc",
              )}
            </SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="name_desc">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.sort.nameDesc",
              )}
            </SelectItem>
            <SelectItem value="schedule">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.sort.schedule",
              )}
            </SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="last_run_desc">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.sort.lastRunNewest",
              )}
            </SelectItem>
            {/* oxlint-disable-next-line oxlint-plugin-i18n/no-literal-string -- internal sort key */}
            <SelectItem value="executions_desc">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.sort.executionsMost",
              )}
            </SelectItem>
          </SelectContent>
        </Select>
      </Div>

      {/* ── Loading state ───────────────────────────────────────────── */}
      {isLoading && (
        <Div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <Span className="text-sm text-muted-foreground">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.loading",
            )}
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
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onHistory={handleTaskHistory}
              t={t}
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
                ? t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.empty.noTasks",
                  )
                : t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.empty.noMatches",
                  )}
            </Span>
            <Span className="text-xs text-muted-foreground">
              {tasks.length === 0
                ? t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.empty.noTasksDesc",
                  )
                : t(
                    "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.empty.noMatchesDesc",
                  )}
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
                {t(
                  "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.empty.clearFilters",
                )}
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleCreate}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.tasks.widget.header.create",
              )}
            </Button>
          </Div>
        </Div>
      )}
    </Div>
  );
}
