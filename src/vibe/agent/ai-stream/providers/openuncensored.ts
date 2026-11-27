/**
 * OpenUncensored Provider
 * OpenAI-compatible router (https://api.openuncensored.com/v1) for abliterated
 * and uncensored open-weight models (GLM 5.3, DeepSeek V4.1 Flash, MiMo, ...).
 * It routes each model across several hosts itself. Native tool calling and
 * streamed usage pass through, so like NanoGPT the request goes out untouched
 * (OpenAI-compatible chat model: reasoning deltas surface, no strict-schema
 * normalisation of tool schemas).
 *
 * Routing compares the cheapest eligible host price. On a stream, bill the
 * final usage at the actual serving host's rates. Non-streamed responses
 * report their own cost in `ou.cost_usd`.
 */

import "server-only";

import { OpenAICompatibleChatLanguageModel } from "@ai-sdk/openai-compatible";
import { safeParseJSON } from "@ai-sdk/provider-utils";
import type { EndpointLogger } from "next-vibe/logger/types";
import { z } from "zod";

import { agentEnv } from "../../env";
import {
  fetchOpenUncensoredHostPrice,
  OPENUNCENSORED_BASE_URL,
} from "../../models/model-prices/providers/openuncensored";
import { ApiProvider, calculateTokenCostUsd } from "../../models/models";
import { readCacheUsage } from "../repository/loop/token-accumulator";
import { applyClientCache, isJsonRecord } from "./openrouter/routing";
import { logProviderRequest } from "./shared/debug-file-logger";
import type { ClientPromptCache } from "./shared/prompt-cache";
import { readOpenUncensoredCostUsd } from "./shared/upstream-cost";
import {
  summarizeUpstreamError,
  upstreamErrorResponse,
} from "./shared/upstream-error";

/** Routing strategy header: cheapest host, matching the listed price. */
const OPENUNCENSORED_STRATEGY = "cheapest";

type ChatConfig = ConstructorParameters<
  typeof OpenAICompatibleChatLanguageModel
>[1];
type CallOptions = Parameters<OpenAICompatibleChatLanguageModel["doStream"]>[0];
type GenerateResult = Awaited<
  ReturnType<OpenAICompatibleChatLanguageModel["doGenerate"]>
>;
type StreamResult = Awaited<
  ReturnType<OpenAICompatibleChatLanguageModel["doStream"]>
>;
type StreamPart =
  StreamResult["stream"] extends ReadableStream<infer Part> ? Part : never;

class OpenUncensoredChatModel extends OpenAICompatibleChatLanguageModel {
  constructor(
    modelId: string,
    config: ChatConfig,
    private readonly logger: EndpointLogger,
    private readonly fetchImpl: typeof globalThis.fetch,
  ) {
    super(modelId, config);
  }

  override async doGenerate(options: CallOptions): Promise<GenerateResult> {
    const result = await super.doGenerate(options);
    const cost = readOpenUncensoredCostUsd(result.response?.body);
    if (cost === null) {
      return result;
    }
    return {
      ...result,
      providerMetadata: {
        ...result.providerMetadata,
        [ApiProvider.OPENUNCENSORED]: {
          ...result.providerMetadata?.[ApiProvider.OPENUNCENSORED],
          usage: { cost },
        },
      },
    };
  }

  override async doStream(options: CallOptions): Promise<StreamResult> {
    const result = await super.doStream(options);
    const headers = new Headers(result.response?.headers);
    const host = headers.get("x-ou-provider")?.trim() || null;
    const model = headers.get("x-ou-model")?.trim() || this.modelId;
    const hostPrice = host
      ? fetchOpenUncensoredHostPrice(model, host, this.fetchImpl)
      : undefined;
    const { logger } = this;
    let outputChars = 0;

    return {
      ...result,
      stream: result.stream.pipeThrough(
        new TransformStream<StreamPart, StreamPart>({
          async transform(part, controller): Promise<void> {
            if (part.type === "text-delta" || part.type === "reasoning-delta") {
              outputChars += part.delta.length;
            } else if (part.type === "tool-call") {
              outputChars += part.toolName.length + part.input.length;
            }
            if (part.type !== "finish") {
              controller.enqueue(part);
              return;
            }

            const inputTokens = Math.max(0, part.usage.inputTokens.total ?? 0);
            const reportedOutputTokens = Math.max(
              0,
              part.usage.outputTokens.total ?? 0,
            );
            // Keep a delivered response billable if the final usage chunk is lost.
            const estimatedOutput =
              reportedOutputTokens === 0 && outputChars > 0;
            const outputTokens = estimatedOutput
              ? Math.ceil(outputChars / 3.5)
              : reportedOutputTokens;
            const cache = readCacheUsage({
              inputTokenDetails: {
                cacheReadTokens: part.usage.inputTokens.cacheRead,
                cacheWriteTokens: part.usage.inputTokens.cacheWrite,
              },
              raw: part.usage.raw,
            });
            const cachedInputTokens = Math.min(
              inputTokens,
              Math.max(0, cache.cachedInputTokens),
            );
            const cacheWriteTokens = Math.min(
              inputTokens - cachedInputTokens,
              Math.max(0, cache.cacheWriteTokens),
            );
            const rates = await hostPrice;
            const usd = rates
              ? calculateTokenCostUsd(
                  {
                    inputTokenCost: rates.input,
                    outputTokenCost: rates.output,
                    cacheReadTokenCost: rates.cacheRead,
                  },
                  inputTokens,
                  outputTokens,
                  cachedInputTokens,
                  cacheWriteTokens,
                )
              : 0;
            const cost =
              !estimatedOutput && Number.isFinite(usd) && usd > 0 ? usd : null;
            const usage = {
              inputTokens,
              outputTokens,
              cachedInputTokens,
              cacheWriteTokens,
              estimatedOutput,
              hostPriceFound: rates !== undefined,
              cost,
            };
            if (estimatedOutput) {
              logger.warn("[OpenUncensored] Stream missing output usage", {
                model,
                host,
                outputTokens,
              });
            }
            if (cost !== null) {
              logger.info("[OpenUncensored] Stream host cost", {
                model,
                host,
                inputTokenCost: rates?.input,
                outputTokenCost: rates?.output,
                cacheReadTokenCost: rates?.cacheRead ?? rates?.input,
                ...usage,
              });
            }
            controller.enqueue({
              ...part,
              usage: estimatedOutput
                ? {
                    ...part.usage,
                    outputTokens: {
                      ...part.usage.outputTokens,
                      total: outputTokens,
                    },
                  }
                : part.usage,
              providerMetadata: {
                ...part.providerMetadata,
                [ApiProvider.OPENUNCENSORED]: {
                  ...part.providerMetadata?.[ApiProvider.OPENUNCENSORED],
                  provider: host,
                  model,
                  usage,
                },
              },
            });
          },
        }),
      ),
    };
  }
}

/**
 * Create an OpenUncensored provider using the OpenAI-compatible Chat API.
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
      new OpenUncensoredChatModel(
        modelId,
        {
          provider: ApiProvider.OPENUNCENSORED,
          headers: (): Record<string, string> => ({
            "Content-Type": "application/json",
            // eslint-disable-next-line i18next/no-literal-string
            Authorization: `Bearer ${agentEnv.OPENUNCENSORED_API_KEY}`,
            "X-OU-Strategy": OPENUNCENSORED_STRATEGY,
          }),
          includeUsage: true,
          url: ({ path }) => `${OPENUNCENSORED_BASE_URL}${path}`,
          fetch: Object.assign(customFetch, {
            preconnect: fetchImpl.preconnect,
          }),
        },
        logger,
        fetchImpl,
      ),
  };
}
