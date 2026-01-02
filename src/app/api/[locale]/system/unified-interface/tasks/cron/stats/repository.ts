/**
 * Cron Stats Repository
 * Business logic for cron task statistics and metrics
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { ErrorResponseTypes, fail, success } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { CronStatsGetRequestOutput, CronStatsGetResponseOutput } from "./definition";

/**
 * Cron Stats Repository Interface
 */
export interface ICronStatsRepository {
  getStats(
    data: CronStatsGetRequestOutput,
    user: JwtPayloadType,
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

      const statsData: CronStatsGetResponseOutput = {
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
        totalTasks: mockStats.totalTasks,
        executedTasks: mockStats.executedTasks,
        successfulTasks: mockStats.successfulTasks,
        failedTasks: mockStats.failedTasks,
      });

      return success(statsData);
    } catch (error) {
      const errorDetails = parseError(error);
      logger.error("Failed to get cron statistics", {
        period: data.period,
        type: data.type,
        taskId: data.taskId,
        error: errorDetails.message,
      });
      return fail({
        message: "app.api.system.unifiedInterface.tasks.cronSystem.stats.get.errors.server.title",
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
