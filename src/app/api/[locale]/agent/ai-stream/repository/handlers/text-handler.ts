/**
 * TextHandler - Handles text delta processing during streaming
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../chat/enum";
import { createTextMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";
import type { StreamingTTSHandler } from "../streaming-tts";

export class TextHandler {
  /**
   * Process text-delta event from stream
   */
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
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
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
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
      ttsHandler,
    } = params;

    let { currentAssistantMessageId } = params;

    if (textDelta !== undefined && textDelta !== null && textDelta !== "") {
      // Add text to current ASSISTANT message (or create if doesn't exist)
      if (!currentAssistantMessageId) {
        const result = await this.createAssistantMessage({
          initialContent: textDelta,
          threadId,
          parentId: currentParentId,
          depth: currentDepth,
          model,
          character,
          sequenceId,
          isIncognito,
          userId,
          controller,
          encoder,
          logger,
        });
        currentAssistantMessageId = result.messageId;

        // IMPORTANT: Set messageId on TTS handler BEFORE calling addDelta
        // Otherwise the chunk will be skipped because messageId is not set
        if (ttsHandler) {
          ttsHandler.setMessageId(result.messageId);
          await ttsHandler.addDelta(textDelta);
        }

        return {
          currentAssistantMessageId,
          currentAssistantContent: result.content,
          wasCreated: true,
          newDepth: currentDepth,
        };
      }
      // Accumulate content
      const newContent = currentAssistantContent + textDelta;

      // Emit content-delta event
      this.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: textDelta,
        controller,
        encoder,
        logger,
      });

      // Send delta to TTS handler for audio generation
      if (ttsHandler) {
        await ttsHandler.addDelta(textDelta);
      }

      return {
        currentAssistantMessageId,
        currentAssistantContent: newContent,
        wasCreated: false,
        newDepth: currentDepth,
      };
    }

    return {
      currentAssistantMessageId: currentAssistantMessageId!,
      currentAssistantContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }

  /**
   * Create new ASSISTANT message in stream
   */
  private static async createAssistantMessage(params: {
    initialContent: string;
    threadId: string;
    parentId: string | null;
    depth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{ messageId: string; content: string }> {
    const {
      initialContent,
      threadId,
      parentId,
      depth,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    const messageId = crypto.randomUUID();

    logger.info("[AI Stream] Creating ASSISTANT message", {
      messageId,
      parentId,
      depth,
      sequenceId,
      threadId,
    });

    // Emit MESSAGE_CREATED event with empty content
    const messageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "",
      parentId,
      depth,
      model,
      character,
      sequenceId,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(messageEvent)));

    logger.info("[AI Stream] MESSAGE_CREATED event sent for ASSISTANT", {
      messageId,
      isIncognito,
      contentLength: initialContent.length,
    });

    // Emit CONTENT_DELTA event for initial content
    if (initialContent) {
      this.emitContentDelta({
        messageId,
        delta: initialContent,
        controller,
        encoder,
        logger,
      });
    }

    // Save ASSISTANT message to database if not incognito
    if (!isIncognito && initialContent) {
      const result = await createTextMessage({
        messageId,
        threadId,
        content: initialContent,
        parentId,
        depth,
        userId,
        model,
        character,
        sequenceId,
        logger,
      });
      if (!result.success) {
        logger.warn("Failed to persist ASSISTANT message - continuing stream", {
          messageId,
          error: result.message,
        });
      }
    }

    logger.debug("ASSISTANT message created", {
      messageId,
    });

    return { messageId, content: initialContent };
  }

  /**
   * Emit content delta event
   */
  private static emitContentDelta(params: {
    messageId: string;
    delta: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): void {
    const { messageId, delta, controller, encoder, logger } = params;

    logger.debug("[AI Stream] Emitting CONTENT_DELTA", {
      messageId,
      deltaLength: delta.length,
      delta: delta.slice(0, 50),
    });

    const deltaEvent = createStreamEvent.contentDelta({
      messageId,
      delta,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(deltaEvent)));
  }
}
