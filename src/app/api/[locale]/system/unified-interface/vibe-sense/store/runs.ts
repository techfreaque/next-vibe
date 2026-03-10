/**
 * Vibe Sense — Execution Runs Store
 *
 * Tracks every scheduled and on-demand graph execution.
 * Answers "when did this graph last run? did it succeed?"
 */

import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { pipelineRuns } from "../db";

// ─── Types ───────────────────────────────────────────────────────────────────

export type RunStatus = "running" | "completed" | "failed";

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
      status: "running",
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
  status: "completed" | "failed",
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
    .where(eq(pipelineRuns.id, runId));
}

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Get the most recent completed run for a graph.
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

/**
 * List recent runs for a graph.
 */
export async function listRuns(
  graphId: string,
  limit = 20,
): Promise<
  Array<{
    id: string;
    startedAt: Date;
    finishedAt: Date | null;
    status: string;
    errorCount: number;
    nodeCount: number;
  }>
> {
  return db
    .select({
      id: pipelineRuns.id,
      startedAt: pipelineRuns.startedAt,
      finishedAt: pipelineRuns.finishedAt,
      status: pipelineRuns.status,
      errorCount: pipelineRuns.errorCount,
      nodeCount: pipelineRuns.nodeCount,
    })
    .from(pipelineRuns)
    .where(eq(pipelineRuns.graphId, graphId))
    .orderBy(desc(pipelineRuns.startedAt))
    .limit(limit);
}
