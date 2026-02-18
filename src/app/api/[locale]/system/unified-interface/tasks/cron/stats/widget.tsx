/**
 * Cron Stats Custom Widget
 * Complete, production-quality analytics dashboard for cron task statistics
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
  List,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "next-vibe-ui/ui/icons";
import { Span } from "next-vibe-ui/ui/span";
import React, { useCallback, useMemo } from "react";

import { cn } from "@/app/api/[locale]/shared/utils";
import {
  useWidgetContext,
  useWidgetLocale,
  useWidgetTranslation,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import { NavigateButtonWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/interactive/navigate-button/react";

import type statsEndpoints from "./definition";
import type { CronStatsGetResponseOutput } from "./definition";

// ─── Types ────────────────────────────────────────────────────────────────────

type StatsData = CronStatsGetResponseOutput;

interface WidgetProps {
  field: {
    value: CronStatsGetResponseOutput | null | undefined;
  } & (typeof statsEndpoints.GET)["fields"];
  fieldName: string;
}

// ─── Format Helpers ───────────────────────────────────────────────────────────

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

function formatDate(s: string | null | undefined): string {
  return s ? s.slice(0, 10) : "—";
}

import { CronTaskPriority, CronTaskStatus } from "../../enum";

// ─── Priority color map ────────────────────────────────────────────────────────
// Keyed on enum values (i18n key strings), not plain short strings

const PRIORITY_COLORS: Record<string, string> = {
  [CronTaskPriority.CRITICAL]: "#ef4444",
  [CronTaskPriority.HIGH]: "#f97316",
  [CronTaskPriority.MEDIUM]: "#3b82f6",
  [CronTaskPriority.LOW]: "#22c55e",
  [CronTaskPriority.BACKGROUND]: "#9ca3af",
};

function getPriorityColor(priority: string): string {
  return PRIORITY_COLORS[priority] ?? "#9ca3af";
}

// ─── Status color map ─────────────────────────────────────────────────────────

function getStatusColor(status: string): string {
  if (status === CronTaskStatus.COMPLETED) {
    return "#22c55e";
  }
  if (
    status === CronTaskStatus.FAILED ||
    status === CronTaskStatus.ERROR ||
    status === CronTaskStatus.TIMEOUT
  ) {
    return "#ef4444";
  }
  if (status === CronTaskStatus.RUNNING) {
    return "#3b82f6";
  }
  if (
    status === CronTaskStatus.PENDING ||
    status === CronTaskStatus.SCHEDULED
  ) {
    return "#f59e0b";
  }
  return "#9ca3af";
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  variant = "default",
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
}): React.JSX.Element {
  const variantClass = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    danger: "text-red-600 dark:text-red-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    info: "text-blue-600 dark:text-blue-400",
  }[variant];

  const displayValue =
    value === null || value === undefined
      ? "—"
      : typeof value === "number"
        ? value.toLocaleString()
        : value;

  return (
    <Div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <Div className="flex items-center gap-1.5">
        {icon}
        <Span className="text-xs text-muted-foreground">{label}</Span>
      </Div>
      <Span className={cn("text-2xl font-bold tabular-nums", variantClass)}>
        {displayValue}
      </Span>
    </Div>
  );
}

// ─── SmallStatCard ────────────────────────────────────────────────────────────

function SmallStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number | null | undefined;
  icon?: React.ReactNode;
}): React.JSX.Element {
  const displayValue =
    value === null || value === undefined
      ? "—"
      : typeof value === "number"
        ? value.toLocaleString()
        : value;

  return (
    <Div className="rounded-lg border bg-card p-3 flex flex-col gap-0.5">
      <Div className="flex items-center gap-1">
        {icon}
        <Span className="text-xs text-muted-foreground">{label}</Span>
      </Div>
      <Span className="text-lg font-semibold tabular-nums">{displayValue}</Span>
    </Div>
  );
}

// ─── SuccessRateBar (full-width) ───────────────────────────────────────────────

function SuccessRateBar({ rate }: { rate: number }): React.JSX.Element {
  const pct = Math.min(100, Math.max(0, rate));
  const color = pct > 80 ? "#22c55e" : pct > 50 ? "#f59e0b" : "#ef4444";

  return (
    <Div className="h-3 rounded-full bg-muted overflow-hidden">
      <Div
        style={{
          width: `${pct}%`,
          backgroundColor: color,
          height: "100%",
          borderRadius: "9999px",
          transition: "width 0.5s",
        }}
      />
    </Div>
  );
}

// ─── MiniBar ──────────────────────────────────────────────────────────────────

function MiniBar({
  pct,
  color,
}: {
  pct: number;
  color: string;
}): React.JSX.Element {
  return (
    <Div className="flex-1 h-2 rounded bg-muted overflow-hidden">
      <Div
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          backgroundColor: color,
          height: "100%",
          borderRadius: "9999px",
        }}
      />
    </Div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────

function StatusBadge({
  status,
  t,
}: {
  status: string;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const cls =
    status === CronTaskStatus.COMPLETED
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : status === CronTaskStatus.FAILED ||
          status === CronTaskStatus.ERROR ||
          status === CronTaskStatus.TIMEOUT
        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        : status === CronTaskStatus.RUNNING
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          : status === CronTaskStatus.PENDING ||
              status === CronTaskStatus.SCHEDULED
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";

  return (
    <Span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
        cls,
      )}
    >
      {t(status)}
    </Span>
  );
}

// ─── PriorityBadge ────────────────────────────────────────────────────────────

function PriorityBadge({
  priority,
  t,
}: {
  priority: string;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const cls =
    priority === CronTaskPriority.CRITICAL
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      : priority === CronTaskPriority.HIGH
        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
        : priority === CronTaskPriority.MEDIUM
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          : priority === CronTaskPriority.LOW
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";

  return (
    <Span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
        cls,
      )}
    >
      {t(priority)}
    </Span>
  );
}

// ─── RecentActivityIcon ───────────────────────────────────────────────────────

function RecentActivityIcon({ status }: { status: string }): React.JSX.Element {
  if (status === CronTaskStatus.COMPLETED) {
    return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
  }
  if (
    status === CronTaskStatus.FAILED ||
    status === CronTaskStatus.ERROR ||
    status === CronTaskStatus.TIMEOUT
  ) {
    return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
  }
  if (status === CronTaskStatus.RUNNING) {
    return (
      <Loader2 className="h-4 w-4 text-blue-500 flex-shrink-0 animate-spin" />
    );
  }
  if (
    status === CronTaskStatus.PENDING ||
    status === CronTaskStatus.SCHEDULED
  ) {
    return <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
  }
  return <Activity className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
}

// ─── DistributionSection ─────────────────────────────────────────────────────

function DistributionSection({
  title,
  entries,
  total,
  getBadge,
  getColor,
}: {
  title: string;
  entries: Array<[string, number]>;
  total: number;
  getBadge: (key: string) => React.ReactNode;
  getColor: (key: string) => string;
}): React.JSX.Element {
  return (
    <Div className="rounded-lg border bg-card p-4">
      <Span className="text-sm font-semibold mb-3 block">{title}</Span>
      <Div className="flex flex-col gap-2">
        {entries.map(([key, count]) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <Div key={key} className="flex items-center gap-2">
              <Div className="w-28 flex-shrink-0">{getBadge(key)}</Div>
              <MiniBar pct={pct} color={getColor(key)} />
              <Span className="text-xs tabular-nums w-10 text-right">
                {count}
              </Span>
            </Div>
          );
        })}
      </Div>
    </Div>
  );
}

// ─── TopPerformingTable ───────────────────────────────────────────────────────

function TopPerformingTable({
  tasks,
  t,
}: {
  tasks: NonNullable<StatsData["topPerformingTasks"]>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const sorted = useMemo(
    () =>
      [...tasks].toSorted((a, b) => b.successRate - a.successRate).slice(0, 10),
    [tasks],
  );

  return (
    <Div className="flex flex-col gap-1">
      <Div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium pb-1 border-b">
        <Span>
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.rank",
          )}
        </Span>
        <Span>
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.taskName",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.executions",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.avgDuration",
          )}
        </Span>
      </Div>
      {sorted.map((task, i) => {
        const ratePct = Math.min(100, Math.max(0, task.successRate));
        return (
          <Div
            key={task.taskName}
            className="grid grid-cols-4 gap-2 py-1.5 border-b last:border-0 items-center"
          >
            <Span className="text-xs text-muted-foreground tabular-nums">
              {i + 1}
            </Span>
            <Span className="text-xs truncate">{task.taskName}</Span>
            <Div className="flex flex-col gap-0.5 items-end">
              <Span className="text-xs tabular-nums">
                {task.executions.toLocaleString()}
              </Span>
              <Div className="flex items-center gap-1 w-full justify-end">
                <Div className="w-16 h-1.5 rounded bg-muted overflow-hidden">
                  <Div
                    style={{
                      width: `${ratePct}%`,
                      backgroundColor:
                        ratePct > 80
                          ? "#22c55e"
                          : ratePct > 50
                            ? "#f59e0b"
                            : "#ef4444",
                      height: "100%",
                      borderRadius: "9999px",
                    }}
                  />
                </Div>
                <Span className="text-xs tabular-nums text-green-600 dark:text-green-400">
                  {Math.round(task.successRate)}
                  {"%"}
                </Span>
              </Div>
            </Div>
            <Span className="text-xs tabular-nums text-right">
              {formatDuration(task.avgDuration)}
            </Span>
          </Div>
        );
      })}
    </Div>
  );
}

// ─── ProblemTasksTable ────────────────────────────────────────────────────────

function ProblemTasksTable({
  tasks,
  t,
}: {
  tasks: NonNullable<StatsData["problemTasks"]>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const sorted = useMemo(
    () => [...tasks].toSorted((a, b) => b.failures - a.failures).slice(0, 10),
    [tasks],
  );

  return (
    <Div className="flex flex-col gap-1">
      <Div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground font-medium pb-1 border-b">
        <Span className="col-span-2">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.taskName",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.failures",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.executions",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.failureRate",
          )}
        </Span>
      </Div>
      {sorted.map((task) => {
        const ratePct = Math.min(100, Math.max(0, task.failureRate));
        return (
          <Div
            key={task.taskName}
            className="grid grid-cols-5 gap-2 py-1.5 border-b last:border-0 items-start"
          >
            <Div className="col-span-2 flex flex-col min-w-0">
              <Span className="text-xs truncate">{task.taskName}</Span>
              {task.lastError && (
                <Span className="text-xs text-muted-foreground truncate">
                  {task.lastError}
                </Span>
              )}
              {task.lastFailure && (
                <Span className="text-xs text-muted-foreground">
                  {formatDate(task.lastFailure)}
                </Span>
              )}
            </Div>
            <Span className="text-xs tabular-nums text-right text-red-600 dark:text-red-400">
              {task.failures.toLocaleString()}
            </Span>
            <Span className="text-xs tabular-nums text-right">
              {task.executions.toLocaleString()}
            </Span>
            <Div className="flex flex-col gap-0.5 items-end">
              <Div className="flex items-center gap-1">
                <Div className="w-12 h-1.5 rounded bg-muted overflow-hidden">
                  <Div
                    style={{
                      width: `${ratePct}%`,
                      backgroundColor: "#ef4444",
                      height: "100%",
                      borderRadius: "9999px",
                    }}
                  />
                </Div>
                <Span className="text-xs tabular-nums text-red-600 dark:text-red-400">
                  {Math.round(task.failureRate)}
                  {"%"}
                </Span>
              </Div>
            </Div>
          </Div>
        );
      })}
    </Div>
  );
}

// ─── RecentActivityFeed ───────────────────────────────────────────────────────

function RecentActivityFeed({
  items,
  t,
}: {
  items: NonNullable<StatsData["recentActivity"]>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  return (
    <Div className="flex flex-col divide-y">
      {items.map((item) => (
        <Div key={item.id} className="flex items-start gap-3 py-2">
          <RecentActivityIcon status={item.status} />
          <Div className="flex flex-col min-w-0 flex-1">
            <Div className="flex items-center gap-2 flex-wrap">
              <Span className="text-sm font-medium truncate">
                {item.taskName}
              </Span>
              <Span className="text-xs text-muted-foreground">{item.type}</Span>
              <StatusBadge status={item.status} t={t} />
            </Div>
            <Div className="flex items-center gap-3">
              <Span className="text-xs text-muted-foreground">
                {formatDate(item.timestamp)}
              </Span>
              {item.duration !== undefined && item.duration !== null && (
                <Span className="text-xs text-muted-foreground">
                  {formatDuration(item.duration)}
                </Span>
              )}
            </Div>
          </Div>
        </Div>
      ))}
    </Div>
  );
}

// ─── DailyStatsTable ─────────────────────────────────────────────────────────

function DailyStatsTable({
  rows,
  t,
}: {
  rows: NonNullable<StatsData["dailyStats"]>;
  t: ReturnType<typeof useWidgetTranslation>;
}): React.JSX.Element {
  const last7 = rows.slice(-7);
  return (
    <Div className="flex flex-col gap-1">
      <Div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground font-medium pb-1 border-b">
        <Span>
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.date",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.executions",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.successes",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.failures",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.avgDuration",
          )}
        </Span>
        <Span className="text-right">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.col.uniqueTasks",
          )}
        </Span>
      </Div>
      {last7.map((row) => (
        <Div
          key={row.date}
          className="grid grid-cols-6 gap-2 text-xs py-1.5 border-b last:border-0"
        >
          <Span className="tabular-nums">{formatDate(row.date)}</Span>
          <Span className="text-right tabular-nums">
            {row.executions.toLocaleString()}
          </Span>
          <Span className="text-right tabular-nums text-green-600 dark:text-green-400">
            {row.successes.toLocaleString()}
          </Span>
          <Span className="text-right tabular-nums text-red-600 dark:text-red-400">
            {row.failures.toLocaleString()}
          </Span>
          <Span className="text-right tabular-nums">
            {formatDuration(row.avgDuration)}
          </Span>
          <Span className="text-right tabular-nums">
            {row.uniqueTasks.toLocaleString()}
          </Span>
        </Div>
      ))}
    </Div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CronStatsContainer({ field }: WidgetProps): React.JSX.Element {
  const children = field.children;
  const { endpointMutations } = useWidgetContext();
  const router = useRouter();
  const locale = useWidgetLocale();
  const t = useWidgetTranslation();

  const data = field.value;
  const isLoading = endpointMutations?.read?.isLoading;

  // ─── Callbacks ────────────────────────────────────────────────────────────

  const handleRefresh = useCallback((): void => {
    endpointMutations?.read?.refetch?.();
  }, [endpointMutations]);

  const handleViewTasks = useCallback((): void => {
    router.push(`/${locale}/admin/cron/tasks`);
  }, [router, locale]);

  const handleViewHistory = useCallback((): void => {
    router.push(`/${locale}/admin/cron/history`);
  }, [router, locale]);

  // ─── Derived values ───────────────────────────────────────────────────────

  const successRate = useMemo(() => {
    if (data === undefined || data === null) {
      return null;
    }
    if (data.successRate !== undefined && data.successRate !== null) {
      return data.successRate;
    }
    if (data.executedTasks > 0) {
      return (data.successfulTasks / data.executedTasks) * 100;
    }
    return null;
  }, [data]);

  const tasksByStatusEntries = useMemo(
    () => (data?.tasksByStatus ? Object.entries(data.tasksByStatus) : []),
    [data?.tasksByStatus],
  );

  const tasksByStatusTotal = useMemo(
    () => tasksByStatusEntries.reduce((acc, [, v]) => acc + v, 0),
    [tasksByStatusEntries],
  );

  const tasksByPriorityEntries = useMemo(
    () => (data?.tasksByPriority ? Object.entries(data.tasksByPriority) : []),
    [data?.tasksByPriority],
  );

  const tasksByPriorityTotal = useMemo(
    () => tasksByPriorityEntries.reduce((acc, [, v]) => acc + v, 0),
    [tasksByPriorityEntries],
  );

  const topPerformingTasks = data?.topPerformingTasks ?? [];
  const problemTasks = data?.problemTasks ?? [];
  const recentActivity = data?.recentActivity ?? [];
  const dailyStats = data?.dailyStats ?? [];

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (isLoading && !data) {
    return (
      <Div className="flex flex-col items-center justify-center gap-3 p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <Span className="text-sm text-muted-foreground">
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.loading",
          )}
        </Span>
      </Div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Div className="flex flex-col gap-4 p-4">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Div className="flex items-center gap-2 pb-2 border-b">
        <NavigateButtonWidget field={children.backButton} />
        <Div className="flex items-center gap-2 mr-auto">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <Span className="font-semibold text-base">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.title",
            )}
          </Span>
        </Div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewTasks}
        >
          <List className="h-4 w-4 mr-1" />
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.viewTasks",
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleViewHistory}
        >
          <Clock className="h-4 w-4 mr-1" />
          {t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.viewHistory",
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.refresh",
          )}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </Div>

      {/* ── Primary KPI Cards ──────────────────────────────────────────────── */}
      <Div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.totalTasks",
          )}
          value={data?.totalTasks}
          icon={<Activity className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.executedTasks",
          )}
          value={data?.executedTasks}
          icon={<TrendingUp className="h-3.5 w-3.5 text-blue-500" />}
          variant="info"
        />
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.successfulTasks",
          )}
          value={data?.successfulTasks}
          icon={<CheckCircle className="h-3.5 w-3.5 text-green-500" />}
          variant="success"
        />
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.failedTasks",
          )}
          value={data?.failedTasks}
          icon={<XCircle className="h-3.5 w-3.5 text-red-500" />}
          variant="danger"
        />
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.successRate",
          )}
          value={
            successRate !== null
              ? `${Math.round(
                  data?.successRate ??
                    ((data?.successfulTasks ?? 0) /
                      Math.max(data?.executedTasks ?? 1, 1)) *
                      100,
                )}%`
              : "—"
          }
          icon={<TrendingUp className="h-3.5 w-3.5 text-green-500" />}
          variant="success"
        />
        <StatCard
          label={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.avgDuration",
          )}
          value={formatDuration(data?.averageExecutionTime)}
          icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}
        />
      </Div>

      {/* ── Success Rate Bar ───────────────────────────────────────────────── */}
      {successRate !== null && (
        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center justify-between mb-2">
            <Span className="text-sm font-semibold">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.overallSuccessRate",
              )}
            </Span>
            <Span className="text-sm font-bold tabular-nums">
              {Math.round(successRate)}
              {"%"}
            </Span>
          </Div>
          <SuccessRateBar rate={successRate} />
        </Div>
      )}

      {/* ── Secondary Metrics ──────────────────────────────────────────────── */}
      {data !== undefined && data !== null && (
        <Div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.activeTasks !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.activeTasks",
              )}
              value={data.activeTasks}
              icon={<Activity className="h-3 w-3 text-muted-foreground" />}
            />
          )}
          {data.runningExecutions !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.runningExecutions",
              )}
              value={data.runningExecutions}
              icon={<TrendingUp className="h-3 w-3 text-blue-500" />}
            />
          )}
          {data.pendingExecutions !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.pendingExecutions",
              )}
              value={data.pendingExecutions}
              icon={<Clock className="h-3 w-3 text-yellow-500" />}
            />
          )}
          {data.healthyTasks !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.healthyTasks",
              )}
              value={data.healthyTasks}
              icon={<CheckCircle className="h-3 w-3 text-green-500" />}
            />
          )}
          {data.degradedTasks !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.degradedTasks",
              )}
              value={data.degradedTasks}
              icon={<AlertTriangle className="h-3 w-3 text-yellow-500" />}
            />
          )}
          {data.systemLoad !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.systemLoad",
              )}
              value={`${Math.round(data.systemLoad)}%`}
              icon={<TrendingDown className="h-3 w-3 text-muted-foreground" />}
            />
          )}
          {data.queueSize !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.queueSize",
              )}
              value={data.queueSize}
            />
          )}
          {data.executionsLast24h !== undefined && (
            <SmallStatCard
              label={t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.executionsLast24h",
              )}
              value={data.executionsLast24h}
              icon={<Activity className="h-3 w-3 text-blue-500" />}
            />
          )}
        </Div>
      )}

      {/* ── Tasks By Status ────────────────────────────────────────────────── */}
      {tasksByStatusEntries.length > 0 && (
        <DistributionSection
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.tasksByStatus",
          )}
          entries={tasksByStatusEntries}
          total={tasksByStatusTotal}
          getBadge={(key) => <StatusBadge status={key} t={t} />}
          getColor={getStatusColor}
        />
      )}

      {/* ── Tasks By Priority ──────────────────────────────────────────────── */}
      {tasksByPriorityEntries.length > 0 && (
        <DistributionSection
          title={t(
            "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.tasksByPriority",
          )}
          entries={tasksByPriorityEntries}
          total={tasksByPriorityTotal}
          getBadge={(key) => <PriorityBadge priority={key} t={t} />}
          getColor={getPriorityColor}
        />
      )}

      {/* ── Top Performing Tasks ───────────────────────────────────────────── */}
      {topPerformingTasks.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <Span className="text-sm font-semibold">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.topPerforming",
              )}
            </Span>
          </Div>
          <TopPerformingTable tasks={topPerformingTasks} t={t} />
        </Div>
      )}

      {/* ── Problem Tasks ──────────────────────────────────────────────────── */}
      {problemTasks.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <Span className="text-sm font-semibold">
              {t(
                "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.problemTasks",
              )}
            </Span>
          </Div>
          <ProblemTasksTable tasks={problemTasks} t={t} />
        </Div>
      )}

      {/* ── Recent Activity ────────────────────────────────────────────────── */}
      {recentActivity.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Span className="text-sm font-semibold mb-3 block">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.recentActivity",
            )}
          </Span>
          <RecentActivityFeed items={recentActivity} t={t} />
        </Div>
      )}

      {/* ── Daily Stats ────────────────────────────────────────────────────── */}
      {dailyStats.length > 0 && (
        <Div className="rounded-lg border bg-card p-4">
          <Span className="text-sm font-semibold mb-3 block">
            {t(
              "app.api.system.unifiedInterface.tasks.cronSystem.stats.widget.dailyStats",
            )}
          </Span>
          <DailyStatsTable rows={dailyStats} t={t} />
        </Div>
      )}
    </Div>
  );
}
