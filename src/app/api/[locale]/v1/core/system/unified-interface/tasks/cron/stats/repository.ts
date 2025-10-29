/**
 * Cron Stats Repository
 * Business logic for cron task statistics and metrics
 */

import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ResponseType } from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import {
  createSuccessResponse,
  ErrorResponseTypes,
  fail,
} from "@/app/api/[locale]/v1/core/shared/types/response.schema";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/logger";
import type { JwtPayloadType } from "@/app/api/[locale]/v1/core/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  CronStatsGetRequestOutput,
  CronStatsGetResponseInput,
  CronStatsGetResponseOutput,
} from "./definition";

/**
 * Cron Stats Repository Interface
 */
export interface ICronStatsRepository {
  getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatsGetResponseOutput>>;
}

/**
 * Cron Stats Repository Implementation
 */
class CronStatsRepositoryImpl implements ICronStatsRepository {
  async getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatsGetResponseOutput>> {
    try {
      logger.debug("Getting cron statistics", {
        data,
        userId: user.isPublic ? "public" : user.id,
      });

      // Add await to satisfy async requirement
      await Promise.resolve();

      const { type = "overview" } = data;

      // Mock data for now - replace with actual database queries
      const mockStats = {
        totalTasks: 25,
        executedTasks: 23,
        successfulTasks: 21,
        failedTasks: 2,
        averageExecutionTime: 1250,
        trends:
          type === "trends"
            ? [
                {
                  timestamp: "2023-07-21T00:00:00Z",
                  executions: 15,
                  successes: 14,
                  failures: 1,
                },
                {
                  timestamp: "2023-07-21T01:00:00Z",
                  executions: 8,
                  successes: 7,
                  failures: 1,
                },
              ]
            : undefined,
        topFailures:
          type === "errors"
            ? [
                {
                  taskName: "email-campaign",
                  failures: 5,
                  lastFailure: "2023-07-21T10:30:00Z",
                },
                {
                  taskName: "data-sync",
                  failures: 3,
                  lastFailure: "2023-07-21T09:15:00Z",
                },
              ]
            : undefined,
      };

      const response: CronStatsGetResponseInput = {
        success: true,
        data: {
          totalTasks: mockStats.totalTasks,
          executedTasks: mockStats.executedTasks,
          successfulTasks: mockStats.successfulTasks,
          failedTasks: mockStats.failedTasks,
          averageExecutionTime: mockStats.averageExecutionTime,
        },
      };

      logger.debug("Cron statistics retrieved successfully", {
        stats: response.data,
      });

      return createSuccessResponse(response);
    } catch (error) {
      const errorDetails = parseError(error);
      logger.error("Failed to get cron statistics", {
        period: data.period,
        type: data.type,
        taskId: data.taskId,
        error: errorDetails.message,
      });
      return fail({
        message:
          "app.api.v1.core.system.unifiedBackend.tasks.cronSystem.stats.get.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: errorDetails.message,
          period: data.period || "day",
          type: data.type || "overview",
          taskId: data.taskId || "unknown",
        },
      });
    }
  }
}

// Export singleton instance
export const cronStatsRepository = new CronStatsRepositoryImpl();
