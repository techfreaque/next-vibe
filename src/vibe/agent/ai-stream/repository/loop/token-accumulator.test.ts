import { describe, expect, it, spyOn } from "bun:test";

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { createEndpointLogger } from "next-vibe/logger/server";

import {
  ApiProvider,
  calculateCreditCost,
  upstreamCostToCredits,
} from "../../../models/models";
import {
  ChatModelId,
  type ChatModelOption,
  getChatModelById,
} from "../../models";
import {
  readStepUpstreamCost,
  TokenAccumulator,
  type TokenCounters,
} from "./token-accumulator";

/** A token-priced option with round prices: $2/M in, $10/M out, $0.10/M cache read. */
function pricedModel(): ChatModelOption {
  return {
    ...getChatModelById(ChatModelId.KIMI_K3),
    apiProvider: ApiProvider.OPENROUTER,
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
    upstreamCostUsd: 0,
    upstreamFallbackCostUsd: 0,
    upstreamCostSteps: 0,
    upstreamCostMissingSteps: 0,
    upstreamProvider: null,
  };
}

/** Same prices, served by a provider that returns no reliable real cost. */
function nanoGptModel(): ChatModelOption {
  return { ...pricedModel(), apiProvider: ApiProvider.NANO_GPT };
}

const logger = createEndpointLogger(false, defaultLocale);

/** OpenRouter step metadata as the provider package exposes it. */
function openRouterMeta(cost: number, provider = "Parasail"): {
  openrouter: { provider: string; usage: { cost: number } };
} {
  return { openrouter: { provider, usage: { cost } } };
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

describe("upstreamCostToCredits", () => {
  it("applies the 30% markup at $0.01 per credit, ceil to 0.1 credit", () => {
    // $0.01 x 1.3 = 1.3 credits exactly (no float ceiling up to 1.4)
    expect(upstreamCostToCredits(0.01)).toBe(1.3);
    // $0.0123 x 1.3 / 0.01 = 1.599 -> 1.6
    expect(upstreamCostToCredits(0.0123)).toBe(1.6);
    // tiny but non-zero still charges the minimum 0.1
    expect(upstreamCostToCredits(0.000001)).toBe(0.1);
    // $1 -> 130 credits
    expect(upstreamCostToCredits(1)).toBe(130);
  });

  it("charges nothing for zero or invalid cost", () => {
    expect(upstreamCostToCredits(0)).toBe(0);
    expect(upstreamCostToCredits(-1)).toBe(0);
    expect(upstreamCostToCredits(Number.NaN)).toBe(0);
  });
});

describe("readStepUpstreamCost", () => {
  it("reads usage.cost and the serving endpoint", () => {
    expect(readStepUpstreamCost(openRouterMeta(0.0042, "Modal"))).toEqual({
      costUsd: 0.0042,
      provider: "Modal",
    });
  });

  it("returns null cost when the step reported none", () => {
    expect(readStepUpstreamCost(undefined)).toEqual({
      costUsd: null,
      provider: null,
    });
    expect(
      readStepUpstreamCost({ openrouter: { usage: { promptTokens: 10 } } }),
    ).toEqual({ costUsd: null, provider: null });
  });
});

describe("TokenAccumulator actual upstream cost billing", () => {
  /** Run the per-step path the way onStepFinish does. */
  function runSteps(
    ctx: TokenCounters,
    model: ChatModelOption,
    costs: Array<number | null>,
  ): void {
    STEPS.forEach((step, i) => {
      TokenAccumulator.accumulate(ctx, step);
      const cost = costs[i] ?? null;
      TokenAccumulator.recordUpstreamCost(
        ctx,
        model,
        step,
        readStepUpstreamCost(cost === null ? undefined : openRouterMeta(cost)),
        logger,
      );
    });
  }

  it("bills the summed real per-step cost x markup, not the token price", () => {
    const ctx = freshCounters();
    // Routed to an endpoint ~5x pricier than the listed token price.
    runSteps(ctx, pricedModel(), [0.05, 0.03, 0.04]);
    const charge = TokenAccumulator.resolveCharge(ctx, pricedModel(), {
      inputTokens: 66_000,
      outputTokens: 1_400,
      cachedInputTokens: 42_000,
      cacheWriteTokens: 0,
    });
    // $0.12 x 1.3 / 0.01 = 15.6
    expect(charge.credits).toBe(15.6);
    expect(charge.credits).toBeGreaterThan(expectedCredits(STEPS_USD));
    expect(charge.upstreamCost).toEqual({
      upstreamCostUsd: 0.12,
      fallbackCostUsd: 0,
      upstreamProvider: "Parasail",
      billingBasis: "upstream_cost",
    });
  });

  it("falls back to the token price for a step without cost and warns", () => {
    const warn = spyOn(logger, "warn");
    const ctx = freshCounters();
    runSteps(ctx, pricedModel(), [0.05, null, 0.04]);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();

    const step2 = STEPS[1];
    const step2Usd =
      ((step2.inputTokens - step2.cachedInputTokens) * 2 +
        step2.cachedInputTokens * 0.1 +
        step2.outputTokens * 10) /
      1_000_000;
    const charge = TokenAccumulator.resolveCharge(ctx, pricedModel(), {
      inputTokens: 66_000,
      outputTokens: 1_400,
      cachedInputTokens: 42_000,
      cacheWriteTokens: 0,
    });
    expect(charge.credits).toBe(upstreamCostToCredits(0.09 + step2Usd));
    expect(charge.upstreamCost?.billingBasis).toBe("mixed");
    expect(charge.upstreamCost?.fallbackCostUsd).toBeCloseTo(step2Usd, 12);
  });

  it("uses the plain token price when no step reported a cost", () => {
    const warn = spyOn(logger, "warn");
    const ctx = freshCounters();
    runSteps(ctx, pricedModel(), [null, null, null]);
    expect(warn).toHaveBeenCalledTimes(3);
    warn.mockRestore();
    const charge = TokenAccumulator.resolveCharge(ctx, pricedModel(), {
      inputTokens: 66_000,
      outputTokens: 1_400,
      cachedInputTokens: 42_000,
      cacheWriteTokens: 0,
    });
    expect(charge.credits).toBe(expectedCredits(STEPS_USD));
    expect(charge.upstreamCost).toBeUndefined();
  });

  it("ignores reported cost for non-OpenRouter providers", () => {
    const warn = spyOn(logger, "warn");
    const ctx = freshCounters();
    runSteps(ctx, nanoGptModel(), [0.05, 0.03, 0.04]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
    expect(ctx.upstreamCostSteps).toBe(0);
    const charge = TokenAccumulator.resolveCharge(ctx, nanoGptModel(), {
      inputTokens: 66_000,
      outputTokens: 1_400,
      cachedInputTokens: 42_000,
      cacheWriteTokens: 0,
    });
    expect(charge.credits).toBe(expectedCredits(STEPS_USD));
    expect(charge.upstreamCost).toBeUndefined();
  });

  it("early-ended turn bills the finished steps' real cost exactly once", () => {
    const ctx = freshCounters();
    // Two steps finished, then endLoop / user stop ended the turn.
    STEPS.slice(0, 2).forEach((step, i) => {
      TokenAccumulator.accumulate(ctx, step);
      TokenAccumulator.recordUpstreamCost(
        ctx,
        pricedModel(),
        step,
        readStepUpstreamCost(openRouterMeta(i === 0 ? 0.02 : 0.011)),
        logger,
      );
    });
    // What billCompletedSteps does.
    const steps = TokenAccumulator.unbilledCompletedSteps(ctx);
    expect(steps).not.toBeNull();
    if (!steps) {
      return;
    }
    ctx.tokensBilled = true;
    const charge = TokenAccumulator.resolveCharge(ctx, pricedModel(), steps);
    // $0.031 x 1.3 / 0.01 = 4.03 -> 4.1
    expect(charge.credits).toBe(4.1);
    expect(charge.upstreamCost?.upstreamCostUsd).toBeCloseTo(0.031, 12);
    // A second early-end path (or complete()) finds nothing left to bill.
    expect(TokenAccumulator.unbilledCompletedSteps(ctx)).toBeNull();
  });

  it("chargeSingleCall bills a standalone call (compacting) by real cost", () => {
    const charge = TokenAccumulator.chargeSingleCall(
      pricedModel(),
      FIRST_STEP,
      openRouterMeta(0.02),
      logger,
    );
    expect(charge.credits).toBe(2.6);
    expect(charge.upstreamCost?.billingBasis).toBe("upstream_cost");
  });
});
