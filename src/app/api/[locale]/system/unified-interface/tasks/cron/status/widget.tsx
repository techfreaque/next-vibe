/**
 * Custom Widget for Cron Status
 * Displays system health dashboard with task status overview
 */

"use client";

import { useRouter } from "next-vibe-ui/hooks";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  HelpCircle,
  List,
  Loader2,
  RefreshCw,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import { CronTaskStatus } from "../../enum";
import type endpoints from "./definition";
import type { CronStatusResponseOutput } from "./definition";

type StatusTask = CronStatusResponseOutput["tasks"][number];

interface WidgetProps {
  field: {
    value: CronStatusResponseOutput | null | undefined;
  } & (typeof endpoints.GET)["fields"];
  fieldName: string;
}

// ---------------------------------------------------------------------------
// Status maps
// ---------------------------------------------------------------------------

type SystemStatus = "healthy" | "warning" | "critical" | "unknown";

interface SystemStatusConfig {
  cardStyle: React.CSSProperties;
  iconColor: string;
  textColor: string;
}

const SYSTEM_STATUS_CONFIG: Record<SystemStatus, SystemStatusConfig> = {
  healthy: {
    cardStyle: {
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
    },
    iconColor: "#16a34a",
    textColor: "#15803d",
  },
  warning: {
    cardStyle: {
      backgroundColor: "#fefce8",
      border: "1px solid #fef08a",
    },
    iconColor: "#ca8a04",
    textColor: "#a16207",
  },
  critical: {
    cardStyle: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
    },
    iconColor: "#dc2626",
    textColor: "#b91c1c",
  },
  unknown: {
    cardStyle: {
      backgroundColor: "#f9fafb",
      border: "1px solid #e5e7eb",
    },
    iconColor: "#6b7280",
    textColor: "#374151",
  },
};

// Keyed on enum values (i18n key strings), not plain short strings
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
};

const DEFAULT_BADGE_CLASS =
  "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getStatusDotColor(status: string): string {
  switch (status) {
    case CronTaskStatus.RUNNING:
      return "#3b82f6";
    case CronTaskStatus.COMPLETED:
      return "#22c55e";
    case CronTaskStatus.FAILED:
    case CronTaskStatus.ERROR:
      return "#ef4444";
    case CronTaskStatus.TIMEOUT:
      return "#f97316";
    case CronTaskStatus.PENDING:
    case CronTaskStatus.SCHEDULED:
      return "#eab308";
    default:
      return "#9ca3af";
  }
}

function formatDate(s: string | null): string {
  if (!s) {
    return "—";
  }
  return s.slice(0, 16).replace("T", " ");
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SystemStatusIcon({
  status,
  className,
}: {
  status: SystemStatus;
  className?: string;
}): React.JSX.Element {
  switch (status) {
    case "healthy":
      return <CheckCircle className={className} />;
    case "warning":
      return <AlertTriangle className={className} />;
    case "critical":
      return <XCircle className={className} />;
    case "unknown":
    default:
      return <HelpCircle className={className} />;
  }
}

function SystemStatusCard({
  status,
  uptime,
  t,
}: {
  status: SystemStatus;
  uptime: string;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const config = SYSTEM_STATUS_CONFIG[status];

  return (
    <Div
      style={{
        ...config.cardStyle,
        borderRadius: "0.75rem",
        padding: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Div style={{ color: config.iconColor, flexShrink: 0 }}>
        <SystemStatusIcon status={status} className="h-12 w-12" />
      </Div>
      <Div className="flex flex-col gap-1 min-w-0">
        <Div
          style={{
            color: config.textColor,
            fontSize: "1.5rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            lineHeight: 1.2,
          }}
        >
          {t(
            `app.api.system.unifiedInterface.tasks.cronSystem.status.widget.status.${status}`,
          )}
        </Div>
        <Div
          style={{
            color: config.textColor,
            fontSize: "0.875rem",
            opacity: 0.75,
          }}
        >
          {`${t("app.api.system.unifiedInterface.tasks.cronSystem.status.widget.uptime")}: ${uptime}`}
        </Div>
      </Div>
    </Div>
  );
}

function StatsRow({
  activeTasks,
  totalTasks,
  systemStatus,
  t,
}: {
  activeTasks: number;
  totalTasks: number;
  systemStatus: SystemStatus;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const safeTotalTasks = Math.max(totalTasks, 1);
  const activePercent = Math.round((activeTasks / safeTotalTasks) * 100);
  const healthPercent =
    systemStatus === "healthy" ? 100 : systemStatus === "warning" ? 50 : 0;

  return (
    <Div className="grid grid-cols-3 gap-3">
      {/* Active tasks */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.stats.activeTasks",
          )}
        </Span>
        <Div className="flex items-baseline gap-1">
          <Span className="text-2xl font-bold tabular-nums">{activeTasks}</Span>
          <Span className="text-sm text-muted-foreground">
            {`/ ${totalTasks}`}
          </Span>
        </Div>
        {/* Progress bar */}
        <Div className="w-full h-1 rounded-full bg-muted overflow-hidden">
          <Div
            style={{
              width: `${activePercent}%`,
              backgroundColor: "#3b82f6",
              height: "4px",
              borderRadius: "9999px",
            }}
          />
        </Div>
      </Div>

      {/* Total tasks */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.stats.totalTasks",
          )}
        </Span>
        <Span className="text-2xl font-bold tabular-nums">{totalTasks}</Span>
      </Div>

      {/* System health */}
      <Div className="rounded-lg border bg-card p-4 flex flex-col gap-2">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.stats.systemHealth",
          )}
        </Span>
        <Span className="text-2xl font-bold tabular-nums">
          {healthPercent}%
        </Span>
      </Div>
    </Div>
  );
}

function TaskRow({
  task,
  onNavigate,
  t,
}: {
  task: StatusTask;
  onNavigate: (task: StatusTask) => void;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const badgeClass = STATUS_COLORS[task.status] ?? DEFAULT_BADGE_CLASS;

  return (
    <Div
      className="group flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => {
        onNavigate(task);
      }}
    >
      {/* Status dot */}
      <Div
        style={{
          backgroundColor: getStatusDotColor(task.status),
          width: "8px",
          height: "8px",
          borderRadius: "9999px",
          flexShrink: 0,
        }}
      />

      {/* Task name + schedule */}
      <Div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <Span className="font-semibold text-sm truncate">{task.name}</Span>
        <Span className="text-xs text-muted-foreground font-mono">
          {task.schedule}
        </Span>
      </Div>

      {/* Status badge */}
      <Span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0",
          badgeClass,
        )}
      >
        {t(task.status)}
      </Span>

      {/* Last run */}
      <Div className="hidden sm:flex flex-col items-end gap-0.5 flex-shrink-0 min-w-[90px]">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.task.lastRun",
          )}
        </Span>
        <Span className="text-xs tabular-nums">{formatDate(task.lastRun)}</Span>
      </Div>

      {/* Next run */}
      <Div className="hidden md:flex flex-col items-end gap-0.5 flex-shrink-0 min-w-[90px]">
        <Span className="text-xs text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.task.nextRun",
          )}
        </Span>
        <Span className="text-xs tabular-nums">{formatDate(task.nextRun)}</Span>
      </Div>
    </Div>
  );
}

// ---------------------------------------------------------------------------
// Main container
// ---------------------------------------------------------------------------

export function CronStatusContainer({ field }: WidgetProps): React.JSX.Element {
  const t = useWidgetTranslation();
  const router = useRouter();
  const locale = useWidgetLocale();
  const context = useWidgetContext();
  const { endpointMutations } = context;
  const children = field.children;

  const data = field.value;
  const systemStatus: SystemStatus = data?.systemStatus ?? "unknown";
  const tasks = data?.tasks ?? [];

  // ── Navigation handlers ──────────────────────────────────────────────────

  const handleViewTasks = useCallback((): void => {
    router.push(`/${locale}/admin/cron/tasks`);
  }, [router, locale]);

  const handleViewHistory = useCallback((): void => {
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale]);

  const handleViewStats = useCallback((): void => {
    router.push(`/${locale}/admin/cron/stats`);
  }, [router, locale]);

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleNavigateToTask = useCallback(
    (task: StatusTask): void => {
      router.push(`/${locale}/admin/cron/task/${task.id}/edit`);
    },
    [router, locale],
  );

  // ── Loading state ────────────────────────────────────────────────────────

  if (!data) {
    return (
      <Div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <Div className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.loading",
          )}
        </Div>
      </Div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <Div className="flex items-center gap-2 pb-2 border-b flex-wrap">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <Activity className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.title",
            )}
          </Span>
        </Div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewTasks}
          className="gap-1"
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.tasks",
          )}
        >
          <List className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.tasks",
            )}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewHistory}
          className="gap-1"
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.history",
          )}
        >
          <Clock className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.history",
            )}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleViewStats}
          className="gap-1"
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.stats",
          )}
        >
          <BarChart3 className="h-4 w-4" />
          <Span className="hidden sm:inline">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.stats",
            )}
          </Span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.actions.refresh",
          )}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* System status card */}
      <SystemStatusCard status={systemStatus} uptime={data.uptime} t={t} />

      {/* Stats row */}
      <StatsRow
        activeTasks={data.activeTasks}
        totalTasks={data.totalTasks}
        systemStatus={systemStatus}
        t={t}
      />

      {/* Task list */}
      <Div className="flex flex-col gap-2">
        {/* Section header */}
        <Div className="flex items-center gap-2">
          <Span className="text-sm font-semibold">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.tasks",
            )}
          </Span>
          {tasks.length > 0 && (
            <Span className="inline-flex items-center justify-center h-5 min-w-[1.25rem] px-1.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold tabular-nums">
              {tasks.length}
            </Span>
          )}
        </Div>

        {/* Task rows */}
        <Div className="rounded-lg border overflow-hidden">
          {tasks.length === 0 ? (
            <Div className="flex flex-col items-center justify-center gap-3 py-10 text-center px-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
              <Span className="text-sm text-muted-foreground">
                {t(
                  "app.api.system.unifiedInterface.tasks.cronSystem.status.widget.emptyTasks",
                )}
              </Span>
            </Div>
          ) : (
            <Div className="divide-y">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onNavigate={handleNavigateToTask}
                  t={t}
                />
              ))}
            </Div>
          )}
        </Div>
      </Div>
    </Div>
  );
}
