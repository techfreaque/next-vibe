import "server-only";

/**
 * Cortex Embedding Backfill
 * Finds all cortex_nodes with NULL embeddings and generates them in batches.
 * Rate-limited to avoid API throttling.
 */

import { eq, isNull, and, notInArray } from "drizzle-orm";

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
 * Backfill embeddings for all cortex file nodes that have NULL embedding.
 * Tracks failed/skipped node IDs to avoid infinite re-processing.
 * Returns the number of nodes processed.
 */
export async function backfillEmbeddings(): Promise<{
  processed: number;
  failed: number;
  skipped: number;
}> {
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
      const textToEmbed = `${node.path}\n\n${node.content ?? ""}`;

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

      const contentHash = computeEmbeddingHash(node.path, node.content ?? "");

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
