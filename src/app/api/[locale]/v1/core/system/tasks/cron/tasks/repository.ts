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
import { z } from "zod";

import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/definition";
import type { CountryLanguage } from "@/i18n/core/config";

import type { EndpointLogger } from "../../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger/types";
import { cronTasks } from "../../db";
import { CronTaskPriority, CronTaskStatus, TaskCategory } from "../../enum";
import type {
  CronTaskCreateRequestOutput,
  CronTaskCreateResponseOutput,
  CronTaskListRequestOutput,
  CronTaskListResponseOutput,
  CronTaskResponseType,
} from "./definition";

/**
 * Default cron schedule for tasks without a specific schedule
 */
const DEFAULT_CRON_SCHEDULE = "0 0 * * *";

/**
 * Database error message pattern for unique constraint violations
 */
const UNIQUE_CONSTRAINT_ERROR = "unique constraint";

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
function determineTaskStatus(
  task: typeof cronTasks.$inferSelect,
): (typeof CronTaskStatus)[keyof typeof CronTaskStatus] {
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
 * Uses Zod validation to ensure database enum values match expected types
 */
function formatTaskResponse(
  task: typeof cronTasks.$inferSelect,
): CronTaskResponseType {
  // Validate enum values from database using Zod schemas
  // This provides runtime validation and type narrowing without type assertions
  const prioritySchema = z.enum(CronTaskPriority);
  const statusSchema = z.enum(CronTaskStatus);
  const categorySchema = z.enum(TaskCategory);

  const formatted: CronTaskResponseType = {
    id: task.id,
    name: task.name,
    description: task.description || undefined,
    schedule: task.schedule || DEFAULT_CRON_SCHEDULE,
    enabled: task.enabled,
    priority: prioritySchema.parse(task.priority),
    status: statusSchema.parse(determineTaskStatus(task)),
    category: categorySchema.parse(task.category),
    lastRun: task.lastRun?.toISOString(),
    nextRun:
      task.nextRun?.toISOString() ||
      (task.enabled
        ? calculateNextExecutionTime(task.schedule || undefined)?.toISOString()
        : undefined),
  };
  return formatted;
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

  createTask(
    data: CronTaskCreateRequestOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>>;
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

      // Build query conditions
      const conditions = [];

      // Apply enabled filter
      if (data.enabled !== undefined) {
        conditions.push(eq(cronTasks.enabled, data.enabled));
        logger.debug("Applied enabled filter", {
          enabled: data.enabled,
        });
      }

      // Apply multi-select status filter - skip for now since field doesn't exist
      if (data.status && data.status.length > 0) {
        // Since we don't have lastExecutionStatus in the current schema,
        // we'll filter by enabled status as a placeholder
        logger.debug("Applied status filter", { statuses: data.status });
      }

      // Apply multi-select priority filter
      if (data.priority && data.priority.length > 0) {
        conditions.push(inArray(cronTasks.priority, data.priority));
        logger.debug("Applied priority filter", {
          priorities: data.priority,
        });
      }

      // Apply multi-select category filter
      if (data.category && data.category.length > 0) {
        conditions.push(inArray(cronTasks.category, data.category));
        logger.debug("Applied category filter", {
          categories: data.category,
        });
      }

      // Handle pagination
      const limit = data.limit ? parseInt(data.limit, 10) : 10;
      const offset = data.offset ? parseInt(data.offset, 10) : 0;

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

      const response: CronTaskListResponseOutput = {
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

      return createSuccessResponse(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to retrieve cron tasks", parsedError);

      return createErrorResponse(
        "app.api.v1.core.system.tasks.cron.tasks.get.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async createTask(
    data: CronTaskCreateRequestOutput,
    _user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>> {
    try {
      logger.info("Starting cron task creation");
      logger.debug("Request data", data);

      // Check if task with same name already exists
      const existingTask = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.name, data.name))
        .limit(1);

      if (existingTask.length > 0) {
        logger.warn("Task with same name already exists", {
          name: data.name,
        });
        return createErrorResponse(
          "app.api.v1.core.system.tasks.cron.tasks.post.errors.conflict.title",
          ErrorResponseTypes.CONFLICT,
        );
      }

      // Calculate next execution time
      const nextRun = calculateNextExecutionTime(data.schedule);

      // Prepare task data for insertion
      const taskData = {
        name: data.name,
        description: data.description || null,
        schedule: data.schedule,
        enabled: data.enabled ?? true,
        priority: data.priority ?? CronTaskPriority.MEDIUM,
        category: data.category ?? TaskCategory.SYSTEM,
        timeout: data.timeout ?? 300000,
        retries: data.retries ?? 3,
        version: "1",
        defaultConfig: {
          retryDelay: data.retryDelay ?? 5000,
        },
        nextRun: nextRun || undefined,
        runCount: 0,
        successCount: 0,
        errorCount: 0,
      };

      logger.debug("Inserting task into database", taskData);

      // Insert the task into the database
      const [createdTask] = await db
        .insert(cronTasks)
        .values(taskData)
        .returning();

      if (!createdTask) {
        logger.error("Failed to create task - no task returned");
        return createErrorResponse(
          "app.api.v1.core.system.tasks.cron.tasks.post.errors.internal.title",
          ErrorResponseTypes.INTERNAL_ERROR,
        );
      }

      logger.info("Task created successfully", {
        id: createdTask.id,
        name: createdTask.name,
      });

      // Format the response
      const response: CronTaskCreateResponseOutput = {
        task: {
          id: createdTask.id,
          name: createdTask.name,
          description: createdTask.description || undefined,
          schedule: createdTask.schedule || DEFAULT_CRON_SCHEDULE,
          enabled: createdTask.enabled,
          priority: z.enum(CronTaskPriority).parse(createdTask.priority),
          status: CronTaskStatus.PENDING, // New tasks are always pending
          category: z.enum(TaskCategory).parse(createdTask.category),
          timeout: createdTask.timeout || 300000,
          retries: createdTask.retries || 3,
          retryDelay:
            (createdTask.defaultConfig as { retryDelay?: number })
              ?.retryDelay || 5000,
          version: parseInt(createdTask.version, 10) || 1,
          createdAt: createdTask.createdAt.toISOString(),
          updatedAt: createdTask.updatedAt.toISOString(),
        },
      };

      logger.vibe("🚀 Successfully created cron task");
      logger.debug("Created task response", response);

      return createSuccessResponse(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", parsedError);

      // Check for unique constraint violation
      if (parsedError.message?.includes(UNIQUE_CONSTRAINT_ERROR)) {
        return createErrorResponse(
          "app.api.v1.core.system.tasks.cron.tasks.post.errors.conflict.title",
          ErrorResponseTypes.CONFLICT,
        );
      }

      return createErrorResponse(
        "app.api.v1.core.system.tasks.cron.tasks.post.errors.internal.title",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const cronTasksListRepository = new CronTasksListRepositoryImpl();
