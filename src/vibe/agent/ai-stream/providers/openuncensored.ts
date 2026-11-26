/**
 * OpenUncensored Provider
 * OpenAI-compatible router (https://api.openuncensored.com/v1) for abliterated
 * and uncensored open-weight models (GLM 5.3, DeepSeek V4.1 Flash, MiMo, ...).
 * It routes each model across several hosts itself. Native tool calling and
 * streamed usage pass through, so like NanoGPT the request goes out untouched
 * (OpenAI-compatible chat model: reasoning deltas surface, no strict-schema
 * normalisation of tool schemas).
 *
 * Routing: `X-OU-Strategy: cheapest` pins OpenUncensored to its cheapest host
 * for the model. That host's price is the one /v1/models lists, which is what
 * our price fetcher stores and what our own cheapest-route pick compares.
 * The real cost of each call (`ou.cost_usd`) bills x markup.
 */

import "server-only";

import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { safeParseJSON } from "@ai-sdk/provider-utils";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { agentEnv } from "../../env";
import { ApiProvider } from "../../models/models";
import { applyClientCache, isJsonRecord } from "./openrouter/routing";
import { logProviderRequest } from "./shared/debug-file-logger";
import type { ClientPromptCache } from "./shared/prompt-cache";
import { openUncensoredCostExtractor } from "./shared/upstream-cost";
import {
  summarizeUpstreamError,
  upstreamErrorResponse,
} from "./shared/upstream-error";

export const OPENUNCENSORED_BASE_URL = "https://api.openuncensored.com/v1";

/** Routing strategy header: cheapest host, matching the listed price. */
const OPENUNCENSORED_STRATEGY = "cheapest";

/**
 * Create an OpenUncensored provider compatible with AI SDK V2
 */
export function createOpenUncensored(
  logger: EndpointLogger,
  // Explicit fetch — the fixture engine binds record/replay per execution
  // chain (createFixtureFetch); plain live fetch otherwise. Never global.
  fetchImpl: typeof globalThis.fetch,
  clientCache?: ClientPromptCache,
): {
  chat: (modelId: string) => OpenAICompatibleChatLanguageModel;
} {
  const customFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    if (clientCache && typeof init?.body === "string") {
      const parsed = await safeParseJSON({ text: init.body, schema: z.json() });
      if (parsed.success && isJsonRecord(parsed.value)) {
        applyClientCache(parsed.value, clientCache);
        init = { ...init, body: JSON.stringify(parsed.value) };
      }
    }
    if (typeof init?.body === "string") {
      logProviderRequest("openuncensored", init.body);
    }
    const response = await fetchImpl(input, init);
    if (!response.ok) {
      const upstreamError = summarizeUpstreamError(
        "OpenUncensored",
        response.status,
        response.headers,
        await response.text(),
      );
      logger.error("[OpenUncensored] API Error", {
        status: response.status,
        statusText: response.statusText,
        body: upstreamError.summary,
        upstreamResponseKind: upstreamError.isHtmlPage ? "edge-html" : "api",
        cfRay: upstreamError.cfRay,
        // Which model/host OpenUncensored tried, for routing complaints.
        ouModel: response.headers.get("x-ou-model"),
        ouProvider: response.headers.get("x-ou-provider"),
        retryAfter: response.headers.get("retry-after"),
      });
      return upstreamErrorResponse(response, upstreamError);
    }
    return response;
  };

  return {
    chat: (modelId: string): OpenAICompatibleChatLanguageModel =>
      new OpenAICompatibleChatLanguageModel(modelId, {
        provider: ApiProvider.OPENUNCENSORED,
        headers: (): Record<string, string> => ({
          "Content-Type": "application/json",
          // eslint-disable-next-line i18next/no-literal-string
          Authorization: `Bearer ${agentEnv.OPENUNCENSORED_API_KEY}`,
          "X-OU-Strategy": OPENUNCENSORED_STRATEGY,
        }),
        includeUsage: true,
        // Real per-call cost (ou.cost_usd) -> provider metadata, so the call
        // bills real cost x markup.
        metadataExtractor: openUncensoredCostExtractor,
        url: ({ path }) => `${OPENUNCENSORED_BASE_URL}${path}`,
        fetch: customFetch as typeof fetch,
      }),
  };
}
