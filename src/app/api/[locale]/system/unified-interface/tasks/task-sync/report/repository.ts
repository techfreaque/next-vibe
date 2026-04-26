/**
 * Task Report Repository
 * Applies remote execution results to local task records.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { ErrorResponseTypes } from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { ResponseType } from "@/app/api/[locale]/shared/types/response.schema";
import { fail, success } from "@/app/api/[locale]/shared/types/response.schema";
import { db } from "@/app/api/[locale]/system/db";
import type { CallbackModeValue } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { CountryLanguage } from "@/i18n/core/config";
import type { NewCronTask } from "../../cron/db";
import { cronTaskExecutions, cronTasks, dbUserIdToOwner } from "../../cron/db";
import { resolveTaskOwnerUser } from "../../cron/resolve-task-user";
import { CronTaskStatus } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { handleTaskCompletion } from "../../task-completion-handler";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { ReportRequestOutput, ReportResponseOutput } from "./definition";

export class TaskReportRepository {
  static async processReport(
    data: ReportRequestOutput,
    logger: EndpointLogger,
    locale: CountryLanguage,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<ReportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    const [task] = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.id, data.taskId))
      .limit(1);

    if (!task) {
      logger.warn("Task report: task not found", {
        taskId: data.taskId,
      });
      return fail({
        message: t("taskReport.post.errors.notFound.title"),
        errorType: ErrorResponseTypes.NOT_FOUND,
      });
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

        const updates: Partial<NewCronTask<Record<string, WidgetData>>> & {
          updatedAt: Date;
        } = {
          lastExecutedAt: now,
          lastExecutionStatus: finalStatus,
          lastExecutionDuration: data.durationMs ?? null,
          executionCount: task.executionCount + 1,
          updatedAt: now,
        };

        if (data.status === CronTaskStatus.COMPLETED) {
          updates.successCount = task.successCount + 1;
        } else {
          updates.errorCount = task.errorCount + 1;
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

        // Read revival context from typed wakeUp* columns - not from untyped taskInput JSON.
        const toolMessageId = task.wakeUpToolMessageId ?? null;
        const threadId = task.wakeUpThreadId ?? null;
        const rawCallbackMode = task.wakeUpCallbackMode;
        const callbackMode: CallbackModeValue | null =
          rawCallbackMode === CallbackMode.WAIT
            ? CallbackMode.WAIT
            : rawCallbackMode === CallbackMode.DETACH
              ? CallbackMode.DETACH
              : rawCallbackMode === CallbackMode.END_LOOP
                ? CallbackMode.END_LOOP
                : rawCallbackMode === CallbackMode.WAKE_UP
                  ? CallbackMode.WAKE_UP
                  : rawCallbackMode === CallbackMode.APPROVE
                    ? CallbackMode.APPROVE
                    : null;

        const owner = dbUserIdToOwner(task.userId);

        if (toolMessageId ?? threadId) {
          const ownerContext = await resolveTaskOwnerUser(
            owner,
            locale,
            logger,
          );
          if (ownerContext) {
            const { RemoteConnectionRepository } =
              await import("@/app/api/[locale]/user/remote-connection/repository");
            // getLocalInstanceId respects user-configured instance identity (DB);
            // falls back to deriveDefaultSelfInstanceId() (env-based) when no
            // record exists — on Thea (prod) this resolves to "thea".
            const selfInstanceId =
              owner.type === "user"
                ? await RemoteConnectionRepository.getLocalInstanceId(
                    owner.userId,
                  )
                : RemoteConnectionRepository.deriveDefaultSelfInstanceId();

            await handleTaskCompletion({
              toolMessageId: toolMessageId ?? "",
              threadId,
              callbackMode,
              status: finalStatus,
              output: data.output ?? null,
              taskId: task.id,
              modelId: task.wakeUpModelId ?? null,
              skillId: task.wakeUpSkillId ?? null,
              favoriteId: task.wakeUpFavoriteId ?? null,
              leafMessageId: task.wakeUpLeafMessageId ?? null,
              subAgentDepth: task.wakeUpSubAgentDepth ?? 0,
              ownerUser: ownerContext.user,
              logger,
              // Pin resume-stream to THIS instance so Hermes (remote) doesn't
              // steal the revival cron task that must run on Thea (prod).
              selfInstanceId,
              abortSignal,
            });
          }
        }
      }

      return success({ processed: true });
    } catch (error) {
      logger.error("Failed to apply task report", parseError(error));
      return fail({
        message: t("taskReport.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
