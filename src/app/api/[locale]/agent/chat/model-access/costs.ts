/**
 * Model Cost Configuration
 * Reads credit costs from model configuration
 */

import { getModelById, type ModelId, modelOptions } from "./models";

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

/**
 * Check if a model is free (0 credits)
 * @param modelId - The model ID
 * @returns True if model costs 0 credits
 */
export function isModelFree(modelId: ModelId): boolean {
  return getModelCost(modelId) === 0;
}

/**
 * Get all free models
 * @returns Array of free model IDs
 */
export function getFreeModels(): ModelId[] {
  return Object.values(modelOptions)
    .filter((model) => model.creditCost === 0)
    .map((model) => model.id);
}

/**
 * Get models by cost tier
 * @param cost - Credit cost (0, 1, 2, 5, etc.)
 * @returns Array of model IDs with that cost
 */
export function getModelsByCost(cost: number): ModelId[] {
  return Object.values(modelOptions)
    .filter((model) => model.creditCost === cost)
    .map((model) => model.id);
}

/**
 * Get all model costs as a map
 * Useful for displaying costs in UI
 */
export function getAllModelCosts(): Record<string, number> {
  const costs: Record<string, number> = {};
  for (const model of Object.values(modelOptions)) {
    costs[model.id] = model.creditCost;
  }
  return costs;
}

/**
 * Calculate total cost for multiple messages
 * @param modelId - The model ID
 * @param messageCount - Number of messages
 * @returns Total credit cost
 */
export function calculateTotalCost(modelId: ModelId, messageCount: number): number {
  return getModelCost(modelId) * messageCount;
}

/**
 * Calculate how many messages can be sent with given credits
 * @param modelId - The model ID
 * @param credits - Available credits
 * @returns Number of messages that can be sent
 */
export function calculateMessageCount(modelId: ModelId, credits: number): number {
  const cost = getModelCost(modelId);
  if (cost === 0) {
    return Infinity;
  } // Free models
  return Math.floor(credits / cost);
}
