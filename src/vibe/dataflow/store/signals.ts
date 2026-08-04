/**
 * Vibe Sense - Signals Store
 *
 * Evaluator signal read/write.
 * Signals are always persisted - they are the audit trail.
 */

import "server-only";

import { lt } from "drizzle-orm";

import { db } from "../../database";
import { pipelineSignals } from "../db";
import type { SignalEvent } from "../shared/fields";

export type { SignalEvent };

// ─── Write ────────────────────────────────────────────────────────────────────

export async function writeSignals(
  evaluatorId: string,
  graphId: string,
  events: SignalEvent[],
): Promise<void> {
  if (events.length === 0) {
    return;
  }

  const rows = events.map((e) => ({
    evaluatorId,
    graphId,
    timestamp: e.timestamp,
    fired: e.fired,
    meta: e.meta ?? null,
  }));

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    await db
      .insert(pipelineSignals)
      .values(rows.slice(i, i + batchSize))
      .onConflictDoNothing();
  }
}

// ─── Retention ────────────────────────────────────────────────────────────────

/**
 * Delete signals older than the given number of days.
 * Called by the cleanup cron task to prevent unbounded table growth.
 */
export async function cleanupOldSignals(maxAgeDays: number): Promise<number> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxAgeDays);

  const result = await db
    .delete(pipelineSignals)
    .where(lt(pipelineSignals.timestamp, cutoff))
    .returning({ id: pipelineSignals.id });

  return result.length;
}
