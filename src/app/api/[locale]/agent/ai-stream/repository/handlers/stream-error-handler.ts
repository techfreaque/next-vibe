/**
 * StreamErrorHandler - Handles stream errors and emits error events
 */

import type { JSONValue } from "ai";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { AiStreamTranslationKey } from "../../stream/i18n";
import type { scopedTranslation } from "../../stream/i18n";
import type { MessageDbWriter } from "../core/message-db-writer";

type AiStreamModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class StreamErrorHandler {
  /**
   * Handle stream error and emit error events
   */
  static async handleStreamError(params: {
    error: Error | JSONValue;
    threadId: string;
    userId: string | undefined;
    lastParentId: string | null;
    lastSequenceId: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamModuleT;
  }): Promise<void> {
    const {
      error,
      threadId,
      userId,
      lastParentId,
      lastSequenceId,
      dbWriter,
      logger,
      t,
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

    let translationKey: AiStreamTranslationKey;
    let errorType = ErrorResponseTypes.UNKNOWN_ERROR;

    if (errorMessage.toLowerCase().includes("rate limit")) {
      translationKey = "errors.rateLimitExceeded";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("insufficient") &&
      errorMessage.toLowerCase().includes("credit")
    ) {
      translationKey = "errors.insufficientCredits";
      errorType = ErrorResponseTypes.PAYMENT_REQUIRED;
    } else if (
      errorMessage.toLowerCase().includes("no output") ||
      errorMessage.toLowerCase().includes("no response") ||
      errorName === "AI_NoOutputGeneratedError"
    ) {
      translationKey = "errors.noResponse";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("model") &&
      (errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("unavailable"))
    ) {
      translationKey = "errors.modelUnavailable";
      errorType = ErrorResponseTypes.NOT_FOUND;
    } else if (
      errorMessage.toLowerCase().includes("connection") ||
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch failed") ||
      errorMessage.toLowerCase().includes("econnrefused")
    ) {
      translationKey = "errors.connectionFailed";
      errorType = ErrorResponseTypes.EXTERNAL_SERVICE_ERROR;
    } else if (
      errorMessage.toLowerCase().includes("invalid") ||
      errorMessage.toLowerCase().includes("malformed") ||
      errorMessage.toLowerCase().includes("bad request")
    ) {
      translationKey = "errors.invalidRequest";
      errorType = ErrorResponseTypes.BAD_REQUEST;
    } else {
      translationKey = "errors.streamError";
      errorType = ErrorResponseTypes.UNKNOWN_ERROR;
    }

    const structuredError = fail({
      message: t(translationKey),
      errorType,
    });

    // Emit MESSAGE_CREATED SSE + save to DB + emit ERROR SSE
    await dbWriter.emitErrorMessage({
      threadId,
      errorType: "STREAM_ERROR",
      error: structuredError,
      parentId: lastParentId,
      sequenceId: lastSequenceId,
      userId,
    });
  }
}
