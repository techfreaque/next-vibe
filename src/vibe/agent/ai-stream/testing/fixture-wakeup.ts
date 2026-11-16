/**
 * Fixture-mode wakeUp delivery: deferred results only at turn boundaries.
 *
 * Live, a wakeUp result that lands while its dispatching stream still runs is
 * injected into that stream as the next step; one that lands later revives the
 * thread as its own turn. Which one happens depends on wall-clock timing, so
 * a record and its replay (or two replays) made a different number of model
 * calls in a different order and the ordinal fixture replay drifted (T6c).
 * Under a fixture run the result always waits for the turn to end and arrives
 * through the post-stream revival: same calls, same order, every run.
 */

import "server-only";

import { readFixturePrefix } from "./fetch-cache";

/** True when `threadId` runs under a fixtures row (test record/replay). */
export async function deliversWakeUpAtTurnEnd(
  threadId: string,
): Promise<boolean> {
  return (await readFixturePrefix(threadId)) !== null;
}
