import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import { VenicePriceFetcher } from "./venice-ai";

describe("Venice image prices", () => {
  it("collects generation and inpaint prices from the model catalog", async () => {
    const fetchMock = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ data: [{
        id: "qwen-3-6-plus", model_spec: { pricing: { input: {usd: 1}, output: {usd: 2},
          cache_input: {usd: 0}, cache_write: {usd: 1.25}, cache_write_1h: {usd: 2},
          extended: {context_token_threshold: 200000, input: {usd: 2.5}, output: {usd: 7.5}, cache_input: {usd: 0.0625}, cache_write: {usd: 0.78}}
        }},
      }] }))
      .mockResolvedValueOnce(
        Response.json({
          data: [
            {
              id: "chroma",
              type: "image",
              model_spec: { pricing: { generation: { usd: 0.01 } } },
            },
            {
              id: "qwen-edit-uncensored",
              type: "inpaint",
              model_spec: { pricing: { inpaint: { usd: 0.04 } } },
            },
            {
              id: "firered-image-edit",
              type: "inpaint",
              model_spec: { pricing: { inpaint: { usd: 0.04 } } },
            },
          ],
        }),
      )
      .mockResolvedValue(new Response(null, { status: 404 }));
    try {
      const result = await new VenicePriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "https://api.venice.ai/api/v1/models?type=all",
        { headers: { Accept: "application/json" } },
      );
      const prices = Object.fromEntries(
        result.updates
          .filter((update) => update.field === "creditCostPerImage")
          .map((update) => [update.providerModel, update.value]),
      );
      const chat = Object.fromEntries(result.updates.filter(update => update.providerModel === "qwen-3-6-plus").map(update => [update.field, update.value]));
      expect(chat).toMatchObject({cacheReadTokenCost: 0, cacheWriteTokenCost: 1.25, cacheWrite1hTokenCost: 2});
      expect(result.settingsUpdates?.find(update => update.field === "pricingTiers")?.tsLiteral).toContain("minPromptTokens: 200001");
      expect(prices).toEqual({
        chroma: 1,
        "qwen-edit-uncensored": 4,
        "firered-image-edit": 4,
      });
    } finally {
      fetchMock.mockRestore();
    }
  });
});
