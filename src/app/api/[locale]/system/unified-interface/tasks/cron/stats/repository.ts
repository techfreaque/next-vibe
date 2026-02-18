/**
 * Cron Stats Repository
 * Business logic for cron task statistics and metrics
 */

import "server-only";

import { and, avg, count, desc, eq, gte, max, min, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { CronTaskPriority, CronTaskStatus } from "../../enum";
import { cronTaskExecutions, cronTasks } from "../db";
import type {
  CronStatsGetRequestOutput,
  CronStatsGetResponseOutput,
} from "./definition";

/**
 * Cron Stats Repository Interface
 */
export interface ICronStatsRepository {
  getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatsGetResponseOutput>>;
}

/**
 * Returns the cutoff Date for a given period string
 */
function getPeriodCutoff(period: string): Date {
  const now = new Date();
  switch (period) {
    case "hour":
      return new Date(now.getTime() - 60 * 60 * 1000);
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    default: // "day"
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }
}

/**
 * Cron Stats Repository Implementation
 */
class CronStatsRepositoryImpl implements ICronStatsRepository {
  async getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatsGetResponseOutput>> {
    try {
      logger.debug("Getting cron statistics", {
        data,
        userId: user.isPublic ? "public" : user.id,
      });

      const { period = "day", type = "overview", taskId, limit = 100 } = data;
      const cutoff = getPeriodCutoff(period);

      // Build period condition for execution queries
      const periodCondition = gte(cronTaskExecutions.startedAt, cutoff);
      const taskCondition = taskId
        ? eq(cronTaskExecutions.taskId, taskId)
        : undefined;

      const execConditions = [
        periodCondition,
        ...(taskCondition ? [taskCondition] : []),
      ];

      // === CORE STATS ===
      const [taskCountRow] = await db
        .select({
          totalTasks: count(cronTasks.id),
        })
        .from(cronTasks);

      const [execSummary] = await db
        .select({
          totalExecutions: count(cronTaskExecutions.id),
          successfulExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED} THEN 1 END`,
          ),
          failedExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} IN (${CronTaskStatus.FAILED}, ${CronTaskStatus.TIMEOUT}, ${CronTaskStatus.ERROR}) THEN 1 END`,
          ),
          runningExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.RUNNING} THEN 1 END`,
          ),
          pendingExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.PENDING} THEN 1 END`,
          ),
          avgDuration: avg(cronTaskExecutions.durationMs),
          minDuration: min(cronTaskExecutions.durationMs),
          maxDuration: max(cronTaskExecutions.durationMs),
        })
        .from(cronTaskExecutions)
        .where(and(...execConditions));

      const totalTasks = taskCountRow?.totalTasks ?? 0;
      const totalExecutions = Number(execSummary?.totalExecutions ?? 0);
      const successfulExecutions = Number(
        execSummary?.successfulExecutions ?? 0,
      );
      const failedExecutions = Number(execSummary?.failedExecutions ?? 0);
      const avgDuration = execSummary?.avgDuration
        ? Math.round(Number(execSummary.avgDuration))
        : 0;
      const successRate =
        totalExecutions > 0
          ? Math.round((successfulExecutions / totalExecutions) * 100)
          : 0;
      const failureRate =
        totalExecutions > 0
          ? Math.round((failedExecutions / totalExecutions) * 100)
          : 0;

      // Build the base response
      const responseData: CronStatsGetResponseOutput = {
        totalTasks,
        executedTasks: totalExecutions,
        successfulTasks: successfulExecutions,
        failedTasks: failedExecutions,
        averageExecutionTime: avgDuration,
        totalExecutions,
        executionsLast24h: totalExecutions,
        successRate,
        successfulExecutions,
        failedExecutions,
        failureRate,
        avgExecutionTime: avgDuration,
        minExecutionTime: execSummary?.minDuration ?? 0,
        maxExecutionTime: execSummary?.maxDuration ?? 0,
        runningExecutions: Number(execSummary?.runningExecutions ?? 0),
        pendingExecutions: Number(execSummary?.pendingExecutions ?? 0),
      };

      // === EXTENDED: per-task breakdown ===
      if (type === "overview" || type === "performance" || type === "errors") {
        const perTaskRows = await db
          .select({
            taskName: cronTasks.name,
            priority: cronTasks.priority,
            enabled: cronTasks.enabled,
            executions: count(cronTaskExecutions.id),
            successes: count(
              sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED} THEN 1 END`,
            ),
            failures: count(
              sql`CASE WHEN ${cronTaskExecutions.status} IN (${CronTaskStatus.FAILED}, ${CronTaskStatus.TIMEOUT}, ${CronTaskStatus.ERROR}) THEN 1 END`,
            ),
            avgDur: avg(cronTaskExecutions.durationMs),
          })
          .from(cronTasks)
          .leftJoin(
            cronTaskExecutions,
            and(
              eq(cronTaskExecutions.taskId, cronTasks.id),
              periodCondition,
              ...(taskCondition ? [taskCondition] : []),
            ),
          )
          .groupBy(
            cronTasks.id,
            cronTasks.name,
            cronTasks.priority,
            cronTasks.enabled,
          )
          .orderBy(desc(count(cronTaskExecutions.id)))
          .limit(limit);

        // tasksByPriority — pre-populate all priority keys with 0 so the
        // z.record(z.enum(CronTaskPriority), ...) schema finds every key present
        const tasksByPriority = Object.fromEntries(
          Object.values(CronTaskPriority).map((p) => [p, 0]),
        ) as Record<string, number>;
        for (const row of perTaskRows) {
          if (row.priority in tasksByPriority) {
            tasksByPriority[row.priority] =
              (tasksByPriority[row.priority] ?? 0) + 1;
          }
        }
        responseData.tasksByPriority = tasksByPriority;

        // groupedStats.byTaskName
        const byTaskName = perTaskRows.map((row) => {
          const execs = Number(row.executions);
          const succ = Number(row.successes);
          return {
            taskName: row.taskName,
            executions: execs,
            successes: succ,
            failures: Number(row.failures),
            successRate: execs > 0 ? Math.round((succ / execs) * 100) : 0,
            avgDuration: row.avgDur ? Math.round(Number(row.avgDur)) : 0,
          };
        });

        // topPerformingTasks (highest success rate, ≥1 execution)
        responseData.topPerformingTasks = byTaskName
          .filter((r) => r.executions > 0)
          .toSorted((a, b) => b.successRate - a.successRate)
          .slice(0, 10)
          .map((r) => ({
            taskName: r.taskName,
            executions: r.executions,
            successRate: r.successRate,
            avgDuration: r.avgDuration,
          }));

        // problemTasks (most failures)
        if (type === "errors" || type === "overview") {
          responseData.problemTasks = byTaskName
            .filter((r) => r.failures > 0)
            .toSorted((a, b) => b.failures - a.failures)
            .slice(0, 10)
            .map((r) => ({
              taskName: r.taskName,
              failures: r.failures,
              executions: r.executions,
              failureRate:
                r.executions > 0
                  ? Math.round((r.failures / r.executions) * 100)
                  : 0,
            }));
        }

        responseData.groupedStats = {
          byTaskName,
        };

        // taskStats per-name record
        const taskStats: CronStatsGetResponseOutput["taskStats"] = {};
        for (const row of perTaskRows) {
          const execs = Number(row.executions);
          const succ = Number(row.successes);
          taskStats[row.taskName] = {
            priority: row.priority,
            healthStatus:
              execs === 0
                ? "unknown"
                : Number(row.failures) > 0
                  ? "degraded"
                  : "healthy",
            successfulExecutions: succ,
            totalExecutions: execs,
            successRate: execs > 0 ? Math.round((succ / execs) * 100) : 0,
            avgDuration: row.avgDur ? Math.round(Number(row.avgDur)) : 0,
            isEnabled: row.enabled,
          };
        }
        responseData.taskStats = taskStats;
      }

      // === TRENDS / DAILY STATS ===
      if (type === "trends" || type === "overview") {
        // Group by calendar day (UTC)
        const dailyRows = await db
          .select({
            date: sql<string>`date_trunc('day', ${cronTaskExecutions.startedAt})::date::text`,
            executions: count(cronTaskExecutions.id),
            successes: count(
              sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED} THEN 1 END`,
            ),
            failures: count(
              sql`CASE WHEN ${cronTaskExecutions.status} IN (${CronTaskStatus.FAILED}, ${CronTaskStatus.TIMEOUT}, ${CronTaskStatus.ERROR}) THEN 1 END`,
            ),
            avgDur: avg(cronTaskExecutions.durationMs),
            uniqueTasks: sql<number>`count(DISTINCT ${cronTaskExecutions.taskId})::int`,
          })
          .from(cronTaskExecutions)
          .where(and(...execConditions))
          .groupBy(
            sql`date_trunc('day', ${cronTaskExecutions.startedAt})::date`,
          )
          .orderBy(
            sql`date_trunc('day', ${cronTaskExecutions.startedAt})::date`,
          );

        responseData.dailyStats = dailyRows.map((row) => ({
          date: row.date,
          executions: Number(row.executions),
          successes: Number(row.successes),
          failures: Number(row.failures),
          avgDuration: row.avgDur ? Math.round(Number(row.avgDur)) : 0,
          uniqueTasks: Number(row.uniqueTasks),
        }));
      }

      // === RECENT ACTIVITY ===
      const recentRows = await db
        .select({
          id: cronTaskExecutions.id,
          taskName: cronTasks.name,
          status: cronTaskExecutions.status,
          startedAt: cronTaskExecutions.startedAt,
          durationMs: cronTaskExecutions.durationMs,
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(and(...execConditions))
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(20);

      responseData.recentActivity = recentRows.map((row) => ({
        id: row.id,
        taskName: row.taskName ?? "unknown",
        status: row.status,
        timestamp: row.startedAt.toISOString(),
        type: "cron",
        duration: row.durationMs ?? undefined,
      }));

      logger.debug("Cron statistics retrieved successfully", {
        totalTasks,
        totalExecutions,
        successRate,
        period,
        type,
      });

      return success(responseData);
    } catch (error) {
      const errorDetails = parseError(error);
      logger.error("Failed to get cron statistics", {
        period: data.period,
        type: data.type,
        taskId: data.taskId,
        error: errorDetails.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: errorDetails.message,
          period: data.period || "day",
          type: data.type || "overview",
          taskId: data.taskId || "unknown",
        },
      });
    }
  }
}

// Export singleton instance
export const cronStatsRepository = new CronStatsRepositoryImpl();
