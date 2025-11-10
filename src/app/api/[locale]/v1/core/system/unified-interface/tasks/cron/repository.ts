/**
 * Cron Tasks Repository
 * Database operations for cron task management
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";
import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/v1/core/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { cronTaskExecutions, cronTasks, cronTaskSchedules } from "./db";
import type {
  CronTask,
  CronTaskExecution,
  CronTaskSchedule,
  NewCronTask,
  NewCronTaskExecution,
} from "./db";

/**
 * Public Interface for Cron Tasks Repository
 */
export interface ICronTasksRepository {
  // Task management
  getAllTasks(logger: EndpointLogger): Promise<ResponseType<CronTask[]>>;
  getTaskById(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask | null>>;
  getTaskByName(
    name: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask | null>>;
  createTask(
    task: NewCronTask,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask>>;
  updateTask(
    id: string,
    updates: Partial<CronTask>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask>>;
  deleteTask(id: string, logger: EndpointLogger): Promise<ResponseType<void>>;

  // Execution management
  createExecution(
    execution: NewCronTaskExecution,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>>;
  updateExecution(
    id: string,
    updates: Partial<CronTaskExecution>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution>>;
  getExecutionsByTaskId(
    taskId: string,
    limit: number | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>>;
  getRecentExecutions(
    limit: number | undefined,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskExecution[]>>;

  // Schedule management
  getTaskSchedules(
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskSchedule[]>>;
  updateSchedule(
    taskId: string,
    updates: Partial<CronTaskSchedule>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskSchedule>>;

  // Statistics
  getTaskStatistics(logger: EndpointLogger): Promise<
    ResponseType<{
      totalTasks: number;
      enabledTasks: number;
      disabledTasks: number;
      averageExecutionTime: number;
    }>
  >;
}

/**
 * Implementation of Cron Tasks Repository
 */
export class CronTasksRepository implements ICronTasksRepository {
  async getAllTasks(logger: EndpointLogger): Promise<ResponseType<CronTask[]>> {
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

  async getTaskById(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask | null>> {
    try {
      logger.debug("Fetching cron task by ID", { id });
      const task = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, id))
        .limit(1);
      const result: CronTask | null = (task[0] as CronTask) || null;
      logger.info(`Cron task ${result ? "found" : "not found"}`, { id });
      return success<CronTask | null>(result);
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

  async getTaskByName(
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

  async createTask(
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

  async updateTask(
    id: string,
    updates: Partial<CronTask>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTask>> {
    try {
      logger.debug("Updating cron task", { id, updates: Object.keys(updates) });
      const [updatedTask] = await db
        .update(cronTasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(cronTasks.id, id))
        .returning();

      if (!updatedTask) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedTask as CronTask);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryTaskUpdateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  async deleteTask(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<void>> {
    try {
      logger.debug("Deleting cron task", { id });
      await db.delete(cronTasks).where(eq(cronTasks.id, id));
      logger.info("Successfully deleted cron task", { id });
      return success(undefined);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to delete cron task", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryTaskDeleteFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  async createExecution(
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
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryExecutionCreateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: execution.taskId },
      });
    }
  }

  async updateExecution(
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
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryExecutionUpdateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, executionId: id },
      });
    }
  }

  async getExecutionsByTaskId(
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
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryExecutionsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId, limit },
      });
    }
  }

  async getRecentExecutions(
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
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryRecentExecutionsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, limit },
      });
    }
  }

  async getTaskSchedules(
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskSchedule[]>> {
    try {
      logger.debug("Fetching task schedules");
      const schedules = await db
        .select()
        .from(cronTaskSchedules)
        .orderBy(cronTaskSchedules.nextRunAt);
      return success(schedules as CronTaskSchedule[]);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task schedules", {
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositorySchedulesFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async updateSchedule(
    taskId: string,
    updates: Partial<CronTaskSchedule>,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronTaskSchedule>> {
    try {
      logger.debug("Updating task schedule", {
        taskId,
        updates: Object.keys(updates),
      });
      const [updatedSchedule] = await db
        .update(cronTaskSchedules)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(cronTaskSchedules.taskId, taskId))
        .returning();

      if (!updatedSchedule) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedSchedule as CronTaskSchedule);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update task schedule", {
        taskId,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryScheduleUpdateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId },
      });
    }
  }

  async getTaskStatistics(logger: EndpointLogger): Promise<
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
          "app.api.v1.core.system.unifiedInterface.tasks.common.cronRepositoryStatisticsFetchFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

// Export singleton instance
export const cronTasksRepository = new CronTasksRepository();
