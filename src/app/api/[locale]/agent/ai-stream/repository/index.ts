/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import type { JSONValue } from "ai";
import type { NextRequest } from "next-vibe-ui/lib/request";
import {
  ErrorResponseTypes,
  fail,
  success,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import { UserRepository } from "@/app/api/[locale]/user/repository";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ToolCall } from "../../chat/db";
import { ChatMessageRole } from "../../chat/enum";
import {
  createMessagesEmitter,
  emitThreadTitleUpdated,
  type WsEmitCallback,
} from "../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../chat/threads/[threadId]/messages/repository";
import type { ImageGenModelSelection } from "../../image-generation/models";
import { ApiProvider } from "../../models/models";
import type { MusicGenModelSelection } from "../../music-generation/models";
import { DEFAULT_TTS_VOICE_ID } from "../../text-to-speech/constants";
import type { VideoGenModelSelection } from "../../video-generation/models";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../stream/definition";
import type { AiStreamT } from "../stream/i18n";
import {
  clearStreamingState,
  setStreamingStateWaiting,
  StreamRegistry,
} from "./core/stream-registry";
import {
  subscribeWakeUpSignal,
  type WakeUpPayload,
} from "./core/wake-up-channel";
import { serializeError } from "./error-utils";
import { CompactingHandler } from "./handlers/compacting-handler";
import { GapFillExecutor } from "./handlers/gap-fill-executor";
import { InitialEventsHandler } from "./handlers/initial-events-handler";
import { MessageContextBuilder } from "./handlers/message-context-builder";
import { StreamErrorCatchHandler } from "./handlers/stream-error-catch-handler";
import { StreamExecutionHandler } from "./handlers/stream-execution-handler";
import { StreamStartHandler } from "./handlers/stream-start-handler";
import { buildFavoriteConfig } from "../../chat/favorites/repository";
import { parseSkillId } from "../../chat/slugify";
import type { HeadlessAiStreamResult } from "./headless";
import { setupAiStream } from "./stream-setup";
import { buildSystemPrompt } from "./system-prompt/builder";

/**
 * AI Stream Repository Implementation
 */
export class AiStreamRepository {
  /**
   * Maximum duration for streaming responses (in seconds)
   */
  private static readonly maxDuration = 900; // 15 minutes for multi-step tool calling

  /**
   * Extract user identifiers from request
   */
  private static extractUserIdentifiers(
    user: JwtPayloadType,
    request: NextRequest | undefined,
    headless: boolean,
  ): {
    userId: string | undefined;
    leadId: string;
    ipAddress?: string;
  } {
    const userId = !user.isPublic && user.id ? user.id : undefined;

    const ipAddress = request
      ? request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        undefined
      : headless
        ? "headless"
        : "cli";

    return { userId, leadId: user.leadId, ipAddress };
  }

  /** Headless overload - returns structured result with threadId + lastAiMessageId */
  static createAiStream(params: {
    data: AiStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    headless: true;
    isRevival?: boolean;
    t: AiStreamT;
    extraInstructions?: string;
    excludeMemories?: boolean;
    favoriteIdOverride?: string;
    sequenceIdOverride?: string;
    subAgentDepth: number;
    mediaModelOverrides?: {
      musicGenModelSelection?: MusicGenModelSelection;
      videoGenModelSelection?: VideoGenModelSelection;
      imageGenModelSelection?: ImageGenModelSelection;
    };
    providerOverride?: ApiProvider;
    /** Parent stream's abort signal - sub-stream aborts when parent does */
    parentAbortSignal?: AbortSignal;
  }): Promise<ResponseType<HeadlessAiStreamResult>>;

  /** Interactive overload - returns response output (events stream via WS) */
  static createAiStream(params: {
    data: AiStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    headless?: false;
    t: AiStreamT;
    extraInstructions?: string;
    excludeMemories?: boolean;
    subAgentDepth: number;
    sequenceIdOverride?: string;
    /** Override tools entirely (for API provider client-provided tools) */
    toolsOverride?: Record<string, CoreTool>;
  }): Promise<ResponseType<AiStreamPostResponseOutput>>;

  static async createAiStream({
    data,
    locale,
    logger,
    user,
    request,
    headless = false,
    isRevival,
    t: aiStreamT,
    extraInstructions,
    excludeMemories,
    favoriteIdOverride,
    sequenceIdOverride,
    subAgentDepth,
    mediaModelOverrides,
    providerOverride,
    toolsOverride,
    parentAbortSignal,
  }: {
    data: AiStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    headless?: boolean;
    isRevival?: boolean;
    t: AiStreamT;
    extraInstructions?: string;
    excludeMemories?: boolean;
    favoriteIdOverride?: string;
    sequenceIdOverride?: string;
    subAgentDepth: number;
    mediaModelOverrides?: {
      musicGenModelSelection?: MusicGenModelSelection;
      videoGenModelSelection?: VideoGenModelSelection;
      imageGenModelSelection?: ImageGenModelSelection;
    };
    providerOverride?: ApiProvider;
    toolsOverride?: Record<string, CoreTool>;
    parentAbortSignal?: AbortSignal;
  }): Promise<
    | ResponseType<AiStreamPostResponseOutput>
    | ResponseType<HeadlessAiStreamResult>
  > {
    const { userId, leadId, ipAddress } =
      AiStreamRepository.extractUserIdentifiers(user, request, headless);

    // ================================================================
    // Remote host: if rootFolderId === REMOTE, delegate to the configured
    // remote provider via the ws-provider/stream protocol. No local AI runs.
    // ================================================================
    if (!headless && !isRevival) {
      const { isRemoteHostRequest, delegateToRemoteHost } =
        await import("../../support/remote-host-repository");
      if (isRemoteHostRequest(data)) {
        return delegateToRemoteHost({ data, user, locale, logger, request });
      }
    }

    // ================================================================
    // Auto-queue: if the thread is already streaming, save the user
    // message with isQueued metadata and return immediately — no AI
    // stream, no credits, no tools. The queue processor will pick
    // this up after the current stream ends.
    // The client sends a normal "send" operation — queue detection is
    // entirely server-side via StreamRegistry.
    // ================================================================
    if (
      data.operation === "send" &&
      data.threadId &&
      data.userMessageId &&
      StreamRegistry.isActive(data.threadId)
    ) {
      const authorName = userId
        ? await UserRepository.getUserPublicName(userId, logger)
        : null;

      await MessagesRepository.createUserMessage({
        messageId: data.userMessageId,
        threadId: data.threadId,
        role: ChatMessageRole.USER,
        content: data.content,
        parentId: data.parentMessageId || null,
        userId,
        authorName,
        logger,
        extraMetadata: {
          isQueued: true,
          queuedSettings: {
            model: data.model,
            skill: data.skill,
            rootFolderId: data.rootFolderId,
            subFolderId: data.subFolderId ?? null,
            voiceMode: data.voiceMode ?? {
              enabled: false,
              voice: DEFAULT_TTS_VOICE_ID,
            },
            favoriteConfig: data.favoriteConfig
              ? buildFavoriteConfig({
                  ...data.favoriteConfig,
                  ...parseSkillId(data.favoriteConfig.skillId),
                })
              : null,
            timezone: data.timezone,
          },
        },
      });

      // Emit message-created so the frontend can confirm persistence
      const wsEmit = createMessagesEmitter(
        data.threadId,
        data.rootFolderId,
        logger,
        user,
      );
      wsEmit("message-created", {
        streamingState: "streaming", // Keep streaming state — the AI is still streaming
        messages: [
          {
            id: data.userMessageId,
            threadId: data.threadId,
            role: ChatMessageRole.USER,
            isAI: false,
            content: data.content,
            parentId: data.parentMessageId || null,
            sequenceId: null,
            model: null,
            skill: null,
            metadata: { isQueued: true },
          },
        ],
      });

      logger.info("[AI Stream] Queued message created", {
        messageId: data.userMessageId,
        threadId: data.threadId,
      });

      return success({
        success: true,
        messageId: data.userMessageId,
        responseThreadId: data.threadId,
      }) satisfies ResponseType<AiStreamPostResponseOutput>;
    }

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      aiStreamT,
      maxDuration: AiStreamRepository.maxDuration,
      request,
      headless,
      subAgentDepth,
      isRevival,
      extraInstructions,
      excludeMemories,
      favoriteIdOverride,
      mediaModelOverrides,
      providerOverride,
      toolsOverride,
      parentAbortSignal,
    });

    if (!setupResult.success) {
      logger.error("[AiStream] Setup failed", {
        errorType: setupResult.errorType?.errorCode,
        message: setupResult.message,
        threadId: data.threadId,
      });
      // Emit error to chat thread if we have a threadId - setup failures (e.g. insufficient
      // credits, bad model) should appear as error bubbles in the thread, not silently fail.
      const threadId = data.threadId;
      const isIncognito = data.rootFolderId === "incognito";
      if (threadId && !user.isPublic && "id" in user) {
        try {
          const errorMessageId = crypto.randomUUID();
          const errorContent = serializeError(setupResult);
          const errorType = setupResult.errorType
            ? `${setupResult.errorType.errorCode}`
            : "SETUP_ERROR";
          // Persist error message to DB only for non-incognito threads (incognito has no DB row)
          if (!isIncognito) {
            await MessagesRepository.createErrorMessage({
              messageId: errorMessageId,
              threadId,
              content: errorContent,
              errorType,
              parentId: data.parentMessageId || null,
              user,
              sequenceId: null,
              logger,
            });
          }
          // Always emit via WS so the frontend can display the error (incognito stores it client-side)
          const setupErrorEmit = createMessagesEmitter(
            threadId,
            data.rootFolderId,
            logger,
            user,
          );
          setupErrorEmit("message-created", {
            streamingState: "idle",
            messages: [
              {
                id: errorMessageId,
                threadId,
                role: ChatMessageRole.ERROR,
                content: errorContent,
                parentId: data.parentMessageId || null,
                sequenceId: null,
                model: null,
                skill: null,
                metadata: {},
                isAI: true,
              },
            ],
          });
        } catch (emitErr) {
          logger.warn("[AiStream] Failed to emit setup error to chat", {
            threadId,
            error: emitErr instanceof Error ? emitErr.message : String(emitErr),
          });
        }
      }
      return setupResult;
    }

    const {
      isIncognito,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResultThreadId,
      isNewThread,
      userMessageId,
      aiMessageId,
      userMessageCreatedAt,
      messages,
      systemPrompt,
      trailingSystemMessage: initialTrailingSystemMessage,
      toolConfirmationResults,
      voiceMode,
      voiceTranscription,
      userMessageMetadata,
      fileUploadPromise,
      modelConfig,
      tools,
      toolsConfig,
      activeToolNames,
      provider,
      streamAbortController,
      effectiveCompactTrigger,
      streamContext,
      skipAiTurn,
      bridgeContext,
      systemPromptParams,
    } = setupResult.data;
    let trailingSystemMessage = initialTrailingSystemMessage;

    // All confirmations were wakeUp-pending OR a confirmed execute-tool (queue WAIT) already
    // created a remote task - no AI turn needed here.
    // wakeUp-pending: resume-stream will handle revival when each goroutine completes.
    // queue WAIT: handleTaskCompletion fires the revival after the remote task finishes.
    if (skipAiTurn) {
      const isWaitPending = streamContext.waitingForRemoteResult === true;
      logger.debug(
        isWaitPending
          ? "[AiStream] Confirmed execute-tool (queue WAIT) created remote task - skipping AI turn, waiting for revival"
          : "[AiStream] All confirmations wakeUp-pending - skipping AI turn, revival handles it",
        { threadId: data.threadId },
      );
      if (isWaitPending && threadResultThreadId) {
        // Set thread → waiting so the UI shows the stop button and blocks new messages.
        // clearStreamingState is called by handleTaskCompletion when the revival fires.
        await setStreamingStateWaiting(threadResultThreadId);
      }
      if (headless) {
        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: aiMessageId,
            lastAiMessageContent: null,
            lastGeneratedMediaUrl: null,
            totalCreditsDeducted: 0,
            pinnedToolCount: 0,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }
      return {
        success: true,
        data: {
          success: true,
          messageId: aiMessageId,
          responseThreadId: threadResultThreadId,
        },
      } satisfies ResponseType<AiStreamPostResponseOutput>;
    }

    // Captured refs so headless path can read lastAiMessageId + content after runStream completes
    let capturedLastAiMessageId: string = aiMessageId;
    let capturedLastAiMessageContent: string | null = null;
    let capturedLastGeneratedMediaUrl: string | null = null;
    let capturedTotalCreditsDeducted = 0;
    const capturedPinnedToolCount = tools ? Object.keys(tools).length : 0;
    // Captured wakeUp payloads - queue written by the signal handler, processed in finally for deferred insertion + revival.
    // Array supports parallel wakeUp tools: each completion pushes its payload; all are processed sequentially.
    const capturedWakeUpPayloads: WakeUpPayload[] = [];

    // Insert all pending wakeUp deferred messages, then fire ONE revival from the last one.
    // Batching ensures: if multiple wakeUp tools complete before the stream yields,
    // all their deferred messages are inserted as a linear chain, and a single AI
    // turn sees all of them - no duplicate revival responses.
    const handleWakeUpRevivalBatch = async (
      payloads: WakeUpPayload[],
    ): Promise<void> => {
      if (payloads.length === 0) {
        return;
      }
      const { insertDeferredWakeUpMessage } =
        await import("./core/deferred-inserter");

      let lastDeferredId = "";
      let lastPayload = payloads[0];
      // All deferred messages in a batch share one sequenceId so the UI groups
      // them into a single assistant bubble together with the revival AI response.
      const batchSequenceId = crypto.randomUUID();

      // Insert all deferred messages sequentially so they form a linear chain
      // (each walkToLeafMessage finds the previous deferred as the new leaf).
      for (const payload of payloads) {
        const { deferredId } = await insertDeferredWakeUpMessage(
          threadResultThreadId,
          payload,
          logger,
          user,
          batchSequenceId,
        );
        lastDeferredId = deferredId;
        lastPayload = payload;
      }

      logger.debug("[WakeUp] Firing revival after stream yield", {
        threadId: threadResultThreadId,
        deferredCount: payloads.length,
        lastDeferredId,
      });
      const { runHeadlessAiStream } = await import("./headless");
      await runHeadlessAiStream({
        favoriteId: lastPayload.favoriteId,
        favoriteConfig: null,
        model: lastPayload.resolvedModel,
        skill: lastPayload.resolvedSkill,
        prompt: "",
        wakeUpRevival: true,
        explicitParentMessageId: lastDeferredId,
        sequenceIdOverride: batchSequenceId,
        threadId: threadResultThreadId,
        rootFolderId: data.rootFolderId,
        subAgentDepth,
        user,
        locale,
        logger,
        t: aiStreamT,
        abortSignal: streamAbortController.signal,
      }).catch((err: Error) => {
        logger.error("[WakeUp] Revival failed", {
          threadId: threadResultThreadId,
          error: err.message,
        });
      });
    };

    // Create emitter on the messages channel - events are owned by messages endpoint.
    const wsEmit: WsEmitCallback = createMessagesEmitter(
      threadResultThreadId,
      data.rootFolderId,
      logger,
      user,
    );
    const emitTitle = (threadId: string, title: string): void => {
      emitThreadTitleUpdated(threadId, title, data.rootFolderId, logger, user);
    };

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      const runStream = async (): Promise<void> => {
        // Initialize stream context, TTS handler, and emit tool confirmations.
        // User MESSAGE_CREATED is emitted below, after the compacting check.
        const { ctx, ttsHandler, emittedToolResultIds } =
          StreamStartHandler.initializeStream({
            userMessageId,
            aiMessageId,
            effectiveParentMessageId,
            toolConfirmationResults,
            voiceMode,
            fileUploadPromise,
            isNewThread,
            isIncognito,
            threadId: threadResultThreadId,
            messages,
            locale,
            user,
            logger,
            wsEmit,
            emitTitle,
            sequenceIdOverride,
          });

        // Wire StreamContext.pendingToolMessages into ToolExecutionContext so
        // tools-loader can inject the correct currentToolMessageId per toolCallId
        // before calling each tool's execute() - parallel-safe, no polling needed.
        streamContext.pendingToolMessages = ctx.pendingToolMessages;

        // Wire emitPartialToolResult so long-running tools (e.g. ai-run) can
        // stream intermediate state (like a sub-thread ID) before completion.
        streamContext.emitPartialToolResult = async (
          partialResult,
        ): Promise<void> => {
          const toolMessageId = streamContext.currentToolMessageId;
          if (!toolMessageId) {
            return;
          }
          // Look up the pending tool data by messageId (callerToolCallId may not be
          // set for the default inline execution path in tools-loader).
          let pendingToolCall:
            | { toolCallData: { toolCall: ToolCall } }
            | undefined;
          for (const entry of ctx.pendingToolMessages.values()) {
            if (entry.messageId === toolMessageId) {
              pendingToolCall = entry;
              break;
            }
          }
          if (!pendingToolCall) {
            return;
          }
          const partialToolCall = {
            ...pendingToolCall.toolCallData.toolCall,
            result: partialResult,
            isPartial: true,
          };
          await ctx.dbWriter.emitPartialToolResult({
            toolMessageId,
            toolCall: partialToolCall,
          });
        };

        // Wire stop-signal into Agent SDK provider so it can abort its internal loop
        // when endLoop / approve / wakeUp flags are set. The Agent SDK doesn't emit
        // finish-step between turns, so this callback replaces the finish-step abort.

        // Subscribe to wake-up signal so resume-stream can signal this live stream
        // to yield after the current step finishes (wakeUp callback mode).
        const unsubscribeWakeUp = subscribeWakeUpSignal(
          threadResultThreadId,
          (payload) => {
            logger.debug(
              "[WakeUp] Signal received - will yield at next step boundary",
              {
                threadId: threadResultThreadId,
                toolMessageId: payload.toolMessageId,
              },
            );
            capturedWakeUpPayloads.push(payload);
            ctx.shouldYieldForWakeUp = true;
          },
        );
        ctx.onCleanup(unsubscribeWakeUp);

        try {
          // Check if compacting is needed (fetches branch messages from DB/storage)
          const compactingCheck =
            await MessageContextBuilder.shouldTriggerCompacting({
              threadId: threadResultThreadId,
              currentUserMessageId: userMessageId,
              currentUserContent: effectiveContent,
              currentUserRole: effectiveRole,
              currentUserMetadata: userMessageMetadata,
              userId,
              parentMessageId: effectiveParentMessageId,
              isIncognito,
              messageHistory: data.messageHistory ?? undefined,
              systemPrompt,
              tools,
              model: data.model,
              logger,
              compactTrigger: effectiveCompactTrigger,
            });

          logger.debug("[Compacting] Check result", {
            shouldCompact: compactingCheck.shouldCompact,
            totalTokens: compactingCheck.totalTokens,
            messagesToCompactCount: compactingCheck.messagesToCompact.length,
            lastCompactingMessage: compactingCheck.lastCompactingMessage?.id,
          });

          // Emit USER MESSAGE_CREATED AFTER the compacting check so ordering is always correct:
          // - Non-compacting: user message emitted here with original parentId
          // - Compacting: CompactingHandler emits it with parentId = compactingMessageId
          // Emit user MESSAGE_CREATED - WS subscribers see the user message appear.
          if (
            userMessageId &&
            data.operation !== "answer-as-ai" &&
            !compactingCheck.shouldCompact
          ) {
            InitialEventsHandler.emitUserMessage({
              userMessageId,
              threadId: threadResultThreadId,
              operation: data.operation,
              effectiveParentMessageId,
              effectiveContent,
              model: data.model,
              skill: data.skill,
              user,
              dbWriter: ctx.dbWriter,
              logger,
              isNewThread,
              voiceTranscription,
              userMessageMetadata,
            });
          }

          if (compactingCheck.shouldCompact) {
            logger.debug("[Compacting] Starting compacting operation", {
              isRetry: !!compactingCheck.failedCompactingMessage,
              failedCompactingMessageId:
                compactingCheck.failedCompactingMessage?.id ?? null,
            });

            // Determine parent for the new compacting message.
            // Normal: compacting sits directly below effectiveParentMessageId.
            // Retry: failed compacting already occupies that slot - new compacting is a sibling,
            //        so use the same parentId as the failed one.
            const compactingParentId = compactingCheck.failedCompactingMessage
              ? (compactingCheck.failedCompactingMessage.parentId ?? null)
              : effectiveParentMessageId || null;

            // Pre-gap-fill the branch messages so the compacting LLM gets text variants
            // for any images/audio that the compacting model can't handle natively.
            let preFilledHistoryMessages:
              | Parameters<
                  (typeof CompactingHandler)["executeCompacting"]
                >["0"]["preFilledHistoryMessages"]
              | undefined;
            {
              try {
                const { MessageConverter } =
                  await import("./handlers/message-converter");
                const preConvertedHistory =
                  await MessageConverter.toAiSdkMessages(
                    compactingCheck.branchMessages,
                    logger,
                    data.timezone,
                    data.rootFolderId,
                    locale,
                  );
                const gapFilledForCompacting = await GapFillExecutor.runGapFill(
                  {
                    messages: preConvertedHistory,
                    chatHistory: compactingCheck.branchMessages,
                    activeModel: modelConfig,
                    bridgeContext,
                    dbWriter: ctx.dbWriter,
                    abortSignal: streamAbortController.signal,
                    isIncognito,
                    logger,
                    user,
                    locale,
                  },
                );
                preFilledHistoryMessages = gapFilledForCompacting as Parameters<
                  (typeof CompactingHandler)["executeCompacting"]
                >["0"]["preFilledHistoryMessages"];
              } catch (gapErr) {
                // Non-fatal: compacting continues without pre-filled variants
                logger.warn(
                  "[Compacting] Pre-compacting gap fill failed, proceeding without variants",
                  {
                    error:
                      gapErr instanceof Error ? gapErr.message : String(gapErr),
                  },
                );
              }
            }

            // Compacting gets its own sequenceId so it appears as a
            // separate, independently-deletable message group in the UI.
            const compactingSequenceId = crypto.randomUUID();
            // Use timestamp from just before user message insert, minus 1ms.
            // Compacting re-parents the user message (compacting → user), so
            // compacting.createdAt must be strictly less than user.createdAt.
            const compactingMessageCreatedAt = new Date(
              userMessageCreatedAt.getTime() - 1,
            );
            const compactingResult = await CompactingHandler.executeCompacting({
              messagesToCompact: compactingCheck.messagesToCompact,
              branchMessages: compactingCheck.branchMessages,
              currentUserMessage: compactingCheck.currentUserMessage,
              threadId: threadResultThreadId,
              parentId: compactingParentId,
              sequenceId: compactingSequenceId,
              ctx,
              isIncognito,
              userId,
              user,
              model: data.model,
              skill: data.skill,
              providerModel: provider.chat(modelConfig.providerModel),
              abortSignal: streamAbortController.signal,
              logger,
              timezone: data.timezone,
              rootFolderId: data.rootFolderId,
              compactingMessageCreatedAt,
              preFilledHistoryMessages,
              t: aiStreamT,
            });

            // Check if compacting failed
            if (!compactingResult.success) {
              logger.error("[AI Stream] Compacting failed, stopping stream", {
                compactingMessageId: compactingResult.compactingMessageId,
                threadId: threadResultThreadId,
                model: data.model,
              });

              // STOP - don't continue with broken state
              ctx.cleanup();
              return;
            }

            // Refresh cortex context — messages[] has the full conversation
            // that was just compacted, so embedding search reflects current topic.
            try {
              const { buildEmbeddingQuery } =
                await import("../../cortex/system-prompt/server");
              const refreshedPrompt = await buildSystemPrompt({
                ...systemPromptParams,
                lastUserMessage: buildEmbeddingQuery(messages),
                voiceTranscription: null,
              });
              trailingSystemMessage = refreshedPrompt.trailingSystemMessage;
              logger.debug(
                "[Compacting] Refreshed cortex context for rebuilt history",
              );
            } catch (refreshError) {
              // Non-fatal: use original trailing message if refresh fails
              logger.warn(
                "[Compacting] Cortex refresh failed, using original context",
                {
                  error:
                    refreshError instanceof Error
                      ? refreshError.message
                      : String(refreshError),
                },
              );
            }

            // Rebuild message history with compacted version
            const rebuiltHistory =
              await MessageContextBuilder.rebuildWithCompactedHistory({
                compactedSummary: compactingResult.compactedSummary,
                compactingMessageId: compactingResult.compactingMessageId,
                currentUserMessage: compactingCheck.currentUserMessage,
                threadId: threadResultThreadId,
                isIncognito,
                messageHistory: data.messageHistory ?? undefined,
                logger,
                upcomingAssistantMessageId: aiMessageId,
                upcomingAssistantMessageCreatedAt: new Date(),
                model: data.model,
                skill: data.skill,
                timezone: data.timezone,
                rootFolderId: data.rootFolderId,
                trailingSystemMessage,
                locale,
              });

            // Check if rebuilding failed
            if (!rebuiltHistory) {
              const error = new Error(
                "rebuildWithCompactedHistory returned null",
              );
              logger.error(
                "[AI Stream] Failed to rebuild history after compacting",
                error,
              );

              // Emit error event to frontend (noop in headless)
              ctx.dbWriter.emitError(
                fail({
                  message: aiStreamT("errors.compactingRebuildFailed"),
                  errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                }),
              );

              // STOP - don't continue with broken state
              ctx.cleanup();
              return;
            }

            // Update messages array for main stream
            messages.length = 0;
            messages.push(...rebuiltHistory);

            // Update ctx so the AI response has the correct parent.
            // Chain: effectiveParent → compacting → user → AI
            ctx.currentParentId =
              userMessageId ?? compactingResult.compactingMessageId;

            logger.debug("[Compacting] Updated messages for main stream", {
              messageCount: messages.length,
              compactingMessageId: compactingResult.compactingMessageId,
              contextParentId: ctx.currentParentId,
            });
          }

          // Hard-truncate safety net: drop oldest non-system messages if we are
          // still over the model's context window (e.g. compacting wasn't enough,
          // or a single message is enormous).
          const truncated = MessageContextBuilder.truncateToContextWindow(
            messages,
            compactingCheck.modelContextWindow,
            logger,
            systemPrompt,
            tools,
          );
          if (truncated.length !== messages.length) {
            messages.length = 0;
            messages.push(...truncated);
          }

          // Mark thread as streaming before gap-fill so the UI shows activity
          // during potentially long vision/STT bridge calls.
          if (threadResultThreadId) {
            ctx.dbWriter.emitStreamingStateChanged({
              threadId: threadResultThreadId,
              state: "streaming",
            });
          }

          // Gap-fill: replace unsupported attachment parts with text variants
          // via vision bridge / STT.
          {
            const chatHistory = [
              ...compactingCheck.branchMessages,
              ...(compactingCheck.currentUserMessage
                ? [compactingCheck.currentUserMessage]
                : []),
            ];
            const gapFilledMessages = await GapFillExecutor.runGapFill({
              messages,
              chatHistory,
              currentUserMessageId: userMessageId ?? null,
              activeModel: modelConfig,
              bridgeContext,
              dbWriter: ctx.dbWriter,
              abortSignal: streamAbortController.signal,
              isIncognito,
              logger,
              user,
              locale,
            });
            messages.length = 0;
            messages.push(...gapFilledMessages);
          }

          logger.debug(
            "[AI Stream] Calling StreamExecutionHandler.executeStream",
            {
              messageCount: messages.length,
              hasTools: !!tools,
              modelId: data.model,
            },
          );

          // Execute main AI stream - UNBOTTLED models bypass local AI SDK
          // and relay through unbottled.ai cloud instead.
          if (modelConfig.apiProvider === ApiProvider.UNBOTTLED) {
            const { executeUnbottledStream } =
              await import("./handlers/unbottled-stream-handler");
            const { parseUnbottledCredentials, agentEnv } =
              await import("@/app/api/[locale]/agent/env");
            const unbottledSession = parseUnbottledCredentials(
              agentEnv.UNBOTTLED_CLOUD_CREDENTIALS,
            );
            if (!unbottledSession) {
              ctx.dbWriter.emitError(
                fail({
                  message: aiStreamT("route.errors.streamCreationFailed"),
                  errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                }),
              );
            } else {
              await executeUnbottledStream({
                session: unbottledSession,
                modelConfig,
                content: effectiveContent,
                threadId: threadResultThreadId,
                aiMessageId,
                userMessageId: userMessageId ?? "",
                parentMessageId: effectiveParentMessageId || null,
                model: data.model,
                skill: data.skill,
                sequenceId: sequenceIdOverride ?? crypto.randomUUID(),
                userId,
                user,
                isIncognito,
                streamAbortController,
                logger,
                timezone: data.timezone,
                locale,
                t: aiStreamT,
                dbWriter: ctx.dbWriter,
                wsEmit,
                streamContext,
              });
              // Capture dbWriter state for headless callers
              if (ctx.dbWriter.lastAssistantMessageId) {
                capturedLastAiMessageId = ctx.dbWriter.lastAssistantMessageId;
              }
              capturedLastAiMessageContent = ctx.dbWriter.lastAssistantContent;
              capturedLastGeneratedMediaUrl =
                ctx.dbWriter.lastGeneratedMediaUrl;
              capturedTotalCreditsDeducted += ctx.dbWriter.totalCreditsDeducted;
            }
          } else {
            await StreamExecutionHandler.executeStream({
              provider,
              modelConfig,
              messages,
              streamAbortController,
              systemPrompt,
              trailingSystemMessage,
              tools,
              toolsConfig,
              activeToolNames,
              ctx,
              threadId: threadResultThreadId,
              model: data.model,
              skill: data.skill,
              isIncognito,
              userId,
              emittedToolResultIds,
              ttsHandler,
              user,
              locale,
              logger,
              t: aiStreamT,
              streamContext,
              imageSize: data.imageSize ?? undefined,
              imageQuality: data.imageQuality ?? undefined,
              musicDuration: data.musicDuration ?? undefined,
              systemPromptParams,
            });
          }

          // After stream completes, capture the last assistant message ID from the writer.
          // In a tool loop there can be multiple assistant messages; lastAssistantMessageId
          // on the writer is updated on every write so it always holds the final one.
          if (ctx.dbWriter.lastAssistantMessageId) {
            capturedLastAiMessageId = ctx.dbWriter.lastAssistantMessageId;
            capturedLastAiMessageContent = ctx.dbWriter.lastAssistantContent;
            capturedLastGeneratedMediaUrl = ctx.dbWriter.lastGeneratedMediaUrl;
            capturedTotalCreditsDeducted = ctx.dbWriter.totalCreditsDeducted;
          } else if (headless) {
            // No assistant message was written - stream may have errored before first emit.
            // capturedLastAiMessageId falls back to the pre-generated aiMessageId UUID,
            // which may have no content in DB. Log a warning so callers can detect this.
            logger.warn(
              "[AI Stream] Headless stream completed with no assistant message written - " +
                "lastAiMessageId falls back to pre-generated ID, content may be absent",
              { aiMessageId, threadId: threadResultThreadId },
            );
          }
        } catch (error) {
          // Cancel TTS to avoid wasting API calls + credits after error/disconnect
          if (ttsHandler) {
            ttsHandler.cancel();
          }

          if (streamAbortController.signal.aborted) {
            // AbortErrorHandler should have already run in StreamExecutionHandler.
            // Log and continue - the finally block will emit STREAM_FINISHED.
            logger.debug(
              "[AI Stream] Post-abort error in outer catch (abort already handled)",
              {
                abortHandled: ctx.abortHandled,
                error: error instanceof Error ? error.message : String(error),
              },
            );
          } else {
            await StreamErrorCatchHandler.handleError({
              error: error as Error | JSONValue,
              ctx,
              maxDuration: AiStreamRepository.maxDuration,
              model: data.model,
              threadId: threadResultThreadId,
              user,
              logger,
              t: aiStreamT,
            });
          }
        }
      };

      if (headless) {
        // Headless path: must await to capture result
        try {
          await runStream();
        } finally {
          const clearResult = await clearStreamingState(
            threadResultThreadId,
            logger,
            user,
            capturedLastAiMessageContent,
          );
          // Emit stream-finished so clients subscribed to the sub-thread channel
          // (e.g. EmbeddedMessagesView after page refresh) get the "done" signal.
          wsEmit.setStreamPreview({
            preview: clearResult.preview,
            updatedAt: clearResult.updatedAt,
          });
          wsEmit("stream-finished", {
            streamingState: clearResult.state,
          });
          // wakeUp revival: insert deferred (single stream = no race) then revive.
          // Skip if stream was aborted (user cancel or timeout) - don't revive cancelled streams.
          // Also filter out payloads intercepted by wait-for-task (delivered inline).
          const headlessSuppressed =
            streamContext.suppressedWakeUpToolMessageIds;
          const headlessPendingWakeUps = headlessSuppressed
            ? capturedWakeUpPayloads.filter(
                (p) => !headlessSuppressed.has(p.toolMessageId),
              )
            : capturedWakeUpPayloads;
          if (
            headlessPendingWakeUps.length > 0 &&
            !streamAbortController.signal.aborted
          ) {
            await handleWakeUpRevivalBatch(headlessPendingWakeUps);
          } else if (
            headlessPendingWakeUps.length > 0 &&
            streamAbortController.signal.aborted
          ) {
            logger.debug(
              "[WakeUp] Headless: skipping revival - stream was aborted",
              {
                threadId: threadResultThreadId,
                pendingWakeUps: headlessPendingWakeUps.length,
              },
            );
          }
        }

        logger.debug("[AI Stream] Headless execution complete", {
          threadId: threadResultThreadId,
          lastAiMessageId: capturedLastAiMessageId,
        });

        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: capturedLastAiMessageId,
            lastAiMessageContent: capturedLastAiMessageContent,
            lastGeneratedMediaUrl: capturedLastGeneratedMediaUrl,
            totalCreditsDeducted: capturedTotalCreditsDeducted,
            pinnedToolCount: capturedPinnedToolCount,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }

      // Interactive path: fire-and-forget - stream runs independently of HTTP connection.
      // Events flow via WebSocket. The POST returns immediately with threadId.
      // The finally block guarantees isStreaming is cleared even on unhandled crashes.
      let streamFinishReason: "completed" | "cancelled" | "error" | "timeout" =
        "completed";

      void runStream()
        .catch((error) => {
          const msg = error instanceof Error ? error.message : String(error);
          logger.error("[AI Stream] Background stream failed", {
            error: msg,
            threadId: threadResultThreadId,
          });
          streamFinishReason = msg.includes("timeout")
            ? "timeout"
            : msg.includes("cancel")
              ? "cancelled"
              : "error";
        })
        .finally(() => {
          // Cancel any pending stream timeout timer (e.g. wakeUp mode where AI
          // writes a "task fired" response and the loop ends naturally before the
          // 90s escalation timeout fires). Without this, the timer would fire after
          // the stream has already ended, potentially interfering with the revival.
          streamContext.cancelPendingStreamTimer?.();

          // Determine finish reason: if AbortErrorHandler handled it gracefully
          // (runStream resolved instead of rejecting), check the abort signal.
          if (
            streamFinishReason === "completed" &&
            streamAbortController.signal.aborted
          ) {
            const reason = streamAbortController.signal.reason;
            const reasonMsg =
              reason instanceof Error ? reason.message : String(reason ?? "");
            streamFinishReason = reasonMsg.includes("timeout")
              ? "timeout"
              : "cancelled";
          }

          // Skip wakeUp revival if the stream was cancelled by the user.
          // A wakeUp signal may have arrived mid-stream but the user aborted - don't revive.
          // Also filter out payloads intercepted by wait-for-task (delivered inline).
          const wasAborted = streamAbortController.signal.aborted;
          const suppressed = streamContext.suppressedWakeUpToolMessageIds;
          const pendingWakeUps = suppressed
            ? capturedWakeUpPayloads.filter(
                (p) => !suppressed.has(p.toolMessageId),
              )
            : capturedWakeUpPayloads;
          const shouldReviveWakeUp = pendingWakeUps.length > 0 && !wasAborted;

          // clearStreamingState must run BEFORE STREAM_FINISHED is emitted so that
          // if it emits streaming-state-changed:waiting, clients receive it first.
          void clearStreamingState(
            threadResultThreadId,
            logger,
            user,
            capturedLastAiMessageContent,
          )
            .then(async (result) => {
              // Emit STREAM_FINISHED with finalState so the client knows whether
              // to show the stop button (waiting) or go idle after stream ends.
              wsEmit.setStreamPreview({
                preview: result.preview,
                updatedAt: result.updatedAt,
              });
              wsEmit("stream-finished", {
                streamingState: result.state,
              });

              // wakeUp revival: if a pub/sub signal arrived mid-stream, insert the deferred
              // message now (stream is done, single-inserter guarantee holds) then fire revival.
              if (shouldReviveWakeUp) {
                return handleWakeUpRevivalBatch(pendingWakeUps);
              }
              if (pendingWakeUps.length > 0) {
                logger.debug(
                  "[WakeUp] Skipping revival - stream was aborted by user",
                  {
                    threadId: threadResultThreadId,
                    pendingWakeUps: pendingWakeUps.length,
                  },
                );
              }

              // Queue processing: if stream completed naturally (not aborted)
              // and no wakeUp revival, check for queued messages.
              if (!wasAborted) {
                const { processNextQueuedMessage } =
                  await import("./core/queue-processor");
                await processNextQueuedMessage(
                  threadResultThreadId,
                  logger,
                  user,
                  locale,
                  aiStreamT,
                  data.rootFolderId,
                  subAgentDepth,
                ).catch((err: Error) => {
                  logger.error("[Queue] Failed to process queued message", {
                    error: err.message,
                    threadId: threadResultThreadId,
                  });
                });
              }

              return Promise.resolve();
            })
            .catch((err) => {
              logger.error("[AI Stream] Failed to clear streaming state", {
                error: err instanceof Error ? err.message : String(err),
                threadId: threadResultThreadId,
              });
              // Still emit STREAM_FINISHED so the client doesn't stay stuck in
              // streaming/aborting state if the DB update failed.
              wsEmit("stream-finished", {
                streamingState: "idle",
              });
            });
        });

      logger.debug("[AI Stream] Interactive stream started (fire-and-forget)", {
        threadId: threadResultThreadId,
        messageId: aiMessageId,
      });

      return {
        success: true,
        data: {
          success: true,
          messageId: aiMessageId,
          responseThreadId: threadResultThreadId,
        },
      } satisfies ResponseType<AiStreamPostResponseOutput>;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      // Safety net: clear streaming state if threadId is available
      if (threadResultThreadId) {
        await clearStreamingState(
          threadResultThreadId,
          logger,
          user,
          capturedLastAiMessageContent,
        ).catch((err) => {
          logger.error(
            "[AI Stream] Failed to clear streaming state in outer catch",
            {
              error: err instanceof Error ? err.message : String(err),
              threadId: threadResultThreadId,
            },
          );
        });
      }

      // Emit error to thread so the user always sees what went wrong.
      // Chain as child of the last written message so it never creates a sibling branch.
      const errorThreadId = threadResultThreadId ?? data.threadId;
      if (errorThreadId) {
        try {
          const errorMessageId = crypto.randomUUID();
          const errorContent = aiStreamT("route.errors.streamCreationFailed");
          // Chain error as child of the last message written during the stream (assistant/tool/user).
          // Falls back to data.parentMessageId if the stream never wrote anything.
          const errorParentId =
            capturedLastAiMessageId !== aiMessageId
              ? capturedLastAiMessageId
              : data.parentMessageId || null;
          // Persist to DB for non-incognito threads (incognito has no DB row - WS event persists client-side).
          if (!isIncognito && userId) {
            await MessagesRepository.createErrorMessage({
              messageId: errorMessageId,
              threadId: errorThreadId,
              content: errorContent,
              errorType: "STREAM_ERROR",
              parentId: errorParentId,
              user,
              sequenceId: null,
              logger,
            });
          }
          // Always emit via WS so every client (incognito or not) sees the error.
          const outerErrorEmit = createMessagesEmitter(
            errorThreadId,
            data.rootFolderId,
            logger,
            user,
          );
          outerErrorEmit("message-created", {
            messages: [
              {
                id: errorMessageId,
                threadId: errorThreadId,
                role: ChatMessageRole.ERROR,
                content: errorContent,
                parentId: errorParentId,
                sequenceId: null,
                model: null,
                skill: null,
                metadata: null,
                isAI: true,
              },
            ],
            streamingState: "idle",
          });
        } catch (emitErr) {
          logger.warn("[AiStream] Failed to emit stream error to thread", {
            threadId: errorThreadId,
            error: emitErr instanceof Error ? emitErr.message : String(emitErr),
          });
        }
      }

      return fail({
        message: aiStreamT("route.errors.streamCreationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
