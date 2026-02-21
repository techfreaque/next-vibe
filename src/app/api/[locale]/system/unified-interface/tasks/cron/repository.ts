/**
 * Cron Tasks Repository
 * Database operations for cron task management
 * Following interface + implementation pattern
 */

import { count, desc, eq, isNull, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { calculateNextExecutionTime } from "@/app/api/[locale]/system/unified-interface/tasks/cron-formatter";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import type {
  CronTaskExecution,
  CronTaskRow,
  NewCronTask,
  NewCronTaskExecution,
} from "./db";
import { cronTaskExecutions, cronTasks } from "./db";
import type { CronTaskResponseType as CronTaskResponse } from "./tasks/definition";

export type { CronTaskResponse };

function serializeTask(
  task: CronTaskRow,
  logger: EndpointLogger,
): CronTaskResponse {
  return {
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
    taskInput: task.taskInput,
    runOnce: task.runOnce,
    outputMode: task.outputMode,
    notificationTargets: task.notificationTargets,
    lastExecutedAt: task.lastExecutedAt?.toISOString() ?? null,
    lastExecutionStatus: task.lastExecutionStatus ?? null,
    lastExecutionError: task.lastExecutionError ?? null,
    lastExecutionDuration: task.lastExecutionDuration ?? null,
    nextExecutionAt: task.enabled
      ? (calculateNextExecutionTime(
          task.schedule,
          task.timezone ?? "UTC",
          logger,
        )?.toISOString() ?? null)
      : null,
    executionCount: task.executionCount,
    successCount: task.successCount,
    errorCount: task.errorCount,
    averageExecutionTime: task.averageExecutionTime ?? null,
    tags: task.tags,
    userId: task.userId ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

/**
 * Implementation of Cron Tasks Repository
 */
export class CronTasksRepository {
  static async getAllTasks(
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow[]>> {
    try {
      logger.debug("Fetching all cron tasks");
      const tasks = await db
        .select()
        .from(cronTasks)
        .orderBy(desc(cronTasks.createdAt));
      logger.info(`Successfully fetched ${tasks.length} cron tasks`);
      return success(tasks as CronTaskRow[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron tasks", {
        error: parsedError.message,
      });
      return fail({
        message: ErrorResponseTypes.DATABASE_ERROR.errorKey,
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async getTaskById(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ task: CronTaskResponse }>> {
    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      const tasks = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, id))
        .limit(1);
      const task = tasks[0];

      if (!task) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.notFound.title",
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: { taskId: id },
        });
      }

      // Non-admins can only access their own tasks
      if (!isAdmin && task.userId !== userId) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.task.get.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: { taskId: id },
        });
      }

      return success({ task: serializeTask(task as CronTaskRow, logger) });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task by ID", {
        id,
        error: parsedError.message,
      });
      return fail({
        message: ErrorResponseTypes.DATABASE_ERROR.errorKey,
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  /** Find a system task (userId IS NULL) by its routeId */
  static async getSystemTaskByRouteId(
    routeId: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow | null>> {
    try {
      const task = await db
        .select()
        .from(cronTasks)
        .where(
          sql`${cronTasks.routeId} = ${routeId} AND ${cronTasks.userId} IS NULL`,
        )
        .limit(1);
      const result: CronTaskRow | null = (task[0] as CronTaskRow) || null;
      return success<CronTaskRow | null>(result);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch system task by routeId", {
        routeId,
        error: parsedError.message,
      });
      return fail({
        message: ErrorResponseTypes.DATABASE_ERROR.errorKey,
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  /** Get all system tasks (userId IS NULL) — for startup sync */
  static async getAllSystemTasks(
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow[]>> {
    try {
      const tasks = await db
        .select()
        .from(cronTasks)
        .where(isNull(cronTasks.userId));
      return success(tasks as CronTaskRow[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch system tasks", {
        error: parsedError.message,
      });
      return fail({
        message: ErrorResponseTypes.DATABASE_ERROR.errorKey,
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async createTask(
    task: NewCronTask,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskRow>> {
    try {
      logger.debug("Creating new cron task", { routeId: task.routeId });
      const [newTask] = await db.insert(cronTasks).values(task).returning();
      logger.info("Successfully created cron task", {
        id: newTask.id,
        routeId: newTask.routeId,
      });
      return success(newTask as CronTaskRow);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", {
        routeId: task.routeId,
        error: parsedError.message,
      });
      return fail({
        message: ErrorResponseTypes.DATABASE_ERROR.errorKey,
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { message: parsedError.message },
      });
    }
  }

  static async updateTask(
    id: string,
    updates: Partial<CronTaskRow>,
    user: JwtPayloadType | null,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ task: CronTaskResponse; success: boolean }>> {
    try {
      // null user = internal system call (e.g. task runner) — skip ownership check
      if (user !== null) {
        const isAdmin =
          !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
        const userId = !user.isPublic ? user.id : null;

        // Check ownership before updating
        const existing = await db
          .select({ userId: cronTasks.userId })
          .from(cronTasks)
          .where(eq(cronTasks.id, id))
          .limit(1);

        if (!existing[0]) {
          return fail({
            message: ErrorResponseTypes.NOT_FOUND.errorKey,
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }

        if (!isAdmin && existing[0].userId !== userId) {
          return fail({
            message:
              "app.api.system.unifiedInterface.tasks.cronSystem.task.put.errors.forbidden.title",
            errorType: ErrorResponseTypes.FORBIDDEN,
            messageParams: { taskId: id },
          });
        }
      }

      logger.debug(
        `Updating task "${id}" (${Object.keys(updates).join(", ")})`,
      );
      const [task] = await db
        .update(cronTasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(cronTasks.id, id))
        .returning();

      if (!task) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        task: serializeTask(task as CronTaskRow, logger),
        success: true,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryTaskUpdateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  static async deleteTask(
    id: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    try {
      const isAdmin =
        !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
      const userId = !user.isPublic ? user.id : null;

      // Check ownership before deleting
      const existing = await db
        .select({ userId: cronTasks.userId })
        .from(cronTasks)
        .where(eq(cronTasks.id, id))
        .limit(1);

      if (!existing[0]) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      if (!isAdmin && existing[0].userId !== userId) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.cronSystem.task.delete.errors.forbidden.title",
          errorType: ErrorResponseTypes.FORBIDDEN,
          messageParams: { taskId: id },
        });
      }

      logger.debug("Deleting cron task", { id });
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
      logger.info("Successfully deleted cron task", { id });
      return success({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to delete cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryTaskDeleteFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  static async createExecution(
    execution: NewCronTaskExecution,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>> {
    try {
      logger.debug(`Creating execution for task "${execution.taskId}"`);
      const [newExecution] = await db
        .insert(cronTaskExecutions)
        .values(execution)
        .returning();
      return success(newExecution as CronTaskExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron execution", {
        taskId: execution.taskId,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryExecutionCreateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: execution.taskId },
      });
    }
  }

  static async updateExecution(
    id: string,
    updates: Partial<CronTaskExecution>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>> {
    try {
      logger.debug(
        `Updating execution "${id}" (${Object.keys(updates).join(", ")})`,
      );
      const [updatedExecution] = await db
        .update(cronTaskExecutions)
        .set(updates)
        .where(eq(cronTaskExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution as CronTaskExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron execution", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryExecutionUpdateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, executionId: id },
      });
    }
  }

  static async getExecutionsByTaskId(
    taskId: string,
    limit = 50,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>> {
    try {
      logger.debug("Fetching executions by task ID", { taskId, limit });
      const executions = await db
        .select()
        .from(cronTaskExecutions)
        .where(eq(cronTaskExecutions.taskId, taskId))
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit);

      return success(executions as CronTaskExecution[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron executions by task ID", {
        taskId,
        limit,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryExecutionsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId, limit },
      });
    }
  }

  static async getRecentExecutions(
    limit = 100,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>> {
    try {
      logger.debug("Fetching recent executions", { limit });
      const executions = await db
        .select()
        .from(cronTaskExecutions)
        .orderBy(desc(cronTaskExecutions.startedAt))
        .limit(limit);

      return success(executions as CronTaskExecution[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch recent cron executions", {
        limit,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryRecentExecutionsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, limit },
      });
    }
  }

  static async getTaskStatistics(logger: EndpointLogger): Promise<
    ResponseType<{
      totalTasks: number;
      enabledTasks: number;
      disabledTasks: number;
      averageExecutionTime: number;
    }>
  > {
    try {
      logger.debug("Fetching task statistics");
      const [stats] = await db
        .select({
          totalTasks: count(cronTasks.id),
          enabledTasks: sql<number>`count(case when ${cronTasks.enabled} = true then 1 end)::int`,
          disabledTasks: sql<number>`count(case when ${cronTasks.enabled} = false then 1 end)::int`,
          averageExecutionTime: sql<number>`avg(${cronTasks.averageExecutionTime})::int`,
        })
        .from(cronTasks);

      return success({
        totalTasks: stats.totalTasks,
        enabledTasks: stats.enabledTasks,
        disabledTasks: stats.disabledTasks,
        averageExecutionTime: stats.averageExecutionTime || 0,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task statistics", {
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.common.cronRepositoryStatisticsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
