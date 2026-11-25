/**
 * Vibe Sense - Execution Runs Store
 *
 * Tracks every scheduled and on-demand graph execution.
 * Answers "when did this graph last run? did it succeed?"
 */

import "server-only";

import { and, desc, eq, isNull, lt, sql } from "drizzle-orm";

import { db } from "../../database";
import { formatSense } from "../../logger/formatters";
import type { EndpointLogger } from "../../logger/types";
import { pipelineRuns } from "../db";
import { RunStatus, type RunStatusType } from "../enum";

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Create a new run record when a graph starts executing.
 * Returns the run ID for tracking.
 */
export async function createRun(
  graphId: string,
  graphVersionId: string,
): Promise<string> {
  const rows = await db
    .insert(pipelineRuns)
    .values({
      graphId,
      graphVersionId,
      status: RunStatus.RUNNING,
    })
    .returning({ id: pipelineRuns.id });

  const row = rows[0];
  // Return empty UUID if insert somehow returned no rows (should never happen)
  return row?.id ?? "00000000-0000-0000-0000-000000000000";
}

/**
 * Mark a run as completed or failed.
 */
export async function completeRun(
  runId: string,
  status: RunStatusType,
  errorCount: number,
  nodeCount: number,
): Promise<void> {
  await db
    .update(pipelineRuns)
    .set({
      status,
      errorCount,
      nodeCount,
      finishedAt: new Date(),
    })
    .where(
      and(
        eq(pipelineRuns.id, runId),
        eq(pipelineRuns.status, RunStatus.RUNNING),
        isNull(pipelineRuns.finishedAt),
      ),
    );
}

/** Fail abandoned runs without overwriting runs that have already finished. */
export async function reapStaleRuns(
  maxAgeMs: number,
  logger?: EndpointLogger,
): Promise<number> {
  const finishedAt = new Date();
  const cutoff = new Date(finishedAt.getTime() - maxAgeMs);
  const rows = await db
    .update(pipelineRuns)
    .set({
      status: RunStatus.FAILED,
      errorCount: sql`${pipelineRuns.errorCount} + 1`,
      finishedAt,
    })
    .where(
      and(
        eq(pipelineRuns.status, RunStatus.RUNNING),
        isNull(pipelineRuns.finishedAt),
        lt(pipelineRuns.startedAt, cutoff),
      ),
    )
    .returning({
      runId: pipelineRuns.id,
      graphId: pipelineRuns.graphId,
      startedAt: pipelineRuns.startedAt,
    });
  if (rows.length > 0) {
    logger?.warn(formatSense("Recovered unfinished graph runs"), {
      count: rows.length,
      staleAfterMs: maxAgeMs,
      runs: rows.slice(0, 10).map(({ runId, graphId, startedAt }) => ({
        runId,
        graphId,
        startedAt: startedAt.toISOString(),
      })),
    });
  }

  return rows.length;
}

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Get the most recent run for a graph, including an in-progress run.
 * Used by the scheduler to determine lastRunAt.
 */
export async function getLatestRun(graphId: string): Promise<{
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
} | null> {
  const rows = await db
    .select({
      id: pipelineRuns.id,
      startedAt: pipelineRuns.startedAt,
      finishedAt: pipelineRuns.finishedAt,
      status: pipelineRuns.status,
    })
    .from(pipelineRuns)
    .where(eq(pipelineRuns.graphId, graphId))
    .orderBy(desc(pipelineRuns.startedAt))
    .limit(1);

  return rows[0] ?? null;
}
