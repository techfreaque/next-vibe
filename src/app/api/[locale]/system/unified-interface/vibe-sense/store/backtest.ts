/**
 * Vibe Sense — Backtest Store
 *
 * Backtest run metadata + result read/write.
 */

import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { pipelineBacktestResults, pipelineBacktestRuns } from "../db";
import type {
  TimeRange,
  DataPoint,
  Resolution,
  SignalEvent,
} from "../shared/fields";

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
      actionMode: "simulate",
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

// ─── Read Results ─────────────────────────────────────────────────────────────

export async function readBacktestRun(runId: string): Promise<{
  runId: string;
  graphId: string;
  range: TimeRange;
  resolution: Resolution;
  eligible: boolean | null;
} | null> {
  const rows = await db
    .select()
    .from(pipelineBacktestRuns)
    .where(eq(pipelineBacktestRuns.id, runId))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    runId: row.id,
    graphId: row.graphId,
    range: { from: row.rangeFrom, to: row.rangeTo },
    resolution: row.resolution,
    eligible: row.eligible,
  };
}

export async function readBacktestSeriesResults(
  runId: string,
  nodeId: string,
): Promise<DataPoint[]> {
  const rows = await db
    .select()
    .from(pipelineBacktestResults)
    .where(
      and(
        eq(pipelineBacktestResults.runId, runId),
        eq(pipelineBacktestResults.nodeId, nodeId),
      ),
    )
    .orderBy(pipelineBacktestResults.timestamp);

  return rows.map((row) => ({
    timestamp: row.timestamp,
    value: parseFloat(row.value),
    meta: row.meta ?? undefined,
  }));
}

export async function readBacktestSignalResults(
  runId: string,
  evaluatorId: string,
): Promise<SignalEvent[]> {
  const rows = await db
    .select()
    .from(pipelineBacktestResults)
    .where(
      and(
        eq(pipelineBacktestResults.runId, runId),
        eq(pipelineBacktestResults.nodeId, evaluatorId),
      ),
    )
    .orderBy(pipelineBacktestResults.timestamp);

  return rows
    .filter((r) => r.fired !== null)
    .map((row) => ({
      timestamp: row.timestamp,
      fired: row.fired!,
      meta: row.meta ?? undefined,
    }));
}

export async function listBacktestRunsForGraph(graphId: string): Promise<
  Array<{
    id: string;
    rangeFrom: Date;
    rangeTo: Date;
    resolution: Resolution;
    eligible: boolean | null;
    createdAt: Date;
  }>
> {
  const rows = await db
    .select()
    .from(pipelineBacktestRuns)
    .where(eq(pipelineBacktestRuns.graphId, graphId))
    .orderBy(pipelineBacktestRuns.createdAt);

  return rows.map((row) => ({
    id: row.id,
    rangeFrom: row.rangeFrom,
    rangeTo: row.rangeTo,
    resolution: row.resolution,
    eligible: row.eligible,
    createdAt: row.createdAt,
  }));
}
