/**
 * TextHandler - Handles text delta processing during streaming
 */

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { MessageDbWriter } from "../core/message-db-writer";
import type { StreamingTTSHandler } from "../streaming-tts";

export class TextHandler {
  static async processTextDelta(params: {
    textDelta: string;
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
    ttsHandler: StreamingTTSHandler | null;
  }): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
    newDepth: number;
  }> {
    const {
      textDelta,
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
      ttsHandler,
    } = params;

    let { currentAssistantMessageId } = params;

    if (!textDelta) {
      return {
        currentAssistantMessageId: currentAssistantMessageId!,
        currentAssistantContent,
        wasCreated: false,
        newDepth: currentDepth,
      };
    }

    // First delta: create the message
    if (!currentAssistantMessageId) {
      const messageId = getNextAssistantMessageId();

      logger.debug("[AI Stream] Creating ASSISTANT message", {
        messageId,
        parentId: currentParentId,
        depth: currentDepth,
      });

      // Emits MESSAGE_CREATED + CONTENT_DELTA SSE, then inserts to DB
      await dbWriter.emitMessageCreated({
        messageId,
        threadId,
        content: textDelta,
        parentId: currentParentId,
        depth: currentDepth,
        userId,
        model,
        character,
        sequenceId,
      });

      currentAssistantMessageId = messageId;

      if (ttsHandler) {
        ttsHandler.setMessageId(messageId);
        void ttsHandler.addDelta(textDelta);
      }

      return {
        currentAssistantMessageId,
        currentAssistantContent: textDelta,
        wasCreated: true,
        newDepth: currentDepth,
      };
    }

    // Subsequent deltas: emit SSE + throttled DB update
    const newContent = currentAssistantContent + textDelta;
    dbWriter.emitDeltaAndSchedule(
      currentAssistantMessageId,
      textDelta,
      newContent,
    );

    if (ttsHandler) {
      void ttsHandler.addDelta(textDelta);
    }

    return {
      currentAssistantMessageId,
      currentAssistantContent: newContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }
}
