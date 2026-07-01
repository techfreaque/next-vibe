/**
 * Task Report Repository
 * Applies remote execution results to local task records.
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { fail, success } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { ReportRequestOutput, ReportResponseOutput } from "./definition";
import { scopedTranslation } from "next-vibe/execute-tool/complete/i18n";
import { handleTaskCompletion } from "next-vibe/execute-tool/handlers/task-completion-handler";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { NewCronTask } from "next-vibe/tasks/cron/db";
import {
  cronTaskExecutions,
  cronTasks,
  dbUserIdToOwner,
} from "next-vibe/tasks/cron/db";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { CallbackModeValue } from "../constants";
import { CallbackMode } from "../constants";

export class TaskReportRepository {
  /**
   * Process a report whose revival context rode the wire — no local task row.
   * Backfills the tool message and revives the waiting thread directly from
   * the payload (definite-outcome rule: failures revive too, with the error).
   */
  private static async processContextReport(
    data: ReportRequestOutput,
    ctx: NonNullable<ReportRequestOutput["wakeUpContext"]>,
    logger: EndpointLogger,
    locale: CountryLanguage,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<ReportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    if (data.status === CronTaskStatus.RUNNING) {
      // Progress ping — nothing to persist without a task row.
      logger.debug("Task report (context): RUNNING ping", {
        taskId: data.taskId,
      });
      return success({ processed: true });
    }

    const finalStatus =
      data.status === CronTaskStatus.COMPLETED
        ? CronTaskStatus.COMPLETED
        : data.status === CronTaskStatus.CANCELLED
          ? CronTaskStatus.CANCELLED
          : data.status === CronTaskStatus.TIMEOUT
            ? CronTaskStatus.TIMEOUT
            : CronTaskStatus.FAILED;

    const callbackMode: CallbackModeValue | null =
      ctx.callbackMode === CallbackMode.WAIT
        ? CallbackMode.WAIT
        : ctx.callbackMode === CallbackMode.DETACH
          ? CallbackMode.DETACH
          : ctx.callbackMode === CallbackMode.END_LOOP
            ? CallbackMode.END_LOOP
            : ctx.callbackMode === CallbackMode.WAKE_UP
              ? CallbackMode.WAKE_UP
              : ctx.callbackMode === CallbackMode.APPROVE
                ? CallbackMode.APPROVE
                : null;

    // Complete the in-memory pending call first: wakes await-task waiters
    // and yields a revival override if await-task attached one. "duplicate"
    // means the deadline (or another path) already finalized — skip revival.
    const { completePendingCall } = await import("../pending-calls");
    const outcome = completePendingCall(data.taskId, {
      status: finalStatus === CronTaskStatus.COMPLETED ? "completed" : "failed",
      output: data.output ?? null,
    });
    if (outcome.kind === "duplicate") {
      logger.debug("Task report (context): already finalized — skipping", {
        taskId: data.taskId,
      });
      return success({ processed: true });
    }
    const revival = outcome.kind === "completed" ? outcome.revival : null;

    const revivalThreadId = revival?.threadId ?? ctx.threadId;
    const revivalToolMessageId = revival?.toolMessageId ?? ctx.toolMessageId;

    if (!revivalToolMessageId && !revivalThreadId) {
      logger.warn("Task report (context): no revival target in context", {
        taskId: data.taskId,
      });
      return success({ processed: true });
    }

    const owner = dbUserIdToOwner(ctx.userId);
    const ownerContext = await resolveTaskOwnerUser(owner, locale, logger);
    if (!ownerContext) {
      logger.warn("Task report (context): owner user not resolvable", {
        taskId: data.taskId,
      });
      return fail({
        message: t("taskReport.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    try {
      const { RemoteConnectionRepository } =
        await import("@/app/api/[locale]/remote-connection/repository");
      const selfInstanceId =
        owner.type === "user"
          ? await RemoteConnectionRepository.getLocalInstanceId(owner.userId)
          : RemoteConnectionRepository.deriveDefaultSelfInstanceId();

      // Revival override from await-task (registry) wins over the wire
      // context — the waiter's tool message is what must be backfilled.
      const revivalMode: CallbackModeValue | null = revival
        ? revival.callbackMode === CallbackMode.WAIT
          ? CallbackMode.WAIT
          : CallbackMode.WAKE_UP
        : callbackMode;

      await handleTaskCompletion({
        toolMessageId: revivalToolMessageId ?? "",
        threadId: revivalThreadId,
        callbackMode: revivalMode,
        status: finalStatus,
        output: data.output ?? null,
        taskId: data.taskId,
        modelId: revival?.modelId ?? ctx.modelId,
        skillId: revival?.skillId ?? ctx.skillId,
        favoriteId: revival?.favoriteId ?? ctx.favoriteId,
        leafMessageId: revival?.leafMessageId ?? ctx.leafMessageId,
        subAgentDepth: revival?.subAgentDepth ?? ctx.subAgentDepth,
        ownerUser: ownerContext.user,
        logger,
        selfInstanceId,
        // Fire the revival immediately — without this the resume-stream task
        // waits for the next cron pulse (up to 60s of dead time per call).
        directResumeLocale: locale,
        abortSignal,
      });

      logger.info("Task report (context) applied", {
        taskId: data.taskId,
        status: finalStatus,
        executedBy: data.executedByInstance,
      });
      return success({ processed: true });
    } catch (error) {
      logger.error("Failed to apply context task report", parseError(error));
      return fail({
        message: t("taskReport.post.errors.internal.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

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

    logger.info("[TaskReport] Incoming report", {
      taskId: data.taskId,
      status: data.status,
      rowFound: Boolean(task),
      hasWakeUpContext: Boolean(data.wakeUpContext),
      ctxToolMessageId: data.wakeUpContext?.toolMessageId ?? null,
      ctxThreadId: data.wakeUpContext?.threadId ?? null,
    });

    if (!task) {
      // Context-on-wire path (remote-call/spec.md → No Remote Tasks): remote
      // calls carry their revival context in the report payload — no local
      // task row exists or is needed.
      if (data.wakeUpContext) {
        return await TaskReportRepository.processContextReport(
          data,
          data.wakeUpContext,
          logger,
          locale,
          abortSignal,
        );
      }
      logger.warn("Task report: task not found and no wakeUpContext", {
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
              await import("@/app/api/[locale]/remote-connection/repository");
            // getLocalInstanceId respects user-configured instance identity (DB);
            // falls back to deriveDefaultSelfInstanceId() (env-based) when no
            // record exists - on Thea (prod) this resolves to "thea".
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
