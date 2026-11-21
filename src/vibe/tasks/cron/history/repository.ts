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

import {
  type CountryLanguage,
  defaultLocale,
} from "../../../core/i18n/core/config";
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
import {
  CronTaskPriorityDB,
  CronTaskStatus,
  CronTaskStatusDB,
} from "../../enum";
import { cronTaskExecutions, cronTasks } from "../db";
import { translateTaskNames } from "../task-names";
import { CRON_HISTORY_PAGE_SIZE } from "./constants";
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
    locale: CountryLanguage = defaultLocale,
  ): Promise<ResponseType<CronHistoryResponseOutput>> {
    const limit = data.limit || CRON_HISTORY_PAGE_SIZE;

    try {
      logger.debug("Fetching task execution history", { filters: data });

      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      const offset = data.offset ?? 0;

      // Base conditions (applied to all queries including status counts)
      const baseConditions = [];

      // Filter executions to only those belonging to the user's tasks (unless admin)
      if (!isAdmin) {
        if (userId) {
          baseConditions.push(eq(cronTasks.userId, userId));
        } else {
          // Public users see nothing
          baseConditions.push(
            eq(cronTaskExecutions.id, "00000000-0000-0000-0000-000000000000"),
          );
        }
      }

      if (data?.taskId) {
        // An explicit task drill-down (e.g. from Task Health) shows every run,
        // hidden system tasks included.
        baseConditions.push(eq(cronTaskExecutions.taskId, data.taskId));
      } else {
        // Unscoped lists hide hidden tasks, UNLESS they failed (so errors are never silently hidden)
        baseConditions.push(
          or(
            eq(cronTasks.hidden, false),
            inArray(cronTaskExecutions.status, [
              CronTaskStatus.FAILED,
              CronTaskStatus.TIMEOUT,
              CronTaskStatus.ERROR,
            ]),
          ),
        );
      }

      const taskName = data.taskName?.trim();
      if (taskName) {
        const pattern = `%${taskName.replace(/[\\%_]/g, "\\$&")}%`;
        baseConditions.push(
          or(
            ilike(cronTasks.displayName, pattern),
            ilike(cronTasks.routeId, pattern),
            ilike(cronTaskExecutions.taskName, pattern),
          ),
        );
      }

      if (data?.priority) {
        const priorityStrings = data.priority.split(",").map((p) => p.trim());
        const priorities = CronTaskPriorityDB.filter((priority) =>
          priorityStrings.includes(priority),
        );
        if (priorities.length > 0) {
          baseConditions.push(inArray(cronTaskExecutions.priority, priorities));
        }
      }

      if (data.startDate && !Number.isNaN(data.startDate.getTime())) {
        baseConditions.push(gte(cronTaskExecutions.startedAt, data.startDate));
      }

      if (data.endDate && !Number.isNaN(data.endDate.getTime())) {
        baseConditions.push(lte(cronTaskExecutions.startedAt, data.endDate));
      }

      // Full conditions including status filter (for executions list + count + stats)
      const conditions = [...baseConditions];

      if (data?.status) {
        // Handle string status filter
        const statusStrings = data.status.split(",").map((s) => s.trim());
        // Validate each status string is a valid CronTaskStatus
        const validStatuses = CronTaskStatusDB.filter((status) =>
          statusStrings.includes(status),
        );
        if (validStatuses.length > 0) {
          conditions.push(inArray(cronTaskExecutions.status, validStatuses));
        }
      }

      // Query executions with task info
      const executionsQuery = db
        .select({
          id: cronTaskExecutions.id,
          taskId: cronTaskExecutions.taskId,
          taskName: cronTaskExecutions.taskName,
          taskDisplayName: cronTasks.displayName,
          taskRouteId: cronTasks.routeId,
          status: cronTaskExecutions.status,
          priority: cronTaskExecutions.priority,
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
        .orderBy(
          desc(cronTaskExecutions.startedAt),
          desc(cronTaskExecutions.id),
        )
        .limit(limit)
        .offset(offset);

      const executions = await executionsQuery;

      const [selectedTask] =
        data.taskId && (isAdmin || userId)
          ? await db
              .select({
                id: cronTasks.id,
                name: cronTasks.displayName,
                routeId: cronTasks.routeId,
              })
              .from(cronTasks)
              .where(
                and(
                  eq(cronTasks.id, data.taskId),
                  isAdmin || !userId ? undefined : eq(cronTasks.userId, userId),
                ),
              )
              .limit(1)
          : [];

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

      const totalCount = statsResult?.totalExecutions ?? 0;

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

      const names = await translateTaskNames(
        [
          ...executions.flatMap((exec) =>
            exec.taskDisplayName && exec.taskRouteId
              ? [
                  {
                    id: exec.taskId,
                    routeId: exec.taskRouteId,
                    displayName: exec.taskDisplayName,
                  },
                ]
              : [],
          ),
          ...(selectedTask
            ? [
                {
                  id: selectedTask.id,
                  routeId: selectedTask.routeId,
                  displayName: selectedTask.name,
                },
              ]
            : []),
        ],
        locale,
      );

      // Database already returns correct enum types, no parsing needed
      const response: CronHistoryResponseOutput = {
        executions: executions.map((exec) => {
          const execution: CronHistoryExecution = {
            id: exec.id,
            taskId: exec.taskId,
            taskName: exec.taskName,
            taskDisplayName: names.get(exec.taskId) ?? undefined,
            status: exec.status,
            priority: exec.priority,
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
        selectedTask: selectedTask
          ? {
              id: selectedTask.id,
              name: names.get(selectedTask.id) ?? selectedTask.name,
            }
          : undefined,
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
