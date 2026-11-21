/**
 * Cron health definitions (single source).
 *
 * "Failing", "stuck", "overdue" and "never ran" mean the same thing in the
 * task health report (cron-stats), the business overview and every agent that
 * reads them. Change a rule here, nowhere else.
 */

import "server-only";

import { CronExpressionParser } from "cron-parser";
import { and, count, eq, inArray, type SQL } from "drizzle-orm";

import { db } from "../../database";
import { CronTaskStatus, type CronTaskStatusValue } from "../enum";
import { maxDurationFor } from "../watchdog/config";
import { cronTasks } from "./db";
import { RECOVERY_RUNS, TaskHealth, type TaskHealthValue } from "./stats/enum";

export { RECOVERY_RUNS };

/** Statuses that mean the last run failed. */
export const FAILED_TASK_STATUSES = [
  CronTaskStatus.FAILED,
  CronTaskStatus.ERROR,
  CronTaskStatus.TIMEOUT,
] as const;

/** Timeout the runner applies when a task row has none. */
export const DEFAULT_TASK_TIMEOUT_MS = 300_000;

/**
 * A scheduled fire counts as missed once it is this old and no run started
 * after it (covers runner start-up lag and long previous runs).
 */
export const OVERDUE_GRACE_MS = 10 * 60_000;

export function isFailedStatus(
  status: typeof CronTaskStatusValue | null | undefined,
): boolean {
  return (
    status === CronTaskStatus.FAILED ||
    status === CronTaskStatus.ERROR ||
    status === CronTaskStatus.TIMEOUT
  );
}

/** SQL twin of {@link isFailingTask}: enabled and the last run failed. */
export function failingTaskSql(): SQL | undefined {
  return and(
    eq(cronTasks.enabled, true),
    inArray(cronTasks.lastExecutionStatus, [...FAILED_TASK_STATUSES]),
  );
}

/** Enabled tasks whose last run failed, errored or timed out. */
export async function getFailingTaskCount(): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(cronTasks)
    .where(failingTaskSql());
  return row?.n ?? 0;
}

export type TaskHealthRow = Pick<
  typeof cronTasks.$inferSelect,
  | "enabled"
  | "schedule"
  | "timezone"
  | "timeout"
  | "lastExecutionStatus"
  | "lastExecutedAt"
  | "runStartedAt"
  | "updatedAt"
  | "createdAt"
  | "runOnce"
  | "routeId"
>;

/** Finished / failed run counts of one task inside the report window. */
export interface TaskWindowRuns {
  completed: number;
  failed: number;
  /** The last RECOVERY_RUNS finished runs (any time) all completed. */
  recentAllOk?: boolean;
}

/** Flaky: at least this many finished runs in the window ... */
export const FLAKY_MIN_RUNS = 3;
/** ... and fewer than this share of them completed. */
export const FLAKY_SUCCESS_BELOW = 0.8;

export function isFlakyTask(runs: TaskWindowRuns | undefined): boolean {
  if (!runs) {
    return false;
  }
  const finished = runs.completed + runs.failed;
  return (
    finished >= FLAKY_MIN_RUNS &&
    runs.completed / finished < FLAKY_SUCCESS_BELOW
  );
}

/** Some failures, but too few finished runs to call it flaky or healthy. */
export function isLowDataTask(runs: TaskWindowRuns | undefined): boolean {
  if (!runs) {
    return false;
  }
  return runs.failed > 0 && runs.completed + runs.failed < FLAKY_MIN_RUNS;
}

/** A disabled task whose last claimed run never finished (process died). */
export function isOrphanedRun(row: TaskHealthRow, now: Date): boolean {
  return !row.enabled && isStuckTask(row, now);
}

/** Finished or parked one-off task (runOnce, now disabled): history noise. */
export function isOneOffTask(row: TaskHealthRow): boolean {
  return row.runOnce && !row.enabled;
}

/**
 * Parked: nothing to watch. One-off tasks that are done, and disabled tasks
 * that never ran and hold no orphaned run. Hidden from the report by default.
 * Disabled tasks with a run history (failures included) stay visible.
 */
export function isParkedTask(row: TaskHealthRow, now: Date): boolean {
  if (isOneOffTask(row)) {
    return true;
  }
  return !row.enabled && isNeverRunTask(row) && !isOrphanedRun(row, now);
}

/**
 * Duration statistics count completed runs only. Timed-out runs are reaped
 * by the watchdog long after they hung (wall-clock garbage), and failures
 * often abort instantly (a 0 ms "median" says nothing about run time).
 */
export const MEASURED_RUN_STATUSES = [CronTaskStatus.COMPLETED] as const;

export function isFailingTask(row: TaskHealthRow): boolean {
  return row.enabled && isFailedStatus(row.lastExecutionStatus);
}

/** When the current run started (rows from before runStartedAt use updatedAt). */
export function runStartOf(row: TaskHealthRow): Date | null {
  if (row.lastExecutionStatus !== CronTaskStatus.RUNNING) {
    return null;
  }
  return row.runStartedAt ?? row.updatedAt;
}

/**
 * How long a run may take before it counts as stuck. Same limit the task
 * watchdog enforces (max(15 min, timeout + 2 min), per-route overrides), so
 * the report and the watchdog never disagree and short-timeout tasks (the
 * watchdog itself runs with 1 min) do not flap between running and stuck.
 */
export function stuckAfterMs(row: TaskHealthRow): number {
  return maxDurationFor(row.routeId, row.timeout ?? DEFAULT_TASK_TIMEOUT_MS);
}

/** Running past its stuck limit (enabled or not: the claimed run is live). */
export function isStuckTask(row: TaskHealthRow, now: Date): boolean {
  const start = runStartOf(row);
  if (!start) {
    return false;
  }
  return now.getTime() - start.getTime() > stuckAfterMs(row);
}

/** Most recent scheduled fire at least OVERDUE_GRACE_MS ago (null = bad cron). */
export function lastDueFire(row: TaskHealthRow, now: Date): Date | null {
  try {
    const interval = CronExpressionParser.parse(row.schedule, {
      tz: row.timezone ?? "UTC",
      currentDate: new Date(now.getTime() - OVERDUE_GRACE_MS),
    });
    return interval.prev().toDate();
  } catch {
    return null;
  }
}

export function nextFire(row: TaskHealthRow, now: Date): Date | null {
  if (!row.enabled) {
    return null;
  }
  try {
    const interval = CronExpressionParser.parse(row.schedule, {
      tz: row.timezone ?? "UTC",
      currentDate: now,
    });
    return interval.next().toDate();
  } catch {
    return null;
  }
}

/** Enabled, idle, and a scheduled fire passed without a run starting. */
export function isOverdueTask(row: TaskHealthRow, now: Date): boolean {
  if (!row.enabled || row.lastExecutionStatus === CronTaskStatus.RUNNING) {
    return false;
  }
  const due = lastDueFire(row, now);
  if (!due) {
    return false;
  }
  const since = row.lastExecutedAt ?? row.createdAt;
  return since.getTime() < due.getTime();
}

export function isNeverRunTask(row: TaskHealthRow): boolean {
  return row.lastExecutedAt === null && row.lastExecutionStatus === null;
}

/**
 * One state per task:
 * stuck > disabled > failing > running > never ran > overdue > flaky >
 * recovering > low data > healthy. Recovering = flaky or low data in the
 * period, but the last RECOVERY_RUNS finished runs all completed.
 * A hung run is stuck whatever the enabled flag says (on a disabled task it is
 * an orphaned run, see isOrphanedRun). Otherwise disabled wins: a switched-off
 * task is not broken.
 * "Healthy" needs a clean last run AND a clean window (see isFlakyTask).
 */
export function classifyTaskHealth(
  row: TaskHealthRow,
  now: Date,
  windowRuns?: TaskWindowRuns,
): typeof TaskHealthValue {
  if (isStuckTask(row, now)) {
    return TaskHealth.STUCK;
  }
  if (!row.enabled) {
    return TaskHealth.DISABLED;
  }
  if (isFailingTask(row)) {
    return TaskHealth.FAILING;
  }
  if (row.lastExecutionStatus === CronTaskStatus.RUNNING) {
    return TaskHealth.RUNNING;
  }
  if (isNeverRunTask(row)) {
    return TaskHealth.NEVER_RAN;
  }
  if (isOverdueTask(row, now)) {
    return TaskHealth.OVERDUE;
  }
  if (isFlakyTask(windowRuns) || isLowDataTask(windowRuns)) {
    // Failures in the period, but the latest runs are clean again.
    if (windowRuns?.recentAllOk) {
      return TaskHealth.RECOVERING;
    }
    return isFlakyTask(windowRuns) ? TaskHealth.FLAKY : TaskHealth.LOW_DATA;
  }
  return TaskHealth.HEALTHY;
}

/** Sort rank (lower = more urgent). */
export const TASK_HEALTH_RANK: Record<typeof TaskHealthValue, number> = {
  [TaskHealth.STUCK]: 0,
  [TaskHealth.FAILING]: 1,
  [TaskHealth.OVERDUE]: 2,
  [TaskHealth.FLAKY]: 3,
  [TaskHealth.RECOVERING]: 4,
  [TaskHealth.RUNNING]: 5,
  [TaskHealth.LOW_DATA]: 6,
  [TaskHealth.NEVER_RAN]: 7,
  [TaskHealth.HEALTHY]: 8,
  [TaskHealth.DISABLED]: 9,
};
