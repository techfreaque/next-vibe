/**
 * Route Execute Repository
 * Delegates execution to RouteExecutionExecutor.executeGenericHandler.
 * Auth is enforced by the target route handler.
 *
 * On success: returns success(result.data) - model gets the target's data flat.
 * On failure: propagates the target's fail() - model gets the error.
 *
 * Remote execution (instanceId provided):
 * Creates a one-shot cron task targeting the remote instance and returns
 * {taskId, status: "pending"} immediately. The local instance picks it up
 * on the next pulse.
 */

import "server-only";

import { and, sql as drizzleSql, eq } from "drizzle-orm";
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
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { formatValidationErrorDetails } from "@/app/api/[locale]/system/unified-interface/shared/utils/format-validation-error";
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

import { buildRemoteUrl } from "@/app/api/[locale]/system/unified-interface/remote/remote-call";

import type { AiT } from "../i18n";
import { CallbackMode } from "./constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseInput,
} from "./definition";

export class RouteExecuteRepository {
  /**
   * Execute a tool directly on a remote instance via HTTP.
   * Used when isDirectlyAccessible=true - skips task-queue, gets result in ms.
   * Returns the parsed JSON response body (tool result) or null on network error.
   *
   * The tool's route path is derived from its toolName (which IS the routeId / path).
   * Auth: Bearer token from the stored connection.
   *
   * For wait/endLoop: blocking - caller awaits the result.
   * For detach/wakeUp: caller ignores the returned promise (fire-and-forget).
   */
  private static async executeRemoteDirect(params: {
    remoteUrl: string;
    token: string;
    toolName: string;
    input: Record<string, JsonValue> | null;
    locale: CountryLanguage;
    logger: EndpointLogger;
  }): Promise<Record<string, JsonValue> | null> {
    const { remoteUrl, token, toolName, input, locale, logger } = params;
    // Build URL from the execute-tool definition so the path is always in sync.
    const executeDefinition = (await import("./definition")).default;
    const url = buildRemoteUrl(remoteUrl, locale, executeDefinition.POST, {
      toolName,
      input: (input ?? {}) as Parameters<typeof buildRemoteUrl>[3]["input"],
    });
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toolName, input: input ?? {} }),
        signal: AbortSignal.timeout(90_000),
      });
      if (!resp.ok) {
        logger.warn("[RouteExecute] Direct HTTP call failed", {
          toolName,
          status: resp.status,
        });
        return null;
      }
      const body = (await resp.json()) as {
        data?: Record<string, JsonValue>;
        success?: boolean;
      };
      return body.data ?? null;
    } catch (err) {
      logger.warn("[RouteExecute] Direct HTTP call error", {
        toolName,
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiT,
    streamContext: ToolExecutionContext,
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      // Bail out immediately if the stream was cancelled before tool execution started.
      // The abort signal fires when StreamRegistry.cancel() is called - any DB writes
      // or network calls after this point would create orphaned rows.
      if (streamContext?.abortSignal?.aborted) {
        logger.debug(
          "[RouteExecute] Stream was cancelled before tool execution started - skipping",
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

      // Remote execution path - create a one-shot task for the target instance
      // Circuit breaker: headless streams (resume-stream revival) must not create
      // new remote WAIT tasks - this causes an infinite loop where each revival
      // calls execute-tool, creates a task, waits, resume-streams again, etc.
      // Instead, auto-upgrade WAIT to WAKE_UP so the remote task completes
      // asynchronously and the result is injected back via resume-stream.
      if (instanceId && streamContext?.headless) {
        const callbackMode = data.callbackMode ?? CallbackMode.WAIT;
        if (callbackMode === CallbackMode.WAIT) {
          logger.debug(
            "[RouteExecute] Auto-upgrading remote WAIT to WAKE_UP in headless stream (loop prevention)",
            { toolName, instanceId },
          );
          data = { ...data, callbackMode: CallbackMode.WAKE_UP };
        }
      }
      // Folder-type restrictions: block remote tools and async callback modes
      // for incognito/public folders (defense in depth — tools-loader also blocks these).
      const { FOLDER_ALLOWS_REMOTE_TOOLS, FOLDER_BLOCKED_CALLBACK_MODES } =
        await import("@/app/api/[locale]/agent/chat/config");

      if (
        instanceId &&
        FOLDER_ALLOWS_REMOTE_TOOLS[streamContext?.rootFolderId] === false
      ) {
        logger.warn(
          "[RouteExecute] Remote tool blocked for restricted folder",
          {
            toolName,
            instanceId,
            rootFolderId: streamContext?.rootFolderId,
          },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const effectiveCallbackMode = data.callbackMode ?? CallbackMode.WAIT;
      const folderBlockedModes =
        FOLDER_BLOCKED_CALLBACK_MODES[streamContext?.rootFolderId] ?? [];
      if (folderBlockedModes.includes(effectiveCallbackMode)) {
        logger.warn(
          "[RouteExecute] Blocked callbackMode for restricted folder",
          {
            toolName,
            callbackMode: effectiveCallbackMode,
            rootFolderId: streamContext?.rootFolderId,
          },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      if (instanceId && !user.isPublic) {
        // Strip instanceId from input - the remote instance executes the tool locally.
        // If we leave it in, endpoints like tool-help interpret it as "proxy to another
        // remote instance" and enter a self-referential lookup returning unfiltered results.
        // eslint-disable-next-line no-unused-vars
        const { instanceId: _stripInstanceId, ...remoteInput } = input ?? {};
        const strippedInput =
          Object.keys(remoteInput).length > 0 ? remoteInput : null;
        // Normalize incoming toolName to preferred name (alias > canonical).
        // Capabilities are stored using the preferred name so both alias and
        // full-path forms resolve to the same snapshot entry.
        toolName = getPreferredName(toolName);

        // Deduplication: if a remote task for this toolMessageId already exists
        // (created by the first stream before the user confirmed), skip creation.
        // The caller (tool-confirmation-handler) will poll for its completion.
        if (streamContext?.callerToolCallId) {
          const { sql: sqlFn } = await import("drizzle-orm");
          const [existing] = await db
            .select({
              id: cronTasks.id,
              lastExecutionStatus: cronTasks.lastExecutionStatus,
            })
            .from(cronTasks)
            .where(
              sqlFn`${cronTasks.taskInput}->>'toolMessageId' = ${streamContext?.callerToolCallId}`,
            )
            .limit(1);

          if (existing) {
            logger.debug(
              "[RouteExecute] Remote task already exists for toolMessageId - skipping duplicate creation",
              { toolName, instanceId, existingTaskId: existing.id },
            );
            return success({
              status: CronTaskStatus.PENDING,
            });
          }
        }

        logger.debug("[RouteExecute] Creating remote task", {
          toolName,
          instanceId,
        });

        // Validate toolName against stored capability snapshot
        const { RemoteConnectionRepository } =
          await import("@/app/api/[locale]/user/remote-connection/repository");
        const connInfo =
          await RemoteConnectionRepository.getConnectionForInstance(
            user.id,
            instanceId,
          );

        if (connInfo === null || connInfo.capabilities === null) {
          // Capability snapshot not yet synced - fail closed.
          // Allowing through would let any tool name pass before the first sync,
          // creating a window where an attacker could call arbitrary remote endpoints.
          logger.warn(
            "[RouteExecute] no capability snapshot for instance - rejecting",
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

        // Get threadId and tool message ID from streamContext (set by the calling AI stream).
        // tools-loader injects currentToolMessageId from pendingToolMessages before execute() runs.
        const effectiveThreadId = streamContext?.threadId;
        const effectiveToolMessageId =
          streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

        // ── Direct HTTP transport ──────────────────────────────────────────────
        // If the remote instance is directly accessible (no NAT, no queue wait),
        // call it via HTTP instead of going through the task-queue. This drops
        // latency from ~1 min to milliseconds.
        //
        // wait / endLoop: blocking call - await result, return inline to AI.
        //   If direct call fails (network error), fall through to task-queue.
        // detach / wakeUp: fire-and-forget - return pending immediately.
        //   Result arrives via /report when the remote finishes (same as queue path).
        // approve: not applicable here (handled above before this block).
        if (connInfo.isDirectlyAccessible && connInfo.token) {
          if (
            callbackMode === CallbackMode.WAIT ||
            callbackMode === CallbackMode.END_LOOP
          ) {
            logger.debug("[RouteExecute] Remote direct HTTP (blocking)", {
              toolName,
              instanceId,
              callbackMode,
            });
            const directResult =
              await RouteExecuteRepository.executeRemoteDirect({
                remoteUrl: connInfo.remoteUrl,
                token: connInfo.token,
                toolName,
                input: strippedInput as Record<string, JsonValue> | null,
                locale,
                logger,
              });
            if (directResult !== null) {
              // Result returned inline - loop continues normally (wait/endLoop).
              return success({ result: directResult });
            }
            // Direct call failed - fall through to task-queue path below.
            logger.warn(
              "[RouteExecute] Direct HTTP failed - falling back to task-queue",
              { toolName, instanceId },
            );
          } else if (
            callbackMode === CallbackMode.DETACH ||
            callbackMode === CallbackMode.WAKE_UP
          ) {
            // Fire-and-forget: return pending immediately, handle completion async.
            const directTaskId = `remote-direct-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            logger.debug(
              "[RouteExecute] Remote direct HTTP (fire-and-forget)",
              {
                toolName,
                instanceId,
                callbackMode,
                directTaskId,
              },
            );

            // wakeUp direct: insert a task row in RUNNING state so clearStreamingState
            // (called when the AI stream finishes) sees an active task and sets thread
            // → "waiting" instead of "idle". Resume-stream will delete this row on completion.
            if (callbackMode === CallbackMode.WAKE_UP && effectiveThreadId) {
              await db.insert(cronTasks).values({
                id: directTaskId,
                shortId: directTaskId,
                routeId: "remote-direct",
                displayName: `Remote wakeUp: ${toolName}`,
                category: TaskCategory.SYSTEM,
                schedule: "* * * * *",
                priority: CronTaskPriority.HIGH,
                enabled: false,
                runOnce: true,
                lastExecutionStatus: CronTaskStatus.RUNNING,
                taskInput: {},
                wakeUpCallbackMode: callbackMode,
                wakeUpThreadId: effectiveThreadId,
                wakeUpToolMessageId: effectiveToolMessageId ?? null,
                wakeUpLeafMessageId: streamContext?.leafMessageId ?? null,
                wakeUpModelId: streamContext?.modelId ?? null,
                wakeUpSkillId: streamContext?.skillId ?? null,
                wakeUpFavoriteId: streamContext?.favoriteId ?? null,
                outputMode: TaskOutputMode.STORE_ONLY,
                notificationTargets: [],
                tags: ["remote-direct", instanceId, "wakeUp"],
                targetInstance: null,
                userId: user.id,
              });
            }

            const capturedToken = connInfo.token;
            const capturedRemoteUrl = connInfo.remoteUrl;

            void (async (): Promise<void> => {
              const directResult =
                await RouteExecuteRepository.executeRemoteDirect({
                  remoteUrl: capturedRemoteUrl,
                  token: capturedToken,
                  toolName,
                  input: strippedInput as Record<string, JsonValue> | null,
                  locale,
                  logger,
                });

              if (directResult === null) {
                logger.warn(
                  "[RouteExecute] Remote direct async call failed - no completion fired",
                  { toolName, instanceId, callbackMode, directTaskId },
                );
                return;
              }

              if (
                callbackMode === CallbackMode.WAKE_UP &&
                effectiveToolMessageId &&
                effectiveThreadId
              ) {
                await handleTaskCompletion({
                  toolMessageId: effectiveToolMessageId,
                  threadId: effectiveThreadId,
                  callbackMode: CallbackMode.WAKE_UP,
                  status: CronTaskStatus.COMPLETED,
                  output: directResult,
                  taskId: directTaskId,
                  modelId: streamContext?.modelId ?? null,
                  skillId: streamContext?.skillId ?? null,
                  favoriteId: streamContext?.favoriteId ?? null,
                  leafMessageId: streamContext?.leafMessageId ?? null,
                  userId: user.id,
                  logger,
                  directResumeUser: user,
                  directResumeLocale: locale,
                });
              }
            })();

            return success({
              ...(callbackMode === CallbackMode.DETACH
                ? { taskId: directTaskId }
                : {}),
              status: CronTaskStatus.PENDING,
              ...(callbackMode === CallbackMode.DETACH
                ? {
                    hint: "Task detached. Use wait-for-task with this taskId if you need the result.",
                  }
                : {
                    hint: "Result will be injected when complete. Call wait-for-task only if you need the result before continuing.",
                  }),
            });
          }
        }

        const taskId = `remote-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        await db.insert(cronTasks).values({
          id: taskId,
          shortId: taskId,
          routeId: toolName,
          displayName: `Remote: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *", // run every minute - runOnce disables after first execution
          priority: CronTaskPriority.HIGH,
          enabled: true,
          runOnce: true,
          // Tool execution input only - no routing context mixed in.
          taskInput: strippedInput ?? {},
          // Revival context in typed columns - read by handleTaskCompletion on completion.
          wakeUpCallbackMode: callbackMode,
          wakeUpThreadId: effectiveThreadId ?? null,
          wakeUpToolMessageId: effectiveToolMessageId ?? null,
          wakeUpModelId: streamContext?.modelId ?? null,
          wakeUpSkillId: streamContext?.skillId ?? null,
          wakeUpFavoriteId: streamContext?.favoriteId ?? null,
          wakeUpLeafMessageId: streamContext?.leafMessageId ?? null,
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["remote", instanceId],
          targetInstance: effectiveTargetInstance,
          userId: user.id,
        });

        // ── Push-first: if local is directly accessible, push the task now ──
        // Instead of waiting for the local instance's next cron pull (~1 min),
        // POST the task directly to local's task-sync endpoint immediately.
        // Fire-and-forget: if push fails, the cron fallback picks it up on next pulse.
        if (
          connInfo.isDirectlyAccessible &&
          connInfo.localUrl &&
          connInfo.token
        ) {
          const capturedToken = connInfo.token;
          const capturedLocalUrl = connInfo.localUrl;
          const capturedTaskId = taskId;
          void (async (): Promise<void> => {
            try {
              const { endpoints: syncEndpoints } =
                await import("@/app/api/[locale]/system/unified-interface/tasks/task-sync/definition");
              const syncUrl = `${capturedLocalUrl.replace(/\/$/, "")}/api/${locale}/${syncEndpoints.POST.path.join("/")}`;
              // Push a minimal sync payload that includes just this task
              // Local's syncTasks handler already knows how to upsert inbound tasks.
              const pushBody: Record<string, string> = {
                instanceId: effectiveTargetInstance,
                memoriesHash: "",
                capabilitiesVersion: "none",
                taskCursor: new Date(0).toISOString(),
                outboundTasks: JSON.stringify([
                  {
                    id: capturedTaskId,
                    routeId: toolName,
                    displayName: `Remote: ${toolName}`,
                    category: "system",
                    schedule: "* * * * *",
                    priority: "high",
                    enabled: true,
                    runOnce: true,
                    taskInput: {
                      ...(strippedInput ?? {}),
                      callbackMode,
                      ...(effectiveThreadId
                        ? { threadId: effectiveThreadId }
                        : {}),
                      ...(effectiveToolMessageId
                        ? { toolMessageId: effectiveToolMessageId }
                        : {}),
                      ...(streamContext?.leafMessageId
                        ? { leafMessageId: streamContext.leafMessageId }
                        : {}),
                    },
                    outputMode: "store_only",
                    notificationTargets: [],
                    tags: ["remote", instanceId],
                    targetInstance: effectiveTargetInstance,
                    description: null,
                    version: "1",
                    timezone: null,
                    timeout: null,
                    retries: null,
                    retryDelay: null,
                  },
                ]),
              };
              const resp = await fetch(syncUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${capturedToken}`,
                },
                body: JSON.stringify(pushBody),
                signal: AbortSignal.timeout(10_000),
              });
              if (resp.ok) {
                logger.debug(
                  "[RouteExecute] Push-first: task pushed to local successfully",
                  {
                    taskId: capturedTaskId,
                    toolName,
                    instanceId,
                  },
                );
              } else {
                logger.warn(
                  "[RouteExecute] Push-first: push failed (cron fallback active)",
                  {
                    taskId: capturedTaskId,
                    status: resp.status,
                  },
                );
              }
            } catch (pushErr) {
              logger.warn(
                "[RouteExecute] Push-first: push error (cron fallback active)",
                {
                  taskId: capturedTaskId,
                  error:
                    pushErr instanceof Error
                      ? pushErr.message
                      : String(pushErr),
                },
              );
            }
          })();
        }

        // WAIT or END_LOOP (remote queue): abort stream after parallel batch.
        // handleTaskCompletion (via /report) delivers the result. Clean abort - no error shown.
        // - WAIT: revival fires after completion (backfills original tool message, AI continues)
        // - END_LOOP: no revival, just backfill + deferred message, TASK_COMPLETED WS event
        if (
          (callbackMode === CallbackMode.WAIT ||
            callbackMode === CallbackMode.END_LOOP) &&
          streamContext
        ) {
          streamContext.waitingForRemoteResult = true;
          // Use per-tool timeout from definition (callerTimeoutMs). 0 = no timer.
          const remoteTimeoutMs = streamContext.callerTimeoutMs;
          if (remoteTimeoutMs === undefined) {
            streamContext.pendingTimeoutMs = 90_000; // default
          } else if (remoteTimeoutMs > 0) {
            streamContext.pendingTimeoutMs = remoteTimeoutMs;
          }
          // remoteTimeoutMs === 0 → no timer
          // The stream abort handler sets thread → waiting when it sees REMOTE_TOOL_WAIT.
        }

        // Return pending status.
        // WAIT mode: omit taskId so the AI can't call wait-for-task.
        // The stream pauses at finish-step, resume-stream backfills the real result.
        // Other modes: include taskId so the AI can use wait-for-task if needed.
        return success({
          result: undefined,
          ...(callbackMode !== CallbackMode.WAIT ? { taskId } : {}),
          status: CronTaskStatus.PENDING,
          ...(callbackMode === CallbackMode.DETACH
            ? {
                hint: "Task detached. Use wait-for-task with this taskId if you need the result.",
              }
            : callbackMode === CallbackMode.WAKE_UP
              ? {
                  hint: "Result will be injected when complete. Call wait-for-task only if you need the result before continuing.",
                }
              : {}),
        });
      }

      const callbackMode = data.callbackMode ?? null;

      // APPROVE: return immediately - the stream-part-handler already set
      // stepHasToolsAwaitingConfirmation=true which aborts at finish-step.
      // This result is a placeholder; the real result is injected by resume-stream
      // after the user confirms/cancels (which could be days later).
      // The stream fully ends after finish-step abort - no lingering state.
      if (callbackMode === CallbackMode.APPROVE) {
        logger.debug(
          "[RouteExecute] APPROVE mode - returning placeholder (stream aborts at finish-step)",
          { toolName },
        );
        return success({
          result: { status: "waiting_for_confirmation", toolName } as Record<
            string,
            JsonValue
          >,
        });
      }

      // Local background: execute inline, store result in task execution history,
      // return { taskId, status: "pending" } to AI. handleTaskCompletion emits
      // the TASK_COMPLETED WS event and inserts the deferred result message.
      if (callbackMode === CallbackMode.DETACH) {
        const taskId = `local-bg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const executionId = `exec-${taskId}`;
        const startedAt = new Date();

        logger.debug("[RouteExecute] Executing local background route", {
          toolName,
          taskId,
        });

        const effectiveThreadId = streamContext.threadId;
        // tools-loader injects currentToolMessageId from pendingToolMessages before execute() is called
        const effectiveToolMessageId =
          streamContext?.currentToolMessageId ?? streamContext?.aiMessageId;

        await db.insert(cronTasks).values({
          id: taskId,
          shortId: taskId,
          routeId: toolName,
          displayName: `Background: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *",
          priority: CronTaskPriority.HIGH,
          enabled: false,
          runOnce: true,
          taskInput: input ?? {},
          // Revival context in typed columns.
          wakeUpCallbackMode: CallbackMode.DETACH,
          wakeUpThreadId: effectiveThreadId ?? null,
          wakeUpToolMessageId: effectiveToolMessageId ?? null,
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["detach", "local"],
          userId: user.id,
        });

        // Fire-and-forget goroutine - returns {taskId, pending} immediately to the AI.
        // The goroutine handles execution, DB persistence, and task completion notification.
        void (async (): Promise<void> => {
          try {
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
                ...streamContext,
                // Reset per-call fields - detach goroutine is independent of parent stream
                currentToolMessageId: undefined,
                callerToolCallId: undefined,
                callerCallbackMode: CallbackMode.DETACH,
                pendingToolMessages: undefined,
                pendingTimeoutMs: undefined,
                waitingForRemoteResult: undefined,
                onEscalatedTaskCancel: undefined,
                abortSignal: streamContext.abortSignal,
                escalateToTask: undefined,
              },
            });

            const completedAt = new Date();
            const finalStatus = result.success
              ? CronTaskStatus.COMPLETED
              : CronTaskStatus.FAILED;
            const finalResult =
              result.success && result.data !== undefined ? result.data : null;

            try {
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
            } catch (execInsertErr) {
              // Parent cron_tasks row may have been deleted (e.g. test teardown cancelThreadTasks).
              // This is non-fatal — execution history is best-effort for detach tasks.
              logger.warn(
                "[execute-tool detach] Failed to insert execution history (parent deleted?)",
                {
                  taskId,
                  error:
                    execInsertErr instanceof Error
                      ? execInsertErr.message
                      : String(execInsertErr),
                },
              );
            }

            // detach: result stays in task history only - never injected into thread.
            // Keep the task row (disabled + completed) so wait-for-task can find the result
            // if the AI later decides to block on it. Emit TASK_COMPLETED WS for UI bubble.
            await db
              .update(cronTasks)
              .set({
                lastExecutionStatus: finalStatus,
                lastExecutedAt: completedAt,
                lastExecutionDuration:
                  completedAt.getTime() - startedAt.getTime(),
                enabled: false,
                updatedAt: completedAt,
              })
              .where(eq(cronTasks.id, taskId));

            if (effectiveToolMessageId && effectiveThreadId && !user.isPublic) {
              // Re-read the task row to pick up any callbackMode upgrade written by wait-for-task.
              // If the AI called wait-for-task(taskId) while the task was running, it upgrades
              // the typed wakeUp* columns on the task row. Re-reading ensures handleTaskCompletion
              // fires revival instead of a plain WS event.
              const [latestTask] = await db
                .select({
                  wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
                  wakeUpThreadId: cronTasks.wakeUpThreadId,
                  wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
                  wakeUpModelId: cronTasks.wakeUpModelId,
                  wakeUpSkillId: cronTasks.wakeUpSkillId,
                  wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
                  wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
                })
                .from(cronTasks)
                .where(eq(cronTasks.id, taskId))
                .limit(1);

              const upgradedCallbackMode =
                latestTask?.wakeUpCallbackMode ?? null;
              const upgradedThreadId =
                latestTask?.wakeUpThreadId ?? effectiveThreadId;
              const upgradedToolMessageId =
                latestTask?.wakeUpToolMessageId ?? effectiveToolMessageId;

              await handleTaskCompletion({
                toolMessageId: upgradedToolMessageId,
                threadId: upgradedThreadId,
                callbackMode:
                  upgradedCallbackMode === CallbackMode.WAKE_UP
                    ? CallbackMode.WAKE_UP
                    : CallbackMode.DETACH,
                status: finalStatus,
                output:
                  upgradedCallbackMode === CallbackMode.WAKE_UP
                    ? finalResult
                    : null,
                taskId,
                modelId: latestTask?.wakeUpModelId ?? null,
                skillId: latestTask?.wakeUpSkillId ?? null,
                favoriteId: latestTask?.wakeUpFavoriteId ?? null,
                leafMessageId: latestTask?.wakeUpLeafMessageId ?? null,
                userId: user.id,
                logger,
                directResumeUser: user,
                directResumeLocale: locale,
              });
            }
          } catch (err) {
            logger.error("[RouteExecute] Detach goroutine failed", {
              toolName,
              taskId,
              error: err instanceof Error ? err.message : String(err),
            });
          }
        })();

        return success({
          taskId,
          status: CronTaskStatus.PENDING,
          hint: "Task detached. Use wait-for-task with this taskId if you need the result.",
        });
      }

      // Local wakeUp: create task row in RUNNING state (so pulse never picks it up),
      // fire execution fire-and-forget, return {taskId, status: "pending"} to the AI.
      // AI completes its current turn. In the background: execute → handleTaskCompletion
      // (schedules resume-stream enabled cron task) → delete task row.
      // resume-stream fires on next pulse, checks isStreaming=false, revives thread.
      if (callbackMode === CallbackMode.WAKE_UP) {
        const taskId = `local-wu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        const effectiveThreadId = streamContext?.threadId;
        // Resolve tool message ID for this specific parallel tool call.
        // Priority: (1) DB lookup by toolCallId (authoritative, avoids race with stream-part-handler)
        //           (2) pendingToolMessages map (set by tools-loader before execute() if no race)
        //           (3) currentToolMessageId (set by stream-part-handler, may have timing issues)
        //           (4) aiMessageId (placeholder assistant - last resort, almost always wrong for wakeUp)
        // The DB lookup is safe because tool-call-handler writes the tool message row before
        // returning, and execute() is called asynchronously after that write.
        const pendingEntry = streamContext?.callerToolCallId
          ? streamContext?.pendingToolMessages?.get(
              streamContext?.callerToolCallId,
            )
          : undefined;

        let resolvedToolMessageId: string | undefined =
          pendingEntry?.messageId ?? streamContext?.currentToolMessageId;
        let resolvedLeafMessageId: string | null =
          pendingEntry?.toolCallData?.parentId ??
          streamContext?.leafMessageId ??
          null;

        // DB fallback: if in-memory lookup missed (race between execute() and stream-part-handler),
        // query the tool message row directly using toolCallId stored in metadata JSONB + threadId.
        if (
          !resolvedToolMessageId &&
          streamContext?.callerToolCallId &&
          effectiveThreadId
        ) {
          const { chatMessages } =
            await import("@/app/api/[locale]/agent/chat/db");
          const [row] = await db
            .select({ id: chatMessages.id, parentId: chatMessages.parentId })
            .from(chatMessages)
            .where(
              and(
                eq(chatMessages.threadId, effectiveThreadId),
                drizzleSql`(${chatMessages.metadata}->'toolCall'->>'toolCallId') = ${streamContext?.callerToolCallId}`,
              ),
            )
            .limit(1);
          if (row) {
            resolvedToolMessageId = row.id;
            resolvedLeafMessageId = resolvedLeafMessageId ?? row.parentId;
          }
        }

        const effectiveToolMessageId =
          resolvedToolMessageId ?? streamContext?.aiMessageId;
        const effectiveLeafMessageId = resolvedLeafMessageId;

        logger.debug("[RouteExecute] Creating local wakeUp task (RUNNING)", {
          toolName,
          taskId,
          effectiveThreadId,
          effectiveToolMessageId,
        });

        // Insert as RUNNING so cron pulse never picks it up.
        // Revival context in typed columns - taskInput holds only tool execution input.
        await db.insert(cronTasks).values({
          id: taskId,
          shortId: taskId,
          routeId: toolName,
          displayName: `WakeUp: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *",
          priority: CronTaskPriority.HIGH,
          enabled: false,
          runOnce: true,
          lastExecutionStatus: CronTaskStatus.RUNNING,
          taskInput: input ?? {},
          wakeUpCallbackMode: CallbackMode.WAKE_UP,
          wakeUpThreadId: effectiveThreadId ?? null,
          wakeUpToolMessageId: effectiveToolMessageId ?? null,
          wakeUpModelId: streamContext?.modelId ?? null,
          wakeUpSkillId: streamContext?.skillId ?? null,
          wakeUpFavoriteId: streamContext?.favoriteId ?? null,
          wakeUpLeafMessageId: effectiveLeafMessageId,
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["wakeup", "local"],
          userId: user.id,
        });

        // Fire-and-forget: execute the tool, call handleTaskCompletion, then self-delete.
        // handleTaskCompletion schedules resume-stream which revives the thread once
        // the stream is no longer active.
        void (async (): Promise<void> => {
          const startedAt = new Date();
          // Goroutine-local streamContext - mutable, used to detect self-escalation.
          // escalateToTask is inherited from the parent so long-running tools (like
          // interactive claude-code) can call it to set waitingForRemoteResult=true
          // and manage their own revival via complete-task. When that happens we skip
          // our own handleTaskCompletion below.
          // selfEscalated is a shared mutable flag. When escalateToTask fires inside
          // the tool, the wrapper below sets it to true so we can skip our own
          // handleTaskCompletion (the tool self-manages revival via complete-task).
          let selfEscalated = false;
          type EscalateOpts = Parameters<
            NonNullable<typeof streamContext.escalateToTask>
          >[0];
          type EscalateResult = ReturnType<
            NonNullable<typeof streamContext.escalateToTask>
          >;
          const wrappedEscalateToTask = streamContext?.escalateToTask
            ? async (opts?: EscalateOpts): EscalateResult => {
                selfEscalated = true;
                return streamContext!.escalateToTask!(opts);
              }
            : undefined;
          const goroutineStreamContext: typeof streamContext = {
            ...streamContext,
            // Reset per-call fields - wakeUp goroutine is independent of parent stream
            currentToolMessageId: undefined,
            callerToolCallId: undefined,
            callerCallbackMode: CallbackMode.WAKE_UP,
            pendingToolMessages: undefined,
            pendingTimeoutMs: undefined,
            waitingForRemoteResult: undefined,
            onEscalatedTaskCancel: undefined,
            cancelPendingStreamTimer: undefined,
            abortSignal: streamContext.abortSignal,
            // Wrapped escalateToTask: sets selfEscalated=true so we skip handleTaskCompletion.
            escalateToTask: wrappedEscalateToTask,
          };
          // Closure variable: holds the tool result so the finally block can store it
          // in taskInput.__result for wait-for-task to read inline.
          let wakeUpFinalResult: Record<string, JsonValue> | null = null;
          try {
            const result = await RouteExecutionExecutor.executeGenericHandler<
              Record<string, JsonValue>
            >({
              toolName,
              data: input ?? {},
              user,
              locale,
              logger,
              platform: Platform.MCP,
              streamContext: goroutineStreamContext,
            });

            const completedAt = new Date();
            const finalStatus = result.success
              ? CronTaskStatus.COMPLETED
              : CronTaskStatus.FAILED;
            const finalResult =
              result.success && result.data !== undefined ? result.data : null;
            wakeUpFinalResult = finalResult;

            logger.debug("[RouteExecute] wakeUp task finished", {
              taskId,
              toolName,
              finalStatus,
              durationMs: completedAt.getTime() - startedAt.getTime(),
            });

            // Skip handleTaskCompletion if the tool self-escalated via escalateToTask.
            // Revival is managed by complete-task - we must not fire an early revival here.
            if (selfEscalated) {
              logger.debug(
                "[RouteExecute] wakeUp: tool self-escalated, skipping handleTaskCompletion",
                { taskId, toolName },
              );
            }
            // handleTaskCompletion is called in the finally block below, after __result
            // is stored, so wait-for-task interception can be detected reliably.
          } catch (err) {
            logger.error("[RouteExecute] wakeUp task execution failed", {
              taskId,
              toolName,
              error: err instanceof Error ? err.message : String(err),
            });
          } finally {
            // Atomically mark COMPLETED + store __result, but ONLY if wait-for-task has
            // NOT intercepted yet (wakeUpCallbackMode still = WAKE_UP).
            // If wait-for-task already wrote WAIT, rowsUpdated = 0 → skip revival.
            // If we win (rowsUpdated = 1), read back the row to get wakeUp context for
            // handleTaskCompletion. This is race-free: the single UPDATE is the lock.
            if (
              !selfEscalated &&
              effectiveToolMessageId &&
              effectiveThreadId &&
              user.id
            ) {
              try {
                const updated = await db
                  .update(cronTasks)
                  .set({
                    lastExecutionStatus: CronTaskStatus.COMPLETED,
                    lastExecutedAt: new Date(),
                    taskInput: {
                      __result: (wakeUpFinalResult ?? null) as JsonValue,
                    },
                    updatedAt: new Date(),
                  })
                  .where(
                    drizzleSql`${cronTasks.id} = ${taskId} AND ${cronTasks.wakeUpCallbackMode} = ${CallbackMode.WAKE_UP}`,
                  );

                const claimed =
                  updated.rowCount !== null && updated.rowCount > 0;

                if (!claimed) {
                  // wait-for-task already intercepted (wakeUpCallbackMode=WAIT).
                  // Still store __result so wait-for-task can read it, but skip revival.
                  logger.debug(
                    "[RouteExecute] wakeUp: wait-for-task intercepted, skipping handleTaskCompletion",
                    { taskId, toolName },
                  );
                  await db
                    .update(cronTasks)
                    .set({
                      lastExecutionStatus: CronTaskStatus.COMPLETED,
                      lastExecutedAt: new Date(),
                      taskInput: {
                        __result: (wakeUpFinalResult ?? null) as JsonValue,
                      },
                      updatedAt: new Date(),
                    })
                    .where(eq(cronTasks.id, taskId));
                } else {
                  // We won the race - read back wakeUp context and fire revival.
                  const [latestTask] = await db
                    .select({
                      wakeUpCallbackMode: cronTasks.wakeUpCallbackMode,
                      wakeUpThreadId: cronTasks.wakeUpThreadId,
                      wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
                      wakeUpModelId: cronTasks.wakeUpModelId,
                      wakeUpSkillId: cronTasks.wakeUpSkillId,
                      wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
                      wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
                      userId: cronTasks.userId,
                    })
                    .from(cronTasks)
                    .where(eq(cronTasks.id, taskId))
                    .limit(1);

                  await handleTaskCompletion({
                    toolMessageId:
                      latestTask?.wakeUpToolMessageId ?? effectiveToolMessageId,
                    threadId:
                      latestTask?.wakeUpThreadId ?? effectiveThreadId ?? null,
                    callbackMode: CallbackMode.WAKE_UP,
                    status:
                      wakeUpFinalResult !== null
                        ? CronTaskStatus.COMPLETED
                        : CronTaskStatus.FAILED,
                    output: wakeUpFinalResult,
                    taskId,
                    modelId:
                      latestTask?.wakeUpModelId ??
                      streamContext?.modelId ??
                      null,
                    skillId:
                      latestTask?.wakeUpSkillId ??
                      streamContext?.skillId ??
                      null,
                    favoriteId:
                      latestTask?.wakeUpFavoriteId ??
                      streamContext?.favoriteId ??
                      null,
                    leafMessageId:
                      latestTask?.wakeUpLeafMessageId ??
                      streamContext?.leafMessageId ??
                      null,
                    userId: latestTask?.userId ?? user.id,
                    logger,
                    directResumeUser: user,
                    directResumeLocale: locale,
                  });
                }
              } catch (completionErr) {
                logger.error(
                  "[RouteExecute] wakeUp handleTaskCompletion failed",
                  {
                    taskId,
                    error:
                      completionErr instanceof Error
                        ? completionErr.message
                        : String(completionErr),
                  },
                );
              }
            } else if (!selfEscalated) {
              // No stream context - just store __result so wait-for-task can read it.
              try {
                await db
                  .update(cronTasks)
                  .set({
                    lastExecutionStatus: CronTaskStatus.COMPLETED,
                    lastExecutedAt: new Date(),
                    taskInput: {
                      __result: (wakeUpFinalResult ?? null) as JsonValue,
                    },
                    updatedAt: new Date(),
                  })
                  .where(eq(cronTasks.id, taskId));
              } catch (updateErr) {
                logger.warn(
                  "[RouteExecute] wakeUp task status update failed (non-fatal)",
                  {
                    taskId,
                    error:
                      updateErr instanceof Error
                        ? updateErr.message
                        : String(updateErr),
                  },
                );
              }
            }
          }
        })();

        // Return taskId immediately - AI completes current turn while task runs in background.
        return success({
          taskId,
          status: CronTaskStatus.PENDING,
          hint: "Result will be injected when complete. Call wait-for-task only if you need the result before continuing.",
        });
      }

      logger.debug("[RouteExecute] Executing route", { toolName });

      // Set callerCallbackMode so the tool knows what mode was requested.
      if (streamContext) {
        streamContext.callerCallbackMode = callbackMode ?? undefined;
      }

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
          pendingToolMessages: undefined,
          pendingTimeoutMs: undefined,
          leafMessageId: undefined,
          skillId: undefined,
          modelId: undefined,
          favoriteId: undefined,
          headless: undefined,
          waitingForRemoteResult: undefined,
          abortSignal: undefined,
          callerToolCallId: undefined,
          callerCallbackMode: callbackMode ?? undefined,
          onEscalatedTaskCancel: undefined,
          escalateToTask: undefined,
        },
      });

      // Discard result if stream was cancelled during tool execution.
      // The abort signal may have fired while the tool was running - any result
      // returned after cancellation should be ignored to prevent ghost responses.
      if (streamContext?.abortSignal?.aborted) {
        logger.debug(
          "[RouteExecute] Stream was cancelled during tool execution - discarding result",
          { toolName },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      if (!result.success) {
        const endpoint = await getEndpoint(toolName);
        const validationDetails = formatValidationErrorDetails(
          result.messageParams as Record<string, string | number> | undefined,
          endpoint,
        );
        if (validationDetails) {
          return {
            ...result,
            messageParams: {
              ...result.messageParams,
              formattedError: validationDetails,
            },
          };
        }
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
