import "server-only";

/**
 * Cortex Embedding Backfill
 * Step 1: Materialize virtual mounts (threads, skills, searches, gens, uploads, tasks) into cortexNodes.
 * Step 2: Find all cortex_nodes with NULL embeddings and generate them in batches.
 * Rate-limited to avoid API throttling.
 */
import { and, eq, isNotNull, isNull, notInArray, sql } from "drizzle-orm";

import { db } from "@/app/api/[locale]/system/db";

import { cortexNodes } from "../db";
import { CortexNodeType } from "../enum";
import { computeEmbeddingHash, generateEmbedding } from "./service";

/** Process N nodes per batch, with a delay between batches */
const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 6000; // ~100 nodes per minute
const MAX_BATCHES = 1000; // Safety limit: 10,000 nodes max per run

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Resolve the text to embed for a node. Native paths (/documents, /memories)
 * carry their content in the column. Virtual mounts store NULL content — their
 * content is re-derived live from the source table via the resolver so the
 * cortex_nodes row stays a pure index (no duplicated content).
 *
 * Returns "" when content cannot be resolved (skips embedding for this node).
 */
async function resolveNodeContentForEmbedding(
  userId: string,
  path: string,
  storedContent: string | null,
): Promise<string> {
  const { isNativePath, getMountPrefix } = await import("../repository");
  const { defaultLocale } = await import("@/i18n/core/config");
  if (isNativePath(path, defaultLocale)) {
    return storedContent ?? "";
  }
  // Virtual mounts use canonical English prefixes — locale only matters for
  // native locale-aware paths, already handled above.
  const mountPrefix = getMountPrefix(path, defaultLocale);
  if (mountPrefix === null) {
    return storedContent ?? "";
  }
  const { resolveVirtualRead } = await import("../mounts/resolver");
  // Backfill runs without a request admin context; /ssh is never materialized,
  // so isAdmin=false is safe here.
  const result = await resolveVirtualRead(
    userId,
    path,
    mountPrefix,
    false,
    defaultLocale,
  ).catch(() => null);
  return result?.content ?? "";
}

/**
 * Get all distinct user IDs that have any cortex or chat content.
 * Used by materialization to know which users to process.
 */
async function getAllUserIds(): Promise<string[]> {
  // Users with cortex nodes
  const cortexUsers = await db
    .selectDistinct({ userId: cortexNodes.userId })
    .from(cortexNodes);

  // Users with chat threads (for thread/search/gen/upload mounts)
  const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
  const threadUsers = await db
    .selectDistinct({ userId: chatThreads.userId })
    .from(chatThreads);

  // Users with custom skills
  const { customSkills } = await import("@/app/api/[locale]/agent/skills/db");
  const skillUsers = await db
    .selectDistinct({ userId: customSkills.userId })
    .from(customSkills)
    .where(sql`${customSkills.userId} IS NOT NULL`);

  const allIds = new Set<string>();
  for (const r of [...cortexUsers, ...threadUsers, ...skillUsers]) {
    if (r.userId) {
      allIds.add(r.userId);
    }
  }
  return [...allIds];
}

/**
 * Materialize all virtual mount content for a user into cortexNodes rows.
 * This is a prerequisite for embedding: nodes must exist before they can be embedded.
 * Uses upsertVirtualNode (no embedding API call) - embedding backfill picks them up next.
 * Returns count of nodes upserted.
 */
async function materializeVirtualMounts(userId: string): Promise<number> {
  const { upsertVirtualNode } = await import("./sync-virtual");
  const { readSearchPath, listSearchPath } = await import("../mounts/searches");
  const { readGenPath, listGenPath } = await import("../mounts/gens");
  const { readUploadPath, listUploadPath } = await import("../mounts/uploads");
  const { readTaskPath, listTaskPath } = await import("../mounts/tasks");
  const { listSkillPath, readSkillPath } = await import("../mounts/skills");

  let upserted = 0;

  // Helper to upsert a file path via its read function
  const upsertPath = async (
    path: string,
    readFn: (uid: string, p: string) => Promise<{ content: string } | null>,
  ): Promise<void> => {
    const result = await readFn(userId, path).catch(() => null);
    if (result?.content) {
      await upsertVirtualNode(userId, path, result.content).catch(
        () => undefined,
      );
      upserted++;
    }
  };

  // --- Threads (thin references - title + tags + preview only) ---
  {
    const { chatThreads } = await import("@/app/api/[locale]/agent/chat/db");
    const { desc } = await import("drizzle-orm");
    const { buildThinThreadContent } =
      await import("@/app/api/[locale]/agent/ai-stream/repository/core/message-db-writer");

    const recentThreads = await db
      .select({
        id: chatThreads.id,
        userId: chatThreads.userId,
        title: chatThreads.title,
        rootFolderId: chatThreads.rootFolderId,
        tags: chatThreads.tags,
        preview: chatThreads.preview,
      })
      .from(chatThreads)
      .where(eq(chatThreads.userId, userId))
      .orderBy(desc(chatThreads.updatedAt))
      .limit(200);

    for (const thread of recentThreads) {
      const content = buildThinThreadContent(thread);
      const slug = (thread.title ?? "thread")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .slice(0, 50);
      await upsertVirtualNode(
        userId,
        `/threads/${thread.rootFolderId}/${slug}-${thread.id}.md`,
        content,
      ).catch(() => undefined);
      upserted++;
    }
  }

  // --- Skills ---
  const skillRoot = await listSkillPath(userId, "/skills").catch(() => []);
  for (const skill of skillRoot) {
    if (skill.nodeType === "file") {
      await upsertPath(skill.path, readSkillPath);
    }
  }

  // --- Searches ---
  const searchMonths = await listSearchPath(userId, "/searches").catch(
    () => [],
  );
  for (const month of searchMonths) {
    const files = await listSearchPath(userId, month.path).catch(() => []);
    for (const file of files) {
      await upsertPath(file.path, readSearchPath);
    }
  }

  // --- Gens ---
  const genTypes = await listGenPath(userId, "/gens").catch(() => []);
  for (const typeDir of genTypes) {
    const months = await listGenPath(userId, typeDir.path).catch(() => []);
    for (const month of months) {
      const files = await listGenPath(userId, month.path).catch(() => []);
      for (const file of files) {
        await upsertPath(file.path, readGenPath);
      }
    }
  }

  // --- Uploads ---
  const uploadTypes = await listUploadPath(userId, "/uploads").catch(() => []);
  for (const typeDir of uploadTypes) {
    const threads = await listUploadPath(userId, typeDir.path).catch(() => []);
    for (const thread of threads) {
      const files = await listUploadPath(userId, thread.path).catch(() => []);
      for (const file of files) {
        await upsertPath(file.path, readUploadPath);
      }
    }
  }

  // --- Tasks ---
  const tasks = await listTaskPath(userId, "/tasks").catch(() => []);
  for (const task of tasks) {
    await upsertPath(task.path, readTaskPath);
  }

  return upserted;
}

/**
 * Reclaim duplicated content from virtual-mount index rows.
 *
 * cortex_nodes is an embedding/search INDEX: virtual mounts resolve content
 * live from their source table, so their rows must not persist content. Older
 * rows materialized before this rule still carry a content copy — NULL it out
 * (and zero size) for every non-native path. Idempotent: rows already NULL are
 * skipped by the WHERE clause. Embeddings/hashes are untouched (the embedding
 * was already computed; nulling the stored column does not invalidate it).
 *
 * Returns the number of rows cleaned.
 */
async function reclaimVirtualMountContent(): Promise<number> {
  const cleared = await db
    .update(cortexNodes)
    .set({ content: null, size: 0 })
    .where(
      and(
        isNotNull(cortexNodes.content),
        sql`${cortexNodes.path} NOT LIKE '/documents/%'`,
        sql`${cortexNodes.path} NOT LIKE '/documents'`,
        sql`${cortexNodes.path} NOT LIKE '/memories/%'`,
        sql`${cortexNodes.path} NOT LIKE '/memories'`,
      ),
    )
    .returning({ id: cortexNodes.id });
  return cleared.length;
}

/**
 * Materialize virtual mounts for all users.
 * Step 1 of backfill - populates cortexNodes rows without embeddings.
 * Fast: only DB reads + upserts, no embedding API calls.
 */
export async function materializeAllVirtualMounts(): Promise<number> {
  // One-time idempotent reclaim of any content duplicated onto virtual index
  // rows by older materialization runs (cortex = index, source owns content).
  const reclaimed = await reclaimVirtualMountContent().catch(() => 0);
  if (reclaimed > 0) {
    // eslint-disable-next-line no-console
    console.log(
      `[cortex-backfill] Reclaimed content from ${reclaimed} virtual index rows`,
    );
  }

  const userIds = await getAllUserIds();
  // eslint-disable-next-line no-console
  console.log(
    `[cortex-backfill] Materializing virtual mounts for ${userIds.length} users...`,
  );
  let total = 0;
  for (const userId of userIds) {
    const count = await materializeVirtualMounts(userId).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(
        `[cortex-backfill] Materialization failed for user ${userId}:`,
        err,
      );
      return 0;
    });
    total += count;
  }
  // eslint-disable-next-line no-console
  console.log(`[cortex-backfill] Materialized ${total} virtual nodes`);
  return total;
}

/**
 * Backfill embeddings for all cortex file nodes that have NULL embedding.
 * When force=true, clears all existing embeddings first (use after format change).
 * Tracks failed/skipped node IDs to avoid infinite re-processing.
 * Returns the number of nodes processed.
 */
export async function backfillEmbeddings(force = false): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
  // Force mode: clear all existing embeddings so they get regenerated
  if (force) {
    // eslint-disable-next-line no-console
    console.log("[cortex-backfill] Force mode: clearing all embeddings...");
    const cleared = await db
      .update(cortexNodes)
      .set({ embedding: null, contentHash: null })
      .where(
        and(
          eq(cortexNodes.nodeType, CortexNodeType.FILE),
          isNotNull(cortexNodes.embedding),
        ),
      )
      .returning({ id: cortexNodes.id });
    // eslint-disable-next-line no-console
    console.log(`[cortex-backfill] Cleared ${cleared.length} embeddings`);
  }

  let processed = 0;
  let failed = 0;
  let skipped = 0;
  let batchCount = 0;

  // Track IDs that failed or were skipped so we don't re-fetch them
  const excludeIds: string[] = [];

  while (batchCount < MAX_BATCHES) {
    batchCount++;

    // Fetch next batch of nodes without embeddings, excluding already-failed ones
    const whereConditions = [
      eq(cortexNodes.nodeType, CortexNodeType.FILE),
      isNull(cortexNodes.embedding),
    ];

    if (excludeIds.length > 0) {
      whereConditions.push(notInArray(cortexNodes.id, excludeIds));
    }

    const batch = await db
      .select({
        id: cortexNodes.id,
        userId: cortexNodes.userId,
        path: cortexNodes.path,
        content: cortexNodes.content,
      })
      .from(cortexNodes)
      .where(and(...whereConditions))
      .limit(BATCH_SIZE);

    if (batch.length === 0) {
      break;
    }

    for (const node of batch) {
      // Embed content only - path is for filtering/display, not semantic match.
      // Native paths keep content in the column; virtual mounts store NULL
      // content, so re-derive it live from the source table at embed time.
      const textToEmbed = await resolveNodeContentForEmbedding(
        node.userId,
        node.path,
        node.content,
      );

      if (textToEmbed.trim().length === 0) {
        skipped++;
        excludeIds.push(node.id);
        continue;
      }

      const embedding = await generateEmbedding(textToEmbed);

      if (!embedding) {
        failed++;
        excludeIds.push(node.id);
        continue;
      }

      const contentHash = computeEmbeddingHash(node.path, textToEmbed);

      await db
        .update(cortexNodes)
        .set({ embedding, contentHash })
        .where(eq(cortexNodes.id, node.id));

      processed++;
    }

    // eslint-disable-next-line no-console
    console.log(
      `[cortex-backfill] Batch ${batchCount}: ${processed} embedded, ${failed} failed, ${skipped} skipped`,
    );

    // Rate limit between batches
    if (batch.length === BATCH_SIZE) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  if (batchCount >= MAX_BATCHES) {
    // eslint-disable-next-line no-console
    console.warn(
      `[cortex-backfill] Hit safety limit of ${MAX_BATCHES} batches. Remaining nodes need another run.`,
    );
  }

  // eslint-disable-next-line no-console
  console.log(
    `[cortex-backfill] Done: ${processed} embedded, ${failed} failed, ${skipped} skipped`,
  );

  return { processed, failed, skipped };
}
