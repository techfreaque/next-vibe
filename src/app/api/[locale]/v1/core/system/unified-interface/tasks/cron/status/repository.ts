/**
 * Cron Status Repository
 * Business logic for cron system status monitoring
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import {
  fail,
  createSuccessResponse,
  ErrorResponseTypes,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { CronTaskStatus } from "../../enum";
import type {
  CronStatusRequestOutput,
  CronStatusResponseOutput,
} from "./definition";

/**
 * Cron Status Repository Interface
 */
export interface ICronStatusRepository {
  getStatus(
    data: CronStatusRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatusResponseOutput>>;
}

/**
 * Cron Status Repository Implementation
 */
class CronStatusRepositoryImpl implements ICronStatusRepository {
  async getStatus(
    data: CronStatusRequestOutput,
    user: JwtPayloadType,
    _locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatusResponseOutput>> {
    try {
      // Add await to satisfy async requirement
      await Promise.resolve();

      logger.debug("Getting cron system status", {
        data: data,
        user: user.isPublic ? "public" : user.id,
      });

      const { taskId, detailed } = data;

      // Mock uptime calculation - replace with actual system uptime
      const uptimeMs = Date.now() - (Date.now() - 86400000 * 2); // 2 days ago
      const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
      const uptimeDays = Math.floor(uptimeHours / 24);
      const remainingHours = uptimeHours % 24;
      // eslint-disable-next-line i18next/no-literal-string
      const uptime = `${uptimeDays}d ${remainingHours}h 30m`;

      // Mock schedule constants - these are cron expressions, not user-facing strings
      // eslint-disable-next-line i18next/no-literal-string
      const scheduleEvery30Min = "0 */30 * * *";
      // eslint-disable-next-line i18next/no-literal-string
      const scheduleDaily10AM = "0 10 * * *";
      // eslint-disable-next-line i18next/no-literal-string
      const scheduleDaily11PM = "0 23 * * *";

      // Mock tasks data - replace with actual database queries
      const mockTasks = detailed
        ? [
            {
              id: "task-1",
              name: "email-campaign",
              status: CronTaskStatus.RUNNING,
              lastRun: "2023-07-21T11:30:00Z",
              nextRun: "2023-07-21T12:30:00Z",
              schedule: scheduleEvery30Min,
            });
            {
              id: "task-2",
              name: "data-sync",
              status: CronTaskStatus.COMPLETED,
              lastRun: "2023-07-21T10:00:00Z",
              nextRun: "2023-07-22T10:00:00Z",
              schedule: scheduleDaily10AM,
            });
            {
              id: "task-3",
              name: "cleanup-logs",
              status: CronTaskStatus.SCHEDULED,
              lastRun: "2023-07-20T23:00:00Z",
              nextRun: "2023-07-21T23:00:00Z",
              schedule: scheduleDaily11PM,
            });
          ]
        : [];

      // Filter by taskId if specified
      const filteredTasks =
        taskId && mockTasks
          ? mockTasks.filter((task) => task.id === taskId)
          : mockTasks;

      const response: CronStatusResponseOutput = {
        success: true,
        systemStatus: "healthy",
        activeTasks: 3,
        totalTasks: 15,
        uptime,
        tasks: filteredTasks,
      };

      logger.debug("Cron status retrieved successfully", {
        systemStatus: response.systemStatus,
        activeTasks: response.activeTasks,
        totalTasks: response.totalTasks,
      });

      return createSuccessResponse(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get cron status", {
        taskId: data.taskId,
        detailed: data.detailed,
        error: parsedError.message,
      });
      return fail({
        message: 
        "app.api.v1.core.system.unifiedBackend.tasks.cronSystem.status.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message, taskId: data.taskId || "unknown" });
      );
    }
  }
}

// Export singleton instance
export const cronStatusRepository = new CronStatusRepositoryImpl();
