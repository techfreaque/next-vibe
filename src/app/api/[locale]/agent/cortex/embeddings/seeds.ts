import "server-only";

import { parseError } from "next-vibe/core/utils/parse-error";
import { formatDatabase } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";

export const priority = 10; // low — runs after core data seeds

const KV_EMBEDDING_MODEL = "embedding_model";

/**
 * Read the stored embedding model from platform_kv.
 * Returns null if the key doesn't exist yet.
 */
async function getStoredModel(): Promise<string | null> {
  const { db } = await import("next-vibe/database");
  const { eq } = await import("drizzle-orm");
  const { platformKv } = await import("../db");
  const [row] = await db
    .select({ value: platformKv.value })
    .from(platformKv)
    .where(eq(platformKv.key, KV_EMBEDDING_MODEL))
    .limit(1);
  return row?.value ?? null;
}

/**
 * Persist the current embedding model to platform_kv.
 */
async function setStoredModel(model: string): Promise<void> {
  const { db } = await import("next-vibe/database");
  const { platformKv } = await import("../db");
  await db
    .insert(platformKv)
    .values({ key: KV_EMBEDDING_MODEL, value: model })
    .onConflictDoUpdate({
      target: platformKv.key,
      set: { value: model, updatedAt: new Date() },
    });
}

/**
 * Fire-and-forget embedding backfill on startup.
 * If the stored embedding model differs from EMBEDDING_MODEL, all existing
 * embeddings are cleared first so the backfill re-embeds at platform cost
 * (no user credit deduction). Otherwise only missing embeddings are filled.
 */
function runBackfill(logger: EndpointLogger): void {
  void import("./service").then(({ EMBEDDING_MODEL }) =>
    getStoredModel()
      .then((stored) => {
        const modelChanged = stored !== null && stored !== EMBEDDING_MODEL;
        if (modelChanged) {
          logger.info(
            "[cortex] embedding model changed — clearing all embeddings",
            {
              from: stored,
              to: EMBEDDING_MODEL,
            },
          );
        }
        return import("./backfill").then(
          ({ backfillEmbeddings, backfillMessageEmbeddings }) =>
            Promise.all([
              backfillEmbeddings(modelChanged),
              backfillMessageEmbeddings(modelChanged),
            ]).then(([nodes, messages]) => {
              const total = nodes.processed + messages.processed;
              if (total > 0 || modelChanged) {
                logger.info(
                  formatDatabase(
                    `Embeddings: ${total} indexed${modelChanged ? " (model changed)" : ""}`,
                    "🔍",
                  ),
                );
              }
              return setStoredModel(EMBEDDING_MODEL);
            }),
        );
      })
      .catch((err: Error) => {
        logger.warn("[cortex] embedding backfill failed", parseError(err));
      }),
  );
}

export function dev(logger: EndpointLogger): void {
  runBackfill(logger);
}

export function prod(logger: EndpointLogger): void {
  runBackfill(logger);
}

export function test(): void {
  // no-op: tests use fixture embeddings, never live API
}
