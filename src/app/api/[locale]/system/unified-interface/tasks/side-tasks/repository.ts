/**
 * Side Tasks Repository
 * Database operations for side task management
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  success,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { sideTaskExecutions, sideTaskHealthChecks, sideTasks } from "./db";
import type {
  NewSideTaskExecutionRecord,
  NewSideTaskHealthCheckRecord,
  NewSideTaskRecord,
  SideTaskExecutionRecord,
  SideTaskHealthCheckRecord,
  SideTaskRecord,
} from "./db";
import type {
  SideTasksRequestOutput,
  SideTasksResponseOutput,
  SideTasksStatusResponseOutput,
} from "./definition";

/**
 * Type alias for action response data
 */
type ActionResponseData = SideTasksResponseOutput;

/**
 * Type alias for action request data
 */
type ActionRequestData = SideTasksRequestOutput;

/**
 * Public Interface for Side Tasks Repository
 */
export interface ISideTasksRepository {
  // Task management
  getAllTasks(
    logger: EndpointLogger,
  ): ReturnType<SideTasksRepository["getAllTasks"]>;
  getTaskById(
    id: string,
    logger: EndpointLogger,
  ): ReturnType<SideTasksRepository["getTaskById"]>;
  getTaskByName(name: string): ReturnType<SideTasksRepository["getTaskByName"]>;
  createTask(
    task: NewSideTaskRecord,
    logger: EndpointLogger,
  ): ReturnType<SideTasksRepository["createTask"]>;
  updateTask(
    id: string,
    updates: Partial<SideTaskRecord>,
  ): ReturnType<SideTasksRepository["updateTask"]>;
  deleteTask(id: string): Promise<ResponseType<void>>;

  // Execution management
  createExecution(
    execution: NewSideTaskExecutionRecord,
  ): Promise<ResponseType<SideTaskExecutionRecord>>;
  updateExecution(
    id: string,
    updates: Partial<SideTaskExecutionRecord>,
  ): ReturnType<SideTasksRepository["updateExecution"]>;
  getExecutionsByTaskId(
    taskId: string,
    limit?: number,
  ): ReturnType<SideTasksRepository["getExecutionsByTaskId"]>;
  getRecentExecutions(
    limit?: number,
  ): ReturnType<SideTasksRepository["getRecentExecutions"]>;

  // Health check management
  createHealthCheck(
    healthCheck: NewSideTaskHealthCheckRecord,
  ): Promise<ResponseType<SideTaskHealthCheckRecord>>;
  getLatestHealthCheck(
    taskId: string,
  ): ReturnType<SideTasksRepository["getLatestHealthCheck"]>;
  getHealthCheckHistory(
    taskId: string,
    limit?: number,
  ): ReturnType<SideTasksRepository["getHealthCheckHistory"]>;

  // Statistics
  getTaskStatistics(logger: EndpointLogger): Promise<
    ResponseType<{
      totalTasks: number;
      runningTasks: number;
      healthyTasks: number;
      unhealthyTasks: number;
    }>
  >;

  // Route handlers
  getStatus(): Promise<ResponseType<SideTasksStatusResponseOutput>>;

  handleAction(
    data: ActionRequestData,
    logger: EndpointLogger,
  ): Promise<ResponseType<ActionResponseData>>;
}

/**
 * Implementation of Side Tasks Repository
 */
export class SideTasksRepository implements ISideTasksRepository {
  async getAllTasks(logger: EndpointLogger) {
    try {
      const tasks = await db
        .select()
        .from(sideTasks)
        .orderBy(desc(sideTasks.createdAt));
      logger.debug("Successfully fetched all side tasks", {
        count: tasks.length,
      });
      return success(tasks);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch all side tasks", {
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.common.sideTasksRepositoryFetchAllFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getTaskById(id: string, logger: EndpointLogger) {
    try {
      const task = await db
        .select()
        .from(sideTasks)
        .where(eq(sideTasks.id, id))
        .limit(1);
      logger.debug("Successfully fetched side task by ID", {
        id,
        found: !!task[0],
      });
      return success(task[0] || null);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch side task by ID", {
        id,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.common.sideTasksRepositoryFetchByIdFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskId: id },
      });
    }
  }

  async getTaskByName(name: string) {
    try {
      const task = await db
        .select()
        .from(sideTasks)
        .where(eq(sideTasks.name, name))
        .limit(1);
      return success(task[0] || null);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchByNameFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async createTask(task: NewSideTaskRecord, logger: EndpointLogger) {
    try {
      logger.debug("Creating new side task", { name: task.name });
      const [newTask] = await db.insert(sideTasks).values(task).returning();
      logger.info("Successfully created side task", {
        id: newTask.id,
        name: newTask.name,
      });
      return success(newTask);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to create side task", {
        taskName: task.name,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.common.sideTasksRepositoryCreateFailed",
        errorType: ErrorResponseTypes.DATABASE_ERROR,
        messageParams: { error: parsedError.message, taskName: task.name },
      });
    }
  }

  async updateTask(id: string, updates: Partial<SideTaskRecord>) {
    try {
      const [updatedTask] = await db
        .update(sideTasks)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(sideTasks.id, id))
        .returning();

      if (!updatedTask) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.sideTasks.errors.taskNotFound" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedTask);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.updateTaskFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async deleteTask(id: string): Promise<ResponseType<void>> {
    try {
      await db.delete(sideTasks).where(eq(sideTasks.id, id));
      return success(undefined);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.deleteTaskFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async createExecution(
    execution: NewSideTaskExecutionRecord,
  ): Promise<ResponseType<SideTaskExecutionRecord>> {
    try {
      const [newExecution] = await db
        .insert(sideTaskExecutions)
        .values(execution)
        .returning();
      return success(newExecution as SideTaskExecutionRecord);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.createExecutionFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async updateExecution(id: string, updates: Partial<SideTaskExecutionRecord>) {
    try {
      const [updatedExecution] = await db
        .update(sideTaskExecutions)
        .set(updates)
        .where(eq(sideTaskExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return fail({
          message:
            "app.api.system.unifiedInterface.tasks.sideTasks.errors.executionNotFound" as const,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.updateExecutionFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getExecutionsByTaskId(
    taskId: string,
    limit = 50,
  ) {
    try {
      const executions = await db
        .select()
        .from(sideTaskExecutions)
        .where(eq(sideTaskExecutions.taskId, taskId))
        .orderBy(desc(sideTaskExecutions.startedAt))
        .limit(limit);

      return success(executions);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchExecutionsFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getRecentExecutions( limit = 100) {
    try {
      const executions = await db
        .select()
        .from(sideTaskExecutions)
        .orderBy(desc(sideTaskExecutions.startedAt))
        .limit(limit);

      return success(executions);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchRecentExecutionsFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async createHealthCheck(
    healthCheck: NewSideTaskHealthCheckRecord,
  ): Promise<ResponseType<SideTaskHealthCheckRecord>> {
    try {
      const [newHealthCheck] = await db
        .insert(sideTaskHealthChecks)
        .values(healthCheck)
        .returning();
      return success(newHealthCheck as SideTaskHealthCheckRecord);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.createHealthCheckFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getLatestHealthCheck(taskId: string) {
    try {
      const healthCheck = await db
        .select()
        .from(sideTaskHealthChecks)
        .where(eq(sideTaskHealthChecks.taskId, taskId))
        .orderBy(desc(sideTaskHealthChecks.createdAt))
        .limit(1);

      return success(healthCheck[0] || null);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchLatestHealthCheckFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getHealthCheckHistory(
    taskId: string,
    limit = 50,
  ) {
    try {
      const healthChecks = await db
        .select()
        .from(sideTaskHealthChecks)
        .where(eq(sideTaskHealthChecks.taskId, taskId))
        .orderBy(desc(sideTaskHealthChecks.createdAt))
        .limit(limit);

      return success(healthChecks);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchHealthCheckHistoryFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async getTaskStatistics(): Promise<
    ResponseType<{
      totalTasks: number;
      runningTasks: number;
      healthyTasks: number;
      unhealthyTasks: number;
    }>
  > {
    try {
      const [stats] = await db
        .select({
          totalTasks: count(sideTasks.id),
          runningTasks: sql<number>`count(case when ${sideTasks.isRunning} = true then 1 end)::int`,
        })
        .from(sideTasks);

      // Get health statistics from latest health checks
      const [healthStats] = await db
        .select({
          healthyTasks: sql<number>`count(case when ${sideTaskHealthChecks.isHealthy} = true then 1 end)::int`,
          unhealthyTasks: sql<number>`count(case when ${sideTaskHealthChecks.isHealthy} = false then 1 end)::int`,
        })
        .from(sideTaskHealthChecks)
        .where(
          sql`${sideTaskHealthChecks.createdAt} = (
            SELECT MAX(created_at) 
            FROM ${sideTaskHealthChecks} AS inner_checks 
            WHERE inner_checks.task_id = ${sideTaskHealthChecks.taskId}
          )`,
        );

      return success({
        totalTasks: stats.totalTasks,
        runningTasks: stats.runningTasks,
        healthyTasks: healthStats?.healthyTasks || 0,
        unhealthyTasks: healthStats?.unhealthyTasks || 0,
      });
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchStatisticsFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  // Route handlers
  async getStatus(): Promise<ResponseType<SideTasksStatusResponseOutput>> {
    try {
      // Get basic task statistics
      const stats = await this.getTaskStatistics();
      if (!stats.success) {
        return stats;
      }

      return success<SideTasksStatusResponseOutput>(stats.data);
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchStatisticsFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }

  async handleAction(
    data: ActionRequestData,
    logger: EndpointLogger,
  ): Promise<ResponseType<ActionResponseData>> {
    try {
      const { action } = data;

      switch (action) {
        case "list": {
          const tasksResult = await this.getAllTasks(logger);
          if (!tasksResult.success) {
            return tasksResult;
          }
          return success({
            data: tasksResult.data,
            count: tasksResult.data.length,
          });
        }
        case "stats": {
          const statsResult = await this.getTaskStatistics();
          if (!statsResult.success) {
            return statsResult;
          }
          return success({
            data: statsResult.data,
          });
        }
        default:
          return fail({
            message:
              "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchStatisticsFailed" as const,
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
            messageParams: { action },
          });
      }
    } catch (error) {
      const parsedError = parseError(error);
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.sideTasks.errors.fetchStatisticsFailed" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}

// Export singleton instance
export const sideTasksRepository = new SideTasksRepository();
