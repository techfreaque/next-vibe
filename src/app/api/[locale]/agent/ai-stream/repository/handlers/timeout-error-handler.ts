/**
 * TimeoutErrorHandler - Handles timeout errors during streaming
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

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

    const timeoutError = fail({
      message: "app.api.agent.chat.aiStream.errors.timeout" as const,
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      messageParams: { maxDuration: maxDuration.toString() },
    });

    const errorMessageId = crypto.randomUUID();
    const { serializeError } = await import("../../error-utils");

    // Emit ERROR message event for UI
    const errorMessageEvent = createStreamEvent.messageCreated({
      messageId: errorMessageId,
      threadId,
      role: ChatMessageRole.ERROR,
      content: serializeError(timeoutError),
      parentId: lastParentId,
      depth: lastDepth,
      sequenceId: lastSequenceId,
      model: null,
      character: null,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

    // Save ERROR message to DB (server mode only - incognito stores in localStorage)
    if (!isIncognito) {
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

    // Emit ERROR event to stop the stream
    const errorEvent = createStreamEvent.error(timeoutError);
    controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
  }
}
