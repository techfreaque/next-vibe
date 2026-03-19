/**
 * StreamErrorCatchHandler - Handles errors during stream execution
 */

import "server-only";

import type { JSONValue } from "ai";

import type { AiStreamT } from "@/app/api/[locale]/agent/ai-stream/stream/i18n";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { AbortReason, isStreamAbort } from "../core/constants";
import type { StreamContext } from "../core/stream-context";
import { clearStreamingState } from "../core/stream-registry";
import { StreamErrorHandler } from "./stream-error-handler";
import { TimeoutErrorHandler } from "./timeout-error-handler";

export class StreamErrorCatchHandler {
  /**
   * Handle errors caught during stream execution
   */
  static async handleError(params: {
    error: Error | JSONValue;
    ctx: StreamContext;
    maxDuration: number;
    model: ModelId;
    threadId: string;
    userId: string | undefined;
    logger: EndpointLogger;
    t: AiStreamT;
  }): Promise<void> {
    const { error, ctx, maxDuration, model, threadId, userId, logger, t } =
      params;

    // Note: Abort errors are handled inline in stream-execution-handler.
    // This handler only receives non-abort errors.

    if (
      error instanceof Error &&
      isStreamAbort(error) &&
      error.reason === AbortReason.STREAM_TIMEOUT
    ) {
      await TimeoutErrorHandler.handleTimeout({
        maxDuration,
        model,
        threadId,
        userId,
        lastParentId: ctx.lastParentId,
        lastSequenceId: ctx.lastSequenceId,
        dbWriter: ctx.dbWriter,
        logger,
        t,
      });

      await clearStreamingState(threadId, logger);
      ctx.cleanup();
      return;
    }

    await StreamErrorHandler.handleStreamError({
      error: error instanceof Error ? error : (error as JSONValue),
      threadId,
      userId,
      lastParentId: ctx.lastParentId,
      lastSequenceId: ctx.lastSequenceId,
      dbWriter: ctx.dbWriter,
      logger,
      t,
    });

    await clearStreamingState(threadId, logger);
    ctx.cleanup();
  }
}
