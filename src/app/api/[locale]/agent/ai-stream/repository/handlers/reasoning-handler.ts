/**
 * ReasoningHandler - Handles reasoning blocks for o1-style models
 */

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageDbWriter } from "../core/message-db-writer";

export class ReasoningHandler {
  static async processReasoningStart(params: {
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    threadId: string;
    currentParentId: string | null;
    currentDepth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    userId: string | undefined;
    getNextAssistantMessageId: () => string;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
    newDepth: number;
  }> {
    const {
      currentAssistantContent,
      threadId,
      currentParentId,
      currentDepth,
      model,
      character,
      sequenceId,
      userId,
      getNextAssistantMessageId,
      dbWriter,
      logger,
    } = params;

    let { currentAssistantMessageId } = params;
    const thinkTag = "<think>";

    if (!currentAssistantMessageId) {
      const messageId = getNextAssistantMessageId();
      logger.info("[AI Stream] Creating ASSISTANT message (reasoning)", {
        messageId,
        parentId: currentParentId,
        depth: currentDepth,
      });

      // Emits MESSAGE_CREATED + CONTENT_DELTA SSE, then inserts to DB
      await dbWriter.emitMessageCreated({
        messageId,
        threadId,
        content: thinkTag,
        parentId: currentParentId,
        depth: currentDepth,
        userId,
        model,
        character,
        sequenceId,
      });

      return {
        currentAssistantMessageId: messageId,
        currentAssistantContent: thinkTag,
        wasCreated: true,
        newDepth: currentDepth,
      };
    }

    const newContent = currentAssistantContent + thinkTag;
    dbWriter.emitDeltaAndSchedule(
      currentAssistantMessageId,
      thinkTag,
      newContent,
    );

    return {
      currentAssistantMessageId,
      currentAssistantContent: newContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }

  static processReasoningDelta(params: {
    reasoningText: string;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    dbWriter: MessageDbWriter;
  }): string {
    const {
      reasoningText,
      currentAssistantMessageId,
      currentAssistantContent,
      dbWriter,
    } = params;

    if (reasoningText && currentAssistantMessageId) {
      const newContent = currentAssistantContent + reasoningText;
      dbWriter.emitDeltaAndSchedule(
        currentAssistantMessageId,
        reasoningText,
        newContent,
      );
      return newContent;
    }

    return currentAssistantContent;
  }

  static processReasoningEnd(params: {
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    dbWriter: MessageDbWriter;
  }): string {
    const { currentAssistantMessageId, currentAssistantContent, dbWriter } =
      params;

    if (currentAssistantMessageId) {
      const thinkCloseTag = "</think>";
      const newContent = currentAssistantContent + thinkCloseTag;
      dbWriter.emitDeltaAndSchedule(
        currentAssistantMessageId,
        thinkCloseTag,
        newContent,
      );
      return newContent;
    }

    return currentAssistantContent;
  }
}
