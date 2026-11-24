import { describe, expect, it, spyOn } from "bun:test";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  calculateSttCharge,
  SttModelId,
  sttModelOptions,
} from "../../../speech-to-text/models";
import { CommercialUse } from "../../commercial-use/enum";
import { ApiProvider } from "../../models";
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

describe("NanoGPT speech prices", () => {
  it("refreshes the Qwen3 flat whole-second tariff and rounds fallback billing", async () => {
    const id = "qwen/qwen3-asr-0.6b";
    const transport = spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(Response.json({ data: [] }))
      .mockResolvedValueOnce(
        Response.json({
          data: [
            {
              id,
              pricing: {
                per_minute: 0.0001998,
                per_second: 0.00000333,
                billing_increment_seconds: 1,
                rounding: "ceil",
                currency: "USD",
              },
            },
          ],
        }),
      );
    try {
      const result = await new NanoGptPriceFetcher().fetch(
        createEndpointLogger(false, defaultLocale),
      );
      const route = sttModelOptions.find(
        (option) =>
          option.id === SttModelId.QWEN3_ASR_0_6B &&
          option.apiProvider === ApiProvider.NANO_GPT,
      );
      expect(route?.providerModel).toBe(id);
      expect(route?.commercialUse?.status).toBe(CommercialUse.ALLOWED);
      expect(result.updates).toContainEqual(
        expect.objectContaining({
          modelId: SttModelId.QWEN3_ASR_0_6B,
          field: "creditCostPerSecond",
          value: route?.creditCostPerSecond,
        }),
      );
      expect(route?.creditCostPerSecond).toBe(0.000333);
      if (route) {
        const chunks = [{ duration: 231.0001, providerCostUsd: undefined }];
        expect(calculateSttCharge(route, chunks).credits).toBe(0.2);
        expect(
          calculateSttCharge({ creditCostPerSecond: route.creditCostPerSecond }, chunks)
            .credits,
        ).toBe(0.1);
      }
    } finally {
      transport.mockRestore();
    }
  });
});
