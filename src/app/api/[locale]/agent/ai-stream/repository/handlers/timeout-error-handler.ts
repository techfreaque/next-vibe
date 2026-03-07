/**
 * TimeoutErrorHandler - Handles timeout errors during streaming
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { AiStreamT } from "../../stream/i18n";
import type { MessageDbWriter } from "../core/message-db-writer";

export class TimeoutErrorHandler {
  /**
   * Handle stream timeout error
   */
  static async handleTimeout(params: {
    maxDuration: number;
    model: string;
    threadId: string;
    userId: string | undefined;
    lastParentId: string | null;
    lastSequenceId: string | null;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const {
      maxDuration,
      model,
      threadId,
      userId,
      lastParentId,
      lastSequenceId,
      dbWriter,
      logger,
      t,
    } = params;

    logger.error("[AI Stream] Stream timed out", {
      message: "Stream timeout",
      maxDuration: `${maxDuration} seconds`,
      model,
      threadId,
      hasContent: !!lastSequenceId,
    });

    const timeoutError = fail({
      message: t("errors.timeout", { maxDuration: maxDuration.toString() }),
      errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
    });

    // Emit MESSAGE_CREATED SSE + save to DB + emit ERROR SSE
    await dbWriter.emitErrorMessage({
      threadId,
      errorType: "TIMEOUT_ERROR",
      error: timeoutError,
      parentId: lastParentId,
      sequenceId: lastSequenceId,
      userId,
    });
  }
}
