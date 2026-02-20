/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { count, desc, eq, inArray, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "@/app/api/[locale]/shared/types/response.schema";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  PulseExecutionStatus,
  PulseHealthStatus,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";

import { cronTasks as cronTasksTable } from "../cron/db";
import type {
  NewPulseExecution,
  NewPulseHealth,
  NewPulseNotification,
  PulseExecution,
  PulseHealth,
  PulseNotification,
} from "./db";
import { pulseExecutions, pulseHealth, pulseNotifications } from "./db";
import type { PulseStatusResponseOutput } from "./status/definition";

/**
 * Public Interface for Pulse Health Repository
 */
export interface IPulseHealthRepository {
  // Health management
  getCurrentHealth(): Promise<ResponseType<PulseHealth | null>>;
  updateHealth(
    updates: Partial<PulseHealth>,
  ): Promise<ResponseType<PulseHealth>>;
  createHealthRecord(
    health: NewPulseHealth,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth>>;

  // Pulse execution management
  createExecution(
    execution: NewPulseExecution,
  ): Promise<ResponseType<PulseExecution>>;
  updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
  ): Promise<ResponseType<PulseExecution>>;
  getRecentExecutions(limit?: number): Promise<ResponseType<PulseExecution[]>>;
  getExecutionById(id: string): Promise<ResponseType<PulseExecution | null>>;

  // Notification management
  createNotification(
    notification: NewPulseNotification,
  ): Promise<ResponseType<PulseNotification>>;
  getUnsentNotifications(): Promise<ResponseType<PulseNotification[]>>;
  markNotificationSent(id: string): Promise<ResponseType<PulseNotification>>;

  // Health statistics
  getHealthStatistics(): Promise<
    ResponseType<{
      currentStatus: string;
      totalExecutions: number;
      successRate: number;
      averageExecutionTime: number;
      consecutiveFailures: number;
    }>
  >;
}

/**
 * Implementation of Pulse Health Repository
 */
export class PulseHealthRepository implements IPulseHealthRepository {
  async getCurrentHealth(): Promise<ResponseType<PulseHealth | null>> {
    try {
      const health = await db
        .select()
        .from(pulseHealth)
        .orderBy(desc(pulseHealth.updatedAt))
        .limit(1);

      return success<PulseHealth | null>((health[0] as PulseHealth) || null);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async updateHealth(
    updates: Partial<PulseHealth>,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      // Get the current health record
      const currentHealthResponse = await this.getCurrentHealth();
      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // If no health record exists, cannot update - require a full create
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      const [updatedHealth] = await db
        .update(pulseHealth)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(pulseHealth.id, currentHealthResponse.data.id))
        .returning();

      return success<PulseHealth>(updatedHealth as PulseHealth);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async createHealthRecord(
    health: NewPulseHealth,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      const [newHealth] = await db
        .insert(pulseHealth)
        .values(health)
        .returning();
      return success<PulseHealth>(newHealth as PulseHealth);
    } catch (error) {
      logger.error("Failed to create health record", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async createExecution(
    execution: NewPulseExecution,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [newExecution] = await db
        .insert(pulseExecutions)
        .values(execution)
        .returning();
      return success(newExecution as PulseExecution);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [updatedExecution] = await db
        .update(pulseExecutions)
        .set(updates)
        .where(eq(pulseExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution as PulseExecution);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async getRecentExecutions(
    limit = 50,
  ): Promise<ResponseType<PulseExecution[]>> {
    try {
      const executions = await db
        .select()
        .from(pulseExecutions)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit);

      return success(executions as PulseExecution[]);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async getExecutionById(
    id: string,
  ): Promise<ResponseType<PulseExecution | null>> {
    try {
      const execution = await db
        .select()
        .from(pulseExecutions)
        .where(eq(pulseExecutions.id, id))
        .limit(1);

      return success((execution[0] as PulseExecution) || null);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async createNotification(
    notification: NewPulseNotification,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [newNotification] = await db
        .insert(pulseNotifications)
        .values(notification)
        .returning();
      return success(newNotification as PulseNotification);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async getUnsentNotifications(): Promise<ResponseType<PulseNotification[]>> {
    try {
      const notifications = await db
        .select()
        .from(pulseNotifications)
        .where(eq(pulseNotifications.sent, false))
        .orderBy(pulseNotifications.createdAt);

      return success(notifications as PulseNotification[]);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async markNotificationSent(
    id: string,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [updatedNotification] = await db
        .update(pulseNotifications)
        .set({ sent: true, sentAt: new Date() })
        .where(eq(pulseNotifications.id, id))
        .returning();

      if (!updatedNotification) {
        return fail({
          message: ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedNotification as PulseNotification);
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  async getHealthStatistics(): Promise<
    ResponseType<{
      currentStatus: string;
      totalExecutions: number;
      successRate: number;
      averageExecutionTime: number;
      consecutiveFailures: number;
    }>
  > {
    try {
      // Get current health
      const currentHealthResponse = await this.getCurrentHealth();
      if (!currentHealthResponse.success) {
        return fail({
          message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          cause: currentHealthResponse,
        });
      }
      const currentHealth = currentHealthResponse.data;

      // Get execution statistics
      const [execStats] = await db
        .select({
          totalExecutions: count(pulseExecutions.id),
          averageExecutionTime: sql<number>`avg(${pulseExecutions.durationMs})::int`,
        })
        .from(pulseExecutions);

      return success({
        currentStatus: currentHealth?.status || "UNKNOWN",
        totalExecutions: execStats.totalExecutions,
        successRate: currentHealth?.successRate || 0,
        averageExecutionTime: execStats.averageExecutionTime || 0,
        consecutiveFailures: currentHealth?.consecutiveFailures || 0,
      });
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
  /**
   * Execute a pulse cycle with the given options
   * Merged functionality from old system
   */
  async executePulse(
    options: {
      dryRun?: boolean;
      taskNames?: string[];
      force?: boolean;
    },
    logger: EndpointLogger,
  ): Promise<
    ResponseType<{
      success: boolean;
      summary: {
        pulseId: string;
        executedAt: string;
        totalTasksDiscovered: number;
        tasksDue: string[];
        tasksExecuted: string[];
        tasksSucceeded: string[];
        tasksFailed: string[];
        tasksSkipped: string[];
        totalExecutionTimeMs: number;
        errors?: Array<{
          message: string;
          messageParams?: Record<string, string | number | boolean>;
          errorType: string;
        }>;
      };
      isDryRun: boolean;
    }>
  > {
    try {
      const startTime = Date.now();
      const pulseId = crypto.randomUUID();

      // Load task registry and unified runner
      const { taskRegistry } =
        await import("@/app/api/[locale]/system/generated/tasks-index");
      const { unifiedTaskRunnerRepository } =
        await import("../unified-runner/repository");
      const { isCronTaskDue } = await import("../cron-formatter");

      const now = new Date();
      const tasksDue: string[] = [];
      const tasksExecuted: string[] = [];
      const tasksSucceeded: string[] = [];
      const tasksFailed: string[] = [];
      const tasksSkipped: string[] = [];

      // Filter by taskNames if provided
      const candidateTasks = options.taskNames
        ? taskRegistry.cronTasks.filter((t) =>
            options.taskNames!.includes(t.name),
          )
        : taskRegistry.cronTasks;

      // Fetch enabled status from DB (overrides in-memory defaults)
      const candidateNames = candidateTasks.map((t) => t.name);
      const dbEnabledRows =
        candidateNames.length > 0
          ? await db
              .select({
                name: cronTasksTable.name,
                enabled: cronTasksTable.enabled,
              })
              .from(cronTasksTable)
              .where(inArray(cronTasksTable.name, candidateNames))
          : [];
      const dbEnabledMap = new Map(
        dbEnabledRows.map((r) => [r.name, r.enabled]),
      );

      // Discover which tasks are due
      for (const task of candidateTasks) {
        // DB enabled status takes precedence; fall back to in-memory default
        const isEnabled = dbEnabledMap.has(task.name)
          ? dbEnabledMap.get(task.name)
          : task.enabled;
        if (!isEnabled) {
          tasksSkipped.push(task.name);
          continue;
        }
        const due = options.force || isCronTaskDue(logger, task.schedule, now);
        if (due) {
          tasksDue.push(task.name);
        } else {
          tasksSkipped.push(task.name);
        }
      }

      // Execute due tasks (skip in dry run)
      if (!options.dryRun) {
        // Ensure runner has a logger context for task execution
        if (!unifiedTaskRunnerRepository.logger) {
          unifiedTaskRunnerRepository.logger = logger;
        }

        for (const taskName of tasksDue) {
          const task = taskRegistry.tasksByName[taskName];
          if (!task || task.type !== "cron") {
            continue;
          }

          tasksExecuted.push(taskName);
          logger.debug(`Pulse executing cron task: ${taskName}`);

          const result =
            await unifiedTaskRunnerRepository.executeCronTask(task);
          if (result.success) {
            tasksSucceeded.push(taskName);
          } else {
            tasksFailed.push(taskName);
            logger.error(`Pulse: cron task failed: ${taskName}`, {
              message: result.message,
            });
          }
        }
      }

      const summary = {
        pulseId,
        executedAt: now.toISOString(),
        totalTasksDiscovered: candidateTasks.length,
        tasksDue,
        tasksExecuted,
        tasksSucceeded,
        tasksFailed,
        tasksSkipped,
        totalExecutionTimeMs: Date.now() - startTime,
      };

      // Record pulse execution for health tracking
      await this.recordPulseExecution(
        tasksFailed.length === 0,
        summary.totalExecutionTimeMs,
        logger,
        summary,
      );

      return success({
        success: true,
        summary,
        isDryRun: options.dryRun || false,
      });
    } catch (error) {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Record a pulse execution for health tracking and persist to pulseExecutions
   */
  async recordPulseExecution(
    isSuccessful: boolean,
    executionTimeMs: number,
    logger: EndpointLogger,
    summary?: {
      pulseId: string;
      executedAt: string;
      totalTasksDiscovered: number;
      tasksDue: string[];
      tasksExecuted: string[];
      tasksSucceeded: string[];
      tasksFailed: string[];
      tasksSkipped: string[];
      totalExecutionTimeMs: number;
    },
  ): Promise<ResponseType<void>> {
    try {
      // Persist to pulseExecutions table if summary is available
      if (summary) {
        await this.createExecution({
          pulseId: summary.pulseId,
          executionId: crypto.randomUUID(),
          status: isSuccessful
            ? PulseExecutionStatus.SUCCESS
            : PulseExecutionStatus.FAILURE,
          healthStatus: isSuccessful
            ? PulseHealthStatus.HEALTHY
            : PulseHealthStatus.WARNING,
          startedAt: new Date(summary.executedAt),
          completedAt: new Date(),
          durationMs: summary.totalExecutionTimeMs,
          totalTasksDiscovered: summary.totalTasksDiscovered,
          tasksDue: summary.tasksDue,
          tasksExecuted: summary.tasksExecuted,
          tasksSucceeded: summary.tasksSucceeded,
          tasksFailed: summary.tasksFailed,
          tasksSkipped: summary.tasksSkipped,
          totalExecutionTimeMs: summary.totalExecutionTimeMs,
          triggeredBy: "schedule",
        });
      }

      const currentHealthResponse = await this.getCurrentHealth();

      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // Create initial health record
        await this.createHealthRecord(
          {
            status: isSuccessful
              ? PulseHealthStatus.HEALTHY
              : PulseHealthStatus.WARNING,
            lastPulseAt: new Date(),
            consecutiveFailures: isSuccessful ? 0 : 1,
            avgExecutionTimeMs: executionTimeMs,
            successRate: isSuccessful ? 10000 : 0, // Basis points
            totalExecutions: 1,
            totalSuccesses: isSuccessful ? 1 : 0,
            totalFailures: isSuccessful ? 0 : 1,
            metadata: {},
            alertsSent: 0,
            lastAlertAt: null,
            isMaintenanceMode: false,
          },
          logger,
        );
      } else {
        // Update existing health record
        const health = currentHealthResponse.data;
        const newTotalExecutions = health.totalExecutions + 1;
        const newTotalSuccesses =
          health.totalSuccesses + (isSuccessful ? 1 : 0);
        const newTotalFailures = health.totalFailures + (isSuccessful ? 0 : 1);
        const newSuccessRate = Math.round(
          (newTotalSuccesses / newTotalExecutions) * 10000,
        );

        await this.updateHealth({
          lastPulseAt: new Date(),
          consecutiveFailures: isSuccessful
            ? 0
            : health.consecutiveFailures + 1,
          avgExecutionTimeMs: Math.round(
            ((health.avgExecutionTimeMs || 0) + executionTimeMs) / 2,
          ),
          successRate: newSuccessRate,
          totalExecutions: newTotalExecutions,
          totalSuccesses: newTotalSuccesses,
          totalFailures: newTotalFailures,
          status: isSuccessful
            ? PulseHealthStatus.HEALTHY
            : PulseHealthStatus.WARNING,
        });
      }

      return success();
    } catch {
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the current pulse health status for the status endpoint
   */
  async getHealthStatus(): Promise<ResponseType<PulseStatusResponseOutput>> {
    const healthResponse = await this.getCurrentHealth();

    if (!healthResponse.success || !healthResponse.data) {
      return success<PulseStatusResponseOutput>({
        status: "UNKNOWN",
        lastPulseAt: null,
        successRate: null,
        totalExecutions: 0,
      });
    }

    const health = healthResponse.data;
    return success<PulseStatusResponseOutput>({
      status: health.status,
      lastPulseAt: health.lastPulseAt?.toISOString() ?? null,
      successRate: health.successRate,
      totalExecutions: health.totalExecutions,
    });
  }
}

export const pulseHealthRepository = new PulseHealthRepository();
