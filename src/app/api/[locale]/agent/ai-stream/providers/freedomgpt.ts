/**
 * FreedomGPT Provider
 * Hybrid approach: Custom URL handling + OpenAI SDK's message/tool/stream parsing
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import type { LanguageModelV2 } from "@ai-sdk/provider";
import { ModelId } from "../../chat/model-access/models";
import { env } from "@/config/env";

/**
 * Check if a model ID is a FreedomGPT model
 *
 * @param modelId - The model ID to check
 * @returns true if the model is from FreedomGPT
 */
export function isFreedomGPTModel(modelId: ModelId): boolean {
  return modelId === ModelId.FREEDOMGPT_LIBERTY;
}

/**
 * Create a FreedomGPT provider compatible with AI SDK V2
 * Uses OpenAI's internal implementation with custom URL configuration
 * This ensures we call the correct endpoint while reusing OpenAI's proven parsing logic
 *
 * @returns Provider object with chat() method
 */
export function createFreedomGPT(): {
  chat: (modelId: string) => LanguageModelV2;
} {
  const apiKey = env.FREEDOMGPT_API_KEY;

  return {
    chat: (_modelId: string) => {
      // Use OpenAI's internal implementation with custom config
      // This gives us their message/tool/stream parsing logic for free
      // FreedomGPT uses "liberty" as the model name
      return new OpenAIChatLanguageModel("liberty", {
        provider: "freedomgpt",
        headers: () => ({
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        // Custom URL handler to ensure we call the correct FreedomGPT endpoint
        // The path will be "/chat/completions"
        url: ({ path }) => `https://chat.freedomgpt.com/api/v1${path}`,
      });
    },
  };
}
