/**
 * Cron Tasks Repository
 * Migrated from side-tasks-old/cron/tasks/repository.ts
 * Data access layer for cron tasks listing and management functionality
 */

import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { cronTasks } from "../../cron/db";
import { CronTaskPriority, TaskCategory } from "../../enum";
import type {
  CronTaskCreateRequestOutput,
  CronTaskCreateResponseOutput,
  CronTaskListRequestOutput,
  CronTaskListResponseOutput,
  CronTaskResponseType,
} from "./definition";

/**
 * Database error message pattern for unique constraint violations
 */
const UNIQUE_CONSTRAINT_ERROR = "unique constraint";

/**
 * Format task response with DB fields
 */
function formatTaskResponse(
  task: typeof cronTasks.$inferSelect,
): CronTaskResponseType {
  const formatted: CronTaskResponseType = {
    id: task.id,
    name: task.name,
    description: task.description,
    version: task.version,
    category: task.category,
    schedule: task.schedule,
    timezone: task.timezone,
    enabled: task.enabled,
    priority: task.priority,
    timeout: task.timeout,
    retries: task.retries,
    retryDelay: task.retryDelay,
    lastExecutedAt: task.lastExecutedAt?.toISOString() || null,
    lastExecutionStatus: task.lastExecutionStatus,
    lastExecutionError: task.lastExecutionError,
    lastExecutionDuration: task.lastExecutionDuration,
    nextExecutionAt: task.nextExecutionAt?.toISOString() || null,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    averageExecutionTime: task.averageExecutionTime,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
  return formatted;
}

/**
 * Cron Tasks Repository Interface
 */
export interface ICronTasksListRepository {
  getTasks(
    data: CronTaskListRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>>;

  createTask(
    data: CronTaskCreateRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>>;
}

/**
 * Cron Tasks Repository Implementation
 */
class CronTasksListRepositoryImpl implements ICronTasksListRepository {
  async getTasks(
    data: CronTaskListRequestOutput,
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

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to retrieve cron tasks", parsedError);

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.get.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async createTask(
    data: CronTaskCreateRequestOutput,
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
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

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
        retryDelay: data.retryDelay ?? 5000,
        version: "1.0.0",
        defaultConfig: {},
        executionCount: 0,
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
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.internal.title",
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        });
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
          description: createdTask.description,
          version: createdTask.version,
          category: createdTask.category,
          schedule: createdTask.schedule,
          timezone: createdTask.timezone,
          enabled: createdTask.enabled,
          priority: createdTask.priority,
          timeout: createdTask.timeout,
          retries: createdTask.retries,
          retryDelay: createdTask.retryDelay,
          lastExecutedAt: createdTask.lastExecutedAt?.toISOString() || null,
          lastExecutionStatus: createdTask.lastExecutionStatus,
          lastExecutionError: createdTask.lastExecutionError,
          lastExecutionDuration: createdTask.lastExecutionDuration,
          nextExecutionAt: createdTask.nextExecutionAt?.toISOString() || null,
          executionCount: createdTask.executionCount,
          successCount: createdTask.successCount,
          errorCount: createdTask.errorCount,
          averageExecutionTime: createdTask.averageExecutionTime,
          createdAt: createdTask.createdAt.toISOString(),
          updatedAt: createdTask.updatedAt.toISOString(),
        },
      };

      logger.vibe("🚀 Successfully created cron task");
      logger.debug("Created task response", response);

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", parsedError);

      // Check for unique constraint violation
      if (parsedError.message?.includes(UNIQUE_CONSTRAINT_ERROR)) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.conflict.title",
          errorType: ErrorResponseTypes.CONFLICT,
        });
      }

      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.cronSystem.tasks.post.errors.internal.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}

export const cronTasksListRepository = new CronTasksListRepositoryImpl();
