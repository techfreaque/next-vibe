/**
 * Fixture table — test-only record/replay bookkeeping, keyed by threadId.
 *
 * ONE row per run: the run's threadId → its cache FOLDER (`prefix`, the test
 * file's name, e.g. "cheap") + a running `counter`. The engine (fetch-cache.ts)
 * reads/bumps the row by threadId at every external call, so the Nth call maps
 * to file `<counter>-<instance>-<model>` inside `<prefix>/`.
 *
 * Decoupled from chat_threads: ai-stream creates its thread exactly as a fresh
 * thread (id provided), untouched by fixtures. No row → not a fixture run →
 * live. Cross-instance: the harness writes the SAME (threadId, prefix) on both
 * instances; each keeps its own counter.
 */

import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const fixtures = pgTable("fixtures", {
  /** The run's threadId — the fixture scope key. */
  threadId: text("thread_id").primaryKey(),
  /** Cache FOLDER (the test file's name, e.g. "cheap"). */
  prefix: text("prefix").notNull(),
  /** Running ordinal — bumped per external call; the file-match key. */
  counter: integer("counter").notNull().default(0),
});

export type FixtureRow = typeof fixtures.$inferSelect;
export type NewFixtureRow = typeof fixtures.$inferInsert;
