/**
 * Tasks Summary Formatter
 * Isomorphic functions that work on both client and server
 * IMPORTANT: No database imports or server-only code allowed
 */

/* eslint-disable i18next/no-literal-string */

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
}

/** Max characters for the full tasks summary (approx 1k tokens) */
const TASKS_BUDGET = 4000;

/**
 * Assign a sort priority score to a task — higher = show first / show more detail.
 * 1. Enabled + has errors (most actionable)
 * 2. Enabled + ran recently
 * 3. Enabled + never run
 * 4. Disabled (lowest priority)
 */
function taskScore(task: TaskSummaryItem): number {
  if (!task.enabled) {
    return 0;
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
 * Format a single task as a full line (name + schedule + status + last-run + errors + route).
 */
function fullLine(task: TaskSummaryItem): string {
  const status = task.enabled ? "✓" : "✗";
  const lastRunAt = task.lastExecutedAt
    ? typeof task.lastExecutedAt === "string"
      ? task.lastExecutedAt.slice(0, 16)
      : task.lastExecutedAt.toISOString().slice(0, 16)
    : null;
  const lastRun = lastRunAt
    ? `last:${task.lastExecutionStatus ?? "?"}@${lastRunAt}`
    : "never run";
  const errors = task.errorCount > 0 ? ` ⚠ errors:${task.errorCount}` : "";
  const desc = task.description ? ` — ${task.description}` : "";
  return `- [${task.id.slice(-8)}] ${status} ${task.displayName}${desc} | ${task.schedule} | ${lastRun}${errors} | route:${task.routeId}`;
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
 * Format a list of tasks into a system prompt summary string.
 * Single source of truth for task formatting (isomorphic — works on client and server).
 *
 * Strategy:
 * - Sort by priority (errors first, then active, then idle, then disabled)
 * - Fill full lines up to budget
 * - Remaining tasks get compact (name-only) lines if budget allows
 * - Hard cut with marker if still over budget
 */
export function formatTasksSummary(tasks: TaskSummaryItem[]): string {
  if (tasks.length === 0) {
    return "";
  }

  // Sort by descending score
  const sorted = [...tasks].toSorted((a, b) => taskScore(b) - taskScore(a));

  const header = `## Scheduled Tasks (${tasks.length})`;
  const footer = `\nTools: system_unified-interface_tasks_cron_tasks_GET (list) · system_unified-interface_tasks_cron_tasks_POST (create) · system_unified-interface_tasks_cron_[id]_PATCH (edit/disable) · system_unified-interface_tasks_cron_[id]_DELETE (delete)\n\n**Self-management:** After completing the user's request, review these tasks. Fix errors, disable/delete stale ones, and briefly mention what you changed.`;

  // Reserve space for header + footer + truncation marker
  const reserved = header.length + footer.length + 80;
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

  const parts = [header, lines.join("\n")];
  if (hiddenCount > 0) {
    parts.push(
      `[... ${hiddenCount} more task${hiddenCount === 1 ? "" : "s"} not shown — use system_unified-interface_tasks_cron_tasks_GET for the full list]`,
    );
  }
  parts.push(footer);

  return parts.join("\n");
}
