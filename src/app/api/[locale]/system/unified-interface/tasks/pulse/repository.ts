/**
 * Pulse Health Repository
 * Database operations for pulse health monitoring
 * Following interface + implementation pattern
 */

import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/shared/types/response.schema";

import { LeadAuthRepository } from "@/app/api/[locale]/leads/auth/repository";
import { parseError } from "@/app/api/[locale]/shared/utils/parse-error";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  PulseExecutionStatus,
  PulseHealthStatus,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type { JwtPrivatePayloadType } from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import { getFullPath } from "../../../generated/endpoint";
import { getRouteHandler } from "../../../generated/route-handlers";
import { Platform } from "../../shared/types/platform";
import { splitTaskArgs } from "../cron/arg-splitter";
import { cronTasks as cronTasksTable } from "../cron/db";
import { CronTasksRepository } from "../cron/repository";
import { isCronTaskDue } from "../cron-formatter";
import {
  scopedTranslation,
  scopedTranslation as tasksScopedTranslation,
} from "../i18n";
import type {
  NewPulseExecution,
  NewPulseHealth,
  NewPulseNotification,
  PulseExecution,
  PulseHealth,
  PulseNotification,
} from "./db";
import {
  pulseExecutions,
  pulseHealth,
  pulseNotifications,
  selectPulseNotificationSchema,
} from "./db";
import type { PulseStatusResponseOutput } from "./status/definition";

/**
 * Implementation of Pulse Health Repository
 */
export class PulseHealthRepository {
  static async getCurrentHealth(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth | null>> {
    try {
      const health = await db
        .select()
        .from(pulseHealth)
        .orderBy(desc(pulseHealth.updatedAt))
        .limit(1);

      return success<PulseHealth | null>((health[0] as PulseHealth) || null);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateHealth(
    updates: Partial<PulseHealth>,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      // Get the current health record
      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);
      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // If no health record exists, cannot update - require a full create
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
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
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createHealthRecord(
    health: NewPulseHealth,
    logger: EndpointLogger,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseHealth>> {
    try {
      const [newHealth] = await db
        .insert(pulseHealth)
        .values(health)
        .returning();
      return success<PulseHealth>(newHealth as PulseHealth);
    } catch (error) {
      logger.error("Failed to create health record", parseError(error));
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createExecution(
    execution: NewPulseExecution,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [newExecution] = await db
        .insert(pulseExecutions)
        .values(execution)
        .returning();
      return success(newExecution as PulseExecution);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateExecution(
    id: string,
    updates: Partial<PulseExecution>,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution>> {
    try {
      const [updatedExecution] = await db
        .update(pulseExecutions)
        .set(updates)
        .where(eq(pulseExecutions.id, id))
        .returning();

      if (!updatedExecution) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(updatedExecution as PulseExecution);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getRecentExecutions(
    limit = 50,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution[]>> {
    try {
      const executions = await db
        .select()
        .from(pulseExecutions)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit);

      return success(executions as PulseExecution[]);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getExecutionById(
    id: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseExecution | null>> {
    try {
      const execution = await db
        .select()
        .from(pulseExecutions)
        .where(eq(pulseExecutions.id, id))
        .limit(1);

      return success((execution[0] as PulseExecution) || null);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async createNotification(
    notification: NewPulseNotification,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [newNotification] = await db
        .insert(pulseNotifications)
        .values(notification)
        .returning();
      return success(newNotification as PulseNotification);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);

      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getUnsentNotifications(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification[]>> {
    try {
      const notifications = await db
        .select()
        .from(pulseNotifications)
        .where(eq(pulseNotifications.sent, false))
        .orderBy(pulseNotifications.createdAt);

      return success(notifications as PulseNotification[]);
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async markNotificationSent(
    id: string,
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseNotification>> {
    try {
      const [updatedNotification] = await db
        .update(pulseNotifications)
        .set({ sent: true, sentAt: new Date() })
        .where(eq(pulseNotifications.id, id))
        .returning();

      if (!updatedNotification) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryNotFound"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success(selectPulseNotificationSchema.parse(updatedNotification));
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async getHealthStatistics(locale: CountryLanguage): Promise<
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
      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);
      if (!currentHealthResponse.success) {
        const { t } = tasksScopedTranslation.scopedT(locale);
        return fail({
          message: t("errors.repositoryInternalError"),
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
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
  /**
   * Resolve the user context for a task execution.
   * System tasks (no userId) use the cached admin auth result.
   * User tasks fetch real roles and leadId from the DB.
   */
  private static async resolveTaskUser(
    userId: string | null,
    adminAuthResult: ResponseType<JwtPrivatePayloadType> | null,
    systemLocale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{
    user: JwtPrivatePayloadType;
    locale: CountryLanguage;
  } | null> {
    if (!userId) {
      // System task — use the cached admin user
      if (!adminAuthResult?.success || !adminAuthResult.data) {
        return null;
      }
      return { user: adminAuthResult.data, locale: systemLocale };
    }

    // User task — resolve locale, roles, and leadId
    let userLocale: CountryLanguage = systemLocale;
    const ownerRow = await db
      .select({ locale: usersTable.locale })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    if (ownerRow[0]?.locale) {
      userLocale = ownerRow[0].locale;
    }

    const rolesResult = await UserRolesRepository.getUserRoles(
      userId,
      logger,
      userLocale,
    );
    if (!rolesResult.success) {
      return null;
    }

    const { leadId } = await LeadAuthRepository.getAuthenticatedUserLeadId(
      userId,
      undefined,
      userLocale,
      logger,
    );

    return {
      user: {
        id: userId,
        leadId,
        isPublic: false as const,
        roles: rolesResult.data,
      },
      locale: userLocale,
    };
  }

  /**
   * Execute a pulse cycle with the given options
   * Merged functionality from old system
   */
  static async executePulse(
    options: {
      dryRun?: boolean;
      taskNames?: string[];
      force?: boolean;
      systemLocale: CountryLanguage;
    },
    logger: EndpointLogger,
    locale: CountryLanguage,
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
      locale = options.systemLocale;
      const startTime = Date.now();
      const pulseId = crypto.randomUUID();
      const now = new Date();

      const instanceId = env.INSTANCE_ID;

      const tasksDue: string[] = [];
      const tasksExecuted: string[] = [];
      const tasksSucceeded: string[] = [];
      const tasksFailed: string[] = [];
      const tasksSkipped: string[] = [];

      // Resolve admin user for system tasks (cached for entire pulse cycle)
      const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
      const adminAuthResult = adminEmail
        ? await AuthRepository.authenticateUserByEmail(
            adminEmail,
            options.systemLocale,
            logger,
          )
        : null;

      // All tasks live in the DB (system tasks have no userId, user tasks have one)
      const whereConditions = [eq(cronTasksTable.enabled, true)];
      if (options.taskNames && options.taskNames.length > 0) {
        whereConditions.push(
          inArray(cronTasksTable.routeId, options.taskNames),
        );
      }
      const allTasks = await db
        .select()
        .from(cronTasksTable)
        .where(and(...whereConditions));

      // Discover which tasks are due
      for (const dbTask of allTasks) {
        // Instance routing: null targetInstance = host only (no INSTANCE_ID set),
        // specific targetInstance = only on that named instance
        const taskTarget = dbTask.targetInstance ?? null;
        const currentInstance = instanceId ?? null;
        if (taskTarget !== currentInstance) {
          tasksSkipped.push(dbTask.displayName);
          continue;
        }

        const isDue =
          options.force || isCronTaskDue(logger, dbTask.schedule, now);
        if (!isDue) {
          tasksSkipped.push(dbTask.displayName);
          continue;
        }

        tasksDue.push(dbTask.displayName);

        if (options.dryRun) {
          continue;
        }

        tasksExecuted.push(dbTask.displayName);
        logger.debug(
          `Pulse executing task: ${dbTask.displayName} (routeId: ${dbTask.routeId})`,
        );

        // Resolve user context with real roles from DB
        const taskUserContext = await PulseHealthRepository.resolveTaskUser(
          dbTask.userId,
          adminAuthResult,
          options.systemLocale,
          logger,
        );

        if (!taskUserContext) {
          tasksFailed.push(dbTask.displayName);
          logger.error(
            `Pulse: failed to resolve user context for task "${dbTask.displayName}"${
              dbTask.userId
                ? ` (userId: ${dbTask.userId})`
                : " (check VIBE_ADMIN_USER_EMAIL)"
            }`,
          );
          continue;
        }

        const { user: cronUser, locale: userLocale } = taskUserContext;

        // Resolve routeId → endpoint path → handler
        const path = getFullPath(dbTask.routeId);
        if (!path) {
          tasksFailed.push(dbTask.displayName);
          logger.error(
            `Pulse: unknown routeId "${dbTask.routeId}" for task "${dbTask.displayName}"`,
          );
        } else {
          const handler = await getRouteHandler(path);
          if (!handler) {
            tasksFailed.push(dbTask.displayName);
            logger.error(`Pulse: no handler for routeId "${dbTask.routeId}"`);
          } else {
            const taskInput = dbTask.taskInput ?? {};
            const { urlPathParams, data } = await splitTaskArgs(
              path,
              taskInput,
            );

            const result = await handler({
              data,
              urlPathParams,
              user: cronUser,
              locale: userLocale,
              logger,
              platform: Platform.CRON,
            });

            if (isStreamingResponse(result) || isFileResponse(result)) {
              tasksFailed.push(dbTask.displayName);
              logger.error(
                `Pulse: task "${dbTask.displayName}" returned streaming/file response`,
              );
            } else if (!result.success) {
              tasksFailed.push(dbTask.displayName);
              logger.error(`Pulse: task "${dbTask.displayName}" failed`, {
                message: result.message,
              });
            } else {
              tasksSucceeded.push(dbTask.displayName);
            }
          }
        }

        // Run-once: disable after first execution regardless of outcome
        if (dbTask.runOnce) {
          const { t: tPulse } = scopedTranslation.scopedT(userLocale);
          await CronTasksRepository.updateTask(
            dbTask.id,
            { enabled: false },
            null,
            tPulse,
            logger,
          );
          logger.info(
            `[run-once] Task "${dbTask.displayName}" disabled after single execution`,
          );
        }
      }

      const summary = {
        pulseId,
        executedAt: now.toISOString(),
        totalTasksDiscovered: allTasks.length,
        tasksDue,
        tasksExecuted,
        tasksSucceeded,
        tasksFailed,
        tasksSkipped,
        totalExecutionTimeMs: Date.now() - startTime,
      };

      // Record pulse execution for health tracking
      await PulseHealthRepository.recordPulseExecution(
        tasksFailed.length === 0,
        summary.totalExecutionTimeMs,
        logger,
        options.systemLocale,
        summary,
      );

      return success({
        success: true,
        summary,
        isDryRun: options.dryRun || false,
      });
    } catch (error) {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  /**
   * Record a pulse execution for health tracking and persist to pulseExecutions
   */
  static async recordPulseExecution(
    isSuccessful: boolean,
    executionTimeMs: number,
    logger: EndpointLogger,
    locale: CountryLanguage,
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
        await PulseHealthRepository.createExecution(
          {
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
          },
          locale,
        );
      }

      const currentHealthResponse =
        await PulseHealthRepository.getCurrentHealth(locale);

      if (!currentHealthResponse.success || !currentHealthResponse.data) {
        // Create initial health record
        await PulseHealthRepository.createHealthRecord(
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
          locale,
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

        await PulseHealthRepository.updateHealth(
          {
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
          },
          locale,
        );
      }

      return success();
    } catch {
      const { t } = tasksScopedTranslation.scopedT(locale);
      return fail({
        message: t("errors.repositoryInternalError"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Get the current pulse health status for the status endpoint
   */
  static async getHealthStatus(
    locale: CountryLanguage,
  ): Promise<ResponseType<PulseStatusResponseOutput>> {
    const healthResponse = await PulseHealthRepository.getCurrentHealth(locale);

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
