/**
 * Cron Task History Repository
 * Data access layer for task execution history following MIGRATION_GUIDE.md patterns
 */

import "server-only";

import {
  and,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  sql,
} from "drizzle-orm";

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
import { CronTaskPriority, CronTaskStatus } from "../../enum";
import { cronTaskExecutions, cronTasks } from "../db";
import type {
  CronHistoryExecution,
  CronHistoryRequestOutput,
  CronHistoryResponseOutput,
} from "./definition";
import type { CronHistoryT } from "./i18n";

/**
 * Repository implementation
 */
export class CronHistoryRepository {
  static async getTaskHistory(
    data: CronHistoryRequestOutput,
    user: JwtPayloadType,
    t: CronHistoryT,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronHistoryResponseOutput>> {
    // Hoisted above the try so the catch can report the limit it attempted.
    const limit =
      data?.limit && Number(data.limit) > 0 ? Number(data.limit) : 50;

    try {
      logger.debug("Fetching task execution history", { filters: data });

      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      const offset = data?.offset ? Number(data.offset) : 0;

      // Base conditions (applied to all queries including status counts)
      const baseConditions = [];

      // Filter executions to only those belonging to the user's tasks (unless admin)
      // Use correlated subqueries to avoid referencing the joined table in WHERE,
      // which causes Drizzle to drop the LEFT JOIN from count/stats queries.
      if (!isAdmin) {
        if (userId) {
          baseConditions.push(
            sql`EXISTS (SELECT 1 FROM ${cronTasks} WHERE ${cronTasks.id} = ${cronTaskExecutions.taskId} AND ${cronTasks.userId} = ${userId})`,
          );
        } else {
          // Public users see nothing
          baseConditions.push(
            eq(cronTaskExecutions.id, "00000000-0000-0000-0000-000000000000"),
          );
        }
      }

      // Hidden tasks are excluded from history, UNLESS they failed (so errors are never silently hidden)
      // Use a correlated subquery to avoid referencing the joined table in WHERE,
      // which causes Drizzle to drop the LEFT JOIN from count/stats queries.
      baseConditions.push(
        or(
          sql`EXISTS (SELECT 1 FROM ${cronTasks} WHERE ${cronTasks.id} = ${cronTaskExecutions.taskId} AND ${cronTasks.hidden} = false)`,
          inArray(cronTaskExecutions.status, [
            CronTaskStatus.FAILED,
            CronTaskStatus.TIMEOUT,
            CronTaskStatus.ERROR,
          ]),
        ),
      );

      if (data?.taskId) {
        baseConditions.push(eq(cronTaskExecutions.taskId, data.taskId));
      }

      if (data?.taskName) {
        baseConditions.push(ilike(cronTasks.routeId, `%${data.taskName}%`));
      }

      if (data?.priority) {
        const priorityStrings = data.priority.split(",").map((p) => p.trim());
        if (priorityStrings.length > 0) {
          baseConditions.push(
            inArray(
              cronTasks.priority,
              priorityStrings as (typeof CronTaskPriority)[keyof typeof CronTaskPriority][],
            ),
          );
        }
      }

      if (data?.startDate) {
        baseConditions.push(
          gte(cronTaskExecutions.startedAt, new Date(data.startDate)),
        );
      }

      if (data?.endDate) {
        baseConditions.push(
          lte(cronTaskExecutions.startedAt, new Date(data.endDate)),
        );
      }

      // Full conditions including status filter (for executions list + count + stats)
      const conditions = [...baseConditions];

      if (data?.status) {
        // Handle string status filter
        const statusStrings = data.status.split(",").map((s) => s.trim());
        // Validate each status string is a valid CronTaskStatus
        const validStatuses: (typeof CronTaskStatus)[keyof typeof CronTaskStatus][] =
          [];
        for (const statusStr of statusStrings) {
          const statusEnum = Object.values(CronTaskStatus).find(
            (val) => val === statusStr,
          );
          if (statusEnum) {
            validStatuses.push(statusEnum);
          }
        }
        if (validStatuses.length > 0) {
          conditions.push(inArray(cronTaskExecutions.status, validStatuses));
        }
      }

      // Query executions with task info
      const executionsQuery = db
        .select({
          id: cronTaskExecutions.id,
          taskId: cronTaskExecutions.taskId,
          taskName: cronTasks.routeId,
          status: cronTaskExecutions.status,
          priority: cronTasks.priority,
          startedAt: cronTaskExecutions.startedAt,
          completedAt: cronTaskExecutions.completedAt,
          durationMs: cronTaskExecutions.durationMs,
          error: cronTaskExecutions.error,
          result: cronTaskExecutions.result,
          environment: cronTaskExecutions.environment,
          createdAt: cronTaskExecutions.createdAt,
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit)
        .offset(offset);

      const executions = await executionsQuery;

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(cronTaskExecutions)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const totalCount = countResult?.count ?? 0;

      // Calculate summary statistics (against full conditions including status filter)
      const [statsResult] = await db
        .select({
          totalExecutions: count(),
          successfulExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED} THEN 1 END`,
          ),
          failedExecutions: count(
            sql`CASE WHEN ${cronTaskExecutions.status} IN (${CronTaskStatus.FAILED}, ${CronTaskStatus.TIMEOUT}, ${CronTaskStatus.ERROR}) THEN 1 END`,
          ),
          averageDuration: avg(cronTaskExecutions.durationMs),
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      // Status counts against base conditions (no status filter) for accurate chip counts
      const [statusCountsResult] = await db
        .select({
          all: count(),
          running: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.RUNNING} THEN 1 END`,
          ),
          completed: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.COMPLETED} THEN 1 END`,
          ),
          failed: count(
            sql`CASE WHEN ${cronTaskExecutions.status} IN (${CronTaskStatus.FAILED}, ${CronTaskStatus.ERROR}) THEN 1 END`,
          ),
          timeout: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.TIMEOUT} THEN 1 END`,
          ),
          cancelled: count(
            sql`CASE WHEN ${cronTaskExecutions.status} = ${CronTaskStatus.CANCELLED} THEN 1 END`,
          ),
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(baseConditions.length > 0 ? and(...baseConditions) : undefined);

      const successRate =
        statsResult && statsResult.totalExecutions > 0
          ? Math.round(
              (Number(statsResult.successfulExecutions) /
                Number(statsResult.totalExecutions)) *
                100,
            )
          : 0;

      logger.info(
        `Fetched ${executions.length.toString()} cron task execution records`,
      );

      // Database already returns correct enum types, no parsing needed
      const response: CronHistoryResponseOutput = {
        executions: executions.map((exec) => {
          const execution: CronHistoryExecution = {
            id: exec.id,
            taskId: exec.taskId,
            taskName: exec.taskName ?? t("errors.cronTaskNotFound"),
            status: exec.status,
            priority: exec.priority ?? CronTaskPriority.MEDIUM,
            startedAt: exec.startedAt.toISOString(),
            completedAt: exec.completedAt?.toISOString() ?? null,
            durationMs: exec.durationMs,
            error: exec.error
              ? fail({
                  // The stored message was already interpolated when the
                  // execution failed, so it needs no params alongside it.
                  message:
                    exec.error?.message ?? t("errors.repositoryInternalError"),
                  errorType:
                    exec.error?.errorType ?? ErrorResponseTypes.INTERNAL_ERROR,
                })
              : null,
            result: exec.result ?? null,
            environment: exec.environment,
            createdAt: exec.createdAt.toISOString(),
          };
          return execution;
        }),
        totalCount,
        hasMore: totalCount > offset + limit,
        statusCounts: {
          all: Number(statusCountsResult?.all ?? 0),
          running: Number(statusCountsResult?.running ?? 0),
          completed: Number(statusCountsResult?.completed ?? 0),
          failed: Number(statusCountsResult?.failed ?? 0),
          timeout: Number(statusCountsResult?.timeout ?? 0),
          cancelled: Number(statusCountsResult?.cancelled ?? 0),
        },
        summary: {
          totalExecutions: Number(statsResult?.totalExecutions ?? 0),
          successfulExecutions: Number(statsResult?.successfulExecutions ?? 0),
          failedExecutions: Number(statsResult?.failedExecutions ?? 0),
          averageDuration: statsResult?.averageDuration
            ? Math.round(Number(statsResult.averageDuration))
            : null,
          successRate,
        },
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task history", {
        taskId: data.taskId,
        limit: data.limit,
        offset: data.offset,
        error: parsedError.message,
      });

      // taskId is an optional filter, so the unfiltered case gets its own key
      // rather than an untranslatable "unknown" placeholder.
      return fail({
        message: data.taskId
          ? t("errors.fetchCronTaskHistoryDetail", {
              taskId: data.taskId,
              limit,
              error: parsedError.message,
            })
          : t("errors.fetchCronTaskHistoryAllDetail", {
              limit,
              error: parsedError.message,
            }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

// Export singleton instance
