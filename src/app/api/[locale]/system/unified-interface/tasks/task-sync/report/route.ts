/**
 * Task Report Route Handler
 * Validates API key, applies execution result to local task record.
 */

import { eq, sql } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { env } from "@/config/env";

import type { NewCronTask } from "../../cron/db";
import { cronTasks } from "../../cron/db";
import { CronTaskStatus } from "../../enum";
import { endpoints } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      // Validate API key
      if (!env.THEA_REMOTE_API_KEY || data.apiKey !== env.THEA_REMOTE_API_KEY) {
        return {
          success: false as const,
          message: t("taskReport.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        };
      }

      // Find the task by routeId
      const [task] = await db
        .select()
        .from(cronTasks)
        .where(sql`${cronTasks.routeId} = ${data.taskRouteId}`)
        .limit(1);

      if (!task) {
        logger.warn("Task report: task not found", {
          routeId: data.taskRouteId,
        });
        return {
          success: false as const,
          message: t("taskReport.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        };
      }

      const now = new Date();
      const finalStatus =
        data.status === "completed"
          ? CronTaskStatus.COMPLETED
          : CronTaskStatus.FAILED;

      try {
        const updates: Partial<NewCronTask> & { updatedAt: Date } = {
          lastExecutedAt: now,
          lastExecutionStatus: finalStatus,
          lastExecutionDuration: data.durationMs ?? null,
          executionCount: task.executionCount + 1,
          updatedAt: now,
        };

        if (data.status === "completed") {
          updates.successCount = task.successCount + 1;
          updates.lastExecutionError = null;
        } else {
          updates.errorCount = task.errorCount + 1;
          updates.lastExecutionError = data.error ?? data.summary ?? null;
        }

        // Run-once tasks: disable after completion
        if (task.runOnce) {
          updates.enabled = false;
        }

        await db
          .update(cronTasks)
          .set(updates)
          .where(eq(cronTasks.id, task.id));

        logger.info("Task report applied", {
          taskId: task.id,
          routeId: task.routeId,
          status: finalStatus,
          executedBy: data.executedByInstance,
          serverTz: data.serverTimezone,
        });

        return {
          success: true as const,
          data: { processed: true },
        };
      } catch (error) {
        logger.error("Failed to apply task report", parseError(error));
        return {
          success: false as const,
          message: t("taskReport.post.errors.internal.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        };
      }
    },
  },
});
