/**
 * StreamCompletionHandler - Handles final stream completion logic
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
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
    logger: EndpointLogger;
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
      const timeToFirstToken =
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
        finishReason: finishReason ?? null,
        creditCost: modelCost,
      });
    } else {
      logger.warn(
        "Cannot emit TOKENS_UPDATED: no assistant message ID available",
      );
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
    await clearStreamingState(threadId, logger);

    // Cleanup stream context
    ctx.cleanup();
  }
}
