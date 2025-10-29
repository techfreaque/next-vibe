/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";

import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import {
  fail,
  createSuccessResponse,
  ErrorResponseTypes,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import { db } from "@/app/api/[locale]/v1/core/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../../shared/utils";
import {
  type NewPulseExecution,
  type NewPulseHealth,
  type NewPulseNotification,
  type PulseExecution,
  pulseExecutions,
  type PulseHealth,
  pulseHealth,
  type PulseNotification,
  pulseNotifications,
} from "./db";

/**
 * Public Interface for Pulse Health Repository
 */
export interface IPulseHealthRepository {
  // Health management
  getCurrentHealth(
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth | null>>;
  updateHealth(
    updates: Partial<PulseHealth>,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth>>;
  createHealthRecord(
    health: NewPulseHealth,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth>>;

  // Pulse execution management
  createExecution(
    execution: NewPulseExecution,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>>;
  updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>>;
  getRecentExecutions(
    logger: EndpointLogger,
    limit?: number,
  ): Promise<ResponseType<PulseExecution[]>>;
  getExecutionById(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution | null>>;

  // Notification management
  createNotification(
    notification: NewPulseNotification,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>>;
  getUnsentNotifications(
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification[]>>;
  markNotificationSent(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>>;

  // Health statistics
  getHealthStatistics(logger: EndpointLogger): Promise<
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
  async getCurrentHealth(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth | null>> {
    try {
      const health = await db
        .select()
        .from(pulseHealth)
        .orderBy(desc(pulseHealth.updatedAt))
        .limit(1);

      return createSuccessResponse<PulseHealth | null>(health[0] || null);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async updateHealth(
    updates: Partial<PulseHealth>,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      // Get the current health record
      const currentHealthResponse = await this.getCurrentHealth(logger);
      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // If no health record exists, cannot update - require a full create
        return fail({
        message: 
          ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        );
      }

      const [updatedHealth] = await db
        .update(pulseHealth)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(pulseHealth.id, currentHealthResponse.data.id))
        .returning();

      return createSuccessResponse<PulseHealth>(updatedHealth);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
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
      return createSuccessResponse<PulseHealth>(newHealth);
    } catch (error) {
      logger.error("Failed to create health record", parseError(error));
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async createExecution(
    execution: NewPulseExecution,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [newExecution] = await db
        .insert(pulseExecutions)
        .values(execution)
        .returning();
      return createSuccessResponse(newExecution);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [updatedExecution] = await db
        .update(pulseExecutions)
        .set(updates)
        .where(eq(pulseExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return fail({
        message: 
          ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedExecution);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async getRecentExecutions(
    _logger: EndpointLogger,
    limit = 50,
  ): Promise<ResponseType<PulseExecution[]>> {
    try {
      const executions = await db
        .select()
        .from(pulseExecutions)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit);

      return createSuccessResponse(executions);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async getExecutionById(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution | null>> {
    try {
      const execution = await db
        .select()
        .from(pulseExecutions)
        .where(eq(pulseExecutions.id, id))
        .limit(1);

      return createSuccessResponse(execution[0] || null);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async createNotification(
    notification: NewPulseNotification,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [newNotification] = await db
        .insert(pulseNotifications)
        .values(notification)
        .returning();
      return createSuccessResponse(newNotification);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async getUnsentNotifications(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification[]>> {
    try {
      const notifications = await db
        .select()
        .from(pulseNotifications)
        .where(eq(pulseNotifications.sent, false))
        .orderBy(pulseNotifications.createdAt);

      return createSuccessResponse(notifications);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async markNotificationSent(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [updatedNotification] = await db
        .update(pulseNotifications)
        .set(messageParams: { sent: true, sentAt: new Date() })
        .where(eq(pulseNotifications.id, id))
        .returning();

      if (!updatedNotification) {
        return fail({
        message: 
          ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedNotification);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  async getHealthStatistics(_logger: EndpointLogger): Promise<
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
      const currentHealthResponse = await this.getCurrentHealth(_logger);
      if (!currentHealthResponse.success) {
        return fail({
        message: 
          ErrorResponseTypes.INTERNAL_ERROR.errorKey,
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        );
      }
      const currentHealth = currentHealthResponse.data;

      // Get execution statistics
      const [execStats] = await db
        .select({
          totalExecutions: count(pulseExecutions.id}),
          averageExecutionTime: sql<number>`avg(${pulseExecutions.durationMs})::int`,
        })
        .from(pulseExecutions);

      return createSuccessResponse({
        currentStatus: currentHealth?.status || "UNKNOWN",
        totalExecutions: execStats.totalExecutions,
        successRate: currentHealth?.successRate || 0,
        averageExecutionTime: execStats.averageExecutionTime || 0,
        consecutiveFailures: currentHealth?.consecutiveFailures || 0,
      });
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
  /**
   * Execute a pulse cycle with the given options
   * Merged functionality from old system
   */
  async executePulse(options: {
    dryRun?: boolean;
    taskNames?: string[];
    force?: boolean;
  }): Promise<
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

      // TODO: Implement actual task discovery and execution
      // This is a simplified implementation for now
      const summary = {
        pulseId,
        executedAt: new Date().toISOString(}),
        totalTasksDiscovered: 0,
        tasksDue: [],
        tasksExecuted: [],
        tasksSucceeded: [],
        tasksFailed: [],
        tasksSkipped: [],
        totalExecutionTimeMs: Date.now() - startTime,
      };

      // Record pulse execution for health tracking
      if (!options.dryRun) {
        await this.recordPulseExecution(
          summary.tasksFailed.length === 0,
          summary.totalExecutionTimeMs,
        );
      }

      const response = {
        success: true,
        summary,
        isDryRun: options.dryRun || false,
      };

      return createSuccessResponse(response);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Record a pulse execution for health tracking
   */
  async recordPulseExecution(
    success: boolean,
    executionTimeMs: number,
  ): Promise<ResponseType<void>> {
    try {
      const currentHealthResponse = await this.getCurrentHealth(
        {} as EndpointLogger,
      );

      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // Create initial health record
        await this.createHealthRecord(
          {
            status: success ? "HEALTHY" : "WARNING",
            lastPulseAt: new Date(}),
            consecutiveFailures: success ? 0 : 1,
            avgExecutionTimeMs: executionTimeMs,
            successRate: success ? 10000 : 0, // Basis points
            totalExecutions: 1,
            totalSuccesses: success ? 1 : 0,
            totalFailures: success ? 0 : 1,
            metadata: {});
            alertsSent: 0,
            lastAlertAt: null,
            isMaintenanceMode: false,
          });
          {} as EndpointLogger,
        );
      } else {
        // Update existing health record
        const health = currentHealthResponse.data;
        const newTotalExecutions = health.totalExecutions + 1;
        const newTotalSuccesses = health.totalSuccesses + (success ? 1 : 0);
        const newTotalFailures = health.totalFailures + (success ? 0 : 1);
        const newSuccessRate = Math.round(
          (newTotalSuccesses / newTotalExecutions) * 10000,
        );

        await this.updateHealth(
          {
            lastPulseAt: new Date(}),
            consecutiveFailures: success ? 0 : health.consecutiveFailures + 1,
            avgExecutionTimeMs: Math.round(
              (health.avgExecutionTimeMs || 0 + executionTimeMs) / 2,
            }),
            successRate: newSuccessRate,
            totalExecutions: newTotalExecutions,
            totalSuccesses: newTotalSuccesses,
            totalFailures: newTotalFailures,
            status: success ? "HEALTHY" : "WARNING",
          });
          {} as EndpointLogger,
        );
      }

      return createSuccessResponse(undefined);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }

  /**
   * Get the current pulse health status
   */
  async getHealthStatus(_logger: EndpointLogger): Promise<
    ResponseType<{
      status: string;
      lastPulseAt: string | null;
      consecutiveFailures: number;
      avgExecutionTimeMs: number | null;
      successRate: number | null;
      totalExecutions: number;
      totalSuccesses: number;
      totalFailures: number;
      metadata: Record<string, string | number | boolean> | null;
      alertsSent: number;
      lastAlertAt: string | null;
      isMaintenanceMode: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    try {
      const healthResponse = await this.getCurrentHealth(_logger);

      if (!healthResponse.success || !healthResponse.data) {
        return fail({
        message: 
          ErrorResponseTypes.NOT_FOUND.errorKey,
          errorType: ErrorResponseTypes.NOT_FOUND,
        );
      }

      const health = healthResponse.data;
      const response = {
        status: health.status,
        lastPulseAt: health.lastPulseAt?.toISOString() || null,
        consecutiveFailures: health.consecutiveFailures,
        avgExecutionTimeMs: health.avgExecutionTimeMs,
        successRate: health.successRate,
        totalExecutions: health.totalExecutions,
        totalSuccesses: health.totalSuccesses,
        totalFailures: health.totalFailures,
        metadata: (health.metadata || null) as Record<
          string,
          string | number | boolean
        > | null,
        alertsSent: health.alertsSent,
        lastAlertAt: health.lastAlertAt?.toISOString() || null,
        isMaintenanceMode: health.isMaintenanceMode,
        createdAt: health.createdAt.toISOString(}),
        updatedAt: health.updatedAt.toISOString(}),
      };

      return createSuccessResponse(response);
    } catch {
      return fail({
        message: 
        ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      );
    }
  }
}

export const pulseHealthRepository = new PulseHealthRepository();
