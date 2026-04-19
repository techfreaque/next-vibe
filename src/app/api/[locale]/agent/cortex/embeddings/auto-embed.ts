import "server-only";

/**
 * Auto-Embed Hook
 * Fire-and-forget embedding after cortex write/edit operations.
 * Embeds path + content combined for better semantic search.
 * Skips redundant API calls via content hash comparison.
 * Optionally deducts credits for user-triggered operations.
 */

import { eq } from "drizzle-orm";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { db } from "@/app/api/[locale]/system/db";

import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import { cortexNodes } from "../db";
import { CortexCreditFeature } from "../enum";
import type { CortexCreditFeatureValue } from "../enum";

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
  /** Locale for credit translation strings */
  locale?: CountryLanguage;
  /** Logger for credit deduction */
  logger?: EndpointLogger;
  /** Feature name for usage history */
  feature?: CortexCreditFeatureValue;
}

/**
 * Queue an embedding update for a cortex node.
 * Non-blocking: runs in background via setTimeout.
 * Safe to call on every write/edit — skips if content hash unchanged.
 */
export function queueEmbedding(
  nodeId: string,
  path: string,
  content: string,
  options?: EmbedOptions,
): void {
  // Fire and forget — don't block the response
  setTimeout(() => {
    void embedNode(nodeId, path, content, options);
  }, 0);
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
    const textToEmbed = `${path}\n\n${content}`;
    const newHash = computeEmbeddingHash(path, content);

    // Check if content hash matches — skip redundant API call
    const [existing] = await db
      .select({
        contentHash: cortexNodes.contentHash,
        hasEmbedding: cortexNodes.embedding,
      })
      .from(cortexNodes)
      .where(eq(cortexNodes.id, nodeId))
      .limit(1);

    if (existing?.contentHash === newHash && existing.hasEmbedding !== null) {
      return; // Content unchanged — skip
    }

    const embedding = await generateEmbedding(textToEmbed);

    if (!embedding) {
      return; // API key missing or call failed — skip silently
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
    // Best-effort — don't crash the server on embedding failures
    // eslint-disable-next-line no-console
    console.error(
      `[cortex-embed] Failed to embed node ${nodeId}:`,
      error instanceof Error ? error.message : String(error),
    );
  }
}

/**
 * Deduct credits for an embedding API call.
 * Fire-and-forget — failures are logged but don't block.
 */
async function deductEmbeddingCredits(options: EmbedOptions): Promise<void> {
  try {
    const { CreditRepository } =
      await import("@/app/api/[locale]/credits/repository");
    const { scopedTranslation: creditsScopedTranslation } =
      await import("@/app/api/[locale]/credits/i18n");
    const { t: tCredits } = creditsScopedTranslation.scopedT(options.locale!);

    await CreditRepository.deductCreditsForFeature(
      options.user!,
      EMBEDDING_CREDIT_COST,
      options.feature ?? CortexCreditFeature.EMBEDDING,
      options.logger!,
      tCredits,
      options.locale!,
    );
  } catch (error) {
    // Best-effort credit deduction — don't fail the embedding
    // eslint-disable-next-line no-console
    console.error(
      "[cortex-embed] Credit deduction failed:",
      error instanceof Error ? error.message : String(error),
    );
  }
}
