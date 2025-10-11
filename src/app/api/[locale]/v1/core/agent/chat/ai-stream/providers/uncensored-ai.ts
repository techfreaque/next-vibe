/**
 * Uncensored.ai Model Detection
 */

import "server-only";

/**
 * Check if a model ID is an Uncensored.ai model
 *
 * @param modelId - The model ID to check
 * @returns true if the model is from Uncensored.ai
 */
export function isUncensoredAIModel(modelId: string): boolean {
  return modelId === "uncensored-lm" || modelId.startsWith("uncensored-");
}

