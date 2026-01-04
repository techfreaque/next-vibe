/**
 * AbortErrorHandler - Handles graceful stream abort errors
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createStreamEvent, formatSSEEvent } from "../../events";
import type { StreamContext } from "../core/stream-context";

export class AbortErrorHandler {
  /**
   * Handle graceful abort errors (client disconnect, tool confirmation)
   */
  static handleAbortError(params: {
    error: Error;
    ctx: StreamContext;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): { wasHandled: boolean } {
    const { error, ctx, controller, encoder, logger } = params;

    // Check if this is a graceful abort
    if (
      !(
        error.name === "AbortError" ||
        error.message === "Client disconnected" ||
        error.message === "Tool requires user confirmation"
      )
    ) {
      return { wasHandled: false };
    }

    logger.info("[AI Stream] Stream aborted", {
      message: error.message,
      errorName: error.name,
      reason:
        error.message === "Tool requires user confirmation"
          ? "waiting_for_tool_confirmation"
          : "client_disconnected",
    });

    // Controller is already closed in processToolCall for tool confirmation
    // Only close if not already closed
    if (error.message !== "Tool requires user confirmation") {
      // Emit a stopped event to inform the frontend
      const stoppedEvent = createStreamEvent.contentDone({
        messageId: ctx.lastSequenceId ?? "",
        content: "",
        totalTokens: null,
        finishReason: "stop",
      });
      controller.enqueue(encoder.encode(formatSSEEvent(stoppedEvent)));
      controller.close();
    }

    // Cleanup on abort
    ctx.cleanup();

    return { wasHandled: true };
  }
}
