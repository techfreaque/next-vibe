/**
 * Task Health (cron-stats) Repository
 * Task states now (health-summary.ts rules) + run metrics in an analytics window.
 */

import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  inArray,
  min,
  or,
  type SQL,
  sql,
} from "drizzle-orm";

import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import { parseError } from "../../../core/utils/parse-error";
import { db } from "../../../database";
import type { JwtPayloadType } from "../../../identity/auth/types";
import { UserPermissionRole } from "../../../identity/roles/enum";
import type { EndpointLogger } from "../../../logger/types";
import type { Kpi } from "../../../unified-ui/analytics/schema";
import {
  resolveAnalyticsWindow,
  serializeWindow,
} from "../../../unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
} from "../../../unified-ui/analytics/window-sql";
import { formatCronScheduleShort } from "../../cron-formatter";
import { CronTaskStatus } from "../../enum";
import { TASK_WATCHDOG_SELF_ID } from "../../watchdog/config";
import { cronTaskExecutions, cronTasks } from "../db";
import {
  classifyTaskHealth,
  DEFAULT_TASK_TIMEOUT_MS,
  FAILED_TASK_STATUSES,
  isOneOffTask,
  isOrphanedRun,
  isParkedTask,
  isStuckTask,
  lastDueFire,
  MEASURED_RUN_STATUSES,
  nextFire,
  RECOVERY_RUNS,
  runStartOf,
  stuckAfterMs,
  TASK_HEALTH_RANK,
  type TaskWindowRuns,
} from "../health-summary";
import { translateTaskNames } from "../task-names";
import type {
  CronHealthAttentionTask,
  CronHealthTaskRow,
  CronStatsGetRequestOutput,
  CronStatsGetResponseOutput,
} from "./definition";
import {
  ATTENTION_HEALTH,
  TaskHealth,
  TaskHealthFilter,
  type TaskHealthFilterValue,
  type TaskHealthValue,
} from "./enum";
import type { CronStatsT } from "./i18n";

const dur = cronTaskExecutions.durationMs;
const RECENT_RUNS = 5;
const TOP_FAILING_TASKS = 5;
/** Series key for the "all other tasks" bucket (never a task id: has a space). */
const OTHER_SERIES_KEY = "other tasks";
const failedList = sql.join(
  FAILED_TASK_STATUSES.map((s) => sql`${s}`),
  sql`, `,
);
const isFailedSql = sql`${cronTaskExecutions.status} IN (${failedList})`;
const isCompletedSql = sql`${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED}`;
const measuredList = sql.join(
  MEASURED_RUN_STATUSES.map((st) => sql`${st}`),
  sql`, `,
);
/** Runs whose duration is real run time (see MEASURED_RUN_STATUSES). */
const measuredSql = sql`${dur} IS NOT NULL AND ${cronTaskExecutions.status} IN (${measuredList})`;
const isTimeoutSql = sql`${cronTaskExecutions.status} = ${CronTaskStatus.TIMEOUT}`;

function num(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function ratio(done: number, failed: number): number | null {
  const finished = done + failed;
  return finished > 0 ? done / finished : null;
}

/**
 * Rates and durations per bucket. A bucket without runs is a gap: 0 here
 * (the charts draw it as an empty bar, the CLI prints "–" when the bucket has
 * no runs). Never a repeated or invented value.
 */
function gapFill(
  buckets: readonly string[],
  byBucket: ReadonlyMap<string, number | null>,
): number[] {
  return buckets.map((key) => byBucket.get(key) ?? 0);
}

/** Values of buckets that had runs, in order (row sparklines skip gaps). */
function withData(
  buckets: readonly string[],
  byBucket: ReadonlyMap<string, number | null>,
): number[] {
  return buckets.flatMap((key) => {
    const value = byBucket.get(key);
    return value === null || value === undefined ? [] : [value];
  });
}

function totalFailed(byKey: ReadonlyMap<string, number>): number {
  return [...byKey.values()].reduce((sum, v) => sum + v, 0);
}

function matchesFilter(
  state: typeof TaskHealthValue,
  filter: typeof TaskHealthFilterValue,
): boolean {
  if (filter === TaskHealthFilter.ALL) {
    return true;
  }
  if (filter === TaskHealthFilter.ATTENTION) {
    return ATTENTION_HEALTH.some((s) => s === state);
  }
  return filter === state;
}

export class CronStatsRepository {
  static async getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    t: CronStatsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatsGetResponseOutput>> {
    try {
      const now = new Date();
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      // ── Task scope ───────────────────────────────────────────────────────
      const taskConditions: SQL[] = [];
      if (!isAdmin) {
        if (!userId) {
          return fail({
            message: t("get.errors.forbidden.description"),
            errorType: ErrorResponseTypes.FORBIDDEN,
          });
        }
        taskConditions.push(eq(cronTasks.userId, userId));
      }
      const taskId = data.taskId?.trim();
      if (taskId) {
        taskConditions.push(eq(cronTasks.id, taskId));
      }

      const taskRows = await db
        .select()
        .from(cronTasks)
        .where(taskConditions.length > 0 ? and(...taskConditions) : undefined)
        .orderBy(asc(cronTasks.displayName));

      if (taskId && taskRows.length === 0) {
        return fail({
          message: t("get.errors.notFound.description"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const names = await translateTaskNames(taskRows, locale);
      // Two tasks with one title (e.g. two "Dreaming") get their id appended.
      const titleCount = new Map<string, number>();
      for (const row of taskRows) {
        const title = names.get(row.id) ?? row.displayName;
        titleCount.set(title, (titleCount.get(title) ?? 0) + 1);
      }
      const nameOf = (row: { id: string; displayName: string }): string => {
        const title = names.get(row.id) ?? row.displayName;
        return (titleCount.get(title) ?? 0) > 1 && title !== row.id
          ? `${title} (${row.id})`
          : title;
      };
      const taskIds = taskRows.map((r) => r.id);
      const scoped = isAdmin && !taskId ? undefined : taskIds;
      const execScope: SQL | undefined =
        scoped === undefined
          ? undefined
          : scoped.length > 0
            ? inArray(cronTaskExecutions.taskId, scoped)
            : sql`FALSE`;
      // Period KPIs and charts: enabled tasks only unless asked (a disabled
      // task's old failures are not today's health). A single-task view
      // always shows that task.
      const includeDisabled =
        (data.includeDisabled ?? false) || Boolean(taskId);
      const enabledIds = taskRows.filter((r) => r.enabled).map((r) => r.id);
      const kpiScope: SQL | undefined = includeDisabled
        ? execScope
        : enabledIds.length > 0
          ? and(execScope, inArray(cronTaskExecutions.taskId, enabledIds))
          : sql`FALSE`;

      // ── Window ───────────────────────────────────────────────────────────
      const [floorRow] = await db
        .select({ first: min(cronTaskExecutions.startedAt) })
        .from(cronTaskExecutions)
        .where(kpiScope);
      const period = resolveAnalyticsWindow(data, now, floorRow?.first ?? null);
      const cur = inWindowSql(cronTaskExecutions.startedAt, period);
      const prev = inPreviousWindowSql(cronTaskExecutions.startedAt, period);

      // ── KPIs (current + previous period) ────────────────────────────────
      const [k] = await db
        .select({
          runs: sql<number>`count(*) FILTER (WHERE ${cur})::int`,
          done: sql<number>`count(*) FILTER (WHERE ${cur} AND ${isCompletedSql})::int`,
          failed: sql<number>`count(*) FILTER (WHERE ${cur} AND ${isFailedSql})::int`,
          p50: sql<
            string | null
          >`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${cur} AND ${measuredSql})`,
          p95: sql<
            string | null
          >`percentile_cont(0.95) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${cur} AND ${measuredSql})`,
          timedOut: sql<number>`count(*) FILTER (WHERE ${cur} AND ${isTimeoutSql})::int`,
          pTimedOut: sql<number>`count(*) FILTER (WHERE ${prev} AND ${isTimeoutSql})::int`,
          pRuns: sql<number>`count(*) FILTER (WHERE ${prev})::int`,
          pDone: sql<number>`count(*) FILTER (WHERE ${prev} AND ${isCompletedSql})::int`,
          pFailed: sql<number>`count(*) FILTER (WHERE ${prev} AND ${isFailedSql})::int`,
          pP50: sql<
            string | null
          >`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${prev} AND ${measuredSql})`,
          pP95: sql<
            string | null
          >`percentile_cont(0.95) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${prev} AND ${measuredSql})`,
        })
        .from(cronTaskExecutions)
        .where(and(kpiScope, or(cur, prev)));

      const hasPrevious = period.previousFrom !== null;
      const kpi = (value: number | null, previous: number | null): Kpi => ({
        value: value ?? 0,
        previous: hasPrevious ? previous : null,
      });
      const runs = Number(k?.runs ?? 0);
      const done = Number(k?.done ?? 0);
      const failed = Number(k?.failed ?? 0);
      const pRuns = Number(k?.pRuns ?? 0);
      const pDone = Number(k?.pDone ?? 0);
      const pFailed = Number(k?.pFailed ?? 0);

      // ── Trend per bucket ────────────────────────────────────────────────
      const bucketExpr = bucketSql(cronTaskExecutions.startedAt, period.bucket);
      const trendRows = await db
        .select({
          bucket: bucketExpr,
          runs: sql<number>`count(*)::int`,
          done: sql<number>`count(*) FILTER (WHERE ${isCompletedSql})::int`,
          failed: sql<number>`count(*) FILTER (WHERE ${isFailedSql})::int`,
          p50: sql<
            string | null
          >`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${measuredSql})`,
          p95: sql<
            string | null
          >`percentile_cont(0.95) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${measuredSql})`,
        })
        .from(cronTaskExecutions)
        .where(and(kpiScope, cur))
        .groupBy(sql`1`);
      const byBucket = new Map(trendRows.map((r) => [r.bucket, r]));
      const buckets = period.buckets;
      const countSeries = (
        pick: (r: (typeof trendRows)[number]) => number,
      ): number[] =>
        buckets.map((key) => {
          const row = byBucket.get(key);
          return row ? pick(row) : 0;
        });
      const rateByBucket = new Map(
        trendRows.map((r) => [
          r.bucket,
          ratio(Number(r.done), Number(r.failed)),
        ]),
      );
      const p50ByBucket = new Map(trendRows.map((r) => [r.bucket, num(r.p50)]));
      const p95ByBucket = new Map(trendRows.map((r) => [r.bucket, num(r.p95)]));

      // ── Per task in period ──────────────────────────────────────────────
      const perTask = await db
        .select({
          taskId: cronTaskExecutions.taskId,
          runs: sql<number>`count(*)::int`,
          done: sql<number>`count(*) FILTER (WHERE ${isCompletedSql})::int`,
          failed: sql<number>`count(*) FILTER (WHERE ${isFailedSql})::int`,
          p50: sql<
            string | null
          >`percentile_cont(0.5) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${measuredSql})`,
          p95: sql<
            string | null
          >`percentile_cont(0.95) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${measuredSql})`,
        })
        .from(cronTaskExecutions)
        .where(and(execScope, cur))
        .groupBy(cronTaskExecutions.taskId);
      const statsByTask = new Map(perTask.map((r) => [r.taskId, r]));

      // Per task and bucket: success-rate trend for the table sparklines.
      const perTaskBuckets = await db
        .select({
          taskId: cronTaskExecutions.taskId,
          bucket: bucketExpr,
          done: sql<number>`count(*) FILTER (WHERE ${isCompletedSql})::int`,
          failed: sql<number>`count(*) FILTER (WHERE ${isFailedSql})::int`,
          p95: sql<
            string | null
          >`percentile_cont(0.95) WITHIN GROUP (ORDER BY ${dur}) FILTER (WHERE ${measuredSql})`,
        })
        .from(cronTaskExecutions)
        .where(and(execScope, cur))
        .groupBy(cronTaskExecutions.taskId, sql`2`);
      const rateByTaskBucket = new Map<string, Map<string, number | null>>();
      const p95ByTaskBucket = new Map<string, Map<string, number | null>>();
      for (const row of perTaskBuckets) {
        const durKey =
          p95ByTaskBucket.get(row.taskId) ?? new Map<string, number | null>();
        durKey.set(row.bucket, num(row.p95));
        p95ByTaskBucket.set(row.taskId, durKey);
        const byKey =
          rateByTaskBucket.get(row.taskId) ?? new Map<string, number | null>();
        byKey.set(row.bucket, ratio(Number(row.done), Number(row.failed)));
        rateByTaskBucket.set(row.taskId, byKey);
      }
      // Failed runs by task (top 5 + other): shows where a spike came from.
      const kpiTaskIds = new Set(includeDisabled ? taskIds : enabledIds);
      const failedByTask = new Map<string, Map<string, number>>();
      for (const row of perTaskBuckets) {
        if (!kpiTaskIds.has(row.taskId) || Number(row.failed) === 0) {
          continue;
        }
        const byKey = failedByTask.get(row.taskId) ?? new Map<string, number>();
        byKey.set(row.bucket, Number(row.failed));
        failedByTask.set(row.taskId, byKey);
      }
      const ranked = [...failedByTask.entries()].toSorted(
        (a, b) => totalFailed(b[1]) - totalFailed(a[1]),
      );
      const top = ranked.slice(0, TOP_FAILING_TASKS);
      const rest = ranked.slice(TOP_FAILING_TASKS);
      const failuresByTask = {
        buckets,
        series: [
          ...top.map(([id, byKey]) => ({
            key: id,
            values: buckets.map((key) => byKey.get(key) ?? 0),
          })),
          ...(rest.length > 0
            ? [
                {
                  key: OTHER_SERIES_KEY,
                  values: buckets.map((key) =>
                    rest.reduce(
                      (sum, [, byKey]) => sum + (byKey.get(key) ?? 0),
                      0,
                    ),
                  ),
                },
              ]
            : []),
        ],
      };

      const ranTaskIds = perTask
        .filter((r) => kpiTaskIds.has(r.taskId) && Number(r.runs) > 0)
        .map((r) => r.taskId);
      const tasksWithFailures = {
        value: ranTaskIds.filter((id) => (failedByTask.get(id)?.size ?? 0) > 0)
          .length,
        total: ranTaskIds.length,
      };

      const successTrendOf = (id: string): number[] => {
        const byKey = rateByTaskBucket.get(id);
        return byKey ? withData(buckets, byKey) : [];
      };

      // Last runs of a single task (task view).
      const recentRuns = taskId
        ? (
            await db
              .select({
                executionId: cronTaskExecutions.executionId,
                startedAt: cronTaskExecutions.startedAt,
                status: cronTaskExecutions.status,
                durationMs: cronTaskExecutions.durationMs,
                message: sql<
                  string | null
                >`${cronTaskExecutions.error}->>'message'`,
              })
              .from(cronTaskExecutions)
              .where(eq(cronTaskExecutions.taskId, taskId))
              .orderBy(desc(cronTaskExecutions.startedAt))
              .limit(RECENT_RUNS)
          ).map((r) => ({
            executionId: r.executionId,
            startedAt: r.startedAt.toISOString(),
            status: r.status,
            durationMs:
              r.status === CronTaskStatus.TIMEOUT ? null : r.durationMs,
            error: r.message?.replaceAll(/\s+/g, " ").trim() || null,
          }))
        : [];

      // In-flight run of a single task (pinned on top of its last runs).
      const focusRow = taskId ? taskRows[0] : undefined;
      const focusStart = focusRow ? runStartOf(focusRow) : null;
      const inFlight =
        focusRow && focusStart
          ? {
              startedAt: focusStart.toISOString(),
              limitMs: stuckAfterMs(focusRow),
              timeoutMs: focusRow.timeout ?? DEFAULT_TASK_TIMEOUT_MS,
              stuck: isStuckTask(focusRow, now),
              executionId:
                (
                  await db
                    .select({ id: cronTaskExecutions.executionId })
                    .from(cronTaskExecutions)
                    .where(
                      and(
                        eq(cronTaskExecutions.taskId, focusRow.id),
                        eq(cronTaskExecutions.status, CronTaskStatus.RUNNING),
                      ),
                    )
                    .orderBy(desc(cronTaskExecutions.startedAt))
                    .limit(1)
                )[0]?.id ?? null,
            }
          : null;

      // Recovering check: tasks with failures in the period whose last
      // RECOVERY_RUNS finished runs all completed.
      const finishedStatuses = [
        CronTaskStatus.COMPLETED,
        ...FAILED_TASK_STATUSES,
      ];
      const candidates = [...statsByTask.entries()]
        .filter(([, st]) => Number(st.failed) > 0)
        .map(([id]) => id);
      const recentOk = new Map<string, boolean>(
        await Promise.all(
          candidates.map(async (id): Promise<[string, boolean]> => {
            const last = await db
              .select({ status: cronTaskExecutions.status })
              .from(cronTaskExecutions)
              .where(
                and(
                  eq(cronTaskExecutions.taskId, id),
                  inArray(cronTaskExecutions.status, finishedStatuses),
                ),
              )
              .orderBy(desc(cronTaskExecutions.startedAt))
              .limit(RECOVERY_RUNS);
            return [
              id,
              last.length === RECOVERY_RUNS &&
                last.every((r) => r.status === CronTaskStatus.COMPLETED),
            ];
          }),
        ),
      );

      // ── Classify every task ─────────────────────────────────────────────
      const windowRuns = (id: string): TaskWindowRuns => {
        const stats = statsByTask.get(id);
        return {
          completed: Number(stats?.done ?? 0),
          failed: Number(stats?.failed ?? 0),
          recentAllOk: recentOk.get(id) ?? false,
        };
      };
      // Parked tasks (done one-offs, never-run disabled) are noise unless asked for.
      const includeParked = data.includeParked ?? false;
      const parkedCount = taskRows.filter((row) =>
        isParkedTask(row, now),
      ).length;
      const visibleRows =
        includeParked || taskId
          ? taskRows
          : taskRows.filter((row) => !isParkedTask(row, now));
      const failuresOf = (id: string): number => windowRuns(id).failed;
      const classifyAndSort = (
        rows: typeof taskRows,
      ): Array<{
        row: (typeof taskRows)[number];
        state: typeof TaskHealthValue;
      }> =>
        rows
          .map((row) => ({
            row,
            state: classifyTaskHealth(row, now, windowRuns(row.id)),
          }))
          .toSorted(
            (a, b) =>
              TASK_HEALTH_RANK[a.state] - TASK_HEALTH_RANK[b.state] ||
              failuresOf(b.row.id) - failuresOf(a.row.id) ||
              nameOf(a.row).localeCompare(nameOf(b.row)),
          );
      const classified = classifyAndSort(visibleRows);

      const summary = {
        total: visibleRows.length,
        enabled: visibleRows.filter((r) => r.enabled).length,
        failing: 0,
        stuck: 0,
        overdue: 0,
        flaky: 0,
        recovering: 0,
        lowData: 0,
        running: 0,
        neverRan: 0,
        disabled: 0,
        healthy: 0,
        orphanedRuns: 0,
        parked: parkedCount,
        parkedShown: includeParked,
      };
      for (const { row, state } of classified) {
        if (isOrphanedRun(row, now)) {
          summary.orphanedRuns += 1;
        }
        switch (state) {
          case TaskHealth.FAILING:
            summary.failing += 1;
            break;
          case TaskHealth.STUCK:
            summary.stuck += 1;
            break;
          case TaskHealth.OVERDUE:
            summary.overdue += 1;
            break;
          case TaskHealth.FLAKY:
            summary.flaky += 1;
            break;
          case TaskHealth.LOW_DATA:
            summary.lowData += 1;
            break;
          case TaskHealth.RECOVERING:
            summary.recovering += 1;
            break;
          case TaskHealth.RUNNING:
            summary.running += 1;
            break;
          case TaskHealth.NEVER_RAN:
            summary.neverRan += 1;
            break;
          case TaskHealth.DISABLED:
            summary.disabled += 1;
            break;
          default:
            summary.healthy += 1;
        }
      }

      // The watchdog decides stuck runs; if it is unhealthy itself, other
      // stuck/overdue verdicts may be stale.
      const watchdogRow = taskRows.find((r) => r.id === TASK_WATCHDOG_SELF_ID);
      const watchdogState = watchdogRow
        ? classifyTaskHealth(watchdogRow, now, windowRuns(watchdogRow.id))
        : null;
      const watchdog =
        watchdogRow &&
        watchdogState &&
        [
          TaskHealth.STUCK,
          TaskHealth.FAILING,
          TaskHealth.OVERDUE,
          TaskHealth.DISABLED,
        ].some((st) => st === watchdogState)
          ? { id: watchdogRow.id, state: watchdogState }
          : null;

      // ── Attention list (+ last error per task) ──────────────────────────
      const attentionRows = classified.filter(({ state }) =>
        ATTENTION_HEALTH.some((s) => s === state),
      );
      const attentionIds = attentionRows.map(({ row }) => row.id);
      const lastErrors =
        attentionIds.length > 0
          ? await db
              .selectDistinctOn([cronTaskExecutions.taskId], {
                taskId: cronTaskExecutions.taskId,
                message: sql<
                  string | null
                >`${cronTaskExecutions.error}->>'message'`,
              })
              .from(cronTaskExecutions)
              .where(
                and(
                  inArray(cronTaskExecutions.taskId, attentionIds),
                  sql`${isFailedSql}`,
                ),
              )
              .orderBy(
                cronTaskExecutions.taskId,
                desc(cronTaskExecutions.startedAt),
              )
          : [];
      const errorByTask = new Map(lastErrors.map((e) => [e.taskId, e.message]));

      const attention: CronHealthAttentionTask[] = attentionRows.map(
        ({ row, state }) => {
          const start = runStartOf(row);
          const due =
            state === TaskHealth.OVERDUE ? lastDueFire(row, now) : null;
          const inWindow = windowRuns(row.id);
          return {
            id: row.id,
            displayName: nameOf(row),
            state,
            enabled: row.enabled,
            lastStatus: row.lastExecutionStatus,
            lastRunAt: row.lastExecutedAt?.toISOString() ?? null,
            runStartedAt: start?.toISOString() ?? null,
            dueAt: due?.toISOString() ?? null,
            timeoutMs: row.timeout ?? DEFAULT_TASK_TIMEOUT_MS,
            stuckAfterMs: stuckAfterMs(row),
            consecutiveFailures: row.consecutiveFailures,
            failuresInWindow: inWindow.failed,
            finishedInWindow: inWindow.completed + inWindow.failed,
            successRate: ratio(inWindow.completed, inWindow.failed),
            lastError: errorByTask.get(row.id)?.trim() || null,
          };
        },
      );

      // ── Task table (state filter, server-side) ──────────────────────────
      const filter = data.health ?? TaskHealthFilter.ALL;
      const tableRows =
        filter === TaskHealthFilter.WITH_FAILURES
          ? classifyAndSort(
              taskRows.filter(
                (r) => kpiTaskIds.has(r.id) && failuresOf(r.id) > 0,
              ),
            )
          : classified.filter(({ state }) => matchesFilter(state, filter));
      const tasks: CronHealthTaskRow[] = tableRows.map(({ row, state }) => {
        const s = statsByTask.get(row.id);
        const inWindow = windowRuns(row.id);
        const start = runStartOf(row);
        return {
          id: row.id,
          displayName: nameOf(row),
          state,
          enabled: row.enabled,
          oneOff: isOneOffTask(row),
          blockedByRun:
            row.enabled && row.lastExecutionStatus === CronTaskStatus.RUNNING,
          orphanedRunSince: isOrphanedRun(row, now)
            ? (start?.toISOString() ?? null)
            : null,
          schedule: row.schedule,
          scheduleLabel: formatCronScheduleShort(
            row.schedule,
            row.timezone ?? "UTC",
            locale,
            logger,
          ),
          lastStatus: row.lastExecutionStatus,
          lastRunAt: row.lastExecutedAt?.toISOString() ?? null,
          // A running task cannot start its next run until this one ends.
          nextRunAt:
            row.lastExecutionStatus === CronTaskStatus.RUNNING
              ? null
              : (nextFire(row, now)?.toISOString() ?? null),
          runs: Number(s?.runs ?? 0),
          failures: inWindow.failed,
          successRate: ratio(inWindow.completed, inWindow.failed),
          p50DurationMs: num(s?.p50),
          p95DurationMs: num(s?.p95),
          runStartedAt: start?.toISOString() ?? null,
          successTrend: successTrendOf(row.id),
          durationTrend: withData(
            buckets,
            p95ByTaskBucket.get(row.id) ?? new Map<string, number | null>(),
          ),
        };
      });

      return success({
        generatedAt: now.toISOString(),
        window: serializeWindow(period),
        summary,
        kpis: {
          runs: kpi(runs, pRuns),
          failedRuns: kpi(failed, pFailed),
          successRate: kpi(ratio(done, failed), ratio(pDone, pFailed)),
          p50DurationMs: kpi(num(k?.p50), num(k?.pP50)),
          p95DurationMs: kpi(num(k?.p95), num(k?.pP95)),
          timedOutRuns: kpi(
            Number(k?.timedOut ?? 0),
            Number(k?.pTimedOut ?? 0),
          ),
        },
        runsTrend: {
          buckets,
          series: [
            { key: "completed", values: countSeries((r) => Number(r.done)) },
            { key: "failed", values: countSeries((r) => Number(r.failed)) },
            {
              key: "other",
              values: countSeries(
                (r) => Number(r.runs) - Number(r.done) - Number(r.failed),
              ),
            },
          ],
        },
        successTrend: {
          buckets,
          series: [
            {
              key: "successRate",
              values: gapFill(buckets, rateByBucket),
            },
          ],
        },
        durationTrend: {
          buckets,
          series: [
            { key: "p50", values: gapFill(buckets, p50ByBucket) },
            { key: "p95", values: gapFill(buckets, p95ByBucket) },
          ],
        },
        attention,
        tasks,
        recentRuns,
        inFlight,
        watchdog,
        failuresByTask,
        tasksWithFailures,
        disabledIncluded: includeDisabled,
        dayTables: data.days ?? false,
        taskOptions: taskRows
          .map((r) => ({ id: r.id, name: nameOf(r) }))
          .toSorted((a, b) => a.name.localeCompare(b.name)),
      });
    } catch (error) {
      const parsed = parseError(error);
      logger.error("Failed to load task health", parsed);
      return fail({
        message: t("errors.fetchCronTaskStats", { error: parsed.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
