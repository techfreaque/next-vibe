/**
 * Cancel delivery shared by every cancel branch (stored and incognito threads).
 *
 *   1. StreamControl.deliver: the cross-process / cross-instance signal (the
 *      running stream subscribes to it, in whatever process runs it).
 *   2. LocalStreamRuns.cancel: when THIS process owns the run, abort its
 *      controller directly. Confirmed abort, no hub hop, so a stream whose hub
 *      subscription was not live (or was lost) still stops.
 *
 * Plus the incognito fallback reap. Stored threads reap from the DB
 * streaming_state (repository.ts scheduleOrphanReap). Incognito threads have no
 * row, so the reap decides from the local run registry instead: a run that is
 * still registered ORPHAN_REAP_DELAY_MS after the cancel never finalized, and
 * nothing would ever emit the stream-finished the client is waiting for.
 */

import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  type LocalCancelResult,
  type LocalStreamRun,
  LocalStreamRuns,
} from "../repository/core/local-stream-runs";
import { StreamControl } from "../repository/core/stream-control";

/** How long a cancelled stream gets to finalize itself before the cancel
 *  path treats it as orphaned. Below the client's 15s safety timeout. */
export const ORPHAN_REAP_DELAY_MS = 8000;

/** Deliver a cancel to a thread's stream: hub signal + direct local abort. */
export function deliverStreamCancel(
  threadId: string,
  user: JwtPayloadType,
  logger: EndpointLogger,
  deliver: typeof StreamControl.deliver = StreamControl.deliver,
): LocalCancelResult {
  deliver(threadId, "cancel", user, logger);
  const local = LocalStreamRuns.cancel(threadId);
  if (local.run) {
    const requesterKey = user.isPublic ? user.leadId : user.id;
    logger.info("[Cancel] Local run aborted directly", {
      threadId,
      runId: local.run.runId,
      abortedNow: local.abortedNow,
      // A mismatch means the hub signal (user-scoped channel) could never
      // have reached the run: the direct abort is what stopped it.
      ownerMatches: local.run.ownerKey === requesterKey,
    });
  }
  return local;
}

/** What the incognito reap should do once the delay has passed. */
export type IncognitoReapDecision =
  /** The cancelled run finalized and emitted stream-finished itself. */
  | "finalized"
  /** A newer stream is live on the thread: its own events drive the UI. */
  | "newer-stream"
  /** The cancelled local run is still registered: it never finalized. */
  | "stuck-local"
  /** No local run: the stream (if any) lived in another process/instance. */
  | "no-local-run";

/**
 * Decide the reap outcome. `cancelled` is the run found at cancel time,
 * `current` the run registered for the thread now.
 */
export function decideIncognitoReap(params: {
  cancelled: LocalStreamRun | null;
  current: LocalStreamRun | null;
  cancelledAt: number;
}): IncognitoReapDecision {
  const { cancelled, current, cancelledAt } = params;
  if (cancelled) {
    return current === cancelled ? "stuck-local" : "finalized";
  }
  if (!current) {
    return "no-local-run";
  }
  // Registered after the cancel. Aborted = the cancelled stream itself (the
  // cancel landed while it was still setting up and its finalization is
  // hanging). Not aborted = the user already started a new turn.
  return current.registeredAt >= cancelledAt &&
    !current.controller.signal.aborted
    ? "newer-stream"
    : "stuck-local";
}

/**
 * Cancel an incognito stream: deliver the cancel, then after the reap delay
 * emit stream-finished unless the run finalized or a newer stream took over.
 */
export function cancelIncognitoStream(params: {
  threadId: string;
  user: JwtPayloadType;
  logger: EndpointLogger;
  /** Emits stream-finished (IDLE) on the thread's incognito messages channel. */
  emitFinished: () => void;
  deliver?: typeof StreamControl.deliver;
  reapDelayMs?: number;
}): LocalCancelResult {
  const { threadId, user, logger, emitFinished } = params;
  const reapDelayMs = params.reapDelayMs ?? ORPHAN_REAP_DELAY_MS;
  const cancelledAt = Date.now();
  const local = deliverStreamCancel(threadId, user, logger, params.deliver);
  logger.info("[Cancel] Incognito cancel signal delivered", {
    threadId,
    localRun: local.run !== null,
  });

  setTimeout(() => {
    try {
      const decision = decideIncognitoReap({
        cancelled: local.run,
        current: LocalStreamRuns.get(threadId),
        cancelledAt,
      });
      if (decision === "finalized" || decision === "newer-stream") {
        return;
      }
      if (decision === "stuck-local") {
        logger.warn(
          "[Cancel] Incognito run did not finalize after cancel - emitting stream-finished",
          {
            threadId,
            runId: local.run?.runId ?? null,
            elapsedMs: Date.now() - cancelledAt,
            reapDelayMs,
          },
        );
      } else {
        // Most cancels land here only when the run lived elsewhere; its own
        // finalizer already emitted, and a second stream-finished is a no-op
        // on the client. When it did NOT (signal missed), this unlocks the UI.
        logger.debug(
          "[Cancel] Incognito cancel with no local run - emitting fallback stream-finished",
          { threadId, reapDelayMs },
        );
      }
      emitFinished();
    } catch (error) {
      logger.error("[Cancel] Incognito reap failed", {
        threadId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }, reapDelayMs);

  return local;
}
