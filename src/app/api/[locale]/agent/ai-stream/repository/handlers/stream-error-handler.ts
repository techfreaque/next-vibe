/**
 * StreamErrorHandler - Handles stream errors and emits error events
 */

import type { JSONValue } from "ai";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { MessageDbWriter } from "../core/message-db-writer";

export class StreamErrorHandler {
  /**
   * Handle stream error and emit error events
   */
  static async handleStreamError(params: {
    error: Error | JSONValue;
    threadId: string;
    userId: string | undefined;
    lastParentId: string | null;
    lastDepth: number;
    lastSequenceId: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      error,
      threadId,
      userId,
      lastParentId,
      lastDepth,
      lastSequenceId,
      dbWriter,
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
      translationKey =
        "app.api.agent.chat.aiStream.errors.streamError" satisfies TranslationKey;
      errorType = ErrorResponseTypes.UNKNOWN_ERROR;
    }

    const structuredError = fail({ message: translationKey, errorType });

    // Emit MESSAGE_CREATED SSE + save to DB + emit ERROR SSE
    await dbWriter.emitErrorMessage({
      threadId,
      errorType: "STREAM_ERROR",
      error: structuredError,
      parentId: lastParentId,
      depth: lastDepth,
      sequenceId: lastSequenceId,
      userId,
    });

    dbWriter.closeController();
  }
}
