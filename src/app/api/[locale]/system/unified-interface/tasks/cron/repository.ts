/**
 * Cron Tasks Repository
 * Database operations for cron task management
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type {
  CronTask,
  CronTaskExecution,
  NewCronTask,
  NewCronTaskExecution,
} from "./db";
import { cronTaskExecutions, cronTasks } from "./db";

/**
 * Implementation of Cron Tasks Repository
 */
export class CronTasksRepository {
  static async getAllTasks(
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask[]>> {
    try {
      logger.debug("Fetching all cron tasks");
      const tasks = await db
        .select()
        .from(cronTasks)
        .orderBy(desc(cronTasks.createdAt));
      logger.info(`Successfully fetched ${tasks.length} cron tasks`);
      return success(tasks as CronTask[]);
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

  static async getTaskById(id: string, logger: EndpointLogger) {
    try {
      logger.debug("Fetching cron task by ID", { id });
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

      return success({
        task: {
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
        },
      });
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

  static async getTaskByName(
    name: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask | null>> {
    try {
      logger.debug("Fetching cron task by name", { name });
      const task = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.name, name))
        .limit(1);
      const result: CronTask | null = (task[0] as CronTask) || null;
      logger.info(`Cron task ${result ? "found" : "not found"}`, { name });
      return success<CronTask | null>(result);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task by name", {
        name,
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
  ): Promise<ResponseType<CronTask>> {
    try {
      logger.debug("Creating new cron task", { name: task.name });
      const [newTask] = await db.insert(cronTasks).values(task).returning();
      logger.info("Successfully created cron task", {
        id: newTask.id,
        name: newTask.name,
      });
      return success(newTask as CronTask);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", {
        name: task.name,
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
    updates: Partial<CronTask>,
    logger: EndpointLogger,
  ) {
    try {
      logger.debug("Updating cron task", { id, updates: Object.keys(updates) });
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
        task: {
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
        },
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
    logger: EndpointLogger,
  ): Promise<ResponseType<{ success: boolean; message: string }>> {
    try {
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
      logger.debug("Creating cron task execution", {
        taskId: execution.taskId,
      });
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
      logger.debug("Updating cron task execution", {
        id,
        updates: Object.keys(updates),
      });
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
