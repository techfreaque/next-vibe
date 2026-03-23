/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import {
  CRON_DELETE_ALIAS,
  CRON_UPDATE_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/constants";
import { CRON_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/constants";
import { CRON_QUEUE_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/queue/constants";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/constants";
import type { CronTaskItem } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import {
  CronTaskPriority,
  CronTaskStatus,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";

export interface TasksData {
  tasks: CronTaskItem[];
}

/** Max characters for the full tasks summary (approx 1.3k tokens) */
const TASKS_BUDGET = 5500;

function taskScore(task: CronTaskItem): number {
  if (!task.enabled) {
    return 0;
  }
  if (
    task.consecutiveFailures > 0 &&
    (task.priority === CronTaskPriority.CRITICAL ||
      task.priority === CronTaskPriority.HIGH)
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

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(date: string | null): string | null {
  if (!date) {
    return null;
  }
  const d = new Date(date);
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

function fullLine(task: CronTaskItem): string {
  const status = task.enabled ? "✓" : "✗";
  const dateStr = formatDate(task.lastExecutedAt);
  const duration =
    task.lastExecutionDuration !== null
      ? ` (${formatDuration(task.lastExecutionDuration)})`
      : "";
  const lastRun = dateStr
    ? `last:${task.lastExecutionStatus ?? "?"}@${dateStr}${duration}`
    : "never run";
  const result = task.lastResultSummary ? ` → "${task.lastResultSummary}"` : "";
  const errors = task.errorCount > 0 ? ` ⚠ errors:${task.errorCount}` : "";
  const desc = task.description ? ` - ${task.description}` : "";
  return `- [${task.shortId}] ${status} ${task.displayName}${desc} | ${task.schedule} | ${lastRun}${result}${errors} | route:${task.routeId}`;
}

function compactLine(task: CronTaskItem): string {
  const status = task.enabled ? "✓" : "✗";
  const errors = task.errorCount > 0 ? ` ⚠${task.errorCount}err` : "";
  return `- [${task.shortId}] ${status} ${task.displayName}${errors}`;
}

function formatFailureAlerts(tasks: CronTaskItem[]): string {
  const alerts = tasks.filter(
    (t) =>
      t.consecutiveFailures > 0 &&
      (t.priority === CronTaskPriority.CRITICAL ||
        t.priority === CronTaskPriority.HIGH),
  );
  if (alerts.length === 0) {
    return "";
  }
  const lines = alerts
    .toSorted((a, b) => {
      if (
        a.priority === CronTaskPriority.CRITICAL &&
        b.priority !== CronTaskPriority.CRITICAL
      ) {
        return -1;
      }
      if (
        b.priority === CronTaskPriority.CRITICAL &&
        a.priority !== CronTaskPriority.CRITICAL
      ) {
        return 1;
      }
      return b.consecutiveFailures - a.consecutiveFailures;
    })
    .map((t) => {
      const errorSnippet = t.recentExecutions?.find(
        (e) => e.errorSnippet,
      )?.errorSnippet;
      const errorNote = errorSnippet ? ` Last: "${errorSnippet}"` : "";
      return `- ${t.priority.toUpperCase()} "${t.displayName}" - ${t.consecutiveFailures} consecutive failure${t.consecutiveFailures === 1 ? "" : "s"}!${errorNote}`;
    });
  return `⚠ TASK ALERTS\n${lines.join("\n")}\n→ Investigate: \`${CRON_HISTORY_ALIAS}\`, fix: \`${CRON_UPDATE_ALIAS}\``;
}

function formatRecentActivity(tasks: CronTaskItem[]): string {
  const withHistory = tasks.filter(
    (t) => t.recentExecutions && t.recentExecutions.length > 0,
  );
  if (withHistory.length === 0) {
    return "";
  }
  const top = withHistory
    .toSorted((a, b) => taskScore(b) - taskScore(a))
    .slice(0, 5);
  const lines = top.map((t) => {
    const execs = (t.recentExecutions ?? [])
      .map((e) => {
        const dur =
          e.durationMs !== null ? `(${formatDuration(e.durationMs)})` : "";
        if (e.status === CronTaskStatus.COMPLETED) {
          return `✓${dur}`;
        }
        return `✗${e.errorSnippet ? `("${e.errorSnippet}")` : ""}`;
      })
      .join(" ");
    return `  ${t.displayName}: ${execs}`;
  });
  return `Recent:\n${lines.join("\n")}`;
}

export function formatTasksSummary(tasks: CronTaskItem[]): string {
  if (tasks.length === 0) {
    return "";
  }

  const sorted = [...tasks].toSorted((a, b) => taskScore(b) - taskScore(a));
  const alertsBlock = formatFailureAlerts(sorted);
  const recentBlock = formatRecentActivity(sorted);

  const header = `## Scheduled Tasks (${tasks.length})`;
  const footer = `\nTools: \`${CRON_LIST_ALIAS}\` (list) · \`${CRON_QUEUE_ALIAS}\` (queue/next runs) · \`${CRON_CREATE_ALIAS}\` (create) · \`${CRON_UPDATE_ALIAS}\` (edit/disable) · \`${CRON_DELETE_ALIAS}\` (delete) · \`${CRON_HISTORY_ALIAS}\` (history)\n\n**Self-management:** After completing the user's request, review these tasks. Fix errors, disable/delete stale ones, and briefly mention what you changed.`;

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
      `[... ${hiddenCount} more task${hiddenCount === 1 ? "" : "s"} not shown - use \`${CRON_LIST_ALIAS}\` for the full list]`,
    );
  }
  if (recentBlock) {
    parts.push(recentBlock);
  }
  parts.push(footer);

  return parts.join("\n");
}

export const tasksFragment: SystemPromptFragment<TasksData> = {
  id: "tasks",
  placement: "trailing",
  priority: 100,
  condition: (data) => data.tasks.length > 0,
  build: (data) => {
    const result = formatTasksSummary(data.tasks);
    return result.length > 0 ? result : null;
  },
};
