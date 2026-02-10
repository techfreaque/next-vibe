/**
 * FinalizationHandler - Finalizes ASSISTANT messages at stream end
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { streamText } from "ai";
import { eq } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { db } from "../../../../system/db";
import { chatMessages } from "../../../chat/db";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class FinalizationHandler {
  /**
   * Finalize ASSISTANT message at stream end
   */
  static async finalizeAssistantMessage(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    streamResult: {
      finishReason:
        | Awaited<ReturnType<typeof streamText>["finishReason"]>
        | ReturnType<typeof streamText>["finishReason"];
      usage:
        | Awaited<ReturnType<typeof streamText>["usage"]>
        | ReturnType<typeof streamText>["usage"];
    };
    isIncognito: boolean;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      currentAssistantMessageId,
      isInReasoningBlock,
      streamResult,
      isIncognito,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantContent } = params;

    // If reasoning block is still open, close it at stream end
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      currentAssistantContent += thinkCloseTag;

      // Emit closing tag delta
      const thinkCloseDelta = createStreamEvent.contentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));
    }

    // Emit CONTENT_DONE event immediately without waiting for usage/finishReason
    // These will be null during mid-stream finalization (between steps)
    const contentDoneEvent = createStreamEvent.contentDone({
      messageId: currentAssistantMessageId,
      content: currentAssistantContent,
      totalTokens: null, // Will be updated at stream completion
      finishReason: null, // Will be known at stream completion
    });
    controller.enqueue(encoder.encode(formatSSEEvent(contentDoneEvent)));

    // Update ASSISTANT message in database with current content (no tokens yet)
    if (!isIncognito && currentAssistantContent) {
      await db
        .update(chatMessages)
        .set({
          content: currentAssistantContent.trim() || null,
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, currentAssistantMessageId));

      logger.debug("Updated ASSISTANT message in database", {
        messageId: currentAssistantMessageId,
        contentLength: currentAssistantContent.length,
      });
    }

    // Try to get usage/finishReason for logging, but don't block if not available
    void Promise.all([streamResult.finishReason, streamResult.usage])
      .then(([finishReason, usage]) => {
        logger.info("Finalized ASSISTANT message", {
          messageId: currentAssistantMessageId,
          contentLength: currentAssistantContent.length,
          tokens: usage.totalTokens,
          finishReason: finishReason || "unknown",
        });

        // Update with final token count if we have it
        if (!isIncognito && usage.totalTokens) {
          void db
            .update(chatMessages)
            .set({ tokens: usage.totalTokens })
            .where(eq(chatMessages.id, currentAssistantMessageId));
        }
        return undefined;
      })
      .catch(() => {
        // Promises may not resolve during mid-stream, that's OK
        logger.info("Finalized ASSISTANT message (usage pending)", {
          messageId: currentAssistantMessageId,
          contentLength: currentAssistantContent.length,
        });
        return undefined;
      });
  }
}
