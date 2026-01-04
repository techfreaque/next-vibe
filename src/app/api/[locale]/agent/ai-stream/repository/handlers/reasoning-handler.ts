/**
 * ReasoningHandler - Handles reasoning blocks for o1-style models
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../chat/enum";
import type { ModelId } from "../../../chat/model-access/models";
import { createTextMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class ReasoningHandler {
  /**
   * Process reasoning-start event
   */
  static async processReasoningStart(params: {
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
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantMessageId } = params;

    const thinkTag = "<think>";

    // Create ASSISTANT message if it doesn't exist yet
    if (!currentAssistantMessageId) {
      const result = await this.createAssistantMessage({
        initialContent: thinkTag,
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
      return {
        currentAssistantMessageId,
        currentAssistantContent: result.content,
        wasCreated: true,
        newDepth: currentDepth,
      };
    }
    // Add <think> tag to existing message
    const newContent = currentAssistantContent + thinkTag;

    // Emit delta for <think> tag
    this.emitContentDelta({
      messageId: currentAssistantMessageId,
      delta: thinkTag,
      controller,
      encoder,
      logger,
    });

    return {
      currentAssistantMessageId,
      currentAssistantContent: newContent,
      wasCreated: false,
      newDepth: currentDepth,
    };
  }

  /**
   * Process reasoning-delta event
   */
  static processReasoningDelta(params: {
    reasoningText: string;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): string {
    const {
      reasoningText,
      currentAssistantMessageId,
      currentAssistantContent,
      controller,
      encoder,
      logger,
    } = params;

    if (
      reasoningText !== undefined &&
      reasoningText !== null &&
      reasoningText !== "" &&
      currentAssistantMessageId
    ) {
      // Accumulate content
      const newContent = currentAssistantContent + reasoningText;

      // Emit content delta
      this.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: reasoningText,
        controller,
        encoder,
        logger,
      });

      return newContent;
    }

    return currentAssistantContent;
  }

  /**
   * Process reasoning-end event
   */
  static processReasoningEnd(params: {
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): string {
    const { currentAssistantMessageId, currentAssistantContent, controller, encoder, logger } =
      params;

    if (currentAssistantMessageId) {
      const thinkCloseTag = "</think>";

      // Add closing tag
      const newContent = currentAssistantContent + thinkCloseTag;

      // Emit closing tag delta
      this.emitContentDelta({
        messageId: currentAssistantMessageId,
        delta: thinkCloseTag,
        controller,
        encoder,
        logger,
      });

      return newContent;
    }

    return currentAssistantContent;
  }

  /**
   * Create ASSISTANT message
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

    logger.info("[AI Stream] Creating ASSISTANT message (reasoning)", {
      messageId,
      parentId,
      depth,
      sequenceId,
      threadId,
    });

    // Emit MESSAGE_CREATED event
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

    // Emit CONTENT_DELTA for <think> tag
    if (initialContent) {
      this.emitContentDelta({
        messageId,
        delta: initialContent,
        controller,
        encoder,
        logger,
      });
    }

    // Save to DB if not incognito
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
        logger.warn("Failed to persist ASSISTANT message (reasoning) - continuing stream", {
          messageId,
          error: result.message,
        });
      }
    }

    return { messageId, content: initialContent };
  }

  /**
   * Emit content delta
   */
  private static emitContentDelta(params: {
    messageId: string;
    delta: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): void {
    const { messageId, delta, controller, encoder, logger } = params;

    logger.debug("[AI Stream] Emitting CONTENT_DELTA (reasoning)", {
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
