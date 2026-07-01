/**
 * Vibe Sense - Signals Store
 *
 * Evaluator signal read/write.
 * Signals are always persisted - they are the audit trail.
 */

import "server-only";

import { and, between, eq, lt, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { pipelineSignals } from "../db";
import type { SignalEvent, TimeRange } from "../shared/fields";

export type { SignalEvent };

// ─── Write ────────────────────────────────────────────────────────────────────

export async function writeSignal(
  evaluatorId: string,
  graphId: string,
  event: SignalEvent,
): Promise<void> {
  await db.insert(pipelineSignals).values({
    evaluatorId,
    graphId,
    timestamp: event.timestamp,
    fired: event.fired,
    meta: event.meta ?? null,
  });
}

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

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function readSignals(
  evaluatorId: string,
  graphId: string,
  range: TimeRange,
): Promise<SignalEvent[]> {
  const rows = await db
    .select()
    .from(pipelineSignals)
    .where(
      and(
        eq(pipelineSignals.evaluatorId, evaluatorId),
        eq(pipelineSignals.graphId, graphId),
        between(pipelineSignals.timestamp, range.from, range.to),
      ),
    )
    .orderBy(pipelineSignals.timestamp);

  return rows.map((row) => ({
    timestamp: row.timestamp,
    fired: row.fired,
    meta: row.meta ?? undefined,
  }));
}

/** Read all signals that fired (fired=true) within a range */
export async function readFiredSignals(
  evaluatorId: string,
  graphId: string,
  range: TimeRange,
): Promise<SignalEvent[]> {
  const rows = await db
    .select()
    .from(pipelineSignals)
    .where(
      and(
        eq(pipelineSignals.evaluatorId, evaluatorId),
        eq(pipelineSignals.graphId, graphId),
        eq(pipelineSignals.fired, true),
        between(pipelineSignals.timestamp, range.from, range.to),
      ),
    )
    .orderBy(pipelineSignals.timestamp);

  return rows.map((row) => ({
    timestamp: row.timestamp,
    fired: row.fired,
    meta: row.meta ?? undefined,
  }));
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

/**
 * Delete signals beyond a max row count per evaluator.
 * Keeps the most recent signals.
 */
export async function cleanupExcessSignals(
  maxRowsPerEvaluator: number,
): Promise<number> {
  // Get all distinct evaluator+graph combinations with excess rows
  const groups = await db.execute(sql`
    SELECT evaluator_id, graph_id, COUNT(*) as cnt
    FROM pipeline_signals
    GROUP BY evaluator_id, graph_id
    HAVING COUNT(*) > ${maxRowsPerEvaluator}
  `);

  let totalDeleted = 0;
  for (const group of groups.rows) {
    const evaluatorId = group["evaluator_id"] as string;
    const graphId = group["graph_id"] as string;
    const excess = Number(group["cnt"]) - maxRowsPerEvaluator;

    if (excess > 0) {
      const result = await db.execute(sql`
        DELETE FROM pipeline_signals
        WHERE id IN (
          SELECT id FROM pipeline_signals
          WHERE evaluator_id = ${evaluatorId} AND graph_id = ${graphId}
          ORDER BY timestamp ASC
          LIMIT ${excess}
        )
      `);
      totalDeleted += Number(result.rowCount ?? 0);
    }
  }

  return totalDeleted;
}
