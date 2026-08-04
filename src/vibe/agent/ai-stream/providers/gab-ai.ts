/**
 * Gab AI Provider
 * OpenAI-compatible endpoint that emulates tool calling via prompt engineering.
 * Streaming supported; fixed-cost model (no usage wait). See the shared factory.
 */

import "server-only";

import type { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { createPromptEngineeredProvider } from "./shared/openai-compatible-provider";

/**
 * Create a Gab AI provider with tool calling support via prompt engineering
 */
export function createGabAI(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  return createPromptEngineeredProvider(logger, fetchImpl, {
    label: "GabAI",
    provider: ApiProvider.GAB_AI,
    apiKey: agentEnv.GAB_AI_API_KEY,
    logTag: "gab-ai",
    url: ({ path }) => `https://gab.ai/v1${path}`,
    waitForUsage: false, // fixed-cost model
  });
}
