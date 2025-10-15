/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { count, desc, eq, sql } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/v1/core/system/db";

import type { EndpointLogger } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
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
 * Logger interface for repository operations
 */
interface Logger {
  debug: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  error: (message: string, error?: Error | string) => void;
  vibe: (message: string, data?: unknown) => void;
}

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
    limit?: number,
    logger: EndpointLogger,
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
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHealth | null>> {
    try {
      const health = await db
        .select()
        .from(pulseHealth)
        .orderBy(desc(pulseHealth.updatedAt))
        .limit(1);

      return createSuccessResponse(health[0] || null);
    } catch (error) {
      return createErrorResponse("Failed to fetch current pulse health", error);
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
        return createErrorResponse(
          "No health record found to update. Create one first.",
        );
      }

      const [updatedHealth] = await db
        .update(pulseHealth)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(pulseHealth.id, currentHealthResponse.data.id))
        .returning();

      return createSuccessResponse(updatedHealth);
    } catch (error) {
      return createErrorResponse("Failed to update pulse health", error);
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
      return createSuccessResponse(newHealth);
    } catch (error) {
      return createErrorResponse("Failed to create pulse health record", error);
    }
  }

  async createExecution(
    execution: NewPulseExecution,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [newExecution] = await db
        .insert(pulseExecutions)
        .values(execution)
        .returning();
      return createSuccessResponse(newExecution);
    } catch (error) {
      return createErrorResponse("Failed to create pulse execution", error);
    }
  }

  async updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [updatedExecution] = await db
        .update(pulseExecutions)
        .set(updates)
        .where(eq(pulseExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        return createErrorResponse("Pulse execution not found");
      }

      return createSuccessResponse(updatedExecution);
    } catch (error) {
      return createErrorResponse("Failed to update pulse execution", error);
    }
  }

  async getRecentExecutions(
    limit = 50,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution[]>> {
    try {
      const executions = await db
        .select()
        .from(pulseExecutions)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit);

      return createSuccessResponse(executions);
    } catch (error) {
      return createErrorResponse(
        "Failed to fetch recent pulse executions",
        error,
      );
    }
  }

  async getExecutionById(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseExecution | null>> {
    try {
      const execution = await db
        .select()
        .from(pulseExecutions)
        .where(eq(pulseExecutions.id, id))
        .limit(1);

      return createSuccessResponse(execution[0] || null);
    } catch (error) {
      return createErrorResponse("Failed to fetch pulse execution", error);
    }
  }

  async createNotification(
    notification: NewPulseNotification,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [newNotification] = await db
        .insert(pulseNotifications)
        .values(notification)
        .returning();
      return createSuccessResponse(newNotification);
    } catch (error) {
      return createErrorResponse("Failed to create pulse notification", error);
    }
  }

  async getUnsentNotifications(
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification[]>> {
    try {
      const notifications = await db
        .select()
        .from(pulseNotifications)
        .where(eq(pulseNotifications.sent, false))
        .orderBy(pulseNotifications.createdAt);

      return createSuccessResponse(notifications);
    } catch (error) {
      return createErrorResponse(
        "Failed to fetch unsent pulse notifications",
        error,
      );
    }
  }

  async markNotificationSent(
    id: string,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [updatedNotification] = await db
        .update(pulseNotifications)
        .set({ sent: true, sentAt: new Date() })
        .where(eq(pulseNotifications.id, id))
        .returning();

      if (!updatedNotification) {
        return createErrorResponse("Pulse notification not found");
      }

      return createSuccessResponse(updatedNotification);
    } catch (error) {
      return createErrorResponse(
        "Failed to mark pulse notification as sent",
        error,
      );
    }
  }

  async getHealthStatistics(logger: EndpointLogger): Promise<
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
      const currentHealth = currentHealthResponse.data;

      // Get execution statistics
      const [execStats] = await db
        .select({
          totalExecutions: count(pulseExecutions.id),
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
    } catch (error) {
      return createErrorResponse(
        "Failed to fetch pulse health statistics",
        error,
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
          messageParams?: Record<string, unknown>;
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
        executedAt: new Date().toISOString(),
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
    } catch (error) {
      return createErrorResponse("Failed to execute pulse", error);
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
      const currentHealthResponse = await this.getCurrentHealth();

      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // Create initial health record
        await this.createHealthRecord({
          status: success ? "HEALTHY" : "DEGRADED",
          lastPulseAt: new Date(),
          consecutiveFailures: success ? 0 : 1,
          avgExecutionTimeMs: executionTimeMs,
          successRate: success ? 10000 : 0, // Basis points
          totalExecutions: 1,
          totalSuccesses: success ? 1 : 0,
          totalFailures: success ? 0 : 1,
          metadata: {},
          alertsSent: 0,
          lastAlertAt: null,
          isMaintenanceMode: false,
        });
      } else {
        // Update existing health record
        const health = currentHealthResponse.data;
        const newTotalExecutions = health.totalExecutions + 1;
        const newTotalSuccesses = health.totalSuccesses + (success ? 1 : 0);
        const newTotalFailures = health.totalFailures + (success ? 0 : 1);
        const newSuccessRate = Math.round(
          (newTotalSuccesses / newTotalExecutions) * 10000,
        );

        await this.updateHealth({
          lastPulseAt: new Date(),
          consecutiveFailures: success ? 0 : health.consecutiveFailures + 1,
          avgExecutionTimeMs: Math.round(
            (health.avgExecutionTimeMs || 0 + executionTimeMs) / 2,
          ),
          successRate: newSuccessRate,
          totalExecutions: newTotalExecutions,
          totalSuccesses: newTotalSuccesses,
          totalFailures: newTotalFailures,
          status: success ? "HEALTHY" : "DEGRADED",
        });
      }

      return createSuccessResponse(undefined);
    } catch (error) {
      return createErrorResponse("Failed to record pulse execution", error);
    }
  }

  /**
   * Get the current pulse health status
   */
  async getHealthStatus(logger: EndpointLogger): Promise<
    ResponseType<{
      status: string;
      lastPulseAt: string | null;
      consecutiveFailures: number;
      avgExecutionTimeMs: number | null;
      successRate: number | null;
      totalExecutions: number;
      totalSuccesses: number;
      totalFailures: number;
      metadata: Record<string, unknown> | null;
      alertsSent: number;
      lastAlertAt: string | null;
      isMaintenanceMode: boolean;
      createdAt: string;
      updatedAt: string;
    }>
  > {
    try {
      const healthResponse = await this.getCurrentHealth();

      if (!healthResponse.success || !healthResponse.data) {
        return createErrorResponse("No pulse health data found");
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
        metadata: health.metadata || null,
        alertsSent: health.alertsSent,
        lastAlertAt: health.lastAlertAt?.toISOString() || null,
        isMaintenanceMode: health.isMaintenanceMode,
        createdAt: health.createdAt.toISOString(),
        updatedAt: health.updatedAt.toISOString(),
      };

      return createSuccessResponse(response);
    } catch (error) {
      return createErrorResponse("Failed to get pulse health status", error);
    }
  }
}

export const pulseHealthRepository = new PulseHealthRepository();
