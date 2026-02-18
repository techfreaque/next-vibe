/**
 * FinalizationHandler - Finalizes ASSISTANT messages at stream end
 */

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageDbWriter } from "../core/message-db-writer";

export class FinalizationHandler {
  /**
   * Finalize ASSISTANT message at stream end.
   *
   * Closes any open reasoning block, emits CONTENT_DONE SSE, flushes + writes
   * final content to DB, and writes token metadata. Pass null for token params
   * when usage is not available (e.g. mid-stream tool-loop step finalization).
   */
  static async finalizeAssistantMessage(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    finishReason: string | null | undefined;
    totalTokens: number | null | undefined;
    promptTokens: number | null | undefined;
    completionTokens: number | null | undefined;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      currentAssistantMessageId,
      isInReasoningBlock,
      finishReason,
      totalTokens,
      promptTokens,
      completionTokens,
      dbWriter,
      logger,
    } = params;

    let { currentAssistantContent } = params;

    // If reasoning block is still open, close it
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      currentAssistantContent += thinkCloseTag;
      dbWriter.emitClosingDelta(currentAssistantMessageId, thinkCloseTag);
    }

    // Emit CONTENT_DONE + flush + write final content + token metadata to DB
    await dbWriter.emitContentDone({
      messageId: currentAssistantMessageId,
      content: currentAssistantContent,
      finishReason: finishReason ?? null,
      totalTokens: totalTokens ?? null,
      promptTokens: promptTokens ?? null,
      completionTokens: completionTokens ?? null,
    });

    logger.debug("[FinalizationHandler] Persisted ASSISTANT message", {
      messageId: currentAssistantMessageId,
      contentLength: currentAssistantContent.length,
    });
  }
}
