/**
 * AbortControllerSetup - Sets up abort controllers for stream timeout and client disconnect
 */

import "server-only";

import { AbortReason, StreamAbortError } from "./constants";

export class AbortControllerSetup {
  /**
   * Create abort controller with timeout handling.
   * When parentSignal is provided (headless sub-streams), abort propagates from parent.
   */
  static setupAbortController(params: {
    maxDuration: number;
    parentSignal?: AbortSignal;
  }): AbortController {
    const { maxDuration, parentSignal } = params;

    // Create abort controller for this stream - combines request signal with timeout
    const streamAbortController = new AbortController();
    const timeoutAbortController = AbortSignal.timeout(maxDuration * 1000);

    // Abort our controller when timeout fires
    const timeoutAbortHandler = (): void => {
      streamAbortController.abort(
        new StreamAbortError(AbortReason.STREAM_TIMEOUT),
      );
    };
    timeoutAbortController.addEventListener("abort", timeoutAbortHandler);

    // Propagate parent cancellation (e.g. parent AI stream cancelled while sub-agent runs)
    if (parentSignal) {
      if (parentSignal.aborted) {
        streamAbortController.abort(parentSignal.reason);
      } else {
        parentSignal.addEventListener(
          "abort",
          () => {
            streamAbortController.abort(parentSignal.reason);
          },
          { once: true },
        );
      }
    }

    // Stream survives page refresh - no request.signal linkage.
    // Streams are only cancelled via the cancel endpoint or timeout.

    return streamAbortController;
  }
}
