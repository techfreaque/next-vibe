/**
 * Cron Status Repository
 * Business logic for cron system status monitoring
 */

import "server-only";

import { CronExpressionParser } from "cron-parser";
import { count, eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { CronTaskStatus } from "../../enum";
import { cronTasks } from "../db";
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
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatusResponseOutput>>;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  // eslint-disable-next-line i18next/no-literal-string
  return `${days}d ${hours}h ${minutes}m`;
}

/**
 * Cron Status Repository Implementation
 */
class CronStatusRepositoryImpl implements ICronStatusRepository {
  async getStatus(
    data: CronStatusRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<CronStatusResponseOutput>> {
    try {
      logger.debug("Getting cron system status", {
        data: data,
        user: user.isPublic ? "public" : user.id,
      });

      const { taskId, detailed } = data;

      // Total tasks count
      const [taskCountRow] = await db
        .select({ total: count(cronTasks.id) })
        .from(cronTasks);
      const totalTasks = taskCountRow?.total ?? 0;

      // Active tasks = enabled tasks
      const [activeRow] = await db
        .select({ active: count(cronTasks.id) })
        .from(cronTasks)
        .where(eq(cronTasks.enabled, true));
      const activeTasks = activeRow?.active ?? 0;

      // System status: healthy when all enabled tasks exist, warning if none enabled
      const systemStatus: CronStatusResponseOutput["systemStatus"] =
        totalTasks === 0 || activeTasks === 0 ? "warning" : "healthy";

      // Real server uptime
      const uptime = formatUptime(Math.floor(process.uptime()));

      // Task list when detailed=true
      let tasks: CronStatusResponseOutput["tasks"] = [];
      if (detailed) {
        const taskRows = await db
          .select()
          .from(cronTasks)
          .limit(20)
          .orderBy(cronTasks.createdAt);

        tasks = taskRows
          .filter((t) => !taskId || t.id === taskId)
          .map((t) => {
            let nextRun = t.nextExecutionAt?.toISOString() ?? null;
            if (!nextRun && t.enabled) {
              try {
                const interval = CronExpressionParser.parse(t.schedule);
                nextRun = interval.next().toISOString();
              } catch {
                // invalid schedule — leave null
              }
            }
            const status = !t.enabled
              ? CronTaskStatus.CANCELLED
              : (t.lastExecutionStatus ?? CronTaskStatus.SCHEDULED);
            return {
              id: t.id,
              name: t.name,
              status,
              lastRun: t.lastExecutedAt?.toISOString() ?? null,
              nextRun,
              schedule: t.schedule,
            };
          });
      }

      const response: CronStatusResponseOutput = {
        success: true,
        systemStatus,
        activeTasks,
        totalTasks,
        uptime,
        tasks,
      };

      logger.debug("Cron status retrieved successfully", {
        systemStatus: response.systemStatus,
        activeTasks: response.activeTasks,
        totalTasks: response.totalTasks,
      });

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to get cron status", {
        taskId: data.taskId,
        detailed: data.detailed,
        error: parsedError.message,
      });
      return fail({
        message:
          "app.api.system.unifiedInterface.tasks.cronSystem.status.errors.server.title",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
          taskId: data.taskId || "unknown",
        },
      });
    }
  }
}

// Export singleton instance
export const cronStatusRepository = new CronStatusRepositoryImpl();
