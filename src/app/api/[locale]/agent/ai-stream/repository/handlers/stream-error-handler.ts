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
import type { TranslationKey } from "@/i18n/core/static-types";

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
    const errorName =
      error instanceof Error ? error.constructor.name : typeof error;

    logger.error("Stream error", {
      error: errorMessage,
      stack: errorStack,
      errorType: errorName,
    });

    // Detect specific error types based on error message or name
    let translationKey: TranslationKey;
    let errorType = ErrorResponseTypes.UNKNOWN_ERROR;

    if (errorMessage.toLowerCase().includes("rate limit")) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.rateLimitExceeded" satisfies TranslationKey;
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("insufficient") &&
      errorMessage.toLowerCase().includes("credit")
    ) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.insufficientCredits" satisfies TranslationKey;
      errorType = ErrorResponseTypes.PAYMENT_REQUIRED;
    } else if (
      errorMessage.toLowerCase().includes("no output") ||
      errorMessage.toLowerCase().includes("no response") ||
      errorName === "AI_NoOutputGeneratedError"
    ) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.noResponse" satisfies TranslationKey;
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("model") &&
      (errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("unavailable"))
    ) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.modelUnavailable" satisfies TranslationKey;
      errorType = ErrorResponseTypes.NOT_FOUND;
    } else if (
      errorMessage.toLowerCase().includes("connection") ||
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch failed") ||
      errorMessage.toLowerCase().includes("econnrefused")
    ) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.connectionFailed" satisfies TranslationKey;
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("invalid") ||
      errorMessage.toLowerCase().includes("malformed") ||
      errorMessage.toLowerCase().includes("bad request")
    ) {
      translationKey =
        "app.api.agent.chat.aiStream.errors.invalidRequest" satisfies TranslationKey;
      errorType = ErrorResponseTypes.BAD_REQUEST;
    } else {
      // Generic stream error as fallback
      translationKey =
        "app.api.agent.chat.aiStream.errors.streamError" satisfies TranslationKey;
      errorType = ErrorResponseTypes.UNKNOWN_ERROR;
    }

    // Create structured error with translation key
    const structuredError = fail({
      message: translationKey,
      errorType,
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
    const errorEvent = createStreamEvent.error(
      fail({
        message: errorMessage,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      }),
    );
    controller.enqueue(encoder.encode(formatSSEEvent(errorEvent)));
    controller.close();
  }
}
