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
import { nanoGptCostExtractor } from "./shared/upstream-cost";
import {
  summarizeUpstreamError,
  upstreamErrorResponse,
} from "./shared/upstream-error";

const NANO_GPT_BASE_URL = "https://api.nano-gpt.com/api/v1";

/** The `model` field of an OpenAI-style JSON request body, if readable. */
function requestModelOf(body: BodyInit | null | undefined): string | undefined {
  if (typeof body !== "string") {
    return undefined;
  }
  const match = /"model"\s*:\s*"([^"]+)"/.exec(body);
  return match?.[1];
}

/**
 * Which optional features a request carried (no content): tools, images,
 * output cap, reasoning knobs, size. Enough to bisect a bare 400.
 */
function describeRequestShape(
  body: BodyInit | null | undefined,
): Record<string, string | number | boolean> | null {
  if (typeof body !== "string") {
    return null;
  }
  const maxTokens = /"max_(?:completion_)?tokens"\s*:\s*(\d+)/.exec(body);
  return {
    chars: body.length,
    messages: (body.match(/"role"\s*:/g) ?? []).length,
    tools: (body.match(/"type"\s*:\s*"function"/g) ?? []).length,
    toolMessages: (body.match(/"role"\s*:\s*"tool"/g) ?? []).length,
    images: (body.match(/"type"\s*:\s*"image_url"/g) ?? []).length,
    maxTokens: maxTokens ? Number(maxTokens[1]) : "none",
    toolChoice: /"tool_choice"/.test(body),
    reasoning: /"reasoning(?:_effort)?"\s*:/.test(body),
    temperature: /"temperature"\s*:/.test(body),
  };
}

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
      const upstreamError = summarizeUpstreamError(
        "NanoGPT",
        response.status,
        response.headers,
        await response.text(),
      );
      logger.error("[NanoGPT] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: upstreamError.summary,
        cfRay: upstreamError.cfRay,
        // Which model failed: an upstream outage is usually per model
        // (e.g. 503 all_fallbacks_failed on one GLM variant).
        model: requestModelOf(init?.body),
        // A 400 "Invalid request parameters" names no parameter: record
        // which optional request features were sent so it can be bisected.
        requestShape: describeRequestShape(init?.body),
      });
      return upstreamErrorResponse(response, upstreamError);
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
        // Real per-call cost (x_nanogpt_pricing / usage.cost) -> provider
        // metadata, so the call bills real cost x markup.
        metadataExtractor: nanoGptCostExtractor,
        url: ({ path }) => `${NANO_GPT_BASE_URL}${path}`,
        fetch: customFetch as typeof fetch,
      }),
  };
}
