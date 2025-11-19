/**
 * Cron Task History Repository
 * Data access layer for task execution history following MIGRATION_GUIDE.md patterns
 */

import "server-only";

import { and, avg, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { cronTaskExecutions, cronTasks } from "../../cron/db";
import { CronTaskPriority, CronTaskStatus } from "../../enum";
import type {
  CronHistoryRequestOutput,
  CronHistoryResponseOutput,
} from "./definition";

/**
 * Repository interface
 */
export interface CronHistoryRepository {
  getTaskHistory(
    data: CronHistoryRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronHistoryResponseOutput>>;
}

/**
 * Repository implementation
 */
export class CronHistoryRepositoryImpl implements CronHistoryRepository {
  async getTaskHistory(
    data: CronHistoryRequestOutput,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronHistoryResponseOutput>> {
    const { t } = simpleT(locale);

    try {
      logger.debug("Fetching task execution history", { filters: data });

      // Parse pagination with type safety
      const limit = data?.limit ? parseInt(data.limit, 10) : 50;
      const offset = data?.offset ? parseInt(data.offset, 10) : 0;

      // Build conditions
      const conditions = [];

      if (data?.taskId) {
        conditions.push(eq(cronTaskExecutions.taskId, data.taskId));
      }

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
        if (validStatuses.length) {
          conditions.push(inArray(cronTaskExecutions.status, validStatuses));
        }
      }

      if (data?.startDate) {
        conditions.push(
          gte(cronTaskExecutions.startedAt, new Date(data.startDate)),
        );
      }

      if (data?.endDate) {
        conditions.push(
          lte(cronTaskExecutions.startedAt, new Date(data.endDate)),
        );
      }

      // Query executions with task info
      const executionsQuery = db
        .select({
          id: cronTaskExecutions.id,
          taskId: cronTaskExecutions.taskId,
          taskName: cronTasks.name,
          status: cronTaskExecutions.status,
          priority: cronTasks.priority,
          startedAt: cronTaskExecutions.startedAt,
          completedAt: cronTaskExecutions.completedAt,
          durationMs: cronTaskExecutions.durationMs,
          error: cronTaskExecutions.error,
          environment: cronTaskExecutions.environment,
          createdAt: cronTaskExecutions.createdAt,
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit)
        .offset(offset);

      // Filter by task name if provided
      let executions = await executionsQuery;
      if (data?.taskName) {
        executions = executions.filter((exec) =>
          exec.taskName?.toLowerCase().includes(data.taskName!.toLowerCase()),
        );
      }

      // Filter by priority if provided
      if (data?.priority) {
        // Handle string priority filter
        // Data is already validated through Zod schema, so strings are valid enum values
        const priorityStrings = data.priority.split(",").map((p) => p.trim());
        if (priorityStrings.length) {
          executions = executions.filter((exec) => {
            if (!exec.priority) {
              return false;
            }
            return priorityStrings.includes(String(exec.priority));
          });
        }
      }

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(cronTaskExecutions)
        .where(conditions.length ? and(...conditions) : undefined);

      const totalCount = countResult?.count ?? 0;

      // Calculate summary statistics
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
        .where(conditions.length ? and(...conditions) : undefined);

      const successRate =
        statsResult && statsResult.totalExecutions > 0
          ? Math.round(
              (Number(statsResult.successfulExecutions) /
                Number(statsResult.totalExecutions)) *
                100,
            )
          : 0;

      logger.info(
        t(
          "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.log.fetchSuccess",
          {
            count: executions.length.toString(),
          },
        ),
      );

      // Database already returns correct enum types, no parsing needed
      const response: CronHistoryResponseOutput = {
        executions: executions.map((exec) => {
          const execution: CronHistoryResponseOutput["executions"][number] = {
            id: exec.id,
            taskId: exec.taskId,
            taskName:
              exec.taskName ??
              t(
                "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.unknownTask",
              ),
            status: exec.status,
            priority: exec.priority ?? CronTaskPriority.MEDIUM,
            startedAt: exec.startedAt.toISOString(),
            completedAt: exec.completedAt?.toISOString() ?? null,
            durationMs: exec.durationMs,
            error: exec.error
              ? {
                  message: (exec.error as { message: string }).message,
                  messageParams: (
                    exec.error as { messageParams?: Record<string, string> }
                  ).messageParams,
                  errorType: (exec.error as { errorType: { errorKey: string } })
                    .errorType.errorKey,
                }
              : null,
            environment: exec.environment,
            createdAt: exec.createdAt.toISOString(),
          };
          return execution;
        }),
        totalCount,
        hasMore: totalCount > offset + limit,
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

      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.cronSystem.history.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          taskId: data.taskId || "unknown",
          limit: data.limit || 50,
        },
      });
    }
  }
}

// Export singleton instance
export const cronHistoryRepository = new CronHistoryRepositoryImpl();
