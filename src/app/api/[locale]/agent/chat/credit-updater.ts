/**
 * Credit Updater
 * Utilities for updating credit balance after AI operations
 * @deprecated Use context's deductCredits instead
 */

"use client";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import {
  getCreditCostFromModel,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";

/**
 * Create onContentDone callback for credit updates
 * @deprecated This should be replaced with context's deductCredits
 * Keeping for backwards compatibility during migration
 */
export function createCreditUpdateCallback(
  modelId: ModelId,
  deductCredits: (creditCost: number, feature: string) => void,
): () => void {
  const modelConfig = getModelById(modelId);
  const creditCost = getCreditCostFromModel(modelConfig);

  return () => {
    if (creditCost > 0) {
      deductCredits(creditCost, `chat_message_${modelId}`);
    }
  };
}
