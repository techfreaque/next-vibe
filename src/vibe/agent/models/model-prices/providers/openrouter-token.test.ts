import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { OpenRouterTokenPriceFetcher } from "./openrouter-token";

describe("OpenRouter endpoint prices", () => {
  it("uses one live standard endpoint when the bulk list quotes a higher input rate", async () => {
    const id = "z-ai/glm-5.2";
    const bulkPricing = { prompt: "0.00000062", completion: "0.00000242" };
    const waferPricing = {
      prompt: "0.000000007",
      completion: "0.0000068",
      input_cache_read: "0.000000006",
    };
    const fetchMock = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ data: [
        { id, name: "GLM 5.2", context_length: 1048576, pricing: bulkPricing },
      ] }))
      .mockResolvedValueOnce(Response.json({ data: { endpoints: [
        { status: 0, pricing: bulkPricing },
        { status: -2, pricing: { prompt: "0", completion: "0" } },
        { status: 0, service_tier: "priority", pricing: { prompt: "0", completion: "0" } },
        { status: 0, pricing: waferPricing },
      ] } }));
    try {
      const result = await new OpenRouterTokenPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      const prices = Object.fromEntries(result.updates
        .filter((row) => row.providerModel === id)
        .map((row) => [row.field, row.value]));
      expect(prices).toEqual({
        inputTokenCost: 0.007,
        outputTokenCost: 6.8,
        cacheReadTokenCost: 0.006,
      });
    } finally {
      fetchMock.mockRestore();
    }
  });
});
