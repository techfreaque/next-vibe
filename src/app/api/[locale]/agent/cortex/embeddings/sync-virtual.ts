import "server-only";

/**
 * Sync Virtual Mount to Embedding
 * Upserts a cortex_nodes FILE row for virtual mount content (skills, threads, tasks)
 * so it gets an embedding and becomes searchable via vector search.
 * Uses content hashing to skip redundant embedding API calls.
 */
import { db } from "next-vibe/database";

import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import {
  isEmbeddableMount,
  isNativePath,
  parseFrontmatter,
} from "../repository";
import { queueEmbedding } from "./auto-embed";
import { computeEmbeddingHash } from "./service";

/**
 * Whether this path's content should be persisted in cortex_nodes.content.
 * Only NATIVE paths (/documents, /memories) own their content here; virtual
 * mounts resolve content live from their source table, so their index row
 * stores only the embedding + metadata (content stays NULL).
 */
function persistsContent(path: string): boolean {
  return isNativePath(path);
}

/**
 * Upsert a cortex_nodes FILE row for virtual mount content and queue embedding.
 * Skips embedding if content hash matches and embedding already exists.
 * Uses ON CONFLICT to handle concurrent upserts safely.
 *
 * Content is NOT persisted for virtual paths — only the embedding + metadata.
 * No-op for non-embeddable mounts (/ssh, /favorites).
 */
export async function syncVirtualNodeToEmbedding(
  userId: string,
  path: string,
  content: string,
): Promise<void> {
  // /ssh and /favorites are never embedded (live/volatile/sensitive).
  if (!isEmbeddableMount(path) && !isNativePath(path)) {
    return;
  }

  const size = Buffer.byteLength(content, "utf8");
  const newHash = computeEmbeddingHash(path, content);
  const now = new Date();
  const storedContent = persistsContent(path) ? content : null;

  const [row] = await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content: storedContent,
      size,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: { content: storedContent, size, updatedAt: now },
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

  // queueEmbedding takes content directly — no need for the column.
  queueEmbedding(row.id, path, content);
}

/**
 * Upsert a cortex_nodes FILE row WITHOUT queueing an embedding.
 * Used during bulk seed to avoid stampeding the embedding API with hundreds
 * of simultaneous queueEmbedding() calls. The caller is responsible for
 * scheduling a backfill after materialization is complete.
 *
 * Content is NOT persisted for virtual paths (resolved live from source);
 * only frontmatter/size metadata is kept on the index row.
 */
export async function upsertVirtualNode(
  userId: string,
  path: string,
  content: string,
): Promise<void> {
  // /ssh and /favorites are never materialized/embedded.
  if (!isEmbeddableMount(path) && !isNativePath(path)) {
    return;
  }

  const size = Buffer.byteLength(content, "utf8");
  const now = new Date();
  const { frontmatter } = parseFrontmatter(content);
  const storedContent = persistsContent(path) ? content : null;

  await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content: storedContent,
      size,
      frontmatter,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: { content: storedContent, size, frontmatter, updatedAt: now },
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
  // /ssh and /favorites are never embedded.
  if (!isEmbeddableMount(path) && !isNativePath(path)) {
    return;
  }

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
  const storedContent = persistsContent(path) ? content : null;

  // Upsert with embedding+hash - on conflict, update to latest cached values
  await db
    .insert(cortexNodes)
    .values({
      userId,
      path,
      nodeType: CortexNodeType.FILE,
      content: storedContent,
      size,
      embedding: cachedEmbedding,
      contentHash: cachedHash,
    })
    .onConflictDoUpdate({
      target: [cortexNodes.userId, cortexNodes.path],
      set: {
        content: storedContent,
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

/**
 * Remove all materialized cortex_nodes index rows for a source entity, matching
 * by id substring in the path. Used when a source row (thread, upload, search,
 * gen) is deleted: the materialized path embeds the entity id
 * (e.g. /threads/<root>/<slug>-<id>.md, /uploads/<type>/<thread>/<id>-<name>),
 * and slugs derived from titles drift over time — so we match on the stable id,
 * never reconstruct the slug.
 *
 * Returns the number of index rows removed.
 */
export async function removeVirtualNodesByEntityId(
  userId: string,
  mountPrefix: string,
  entityId: string,
): Promise<number> {
  const { and, eq, like } = await import("drizzle-orm");
  // Escape LIKE wildcards in the id (uuids contain none, but be safe).
  const safeId = entityId.replace(/([%_\\])/g, "\\$1");
  const rows = await db
    .delete(cortexNodes)
    .where(
      and(
        eq(cortexNodes.userId, userId),
        like(cortexNodes.path, `${mountPrefix}/%${safeId}%`),
      ),
    )
    .returning({ id: cortexNodes.id });
  return rows.length;
}
