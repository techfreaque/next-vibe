import { describe, expect, it } from "bun:test";

import { calculateCreditCost } from "../../../models/models";
import {
  ChatModelId,
  type ChatModelOption,
  getChatModelById,
} from "../../models";
import { TokenAccumulator, type TokenCounters } from "./token-accumulator";

/** A token-priced option with round prices: $2/M in, $10/M out, $0.10/M cache read. */
function pricedModel(): ChatModelOption {
  return {
    ...getChatModelById(ChatModelId.KIMI_K3),
    creditCost: calculateCreditCost,
    inputTokenCost: 2,
    outputTokenCost: 10,
    cacheReadTokenCost: 0.1,
    cacheWriteTokenCost: undefined,
  };
}

function freshCounters(): TokenCounters {
  return {
    tokenUncachedInput: 0,
    tokenCachedInput: 0,
    tokenCacheWrite: 0,
    tokenOutput: 0,
    tokenLastInput: 0,
    tokensBilled: false,
    tokenStepCount: 0,
  };
}

/** Credits for a turn in USD terms: 1 credit = $0.01, 30% markup, ceil to 0.01. */
function expectedCredits(usd: number): number {
  return Math.ceil((usd / 0.01) * 1.3 * 100 - 1e-9) / 100;
}

/** Three tool-loop steps: each re-sends the growing prompt, mostly cache hits. */
const FIRST_STEP = {
  inputTokens: 20_000,
  outputTokens: 300,
  cachedInputTokens: 0,
  cacheWriteTokens: 0,
};
const STEPS = [
  FIRST_STEP,
  {
    inputTokens: 22_000,
    outputTokens: 300,
    cachedInputTokens: 20_000,
    cacheWriteTokens: 0,
  },
  {
    inputTokens: 24_000,
    outputTokens: 800,
    cachedInputTokens: 22_000,
    cacheWriteTokens: 0,
  },
];
// uncached: 20000 + 2000 + 2000 = 24000; cached: 42000; output: 1400
const STEPS_USD = (24_000 * 2 + 42_000 * 0.1 + 1_400 * 10) / 1_000_000;

describe("calculateCreditCost cache handling", () => {
  it("bills uncached input at the input rate and cache hits at the cache rate", () => {
    // 10k input of which 8k cached, 1k output
    const usd = (2_000 * 2 + 8_000 * 0.1 + 1_000 * 10) / 1_000_000;
    expect(calculateCreditCost(pricedModel(), 10_000, 1_000, 8_000)).toBe(
      expectedCredits(usd),
    );
  });

  it("never bills below zero when cached exceeds the passed input", () => {
    // The old finalize call passed the already-uncached count: 2k "input"
    // with 42k cached went to -40k uncached tokens => negative credits.
    expect(
      calculateCreditCost(pricedModel(), 2_000, 100, 42_000),
    ).toBeGreaterThan(0);
  });
});

describe("TokenAccumulator multi-step billing", () => {
  it("finalize + full-input call bills every step exactly once", () => {
    const ctx = freshCounters();
    for (const step of STEPS) {
      TokenAccumulator.accumulate(ctx, step);
    }
    const final = TokenAccumulator.finalize(
      ctx,
      { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 },
      0,
    );
    expect(final.uncachedInputTokens).toBe(24_000);
    expect(final.cachedInputTokens).toBe(42_000);
    expect(final.outputTokens).toBe(1_400);

    // The way complete() now calls it: full input = uncached + cached.
    const billed = calculateCreditCost(
      pricedModel(),
      final.uncachedInputTokens + final.cachedInputTokens,
      final.outputTokens,
      final.cachedInputTokens,
      final.cacheWriteTokens,
    );
    expect(billed).toBe(expectedCredits(STEPS_USD));

    // The old call (uncached passed as the full input) under-billed by the
    // whole cached volume at the input rate.
    const oldCall = calculateCreditCost(
      pricedModel(),
      final.uncachedInputTokens,
      final.outputTokens,
      final.cachedInputTokens,
      final.cacheWriteTokens,
    );
    expect(oldCall).toBeLessThan(billed);
  });

  it("unbilledCompletedSteps returns the finished steps of an early-ended turn", () => {
    const ctx = freshCounters();
    for (const step of STEPS) {
      TokenAccumulator.accumulate(ctx, step);
    }
    const steps = TokenAccumulator.unbilledCompletedSteps(ctx);
    expect(steps).toEqual({
      inputTokens: 66_000,
      outputTokens: 1_400,
      cachedInputTokens: 42_000,
      cacheWriteTokens: 0,
    });
    if (!steps) {
      return;
    }
    expect(
      calculateCreditCost(
        pricedModel(),
        steps.inputTokens,
        steps.outputTokens,
        steps.cachedInputTokens,
        steps.cacheWriteTokens,
      ),
    ).toBe(expectedCredits(STEPS_USD));
  });

  it("unbilledCompletedSteps is null once the turn was billed", () => {
    const ctx = freshCounters();
    TokenAccumulator.accumulate(ctx, FIRST_STEP);
    ctx.tokensBilled = true;
    expect(TokenAccumulator.unbilledCompletedSteps(ctx)).toBeNull();
  });

  it("unbilledCompletedSteps keeps a finished step with empty usage (per-message models)", () => {
    const ctx = freshCounters();
    TokenAccumulator.accumulate(ctx, {
      inputTokens: 0,
      outputTokens: 0,
      cachedInputTokens: 0,
      cacheWriteTokens: 0,
    });
    expect(TokenAccumulator.unbilledCompletedSteps(ctx)).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      cachedInputTokens: 0,
      cacheWriteTokens: 0,
    });
  });

  it("unbilledCompletedSteps is null when no step finished", () => {
    expect(TokenAccumulator.unbilledCompletedSteps(freshCounters())).toBeNull();
  });
});
