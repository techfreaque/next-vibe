/**
 * Route Execute Repository
 * Delegates execution to RouteExecutionExecutor.executeGenericHandler.
 * Auth is enforced by the target route handler.
 *
 * On success: returns success(result.data) — model gets the target's data flat.
 * On failure: propagates the target's fail() — model gets the error.
 *
 * Remote execution (instanceId provided):
 * Creates a one-shot cron task targeting the remote instance and returns
 * {taskId, status: "pending"} immediately. The local instance picks it up
 * on the next pulse.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import { handleTaskCompletion } from "@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { scopedTranslation } from "../i18n";
import type { TaskRoutingContext } from "./constants";
import { CallbackMode } from "./constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseInput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class RouteExecuteRepository {
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      // Wait for stream-part-handler to set currentToolMessageId.
      // execute() starts concurrently with stream-part-handler's tool-call processing —
      // poll up to 200ms to let stream-part-handler catch up and set the field.
      if (streamContext && !streamContext.currentToolMessageId) {
        for (let i = 0; i < 40; i++) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 5);
          });
          if (streamContext.currentToolMessageId) {
            break;
          }
        }
      }

      // Bail out immediately if the stream was cancelled before tool execution started.
      // The abort signal fires when StreamRegistry.cancel() is called — any DB writes
      // or network calls after this point would create orphaned rows.
      if (streamContext?.abortSignal?.aborted) {
        logger.info(
          "[RouteExecute] Stream was cancelled before tool execution started — skipping",
          { toolName: data.toolName },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Split prefixed tool ID: "hermes__ssh_exec_POST" → instanceId="hermes", toolName="ssh_exec_POST"
      // Prefixed form takes precedence over explicit instanceId prop
      let toolName = data.toolName;
      let instanceId = data.instanceId;
      const separatorIdx = toolName.indexOf("__");
      if (separatorIdx !== -1) {
        instanceId = toolName.slice(0, separatorIdx);
        toolName = toolName.slice(separatorIdx + 2);
      }

      const { input } = data;

      // Remote execution path — create a one-shot task for the target instance
      if (instanceId && !user.isPublic) {
        // Normalize incoming toolName to preferred name (alias > canonical).
        // Capabilities are stored using the preferred name so both alias and
        // full-path forms resolve to the same snapshot entry.
        toolName = getPreferredName(toolName);

        logger.info("[RouteExecute] Creating remote task", {
          toolName,
          instanceId,
        });

        // Validate toolName against stored capability snapshot
        const { getConnectionForInstance } =
          await import("@/app/api/[locale]/user/remote-connection/repository");
        const connInfo = await getConnectionForInstance(user.id, instanceId);

        if (connInfo === null || connInfo.capabilities === null) {
          // Capability snapshot not yet synced — fail closed.
          // Allowing through would let any tool name pass before the first sync,
          // creating a window where an attacker could call arbitrary remote endpoints.
          logger.warn(
            "[RouteExecute] no capability snapshot for instance — rejecting",
            {
              toolName,
              instanceId,
            },
          );
          return fail({
            message: t("executeTool.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { toolName },
          });
        }

        const { capabilities, remoteInstanceId } = connInfo;
        // Use the remote's actual INSTANCE_ID for targetInstance so task-sync
        // can route the task correctly (task-sync matches targetInstance = remoteInstanceId).
        // Falls back to the raw instanceId if remoteInstanceId is not set.
        const effectiveTargetInstance = remoteInstanceId ?? instanceId;

        const known = capabilities.some((c) => c.toolName === toolName);
        if (!known) {
          logger.warn("[RouteExecute] toolName not in capability snapshot", {
            toolName,
            instanceId,
            knownCount: capabilities.length,
          });
          return fail({
            message: t("executeTool.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { toolName },
          });
        }

        const callbackMode = data.callbackMode ?? CallbackMode.WAIT;

        // Get threadId and tool message ID from streamContext (set by the calling AI stream)
        const effectiveThreadId = streamContext?.threadId;
        // currentToolMessageId is the TOOL call message DB row ID (set by stream-part-handler
        // after tool-call event, before execute() runs). Falls back to aiMessageId if not set.
        const effectiveToolMessageId =
          streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

        const taskId = `remote-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        // Capture model + character + favoriteId from the originating stream so
        // resume-stream can restart the AI turn with the same context.
        const streamModelId = streamContext?.modelId;
        const streamCharacterId = streamContext?.characterId;
        const streamFavoriteId = streamContext?.favoriteId;

        await db.insert(cronTasks).values({
          id: taskId,
          routeId: toolName,
          displayName: `Remote: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *", // run every minute — runOnce disables after first execution
          priority: CronTaskPriority.HIGH,
          enabled: true,
          runOnce: true,
          taskInput: {
            ...(input ?? {}),
            // Routing context — read by handleTaskCompletion on completion.
            ...({
              callbackMode,
              ...(effectiveThreadId ? { threadId: effectiveThreadId } : {}),
              ...(effectiveToolMessageId
                ? { toolMessageId: effectiveToolMessageId }
                : {}),
              // Resume context — used by handleTaskCompletion to spawn resume-stream task.
              ...(streamModelId ? { modelId: streamModelId } : {}),
              ...(streamCharacterId ? { characterId: streamCharacterId } : {}),
              ...(streamFavoriteId ? { favoriteId: streamFavoriteId } : {}),
            } satisfies TaskRoutingContext),
          },
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["remote", instanceId],
          targetInstance: effectiveTargetInstance,
          userId: user.id,
        });

        // Signal the stream to pause and wait when callbackMode=wait.
        // finish-step-handler aborts after this tool step; /report resumes
        // via headless stream when the remote result arrives.
        if (callbackMode === CallbackMode.WAIT && streamContext) {
          streamContext.waitingForRemoteResult = true;
        }

        // All remote calls are async — return pending immediately.
        // /report backfills the result into the tool message and starts a headless
        // stream if callbackMode=wakeUp. TASK_COMPLETED WS event notifies the UI.
        return success({
          result: undefined,
          taskId,
          status: CronTaskStatus.PENDING,
          ...(callbackMode === CallbackMode.DETACH
            ? {
                hint: "Task detached. Use wait-for-task with this taskId if you need the result.",
              }
            : {}),
        });
      }

      const callbackMode = data.callbackMode ?? null;

      // Local background: execute inline, store result in task execution history,
      // return { taskId, status: "pending" } to AI. handleTaskCompletion emits
      // the TASK_COMPLETED WS event and inserts the deferred result message.
      if (callbackMode === CallbackMode.DETACH) {
        const taskId = `local-bg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const executionId = `exec-${taskId}`;
        const startedAt = new Date();

        logger.info("[RouteExecute] Executing local background route", {
          toolName,
          taskId,
        });

        const effectiveThreadId = streamContext.threadId;
        const effectiveToolMessageId =
          streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

        await db.insert(cronTasks).values({
          id: taskId,
          routeId: toolName,
          displayName: `Background: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *",
          priority: CronTaskPriority.HIGH,
          enabled: false,
          runOnce: true,
          taskInput: {
            ...(input ?? {}),
            callbackMode: CallbackMode.DETACH,
            ...(effectiveThreadId ? { threadId: effectiveThreadId } : {}),
            ...(effectiveToolMessageId
              ? { toolMessageId: effectiveToolMessageId }
              : {}),
          },
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["detach", "local"],
          userId: user.id,
        });

        const result = await RouteExecutionExecutor.executeGenericHandler<
          Record<string, JsonValue>
        >({
          toolName,
          data: input ?? {},
          user,
          locale,
          logger,
          platform: Platform.MCP,
          streamContext: {
            rootFolderId: DefaultFolderId.CRON,
            threadId: undefined,
            aiMessageId: undefined,
            currentToolMessageId: undefined,
            characterId: undefined,
            modelId: undefined,
            favoriteId: undefined,
            headless: undefined,
            waitingForRemoteResult: undefined,
            abortSignal: undefined,
          },
        });

        const completedAt = new Date();
        const finalStatus = result.success
          ? CronTaskStatus.COMPLETED
          : CronTaskStatus.FAILED;
        const finalResult =
          result.success && result.data !== undefined ? result.data : null;

        await db.insert(cronTaskExecutions).values({
          taskId,
          taskName: toolName,
          executionId,
          status: finalStatus,
          priority: CronTaskPriority.HIGH,
          startedAt,
          completedAt,
          durationMs: completedAt.getTime() - startedAt.getTime(),
          result: finalResult ?? undefined,
          triggeredBy: "detach",
          config: {},
        });

        // detach: result stays in task history only — never injected into thread.
        // Delete the cron task row immediately — nobody needs to poll it.
        // Emit TASK_COMPLETED WS so UI bubble updates, but no deferred message.
        await db.delete(cronTasks).where(eq(cronTasks.id, taskId));

        if (effectiveToolMessageId && effectiveThreadId && !user.isPublic) {
          await handleTaskCompletion({
            toolMessageId: effectiveToolMessageId,
            threadId: effectiveThreadId,
            callbackMode: null, // null = WS event + backfill only, no deferred message
            status: finalStatus,
            output: null, // no result injected into thread
            taskId,
            taskInput: null,
            userId: user.id,
            logger,
          });
        }

        return success({
          taskId,
          hint: "Task detached. Use wait-for-task with this taskId if you need the result.",
        });
      }

      // Local wakeUp: execute inline, backfill tool message + schedule resume-stream.
      // Stream is NOT paused — AI continues naturally with the result.
      // resume-stream is scheduled as a safety net: if the stream is still alive it
      // no-ops (isStreaming=true check); if it has died (e.g. HTTP timeout, next turn
      // was the last), interactive stream revives the thread when the async side signals done.
      if (callbackMode === CallbackMode.WAKE_UP) {
        const taskId = `local-wu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const executionId = `exec-${taskId}`;
        const startedAt = new Date();

        logger.info("[RouteExecute] Executing local wakeUp route", {
          toolName,
          taskId,
        });

        await db.insert(cronTasks).values({
          id: taskId,
          routeId: toolName,
          displayName: `WakeUp: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *",
          priority: CronTaskPriority.HIGH,
          enabled: false,
          runOnce: true,
          taskInput: input ?? {},
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["wakeup", "local"],
          userId: user.id,
        });

        const result = await RouteExecutionExecutor.executeGenericHandler<
          Record<string, JsonValue>
        >({
          toolName,
          data: input ?? {},
          user,
          locale,
          logger,
          platform: Platform.MCP,
          streamContext: {
            rootFolderId: DefaultFolderId.CRON,
            threadId: undefined,
            aiMessageId: undefined,
            currentToolMessageId: undefined,
            characterId: undefined,
            modelId: undefined,
            favoriteId: undefined,
            headless: undefined,
            waitingForRemoteResult: undefined,
            abortSignal: undefined,
          },
        });

        const completedAt = new Date();
        const finalStatus = result.success
          ? CronTaskStatus.COMPLETED
          : CronTaskStatus.FAILED;
        const finalResult =
          result.success && result.data !== undefined ? result.data : null;

        await db.insert(cronTaskExecutions).values({
          taskId,
          taskName: toolName,
          executionId,
          status: finalStatus,
          priority: CronTaskPriority.HIGH,
          startedAt,
          completedAt,
          durationMs: completedAt.getTime() - startedAt.getTime(),
          result: finalResult ?? undefined,
          triggeredBy: "wakeup",
          config: {},
        });

        await db
          .update(cronTasks)
          .set({
            lastExecutionStatus: finalStatus,
            lastExecutedAt: completedAt,
            lastExecutionDuration: completedAt.getTime() - startedAt.getTime(),
            enabled: false,
            updatedAt: completedAt,
          })
          .where(eq(cronTasks.id, taskId));

        const effectiveThreadId = streamContext?.threadId;
        const effectiveToolMessageId =
          streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

        if (effectiveThreadId && effectiveToolMessageId && user.id) {
          await handleTaskCompletion({
            toolMessageId: effectiveToolMessageId,
            threadId: effectiveThreadId,
            callbackMode: CallbackMode.WAKE_UP,
            status: finalStatus,
            output: finalResult,
            taskId,
            taskInput: {
              ...(streamContext?.modelId
                ? { modelId: streamContext.modelId }
                : {}),
              ...(streamContext?.characterId
                ? { characterId: streamContext.characterId }
                : {}),
              ...(streamContext?.favoriteId
                ? { favoriteId: streamContext.favoriteId }
                : {}),
            },
            userId: user.id,
            logger,
          });
        }

        // wakeUp: return taskId + hint only — result is delivered via resume-stream
        // which injects a tool result message into the loop (live or revived).
        // Args are suppressed from AI context on revival (callbackMode stored on tool message).
        return success({
          taskId,
          hint: "Task running. Result will be injected into this thread when ready.",
        });
      }

      logger.debug("[RouteExecute] Executing route", { toolName });

      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data: input ?? {},
        user,
        locale,
        logger,
        platform: Platform.MCP,
        streamContext: streamContext ?? {
          rootFolderId: DefaultFolderId.CRON,
          threadId: undefined,
          aiMessageId: undefined,
          currentToolMessageId: undefined,
          characterId: undefined,
          modelId: undefined,
          favoriteId: undefined,
          headless: undefined,
          waitingForRemoteResult: undefined,
          abortSignal: undefined,
        },
      });

      if (!result.success) {
        return result;
      }

      // Wrap target's .data in `result` so MCP/UI renders it
      return success({ result: result.data });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[RouteExecute] Failed", { error: msg });
      return fail({
        message: t("executeTool.post.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }
}
