/**
 * Cron Tasks Repository
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
  TaskOutputMode,
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
    routeId: task.routeId,
    displayName: task.displayName,
    description: task.description ?? null,
    version: task.version,
    category: task.category,
    schedule: task.schedule,
    timezone: task.timezone ?? null,
    enabled: task.enabled,
    priority: task.priority,
    timeout: task.timeout ?? null,
    retries: task.retries ?? null,
    retryDelay: task.retryDelay ?? null,
    defaultConfig: task.defaultConfig as CronTaskResponseType["defaultConfig"],
    outputMode: task.outputMode,
    notificationTargets:
      task.notificationTargets as CronTaskResponseType["notificationTargets"],
    lastExecutedAt: task.lastExecutedAt?.toISOString() ?? null,
    lastExecutionStatus: task.lastExecutionStatus ?? null,
    lastExecutionError: task.lastExecutionError ?? null,
    lastExecutionDuration: task.lastExecutionDuration ?? null,
    nextExecutionAt,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    averageExecutionTime: task.averageExecutionTime ?? null,
    tags: task.tags as CronTaskResponseType["tags"],
    userId: task.userId ?? null,
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
      logger.info("Starting cron task creation", { routeId: data.routeId });

      const userId = !user.isPublic ? user.id : null;

      // Prepare task data for insertion
      const taskData = {
        routeId: data.routeId,
        displayName: data.displayName,
        description: data.description || null,
        schedule: data.schedule,
        enabled: data.enabled ?? true,
        priority: data.priority ?? CronTaskPriority.MEDIUM,
        category: data.category ?? TaskCategory.SYSTEM,
        timeout: data.timeout ?? 300000,
        retries: data.retries ?? 3,
        retryDelay: data.retryDelay ?? 5000,
        version: "1.0.0",
        defaultConfig:
          (data.defaultConfig as Record<
            string,
            string | number | boolean | null
          >) ?? {},
        outputMode: data.outputMode ?? TaskOutputMode.STORE_ONLY,
        notificationTargets: [],
        executionCount: 0,
        successCount: 0,
        errorCount: 0,
        userId,
      };

      logger.debug("Inserting task into database", {
        routeId: taskData.routeId,
        displayName: taskData.displayName,
      });

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
        routeId: createdTask.routeId,
      });

      // Format the response
      const response: CronTaskCreateResponseOutput = {
        task: formatTaskResponse(createdTask, logger),
      };

      logger.vibe("🚀 Successfully created cron task");
      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", parsedError);

      // Check for unique constraint violation (system tasks with same routeId)
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
