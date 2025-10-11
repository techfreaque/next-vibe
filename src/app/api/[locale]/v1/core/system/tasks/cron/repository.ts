/**
 * Cron Tasks Repository
 * Database operations for cron task management
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/v1/core/system/db";

import type { EndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import {
  type CronTask,
  type CronTaskExecution,
  cronTaskExecutions,
  cronTasks,
  type CronTaskSchedule,
  cronTaskSchedules,
  type NewCronTask,
  type NewCronTaskExecution,
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
      return createSuccessResponse(tasks);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron tasks", {
        error: parsedError.message,
      });
      return createErrorResponse(
        "error.errorTypes.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { message: parsedError.message },
      );
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
      const result = task[0] || null;
      logger.info(`Cron task ${result ? "found" : "not found"}`, { id });
      return createSuccessResponse(result);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task by ID", {
        id,
        error: parsedError.message,
      });
      return createErrorResponse(
        "error.errorTypes.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { message: parsedError.message },
      );
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
      const result = task[0] || null;
      logger.info(`Cron task ${result ? "found" : "not found"}`, { name });
      return createSuccessResponse(result);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron task by name", {
        name,
        error: parsedError.message,
      });
      return createErrorResponse(
        "error.errorTypes.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { message: parsedError.message },
      );
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
      return createSuccessResponse(newTask);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron task", {
        name: task.name,
        error: parsedError.message,
      });
      return createErrorResponse(
        "error.errorTypes.database_error",
        ErrorResponseTypes.DATABASE_ERROR,
        { message: parsedError.message },
      );
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
        return createErrorResponse(
          "error.errorTypes.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedTask);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron task", {
        id,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryTaskUpdateFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, taskId: id },
      );
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
      return createSuccessResponse(undefined);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to delete cron task", {
        id,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryTaskDeleteFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, taskId: id },
      );
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
      return createSuccessResponse(newExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create cron execution", {
        taskId: execution.taskId,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryExecutionCreateFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, taskId: execution.taskId },
      );
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
        return createErrorResponse(
          "error.errorTypes.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedExecution);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update cron execution", {
        id,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryExecutionUpdateFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, executionId: id },
      );
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

      return createSuccessResponse(executions);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch cron executions by task ID", {
        taskId,
        limit,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryExecutionsFetchFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, taskId, limit },
      );
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

      return createSuccessResponse(executions);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch recent cron executions", {
        limit,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryRecentExecutionsFetchFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, limit },
      );
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
      return createSuccessResponse(schedules);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch task schedules", {
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositorySchedulesFetchFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
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
        return createErrorResponse(
          "error.errorTypes.not_found",
          ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedSchedule);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update task schedule", {
        taskId,
        error: parsedError.message,
      });
      return createErrorResponse(
        "common.cronRepositoryScheduleUpdateFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message, taskId },
      );
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

      return createSuccessResponse({
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
      return createErrorResponse(
        "common.cronRepositoryStatisticsFetchFailed",
        ErrorResponseTypes.DATABASE_ERROR,
        { error: parsedError.message },
      );
    }
  }
}

// Export singleton instance
export const cronTasksRepository = new CronTasksRepository();
