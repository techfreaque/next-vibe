/**
 * AbortControllerSetup - Sets up abort controllers for stream timeout and client disconnect
 */

import "server-only";

import type { NextRequest } from "next/server";

export class AbortControllerSetup {
  /**
   * Create abort controller with timeout and client disconnect handling
   */
  static setupAbortController(params: {
    maxDuration: number;
    request: NextRequest | undefined;
  }): AbortController {
    const { maxDuration, request } = params;

    // Create abort controller for this stream - combines request signal with timeout
    const streamAbortController = new AbortController();
    const timeoutAbortController = AbortSignal.timeout(maxDuration * 1000);

    // Abort our controller when timeout fires
    const timeoutAbortHandler = (): void => {
      streamAbortController.abort(new Error("Stream timeout"));
    };
    timeoutAbortController.addEventListener("abort", timeoutAbortHandler);

    // Also abort if client disconnects (request signal)
    if (request?.signal) {
      const requestAbortHandler = (): void => {
        streamAbortController.abort(new Error("Client disconnected"));
      };
      request.signal.addEventListener("abort", requestAbortHandler);
    }

    return streamAbortController;
  }
}
