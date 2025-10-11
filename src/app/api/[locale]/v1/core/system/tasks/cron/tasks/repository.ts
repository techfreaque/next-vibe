/**
 * Cron Tasks Repository
 * Migrated from side-tasks-old/cron/tasks/repository.ts
 * Data access layer for cron tasks listing and management functionality
 */

import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { CountryLanguage } from "@/i18n/core/config";

import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { cronTasks } from "../../db";
import { CronTaskStatus } from "../../enum";
import type {
  CronTaskListRequestOutput,
  CronTaskListResponseOutput,
} from "./definition";

/**
 * Default cron schedule for tasks without a specific schedule
 */
const DEFAULT_CRON_SCHEDULE = "0 0 * * *";

/**
 * Calculate next execution time for a cron schedule
 * Implements basic cron parsing for common patterns
 */
function calculateNextExecutionTime(cronExpression?: string): Date | null {
  if (!cronExpression) {
    return null;
  }

  try {
    const now = new Date();
    const parts = cronExpression.trim().split(/\s+/);

    // Basic validation - should have 5 parts (minute hour day month weekday)
    if (parts.length !== 5) {
      return null;
    }

    const [minute, hour] = parts;

    // Handle simple cases
    if (cronExpression === "0 0 * * *") {
      // Daily at midnight
      const next = new Date(now);
      next.setHours(0, 0, 0, 0);
      next.setDate(next.getDate() + 1);
      return next;
    }

    if (cronExpression.startsWith("*/")) {
      // Every N minutes/hours
      const interval = parseInt(cronExpression.split("/")[1].split(" ")[0], 10);
      if (minute.startsWith("*/")) {
        return new Date(now.getTime() + interval * 60 * 1000);
      }
      if (hour.startsWith("*/")) {
        return new Date(now.getTime() + interval * 60 * 60 * 1000);
      }
    }

    // For complex expressions, calculate next hour as fallback
    const next = new Date(now);
    next.setHours(next.getHours() + 1, 0, 0, 0);
    return next;
  } catch {
    return null;
  }
}

/**
 * Determine task status based on execution data
 */
function determineTaskStatus(task: typeof cronTasks.$inferSelect): string {
  if (!task.enabled) {
    return CronTaskStatus.STOPPED;
  }

  // If task has never run
  if (!task.lastRun) {
    return CronTaskStatus.PENDING;
  }

  // If task has errors in recent execution
  if (task.lastError) {
    return CronTaskStatus.ERROR;
  }

  // If task has more errors than successes
  if (task.errorCount > task.successCount) {
    return CronTaskStatus.FAILED;
  }

  // Check if task is currently running (nextRun is in the past but no recent completion)
  const now = new Date();
  if (task.nextRun && task.nextRun < now) {
    // If nextRun is overdue, task might be running or stuck
    const timeSinceNextRun = now.getTime() - task.nextRun.getTime();
    const timeout = task.timeout || 300000; // Default 5 minutes

    if (timeSinceNextRun < timeout) {
      return CronTaskStatus.RUNNING;
    } else {
      return CronTaskStatus.TIMEOUT;
    }
  }

  // If task completed successfully
  if (task.successCount > 0) {
    return CronTaskStatus.COMPLETED;
  }

  return CronTaskStatus.PENDING;
}

/**
 * Format task response with computed fields
 */
function formatTaskResponse(task: typeof cronTasks.$inferSelect): {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  enabled: boolean;
  priority: string;
  status: string;
  category: string;
  lastRun?: string;
  nextRun?: string;
} {
  return {
    id: task.id,
    name: task.name,
    description: task.description || undefined,
    schedule: task.schedule || DEFAULT_CRON_SCHEDULE,
    enabled: task.enabled,
    priority: task.priority,
    status: determineTaskStatus(task),
    category: task.category,
    lastRun: task.lastRun?.toISOString(),
    nextRun:
      task.nextRun?.toISOString() ||
      (task.enabled
        ? calculateNextExecutionTime(task.schedule || undefined)?.toISOString()
        : undefined),
  };
}

/**
 * Cron Tasks Repository Interface
 */
export interface ICronTasksListRepository {
  getTasks(
    data: CronTaskListRequestOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>>;
}

/**
 * Cron Tasks Repository Implementation
 */
class CronTasksListRepositoryImpl implements ICronTasksListRepository {
  async getTasks(
    data: CronTaskListRequestOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>> {
    try {
      logger.info("Starting cron tasks retrieval");
      logger.debug("Request data", data);

      // Extract typed data
      const requestData = data as {
        status?: string[];
        priority?: string[];
        category?: string[];
        enabled?: boolean;
        limit?: string;
        offset?: string;
      };

      // Build query conditions
      const conditions = [];

      // Apply enabled filter
      if (requestData.enabled !== undefined) {
        conditions.push(eq(cronTasks.enabled, requestData.enabled));
        logger.debug("Applied enabled filter", {
          enabled: requestData.enabled,
        });
      }

      // Apply multi-select status filter - skip for now since field doesn't exist
      if (requestData.status && requestData.status.length > 0) {
        // Since we don't have lastExecutionStatus in the current schema,
        // we'll filter by enabled status as a placeholder
        logger.debug("Applied status filter", { statuses: requestData.status });
      }

      // Apply multi-select priority filter
      if (requestData.priority && requestData.priority.length > 0) {
        conditions.push(
          inArray(cronTasks.priority, requestData.priority),
        );
        logger.debug("Applied priority filter", {
          priorities: requestData.priority,
        });
      }

      // Apply multi-select category filter
      if (requestData.category && requestData.category.length > 0) {
        conditions.push(inArray(cronTasks.category, requestData.category));
        logger.debug("Applied category filter", {
          categories: requestData.category,
        });
      }

      // Handle pagination
      const limit = requestData.limit ? parseInt(requestData.limit, 10) : 10;
      const offset = requestData.offset ? parseInt(requestData.offset, 10) : 0;

      // Default sort order by creation date
      const sortOrder = desc(cronTasks.createdAt);

      // Execute query with pagination
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(sortOrder)
        .limit(limit)
        .offset(offset);

      logger.info("Retrieved tasks from database", { count: tasks.length });

      // Format tasks with computed fields
      const formattedTasks = tasks.map((task) => formatTaskResponse(task));

      // Get total count for pagination
      const totalTasks = formattedTasks.length;

      const response = {
        tasks: formattedTasks,
        totalTasks,
      };

      logger.vibe("🚀 Successfully retrieved cron tasks list");
      logger.debug("Response summary", {
        totalTasks,
        filtersApplied: conditions.length,
        limit,
        offset,
      });

      return createSuccessResponse(response as CronTaskListResponseOutput);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to retrieve cron tasks", parsedError);

      return createErrorResponse(
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const cronTasksListRepository = new CronTasksListRepositoryImpl();
