/**
 * Vibe Sense - Computation Cache
 *
 * DB (pipeline_snapshots) cache for on-demand computation.
 * First render pays computation cost; subsequent renders within TTL are instant.
 *
 * Cache key: SHA-256 of (nodeId + rangeFrom.toISO + rangeTo.toISO + resolution)
 */

import "server-only";

import { createHash } from "node:crypto";

import { eq, lt } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { pipelineSnapshots } from "../db";
import type { DataPoint, Resolution, TimeRange } from "../shared/fields";

// ─── Cache Key ────────────────────────────────────────────────────────────────

export function buildCacheKey(
  nodeId: string,
  range: TimeRange,
  resolution: Resolution,
): string {
  const raw = `${nodeId}|${range.from.toISOString()}|${range.to.toISOString()}|${resolution}`;
  return createHash("sha256").update(raw).digest("hex");
}

/** Default TTL for snapshot cache entries: 5 minutes */
const DEFAULT_SNAPSHOT_TTL_MS = 5 * 60 * 1000;

// ─── DB Snapshot Cache ────────────────────────────────────────────────────────

async function getFromDbCache(key: string): Promise<DataPoint[] | null> {
  const rows = await db
    .select()
    .from(pipelineSnapshots)
    .where(eq(pipelineSnapshots.cacheKey, key))
    .limit(1);

  const row = rows[0];
  if (!row) {
    return null;
  }
  if (row.expiresAt < new Date()) {
    // Expired - delete and return null
    await db
      .delete(pipelineSnapshots)
      .where(eq(pipelineSnapshots.cacheKey, key));
    return null;
  }

  return row.data.points.map((p) => ({
    timestamp: new Date(p.timestamp),
    value: p.value,
    meta: p.meta ?? undefined,
  }));
}

async function setInDbCache(
  nodeId: string,
  key: string,
  points: DataPoint[],
  ttlMs = DEFAULT_SNAPSHOT_TTL_MS,
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlMs);
  const data = {
    points: points.map((p) => ({
      timestamp: p.timestamp.toISOString(),
      value: p.value,
      meta: p.meta ?? undefined,
    })),
  };

  await db
    .insert(pipelineSnapshots)
    .values({ nodeId, cacheKey: key, data, expiresAt })
    .onConflictDoUpdate({
      target: pipelineSnapshots.cacheKey,
      set: { data, expiresAt },
    });
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get cached datapoints for a node+range+resolution.
 * Checks in-memory first, then DB snapshot cache.
 */
export async function getCached(
  nodeId: string,
  range: TimeRange,
  resolution: Resolution,
): Promise<DataPoint[] | null> {
  const key = buildCacheKey(nodeId, range, resolution);
  return getFromDbCache(key);
}

/**
 * Store datapoints in DB snapshot cache.
 */
export async function setCached(
  nodeId: string,
  range: TimeRange,
  resolution: Resolution,
  points: DataPoint[],
  ttlMs = DEFAULT_SNAPSHOT_TTL_MS,
): Promise<void> {
  const key = buildCacheKey(nodeId, range, resolution);
  await setInDbCache(nodeId, key, points, ttlMs);
}

/**
 * Invalidate all cached entries for a node.
 */
export async function invalidateNode(nodeId: string): Promise<void> {
  await db
    .delete(pipelineSnapshots)
    .where(eq(pipelineSnapshots.nodeId, nodeId));
}

/**
 * Evict all expired snapshot entries from DB.
 * Called by the nightly cleanup task.
 */
export async function evictExpiredSnapshots(): Promise<{ deleted: number }> {
  const result = await db
    .delete(pipelineSnapshots)
    .where(lt(pipelineSnapshots.expiresAt, new Date()))
    .returning({ id: pipelineSnapshots.id });

  return { deleted: result.length };
}
