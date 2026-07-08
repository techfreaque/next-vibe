import "server-only";

/**
 * Auto-Embed Hook
 * Fire-and-forget embedding after cortex write/edit operations.
 * Embeds path + content combined for better semantic search.
 * Skips redundant API calls via content hash comparison.
 * Optionally deducts credits for user-triggered operations.
 */
import { eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  rootlessStreamContext,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";

import { cortexNodes } from "../db";
import type { CortexCreditFeatureValue } from "../enum";
import { CortexCreditFeature } from "../enum";
import {
  computeEmbeddingHash,
  EMBEDDING_CREDIT_COST,
  generateEmbedding,
} from "./service";

/** Options for credit tracking on user-triggered embedding operations */
export interface EmbedOptions {
  /** Deduct credits for this embedding (user-triggered operations only) */
  billCredits?: boolean;
  /** User context for credit deduction */
  user?: JwtPayloadType;
  /** Locale for credit translation strings (only needed when billCredits) */
  locale?: CountryLanguage;
  /** Logger for credit deduction (only needed when billCredits) */
  logger?: EndpointLogger;
  /** Feature name for usage history */
  feature?: CortexCreditFeatureValue;
  /** Fixture chain of the triggering execution — binds the embedding call. */
  streamContext: ToolExecutionContext;
}

/**
 * Queue an embedding update for a cortex node.
 * Non-blocking: runs in background via setTimeout.
 * Safe to call on every write/edit - skips if content hash unchanged.
 */
export function queueEmbedding(
  nodeId: string,
  path: string,
  content: string,
  options?: EmbedOptions,
): void {
  // Fire and forget - don't block the response
  setTimeout(() => {
    void embedNode(nodeId, path, content, options);
  }, 0);
}

/**
 * Generate + store an embedding for a node and AWAIT completion.
 * Same logic as queueEmbedding, but synchronous — callers that must observe the
 * embedding (e.g. tests asserting relevance, or a backfill that needs to block)
 * use this instead of the fire-and-forget queue. Resolves true if an embedding
 * is present afterward (newly written or already current), false otherwise.
 */
export async function embedNodeNow(
  nodeId: string,
  path: string,
  content: string,
  options?: EmbedOptions,
): Promise<boolean> {
  await embedNode(nodeId, path, content, options);
  const [row] = await db
    .select({ embedding: cortexNodes.embedding })
    .from(cortexNodes)
    .where(eq(cortexNodes.id, nodeId))
    .limit(1);
  return row?.embedding !== null && row?.embedding !== undefined;
}

/**
 * Generate and store embedding for a cortex node.
 * Skips if content hash matches and embedding already exists.
 */
async function embedNode(
  nodeId: string,
  path: string,
  content: string,
  options?: EmbedOptions,
): Promise<void> {
  try {
    // Embed path + content combined - path tokens (e.g. "projects/auth/decision-log")
    // are high-signal for retrieval, especially for sparse or newly-created files.
    // Re-embedding on rename/move is now meaningful since path changes the text.
    const textToEmbed = `${path}\n\n${content}`;
    const newHash = computeEmbeddingHash(path, content);

    // Check if content hash matches - skip redundant API call
    const [existing] = await db
      .select({
        contentHash: cortexNodes.contentHash,
        hasEmbedding: cortexNodes.embedding,
      })
      .from(cortexNodes)
      .where(eq(cortexNodes.id, nodeId))
      .limit(1);

    if (existing?.contentHash === newHash && existing.hasEmbedding !== null) {
      return; // Content unchanged - skip
    }

    // Production callers always pass a streamContext (required in EmbedOptions);
    // the only option-less callers are standalone tests/maintenance with no
    // stream, which route live via an explicit thread-less root.
    const embedding = await generateEmbedding(
      textToEmbed,
      options?.streamContext ?? rootlessStreamContext(),
    );

    if (!embedding) {
      return; // API key missing or call failed - skip silently
    }

    await db
      .update(cortexNodes)
      .set({ embedding, contentHash: newHash })
      .where(eq(cortexNodes.id, nodeId));

    // Deduct credits for user-triggered operations
    if (
      options?.billCredits &&
      options.user &&
      options.locale &&
      options.logger
    ) {
      await deductEmbeddingCredits(options);
    }
  } catch (error) {
    // Best-effort - don't crash the server on embedding failures
    // eslint-disable-next-line no-console
    console.error(
      `[cortex-embed] Failed to embed node ${nodeId}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Deduct credits for an embedding API call.
 * Fire-and-forget - failures are logged but don't block.
 */
async function deductEmbeddingCredits(options: EmbedOptions): Promise<void> {
  try {
    const { CreditRepository } =
      await import("@/app/api/[locale]/credits/repository");
    const { scopedTranslation: creditsScopedTranslation } =
      await import("@/app/api/[locale]/credits/i18n");
    const { t: tCredits } = creditsScopedTranslation.scopedT(options.locale!);
    const { scopedTranslation: cortexScopedTranslation } =
      await import("@/app/api/[locale]/agent/cortex/i18n");
    const { t: tCortex } = cortexScopedTranslation.scopedT(options.locale!);
    const featureKey = options.feature ?? CortexCreditFeature.EMBEDDING;

    await CreditRepository.deductCreditsForFeature(
      options.user!,
      EMBEDDING_CREDIT_COST,
      tCortex(featureKey),
      options.logger!,
      tCredits,
      options.locale!,
    );
  } catch (error) {
    // Best-effort credit deduction - don't fail the embedding
    // eslint-disable-next-line no-console
    console.error(
      "[cortex-embed] Credit deduction failed:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
