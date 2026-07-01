/**
 * StreamCompletionHandler - Handles final stream completion logic
 */

import "server-only";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";

import { StreamErrorType } from "../core/constants";
import type { StreamContext } from "../core/stream-context";
import { clearStreamingState } from "../core/stream-registry";
import type { StreamingTTSHandler } from "../streaming-tts";
import { FinalizationHandler } from "./finalization-handler";

export class StreamCompletionHandler {
  /**
   * Handle stream completion - finalize message, flush TTS, deduct credits, cleanup.
   *
   * SSE event ordering (matches what frontend expects):
   *   CONTENT_DONE → TOKENS_UPDATED → CREDITS_DEDUCTED
   *
   * DB write ordering:
   *   content flush → token metadata → credit deduction
   */
  static async handleCompletion(params: {
    ctx: StreamContext;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      cachedInputTokens: number;
      cacheWriteTokens: number;
    };
    finishReason: string | null;
    ttsHandler: StreamingTTSHandler | null;
    user: JwtPayloadType;
    modelCost: number;
    model: ChatModelId;
    threadId: string;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const {
      ctx,
      usage,
      finishReason,
      ttsHandler,
      user,
      modelCost,
      model,
      threadId,
      logger,
      t,
    } = params;

    // Finalize current ASSISTANT message if exists.
    // Emits CONTENT_DONE and does the final DB flush.
    if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
      logger.debug("[AI Stream] Calling finalizeAssistantMessage", {
        messageId: ctx.currentAssistantMessageId,
        contentLength: ctx.currentAssistantContent.length,
      });
      await FinalizationHandler.finalizeAssistantMessage({
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        isInReasoningBlock: ctx.isInReasoningBlock,
        finishReason: finishReason ?? null,
        totalTokens: usage.totalTokens ?? null,
        promptTokens: usage.inputTokens ?? null,
        completionTokens: usage.outputTokens ?? null,
        dbWriter: ctx.dbWriter,
        logger,
      });
    } else {
      logger.debug("[AI Stream] Skipping finalization", {
        hasCurrentAssistantMessageId: !!ctx.currentAssistantMessageId,
        hasCurrentAssistantContent: !!ctx.currentAssistantContent,
      });
    }

    // Flush TTS handler to emit any remaining audio
    if (ttsHandler) {
      await ttsHandler.flush();
      logger.debug("[AI Stream] TTS handler flushed");
    }

    // Emit TOKENS_UPDATED after CONTENT_DONE so frontend processes message finalization first
    const messageIdForTokens =
      ctx.lastAssistantMessageId || ctx.currentAssistantMessageId;

    if (messageIdForTokens) {
      // True TTFT: time from request sent to first token received
      const timeToFirstToken =
        ctx.requestStartTime !== null && ctx.streamStartTime !== null
          ? ctx.streamStartTime - ctx.requestStartTime
          : null;
      // Total streaming duration: time from first token to stream end
      const streamingTime =
        ctx.streamStartTime !== null ? Date.now() - ctx.streamStartTime : null;

      // Write token metadata to DB. This is a no-op if finalizeAssistantMessage already wrote
      // it via writeContentAndTokens, but is essential when finalization was skipped (the common
      // case for multi-step streams where content was flushed via throttled writes).
      await ctx.dbWriter.writeTokenMetadataOnly(messageIdForTokens, {
        promptTokens: usage.inputTokens,
        completionTokens: usage.outputTokens,
        finishReason: finishReason ?? null,
        cachedInputTokens: usage.cachedInputTokens,
        cacheWriteTokens: usage.cacheWriteTokens,
        timeToFirstToken,
        streamingTime,
        creditCost: modelCost,
      });

      ctx.dbWriter.emitTokensUpdated({
        messageId: messageIdForTokens,
        promptTokens: usage.inputTokens,
        completionTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        cachedInputTokens: usage.cachedInputTokens,
        cacheWriteTokens: usage.cacheWriteTokens,
        timeToFirstToken,
        streamingTime,
        finishReason: finishReason ?? null,
        creditCost: modelCost,
      });
    } else {
      // Provider returned an empty stream - no text was generated.
      // Emit CONTENT_DONE on the pre-generated ID so the frontend closes the pending slot,
      // then show an error bubble so the user knows something went wrong.
      logger.error(
        "[AI Stream] Provider returned empty stream - no assistant message created",
        {
          threadId,
          model,
          totalTokens: usage.totalTokens,
          finishReason: finishReason ?? null,
        },
      );
      ctx.dbWriter.emitContentDoneRaw({
        messageId: ctx.preGeneratedAssistantMessageId,
        content: "",
        totalTokens: null,
        finishReason: finishReason ?? null,
      });
      await ctx.dbWriter.emitErrorMessage({
        threadId,
        errorType: StreamErrorType.STREAM_ERROR,
        error: fail({
          message: t("errors.noResponse"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
        }),
        content: t("errors.noResponse"),
        parentId: ctx.lastParentId,
        sequenceId: ctx.lastSequenceId,
        user,
      });
    }

    logger.debug("[AI Stream] Stream completed", {
      totalTokens: usage.totalTokens,
    });

    // Deduct credits AFTER successful completion (not optimistically).
    // DB write happens before the SSE event so the client never sees
    // a CREDITS_DEDUCTED event for something that wasn't actually deducted.
    await ctx.dbWriter.deductAndEmitCredits({
      user,
      amount: modelCost,
      feature: model,
      type: "model",
      model,
    });

    // Clear streaming state in DB + registry
    await clearStreamingState(threadId, logger, user);

    // Fire-and-forget: sync thread embedding once at stream end with full conversation
    void ctx.dbWriter.syncThreadEmbedding().catch(() => {
      // Intentional no-op: embedding sync is best-effort
    });

    // Cleanup stream context
    ctx.cleanup();
  }
}
