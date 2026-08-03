/**
 * Poll-loop delay for media-provider status polling.
 *
 * Collapses to 10ms when the PREVIOUS provider response was replayed from the
 * fixture cache (marked in-band via the x-vibe-fixture-replay response
 * header): a replayed 49-poll recording used to sleep ~245s of real wall
 * clock for responses that return instantly. Live runs are untouched.
 */

import { FIXTURE_REPLAY_HEADER } from "../ai-stream/testing/fetch-cache";

export async function pollDelay(
  ms: number,
  lastResponse?: Response,
): Promise<void> {
  const replayed = lastResponse?.headers.get(FIXTURE_REPLAY_HEADER) === "true";
  const effective = replayed ? 10 : ms;
  await new Promise<void>((resolve) => {
    setTimeout(resolve, effective);
  });
}
