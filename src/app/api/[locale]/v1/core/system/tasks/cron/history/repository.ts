/**
 * Cron Task History Repository
 * Data access layer for task execution history following MIGRATION_GUIDE.md patterns
 */

import "server-only";

import { and, avg, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";

import { cronTaskExecutions, cronTasks } from "../../db";
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
        const statusFilter = data.status
          .split(",")
          .map((s) =>
            s.trim(),
          ) as (typeof CronTaskStatus)[keyof typeof CronTaskStatus][];
        if (statusFilter.length > 0) {
          conditions.push(inArray(cronTaskExecutions.status, statusFilter));
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
          environment: cronTaskExecutions.executionEnvironment,
          createdAt: cronTaskExecutions.createdAt,
        })
        .from(cronTaskExecutions)
        .leftJoin(cronTasks, eq(cronTaskExecutions.taskId, cronTasks.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
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
        const priorityFilter = data.priority
          .split(",")
          .map((p) =>
            p.trim(),
          ) as (typeof CronTaskPriority)[keyof typeof CronTaskPriority][];
        if (priorityFilter.length > 0) {
          executions = executions.filter(
            (exec) => exec.priority && priorityFilter.includes(exec.priority),
          );
        }
      }

      // Get total count
      const [countResult] = await db
        .select({ count: count() })
        .from(cronTaskExecutions)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

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
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      const successRate =
        statsResult && statsResult.totalExecutions > 0
          ? Math.round(
              (Number(statsResult.successfulExecutions) /
                Number(statsResult.totalExecutions)) *
                100,
            )
          : 0;

      logger.info(
        t("app.api.v1.core.system.tasks.cron.history.get.log.fetchSuccess", {
          count: executions.length,
        }),
      );

      return createSuccessResponse({
        executions: executions.map((exec) => ({
          id: exec.id,
          taskId: exec.taskId,
          taskName:
            exec.taskName ??
            t("app.api.v1.core.system.tasks.cron.history.get.unknownTask"),
          status: exec.status,
          priority: exec.priority ?? CronTaskPriority.MEDIUM,
          startedAt: exec.startedAt.toISOString(),
          completedAt: exec.completedAt?.toISOString() ?? null,
          durationMs: exec.durationMs,
          error: exec.error as {
            message: string;
            messageParams?: Record<string, string | number | boolean>;
            errorType: string;
          } | null,
          environment: exec.environment,
          createdAt: exec.createdAt.toISOString(),
        })),
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
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task history", {
        taskId: data.taskId,
        limit: data.limit,
        offset: data.offset,
        error: parsedError.message,
      });

      return createErrorResponse(
        "common.cronRepositoryExecutionsFetchFailed",
        ErrorResponseTypes.INTERNAL_ERROR,
        {
          error: parsedError.message,
          taskId: data.taskId || "unknown",
          limit: data.limit || 50,
        },
      );
    }
  }
}

// Export singleton instance
export const cronHistoryRepository = new CronHistoryRepositoryImpl();
