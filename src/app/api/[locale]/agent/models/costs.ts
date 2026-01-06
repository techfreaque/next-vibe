/**
 * Model Cost Configuration
 * Reads credit costs from model configuration
 */

import { getModelById, type ModelId } from "./models";

/**
 * Get credit cost for a specific model
 * Reads from model configuration
 * @param modelId - The model identifier
 * @returns Credit cost (defaults to 1 if model not found)
 */
export function getModelCost(modelId: ModelId | string): number {
  try {
    const model = getModelById(modelId as ModelId);
    return model.creditCost;
  } catch {
    // Fallback to 1 credit if model not found
    return 1;
  }
}
