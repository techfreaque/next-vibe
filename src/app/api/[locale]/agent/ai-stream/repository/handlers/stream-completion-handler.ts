/**
 * StreamCompletionHandler - Handles final stream completion logic
 */

import "server-only";

import type { streamText } from "ai";

import { CreditRepository } from "@/app/api/[locale]/credits/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ModelId } from "../../../models/models";
import { createStreamEvent, formatSSEEvent } from "../../events";
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
    // Use deductCreditsForModelUsage which allows partial deduction (deduct to 0)
    const deductResult = await CreditRepository.deductCreditsForModelUsage(
      user,
      modelCost,
      model,
      logger,
    );

    if (deductResult.success) {
      // Emit credit deduction event for frontend optimistic update
      const creditEvent = createStreamEvent.creditsDeducted({
        amount: modelCost,
        feature: model,
        type: "model",
        partial: deductResult.partialDeduction,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(creditEvent)));

      if (deductResult.partialDeduction) {
        logger.debug(
          "[AI Stream] Model usage: Partial credit deduction (insufficient funds, deducted to 0)",
          {
            model,
            requestedCost: modelCost,
          },
        );
      }
    }

    // Cleanup stream context
    ctx.cleanup();

    controller.close();
  }
}
