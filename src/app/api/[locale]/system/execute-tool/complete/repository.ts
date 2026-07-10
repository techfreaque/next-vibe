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
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import { scopedTranslation } from "next-vibe/execute-tool/complete/i18n";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CronTaskRow } from "next-vibe/tasks/cron/db";
import {
  cronTaskExecutions,
  cronTasks,
  dbUserIdToOwner,
} from "next-vibe/tasks/cron/db";
import { resolveTaskOwnerUser } from "next-vibe/tasks/cron/resolve-task-user";
import { CronTaskStatus } from "next-vibe/tasks/enum";

import type { CallbackModeValue } from "../constants";
import { CallbackMode } from "../constants";
import { TaskCompletion } from "../repository/completion";
import type { ReportRequestOutput, ReportResponseOutput } from "./definition";

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
    const { PendingCalls } = await import("../repository/pending-calls");
    const outcome = PendingCalls.complete(data.taskId, {
      status: finalStatus === CronTaskStatus.COMPLETED ? "completed" : "failed",
      output: data.output ?? null,
    });
    if (outcome.kind === "duplicate") {
      logger.debug("Task report (context): already finalized — skipping", {
        taskId: data.taskId,
      });
      return success({ processed: true });
    }
    // The registry outcome carries only the anchor (threadId + toolMessageId)
    // of the waiter that parked this call; everything else (model/skill/etc.)
    // comes from the wire context. The anchor wins so the correct tool message
    // is backfilled even if the wire context points elsewhere.
    const completed = outcome.kind === "completed" ? outcome : null;

    const revivalThreadId = completed?.threadId ?? ctx.threadId;
    const revivalToolMessageId = completed?.toolMessageId ?? ctx.toolMessageId;

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

      await TaskCompletion.handle({
        toolMessageId: revivalToolMessageId ?? "",
        threadId: revivalThreadId,
        callbackMode,
        status: finalStatus,
        output: data.output ?? null,
        taskId: data.taskId,
        modelId: ctx.modelId,
        skillId: ctx.skillId,
        favoriteId: ctx.favoriteId,
        leafMessageId: ctx.leafMessageId,
        subAgentDepth: ctx.subAgentDepth,
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
    user: JwtPayloadType,
    logger: EndpointLogger,
    locale: CountryLanguage,
    abortSignal: AbortSignal,
  ): Promise<ResponseType<ReportResponseOutput>> {
    const { t } = scopedTranslation.scopedT(locale);

    // AI-caller path: Claude Code / MCP calls complete-task with only taskId + response.
    // Normalize to the standard report shape before processing.
    if (!data.status && data.response) {
      data = {
        ...data,
        status: CronTaskStatus.COMPLETED,
        output: data.response,
      };
    }

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

    // Ownership check for direct AI-caller path (no wakeUpContext on wire).
    // Remote reports from other instances are trusted (validated by allowedRoles).
    if (!data.wakeUpContext) {
      const taskOwner = dbUserIdToOwner(task.userId);
      if (taskOwner.type === "user" && taskOwner.userId !== user.id) {
        return fail({
          message: t("taskReport.post.errors.forbidden.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    }

    // Idempotency: already completed → return success without re-firing revival.
    if (
      task.lastExecutionStatus === CronTaskStatus.COMPLETED &&
      !data.wakeUpContext
    ) {
      logger.info("[complete] Task already completed - skipping duplicate", {
        taskId: data.taskId,
      });
      return success({ processed: true });
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

        const updates: Partial<CronTaskRow> & { updatedAt: Date } = {
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

        // Merge result into the parked resume-stream task and fire it.
        await TaskCompletion.enableAndFireParkedResumeTask({
          taskId: task.id,
          status:
            finalStatus === CronTaskStatus.COMPLETED ? "completed" : "failed",
          output: data.output ?? null,
          locale,
          logger,
          abortSignal,
        });
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
