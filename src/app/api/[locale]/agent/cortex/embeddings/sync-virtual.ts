import "server-only";

/**
 * Sync Virtual Mount to Embedding
 * Upserts a cortex_nodes FILE row for virtual mount content (skills, threads, tasks)
 * so it gets an embedding and becomes searchable via vector search.
 * Uses content hashing to skip redundant embedding API calls.
 */

import { db } from "@/app/api/[locale]/system/db";

import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import { parseFrontmatter } from "../repository";

import { queueEmbedding } from "./auto-embed";
import { computeEmbeddingHash } from "./service";

/**
 * Upsert a cortex_nodes FILE row for virtual mount content and queue embedding.
 * Skips embedding if content hash matches and embedding already exists.
 * Uses ON CONFLICT to handle concurrent upserts safely.
 */
export async function syncVirtualNodeToEmbedding(
  userId: string,
  path: string,
  content: string,
): Promise<void> {
  const size = Buffer.byteLength(content, "utf8");
  const newHash = computeEmbeddingHash(path, content);
  const now = new Date();

  const [row] = await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content,
      size,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: { content, size, updatedAt: now },
    })
    .returning({
      id: cortexNodes.id,
      contentHash: cortexNodes.contentHash,
      embedding: cortexNodes.embedding,
    });

  if (!row) {
    return;
  }

  // Skip embedding if content hash matches and embedding already exists
  if (row.contentHash === newHash && row.embedding !== null) {
    return;
  }

  queueEmbedding(row.id, path, content);
}

/**
 * Upsert a cortex_nodes FILE row WITHOUT queueing an embedding.
 * Used during bulk seed to avoid stampeding the embedding API with hundreds
 * of simultaneous queueEmbedding() calls. The caller is responsible for
 * scheduling a backfill after materialization is complete.
 */
export async function upsertVirtualNode(
  userId: string,
  path: string,
  content: string,
): Promise<void> {
  const size = Buffer.byteLength(content, "utf8");
  const now = new Date();
  const { frontmatter } = parseFrontmatter(content);

  await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content,
      size,
      frontmatter,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: { content, size, frontmatter, updatedAt: now },
    });
}

/**
 * Sync a virtual node with a pre-computed embedding (from skill.ts files).
 * Skips the API call entirely - writes the cached embedding directly.
 * Skips the DB write entirely if hash already matches and embedding exists.
 * Uses ON CONFLICT to handle concurrent upserts safely.
 */
export async function syncVirtualNodeWithCachedEmbedding(
  userId: string,
  path: string,
  content: string,
  cachedHash: string,
  cachedEmbedding: number[],
): Promise<void> {
  const { eq, and } = await import("drizzle-orm");

  // Check if this node already has the correct embedding - skip if so
  const [existing] = await db
    .select({
      contentHash: cortexNodes.contentHash,
      embedding: cortexNodes.embedding,
    })
    .from(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)))
    .limit(1);

  if (existing?.contentHash === cachedHash && existing.embedding !== null) {
    return;
  }

  const size = Buffer.byteLength(content, "utf8");
  const now = new Date();

  // Upsert with embedding+hash - on conflict, update to latest cached values
  await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content,
      size,
      embedding: cachedEmbedding,
      contentHash: cachedHash,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: {
        content,
        size,
        embedding: cachedEmbedding,
        contentHash: cachedHash,
        updatedAt: now,
      },
    });
}

/**
 * Remove a virtual mount node from cortex_nodes (e.g. when a skill is deleted).
 */
export async function removeVirtualNode(
  userId: string,
  path: string,
): Promise<void> {
  const { and, eq } = await import("drizzle-orm");
  await db
    .delete(cortexNodes)
    .where(and(eq(cortexNodes.userId, userId), eq(cortexNodes.path, path)));
}
