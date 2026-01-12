/**
 * StreamCompletionHandler - Handles final stream completion logic
 */

import "server-only";

import type { streamText } from "ai";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ModelId } from "../../../models/models";
import type { StreamContext } from "../core/stream-context";
import type { StreamingTTSHandler } from "../streaming-tts";
import { FinalizationHandler } from "./finalization-handler";

export class StreamCompletionHandler {
  /**
   * Handle stream completion - finalize message, flush TTS, deduct credits, cleanup
   */
  static async handleCompletion(params: {
    ctx: StreamContext;
    streamResult: {
      usage: ReturnType<typeof streamText>["usage"];
      finishReason: ReturnType<typeof streamText>["finishReason"];
    };
    ttsHandler: StreamingTTSHandler | null;
    user: JwtPayloadType;
    modelCost: number;
    model: ModelId;
    isIncognito: boolean;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      ctx,
      streamResult,
      ttsHandler,
      user,
      modelCost,
      model,
      isIncognito,
      controller,
      encoder,
      logger,
    } = params;

    // Wait for completion to get final usage stats
    const usage = await streamResult.usage;
    const finishReason = await streamResult.finishReason;

    logger.info("[AI Stream] Before finalization check", {
      hasCurrentAssistantMessageId: !!ctx.currentAssistantMessageId,
      currentAssistantMessageId: ctx.currentAssistantMessageId,
      hasCurrentAssistantContent: !!ctx.currentAssistantContent,
      currentAssistantContentLength: ctx.currentAssistantContent.length,
      currentAssistantContentPreview: ctx.currentAssistantContent.slice(0, 100),
    });

    // Finalize current ASSISTANT message if exists
    if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
      logger.info("[AI Stream] Calling finalizeAssistantMessage", {
        messageId: ctx.currentAssistantMessageId,
        contentLength: ctx.currentAssistantContent.length,
      });
      await FinalizationHandler.finalizeAssistantMessage({
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        isInReasoningBlock: ctx.isInReasoningBlock,
        streamResult: {
          finishReason,
          usage,
        },
        isIncognito,
        controller,
        encoder,
        logger,
      });
    } else {
      logger.warn("[AI Stream] Skipping finalization", {
        hasCurrentAssistantMessageId: !!ctx.currentAssistantMessageId,
        hasCurrentAssistantContent: !!ctx.currentAssistantContent,
      });
    }

    // Flush TTS handler to emit any remaining audio
    if (ttsHandler) {
      await ttsHandler.flush();
      logger.debug("[AI Stream] TTS handler flushed");
    }

    logger.debug("[AI Stream] Stream completed", {
      totalTokens: usage.totalTokens,
    });

    // Deduct credits AFTER successful completion (not optimistically)
    await CreditRepository.deductCreditsForFeature(
      user,
      modelCost,
      model,
      logger,
    );

    // Cleanup stream context
    ctx.cleanup();

    controller.close();
  }
}
