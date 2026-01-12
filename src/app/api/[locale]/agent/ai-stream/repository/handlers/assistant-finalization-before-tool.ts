/**
 * AssistantFinalizationBeforeTool - Finalizes assistant message before tool call
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { updateMessageContent } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class AssistantFinalizationBeforeTool {
  /**
   * Finalize current ASSISTANT message before creating tool message
   * Closes reasoning block if open and updates message content
   */
  static async finalize(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    isIncognito: boolean;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    newAssistantContent: string;
    newIsInReasoningBlock: boolean;
  }> {
    const {
      currentAssistantMessageId,
      currentAssistantContent,
      isInReasoningBlock,
      isIncognito,
      controller,
      encoder,
      logger,
    } = params;

    let newAssistantContent = currentAssistantContent;
    let newIsInReasoningBlock = isInReasoningBlock;

    // If reasoning block is still open, close it before tool call
    if (isInReasoningBlock) {
      const thinkCloseTag = "</think>";
      newAssistantContent += thinkCloseTag;

      // Emit closing tag delta
      const thinkCloseDelta = createStreamEvent.contentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));

      newIsInReasoningBlock = false;

      logger.info(
        "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
        {
          messageId: currentAssistantMessageId,
        },
      );
    }

    // Update ASSISTANT message in database with accumulated content
    // Public users (userId undefined) are allowed - helper converts to null
    if (!isIncognito && newAssistantContent) {
      await updateMessageContent({
        messageId: currentAssistantMessageId,
        content: newAssistantContent,
        logger,
      });
    }

    logger.debug("Finalized ASSISTANT message before tool call", {
      messageId: currentAssistantMessageId,
      contentLength: newAssistantContent.length,
    });

    return {
      newAssistantContent,
      newIsInReasoningBlock,
    };
  }
}
