/**
 * Embedding billing: real upstream cost x (1 + STANDARD_MARKUP_PERCENTAGE),
 * rounded UP to 0.01 credit, instead of a flat 0.01 credit per call.
 *
 * - embeddingCreditsForCost: markup, round-up, zero/invalid cost
 * - embedTextWithCost: sums OpenRouter's `usage.cost` across chunk requests,
 *   falls back to the listed bge-m3 price when a response carries no cost
 *   (mocked fetch, no network)
 */

import { describe, expect, it } from "vitest";

import {
  CREDIT_VALUE_USD,
  STANDARD_MARKUP_PERCENTAGE,
} from "@/products/constants";

import { EMBEDDING_CHUNK_TOKEN_BUDGET } from "./chunking";
import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_USD_PER_MILLION_TOKENS,
  embeddingCreditsForCost,
  embedTextWithCost,
} from "./service";

const MARKUP = 1 + STANDARD_MARKUP_PERCENTAGE;

function mockFetch(
  usage: { prompt_tokens?: number; cost?: number } | undefined,
): { fetchImpl: typeof globalThis.fetch; calls: () => number } {
  let count = 0;
  const handler = async (): Promise<Response> => {
    count += 1;
    return Response.json({
      data: [
        {
          embedding: Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) =>
            i === count % EMBEDDING_DIMENSIONS ? 1 : 0,
          ),
          index: 0,
        },
      ],
      usage,
    });
  };
  return {
    fetchImpl: Object.assign(handler, { preconnect: fetch.preconnect }),
    calls: () => count,
  };
}

describe("embeddingCreditsForCost", () => {
  it("bills nothing for zero or invalid cost", () => {
    expect(embeddingCreditsForCost(0)).toBe(0);
    expect(embeddingCreditsForCost(-1)).toBe(0);
    expect(embeddingCreditsForCost(Number.NaN)).toBe(0);
    expect(embeddingCreditsForCost(Number.POSITIVE_INFINITY)).toBe(0);
  });

  it("rounds a tiny real cost up to one 0.01-credit step", () => {
    // 161 tokens of bge-m3, as OpenRouter reported it.
    expect(embeddingCreditsForCost(1.61e-6)).toBe(0.01);
  });

  it("applies the standard markup on larger costs and rounds up", () => {
    const costUsd = 0.0013; // ~130k tokens: a long multi-chunk document
    const exact = (costUsd / CREDIT_VALUE_USD) * MARKUP; // 0.169
    const billed = embeddingCreditsForCost(costUsd);
    expect(billed).toBe(0.17);
    expect(billed).toBeGreaterThanOrEqual(exact);
    expect(billed - exact).toBeLessThan(0.01);
  });

  it("does not ceil float noise on an exact step", () => {
    // 0.03 credits after markup exactly
    const costUsd = (0.03 * CREDIT_VALUE_USD) / MARKUP;
    expect(embeddingCreditsForCost(costUsd)).toBe(0.03);
  });
});

describe("embedTextWithCost", () => {
  it("returns the provider-reported cost", async () => {
    const { fetchImpl } = mockFetch({ prompt_tokens: 161, cost: 1.61e-6 });
    const result = await embedTextWithCost("key", "a short note", fetchImpl);
    expect(result?.costUsd).toBeCloseTo(1.61e-6, 12);
    expect(result?.embedding.length).toBe(EMBEDDING_DIMENSIONS);
  });

  it("sums the cost of every chunk request", async () => {
    const { fetchImpl, calls } = mockFetch({ cost: 2e-6 });
    // Well over one chunk budget of plain ASCII
    const text = "word ".repeat(EMBEDDING_CHUNK_TOKEN_BUDGET * 3);
    const result = await embedTextWithCost("key", text, fetchImpl);
    expect(calls()).toBeGreaterThan(1);
    expect(result?.costUsd).toBeCloseTo(2e-6 * calls(), 12);
  });

  it("falls back to the listed price when no cost is reported", async () => {
    const { fetchImpl } = mockFetch({ prompt_tokens: 1000 });
    const result = await embedTextWithCost("key", "a short note", fetchImpl);
    expect(result?.costUsd).toBeCloseTo(
      (1000 * EMBEDDING_USD_PER_MILLION_TOKENS) / 1_000_000,
      12,
    );
    expect(embeddingCreditsForCost(result?.costUsd ?? 0)).toBe(0.01);
  });

  it("never reports zero cost for a successful call", async () => {
    const { fetchImpl } = mockFetch(undefined);
    const result = await embedTextWithCost("key", "a short note", fetchImpl);
    expect(result?.costUsd).toBeGreaterThan(0);
  });
});
