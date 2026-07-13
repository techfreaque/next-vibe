/**
 * Vibe Sense - Computation Cache
 *
 * DB (pipeline_snapshots) cache for on-demand computation. Expired entries are
 * evicted by the nightly cleanup task.
 */

import "server-only";

import { lt } from "drizzle-orm";
import { db } from "next-vibe/database";

import { pipelineSnapshots } from "../db";

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
