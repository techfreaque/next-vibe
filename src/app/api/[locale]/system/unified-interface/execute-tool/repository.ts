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

import { and, eq, sql as drizzleSql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { getEnvAvailability } from "@/app/api/[locale]/agent/env-availability";
import {
  broadcastToolResult,
  callToolDirect,
  sendToolWs,
} from "@/app/api/[locale]/remote-connection/dispatch";
import { db } from "@/app/api/[locale]/system/db";
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";
import type { AiT } from "@/app/api/[locale]/system/unified-interface/ai/i18n";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { createEndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/server-logger";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { formatValidationErrorCompact } from "@/app/api/[locale]/system/unified-interface/shared/utils/format-validation-error";
import {
  getPreferredName,
  getPreferredToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
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
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { CallbackModeValue } from "./constants";
import { CallbackMode } from "./constants";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseInput,
} from "./definition";

export class RouteExecuteRepository {
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: AiT,
    streamContext: ToolExecutionContext,
    platform: Platform,
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      // Bail out immediately if the stream was cancelled before tool execution started.
      // The abort signal fires when StreamRegistry.cancel() is called - any DB writes
      // or network calls after this point would create orphaned rows.
      if (streamContext.abortSignal.aborted) {
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

      // Resolve the active chat model from the favorite/skill cascade.
      // Stored in wakeUpModelId so resume-stream can use it for revival.
      const userId = !user.isPublic && "id" in user ? user.id : undefined;
      const { resolveFavoriteConfig } =
        await import("@/app/api/[locale]/agent/chat/favorites/repository");
      const { resolveSkillVariant } =
        await import("@/app/api/[locale]/agent/chat/skills/resolver");
      const { resolveChatModelId } =
        await import("@/app/api/[locale]/agent/ai-stream/repository/core/modality-resolver");
      const execFav = await resolveFavoriteConfig(
        streamContext.favoriteId,
        userId,
      );
      const { parseSkillId } =
        await import("@/app/api/[locale]/agent/chat/slugify");
      const execSkill = await resolveSkillVariant(
        streamContext.skillId,
        execFav ? parseSkillId(execFav.skillId).variantId : null,
      );
      const resolvedModelId = resolveChatModelId(
        execFav?.modelSelection ?? undefined,
        execSkill?.modelSelection ?? undefined,
        user,
        getEnvAvailability(),
      );

      // Remote execution path - create a one-shot task for the target instance
      // Circuit breaker: headless streams (resume-stream revival) must not create
      // new remote WAIT tasks - this causes an infinite loop where each revival
      // calls execute-tool, creates a task, waits, resume-streams again, etc.
      // Instead, auto-upgrade WAIT to WAKE_UP so the remote task completes
      // asynchronously and the result is injected back via resume-stream.
      // Circuit breaker: revival streams (resume-stream after wakeUp task completed) must not
      // create new remote WAIT tasks - this causes an infinite loop where each revival calls
      // execute-tool, creates a task, waits, resume-streams again, etc.
      // Only auto-upgrade in revival streams (isRevival=true), NOT all headless streams.
      if (instanceId && streamContext.isRevival) {
        const callbackMode = data.callbackMode ?? CallbackMode.WAIT;
        if (callbackMode === CallbackMode.WAIT) {
          logger.debug(
            "[RouteExecute] Auto-upgrading remote WAIT to WAKE_UP in revival stream (loop prevention)",
            { toolName, instanceId },
          );
          data = { ...data, callbackMode: CallbackMode.WAKE_UP };
        }
      }
      // Folder-type restrictions: block remote tools and async callback modes
      // for incognito/public folders (defense in depth - tools-loader also blocks these).
      const { FOLDER_ALLOWS_REMOTE_TOOLS, FOLDER_BLOCKED_CALLBACK_MODES } =
        await import("@/app/api/[locale]/agent/chat/config");

      if (
        instanceId &&
        FOLDER_ALLOWS_REMOTE_TOOLS[streamContext.rootFolderId] === false
      ) {
        logger.warn(
          "[RouteExecute] Remote tool blocked for restricted folder",
          {
            toolName,
            instanceId,
            rootFolderId: streamContext.rootFolderId,
          },
        );
        return fail({
          message: t("executeTool.post.errors.validation.title"),
          errorType: ErrorResponseTypes.FORBIDDEN,
        });
      }

      const effectiveCallbackMode = data.callbackMode ?? CallbackMode.WAIT;
      const folderBlockedModes =
        FOLDER_BLOCKED_CALLBACK_MODES[streamContext.rootFolderId] ?? [];
      if (folderBlockedModes.includes(effectiveCallbackMode)) {
        logger.warn(
          "[RouteExecute] Blocked callbackMode for restricted folder",
          {
            toolName,
            callbackMode: effectiveCallbackMode,
            rootFolderId: streamContext.rootFolderId,
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
        let strippedInput: Record<string, WidgetData> | null =
          Object.keys(remoteInput).length > 0 ? remoteInput : null;

        // Pre-resolve media gen model locally before sending to remote.
        // The remote instance has no skill/fav context, so fieldDefaults.model
        // would return undefined. We resolve it here using our local context
        // and inject it into the input, so the remote just receives an explicit model.
        const preferredName = getPreferredName(toolName);
        const MEDIA_GEN_TOOLS = [
          "generate_image",
          "generate_music",
          "generate_video",
        ] as const;
        type MediaGenTool = (typeof MEDIA_GEN_TOOLS)[number];
        const isMediaGenTool = (MEDIA_GEN_TOOLS as readonly string[]).includes(
          preferredName,
        );
        if (
          isMediaGenTool &&
          !(strippedInput as Record<string, WidgetData> | null)?.["model"]
        ) {
          const mediaToolName = preferredName as MediaGenTool;
          let resolvedModel: string | undefined;
          if (mediaToolName === "generate_image") {
            const { getBestImageGenModel } =
              await import("@/app/api/[locale]/agent/image-generation/models");
            const sel =
              execSkill?.imageGenModelSelection ??
              execFav?.imageGenModelSelection;
            resolvedModel = sel
              ? getBestImageGenModel(sel, user, getEnvAvailability())?.id
              : undefined;
          } else if (mediaToolName === "generate_music") {
            const { getBestMusicGenModel } =
              await import("@/app/api/[locale]/agent/music-generation/models");
            const sel =
              execSkill?.musicGenModelSelection ??
              execFav?.musicGenModelSelection;
            resolvedModel = sel
              ? getBestMusicGenModel(sel, user, getEnvAvailability())?.id
              : undefined;
          } else if (mediaToolName === "generate_video") {
            const { videoGenModelSelectionSchema, filterVideoGenModels } =
              await import("@/app/api/[locale]/agent/video-generation/models");
            const { ModelSelectionType } =
              await import("@/app/api/[locale]/agent/chat/skills/enum");
            const sel =
              execSkill?.videoGenModelSelection ??
              execFav?.videoGenModelSelection;
            if (sel) {
              // For MANUAL selection, use manualModelId directly (skip provider availability
              // check - provider availability is local, but execution is on the remote).
              const parsed = videoGenModelSelectionSchema.safeParse(sel);
              if (
                parsed.success &&
                parsed.data.selectionType === ModelSelectionType.MANUAL &&
                "manualModelId" in parsed.data
              ) {
                resolvedModel = parsed.data.manualModelId;
              } else {
                // FILTERS selection: run normal filtering (may return empty if no providers)
                resolvedModel = filterVideoGenModels(
                  sel,
                  user,
                  getEnvAvailability(),
                )[0]?.id;
              }
            }
          }
          if (resolvedModel) {
            strippedInput = { ...(strippedInput ?? {}), model: resolvedModel };
            logger.debug(
              "[RouteExecute] Pre-resolved media gen model for remote",
              {
                toolName: preferredName,
                model: resolvedModel,
              },
            );
          }
        }

        // Normalize incoming toolName to preferred name (alias > canonical).
        // Capabilities are stored using the preferred name so both alias and
        // full-path forms resolve to the same snapshot entry.
        toolName = preferredName;

        // Deduplication: if a remote task for this toolMessageId already exists
        // (created by the first stream before the user confirmed), skip creation.
        // The caller (tool-confirmation-handler) will poll for its completion.
        if (streamContext.callerToolCallId) {
          const { sql: sqlFn } = await import("drizzle-orm");
          const [existing] = await db
            .select({
              id: cronTasks.id,
              lastExecutionStatus: cronTasks.lastExecutionStatus,
            })
            .from(cronTasks)
            .where(
              sqlFn`${cronTasks.taskInput}->>'toolMessageId' = ${streamContext.callerToolCallId}`,
            )
            .limit(1);

          if (existing) {
            logger.debug(
              "[RouteExecute] Remote task already exists for toolMessageId - skipping duplicate creation",
              { toolName, instanceId, existingTaskId: existing.id },
            );
            return success({
              hint: "Duplicate call — task already queued. Result will be injected when complete.",
            });
          }
        }

        logger.debug("[RouteExecute] Creating remote task", {
          toolName,
          instanceId,
        });

        // Validate toolName against stored capability snapshot
        const { RemoteConnectionRepository } =
          await import("@/app/api/[locale]/remote-connection/repository");
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

        const { capabilities } = connInfo;

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
        const effectiveThreadId = streamContext.threadId;
        const effectiveToolMessageId =
          streamContext.currentToolMessageId ?? streamContext.aiMessageId;

        // ── Direct HTTP transport ──────────────────────────────────────────────
        // If the remote instance is directly accessible (transportMode='direct-http'),
        // call it via HTTP. This is the only supported path for direct-http.
        //
        // wait / endLoop: blocking call - await result, return inline to AI.
        //   If direct call fails (network error), falls through to UNAVAILABLE fail below.
        // detach / wakeUp: fire-and-forget - return pending immediately.
        //   Result arrives via /report when the remote finishes.
        // approve: not applicable here (handled above before this block).
        if (connInfo.transportMode === "direct-http" && connInfo.token) {
          if (
            callbackMode === CallbackMode.WAIT ||
            callbackMode === CallbackMode.END_LOOP
          ) {
            logger.debug("[RouteExecute] Remote direct HTTP (blocking)", {
              toolName,
              instanceId,
              callbackMode,
            });
            const directResult = await callToolDirect({
              remoteUrl: connInfo.remoteUrl,
              token: connInfo.token,
              leadId: connInfo.leadId,
              toolName,
              input: strippedInput,
              locale,
              logger,
            });
            if (directResult.ok) {
              // Result returned inline - loop continues normally (wait/endLoop).
              // directResult.data is body.data from the remote execute-tool response
              // (which has shape {result: <actual-tool-result>}) - return it flat so the
              // AI sees the same {result: ...} shape as a local execute-tool call.
              return success(directResult.data);
            }
            if (directResult.kind === "http") {
              // The remote answered and rejected — surface its error, do not
              // retry over another transport (the call itself was refused).
              return fail({
                message: t("executeTool.post.errors.notFound.title"),
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                messageParams: { toolName },
              });
            }
            // Network-level failure — remote unreachable. Fall through to the
            // reverse-ws dispatch below as transport failover.
            logger.warn(
              "[RouteExecute] Direct HTTP network failure — trying reverse-ws fallback",
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

            // No task row (remote-call/spec.md → No Remote Tasks): the
            // in-memory pending-calls registry + the tool message are the
            // caller's complete state. clearStreamingState consults the
            // registry via hasPendingCallForThread for the "waiting" state;
            // wait-for-task awaits the registry entry directly.
            const { registerPendingCall, completePendingCall } =
              await import("@/app/api/[locale]/remote-connection/pending-calls");

            // Deadline backstop: callToolDirect itself times out at 600s for
            // media tools — give the registry a slightly longer fuse.
            const DIRECT_CALL_DEADLINE_MS = 660_000;

            const reviveDirectFailure = async (
              errorMessage: string,
            ): Promise<void> => {
              const outcome = completePendingCall(directTaskId, {
                status: "failed",
                output: { error: errorMessage },
              });
              if (outcome.kind !== "completed") {
                return; // duplicate/unknown — already finalized elsewhere
              }
              const revival = outcome.revival;
              const revivedAbort = new AbortController();
              if (revival) {
                await handleTaskCompletion({
                  toolMessageId: revival.toolMessageId,
                  threadId: revival.threadId,
                  callbackMode:
                    revival.callbackMode === CallbackMode.WAIT
                      ? CallbackMode.WAIT
                      : CallbackMode.WAKE_UP,
                  status: CronTaskStatus.FAILED,
                  output: { error: errorMessage },
                  taskId: directTaskId,
                  modelId: revival.modelId ?? resolvedModelId,
                  skillId: revival.skillId,
                  favoriteId: revival.favoriteId,
                  leafMessageId: revival.leafMessageId,
                  subAgentDepth: revival.subAgentDepth,
                  ownerUser: user,
                  logger,
                  directResumeLocale: locale,
                  abortSignal: revivedAbort.signal,
                });
              } else if (effectiveToolMessageId) {
                // Uniform failure: the tool message records the failure for
                // every mode; wakeUp additionally revives with the error.
                await handleTaskCompletion({
                  toolMessageId: effectiveToolMessageId,
                  threadId: effectiveThreadId ?? null,
                  callbackMode,
                  status: CronTaskStatus.FAILED,
                  output: { error: errorMessage },
                  taskId: directTaskId,
                  modelId: resolvedModelId,
                  skillId: streamContext.skillId ?? null,
                  favoriteId: streamContext.favoriteId ?? null,
                  leafMessageId: streamContext.leafMessageId ?? null,
                  subAgentDepth: streamContext.subAgentDepth,
                  ownerUser: user,
                  logger,
                  directResumeLocale: locale,
                  abortSignal: revivedAbort.signal,
                });
              }
            };

            registerPendingCall({
              callId: directTaskId,
              instanceId,
              toolName,
              // wakeUp keeps the thread in "waiting"; detach leaves it idle.
              threadId:
                callbackMode === CallbackMode.WAKE_UP
                  ? (effectiveThreadId ?? null)
                  : null,
              toolMessageId: effectiveToolMessageId ?? null,
              deadlineMs: DIRECT_CALL_DEADLINE_MS,
              onDeadline: async (): Promise<void> => {
                await reviveDirectFailure(
                  `Remote call deadline exceeded dispatching ${toolName} to ${instanceId}`,
                );
              },
            });

            const capturedToken = connInfo.token;
            const capturedLeadId = connInfo.leadId;
            const capturedRemoteUrl = connInfo.remoteUrl;

            void (async (): Promise<void> => {
              const directResult = await callToolDirect({
                remoteUrl: capturedRemoteUrl,
                token: capturedToken,
                leadId: capturedLeadId,
                toolName,
                input: strippedInput,
                locale,
                logger,
              });

              if (!directResult.ok) {
                // Definite-outcome rule: a failed dispatch must finalize the
                // call and revive any waiting thread with the error — never
                // leave a hanging thread behind.
                logger.warn(
                  "[RouteExecute] Remote direct async call failed — finalizing as FAILED",
                  { toolName, instanceId, callbackMode, directTaskId },
                );
                await reviveDirectFailure(
                  `Remote ${directResult.kind} failure dispatching ${toolName} to ${instanceId}`,
                );
                return;
              }
              const directData = directResult.data;

              // Guard: if the remote returned {status:"pending"} or {status:"status.pending"}
              // the task is still running on the remote - it will call back via /report when done.
              // Do NOT fire handleTaskCompletion with a pending result; that would trigger a
              // premature revival with no real output.
              const directResultObj =
                typeof directData === "object" && !Array.isArray(directData)
                  ? (directData as Record<
                      string,
                      string | number | boolean | null
                    >)
                  : null;
              const isPendingResult =
                directResultObj?.status === "pending" ||
                directResultObj?.status === "status.pending";

              if (!isPendingResult) {
                const outcome = completePendingCall(directTaskId, {
                  status: "completed",
                  output: directData,
                });
                if (outcome.kind !== "completed") {
                  // Deadline (or a duplicate path) already finalized this call.
                  return;
                }
                const revival = outcome.revival;
                if (revival) {
                  // wait-for-task attached a revival target while we were
                  // in flight — revive that stream with the result.
                  // Fresh signal: the original stream's abortSignal is already
                  // triggered (stream aborted to "waiting" state).
                  const revivedAbort = new AbortController();
                  await handleTaskCompletion({
                    toolMessageId: revival.toolMessageId,
                    threadId: revival.threadId,
                    callbackMode:
                      revival.callbackMode === CallbackMode.WAIT
                        ? CallbackMode.WAIT
                        : CallbackMode.WAKE_UP,
                    status: CronTaskStatus.COMPLETED,
                    output: directData,
                    taskId: directTaskId,
                    modelId: revival.modelId ?? resolvedModelId,
                    skillId: revival.skillId,
                    favoriteId: revival.favoriteId,
                    leafMessageId: revival.leafMessageId,
                    subAgentDepth: revival.subAgentDepth,
                    ownerUser: user,
                    logger,
                    directResumeLocale: locale,
                    abortSignal: revivedAbort.signal,
                  });
                } else if (effectiveToolMessageId) {
                  // Uniform completion: the tool message is the canonical
                  // result store for every mode and every execution location.
                  // wakeUp additionally revives the thread; detach backfills
                  // only.
                  await handleTaskCompletion({
                    toolMessageId: effectiveToolMessageId,
                    threadId: effectiveThreadId ?? null,
                    callbackMode,
                    status: CronTaskStatus.COMPLETED,
                    output: directData,
                    taskId: directTaskId,
                    modelId: resolvedModelId,
                    skillId: streamContext.skillId ?? null,
                    favoriteId: streamContext.favoriteId ?? null,
                    leafMessageId: streamContext.leafMessageId ?? null,
                    subAgentDepth: streamContext.subAgentDepth,
                    ownerUser: user,
                    logger,
                    directResumeLocale: locale,
                    abortSignal: streamContext.abortSignal,
                  });
                }
              }
            })();

            return success({
              taskId: directTaskId,
              hint:
                callbackMode === CallbackMode.DETACH
                  ? "Task detached. Use wait-for-task with this taskId if you need to wait for the result/return."
                  : "Result/return will be injected when complete and wakes up the thread. Call wait-for-task only if you need the result before continuing.",
            });
          }
        }

        // ── Reverse WS transport ───────────────────────────────────────────────
        // Reached when transportMode is reverse-ws, OR as failover when a
        // direct-http wait/endLoop call failed at the network level (the remote
        // is HTTP-unreachable but may still hold a channel to/from us).
        // All callback modes (wait/endLoop/wakeUp/detach) are treated the same:
        //   - insert a task row so /report can find the wakeUp context on completion
        //   - fire tool-execute-request on system/tool-dispatch/{userId}
        //   - thread enters "waiting" state; /report → handleTaskCompletion revives it
        //
        // wait/endLoop: circuit breaker already upgraded WAIT → WAKE_UP for revival
        //   streams above. For fresh streams, treat same as wakeUp (no inline wait).
        if (
          connInfo.transportMode === "reverse-ws" ||
          connInfo.transportMode === "direct-http"
        ) {
          const wsTaskId = `remote-ws-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          // wait/endLoop block INLINE on the socket reply (remote-call/spec.md:
          // "caller blocks on tool-execute-result keyed by callId"). Only a
          // hub-published dispatch (passive side — no socket of our own to
          // receive a reply on) upgrades to wakeUp revival.
          const isInlineMode =
            callbackMode === CallbackMode.WAIT ||
            callbackMode === CallbackMode.END_LOOP;

          logger.debug("[RouteExecute] Remote reverse-ws dispatch", {
            toolName,
            instanceId,
            callbackMode,
            wsTaskId,
          });

          // No task row (remote-call/spec.md → No Remote Tasks): register the
          // call in the in-memory pending-calls registry. The wakeUp context
          // rides the wire; /report completes the registry entry and revives
          // from the echoed context. Deadline backstops a remote that never
          // reports back.
          const {
            awaitPendingCallResult,
            registerPendingCall: registerWsCall,
            completePendingCall: completeWsCall,
            discardPendingCall: discardWsCall,
          } = await import("@/app/api/[locale]/remote-connection/pending-calls");

          const WS_CALL_DEADLINE_MS = 15 * 60 * 1000;

          registerWsCall({
            callId: wsTaskId,
            instanceId,
            toolName,
            threadId:
              callbackMode === CallbackMode.WAKE_UP
                ? (effectiveThreadId ?? null)
                : null,
            toolMessageId: effectiveToolMessageId ?? null,
            deadlineMs: WS_CALL_DEADLINE_MS,
            onDeadline: async (): Promise<void> => {
              const outcome = completeWsCall(wsTaskId, {
                status: "failed",
                output: {
                  error: `Remote call deadline exceeded dispatching ${toolName} to ${instanceId}`,
                },
              });
              if (outcome.kind !== "completed") {
                return;
              }
              const revival = outcome.revival;
              const revivedAbort = new AbortController();
              const failTarget = revival
                ? {
                    toolMessageId: revival.toolMessageId,
                    threadId: revival.threadId,
                    callbackMode:
                      revival.callbackMode === CallbackMode.WAIT
                        ? CallbackMode.WAIT
                        : CallbackMode.WAKE_UP,
                    modelId: revival.modelId ?? resolvedModelId,
                    skillId: revival.skillId,
                    favoriteId: revival.favoriteId,
                    leafMessageId: revival.leafMessageId,
                    subAgentDepth: revival.subAgentDepth,
                  }
                : effectiveToolMessageId
                  ? {
                      toolMessageId: effectiveToolMessageId,
                      threadId: effectiveThreadId ?? null,
                      callbackMode,
                      modelId: resolvedModelId,
                      skillId: streamContext.skillId ?? null,
                      favoriteId: streamContext.favoriteId ?? null,
                      leafMessageId: streamContext.leafMessageId ?? null,
                      subAgentDepth: streamContext.subAgentDepth ?? 0,
                    }
                  : null;
              if (failTarget) {
                await handleTaskCompletion({
                  ...failTarget,
                  status: CronTaskStatus.FAILED,
                  output: {
                    error: `Remote call deadline exceeded dispatching ${toolName} to ${instanceId}`,
                  },
                  taskId: wsTaskId,
                  ownerUser: user,
                  logger,
                  directResumeLocale: locale,
                  abortSignal: revivedAbort.signal,
                });
              }
            },
          });

          // Dispatch via persistent WS (or local hub publish on the passive
          // side). The message carries wakeUp context so the remote's
          // handleToolExecuteRequest can include it in /report.
          const wsDispatch = await sendToolWs({
            instanceId,
            remoteUrl: connInfo.remoteUrl,
            userId: user.id,
            taskId: wsTaskId,
            toolName,
            input: strippedInput,
            wakeUpCallbackMode: callbackMode,
            // Hub-published wait/endLoop cannot receive a socket reply —
            // upgrade to wakeUp revival on that path only.
            hubFallbackCallbackMode: isInlineMode
              ? CallbackMode.WAKE_UP
              : undefined,
            wakeUpThreadId: effectiveThreadId ?? null,
            wakeUpToolMessageId: effectiveToolMessageId ?? null,
            wakeUpLeafMessageId: streamContext.leafMessageId ?? null,
            wakeUpModelId: resolvedModelId,
            wakeUpSkillId: streamContext.skillId ?? null,
            wakeUpFavoriteId: streamContext.favoriteId ?? null,
            wakeUpSubAgentDepth: streamContext.subAgentDepth ?? 0,
            locale,
            logger,
          });

          if (wsDispatch === "failed") {
            // Definite-outcome rule: an undeliverable dispatch must fail the
            // call explicitly — never return fake "pending" that leaves the
            // thread waiting forever on a result that can never arrive.
            discardWsCall(wsTaskId);
            logger.warn(
              "[RouteExecute] Reverse-ws dispatch undeliverable — failing call",
              { toolName, instanceId, wsTaskId },
            );
            return fail({
              message: t("executeTool.post.errors.notFound.title"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
              messageParams: { toolName },
            });
          }

          if (isInlineMode && wsDispatch === "sent-ws") {
            // Block inline on the socket reply (remote-call/spec.md). The
            // remote's WS server executes and replies tool-execute-result on
            // the same socket; the connector completes the pending call.
            const MEDIA_TOOLS = [
              "generate_image",
              "generate_video",
              "generate_music",
            ];
            const inlineTimeoutMs = MEDIA_TOOLS.includes(toolName)
              ? 600_000
              : 90_000;
            const inlineResult = await awaitPendingCallResult(
              wsTaskId,
              inlineTimeoutMs,
            );
            discardWsCall(wsTaskId);
            if (!inlineResult) {
              logger.warn(
                "[RouteExecute] Reverse-ws inline wait timed out — failing call",
                { toolName, instanceId, wsTaskId, inlineTimeoutMs },
              );
              return fail({
                message: t("executeTool.post.errors.notFound.title"),
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                messageParams: { toolName },
              });
            }
            if (inlineResult.status === "failed") {
              return fail({
                message: t("executeTool.post.errors.notFound.title"),
                errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                messageParams: { toolName },
              });
            }
            // Same shape as a local execute-tool call: { result: ... }
            return success({ result: inlineResult.output ?? {} });
          }

          return success({
            taskId: wsTaskId,
            hint:
              callbackMode === CallbackMode.DETACH
                ? "Task detached. Use wait-for-task with this taskId if you need to wait for the result/return."
                : "Result/return will be injected when complete and wakes up the thread. Call wait-for-task only if you need the result before continuing.",
          });
        }

        // Transport unavailable — fail immediately. No task queue fallback.
        logger.warn(
          "[RouteExecute] Transport unavailable — failing immediately",
          { toolName, instanceId, transportMode: connInfo.transportMode },
        );
        return fail({
          message: t("executeTool.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
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
          result: { status: "waiting_for_confirmation", toolName },
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
          streamContext.currentToolMessageId ?? streamContext.aiMessageId;

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
          // RUNNING from creation: the goroutine below is already executing.
          // Streams and wait-for-task discover in-flight work by this status.
          lastExecutionStatus: CronTaskStatus.RUNNING,
          taskInput: input ?? {},
          // Revival context in typed columns.
          wakeUpCallbackMode: CallbackMode.DETACH,
          wakeUpThreadId: effectiveThreadId ?? null,
          wakeUpToolMessageId: effectiveToolMessageId ?? null,
          wakeUpSubAgentDepth: streamContext.subAgentDepth ?? 0,
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
              Record<string, WidgetData>
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
              // This is non-fatal - execution history is best-effort for detach tasks.
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
                  wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
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

              // Honour WAIT upgrade: if wait-for-task registered a waiter, fire WAIT revival.
              // WAIT backfills the wait-for-task tool message inline + fires headless stream.
              const detachFinalCallbackMode =
                upgradedCallbackMode === CallbackMode.WAKE_UP ||
                upgradedCallbackMode === CallbackMode.WAIT
                  ? upgradedCallbackMode
                  : CallbackMode.DETACH;

              // Backfill BEFORE flipping the cron task to terminal so hasPendingWork()
              // (which checks lastExecutionStatus=RUNNING) stays true until the DB write
              // is complete. This prevents the test / stream from reading the tool message
              // before the imageUrl (or other final result) has been persisted.
              await handleTaskCompletion({
                toolMessageId: upgradedToolMessageId,
                threadId: upgradedThreadId,
                callbackMode: detachFinalCallbackMode,
                status: finalStatus,
                output: finalResult,
                taskId,
                modelId: latestTask?.wakeUpModelId ?? null,
                skillId: latestTask?.wakeUpSkillId ?? null,
                favoriteId: latestTask?.wakeUpFavoriteId ?? null,
                leafMessageId: latestTask?.wakeUpLeafMessageId ?? null,
                subAgentDepth:
                  latestTask?.wakeUpSubAgentDepth ??
                  streamContext.subAgentDepth,
                ownerUser: user,
                logger,
                directResumeLocale: locale,
                abortSignal: streamContext.abortSignal,
              });
            }

            // Flip to terminal AFTER backfill so hasPendingWork() correctly gates
            // until the tool message result is written (imageUrl etc. visible to readers).
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
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : String(err);
            logger.error("[RouteExecute] Detach goroutine failed", {
              toolName,
              taskId,
              error: errMsg,
            });
          }
        })();

        return success({
          taskId,
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

        const effectiveThreadId = streamContext.threadId;
        // Resolve tool message ID for this specific parallel tool call.
        // Priority: (1) DB lookup by toolCallId (authoritative, avoids race with stream-part-handler)
        //           (2) pendingToolMessages map (set by tools-loader before execute() if no race)
        //           (3) currentToolMessageId (set by stream-part-handler, may have timing issues)
        //           (4) aiMessageId (placeholder assistant - last resort, almost always wrong for wakeUp)
        // The DB lookup is safe because tool-call-handler writes the tool message row before
        // returning, and execute() is called asynchronously after that write.
        const pendingEntry = streamContext.callerToolCallId
          ? streamContext.pendingToolMessages?.get(
              streamContext.callerToolCallId,
            )
          : undefined;

        let resolvedToolMessageId: string | undefined =
          pendingEntry?.messageId ?? streamContext.currentToolMessageId;
        let resolvedLeafMessageId: string | null =
          pendingEntry?.toolCallData?.parentId ??
          streamContext.leafMessageId ??
          null;

        // DB fallback: if in-memory lookup missed (race between execute() and stream-part-handler),
        // query the tool message row directly using toolCallId stored in metadata JSONB + threadId.
        // ORDER BY createdAt DESC to prefer the most recent match — the AI SDK reuses sequential
        // toolCallIds like "functions.execute-tool:1" each turn, so ordering ensures we get the
        // current turn's message rather than a stale one from a prior turn.
        if (
          !resolvedToolMessageId &&
          streamContext.callerToolCallId &&
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
                drizzleSql`(${chatMessages.metadata}->'toolCall'->>'toolCallId') = ${streamContext.callerToolCallId}`,
              ),
            )
            .orderBy(drizzleSql`${chatMessages.createdAt} DESC`)
            .limit(1);
          if (row) {
            resolvedToolMessageId = row.id;
            resolvedLeafMessageId = resolvedLeafMessageId ?? row.parentId;
          }
        }

        const effectiveToolMessageId =
          resolvedToolMessageId ?? streamContext.aiMessageId;
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
          wakeUpModelId: resolvedModelId,
          wakeUpSkillId: streamContext.skillId ?? null,
          wakeUpFavoriteId: streamContext.favoriteId ?? null,
          wakeUpLeafMessageId: effectiveLeafMessageId,
          wakeUpSubAgentDepth: streamContext.subAgentDepth ?? 0,
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
          const wrappedEscalateToTask = streamContext.escalateToTask
            ? async (opts?: EscalateOpts): EscalateResult => {
                selfEscalated = true;
                return streamContext!.escalateToTask!(opts);
              }
            : undefined;
          // The goroutine runs independently of the parent stream. The parent's
          // abortSignal fires when the stream ends (REMOTE_TOOL_WAIT), which would
          // kill the goroutine's in-flight API calls (e.g. image generation) before
          // they complete. Use a fresh signal so the goroutine survives parent death.
          const goroutineAbortController = new AbortController();
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
            abortSignal: goroutineAbortController.signal,
            // Wrapped escalateToTask: sets selfEscalated=true so we skip handleTaskCompletion.
            escalateToTask: wrappedEscalateToTask,
          };
          // Closure variable: holds the tool result so the finally block can
          // deliver it through handleTaskCompletion.
          let wakeUpFinalResult: Record<string, WidgetData> | null = null;
          try {
            const result = await RouteExecutionExecutor.executeGenericHandler<
              Record<string, WidgetData>
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
            // handleTaskCompletion is called in the finally block below, after
            // the atomic claim, so wait-for-task interception is detected reliably.
          } catch (err) {
            logger.error("[RouteExecute] wakeUp task execution failed", {
              taskId,
              toolName,
              error: err instanceof Error ? err.message : String(err),
            });
          } finally {
            // Atomically mark COMPLETED, but ONLY if wait-for-task has NOT
            // intercepted yet (wakeUpCallbackMode still = WAKE_UP).
            // If wait-for-task already wrote WAIT, rowsUpdated = 0 → fire the
            // WAIT revival it registered instead.
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
                    updatedAt: new Date(),
                  })
                  .where(
                    drizzleSql`${cronTasks.id} = ${taskId} AND ${cronTasks.wakeUpCallbackMode} = ${CallbackMode.WAKE_UP}`,
                  );

                const claimed =
                  updated.rowCount !== null && updated.rowCount > 0;

                if (!claimed) {
                  // wait-for-task intercepted (wakeUpCallbackMode=WAIT): fire
                  // the WAIT revival it registered — backfills the
                  // wait-for-task tool message with the result and resumes
                  // the paused stream. resume-stream's atomic isStreaming
                  // claim prevents double-firing.
                  await db
                    .update(cronTasks)
                    .set({
                      lastExecutionStatus: CronTaskStatus.COMPLETED,
                      lastExecutedAt: new Date(),
                      updatedAt: new Date(),
                    })
                    .where(eq(cronTasks.id, taskId));

                  const [waiterTask] = await db
                    .select({
                      wakeUpThreadId: cronTasks.wakeUpThreadId,
                      wakeUpToolMessageId: cronTasks.wakeUpToolMessageId,
                      wakeUpModelId: cronTasks.wakeUpModelId,
                      wakeUpSkillId: cronTasks.wakeUpSkillId,
                      wakeUpFavoriteId: cronTasks.wakeUpFavoriteId,
                      wakeUpLeafMessageId: cronTasks.wakeUpLeafMessageId,
                      wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
                    })
                    .from(cronTasks)
                    .where(eq(cronTasks.id, taskId))
                    .limit(1);

                  if (
                    waiterTask?.wakeUpToolMessageId &&
                    waiterTask.wakeUpThreadId
                  ) {
                    await handleTaskCompletion({
                      toolMessageId: waiterTask.wakeUpToolMessageId,
                      threadId: waiterTask.wakeUpThreadId,
                      callbackMode: CallbackMode.WAIT,
                      status:
                        wakeUpFinalResult !== null
                          ? CronTaskStatus.COMPLETED
                          : CronTaskStatus.FAILED,
                      output: wakeUpFinalResult,
                      taskId,
                      modelId: waiterTask.wakeUpModelId ?? null,
                      skillId: waiterTask.wakeUpSkillId ?? null,
                      favoriteId: waiterTask.wakeUpFavoriteId ?? null,
                      leafMessageId: waiterTask.wakeUpLeafMessageId ?? null,
                      subAgentDepth:
                        waiterTask.wakeUpSubAgentDepth ??
                        streamContext.subAgentDepth,
                      ownerUser: user,
                      logger,
                      directResumeLocale: locale,
                      abortSignal: goroutineAbortController.signal,
                    });
                  }
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
                      wakeUpSubAgentDepth: cronTasks.wakeUpSubAgentDepth,
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
                    modelId: latestTask?.wakeUpModelId ?? null,
                    skillId:
                      latestTask?.wakeUpSkillId ??
                      streamContext.skillId ??
                      null,
                    favoriteId:
                      latestTask?.wakeUpFavoriteId ??
                      streamContext.favoriteId ??
                      null,
                    leafMessageId:
                      latestTask?.wakeUpLeafMessageId ??
                      streamContext.leafMessageId ??
                      null,
                    subAgentDepth:
                      latestTask?.wakeUpSubAgentDepth ??
                      streamContext.subAgentDepth,
                    ownerUser: user,
                    logger,
                    directResumeLocale: locale,
                    abortSignal: goroutineAbortController.signal,
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
              // No stream context: no tool message to wake. Record the result
              // as execution history and mark the row completed.
              try {
                await db.insert(cronTaskExecutions).values({
                  taskId,
                  taskName: toolName,
                  executionId: `wakeup-${taskId}`,
                  status:
                    wakeUpFinalResult !== null
                      ? CronTaskStatus.COMPLETED
                      : CronTaskStatus.FAILED,
                  priority: CronTaskPriority.HIGH,
                  startedAt,
                  completedAt: new Date(),
                  durationMs: Date.now() - startedAt.getTime(),
                  result: wakeUpFinalResult ?? undefined,
                  triggeredBy: "wakeup",
                  config: {},
                });
                await db
                  .update(cronTasks)
                  .set({
                    lastExecutionStatus: CronTaskStatus.COMPLETED,
                    lastExecutedAt: new Date(),
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
          hint: "Result/return will be injected when complete and wakes up the thread. Call wait-for-task only if you need the result before continuing.",
        });
      }

      logger.debug("[RouteExecute] Executing route", { toolName });

      // Enforce requiresConfirmation for local tools — the SAME gate as a
      // direct call: the endpoint definition AND the per-context confirmation
      // settings (favorite/skill/request cascade) both apply to the TARGET
      // tool when the AI routes through execute-tool.
      //
      // callbackMode=approve means the user already confirmed; skip the gate.
      if (
        !instanceId &&
        data.callbackMode !== CallbackMode.APPROVE &&
        !streamContext?.isConfirmedReExecution &&
        streamContext
      ) {
        const targetEndpoint = await getEndpoint(toolName);
        const contextRequiresConfirmation =
          streamContext.confirmationOverrides?.some(
            (o) =>
              o.requiresConfirmation &&
              (o.toolId === toolName ||
                (targetEndpoint
                  ? o.toolId === getPreferredToolName(targetEndpoint)
                  : false)),
          ) ?? false;
        if (
          targetEndpoint?.requiresConfirmation ||
          contextRequiresConfirmation
        ) {
          logger.info(
            "[RouteExecute] Target endpoint requires confirmation - backfilling tool message and halting",
            { toolName },
          );
          // Mutate the pending tool message entry so tool-result-handler builds the
          // final toolCall with waitingForConfirmation=true. Without this, tool-result-handler
          // spreads toolCallData.toolCall (which has waitingForConfirmation=false for execute-tool)
          // and overwrites any DB update made here.
          const callerToolCallId = streamContext.callerToolCallId;
          if (callerToolCallId && streamContext.pendingToolMessages) {
            const pending =
              streamContext.pendingToolMessages.get(callerToolCallId);
            if (pending?.toolCallData) {
              pending.toolCallData.toolCall = {
                ...pending.toolCallData.toolCall,
                requiresConfirmation: true,
                waitingForConfirmation: true,
                isConfirmed: false,
              };
            }
          }
          // Signal the stream to abort at finish-step before the AI response turn.
          // stepHasToolsAwaitingConfirmation → finish-step-handler fires TOOL_CONFIRMATION abort.
          streamContext.stepHasToolsAwaitingConfirmation = true;
          return success({
            result: { status: "waiting_for_confirmation", toolName },
          });
        }
      }

      if (streamContext) {
        streamContext.callerCallbackMode = callbackMode ?? undefined;
      }

      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data: input ?? {},
        user,
        locale,
        logger,
        platform,
        streamContext: streamContext ?? {
          ...makeHeadlessContext(),
          callerCallbackMode: callbackMode ?? undefined,
        },
      });

      // Discard result if stream was cancelled during tool execution.
      // The abort signal may have fired while the tool was running - any result
      // returned after cancellation should be ignored to prevent ghost responses.
      if (streamContext.abortSignal.aborted) {
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
        const compactDetails = formatValidationErrorCompact(
          result.messageParams as Record<string, string | number> | undefined,
          endpoint,
        );
        if (compactDetails) {
          return {
            ...result,
            message: compactDetails as typeof result.message,
          };
        }
        return result;
      }

      // Wrap target's .data in `result` so MCP/UI renders it.
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

  /**
   * In-process entry point — execute any tool on any instance from any surface.
   *
   * All non-HTTP callers (CLI remote leg, MCP remote tools, relay handlers, tests)
   * use this instead of calling RouteExecutionExecutor.executeGenericHandler() directly.
   * This ensures every surface shares the same remote dispatch, callback mode handling,
   * platform filtering, and long-running task infrastructure.
   *
   * - toolName may be prefixed "hermes__ssh_exec_POST" to target a remote instance.
   * - platform controls permission gating and response shaping.
   * - For local tools: delegates to executeGenericHandler() with no overhead.
   * - For remote tools: uses direct-HTTP or reverse-WS paths per connection config.
   */
  static async runInProcess(params: {
    toolName: string;
    input?: Record<string, WidgetData>;
    instanceId?: string;
    callbackMode?: CallbackModeValue;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
    platform: Platform;
  }): Promise<ResponseType<WidgetData>> {
    const { scopedTranslation } =
      await import("@/app/api/[locale]/system/unified-interface/ai/i18n");
    const { t } = scopedTranslation.scopedT(params.locale);
    const result = await RouteExecuteRepository.execute(
      {
        toolName: params.toolName,
        input: (params.input ?? {}) as RouteExecuteRequestOutput["input"],
        instanceId: params.instanceId,
        callbackMode: params.callbackMode ?? CallbackMode.WAIT,
      },
      params.user,
      params.locale,
      params.logger,
      t,
      params.streamContext,
      params.platform,
    );
    if (!result.success) {
      return result;
    }
    // RouteExecuteResponseInput is a plain serialisable object — safe to round-trip to WidgetData.
    const data: WidgetData = JSON.parse(JSON.stringify(result.data));
    return success(data);
  }

  /**
   * Type-safe variant of runInProcess. Pass a definition instead of a raw toolName string.
   * The toolName is derived from definition.aliases[0] or path+method, and the input/response
   * types are inferred from definition.types.
   *
   * logger defaults to a throwaway endpoint logger; streamContext defaults to makeHeadlessContext().
   * All other params (locale, platform, user) must be explicit.
   */
  static async runInProcessTyped<TDef extends CreateApiEndpointAny>(
    params: {
      definition: TDef;
      instanceId?: string;
      callbackMode?: CallbackModeValue;
      user: JwtPayloadType;
      locale: CountryLanguage;
      logger?: EndpointLogger;
      streamContext?: ToolExecutionContext;
      platform: Platform;
    } & (TDef["types"]["RequestOutput"] extends never
      ? { input?: never }
      : { input: TDef["types"]["RequestOutput"] }) &
      (TDef["types"]["UrlVariablesOutput"] extends never
        ? { urlPathParams?: never }
        : { urlPathParams: TDef["types"]["UrlVariablesOutput"] }),
  ): Promise<ResponseType<TDef["types"]["ResponseOutput"]>> {
    const { definition, input, urlPathParams, ...rest } = params;
    const logger =
      rest.logger ?? createEndpointLogger(false, Date.now(), rest.locale);
    const streamContext = rest.streamContext ?? makeHeadlessContext();
    const rawToolName =
      (definition.aliases?.[0] as string | undefined) ??
      `${definition.path.join("_")}_${definition.method}`;
    // Strip Next.js path param brackets: [threadId] → threadId (matches generated route-handler keys)
    const toolName = rawToolName.replace(/\[([^\]]+)\]/g, "$1");

    // When instanceId or callbackMode is set, route through execute() so remote dispatch,
    // incognito blocking, callback mode handling, and task creation all apply.
    // The execute() → runInProcess() path wraps the response in { result: ... } for
    // MCP/AI display, but for typed calls we need the raw endpoint data. We recover it
    // by going through executeGenericHandler after execute() has already validated routing.
    if (rest.instanceId ?? rest.callbackMode) {
      const routingResult = await RouteExecuteRepository.runInProcess({
        toolName,
        input: {
          ...(input as Record<string, WidgetData> | undefined),
          ...(urlPathParams as Record<string, WidgetData> | undefined),
        },
        instanceId: rest.instanceId,
        callbackMode: rest.callbackMode,
        user: rest.user,
        locale: rest.locale,
        logger,
        streamContext,
        platform: rest.platform,
      });
      // Type boundary: runInProcess returns ResponseType<WidgetData>; caller gets typed view.
      return routingResult as ResponseType<TDef["types"]["ResponseOutput"]>;
    }

    // Local WAIT path: call executeGenericHandler directly for the raw typed response.
    // If urlPathParams is explicitly provided, pass them pre-split to executeGenericHandler
    // (bypasses splitArgs, exactly matching what CLI callers do).
    // If urlPathParams is not provided, merge everything into data and let splitArgs auto-split
    // (matching AI/MCP flat-args convention).
    const hasExplicitUrlPathParams = urlPathParams !== undefined;
    const resolvedData: Record<string, WidgetData> = hasExplicitUrlPathParams
      ? (input as Record<string, WidgetData>)
      : {
          ...(input as Record<string, WidgetData>),
          ...(urlPathParams as Record<string, WidgetData> | undefined),
        };
    const resolvedUrlPathParams: Record<string, WidgetData> | undefined =
      hasExplicitUrlPathParams
        ? (urlPathParams as Record<string, WidgetData>)
        : undefined;
    return RouteExecutionExecutor.executeGenericHandler<
      TDef["types"]["ResponseOutput"]
    >({
      toolName,
      data: resolvedData,
      urlPathParams: resolvedUrlPathParams,
      user: rest.user,
      locale: rest.locale,
      logger,
      platform: rest.platform,
      streamContext,
    });
  }

  /**
   * Execute a tool locally and POST tool-execute-result back to a remote /ws/broadcast.
   *
   * Used by relay handlers (HeadlessRelayProcessor, unbottled-stream-handler) when the
   * remote AI loop sends a tool-execute-request and needs the result to continue.
   * Centralises what was previously duplicated in both handlers.
   */
  static async executeLocalAndBroadcast(params: {
    toolName: string;
    input: Record<string, WidgetData>;
    callId: string;
    broadcastUrl: string;
    broadcastChannel: string;
    authHeader: string;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
    platform: Platform;
  }): Promise<void> {
    const {
      toolName,
      input,
      callId,
      broadcastUrl,
      broadcastChannel,
      authHeader,
      user,
      locale,
      logger,
      streamContext,
      platform,
    } = params;

    let result: WidgetData | undefined;
    let error: string | undefined;

    try {
      const response =
        await RouteExecutionExecutor.executeGenericHandler<WidgetData>({
          toolName,
          data: input,
          user,
          locale,
          logger,
          platform,
          streamContext,
        });
      if (response.success) {
        result = response.data;
      } else {
        error =
          "message" in response
            ? String(response.message)
            : "Tool execution failed";
      }
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      logger.warn("[RouteExecute] executeLocalAndBroadcast tool threw", {
        toolName,
        callId,
        error,
      });
    }

    await broadcastToolResult({
      broadcastUrl,
      broadcastChannel,
      authHeader,
      callId,
      result,
      error,
      logger,
    });
  }
}
