/**
 * Task Report Route Handler
 * Validates API key, applies execution result to local task record.
 */

import { eq, sql } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { CallbackModeValue } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import type { NewCronTask } from "../../cron/db";
import { cronTaskExecutions, cronTasks } from "../../cron/db";
import { CronTaskStatus } from "../../enum";
import { handleTaskCompletion } from "../../task-completion-handler";
import { endpoints } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const [task] = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, data.taskId))
        .limit(1);

      if (!task) {
        logger.warn("Task report: task not found", {
          taskId: data.taskId,
        });
        return {
          success: false as const,
          message: t("taskReport.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        };
      }

      const now = new Date();
      const isRunning = data.status === CronTaskStatus.RUNNING;

      try {
        if (isRunning) {
          // RUNNING: update task status only (visibility for Thea)
          await db
            .update(cronTasks)
            .set({
              lastExecutionStatus: CronTaskStatus.RUNNING,
              updatedAt: now,
            })
            .where(eq(cronTasks.id, task.id));

          logger.info("Task report: RUNNING", {
            taskId: task.id,
            routeId: task.routeId,
            executedBy: data.executedByInstance,
          });
        } else {
          // Terminal status: update counters + create execution record
          const finalStatus =
            data.status === CronTaskStatus.COMPLETED
              ? CronTaskStatus.COMPLETED
              : data.status === CronTaskStatus.CANCELLED
                ? CronTaskStatus.CANCELLED
                : data.status === CronTaskStatus.TIMEOUT
                  ? CronTaskStatus.TIMEOUT
                  : CronTaskStatus.FAILED;

          const updates: Partial<NewCronTask> & { updatedAt: Date } = {
            lastExecutedAt: now,
            lastExecutionStatus: finalStatus,
            lastExecutionDuration: data.durationMs ?? null,
            executionCount: task.executionCount + 1,
            updatedAt: now,
          };

          if (data.status === CronTaskStatus.COMPLETED) {
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

          // Create execution record on remote for full history visibility
          const executionId =
            data.executionId ?? `report-${task.id}-${now.getTime()}`;
          const startedAt = data.startedAt ? new Date(data.startedAt) : now;

          await db
            .insert(cronTaskExecutions)
            .values({
              taskId: task.id,
              taskName: task.routeId,
              executionId,
              status: finalStatus,
              priority: task.priority,
              startedAt,
              completedAt: now,
              durationMs: data.durationMs ?? null,
              result: data.output ?? null,
              triggeredBy: "remote",
              serverTimezone: data.serverTimezone ?? null,
              executedByInstance: data.executedByInstance ?? null,
              environment: "remote",
              config: {},
            })
            .onConflictDoUpdate({
              target: [cronTaskExecutions.executionId],
              set: {
                status: sql`excluded.status`,
                completedAt: sql`excluded.completed_at`,
                durationMs: sql`excluded.duration_ms`,
                result: sql`excluded.result`,
              },
            });

          logger.info("Task report applied with execution record", {
            taskId: task.id,
            routeId: task.routeId,
            status: finalStatus,
            executionId,
            executedBy: data.executedByInstance,
            serverTz: data.serverTimezone,
          });

          const taskInput = task.taskInput ?? {};
          const toolMessageId =
            typeof taskInput.toolMessageId === "string"
              ? taskInput.toolMessageId
              : null;
          const threadId =
            typeof taskInput.threadId === "string" ? taskInput.threadId : null;
          const rawCallbackMode = taskInput.callbackMode;
          const callbackMode: CallbackModeValue | null =
            rawCallbackMode === CallbackMode.WAIT
              ? CallbackMode.WAIT
              : rawCallbackMode === CallbackMode.BACKGROUND
                ? CallbackMode.BACKGROUND
                : rawCallbackMode === CallbackMode.NO_LOOP
                  ? CallbackMode.NO_LOOP
                  : rawCallbackMode === CallbackMode.WAKE_UP
                    ? CallbackMode.WAKE_UP
                    : rawCallbackMode === CallbackMode.REQUIRES_CONFIRMATION
                      ? CallbackMode.REQUIRES_CONFIRMATION
                      : null;

          if ((toolMessageId ?? threadId) && task.userId) {
            await handleTaskCompletion({
              toolMessageId: toolMessageId ?? "",
              threadId,
              callbackMode,
              status: finalStatus,
              output: data.output ?? null,
              taskId: task.id,
              taskInput: task.taskInput,
              userId: task.userId,
              logger,
            });
          }
        }

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
