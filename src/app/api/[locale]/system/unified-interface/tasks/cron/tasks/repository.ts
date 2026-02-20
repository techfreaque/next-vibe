/**
 * Cron Tasks Repository
 * Migrated from side-tasks-old/cron/tasks/repository.ts
 * Data access layer for cron tasks listing and management functionality
 */

import "server-only";

import { and, count, desc, eq, inArray, isNull } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { calculateNextExecutionTime } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { cronTasks } from "../../cron/db";
import {
  CronTaskEnabledFilter,
  CronTaskPriority,
  TaskCategory,
} from "../../enum";
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
  logger: EndpointLogger,
): CronTaskResponseType {
  const nextExecutionAt = task.enabled
    ? (calculateNextExecutionTime(
        task.schedule,
        task.timezone ?? "UTC",
        logger,
      )?.toISOString() ?? null)
    : null;

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
    nextExecutionAt,
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
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>>;

  createTask(
    data: CronTaskCreateRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>>;
}

/**
 * Cron Tasks Repository Implementation
 */
class CronTasksListRepositoryImpl implements ICronTasksListRepository {
  async getTasks(
    data: CronTaskListRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskListResponseOutput>> {
    try {
      logger.info("Starting cron tasks retrieval");

      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);

      // Build query conditions
      const conditions = [];

      // Filter by user ownership: admin sees all, others see only their own tasks
      if (!isAdmin) {
        const userId = !user.isPublic ? user.id : null;
        if (userId) {
          conditions.push(eq(cronTasks.userId, userId));
        } else {
          // Public users can't see any tasks
          conditions.push(isNull(cronTasks.id));
        }
      }

      if (data.enabled === CronTaskEnabledFilter.ENABLED) {
        conditions.push(eq(cronTasks.enabled, true));
      } else if (data.enabled === CronTaskEnabledFilter.DISABLED) {
        conditions.push(eq(cronTasks.enabled, false));
      }
      // CronTaskEnabledFilter.ALL or undefined → no filter

      // status filter maps to lastExecutionStatus
      if (data.status && data.status.length > 0) {
        conditions.push(inArray(cronTasks.lastExecutionStatus, data.status));
      }

      if (data.priority && data.priority.length > 0) {
        conditions.push(inArray(cronTasks.priority, data.priority));
      }

      if (data.category && data.category.length > 0) {
        conditions.push(inArray(cronTasks.category, data.category));
      }

      // Handle pagination
      const limit = data.limit ? parseInt(data.limit, 10) : 100;
      const offset = data.offset ? parseInt(data.offset, 10) : 0;

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      // Get total count (separate query before applying limit/offset)
      const [countRow] = await db
        .select({ total: count(cronTasks.id) })
        .from(cronTasks)
        .where(whereClause);
      const totalTasks = countRow?.total ?? 0;

      // Execute query with pagination
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(whereClause)
        .orderBy(desc(cronTasks.createdAt))
        .limit(limit)
        .offset(offset);

      logger.info("Retrieved tasks from database", { count: tasks.length });

      // Format tasks with computed fields
      const formattedTasks = tasks.map((task) =>
        formatTaskResponse(task, logger),
      );

      const response: CronTaskListResponseOutput = {
        tasks: formattedTasks,
        totalTasks,
      };

      logger.vibe("🚀 Successfully retrieved cron tasks list");
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
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskCreateResponseOutput>> {
    try {
      logger.info("Starting cron task creation");

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

      const userId = !user.isPublic ? user.id : null;

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
        userId,
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
