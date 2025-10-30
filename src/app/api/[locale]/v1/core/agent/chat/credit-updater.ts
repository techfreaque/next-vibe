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
    return {
      success: true,
      data: {
        total: data.total - creditCost,
        expiring: data.expiring,
        permanent: data.permanent,
        free: data.free,
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
