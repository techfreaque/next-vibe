/**
 * Fixture seeding — maps a thread to the TEST FILE's cache folder (`prefix`,
 * e.g. "cheap"). EVERY thread a file uses (the shared T-tree thread, plus
 * standalone incognito/credit threads) maps to the SAME prefix, so all of the
 * file's external calls record/replay into ONE folder, ordered by a SINGLE
 * per-prefix counter (fixture_counters) that runs continuously across the run.
 *
 * The counter is reset ONCE per file run (resetFixtureRun in beforeAll), never
 * per case — so re-running a file replays from ordinal 1 while cases within a
 * run never collide. Cross-instance: the harness maps the SAME threadId on both
 * atlas and hermes; each instance keeps its own counter for the folder.
 */

import "server-only";

import { db } from "next-vibe/database";

import {
  makeHeadlessContext,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";

import { fixtures } from "./fixtures.db";

/**
 * Create the run's ONE fixtures entry: threadId → the file's cache folder
 * (prefix), counter 0. Called once per run. Always writes local (atlas); when
 * `alsoRemote` is set (Hermes/cross-instance), also writes remote (hermes) so a
 * relayed thread replays on the receiver.
 */
export async function seedFixtureThread(
  threadId: string,
  prefix: string,
  alsoRemote: boolean,
): Promise<void> {
  await db
    .insert(fixtures)
    .values({ threadId, prefix, counter: 0 })
    .onConflictDoUpdate({
      target: fixtures.threadId,
      set: { prefix, counter: 0 },
    });
  if (alsoRemote) {
    const { getProdDb } = await import("./remote-setup");
    await getProdDb()
      .insert(fixtures)
      .values({ threadId, prefix, counter: 0 })
      .onConflictDoUpdate({
        target: fixtures.threadId,
        set: { prefix, counter: 0 },
      });
  }
}

/**
 * Mint a fresh threadId, seed its fixtures row (both instances when
 * `alsoRemote`), and return the id plus the thread-anchored stream context to
 * pass to runTestStream. The one-liner for standalone (non-parametrized) suites
 * that call runTestStream directly instead of through makeRunStream.
 */
export async function seedCaseThread(
  prefix: string,
  alsoRemote = false,
): Promise<{ threadId: string; streamContext: ToolExecutionContext }> {
  const threadId = crypto.randomUUID();
  await seedFixtureThread(threadId, prefix, alsoRemote);
  return {
    threadId,
    streamContext: makeHeadlessContext(
      undefined,
      threadId,
      /* no user context — UTC (dates not user-facing here) */ "UTC",
    ),
  };
}
