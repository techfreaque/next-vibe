/**
 * AI Stream Repository
 * Handles AI streaming chat functionality with thread/message creation
 */

import "server-only";

import type { JSONValue } from "ai";
import type { NextRequest } from "next/server";
import {
  createStreamingResponse,
  ErrorResponseTypes,
  fail,
  type ResponseType,
  type StreamingResponse,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";
import type { TFunction } from "@/i18n/core/static-types";

import type {
  AiStreamPostRequestOutput,
  AiStreamPostResponseOutput,
} from "../definition";
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
export const maxDuration = 300; // 5 minutes for multi-step tool calling

export interface HeadlessAiStreamResult {
  /** Thread ID where the conversation was stored */
  threadId: string;
  /** ID of the last assistant message — caller reads content from DB */
  lastAiMessageId: string;
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
  /**
   * Create AI streaming response with SSE events, or run headless (no SSE).
   *
   * When `headless: true`:
   * - All SSE events are suppressed (DB writes still happen normally)
   * - Returns ResponseType<HeadlessAiStreamResult> with threadId + lastAiMessageId
   * - Caller is responsible for reading the message content from DB
   *
   * When `headless: false` (default):
   * - Returns StreamingResponse for SSE stream
   */
  static async createAiStream({
    data,
    t,
    locale,
    logger,
    user,
    request,
    headless = false,
    extraInstructions,
  }: {
    data: AiStreamPostRequestOutput;
    t: TFunction;
    locale: CountryLanguage;
    logger: EndpointLogger;
    user: JwtPayloadType;
    request: NextRequest | undefined;
    /** Run without SSE events — DB writes still happen, returns lastAiMessageId */
    headless?: boolean;
    /** Extra instructions injected into the system prompt (headless: task context, cron schedule, etc.) */
    extraInstructions?: string;
  }): Promise<
    | ResponseType<AiStreamPostResponseOutput>
    | StreamingResponse
    | ResponseType<HeadlessAiStreamResult>
  > {
    const { userId, leadId, ipAddress } = extractUserIdentifiers(
      user,
      request,
      headless,
    );

    const setupResult = await setupAiStream({
      data,
      locale,
      logger,
      user,
      userId,
      leadId,
      ipAddress,
      t,
      maxDuration,
      request,
      headless,
      extraInstructions,
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
      encoder,
      streamAbortController,
    } = setupResult.data;

    // Captured ref so headless path can read lastAiMessageId after runStream completes
    let capturedLastAiMessageId: string = aiMessageId;

    // Step 9: Start AI streaming (for all operations including answer-as-ai)
    try {
      // Shared inner function — runs compacting check + executeStream.
      // Used by both SSE and headless paths so there is zero code duplication.
      const runStream = async (
        controller: ReadableStreamDefaultController<Uint8Array>,
      ): Promise<void> => {
        // Initialize stream context, TTS handler, and emit tool confirmations.
        // User MESSAGE_CREATED is emitted below, after the compacting check.
        const { ctx, ttsHandler, emittedToolResultIds } =
          StreamStartHandler.initializeStream({
            userMessageId,
            aiMessageId,
            effectiveParentMessageId,
            messageDepth,
            isHeadless: headless,
            toolConfirmationResults,
            voiceMode,
            fileUploadPromise,
            isNewThread,
            isIncognito,
            threadId: threadResultThreadId,
            messages,
            controller,
            encoder,
            locale,
            user,
            logger,
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
            });

          logger.info("[Compacting] Check result", {
            shouldCompact: compactingCheck.shouldCompact,
            totalTokens: compactingCheck.totalTokens,
            messagesToCompactCount: compactingCheck.messagesToCompact.length,
            lastCompactingMessage: compactingCheck.lastCompactingMessage?.id,
          });

          // Emit USER MESSAGE_CREATED AFTER the compacting check so ordering is always correct:
          // - Non-compacting: user message emitted here with original parentId
          // - Compacting: CompactingHandler emits it with parentId = compactingMessageId
          // This is the only place user message emission happens for non-tool-confirmation streams.
          // Skipped in headless — no SSE client to receive it (dbWriter.enqueue is a noop anyway).
          if (
            !headless &&
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
              providerModel: provider.chat(modelConfig.openRouterModel),
              abortSignal: streamAbortController.signal,
              logger,
              timezone: data.timezone,
              rootFolderId: data.rootFolderId,
              compactingMessageCreatedAt,
            });

            // Check if compacting failed
            if (!compactingResult.success) {
              logger.error("[AI Stream] Compacting failed, stopping stream", {
                compactingMessageId: compactingResult.compactingMessageId,
              });

              // STOP - don't continue with broken state
              ctx.cleanup();
              ctx.dbWriter.closeController();
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
                  message:
                    "app.api.agent.chat.aiStream.errors.compactingRebuildFailed" as const,
                  errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
                }),
              );

              // STOP - don't continue with broken state
              ctx.cleanup();
              ctx.dbWriter.closeController();
              return;
            }

            // Update messages array and context for main stream
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
          });

          // After stream completes, capture the last assistant message ID from the writer.
          // In a tool loop there can be multiple assistant messages; lastAssistantMessageId
          // on the writer is updated on every write so it always holds the final one.
          if (ctx.dbWriter.lastAssistantMessageId) {
            capturedLastAiMessageId = ctx.dbWriter.lastAssistantMessageId;
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
          await StreamErrorCatchHandler.handleError({
            error: error as Error | JSONValue,
            ctx,
            maxDuration,
            model: data.model,
            threadId: threadResultThreadId,
            userId,
            logger,
          });
        }
      };

      // ── Headless path — run synchronously, return lastAiMessageId ──────────
      if (headless) {
        // The writer has isHeadless=true so controller.enqueue is never called.
        // We still need to satisfy the ReadableStreamDefaultController type —
        // capture a real controller from a throwaway stream (never consumed).
        const noopController = await new Promise<
          ReadableStreamDefaultController<Uint8Array>
        >((resolve) => {
          // eslint-disable-next-line no-new
          new ReadableStream<Uint8Array>({
            start: (ctrl): void => {
              resolve(ctrl);
            },
          });
        });

        await runStream(noopController);

        logger.info("[AI Stream] Headless execution complete", {
          threadId: threadResultThreadId,
          lastAiMessageId: capturedLastAiMessageId,
        });

        return {
          success: true,
          data: {
            threadId: threadResultThreadId,
            lastAiMessageId: capturedLastAiMessageId,
          },
        } satisfies ResponseType<HeadlessAiStreamResult>;
      }

      // ── SSE path — wrap in ReadableStream, return streaming response ────────
      const stream = new ReadableStream({
        async start(controller): Promise<void> {
          await runStream(controller);
        },

        // Client disconnect is intentionally ignored — the stream continues
        // writing to DB so messages are fully persisted even if the user
        // navigates away. The client can re-fetch from DB on return.
        cancel(): void {
          logger.info(
            "[AI Stream] Client disconnected — stream continues server-side",
          );
        },
      });

      return createStreamingResponse(
        new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to create AI stream", {
        error: errorMessage,
        model: data.model,
      });

      return fail({
        message:
          "app.api.agent.chat.aiStream.route.errors.streamCreationFailed",
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });
    }
  }
}
