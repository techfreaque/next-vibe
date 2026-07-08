/**
 * AI Stream errors — every stream-error path in one place: the no-dbWriter
 * ErrorRouter, setup/stream-creation error emitters, the mid-stream error
 * catch handler, and the graceful abort handler.
 */

import "server-only";

import type { JSONValue, ModelMessage } from "ai";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";

import type { DefaultFolderId } from "../../chat/config";
import { chatMessages } from "../../chat/db";
import { ChatMessageRole, ThreadStreamingState } from "../../chat/enum";
import { createMessagesEmitter } from "../../chat/threads/[threadId]/messages/emitter";
import { MessagesRepository } from "../../chat/threads/[threadId]/messages/repository";
import { calculateCreditCost } from "../../models/models";
import { type ChatModelId, getChatModelById } from "../models";
import type { AiStreamPostRequestOutput } from "../stream/definition";
import type { AiStreamT, AiStreamTranslationKey } from "../stream/i18n";
import {
  AbortReason,
  isStreamAbort,
  type StreamAbortError,
  StreamErrorType,
} from "./core/constants";
import { buildSseMessageRow } from "./core/db-writer/sse-row";
import type { MessageDbWriter } from "./core/message-db-writer";
import type { StreamContext } from "./core/stream";
import { clearStreamingState } from "./core/stream";
import { estimateTokensFromContext } from "./core/token-estimator";
import { serializeError } from "./error-utils";

/**
 * ErrorRouter — the one no-dbWriter error-emit path.
 *
 * Pre- and post-stream error surfaces (setup failures, outer-catch stream
 * creation failures) have no StreamContext / dbWriter yet, so they persist via
 * MessagesRepository + emit one `message-created` ERROR directly. This collapses
 * that duplicated persist+emit into a single routine with one decision tree:
 *   - never persist for incognito threads (WS-only — client stores it),
 *   - never persist credit errors (transient validation, not thread state),
 *   - skip silently if the thread row doesn't exist yet,
 *   - always WS-emit so every client sees the error.
 *
 * Mid-stream errors (which DO have a dbWriter) go through StreamErrorHandler and
 * are out of scope here.
 */
class ErrorRouter {
  /**
   * Persist (when eligible) and WS-emit a single ERROR message to a thread.
   * Best-effort: a DB or emit failure is logged, never thrown.
   */
  static async route(params: {
    threadId: string;
    parentId: string | null;
    content: string;
    errorType: string;
    rootFolderId: DefaultFolderId;
    user: JwtPayloadType;
    /** True only for authenticated users whose thread row may already exist. */
    persist: boolean;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      threadId,
      parentId,
      content,
      errorType,
      rootFolderId,
      user,
      persist,
      logger,
    } = params;
    const errorMessageId = crypto.randomUUID();
    try {
      if (persist) {
        try {
          await MessagesRepository.createErrorMessage({
            messageId: errorMessageId,
            threadId,
            content,
            errorType,
            parentId,
            user,
            sequenceId: null,
            logger,
          });
        } catch (dbErr) {
          // Thread may not exist in DB yet (new thread, failed before creation).
          // Still emit via WS so the client can display the error.
          logger.debug(
            "[AiStream] Could not persist error message to DB (thread may not exist yet)",
            {
              threadId,
              error: dbErr instanceof Error ? dbErr.message : String(dbErr),
            },
          );
        }
      }
      const emit = createMessagesEmitter(logger, user, {
        threadId,
        rootFolderId,
      });
      emit("message-created", {
        responseData: {
          streamingState: ThreadStreamingState.IDLE,
          messages: [
            buildSseMessageRow({
              id: errorMessageId,
              threadId,
              role: ChatMessageRole.ERROR,
              content,
              parentId,
              authorId: "id" in user ? (user.id ?? null) : null,
              errorType,
            }),
          ],
        },
      });
    } catch (emitErr) {
      logger.warn("[AiStream] Failed to emit error message to thread", {
        threadId,
        parentId,
        error: emitErr instanceof Error ? emitErr.message : String(emitErr),
        cause:
          emitErr instanceof Error && emitErr.cause instanceof Error
            ? emitErr.cause.message
            : undefined,
      });
    }
  }
}
/**
 * Emit a setup-phase failure to the chat thread. Setup failures (insufficient
 * credits, bad model, …) should surface as error bubbles, not silently fail.
 * Persists for non-incognito, non-credit-error authenticated threads; always
 * WS-emits via the ErrorRouter. Best-effort.
 */
export async function emitSetupError(params: {
  setupResult: ErrorResponseType;
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  logger: EndpointLogger;
}): Promise<void> {
  const { setupResult, data, user, logger } = params;
  const threadId = data.threadId;
  if (!(threadId && !user.isPublic && "id" in user)) {
    return;
  }
  const isIncognito = data.rootFolderId === "incognito";
  // Credit errors (FORBIDDEN / PAYMENT_REQUIRED) must never be stored in DB —
  // they are transient validation failures, not persistent thread state.
  const isCreditError =
    setupResult.errorType?.errorCode ===
      ErrorResponseTypes.FORBIDDEN.errorCode ||
    setupResult.errorType?.errorCode ===
      ErrorResponseTypes.PAYMENT_REQUIRED.errorCode;
  await ErrorRouter.route({
    threadId,
    // Chain as child of the previous branch tip. Do NOT use userMessageId — the
    // user message is not persisted yet at setup time (invalid parent FK).
    parentId: data.parentMessageId || null,
    content: serializeError(setupResult),
    errorType: setupResult.errorType
      ? `${setupResult.errorType.errorCode}`
      : "SETUP_ERROR",
    rootFolderId: data.rootFolderId,
    user,
    persist: !isIncognito && !isCreditError,
    logger,
  });
}

/**
 * Emit an outer-catch stream-creation failure to the thread so the user always
 * sees what went wrong. Chains as child of the last written message so it never
 * creates a sibling branch. Persists for non-incognito authenticated threads;
 * always WS-emits. Best-effort.
 */
export async function emitStreamCreationError(params: {
  errorThreadId: string | undefined;
  errorParentId: string | null;
  data: AiStreamPostRequestOutput;
  user: JwtPayloadType;
  userId: string | undefined;
  isIncognito: boolean;
  aiStreamT: AiStreamT;
  logger: EndpointLogger;
}): Promise<void> {
  const {
    errorThreadId,
    errorParentId,
    data,
    user,
    userId,
    isIncognito,
    aiStreamT,
    logger,
  } = params;
  if (!errorThreadId) {
    return;
  }
  await ErrorRouter.route({
    threadId: errorThreadId,
    parentId: errorParentId,
    content: aiStreamT("route.errors.streamCreationFailed"),
    errorType: StreamErrorType.STREAM_ERROR,
    rootFolderId: data.rootFolderId,
    user,
    persist: !isIncognito && Boolean(userId),
    logger,
  });
}
/**
 * StreamErrorCatchHandler - Handles errors during stream execution
 */

export class StreamErrorCatchHandler {
  /**
   * Handle errors caught during stream execution
   */
  static async handleError(params: {
    error: Error | JSONValue;
    ctx: StreamContext;
    maxDuration: number;
    model: ChatModelId;
    threadId: string;
    user: JwtPayloadType;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const { error, ctx, maxDuration, model, threadId, user, logger, t } =
      params;

    // Note: Abort errors are handled inline in loop.ts.
    // This handler only receives non-abort errors.

    try {
      if (
        error instanceof Error &&
        isStreamAbort(error) &&
        error.reason === AbortReason.STREAM_TIMEOUT
      ) {
        await TimeoutErrorHandler.handleTimeout({
          maxDuration,
          model,
          threadId,
          user,
          lastParentId: ctx.lastParentId,
          lastSequenceId: ctx.lastSequenceId,
          dbWriter: ctx.dbWriter,
          logger,
          t,
        });
      } else {
        await StreamErrorHandler.handleStreamError({
          error: error instanceof Error ? error : (error as JSONValue),
          threadId,
          user,
          lastParentId: ctx.lastParentId,
          lastSequenceId: ctx.lastSequenceId,
          dbWriter: ctx.dbWriter,
          logger,
          t,
        });
      }
    } catch (emitErr) {
      // Error message emission failed (e.g. DB write error).
      // SSE was already enqueued before the DB write, so the client likely
      // saw the error. Log and continue so cleanup always runs.
      logger.error(
        "[AI Stream] Failed to emit error message during error handling",
        {
          error: emitErr instanceof Error ? emitErr.message : String(emitErr),
          threadId,
        },
      );
    } finally {
      await clearStreamingState(threadId, logger, user, ctx.streamRunId);
      ctx.cleanup();
    }
  }
}
/**
 * AbortErrorHandler - Handles graceful stream abort errors
 */

export class AbortErrorHandler {
  /**
   * Handle graceful abort errors (client disconnect, tool confirmation)
   */
  static async handleAbortError(params: {
    error: Error;
    ctx: StreamContext;
    logger: EndpointLogger;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    model: ChatModelId;
    systemPrompt?: string;
    trailingSystemMessage?: string;
    messages?: ModelMessage[];
    tools?: Record<string, CoreTool>;
    toolsConfig?: Map<
      string,
      { requiresConfirmation: boolean; credits: number; label: string }
    >;
    user: JwtPayloadType;
    t: AiStreamT;
  }): Promise<{ wasHandled: boolean }> {
    const {
      error,
      ctx,
      logger,
      threadId,
      isIncognito,
      userId,
      model,
      systemPrompt,
      trailingSystemMessage,
      messages,
      tools,
      toolsConfig,
      user,
      t,
    } = params;

    // Check if this is a graceful abort (our StreamAbortError or generic AbortError from the runtime)
    const streamAbort: StreamAbortError | null = isStreamAbort(error)
      ? error
      : null;
    if (!streamAbort && error.name !== "AbortError") {
      return { wasHandled: false };
    }

    // Idempotency: if already handled, skip
    if (ctx.abortHandled) {
      logger.debug("[AI Stream] AbortErrorHandler already ran, skipping", {
        reason: streamAbort?.reason ?? error.name,
      });
      return { wasHandled: true };
    }

    const isToolConfirmation = streamAbort?.isToolPause ?? false;
    const isLoopStop = streamAbort?.isLoopStop ?? false;
    // isSilentStop: intentional stops that must not write anything to DB.
    // SUPERSEDED: a new stream replaced this one - the new stream owns the thread state.
    const isSilentStop = streamAbort?.reason === AbortReason.SUPERSEDED;
    // isNoErrorStop: save partial content but do NOT emit an error message bubble.
    // CLIENT_DISCONNECTED: user closed the tab - partial content is preserved but no
    // "Generation was stopped" bubble should appear (nobody is there to read it, and
    // it would create an orphan branch if a confirm/wakeUp stream already updated the thread).
    // USER_CANCELLED: user hit stop - partial content and error message ARE emitted so
    // the thread shows the interruption and the AI can acknowledge it on the next turn.
    const isNoErrorStop =
      streamAbort?.reason === AbortReason.CLIENT_DISCONNECTED;

    logger.debug("[AI Stream] Stream aborted", {
      reason: streamAbort?.reason ?? error.name,
      isToolConfirmation,
      isLoopStop,
      isSilentStop,
      isNoErrorStop,
      hasPartialContent: !!ctx.currentAssistantContent,
      contentLength: ctx.currentAssistantContent.length,
    });

    // Save partial content and pending tools to database.
    // Suppressed for: tool-confirmation, loop-stop, user-cancelled, superseded.
    // Tool confirmation and loop stop close the controller early in finish-step-handler
    // so SSE emission would panic. User-cancelled and superseded are intentional stops
    // that must not leave error messages in the thread.
    if (!isToolConfirmation && !isLoopStop && !isSilentStop) {
      try {
        let totalCredits = 0;

        if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
          if (!isIncognito) {
            logger.debug("[AI Stream] Saving partial content to database", {
              messageId: ctx.currentAssistantMessageId,
              contentLength: ctx.currentAssistantContent.length,
            });

            const fullSystemPrompt =
              [systemPrompt, trailingSystemMessage]
                .filter(Boolean)
                .join("\n\n") || undefined;

            const tokenEstimate = estimateTokensFromContext({
              systemPrompt: fullSystemPrompt,
              messages,
              tools,
              aiResponse: ctx.currentAssistantContent,
            });

            const modelInfo = getChatModelById(model);
            let modelCreditCost = 0;
            if (modelInfo) {
              modelCreditCost = calculateCreditCost(
                modelInfo,
                tokenEstimate.promptTokens,
                tokenEstimate.completionTokens,
              );
            }

            totalCredits += modelCreditCost;

            logger.debug("[AI Stream] Estimated usage for aborted stream", {
              messageId: ctx.currentAssistantMessageId,
              promptTokens: tokenEstimate.promptTokens,
              completionTokens: tokenEstimate.completionTokens,
              totalTokens: tokenEstimate.totalTokens,
              modelCreditCost,
            });

            // Flush + write final partial content to DB, emit CONTENT_DONE SSE
            await ctx.dbWriter.emitContentDone({
              messageId: ctx.currentAssistantMessageId,
              content: ctx.currentAssistantContent,
              finishReason: "stop",
              totalTokens: tokenEstimate.totalTokens,
              promptTokens: tokenEstimate.promptTokens,
              completionTokens: tokenEstimate.completionTokens,
            });

            logger.debug("[AI Stream] Saved partial content to database", {
              messageId: ctx.currentAssistantMessageId,
              totalTokens: tokenEstimate.totalTokens,
            });

            // Emit TOKENS_UPDATED for credit accounting
            ctx.dbWriter.emitTokensUpdated({
              messageId: ctx.currentAssistantMessageId,
              promptTokens: tokenEstimate.promptTokens,
              completionTokens: tokenEstimate.completionTokens,
              totalTokens: tokenEstimate.totalTokens,
              cachedInputTokens: 0,
              cacheWriteTokens: 0,
              timeToFirstToken: null,
              streamingTime: null,
              finishReason: "stop",
              creditCost: modelCreditCost,
            });

            // Deduct model credits and emit CREDITS_DEDUCTED
            if (userId && modelCreditCost > 0) {
              await ctx.dbWriter.deductAndEmitCredits({
                user,
                amount: modelCreditCost,
                feature: `model:${model}`,
                type: "model",
                model,
              });

              logger.debug("[AI Stream] Deducted and emitted model credits", {
                amount: modelCreditCost,
                model,
              });
            }
          } else {
            // Incognito: emit CONTENT_DONE SSE only (no DB write) so frontend cache is updated
            ctx.dbWriter.emitContentDoneRaw({
              messageId: ctx.currentAssistantMessageId,
              content: ctx.currentAssistantContent,
              totalTokens: null,
              finishReason: "stop",
            });
          }
        } else {
          // Stream aborted before any content was generated - emit an empty CONTENT_DONE
          // using the pre-generated assistant message ID so the frontend can close the slot.
          ctx.dbWriter.emitContentDoneRaw({
            messageId: ctx.preGeneratedAssistantMessageId,
            content: "",
            totalTokens: null,
            finishReason: "stop",
          });
        }

        if (!isIncognito) {
          // Save pending tool messages to database
          if (ctx.pendingToolMessages.size > 0) {
            logger.debug(
              "[AI Stream] Saving pending tool messages to database",
              {
                count: ctx.pendingToolMessages.size,
              },
            );

            for (const [, pendingTool] of ctx.pendingToolMessages) {
              const { messageId, toolCallData } = pendingTool;
              const { toolCall, parentId } = toolCallData;

              await db.insert(chatMessages).values({
                id: messageId,
                threadId: threadId,
                role: ChatMessageRole.TOOL,
                content: null,
                parentId: parentId,
                sequenceId: ctx.sequenceId,
                authorId: userId ?? null,
                isAI: true,
                model: model,
                skill: null,
                metadata: { toolCall: toolCall },
              });

              if (toolCall.creditsUsed && toolCall.creditsUsed > 0) {
                totalCredits += toolCall.creditsUsed;

                await ctx.dbWriter.deductAndEmitCredits({
                  user,
                  amount: toolCall.creditsUsed,
                  feature:
                    toolsConfig?.get(toolCall.toolName)?.label ??
                    toolCall.toolName,
                  type: "tool",
                  model,
                });

                logger.debug("[AI Stream] Deducted and emitted tool credits", {
                  toolName: toolCall.toolName,
                  amount: toolCall.creditsUsed,
                });
              }

              logger.debug("[AI Stream] Saved pending tool message", {
                messageId,
                toolName: toolCall.toolName,
              });
            }
          }

          if (userId && totalCredits > 0) {
            logger.debug("[AI Stream] Total credits for aborted stream", {
              totalCredits,
            });
          }
        }

        // Write interruption error message to DB (non-incognito) + emit SSE (always).
        // Skipped for CLIENT_DISCONNECTED - nobody is there to see it, and it would
        // create orphan branches if a confirm/wakeUp stream already updated the thread.
        if (!isNoErrorStop) {
          // USER_CANCELLED: STREAM_INTERRUPTED so the UI renders a distinct
          // "stopped" indicator instead of a generic error bubble with report UI.
          // All other abort reasons that reach this point use STREAM_ERROR.
          const emitErrorType =
            streamAbort?.reason === AbortReason.USER_CANCELLED
              ? StreamErrorType.STREAM_INTERRUPTED
              : StreamErrorType.STREAM_ERROR;
          await ctx.dbWriter.emitErrorMessage({
            threadId,
            errorType: emitErrorType,
            error: fail({
              message: t("info.streamInterrupted"),
              errorType: ErrorResponseTypes.VALIDATION_ERROR,
            }),
            content: t("info.streamInterrupted"),
            parentId: ctx.lastParentId,
            sequenceId: ctx.sequenceId,
            user,
          });

          logger.debug("[AI Stream] Emitted interruption error message", {
            isIncognito,
            hasPartialContent: !!ctx.currentAssistantMessageId,
            pendingToolsCount: ctx.pendingToolMessages.size,
            reason: streamAbort?.reason ?? error.name,
          });
        }
      } catch (saveError) {
        logger.error("[AI Stream] Failed to save partial content/tools", {
          error:
            saveError instanceof Error ? saveError.message : String(saveError),
          messageId: ctx.currentAssistantMessageId,
        });
      }
    }

    // Clear streaming state in DB + registry.
    // REMOTE_TOOL_WAIT / STREAM_TIMEOUT: stream died with a task in flight —
    // but the result may have ALREADY arrived (fast remote executor: the
    // /report can land and even complete the revival before this abort runs).
    // Never pin 'waiting' blindly: clearStreamingState re-checks actual
    // pending work (cron rows + pending-calls registry with cross-process
    // reconciliation) and decides waiting vs idle. A blind set here would
    // leave the thread stuck in 'waiting' forever.
    await clearStreamingState(threadId, logger, user, ctx.streamRunId);

    ctx.cleanup();

    return { wasHandled: true };
  }
}

// ============================================================================
// STREAM ERROR HANDLER (merged from handlers/stream-error-handler.ts)
// ============================================================================

export class StreamErrorHandler {
  /**
   * Handle stream error and emit error events
   */
  static async handleStreamError(params: {
    error: Error | JSONValue;
    threadId: string;
    user: JwtPayloadType;
    lastParentId: string | null;
    lastSequenceId: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const {
      error,
      threadId,
      user,
      lastParentId,
      lastSequenceId,
      dbWriter,
      logger,
      t,
    } = params;

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName =
      error instanceof Error ? error.constructor.name : typeof error;

    logger.error("Stream error", {
      error: errorMessage,
      errorType: errorName,
      threadId,
      userId: user.isPublic ? null : user.id,
      leadId: user.leadId,
      stack: errorStack,
    });

    let translationKey: AiStreamTranslationKey;
    let errorType = ErrorResponseTypes.UNKNOWN_ERROR;
    let skipDb = false;

    if (
      errorName === "AI_MissingToolResultsError" ||
      errorMessage.toLowerCase().includes("missing tool results")
    ) {
      translationKey = "errors.pendingToolCall";
      errorType = ErrorResponseTypes.BAD_REQUEST;
    } else if (errorMessage.toLowerCase().includes("rate limit")) {
      translationKey = "errors.rateLimitExceeded";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("insufficient") &&
      errorMessage.toLowerCase().includes("credit")
    ) {
      translationKey = "errors.insufficientCredits";
      errorType = ErrorResponseTypes.PAYMENT_REQUIRED;
      skipDb = true;
    } else if (
      errorMessage.toLowerCase().includes("no output") ||
      errorMessage.toLowerCase().includes("no response") ||
      errorName === "AI_NoOutputGeneratedError"
    ) {
      translationKey = "errors.noResponse";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("model") &&
      (errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("unavailable"))
    ) {
      translationKey = "errors.modelUnavailable";
      errorType = ErrorResponseTypes.NOT_FOUND;
    } else if (
      errorMessage.toLowerCase().includes("connection") ||
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch failed") ||
      errorMessage.toLowerCase().includes("econnrefused")
    ) {
      translationKey = "errors.connectionFailed";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("invalid") ||
      errorMessage.toLowerCase().includes("malformed") ||
      errorMessage.toLowerCase().includes("bad request")
    ) {
      translationKey = "errors.invalidRequest";
      errorType = ErrorResponseTypes.BAD_REQUEST;
    } else {
      translationKey = "errors.streamError";
      errorType = ErrorResponseTypes.UNKNOWN_ERROR;
    }

    const structuredError = fail({
      message: t(translationKey),
      errorType,
    });

    // Emit MESSAGE_CREATED SSE + save to DB + emit ERROR SSE
    await dbWriter.emitErrorMessage({
      threadId,
      errorType: StreamErrorType.STREAM_ERROR,
      error: structuredError,
      parentId: lastParentId,
      sequenceId: lastSequenceId,
      user,
      skipDb,
    });
  }
}

// ============================================================================
// TIMEOUT ERROR HANDLER (merged from handlers/timeout-error-handler.ts)
// ============================================================================

export class TimeoutErrorHandler {
  /**
   * Handle stream timeout error
   */
  static async handleTimeout(params: {
    maxDuration: number;
    model: string;
    threadId: string;
    user: JwtPayloadType;
    lastParentId: string | null;
    lastSequenceId: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const {
      maxDuration,
      model,
      threadId,
      user,
      lastParentId,
      lastSequenceId,
      dbWriter,
      logger,
      t,
    } = params;

    logger.error("[AI Stream] Stream timed out", {
      message: "Stream timeout",
      maxDuration: `${maxDuration} seconds`,
      model,
      threadId,
      userId: user.isPublic ? null : user.id,
      hasContent: !!lastSequenceId,
    });

    const timeoutError = fail({
      message: t("errors.timeout", { maxDuration: maxDuration.toString() }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });

    // Emit MESSAGE_CREATED SSE + save to DB + emit ERROR SSE
    await dbWriter.emitErrorMessage({
      threadId,
      errorType: StreamErrorType.TIMEOUT_ERROR,
      error: timeoutError,
      parentId: lastParentId,
      sequenceId: lastSequenceId,
      user,
    });
  }
}
