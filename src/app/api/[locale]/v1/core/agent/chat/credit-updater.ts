/**
 * Credit Updater
 * Utilities for updating credit balance after AI operations
 */

"use client";

import creditsDefinition from "@/app/api/[locale]/v1/core/credits/definition";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import { apiClient } from "@/app/api/[locale]/v1/core/system/unified-ui/react/hooks/store";

import type { ModelId } from "./model-access/models";
import { getModelById } from "./model-access/models";

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
  apiClient.updateEndpointData(creditsDefinition.GET, (oldData) => {
    if (!oldData?.data) {
      return oldData;
    }

    return {
      ...oldData,
      data: {
        ...oldData.data,
        total: oldData.data.total - creditCost,
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
