/**
 * NanoGPT Provider
 * OpenAI-compatible aggregator (https://api.nano-gpt.com/api/v1) serving
 * uncensored / abliterated open-weight models (GLM 5.3, DeepSeek V4.1, …).
 * Native tool calling + streamed usage are supported upstream, so unlike the
 * prompt-engineered providers (Venice, Gab, FreedomGPT) the request passes
 * through untouched.
 *
 * Uses the OpenAI-compatible chat model (not OpenAI's): NanoGPT models are
 * reasoning models that stream a `reasoning` / `reasoning_content` delta
 * before `content`. Only the compatible model surfaces those as
 * reasoning-delta parts (OpenAI's chat model drops them), and it does not run
 * OpenAI's strict-schema normalisation that strips JSON Schema `propertyNames`
 * from tool schemas. No max output tokens is sent (the loop never sets one),
 * so reasoning cannot starve the final content on our side.
 */

import "server-only";

import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
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
  chat: (modelId: string) => OpenAICompatibleChatLanguageModel;
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
    chat: (modelId: string): OpenAICompatibleChatLanguageModel =>
      new OpenAICompatibleChatLanguageModel(modelId, {
        provider: ApiProvider.NANO_GPT,
        headers: (): Record<string, string> => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.NANO_GPT_API_KEY}`,
        }),
        includeUsage: true,
        url: ({ path }) => `${NANO_GPT_BASE_URL}${path}`,
        fetch: customFetch as typeof fetch,
      }),
  };
}
