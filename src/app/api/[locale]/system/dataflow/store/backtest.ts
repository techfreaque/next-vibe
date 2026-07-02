/**
 * Vibe Sense - Backtest Store
 *
 * Backtest run metadata + result read/write.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type {
  DataPoint,
  Resolution,
  SignalEvent,
  TimeRange,
} from "next-vibe/dataflow/shared/fields";

import { pipelineBacktestResults, pipelineBacktestRuns } from "../db";
import { BacktestActionMode } from "../enum";

// ─── Create Run ───────────────────────────────────────────────────────────────

export async function createBacktestRun(
  graphId: string,
  graphVersionId: string,
  range: TimeRange,
  resolution: Resolution,
): Promise<string | undefined> {
  const [row] = await db
    .insert(pipelineBacktestRuns)
    .values({
      graphId,
      graphVersionId,
      rangeFrom: range.from,
      rangeTo: range.to,
      resolution,
      actionMode: BacktestActionMode.SIMULATE,
      eligible: null,
    })
    .returning({ id: pipelineBacktestRuns.id });

  return row?.id;
}

export async function markBacktestEligibility(
  runId: string,
  eligible: boolean,
): Promise<void> {
  await db
    .update(pipelineBacktestRuns)
    .set({ eligible })
    .where(eq(pipelineBacktestRuns.id, runId));
}

// ─── Write Results ────────────────────────────────────────────────────────────

export async function writeBacktestSeriesResult(
  runId: string,
  nodeId: string,
  points: DataPoint[],
): Promise<void> {
  if (points.length === 0) {
    return;
  }

  const rows = points.map((p) => ({
    runId,
    nodeId,
    timestamp: p.timestamp,
    value: String(p.value),
    fired: null,
    meta: p.meta ?? null,
  }));

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    await db
      .insert(pipelineBacktestResults)
      .values(rows.slice(i, i + batchSize))
      .onConflictDoNothing();
  }
}

export async function writeBacktestSignalResult(
  runId: string,
  evaluatorId: string,
  events: SignalEvent[],
): Promise<void> {
  if (events.length === 0) {
    return;
  }

  const rows = events.map((e) => ({
    runId,
    nodeId: evaluatorId,
    timestamp: e.timestamp,
    value: e.fired ? "1" : "0",
    fired: e.fired,
    meta: e.meta ?? null,
  }));

  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    await db
      .insert(pipelineBacktestResults)
      .values(rows.slice(i, i + batchSize))
      .onConflictDoNothing();
  }
}
