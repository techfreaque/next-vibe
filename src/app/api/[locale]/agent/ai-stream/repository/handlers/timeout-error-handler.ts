/**
 * TimeoutErrorHandler - Handles timeout errors during streaming
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../chat/enum";
import { createErrorMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class TimeoutErrorHandler {
  /**
   * Handle stream timeout error
   */
  static async handleTimeout(params: {
    maxDuration: number;
    model: string;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    lastParentId: string | null;
    lastDepth: number;
    lastSequenceId: string | null;
    controller: ReadableStreamDefaultController;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      maxDuration,
      model,
      threadId,
      isIncognito,
      userId,
      lastParentId,
      lastDepth,
      lastSequenceId,
      controller,
      encoder,
      logger,
    } = params;

    logger.error("[AI Stream] Stream timed out", {
      message: "Stream timeout",
      maxDuration: `${maxDuration} seconds`,
      model,
      threadId,
      hasContent: !!lastSequenceId,
    });

    // Create a timeout-specific error message for the UI
    const timeoutError = {
      message: "app.api.agent.chat.aiStream.errors.timeout",
      messageParams: { seconds: String(maxDuration) },
    };

    // Create ERROR message in DB if not incognito
    const errorMessageId = crypto.randomUUID();
    if (!isIncognito) {
      const { serializeError } = await import("../../error-utils");
      await createErrorMessage({
        messageId: errorMessageId,
        threadId,
        content: serializeError(timeoutError),
        errorType: "TIMEOUT_ERROR",
        parentId: lastParentId,
        depth: lastDepth,
        userId,
        sequenceId: lastSequenceId,
        logger,
      });
    }

    // Emit ERROR message event for UI
    const { serializeError } = await import("../../error-utils");
    const errorMessageEvent = createStreamEvent.messageCreated({
      messageId: errorMessageId,
      threadId,
      role: ChatMessageRole.ERROR,
      content: serializeError(timeoutError),
      parentId: lastParentId,
      depth: lastDepth,
      sequenceId: lastSequenceId,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

    // Emit error event to update UI state
    const errorEvent = createStreamEvent.error({
      code: "TIMEOUT_ERROR",
      message: `Stream timed out after ${maxDuration} seconds. The response may have been too long.`,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
  }
}
