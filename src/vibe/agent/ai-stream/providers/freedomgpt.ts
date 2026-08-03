/**
 * FreedomGPT Provider
 * OpenAI-compatible endpoint that emulates tool calling via prompt engineering.
 * Streaming supported; fixed-cost model (no usage wait). See the shared factory.
 */

import "server-only";

import type { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import { agentEnv } from "../../env";

import type { EndpointLogger } from "next-vibe/logger/types";
import { createPromptEngineeredProvider } from "./shared/openai-compatible-provider";

/**
 * Create a FreedomGPT provider with tool calling support via prompt engineering
 */
export function createFreedomGPT(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  return createPromptEngineeredProvider(logger, fetchImpl, {
    label: "FreedomGPT",
    provider: "freedomgpt",
    apiKey: agentEnv.FREEDOMGPT_API_KEY,
    logTag: "freedomgpt",
    url: ({ path }) => `https://chat.freedomgpt.com/api/v1${path}`,
    waitForUsage: false, // fixed-cost model
  });
}
