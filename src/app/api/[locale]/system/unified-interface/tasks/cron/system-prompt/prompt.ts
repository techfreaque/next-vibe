/* eslint-disable i18next/no-literal-string */

import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";
import { CronTaskStatus } from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import {
  CRON_DELETE_ALIAS,
  CRON_UPDATE_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/constants";
import { CRON_DASHBOARD_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/dashboard/constants";
import { CRON_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/constants";
import { CRON_QUEUE_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/queue/constants";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/constants";
import type { TaskSummaryItem } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks-formatter";

export type { TaskSummaryItem } from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks-formatter";

export interface TasksData {
  tasks: TaskSummaryItem[];
}

/** Max characters for the full tasks summary (approx 1.3k tokens) */
const TASKS_BUDGET = 5500;

function taskScore(task: TaskSummaryItem): number {
  if (!task.enabled) {
    return 0;
  }
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

function formatDurationMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(date: Date | string | null): string | null {
  if (!date) {
    return null;
  }
  const d = new Date(typeof date === "string" ? date : date.toISOString());
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

function fullLine(task: TaskSummaryItem): string {
  const status = task.enabled ? "✓" : "✗";
  const dateStr = formatDate(task.lastExecutedAt);
  const duration =
    task.lastExecutionDuration !== null &&
    task.lastExecutionDuration !== undefined
      ? ` (${formatDurationMs(task.lastExecutionDuration)})`
      : "";
  const lastRun = dateStr
    ? `last:${task.lastExecutionStatus ?? "?"}@${dateStr}${duration}`
    : "never run";
  const result = task.lastResultSummary ? ` → "${task.lastResultSummary}"` : "";
  const errors = task.errorCount > 0 ? ` ⚠ errors:${task.errorCount}` : "";
  const desc = task.description ? ` — ${task.description}` : "";
  return `- [${task.id}] ${status} ${task.displayName}${desc} | ${task.schedule} | ${lastRun}${result}${errors} | route:${task.routeId}`;
}

function compactLine(task: TaskSummaryItem): string {
  const status = task.enabled ? "✓" : "✗";
  const errors = task.errorCount > 0 ? ` ⚠${task.errorCount}err` : "";
  return `- [${task.id}] ${status} ${task.displayName}${errors}`;
}

export const tasksFragment: SystemPromptFragment<TasksData> = {
  id: "tasks",
  placement: "trailing",
  priority: 100,
  condition: (data) => data.tasks.length > 0,
  build: (data) => {
    const { tasks } = data;
    if (tasks.length === 0) {
      return null;
    }

    const sorted = [...tasks].toSorted((a, b) => taskScore(b) - taskScore(a));

    // Failure alerts for critical/high tasks
    const alerts = sorted.filter(
      (t) =>
        t.consecutiveFailures > 0 &&
        (t.priority === "critical" || t.priority === "high"),
    );
    let alertsBlock = "";
    if (alerts.length > 0) {
      const alertLines = alerts
        .toSorted((a, b) => {
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
          const errNote = t.recentExecutions?.find(
            (e) => e.errorSnippet,
          )?.errorSnippet;
          return `- ${label} "${t.displayName}" — ${t.consecutiveFailures} consecutive failure${t.consecutiveFailures === 1 ? "" : "s"}!${errNote ? ` Last: "${errNote}"` : ""}`;
        });
      alertsBlock = `⚠ TASK ALERTS\n${alertLines.join("\n")}\n→ Investigate: \`${CRON_HISTORY_ALIAS}\`, fix: \`${CRON_UPDATE_ALIAS}\``;
    }

    // Recent execution activity for top tasks
    const withHistory = sorted.filter(
      (t) => t.recentExecutions && t.recentExecutions.length > 0,
    );
    let recentBlock = "";
    if (withHistory.length > 0) {
      const top = withHistory
        .toSorted((a, b) => taskScore(b) - taskScore(a))
        .slice(0, 5);
      const recentLines = top.map((t) => {
        const execs = (t.recentExecutions ?? [])
          .map((e) => {
            const dur =
              e.durationMs !== null && e.durationMs !== undefined
                ? `(${formatDurationMs(e.durationMs)})`
                : "";
            if (e.status === CronTaskStatus.COMPLETED) {
              return `✓${dur}`;
            }
            return `✗${e.errorSnippet ? `("${e.errorSnippet}")` : ""}`;
          })
          .join(" ");
        return `  ${t.displayName}: ${execs}`;
      });
      recentBlock = `Recent:\n${recentLines.join("\n")}`;
    }

    const header = `## Scheduled Tasks (${tasks.length})`;
    const footer = `\nTools: \`${CRON_DASHBOARD_ALIAS}\` (overview) · \`${CRON_LIST_ALIAS}\` (list) · \`${CRON_QUEUE_ALIAS}\` (queue/next runs) · \`${CRON_CREATE_ALIAS}\` (create) · \`${CRON_UPDATE_ALIAS}\` (edit/disable) · \`${CRON_DELETE_ALIAS}\` (delete) · \`${CRON_HISTORY_ALIAS}\` (history)\n\n**Self-management:** After completing the user's request, review these tasks. Fix errors, disable/delete stale ones, and briefly mention what you changed.`;

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
  },
};
