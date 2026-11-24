import { describe, expect, it } from "bun:test";
import { chatModelOptionsPool } from "../ai-stream/models";
import { calculateTokenCostUsd } from "./models";
import { activeTokenRates, tokenTariffs } from "./token-tariffs";

describe("published conditional token prices", () => {
  for (const model of chatModelOptionsPool) {
    const tiers = tokenTariffs(model);
    if (!tiers.length) {
      continue;
    }
    it(`${model.id}/${model.apiProvider} selects each published threshold and UTC window`, () => {
      const context = tiers.filter(tier => "minPromptTokens" in tier).toSorted((a,b) => a.minPromptTokens - b.minPromptTokens);
      for (const [index, tier] of context.entries()) {
        expect(activeTokenRates(model, tier.minPromptTokens - 1)).toBe(context[index - 1] ?? model);
        expect(activeTokenRates(model, tier.minPromptTokens)).toBe(tier);
        expect(activeTokenRates(model, tier.minPromptTokens + 1)).toBe(tier);
        const n = tier.minPromptTokens;
        const read = 700, write = 300, hour = tier.cacheWrite1hTokenCost === undefined ? 0 : 100;
        const ordinaryRate = tier.inputTokenCost ?? 0;
        const writeRate = tier.cacheWriteTokenCost ?? ordinaryRate;
        const expected = ((n - read - write) * ordinaryRate + read * (tier.cacheReadTokenCost ?? ordinaryRate) +
          (write - hour) * writeRate + hour * (tier.cacheWrite1hTokenCost ?? writeRate) + 125 * (tier.outputTokenCost ?? 0)) / 1e6;
        expect(calculateTokenCostUsd(model, n, 125, read, write, 0, hour)).toBeCloseTo(expected,12);
        expect(activeTokenRates(model).inputTokenCost).toBeGreaterThanOrEqual(ordinaryRate);
      }
      const timestamp = (hhmm: number): number => Date.UTC(2026,10,24,Math.floor(hhmm/100),hhmm%100);
      for (const tier of tiers) {
        if (!("utcStart" in tier)) { continue; }
        const start = timestamp(tier.utcStart), end = timestamp(tier.utcEnd);
        expect(activeTokenRates(model, 1000, start - 1)).not.toBe(tier);
        expect(activeTokenRates(model, 1000, start)).toBe(tier);
        expect(activeTokenRates(model, 1000, end - 1)).toBe(tier);
        expect(activeTokenRates(model, 1000, end)).not.toBe(tier);
        if (tier.utcStart > tier.utcEnd) {
          expect(activeTokenRates(model, 1000, timestamp(0))).toBe(tier);
        }
        expect(activeTokenRates(model, 1000).outputTokenCost).toBeGreaterThanOrEqual(tier.outputTokenCost ?? 0);
      }
    });
  }
});
