/**
 * StreamErrorHandler - Handles stream errors and emits error events
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ChatMessageRole } from "../../../chat/enum";
import { createErrorMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { serializeError } from "../../error-utils";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class StreamErrorHandler {
  /**
   * Handle stream error and emit error events
   */
  static async handleStreamError(params: {
    error: Error | JSONValue;
    threadId: string;
    isIncognito: boolean;
    userId: string | undefined;
    lastParentId: string | null;
    lastDepth: number;
    lastSequenceId: string | null;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      error,
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

    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    logger.error("Stream error", {
      error: errorMessage,
      stack: errorStack,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });

    // Create structured error with translation key
    const structuredError = fail({
      message: "app.api.agent.chat.aiStream.errors.streamError" as const,
      errorType: ErrorResponseTypes.UNKNOWN_ERROR,
      messageParams: { error: errorMessage },
    });

    const errorMessageId = crypto.randomUUID();

    // Emit ERROR message event for UI
    const errorMessageEvent = createStreamEvent.messageCreated({
      messageId: errorMessageId,
      threadId,
      role: ChatMessageRole.ERROR,
      content: serializeError(structuredError),
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
        content: serializeError(structuredError),
        errorType: "STREAM_ERROR",
        parentId: lastParentId,
        depth: lastDepth,
        userId,
        sequenceId: lastSequenceId,
        logger,
      });
    }

    // Emit error event to update UI state
    const errorEvent = createStreamEvent.error({
      code: "STREAM_ERROR",
      message: errorMessage,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
    controller.close();
  }
}
