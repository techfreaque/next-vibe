/**
 * Venice.ai Provider
 * OpenAI-compatible endpoint that emulates tool calling via prompt engineering
 * (native tool calling unsupported for uncensored models). Token-billed, so the
 * streaming processor waits for usage. See the shared factory.
 */

import "server-only";

import type { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import { agentEnv } from "next-vibe/agent/env";
import { ApiProvider } from "next-vibe/agent/models/models";

import type { EndpointLogger } from "../../../logger/types";
import {
  createPromptEngineeredProvider,
  type JSONValue,
} from "./shared/openai-compatible-provider";

/**
 * Create a Venice.ai provider compatible with AI SDK V2
 */
export function createVeniceAI(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  return createPromptEngineeredProvider(logger, fetchImpl, {
    label: "Venice.ai",
    provider: ApiProvider.VENICE_AI,
    apiKey: agentEnv.VENICE_AI_API_KEY,
    logTag: "venice-ai",
    url: ({ path }) => `https://api.venice.ai/api/v1${path}`,
    waitForUsage: true, // token-based model
    extraBodyFields: (parsedBody): Record<string, JSONValue> => ({
      // Request usage data in streaming responses (omit the key otherwise, to
      // match the prior wire format where `undefined` was dropped by stringify).
      ...(parsedBody.stream ? { stream_options: { include_usage: true } } : {}),
      // Disable Venice.ai's own system prompt + web search — we bring our own tools.
      venice_parameters: {
        include_venice_system_prompt: false,
        enable_web_search: "off",
      },
    }),
  });
}
