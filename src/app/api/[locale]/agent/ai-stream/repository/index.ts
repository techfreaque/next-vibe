/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import type { JSONValue } from "ai";
import type { NextRequest } from "next/server";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import {
  createMessagesEmitter,
  type WsEmitCallback,
} from "../../chat/threads/[threadId]/messages/emitter";
import { createStreamEvent } from "../../chat/threads/[threadId]/messages/events";
import { scopedTranslation as sttScopedTranslation } from "../../speech-to-text/i18n";
import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../stream/definition";
import type { AiStreamT } from "../stream/i18n";
import { clearStreamingState } from "./core/stream-registry";
import { CompactingHandler } from "./handlers/compacting-handler";
import { InitialEventsHandler } from "./handlers/initial-events-handler";
import { MessageContextBuilder } from "./handlers/message-context-builder";
import { StreamErrorCatchHandler } from "./handlers/stream-error-catch-handler";
import { StreamExecutionHandler } from "./handlers/stream-execution-handler";
import { StreamStartHandler } from "./handlers/stream-start-handler";
import { setupAiStream } from "./stream-setup";

/**
 * Maximum duration for streaming responses (in seconds)
 */
export const maxDuration = 900; // 15 minutes for multi-step tool calling

export interface HeadlessAiStreamResult {
  /** Thread ID where the conversation was stored */
  threadId: string;
  /** ID of the last assistant message — caller reads content from DB */
  lastAiMessageId: string;
  /** Final text content of the last assistant message — populated even in incognito (no DB read needed) */
  lastAiMessageContent: string | null;
}

/**
 * Extract user identifiers from request
 */
function extractUserIdentifiers(
  user: JwtPayloadType,
  request: NextRequest | undefined,
  headless: boolean,
): {
  userId?: string;
  leadId?: string;
  ipAddress?: string;
} {
  const userId = !user.isPublic && "id" in user ? user.id : undefined;
  const leadId =
    "leadId" in user && typeof user.leadId === "string"
      ? user.leadId
      : undefined;
  const ipAddress = request
    ? request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      undefined
    : headless
      ? "headless"
      : "cli";

  return { userId, leadId, ipAddress };
}

/**
 * AI Stream Repository Implementation
 */
export class AiStreamRepository {
  /** Headless overload — returns structured result with threadId + lastAiMessageId */
  static createAiStream(params: {
    data: AiStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    headless: true;
    t: AiStreamT;
    extraInstructions?: string;
    excludeMemories?: boolean;
  }): Promise<ResponseType<HeadlessAiStreamResult>>;

  /** Interactive overload — returns response output (events stream via WS) */
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
  }): Promise<ResponseType<AiStreamPostResponseOutput>>;

  static async createAiStream({
    data,
    locale,
    logger,
    user,
    request,
    headless = false,
    t: aiStreamT,
    extraInstructions,
    excludeMemories,
  }: {
    data: AiStreamPostRequestOutput;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    headless?: boolean;
    t: AiStreamT;
    extraInstructions?: string;
    excludeMemories?: boolean;
  }): Promise<
    | ResponseType<AiStreamPostResponseOutput>
    | ResponseType<HeadlessAiStreamResult>
  > {
    const { userId, leadId, ipAddress } = extractUserIdentifiers(
      user,
      request,
      headless,
    );

    const sttT = sttScopedTranslation.scopedT(locale).t;

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      aiStreamT,
      sttT,
      maxDuration,
      request,
      headless,
      extraInstructions,
      excludeMemories,
    });

    if (!setupResult.success) {
      return setupResult;
    }

    const {
      isIncognito,
      effectiveParentMessageId,
      effectiveContent,
      effectiveRole,
      threadId: threadResultThreadId,
      isNewThread,
      messageDepth,
      userMessageId,
      aiMessageId,
      messages,
      systemPrompt,
      trailingSystemMessage,
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
    } = setupResult.data;

    // Captured refs so headless path can read lastAiMessageId + content after runStream completes
    let capturedLastAiMessageId: string = aiMessageId;
    let capturedLastAiMessageContent: string | null = null;

    // Create emitter on the messages channel — events are owned by messages endpoint
    const wsEmit: WsEmitCallback = createMessagesEmitter(
      threadResultThreadId,
      logger,
    );

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
            messageDepth,
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
          });

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
          // Emit user MESSAGE_CREATED — WS subscribers see the user message appear.
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
              messageDepth,
              effectiveContent,
              model: data.model,
              character: data.character,
              user,
              dbWriter: ctx.dbWriter,
              logger,
              voiceTranscription,
              userMessageMetadata,
            });
          }

          if (compactingCheck.shouldCompact) {
            logger.info("[Compacting] Starting compacting operation", {
              isRetry: !!compactingCheck.failedCompactingMessage,
              failedCompactingMessageId:
                compactingCheck.failedCompactingMessage?.id ?? null,
            });

            // Determine parent/depth for the new compacting message.
            // Normal: compacting sits directly below effectiveParentMessageId (messageDepth).
            // Retry: failed compacting already occupies that slot — new compacting is a sibling,
            //        so use the same parentId and depth as the failed one.
            const compactingParentId = compactingCheck.failedCompactingMessage
              ? (compactingCheck.failedCompactingMessage.parentId ?? null)
              : (effectiveParentMessageId ?? null);
            const compactingDepth = compactingCheck.failedCompactingMessage
              ? compactingCheck.failedCompactingMessage.depth
              : messageDepth;

            // Compacting gets its own sequenceId so it appears as a
            // separate, independently-deletable message group in the UI.
            const compactingSequenceId = crypto.randomUUID();
            const compactingMessageCreatedAt = new Date();
            const compactingResult = await CompactingHandler.executeCompacting({
              messagesToCompact: compactingCheck.messagesToCompact,
              branchMessages: compactingCheck.branchMessages,
              currentUserMessage: compactingCheck.currentUserMessage,
              threadId: threadResultThreadId,
              parentId: compactingParentId,
              depth: compactingDepth,
              sequenceId: compactingSequenceId,
              ctx,
              isIncognito,
              userId,
              user,
              model: data.model,
              character: data.character,
              providerModel: provider.chat(modelConfig.providerModel),
              abortSignal: streamAbortController.signal,
              logger,
              timezone: data.timezone,
              rootFolderId: data.rootFolderId,
              compactingMessageCreatedAt,
              t: aiStreamT,
            });

            // Check if compacting failed
            if (!compactingResult.success) {
              logger.error("[AI Stream] Compacting failed, stopping stream", {
                compactingMessageId: compactingResult.compactingMessageId,
              });

              // STOP - don't continue with broken state
              ctx.cleanup();
              return;
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
                character: data.character,
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

            // Update ctx so the AI response has the correct parent/depth.
            // Chain: parent(N) → compacting(N+1=compactingDepth) → user(N+2) → AI(N+3)
            // compactingResult.newDepth = compacting.depth+1 (user depth)
            // AI depth = newDepth+1 (with user msg) or newDepth (AI is direct child of compacting)
            ctx.currentParentId =
              userMessageId ?? compactingResult.compactingMessageId;
            ctx.currentDepth = userMessageId
              ? compactingResult.newDepth + 1
              : compactingResult.newDepth;

            logger.info("[Compacting] Updated messages for main stream", {
              messageCount: messages.length,
              compactingMessageId: compactingResult.compactingMessageId,
              contextParentId: ctx.currentParentId,
              contextDepth: ctx.currentDepth,
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

          logger.info(
            "[AI Stream] Calling StreamExecutionHandler.executeStream",
            {
              messageCount: messages.length,
              hasTools: !!tools,
              modelId: data.model,
            },
          );

          // Execute main AI stream
          await StreamExecutionHandler.executeStream({
            provider,
            modelConfig,
            messages,
            streamAbortController,
            systemPrompt,
            tools,
            toolsConfig,
            activeToolNames,
            ctx,
            threadId: threadResultThreadId,
            model: data.model,
            character: data.character,
            isIncognito,
            userId,
            emittedToolResultIds,
            ttsHandler,
            user,
            locale,
            logger,
            t: aiStreamT,
            streamContext,
          });

          // After stream completes, capture the last assistant message ID from the writer.
          // In a tool loop there can be multiple assistant messages; lastAssistantMessageId
          // on the writer is updated on every write so it always holds the final one.
          if (ctx.dbWriter.lastAssistantMessageId) {
            capturedLastAiMessageId = ctx.dbWriter.lastAssistantMessageId;
            capturedLastAiMessageContent = ctx.dbWriter.lastAssistantContent;
          } else if (headless) {
            // No assistant message was written — stream may have errored before first emit.
            // capturedLastAiMessageId falls back to the pre-generated aiMessageId UUID,
            // which may have no content in DB. Log a warning so callers can detect this.
            logger.warn(
              "[AI Stream] Headless stream completed with no assistant message written — " +
                "lastAiMessageId falls back to pre-generated ID, content may be absent",
              { aiMessageId, threadId: threadResultThreadId },
            );
          }
        } catch (error) {
          // Cancel TTS to avoid wasting API calls + credits after error/disconnect
          if (ttsHandler) {
            ttsHandler.cancel();
          }

          await StreamErrorCatchHandler.handleError({
            error: error as Error | JSONValue,
            ctx,
            maxDuration,
            model: data.model,
            threadId: threadResultThreadId,
            userId,
            logger,
            t: aiStreamT,
          });
        }
      };

      if (headless) {
        // Headless path: must await to capture result
        try {
          await runStream();
        } finally {
          await clearStreamingState(threadResultThreadId);
        }

        logger.info("[AI Stream] Headless execution complete", {
          threadId: threadResultThreadId,
          lastAiMessageId: capturedLastAiMessageId,
        });

        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: capturedLastAiMessageId,
            lastAiMessageContent: capturedLastAiMessageContent,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }

      // Interactive path: fire-and-forget — stream runs independently of HTTP connection.
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

          // Emit STREAM_FINISHED so all WS subscribers know the stream is done
          wsEmit(
            createStreamEvent.streamFinished({
              threadId: threadResultThreadId,
              reason: streamFinishReason,
            }),
          );

          void clearStreamingState(threadResultThreadId).catch((err) => {
            logger.error("[AI Stream] Failed to clear streaming state", {
              error: err instanceof Error ? err.message : String(err),
              threadId: threadResultThreadId,
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
        await clearStreamingState(threadResultThreadId).catch((err) => {
          logger.error(
            "[AI Stream] Failed to clear streaming state in outer catch",
            {
              error: err instanceof Error ? err.message : String(err),
              threadId: threadResultThreadId,
            },
          );
        });
      }

      return fail({
        message: aiStreamT("route.errors.streamCreationFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
