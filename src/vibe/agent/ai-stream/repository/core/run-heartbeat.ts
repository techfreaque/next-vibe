/**
 * Run heartbeat - liveness of `chat_threads.streaming_run_id` claims.
 *
 * Every process (any HA node, all sharing one DB) keeps a set of the run ids
 * it currently owns and stamps `streaming_heartbeat_at = now()` for them once
 * per RUN_HEARTBEAT_INTERVAL_MS, in ONE update per process. A claim whose
 * heartbeat stopped belongs to a process that died (deploy recreate, OOM,
 * crash): the stale-run reaper (`ai-stream/stale-runs`) takes those over.
 * A live run on the peer node keeps beating into the shared DB, so it is
 * never reaped.
 *
 * Registration happens where a claim is taken (transitionStreamingState with a
 * run id, claimRevivalSlot); release happens in the owner-guarded
 * clearStreamingState. Paths that drop a claim without a run id (parking to
 * 'waiting') leave the entry behind: it matches no row any more, and it expires
 * after RUN_HEARTBEAT_MAX_AGE_MS. A stream can never run that long (its hard
 * timeout is far below), so expiry also lets the reaper catch a run that hung
 * inside a live process.
 */

import "server-only";

import { inArray } from "drizzle-orm";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { chatThreads } from "../../../chat/db";

/** How often a live owner stamps its claims. */
export const RUN_HEARTBEAT_INTERVAL_MS = 60_000;

/** A registration older than this stops beating (see module doc). */
export const RUN_HEARTBEAT_MAX_AGE_MS = 30 * 60_000;

interface OwnedRun {
  threadId: string;
  registeredAt: number;
}

const ownedRuns = new Map<string, OwnedRun>();
let timer: ReturnType<typeof setInterval> | null = null;
let heartbeatLogger: EndpointLogger | null = null;

/** Start beating for a claim this process just took. */
export function registerOwnedRun(
  runId: string,
  threadId: string,
  logger: EndpointLogger,
): void {
  ownedRuns.set(runId, { threadId, registeredAt: Date.now() });
  heartbeatLogger = logger;
  if (timer === null) {
    timer = setInterval(() => {
      void beatOwnedRuns();
    }, RUN_HEARTBEAT_INTERVAL_MS);
    // Never keep a process (draining server, CLI run) alive just to beat.
    unrefTimer(timer);
  }
}

/**
 * Node/Bun timers are objects with unref(). Taken as a parameter so the union
 * survives (a typed const narrows to whichever setInterval overload the active
 * lib picked).
 */
function unrefTimer(handle: number | { unref?: () => void }): void {
  if (typeof handle === "object") {
    handle.unref?.();
  }
}

/** Stop beating for a claim (its owner released it). */
export function releaseOwnedRun(runId: string): void {
  ownedRuns.delete(runId);
  if (ownedRuns.size === 0 && timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}

/** Run ids this process currently beats for (diagnostics / tests). */
export function ownedRunIds(): string[] {
  return [...ownedRuns.keys()];
}

/**
 * One heartbeat tick: expire over-age registrations, then stamp every claim
 * this process still owns. Exported for tests; production runs it on the timer.
 */
export async function beatOwnedRuns(now: Date = new Date()): Promise<number> {
  for (const [runId, run] of ownedRuns) {
    if (now.getTime() - run.registeredAt > RUN_HEARTBEAT_MAX_AGE_MS) {
      heartbeatLogger?.warn(
        "[RunHeartbeat] Run registered for too long - no longer beating",
        { runId, threadId: run.threadId },
      );
      releaseOwnedRun(runId);
    }
  }
  const runIds = ownedRunIds();
  if (runIds.length === 0) {
    return 0;
  }
  try {
    const rows = await db
      .update(chatThreads)
      .set({ streamingHeartbeatAt: now })
      .where(inArray(chatThreads.streamingRunId, runIds))
      .returning({ id: chatThreads.id });
    return rows.length;
  } catch (error) {
    // A missed beat is harmless (the reaper threshold spans many beats); log it
    // so a persistent failure is visible before it lets the reaper fire.
    heartbeatLogger?.error("[RunHeartbeat] Heartbeat update failed", {
      runs: runIds.length,
      error: parseError(error).message,
    });
    return 0;
  }
}
