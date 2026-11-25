/**
 * Output-cost cap: each step's maxOutputTokens is bounded by what the wallet
 * can pay after the worst-case input, so a low balance can no longer buy
 * ~120k reasoning tokens (prod 2026-11-16/17: 251 credits on a 20 balance).
 */

import { describe, expect, it } from "vitest";

import { ChatModelId, getChatModelById } from "../../models";
import { worstCaseInputCredits } from "./input-cost-gate";
import {
  affordableOutputTokens,
  canFundCompaction,
  computeOutputCap,
  MIN_AFFORDABLE_OUTPUT_TOKENS,
  MIN_AFFORDABLE_REASONING_OUTPUT_TOKENS,
  minAffordableOutputTokens,
  worstCaseOutputCredits,
  worstCaseOutputTokenCost,
} from "./output-cost-cap";

const kimi = getChatModelById(ChatModelId.KIMI_K3);
const flat = getChatModelById(ChatModelId.UNCENSORED_LM_V1_2);

describe("output price", () => {
  it("kimi-k3 prices output at its listed token price", () => {
    expect(worstCaseOutputTokenCost(kimi)).toBe(kimi.outputTokenCost);
  });

  it("flat-priced models have no output price", () => {
    expect(worstCaseOutputTokenCost(flat)).toBeNull();
    expect(affordableOutputTokens(flat, 1)).toBe(Number.POSITIVE_INFINITY);
  });

  it("affordable tokens and their cost round-trip", () => {
    const tokens = affordableOutputTokens(kimi, 10);
    expect(worstCaseOutputCredits(kimi, tokens)).toBeLessThanOrEqual(10);
    expect(worstCaseOutputCredits(kimi, tokens + 1)).toBeGreaterThan(10 - 1e-9);
  });
});

describe("computeOutputCap", () => {
  it("20 credits on kimi-k3 bounds the output well below a runaway reasoning turn", () => {
    const inputTokens = 20_000;
    const cap = computeOutputCap({
      model: kimi,
      modelCost: 2.5,
      remainingCredits: 20,
      inputTokens,
    });
    expect(cap.kind).toBe("capped");
    if (cap.kind !== "capped") {
      return;
    }
    // 20 credits - 11.7 input = 8.3 credits of output at $16/M = ~4k tokens
    expect(cap.maxOutputTokens).toBeGreaterThan(MIN_AFFORDABLE_OUTPUT_TOKENS);
    expect(cap.maxOutputTokens).toBeLessThan(5_000);
    const worstTurn =
      worstCaseInputCredits(kimi, inputTokens) +
      worstCaseOutputCredits(kimi, cap.maxOutputTokens);
    // Worst case stays inside the wallet (input rounds up to 0.1 credit).
    expect(worstTurn).toBeLessThanOrEqual(20);
  });

  it("a big balance is not capped at all", () => {
    const cap = computeOutputCap({
      model: kimi,
      modelCost: 2.5,
      remainingCredits: 100_000,
      inputTokens: 20_000,
    });
    expect(cap.kind).toBe("uncapped");
  });

  it("a mid balance caps only above what a normal answer needs", () => {
    const cap = computeOutputCap({
      model: kimi,
      modelCost: 2.5,
      remainingCredits: 500,
      inputTokens: 20_000,
    });
    expect(cap.kind).toBe("capped");
    if (cap.kind === "capped") {
      expect(cap.maxOutputTokens).toBeGreaterThan(100_000);
    }
  });

  it("refuses when the input leaves less than the minimum output", () => {
    // 10k tokens input = 5.9 credits; kimi-k3 reasons, so its 2048-token
    // floor adds ~4.3
    const base = { model: kimi, modelCost: 2.5, inputTokens: 10_000 };
    const refused = computeOutputCap({ ...base, remainingCredits: 7 });
    expect(refused.kind).toBe("unaffordable");
    if (refused.kind === "unaffordable") {
      expect(refused.requiredCredits).toBeGreaterThan(10);
      expect(refused.requiredCredits).toBeLessThan(11);
    }
    expect(computeOutputCap({ ...base, remainingCredits: 11 }).kind).toBe(
      "capped",
    );
  });

  it("refuses unpaid input even when the prompt fills the context window", () => {
    expect(
      computeOutputCap({
        model: kimi,
        modelCost: 2.5,
        remainingCredits: 20,
        inputTokens: kimi.contextWindow,
      }).kind,
    ).toBe("unaffordable");
  });

  it("an empty wallet is unaffordable", () => {
    expect(
      computeOutputCap({
        model: kimi,
        modelCost: 2.5,
        remainingCredits: 0,
        inputTokens: 1_000,
      }).kind,
    ).toBe("unaffordable");
  });

  it("reserves the answer fee before spending on a flat-priced summary", () => {
    expect(canFundCompaction(flat, 6.5, 7)).toBe(false);
    expect(canFundCompaction(flat, 6.5, 13)).toBe(true);
  });

  it("flat-priced models require the full fee and leave output uncapped", () => {
    const params = { model: flat, modelCost: 6.5, inputTokens: 50_000 };
    expect(computeOutputCap({ ...params, remainingCredits: 6.5 })).toEqual({
      kind: "uncapped",
    });
    expect(computeOutputCap({ ...params, remainingCredits: 6.49 })).toEqual({
      kind: "unaffordable",
      requiredCredits: 6.5,
    });
  });

  it("free models (flat cost 0) are never capped", () => {
    expect(
      computeOutputCap({
        model: kimi,
        modelCost: 0,
        remainingCredits: 0,
        inputTokens: 50_000,
      }).kind,
    ).toBe("uncapped");
  });

  it("a reasoning model is refused when the balance buys only a few hundred tokens", () => {
    const deepseek = getChatModelById(ChatModelId.DEEPSEEK_V4_PRO);
    expect(minAffordableOutputTokens(deepseek)).toBe(
      MIN_AFFORDABLE_REASONING_OUTPUT_TOKENS,
    );
    const inputTokens = 8_000;
    // Enough for the input plus ~400 output tokens: reasoning-only, no answer
    const remainingCredits =
      worstCaseInputCredits(deepseek, inputTokens) +
      worstCaseOutputCredits(deepseek, 400);
    const cap = computeOutputCap({
      model: deepseek,
      modelCost: 1,
      remainingCredits,
      inputTokens,
    });
    expect(cap.kind).toBe("unaffordable");
    if (cap.kind === "unaffordable") {
      expect(cap.requiredCredits).toBeGreaterThan(remainingCredits);
    }
  });
});
