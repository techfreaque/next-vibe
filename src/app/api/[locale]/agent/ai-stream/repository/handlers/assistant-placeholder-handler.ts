/**
 * AssistantPlaceholderHandler - Creates placeholder assistant messages for tool calls
 */

import "server-only";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../chat/enum";
import { createTextMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class AssistantPlaceholderHandler {
  /**
   * Create placeholder ASSISTANT message when tool call occurs without preceding text
   * CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
   */
  static async createPlaceholder(params: {
    threadId: string;
    parentId: string | null;
    depth: number;
    sequenceId: string;
    model: ModelId;
    character: string;
    isIncognito: boolean;
    userId: string | undefined;
    initialAssistantMessageId: string;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    messageId: string;
    newParentId: string;
    newDepth: number;
  }> {
    const {
      threadId,
      parentId,
      depth,
      sequenceId,
      model,
      character,
      isIncognito,
      userId,
      initialAssistantMessageId,
      controller,
      encoder,
      logger,
    } = params;

    const messageId = initialAssistantMessageId;

    // Update parent chain to point to the placeholder ASSISTANT message
    // This ensures the TOOL message becomes a child of the ASSISTANT message
    const newParentId = messageId;
    const newDepth = depth;
    // depth stays the same - ASSISTANT message is at the same depth

    logger.info(
      "[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain",
      {
        messageId,
        reason: "Tool call without preceding text/reasoning",
        parentId,
        depth: newDepth,
      },
    );

    // Create the ASSISTANT message in the database immediately so TOOL messages can reference it as parent_id
    if (!isIncognito) {
      await createTextMessage({
        messageId,
        threadId,
        content: "", // Empty content - will be saved as null and updated if AI generates text
        parentId,
        depth: newDepth,
        sequenceId,
        userId,
        model,
        character,
        logger,
      });

      logger.info(
        "[AI Stream] Created placeholder ASSISTANT message in database",
        {
          messageId,
          threadId,
        },
      );
    }

    // CRITICAL FIX: Emit MESSAGE_CREATED event for placeholder ASSISTANT messages
    // This is required so the parent chain is maintained in the UI
    // Without this, TOOL messages appear orphaned because their parent doesn't exist in frontend store
    const placeholderMessageEvent = createStreamEvent.messageCreated({
      messageId,
      threadId,
      role: ChatMessageRole.ASSISTANT,
      content: "", // Empty content - will be updated if AI generates text
      parentId,
      depth,
      sequenceId,
      model,
      character,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(placeholderMessageEvent)));

    logger.info(
      "[AI Stream] MESSAGE_CREATED event sent for placeholder ASSISTANT",
      {
        messageId,
        parentId,
        depth,
      },
    );

    return {
      messageId,
      newParentId,
      newDepth,
    };
  }
}
