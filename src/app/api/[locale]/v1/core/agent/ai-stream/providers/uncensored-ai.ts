/**
 * Uncensored.ai Provider
 * Creates a custom AI provider for Uncensored.ai API
 */

import "server-only";

import { createOpenAI } from "@ai-sdk/openai";

/**
 * Check if a model ID is an Uncensored.ai model
 *
 * @param modelId - The model ID to check
 * @returns true if the model is from Uncensored.ai
 */
export function isUncensoredAIModel(modelId: string): boolean {
  // eslint-disable-next-line i18next/no-literal-string
  return modelId === "uncensored-lm" || modelId.startsWith("uncensored-");
}

/**
 * Configuration options for Uncensored.ai provider
 */
export interface UncensoredAIConfig {
  apiKey: string;
  baseURL?: string;
}

/**
 * Create an Uncensored.ai provider compatible with AI SDK
 * Uses the OpenAI-compatible interface since Uncensored.ai follows OpenAI API format
 *
 * @param config - Provider configuration
 * @returns Provider function that creates model instances
 */
export function createUncensoredAI(
  config: UncensoredAIConfig,
): (modelId: string) => ReturnType<ReturnType<typeof createOpenAI>["chat"]> {
  const {
    apiKey,
    baseURL = "https://mkstqjtsujvcaobdksxs.functions.supabase.co/functions/v1/chat-backup",
  } = config;

  // Use OpenAI provider with custom base URL for Uncensored.ai
  // This ensures full LanguageModel compatibility
  const provider = createOpenAI({
    apiKey,
    baseURL,
  });

  // Return a function that creates model instances
  return (modelId: string) => {
    // Use the chat method from OpenAI provider for full compatibility
    return provider.chat(modelId);
  };
}
