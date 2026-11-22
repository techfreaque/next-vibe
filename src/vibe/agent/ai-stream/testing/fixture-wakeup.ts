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
 * The DETACH / WAKE_UP goroutine itself starts at that boundary too
 * (captureFixtureTurnGate).
 */

import "server-only";

import { readFixturePrefix } from "./fetch-cache";

/** True when `threadId` runs under a fixtures row (test record/replay). */
export async function deliversWakeUpAtTurnEnd(
  threadId: string,
): Promise<boolean> {
  return (await readFixturePrefix(threadId)) !== null;
}

/** Poll step and safety cap for the gate {@link captureFixtureTurnGate} returns. */
const TURN_END_POLL_MS = 20;
const TURN_END_MAX_WAIT_MS = 15 * 60 * 1000;

/** The gate when there is nothing to wait for. */
async function openGate(): Promise<void> {
  return undefined;
}

async function readStreamingRunId(threadId: string): Promise<string | null> {
  const { db } = await import("next-vibe/database");
  const { chatThreads } = await import("../../chat/db");
  const { eq } = await import("drizzle-orm");
  const [row] = await db
    .select({ runId: chatThreads.streamingRunId })
    .from(chatThreads)
    .where(eq(chatThreads.id, threadId))
    .limit(1);
  return row?.runId ?? null;
}

/**
 * Fixture-mode DETACH / WAKE_UP goroutine start: after the dispatching turn.
 *
 * Live, the background goroutine's external calls (image gen submit, polls)
 * race the dispatching stream's next model call for the run's single fixture
 * ordinal. Which one bumps first is wall-clock timing, so a replay can ask for
 * `<N>-chroma` where the recording has `<N>-<chat-model>` (route.regular.full
 * T5 failed about 2 of 3 runs). Under a fixture run the goroutine waits until
 * the dispatching stream releases its claim (`streaming_run_id` changes), the
 * same turn boundary wakeUp results already wait for: same calls, same order.
 *
 * Call BEFORE firing the goroutine (the claim must be read while the
 * dispatching turn still holds it); await the returned gate inside it.
 * Not a fixture run (prod, dev chats) or no claim: the gate resolves at once.
 */
export async function captureFixtureTurnGate(params: {
  threadId: string | undefined;
  parentThreadId: string | undefined;
}): Promise<(abortSignal: AbortSignal) => Promise<void>> {
  const { threadId, parentThreadId } = params;
  if (!threadId) {
    return openGate;
  }
  const { resolveFixtureRootThreadId } = await import("./fetch-cache");
  if (!(await resolveFixtureRootThreadId(threadId, parentThreadId))) {
    return openGate;
  }
  const dispatchRunId = await readStreamingRunId(threadId);
  if (!dispatchRunId) {
    return openGate;
  }
  return async (abortSignal: AbortSignal): Promise<void> => {
    const deadline = Date.now() + TURN_END_MAX_WAIT_MS;
    while (!abortSignal.aborted && Date.now() < deadline) {
      if ((await readStreamingRunId(threadId)) !== dispatchRunId) {
        return;
      }
      await new Promise<void>((resolve) => {
        setTimeout(resolve, TURN_END_POLL_MS);
      });
    }
  };
}
