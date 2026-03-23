/**
 * Vibe Sense - Datapoints Store
 *
 * Time-series read/write + retention cleanup.
 * Only persist: "always" and persist: "snapshot" nodes write here.
 */

import "server-only";

import { and, between, eq, lt, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { pipelineDatapoints, pipelineRetentionConfig } from "../db";
import type { DataPoint, TimeRange } from "../shared/fields";

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Write datapoints for a node.
 * Upserts by (nodeId, graphId, timestamp) to handle re-runs.
 *
 * @param options.skipZero - When true, filters out zero-valued points before writing.
 *   Use for sparse event indicators where zero means "no events" - gaps are implicit.
 *   Do NOT use for snapshot indicators where zero is meaningful (e.g. balance = 0).
 */
export async function writeDatapoints(
  nodeId: string,
  graphId: string | null,
  points: DataPoint[],
  options?: { skipZero?: boolean },
): Promise<void> {
  const toWrite =
    options?.skipZero === true ? points.filter((p) => p.value !== 0) : points;

  if (toWrite.length === 0) {
    return;
  }

  const rows = toWrite.map((p) => ({
    nodeId,
    graphId: graphId ?? null,
    timestamp: p.timestamp,
    value: String(p.value),
    meta: p.meta ?? null,
  }));

  // Insert in batches of 500, upsert on conflict to update values on re-runs
  const batchSize = 500;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await db
      .insert(pipelineDatapoints)
      .values(batch)
      .onConflictDoUpdate({
        target: [
          pipelineDatapoints.nodeId,
          pipelineDatapoints.graphId,
          pipelineDatapoints.timestamp,
        ],
        set: {
          value: sql`excluded.value`,
          meta: sql`excluded.meta`,
        },
      });
  }
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Read datapoints for a node within a time range.
 * Returns points sorted ascending by timestamp.
 */
export async function readDatapoints(
  nodeId: string,
  graphId: string | null,
  range: TimeRange,
): Promise<DataPoint[]> {
  const conditions = [
    eq(pipelineDatapoints.nodeId, nodeId),
    between(pipelineDatapoints.timestamp, range.from, range.to),
  ];

  if (graphId !== null) {
    conditions.push(eq(pipelineDatapoints.graphId, graphId));
  }

  const rows = await db
    .select()
    .from(pipelineDatapoints)
    .where(and(...conditions))
    .orderBy(pipelineDatapoints.timestamp);

  return rows.map((row) => ({
    timestamp: row.timestamp,
    value: parseFloat(row.value),
    meta: row.meta ?? undefined,
  }));
}

// ─── Retention ────────────────────────────────────────────────────────────────

/**
 * Upsert retention config for a node.
 */
export async function setRetentionConfig(
  nodeId: string,
  config: { maxRows?: number; maxAgeDays?: number },
): Promise<void> {
  await db
    .insert(pipelineRetentionConfig)
    .values({
      nodeId,
      maxRows: config.maxRows ?? null,
      maxAgeDays: config.maxAgeDays ?? null,
    })
    .onConflictDoUpdate({
      target: pipelineRetentionConfig.nodeId,
      set: {
        maxRows: config.maxRows ?? null,
        maxAgeDays: config.maxAgeDays ?? null,
        updatedAt: new Date(),
      },
    });
}

/**
 * Run retention cleanup for a specific node.
 * Applies both maxRows and maxAgeDays limits, whichever triggers first.
 * Called by the scheduled cleanup task.
 */
export async function runRetentionCleanup(
  nodeId: string,
  config: { maxRows?: number; maxAgeDays?: number },
): Promise<{ deletedRows: number }> {
  let deletedRows = 0;

  // Age-based cleanup
  if (config.maxAgeDays !== undefined && config.maxAgeDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - config.maxAgeDays);

    const result = await db
      .delete(pipelineDatapoints)
      .where(
        and(
          eq(pipelineDatapoints.nodeId, nodeId),
          lt(pipelineDatapoints.timestamp, cutoff),
        ),
      )
      .returning({ id: pipelineDatapoints.id });

    deletedRows += result.length;
  }

  // Row count-based cleanup - keep only the most recent maxRows rows
  if (config.maxRows !== undefined && config.maxRows > 0) {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(pipelineDatapoints)
      .where(eq(pipelineDatapoints.nodeId, nodeId));

    const currentCount = Number(countResult[0]?.count ?? 0);
    const excess = currentCount - config.maxRows;

    if (excess > 0) {
      // Bulk delete oldest rows beyond the limit using a subquery
      const result = await db.execute(sql`
        DELETE FROM pipeline_datapoints
        WHERE id IN (
          SELECT id FROM pipeline_datapoints
          WHERE node_id = ${nodeId}
          ORDER BY timestamp ASC
          LIMIT ${excess}
        )
      `);
      deletedRows += Number(result.rowCount ?? 0);
    }
  }

  return { deletedRows };
}

/**
 * Run retention cleanup for all nodes that have retention config.
 * Called by the nightly cleanup cron task.
 */
export async function runAllRetentionCleanup(): Promise<{
  nodesProcessed: number;
  totalDeleted: number;
}> {
  const configs = await db.select().from(pipelineRetentionConfig);
  let totalDeleted = 0;

  for (const config of configs) {
    const result = await runRetentionCleanup(config.nodeId, {
      maxRows: config.maxRows ?? undefined,
      maxAgeDays: config.maxAgeDays ?? undefined,
    });
    totalDeleted += result.deletedRows;
  }

  return { nodesProcessed: configs.length, totalDeleted };
}
