/**
 * StreamErrorCatchHandler - Handles errors during stream execution
 */

import "server-only";

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { StreamContext } from "../core/stream-context";
import { AbortErrorHandler } from "./abort-error-handler";
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
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<void> {
    const {
      error,
      ctx,
      maxDuration,
      model,
      threadId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    // Check if this is a graceful abort (user stopped generation or tool confirmation required)
    if (error instanceof Error) {
      const { wasHandled } = AbortErrorHandler.handleAbortError({
        error,
        ctx,
        controller,
        encoder,
        logger,
      });

      if (wasHandled) {
        return;
      }
    }

    // Check if this is a timeout error
    if (error instanceof Error && error.message === "Stream timeout") {
      await TimeoutErrorHandler.handleTimeout({
        maxDuration,
        model,
        threadId,
        isIncognito,
        userId,
        lastParentId: ctx.lastParentId,
        lastDepth: ctx.lastDepth,
        lastSequenceId: ctx.lastSequenceId,
        controller,
        encoder,
        logger,
      });

      // Cleanup on timeout
      ctx.cleanup();

      controller.close();
      return;
    }

    // All other errors (including AI_NoOutputGeneratedError from provider validation)
    // should be sent to the frontend as error messages
    await StreamErrorHandler.handleStreamError({
      error: error instanceof Error ? error : (error as JSONValue),
      threadId,
      isIncognito,
      userId,
      lastParentId: ctx.lastParentId,
      lastDepth: ctx.lastDepth,
      lastSequenceId: ctx.lastSequenceId,
      controller,
      encoder,
      logger,
    });

    // Cleanup on error
    ctx.cleanup();
  }
}
