/**
 * Real upstream cost reported by OpenAI-compatible providers, surfaced as AI
 * SDK provider metadata in OpenRouter's shape: `{ <key>: { usage: { cost } } }`
 * (key = the ApiProvider value). readStepUpstreamCost reads it from there, so
 * chat turns, /v1 and compacting bill real cost x markup for these providers
 * exactly like OpenRouter.
 *
 * - NanoGPT: `x_nanogpt_pricing.costUsd` (or `usage.cost` in USD) on the
 *   response body and on the last stream chunk.
 * - Venice: `cost.usd` on the response body and on the usage-only stream chunk.
 *   Paid in DIEM, `usd` is 0: no cost is reported then (listed-price fallback).
 * - OpenUncensored: `ou.cost_usd` on non-streamed response bodies. Streams
 *   use the serving host's tariff and reported usage instead.
 *
 * Only a finite cost > 0 counts; anything else is "no cost reported".
 */

import "server-only";

import type { MetadataExtractor } from "@ai-sdk/openai-compatible";
import { z } from "zod";

import { ApiProvider } from "../../../models/models";

const nanoGptCostSchema = z.object({
  x_nanogpt_pricing: z
    .object({
      costUsd: z.number().nullish(),
      currency: z.string().nullish(),
    })
    .nullish(),
  usage: z
    .object({
      cost: z.number().nullish(),
      currency: z.string().nullish(),
      prompt_tokens: z.number().nullish(),
      completion_tokens: z.number().nullish(),
    })
    .nullish(),
});

/**
 * What a NanoGPT stream reported when no positive USD cost arrived: whether
 * a usage / pricing object was seen, the raw cost values (0, negative, other
 * currency) and the token counts it reported, so a "cost missing" row tells
 * a zero-cost answer, a non-USD cost and an absent field apart.
 */
interface NanoGptCostChunkEvidence {
  costUsd: number | null;
  sawUsage: boolean;
  sawPricing: boolean;
  rawPricingCost: number | null;
  rawUsageCost: number | null;
  currency: string | null;
  promptTokens: number | null;
  completionTokens: number | null;
}

const veniceCostSchema = z.object({
  cost: z.object({ usd: z.number().nullish() }).nullish(),
});

const openUncensoredCostSchema = z.object({
  ou: z.object({ cost_usd: z.number().nullish() }).nullish(),
});

function positiveCost(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function isUsd(currency: string | null | undefined): boolean {
  return (
    currency === undefined ||
    currency === null ||
    currency.toUpperCase() === "USD"
  );
}

/** USD a NanoGPT response (body or stream chunk) reports, null when none. */
export function readNanoGptCostUsd(
  body: Parameters<MetadataExtractor["extractMetadata"]>[0]["parsedBody"],
): number | null {
  return readNanoGptCostChunk(body).costUsd;
}

function readNanoGptCostChunk(
  body: Parameters<MetadataExtractor["extractMetadata"]>[0]["parsedBody"],
): NanoGptCostChunkEvidence {
  const parsed = nanoGptCostSchema.safeParse(body);
  if (!parsed.success) {
    return {
      costUsd: null,
      sawUsage: false,
      sawPricing: false,
      rawPricingCost: null,
      rawUsageCost: null,
      currency: null,
      promptTokens: null,
      completionTokens: null,
    };
  }
  const pricing = parsed.data.x_nanogpt_pricing;
  const fromPricing = isUsd(pricing?.currency)
    ? positiveCost(pricing?.costUsd)
    : null;
  const usage = parsed.data.usage;
  return {
    costUsd:
      fromPricing ??
      (isUsd(usage?.currency) ? positiveCost(usage?.cost) : null),
    sawUsage: usage !== null && usage !== undefined,
    sawPricing: pricing !== null && pricing !== undefined,
    rawPricingCost: pricing?.costUsd ?? null,
    rawUsageCost: usage?.cost ?? null,
    currency: pricing?.currency ?? usage?.currency ?? null,
    promptTokens: usage?.prompt_tokens ?? null,
    completionTokens: usage?.completion_tokens ?? null,
  };
}

/** USD a Venice response (body or stream chunk) reports, null when none. */
export function readVeniceCostUsd(
  body: Parameters<MetadataExtractor["extractMetadata"]>[0]["parsedBody"],
): number | null {
  const parsed = veniceCostSchema.safeParse(body);
  return parsed.success ? positiveCost(parsed.data.cost?.usd) : null;
}

/** USD an OpenUncensored non-streamed response reports, null when none. */
export function readOpenUncensoredCostUsd(
  body: Parameters<MetadataExtractor["extractMetadata"]>[0]["parsedBody"],
): number | null {
  const parsed = openUncensoredCostSchema.safeParse(body);
  return parsed.success ? positiveCost(parsed.data.ou?.cost_usd) : null;
}

/** Provider metadata carrying a real upstream cost (undefined when none). */
export function upstreamCostMetadata(
  provider: ApiProvider.NANO_GPT | ApiProvider.VENICE_AI,
  costUsd: number | null,
): { [key: string]: { usage: { cost: number } } } | undefined {
  return costUsd === null
    ? undefined
    : { [provider]: { usage: { cost: costUsd } } };
}

/**
 * NanoGPT metadata extractor for the OpenAI-compatible chat model: the cost
 * of the call, from the response body or the last stream chunk carrying it.
 */
export const nanoGptCostExtractor: MetadataExtractor = {
  extractMetadata: ({ parsedBody }) =>
    Promise.resolve(
      upstreamCostMetadata(
        ApiProvider.NANO_GPT,
        readNanoGptCostUsd(parsedBody),
      ),
    ),
  createStreamExtractor: () => {
    let costUsd: number | null = null;
    let sawUsage = false;
    let sawPricing = false;
    let rawPricingCost: number | null = null;
    let rawUsageCost: number | null = null;
    let currency: string | null = null;
    let promptTokens: number | null = null;
    let completionTokens: number | null = null;
    let chunkCount = 0;
    return {
      processChunk: (parsedChunk): void => {
        chunkCount += 1;
        const evidence = readNanoGptCostChunk(parsedChunk);
        costUsd = evidence.costUsd ?? costUsd;
        sawUsage ||= evidence.sawUsage;
        sawPricing ||= evidence.sawPricing;
        rawPricingCost = evidence.rawPricingCost ?? rawPricingCost;
        rawUsageCost = evidence.rawUsageCost ?? rawUsageCost;
        currency = evidence.currency ?? currency;
        promptTokens = evidence.promptTokens ?? promptTokens;
        completionTokens = evidence.completionTokens ?? completionTokens;
      },
      buildMetadata: () => {
        return (
          upstreamCostMetadata(ApiProvider.NANO_GPT, costUsd) ?? {
            [ApiProvider.NANO_GPT]: {
              missingCostEvidence: {
                sawUsage,
                sawPricing,
                rawPricingCost,
                rawUsageCost,
                currency,
                promptTokens,
                completionTokens,
                chunkCount,
              },
            },
          }
        );
      },
    };
  },
};
