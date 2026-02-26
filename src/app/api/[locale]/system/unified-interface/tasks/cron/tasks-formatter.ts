/**
 * Tasks Summary Formatter
 * Isomorphic functions that work on both client and server
 * IMPORTANT: No database imports or server-only code allowed
 */

/* eslint-disable i18next/no-literal-string */

import { CronTaskStatus } from "../enum";
import { CRON_DELETE_ALIAS, CRON_UPDATE_ALIAS } from "./[id]/definition";
import { CRON_DASHBOARD_ALIAS } from "./dashboard/definition";
import { CRON_HISTORY_ALIAS } from "./history/definition";
import { CRON_CREATE_ALIAS, CRON_LIST_ALIAS } from "./tasks/definition";

export interface RecentExecution {
  status: string;
  completedAt: string | null;
  durationMs: number | null;
  resultSnippet: string | null;
  errorSnippet: string | null;
}

export interface TaskSummaryItem {
  id: string;
  displayName: string;
  description: string | null;
  schedule: string;
  enabled: boolean;
  lastExecutionStatus: string | null;
  lastExecutedAt: Date | string | null;
  errorCount: number;
  routeId: string;
  // Enriched fields (nullable for client-side graceful degradation)
  priority: string | null;
  lastExecutionDuration: number | null;
  lastResultSummary: string | null;
  consecutiveFailures: number;
  recentExecutions: RecentExecution[] | null;
}

/** Max characters for the full tasks summary (approx 1.3k tokens) */
const TASKS_BUDGET = 5500;

/**
 * Assign a sort priority score to a task — higher = show first / show more detail.
 * Consecutive failures on critical/high tasks score highest.
 */
function taskScore(task: TaskSummaryItem): number {
  if (!task.enabled) {
    return 0;
  }
  // Critical/high with consecutive failures = top priority
  if (
    task.consecutiveFailures > 0 &&
    (task.priority === "critical" || task.priority === "high")
  ) {
    return 5;
  }
  if (task.consecutiveFailures > 0) {
    return 4;
  }
  if (task.errorCount > 0) {
    return 3;
  }
  if (task.lastExecutedAt) {
    return 2;
  }
  return 1;
}

/**
 * Format duration in human-readable form.
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Format a date for display in the summary.
 */
function formatDate(date: Date | string | null): string | null {
  if (!date) {
    return null;
  }
  const str = typeof date === "string" ? date : date.toISOString();
  // "2026-02-26T10:30" → "Feb26 10:30"
  const d = new Date(str);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]}${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/**
 * Format a single task as a full line with result and duration.
 */
function fullLine(task: TaskSummaryItem): string {
  const status = task.enabled ? "✓" : "✗";
  const dateStr = formatDate(task.lastExecutedAt);
  const duration =
    task.lastExecutionDuration !== null &&
    task.lastExecutionDuration !== undefined
      ? ` (${formatDuration(task.lastExecutionDuration)})`
      : "";
  const lastRun = dateStr
    ? `last:${task.lastExecutionStatus ?? "?"}@${dateStr}${duration}`
    : "never run";
  const result = task.lastResultSummary ? ` → "${task.lastResultSummary}"` : "";
  const errors = task.errorCount > 0 ? ` ⚠ errors:${task.errorCount}` : "";
  const desc = task.description ? ` — ${task.description}` : "";
  return `- [${task.id.slice(-8)}] ${status} ${task.displayName}${desc} | ${task.schedule} | ${lastRun}${result}${errors} | route:${task.routeId}`;
}

/**
 * Format a single task as a compact name-only line (used when budget is tight).
 */
function compactLine(task: TaskSummaryItem): string {
  const status = task.enabled ? "✓" : "✗";
  const errors = task.errorCount > 0 ? ` ⚠${task.errorCount}err` : "";
  return `- [${task.id.slice(-8)}] ${status} ${task.displayName}${errors}`;
}

/**
 * Format failure alerts for critical/high priority tasks with consecutive failures.
 * Returns empty string if no alerts.
 */
function formatFailureAlerts(tasks: TaskSummaryItem[]): string {
  const alerts = tasks.filter(
    (t) =>
      t.consecutiveFailures > 0 &&
      (t.priority === "critical" || t.priority === "high"),
  );

  if (alerts.length === 0) {
    return "";
  }

  const lines = alerts
    .toSorted((a, b) => {
      // critical before high, then by failure count
      if (a.priority === "critical" && b.priority !== "critical") {
        return -1;
      }
      if (b.priority === "critical" && a.priority !== "critical") {
        return 1;
      }
      return b.consecutiveFailures - a.consecutiveFailures;
    })
    .map((t) => {
      const label = (t.priority ?? "").toUpperCase();
      const errorSnippet = t.recentExecutions?.find(
        (e) => e.errorSnippet,
      )?.errorSnippet;
      const errorNote = errorSnippet ? ` Last: "${errorSnippet}"` : "";
      return `- ${label} "${t.displayName}" — ${t.consecutiveFailures} consecutive failure${t.consecutiveFailures === 1 ? "" : "s"}!${errorNote}`;
    });

  return `⚠ TASK ALERTS\n${lines.join("\n")}\n→ Investigate: \`${CRON_HISTORY_ALIAS}\`, fix: \`${CRON_UPDATE_ALIAS}\``;
}

/**
 * Format recent execution activity for top tasks.
 * Shows compact execution timeline per task.
 */
function formatRecentActivity(tasks: TaskSummaryItem[]): string {
  const withHistory = tasks.filter(
    (t) => t.recentExecutions && t.recentExecutions.length > 0,
  );

  if (withHistory.length === 0) {
    return "";
  }

  // Top 5 tasks by score
  const top = withHistory
    .toSorted((a, b) => taskScore(b) - taskScore(a))
    .slice(0, 5);

  const lines = top.map((t) => {
    const execs = (t.recentExecutions ?? [])
      .map((e) => {
        const isSuccess = e.status === CronTaskStatus.COMPLETED;
        const dur =
          e.durationMs !== null && e.durationMs !== undefined
            ? `(${formatDuration(e.durationMs)})`
            : "";
        if (isSuccess) {
          return `✓${dur}`;
        }
        const errNote = e.errorSnippet ? `("${e.errorSnippet}")` : "";
        return `✗${errNote}`;
      })
      .join(" ");
    return `  ${t.displayName}: ${execs}`;
  });

  return `Recent:\n${lines.join("\n")}`;
}

/**
 * Format a list of tasks into a system prompt summary string.
 * Single source of truth for task formatting (isomorphic — works on client and server).
 *
 * Strategy:
 * - Failure alerts first (critical/high tasks with consecutive failures)
 * - Sort by priority (errors first, then active, then idle, then disabled)
 * - Fill full lines up to budget, then compact, then hard cut
 * - Recent execution activity for top tasks
 */
export function formatTasksSummary(tasks: TaskSummaryItem[]): string {
  if (tasks.length === 0) {
    return "";
  }

  // Sort by descending score
  const sorted = [...tasks].toSorted((a, b) => taskScore(b) - taskScore(a));

  const alertsBlock = formatFailureAlerts(sorted);
  const recentBlock = formatRecentActivity(sorted);

  const header = `## Scheduled Tasks (${tasks.length})`;
  const footer = `\nTools: \`${CRON_DASHBOARD_ALIAS}\` (overview) · \`${CRON_LIST_ALIAS}\` (list) · \`${CRON_CREATE_ALIAS}\` (create) · \`${CRON_UPDATE_ALIAS}\` (edit/disable) · \`${CRON_DELETE_ALIAS}\` (delete) · \`${CRON_HISTORY_ALIAS}\` (history)\n\n**Self-management:** After completing the user's request, review these tasks. Fix errors, disable/delete stale ones, and briefly mention what you changed.`;

  // Reserve space for all sections
  const reserved =
    header.length +
    footer.length +
    (alertsBlock ? alertsBlock.length + 2 : 0) +
    (recentBlock ? recentBlock.length + 2 : 0) +
    80;
  let remaining = TASKS_BUDGET - reserved;

  const lines: string[] = [];
  let hiddenCount = 0;

  for (const task of sorted) {
    const full = fullLine(task);
    const compact = compactLine(task);

    if (remaining >= full.length + 1) {
      lines.push(full);
      remaining -= full.length + 1;
    } else if (remaining >= compact.length + 1) {
      lines.push(compact);
      remaining -= compact.length + 1;
    } else {
      hiddenCount++;
    }
  }

  const parts: string[] = [header];

  if (alertsBlock) {
    parts.push(alertsBlock);
  }

  parts.push(lines.join("\n"));

  if (hiddenCount > 0) {
    parts.push(
      `[... ${hiddenCount} more task${hiddenCount === 1 ? "" : "s"} not shown — use \`${CRON_LIST_ALIAS}\` for the full list]`,
    );
  }

  if (recentBlock) {
    parts.push(recentBlock);
  }

  parts.push(footer);

  return parts.join("\n");
}
