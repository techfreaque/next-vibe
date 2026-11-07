/**
 * NanoGPT Provider
 * OpenAI-compatible aggregator (https://api.nano-gpt.com/api/v1) serving
 * uncensored / abliterated open-weight models (GLM 5.3, DeepSeek V4.1, …).
 * Native tool calling + streamed usage are supported upstream, so unlike the
 * prompt-engineered providers (Venice, Gab, FreedomGPT) the request passes
 * through untouched — the AI SDK already sends stream_options.include_usage.
 */

import "server-only";

import { OpenAIChatLanguageModel } from "@ai-sdk/openai/internal";
import type { EndpointLogger } from "next-vibe/logger/types";

import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { logProviderRequest } from "./shared/debug-file-logger";

const NANO_GPT_BASE_URL = "https://api.nano-gpt.com/api/v1";

/**
 * Create a NanoGPT provider compatible with AI SDK V2
 */
export function createNanoGPT(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
): {
  chat: (modelId: string) => OpenAIChatLanguageModel;
} {
  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (typeof init?.body === "string") {
      logProviderRequest("nano-gpt", init.body);
    }
    const response = await fetchImpl(input, init);
    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[NanoGPT] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return new Response(errorText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }
    return response;
  };

  return {
    chat: (modelId: string): OpenAIChatLanguageModel =>
      new OpenAIChatLanguageModel(modelId, {
        provider: ApiProvider.NANO_GPT,
        headers: (): Record<string, string> => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.NANO_GPT_API_KEY}`,
        }),
        url: ({ path }) => `${NANO_GPT_BASE_URL}${path}`,
        fetch: customFetch as typeof fetch,
      }),
  };
}
