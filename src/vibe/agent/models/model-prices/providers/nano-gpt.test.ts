import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import { NanoGptPriceFetcher } from "./nano-gpt";

describe("NanoGPT cache tariffs", () => {
  it("converts the per-thousand cache fields independently of the ordinary rates", async () => {
    const id = "TheDrummer/Artemis-v1.1";
    const transport = spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json({data: [{
      id, pricing: { unit: "per_million_tokens", prompt: 0.1, completion: 0.45,
        firstContextThresholdTokens: 100000, inputPer1kTokensAboveFirstThreshold: 0.001, outputPer1kTokensAboveFirstThreshold: 0.002, cacheReadInputPer1kTokensAboveFirstThreshold: 0.00005, highContextThresholdTokens: 272000, inputPer1kTokensAbove200k: 0.002, outputPer1kTokensAbove200k: 0.004, cacheWriteInputPer1kTokens1hAbove200k: 0.007, cacheReadInputPer1kTokens: 0, cacheWriteInputPer1kTokens: 0.000125, cacheWriteInputPer1kTokens1h: 0.0002 },
    }]})).mockResolvedValueOnce(Response.json({data: []}));
    try {
      const result = await new NanoGptPriceFetcher().fetch(createEndpointLogger(false, defaultLocale));
      const tiers = result.settingsUpdates?.find(update => update.providerModel === id)?.tsLiteral;
      expect(tiers).toContain("minPromptTokens: 100001");
      expect(tiers).toContain("cacheReadTokenCost: 0.05");
      expect(tiers).toContain("minPromptTokens: 272001");
      expect(tiers).toContain("cacheWrite1hTokenCost: 7");
      const rates = Object.fromEntries(result.updates.filter(update => update.providerModel === id).map(update => [update.field, update.value]));
      expect(rates).toMatchObject({inputTokenCost: 0.1, outputTokenCost: 0.45, cacheReadTokenCost: 0, cacheWriteTokenCost: 0.125, cacheWrite1hTokenCost: 0.2});
    } finally {
      transport.mockRestore();
    }
  });
});
