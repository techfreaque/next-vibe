/**
 * AbortControllerSetup - Sets up abort controllers for stream timeout and client disconnect
 */

import "server-only";

export class AbortControllerSetup {
  /**
   * Create abort controller with timeout handling
   */
  static setupAbortController(params: {
    maxDuration: number;
  }): AbortController {
    const { maxDuration } = params;

    // Create abort controller for this stream - combines request signal with timeout
    const streamAbortController = new AbortController();
    const timeoutAbortController = AbortSignal.timeout(maxDuration * 1000);

    // Abort our controller when timeout fires
    const timeoutAbortHandler = (): void => {
      streamAbortController.abort(new Error("Stream timeout"));
    };
    timeoutAbortController.addEventListener("abort", timeoutAbortHandler);

    // Stream survives page refresh — no request.signal linkage.
    // Streams are only cancelled via the cancel endpoint or timeout.

    return streamAbortController;
  }
}
