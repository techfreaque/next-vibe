/**
 * Credit Updater
 * Utilities for updating credit balance after AI operations
 */

"use client";

import type { CreditsGetResponseOutput } from "@/app/api/[locale]/v1/core/credits/definition";
import creditsDefinition from "@/app/api/[locale]/v1/core/credits/definition";
import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-interface/react/hooks/store";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import { getModelById } from "./model-access/models";
import type { ModelId } from "./model-access/models";

/**
 * Update credit balance after AI response
 * Deducts credits in the correct order:
 * 1. Free credits (highest priority)
 * 2. Expiring credits (subscription)
 * 3. Permanent credits (lowest priority)
 */
export function updateCreditBalance(
  modelId: ModelId,
  logger: EndpointLogger,
): void {
  const modelConfig = getModelById(modelId);
  const creditCost = modelConfig.creditCost;

  if (creditCost <= 0 || !creditsDefinition.GET) {
    return;
  }

  // Update the credit balance using the built-in helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const endpoint = creditsDefinition.GET as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiClient.updateEndpointData(endpoint, (oldData: any) => {
    if (!oldData?.success) {
      return oldData;
    }

    const data = oldData.data as CreditsGetResponseOutput;

    // Deduct credits in the correct order: free → expiring → permanent
    let remaining = creditCost;
    let newFree = data.free;
    let newExpiring = data.expiring;
    let newPermanent = data.permanent;

    // Step 1: Deduct from free credits first
    if (remaining > 0 && newFree > 0) {
      const deduction = Math.min(newFree, remaining);
      newFree -= deduction;
      remaining -= deduction;
    }

    // Step 2: Deduct from expiring credits (subscription)
    if (remaining > 0 && newExpiring > 0) {
      const deduction = Math.min(newExpiring, remaining);
      newExpiring -= deduction;
      remaining -= deduction;
    }

    // Step 3: Deduct from permanent credits
    if (remaining > 0 && newPermanent > 0) {
      const deduction = Math.min(newPermanent, remaining);
      newPermanent -= deduction;
      remaining -= deduction;
    }

    return {
      success: true,
      data: {
        total: data.total - creditCost,
        expiring: newExpiring,
        permanent: newPermanent,
        free: newFree,
        expiresAt: data.expiresAt,
      },
    };
  });

  logger.debug("Credit balance updated in cache", {
    creditCost,
    model: modelId,
  });
}

/**
 * Create onContentDone callback for credit updates
 */
export function createCreditUpdateCallback(
  modelId: ModelId,
  logger: EndpointLogger,
): () => void {
  return () => updateCreditBalance(modelId, logger);
}
