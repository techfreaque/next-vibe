/**
 * Gab AI Provider
 * Hybrid approach: Custom URL handling + OpenAI SDK's message/tool/stream parsing
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import type { LanguageModelV2 } from "@ai-sdk/provider";
import { ModelId } from "../../chat/model-access/models";
import { env } from "@/config/env";

/**
 * Check if a model ID is a Gab AI model
 *
 * @param modelId - The model ID to check
 * @returns true if the model is from Gab AI
 */
export function isGabAIModel(modelId: ModelId): boolean {
  return modelId === ModelId.GAB_AI_ARYA;
}

/**
 * Create a Gab AI provider compatible with AI SDK V2
 * Uses OpenAI's internal implementation with custom URL configuration
 * This ensures we call the correct endpoint while reusing OpenAI's proven parsing logic
 *
 * @returns Provider object with chat() method
 */
export function createGabAI(): {
  chat: (modelId: string) => LanguageModelV2;
} {
  const apiKey = env.GAB_AI_API_KEY || "";

  return {
    chat: () => {
      // Use OpenAI's internal implementation with custom config
      // This gives us their message/tool/stream parsing logic for free
      // Gab AI uses "arya" as the model name
      return new OpenAIChatLanguageModel("arya", {
        provider: "gab-ai",
        headers: () => ({
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${apiKey}`,
        }),
        // Custom URL handler to ensure we call the correct Gab AI endpoint
        // The path will be "/chat/completions"
        url: ({ path }) => `https://gab.ai/v1${path}`,
      });
    },
  };
}
