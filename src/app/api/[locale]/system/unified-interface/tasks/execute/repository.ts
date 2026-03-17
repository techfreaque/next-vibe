/**
 * Task Execute Repository
 * Executes a single cron task by ID with permission enforcement
 */

import "server-only";

import { and, eq, isNull, ne, or, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  isFileResponse,
  isStreamingResponse,
  success,
} from "next-vibe/shared/types/response.schema";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { LeadAuthRepository } from "@/app/api/[locale]/leads/auth/repository";
import { db } from "@/app/api/[locale]/system/db";
import { getRouteHandler } from "@/app/api/[locale]/system/generated/route-handlers";
import type { CallbackModeValue } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getFullPath } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import { splitTaskArgs } from "@/app/api/[locale]/system/unified-interface/tasks/cron/arg-splitter";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import { CronTasksRepository } from "@/app/api/[locale]/system/unified-interface/tasks/cron/repository";
import {
  CronTaskStatus,
  type CronTaskStatusValue,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { scopedTranslation as tasksScopedTranslation } from "@/app/api/[locale]/system/unified-interface/tasks/i18n";
import { handleTaskCompletion } from "@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler";
import { pushStatusToRemote } from "@/app/api/[locale]/system/unified-interface/tasks/task-sync/repository";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import { AuthRepository } from "@/app/api/[locale]/user/auth/repository";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { users as usersTable } from "@/app/api/[locale]/user/db";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { UserRolesRepository } from "@/app/api/[locale]/user/user-roles/repository";
import { env } from "@/config/env";
import type { CountryLanguage } from "@/i18n/core/config";

import type {
  TaskExecuteRequestOutput,
  TaskExecuteResponseOutput,
} from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class TaskExecuteRepository {
  /**
   * Execute a single cron task by its DB id.
   * Permission rules:
   *   - ADMIN: can run any task (including system tasks where userId is null)
   *   - CUSTOMER: can only run tasks where task.userId === current user's id
   */
  static async executeTask(
    data: TaskExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
  ): Promise<ResponseType<TaskExecuteResponseOutput>> {
    const isAdmin =
      !user.isPublic && user.roles.includes(UserPermissionRole.ADMIN);
    const currentUserId = !user.isPublic ? user.id : null;

    // 1. Fetch the task
    const rows = await db
      .select()
      .from(cronTasks)
      .where(eq(cronTasks.id, data.taskId))
      .limit(1);

    const task = rows[0];
    if (!task) {
      return fail({
        message: t("errors.notFound"),
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { taskId: data.taskId },
      });
    }

    // 2. Permission check
    if (!isAdmin) {
      // Customers can only run their own tasks
      if (!currentUserId || task.userId !== currentUserId) {
        return fail({
          message: t("errors.forbidden"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }
    }

    // 3. Overlap prevention — skip if still running
    if (task.lastExecutionStatus === CronTaskStatus.RUNNING) {
      return fail({
        message: t("errors.alreadyRunning"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // 4. Atomically claim the task
    const claimed = await db.transaction(async (tx) => {
      const [row] = await tx
        .select()
        .from(cronTasks)
        .where(
          and(
            eq(cronTasks.id, task.id),
            or(
              isNull(cronTasks.lastExecutionStatus),
              ne(cronTasks.lastExecutionStatus, CronTaskStatus.RUNNING),
            ),
          ),
        )
        .for("update", { skipLocked: true })
        .limit(1);

      if (!row) {
        return null;
      }

      await tx
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.RUNNING,
          ...(task.runOnce ? { enabled: false } : {}),
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return row;
    });

    if (!claimed) {
      return fail({
        message: t("errors.alreadyRunning"),
        errorType: ErrorResponseTypes.CONFLICT,
      });
    }

    // 5. Resolve execution user context
    const taskUserContext = await TaskExecuteRepository.resolveTaskUser(
      task.userId,
      locale,
      logger,
    );

    if (!taskUserContext) {
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const { user: execUser, locale: execLocale } = taskUserContext;
    const { t: tTask } = tasksScopedTranslation.scopedT(execLocale);

    // 6. Resolve routeId → handler
    const path = getFullPath(task.routeId);
    const handler = path ? await getRouteHandler(path) : null;

    if (!path || !handler) {
      await db
        .update(cronTasks)
        .set({
          lastExecutionStatus: CronTaskStatus.FAILED,
          updatedAt: new Date(),
        })
        .where(eq(cronTasks.id, task.id));

      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    const startedAt = new Date();
    const timeoutMs = task.timeout ?? 300000;
    const maxRetries = task.retries ?? 0;
    const retryDelayMs = task.retryDelay ?? 30000;

    const { getLocalInstanceId, deriveDefaultSelfInstanceId } =
      await import("@/app/api/[locale]/user/remote-connection/repository");
    const instanceId = user.id
      ? await getLocalInstanceId(user.id)
      : deriveDefaultSelfInstanceId();

    // Fire-and-forget: notify remote RUNNING
    if (task.targetInstance) {
      void pushStatusToRemote({
        taskId: task.id,
        status: CronTaskStatus.RUNNING,
        summary: "",
        durationMs: null,
        startedAt: startedAt.toISOString(),
        serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        executedByInstance: instanceId,
        logger,
      }).catch((pushErr) => {
        logger.warn("pushStatusToRemote (RUNNING) failed", {
          taskId: task.id,
          error: String(pushErr),
        });
      });
    }

    const taskInput = task.taskInput ?? {};
    const { urlPathParams, data: handlerData } = await splitTaskArgs(
      path,
      taskInput,
    );

    let finalStatus: typeof CronTaskStatusValue = CronTaskStatus.FAILED;
    let finalMessage: string | null = null;
    let finalDurationMs = 0;
    let taskSucceeded = false;
    let finalResult: JsonValue | null = null;
    let firstExecutionId: string | null = null;
    let didLogHistory = false;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        logger.debug(
          `TaskExecute: retrying "${task.displayName}" (attempt ${attempt + 1}/${maxRetries + 1}) after ${retryDelayMs}ms`,
        );
        await new Promise<void>((resolve) => {
          setTimeout(resolve, retryDelayMs);
        });
      }

      const attemptStart = Date.now();

      let typedResult: ResponseType<Record<string, string | number | boolean>>;
      try {
        const result = (await Promise.race([
          handler({
            data: handlerData,
            urlPathParams,
            user: execUser,
            locale: execLocale,
            logger,
            platform: Platform.CRON,
            streamContext: {
              rootFolderId: DefaultFolderId.CRON,
              threadId: undefined,
              aiMessageId: undefined,
              currentToolMessageId: undefined,
              callerToolCallId: undefined,
              pendingToolMessages: undefined,
              pendingTimeoutMs: undefined,
              leafMessageId: undefined,
              favoriteId: undefined,
              skillId: undefined,
              modelId: undefined,
              headless: undefined,
              waitingForRemoteResult: undefined,
              abortSignal: undefined,
              escalateToTask: undefined,
            },
          }),
          new Promise<never>((...[, reject]) => {
            setTimeout(() => reject(new Error("TASK_TIMEOUT")), timeoutMs);
          }),
        ])) as Awaited<ReturnType<typeof handler>>;

        typedResult =
          isStreamingResponse(result) || isFileResponse(result)
            ? (fail({
                message: tTask("errors.repositoryInternalError"),
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
              }) as ResponseType<Record<string, string | number | boolean>>)
            : (result as ResponseType<
                Record<string, string | number | boolean>
              >);
      } catch (taskErr) {
        const isTimeout =
          taskErr instanceof Error && taskErr.message === "TASK_TIMEOUT";
        typedResult = fail({
          message: tTask("errors.repositoryInternalError"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }) as ResponseType<Record<string, string | number | boolean>>;
        finalStatus = isTimeout
          ? CronTaskStatus.TIMEOUT
          : CronTaskStatus.FAILED;
      }

      const attemptDuration = Date.now() - attemptStart;
      const attemptStatus: typeof CronTaskStatusValue = typedResult.success
        ? CronTaskStatus.COMPLETED
        : finalStatus === CronTaskStatus.TIMEOUT
          ? CronTaskStatus.TIMEOUT
          : CronTaskStatus.FAILED;

      const shouldLogHistory =
        !typedResult.success ||
        !task.historyInterval ||
        !task.lastHistoryLoggedAt ||
        Date.now() - task.lastHistoryLoggedAt.getTime() >= task.historyInterval;

      if (shouldLogHistory) {
        const execResponse = await CronTasksRepository.createExecution(
          {
            taskId: task.id,
            taskName: task.displayName,
            executionId: crypto.randomUUID(),
            status: attemptStatus,
            priority: task.priority,
            startedAt: new Date(attemptStart),
            completedAt: new Date(),
            durationMs: attemptDuration,
            config: taskInput,
            result: typedResult.success ? (typedResult.data ?? null) : null,
            retryAttempt: attempt,
            parentExecutionId: firstExecutionId,
            triggeredBy: "manual",
          },
          tTask,
          logger,
        );

        if (attempt === 0 && execResponse.success) {
          firstExecutionId = execResponse.data.id;
        }
        didLogHistory = true;
      }

      finalDurationMs += attemptDuration;

      if (typedResult.success) {
        taskSucceeded = true;
        finalStatus = CronTaskStatus.COMPLETED;
        finalMessage = null;
        finalResult = (typedResult.data as JsonValue) ?? null;
        break;
      }

      finalStatus = attemptStatus;
      finalMessage = typedResult.message ?? null;
    }

    // 7. Update task stats atomically
    const newConsecutiveFailures = taskSucceeded
      ? 0
      : (task.consecutiveFailures ?? 0) + 1;

    await db
      .update(cronTasks)
      .set({
        lastExecutedAt: startedAt,
        lastExecutionStatus: finalStatus,
        lastExecutionDuration: finalDurationMs,
        executionCount: sql`${cronTasks.executionCount} + 1`,
        consecutiveFailures: newConsecutiveFailures,
        ...(taskSucceeded
          ? { successCount: sql`${cronTasks.successCount} + 1` }
          : { errorCount: sql`${cronTasks.errorCount} + 1` }),
        ...(didLogHistory ? { lastHistoryLoggedAt: new Date() } : {}),
        updatedAt: new Date(),
      })
      .where(eq(cronTasks.id, task.id));

    // 8. If task has callback context (set by execute-tool AI path), emit
    //    TASK_COMPLETED WS event + insert deferred result message for endLoop,
    //    or schedule resume-stream for wakeUp/wait.
    // Read from typed wakeUp* columns — not from untyped taskInput JSON blob.
    const taskCallbackMode =
      (task.wakeUpCallbackMode as CallbackModeValue | null) ?? null;
    const taskThreadId = task.wakeUpThreadId ?? null;
    const taskToolMessageId = task.wakeUpToolMessageId ?? null;
    const completionUserId = taskUserContext?.user.id ?? currentUserId ?? null;

    // Skip handleTaskCompletion for remote tasks (targetInstance set) — the
    // originator receives the result via /report and runs handleTaskCompletion
    // there. Running it here would create resume-stream on the wrong instance
    // and try to backfill a toolMessageId that doesn't exist locally.
    if (taskToolMessageId && completionUserId && !task.targetInstance) {
      await handleTaskCompletion({
        toolMessageId: taskToolMessageId,
        threadId: taskThreadId,
        callbackMode: taskCallbackMode,
        status: finalStatus,
        output: taskSucceeded ? finalResult : null,
        taskId: task.id,
        modelId: task.wakeUpModelId ?? null,
        skillId: task.wakeUpSkillId ?? null,
        favoriteId: task.wakeUpFavoriteId ?? null,
        leafMessageId: task.wakeUpLeafMessageId ?? null,
        userId: completionUserId,
        logger,
        directResumeUser: taskUserContext?.user ?? user,
        directResumeLocale: locale,
      }).catch((completionErr: Error) => {
        logger.error("handleTaskCompletion failed", {
          taskId: task.id,
          error: completionErr.message,
        });
      });
    }

    // Fire-and-forget: push final status to remote
    if (task.targetInstance) {
      void pushStatusToRemote({
        taskId: task.id,
        status: finalStatus,
        summary: finalMessage ?? "",
        durationMs: finalDurationMs,
        executionId: firstExecutionId ?? undefined,
        output: finalResult as Record<string, JsonValue> | undefined,
        startedAt: startedAt.toISOString(),
        serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        executedByInstance: instanceId,
        logger,
      }).catch((pushErr) => {
        logger.warn("pushStatusToRemote (final) failed", {
          taskId: task.id,
          error: String(pushErr),
        });
      });
    }

    if (!taskSucceeded) {
      logger.error("Task execution failed", {
        taskId: task.id,
        message: finalMessage,
      });
      return fail({
        message: t("errors.executeTask"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }

    return success<TaskExecuteResponseOutput>({
      success: true,
      taskId: task.id,
      taskName: task.displayName,
      executedAt: startedAt.toISOString(),
      duration: finalDurationMs,
      status: finalStatus,
    });
  }

  /**
   * Resolve the user context for task execution.
   * For system tasks (userId=null), uses the admin account.
   * For user tasks, resolves the actual user's roles/locale.
   */
  private static async resolveTaskUser(
    taskUserId: string | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<{ user: JwtPrivatePayloadType; locale: CountryLanguage } | null> {
    if (!taskUserId) {
      // System task — use admin account
      const adminEmail = env.VIBE_ADMIN_USER_EMAIL;
      if (!adminEmail) {
        return null;
      }
      const authResult = await AuthRepository.authenticateUserByEmail(
        adminEmail,
        locale,
        logger,
      );
      if (!authResult.success || !authResult.data) {
        return null;
      }
      return { user: authResult.data, locale };
    }

    // User task — resolve their locale and roles
    let userLocale: CountryLanguage = locale;
    const ownerRow = await db
      .select({ locale: usersTable.locale })
      .from(usersTable)
      .where(eq(usersTable.id, taskUserId))
      .limit(1);
    if (ownerRow[0]?.locale) {
      userLocale = ownerRow[0].locale;
    }

    const rolesResult = await UserRolesRepository.getUserRoles(
      taskUserId,
      logger,
      userLocale,
    );
    if (!rolesResult.success) {
      return null;
    }

    const { leadId } = await LeadAuthRepository.getAuthenticatedUserLeadId(
      taskUserId,
      undefined,
      userLocale,
      logger,
    );

    return {
      user: {
        id: taskUserId,
        leadId,
        isPublic: false as const,
        roles: rolesResult.data,
      },
      locale: userLocale,
    };
  }
}
