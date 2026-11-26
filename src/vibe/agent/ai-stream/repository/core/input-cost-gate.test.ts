/**
 * Pre-flight input-cost gate: a prompt whose INPUT alone the wallet cannot
 * cover at the most expensive likely endpoint price is refused (402).
 */

import type { ModelMessage } from "ai";
import { describe, expect, it } from "vitest";

import { ChatModelId, getChatModelById } from "../../models";
import {
  checkInputCost,
  estimatePreflightInputTokens,
  worstCaseInputCredits,
  worstCaseInputTokenCost,
} from "./input-cost-gate";

const kimi = getChatModelById(ChatModelId.KIMI_K3);
const NO_COMPACT = Number.MAX_SAFE_INTEGER;

/** A user message of ~`tokens` estimated tokens (chars / 3.5) */
function userMessage(tokens: number): ModelMessage {
  return { role: "user", content: "x".repeat(Math.round(tokens * 3.5)) };
}

const estimate = (
  output: Extract<ModelMessage, { role: "tool" }>["content"][number] & {
    type: "tool-result";
  },
): number =>
  estimatePreflightInputTokens({
    messages: [{ role: "tool", content: [output] }],
    systemPrompt: "",
    tools: undefined,
    compactTrigger: NO_COMPACT,
  });

describe("worst-case input price", () => {
  it("kimi-k3 prices input at its most expensive endpoint, not the cheapest listed one", () => {
    expect(kimi.inputTokenCost).toBeLessThan(1);
    expect(worstCaseInputTokenCost(kimi)).toBe(4.5);
  });

  it("OpenRouter models without maxInputTokenCost buffer the listed price", () => {
    const model = { ...kimi, maxInputTokenCost: undefined };
    expect(worstCaseInputTokenCost(model)).toBe((kimi.inputTokenCost ?? 0) * 1.5);
  });

  it("covers a full one-hour cache write on Claude routes", () => {
    const model = getChatModelById(ChatModelId.CLAUDE_SONNET_5_5);
    expect(worstCaseInputTokenCost(model)).toBeGreaterThanOrEqual(
      (model.inputTokenCost ?? 0) * 2,
    );
  });

  it("1M input tokens at $4.50/M = 585 credits with the 30% markup", () => {
    expect(worstCaseInputCredits(kimi, 1_000_000)).toBe(585);
    expect(worstCaseInputCredits(kimi, 0)).toBe(0);
  });
});

describe("prompt token estimate", () => {
  it("counts system prompt, tools and every message", () => {
    const tokens = estimatePreflightInputTokens({
      messages: [userMessage(1000), userMessage(2000)],
      systemPrompt: "s".repeat(3500),
      tools: undefined,
      compactTrigger: NO_COMPACT,
    });
    expect(tokens).toBe(1000 + 1000 + 2000);
  });

  it("prices a structured tool image as vision input and inline JSON as text", () => {
    const data = "A".repeat(1_540_000);
    const call = {
      type: "tool-result",
      toolCallId: "image",
      toolName: "generate_image",
    } as const;
    const vision = estimate({
      ...call,
      output: {
        type: "content",
        value: [
          { type: "image-data", data, mediaType: "image/png" },
          { type: "text", text: "Image generated." },
        ],
      },
    });
    expect(vision).toBeGreaterThan(400);
    expect(vision).toBeLessThan(500);
    expect(
      estimate({ ...call, output: { type: "json", value: { data } } }),
    ).toBeGreaterThan(600_000);
  });

  it("history past the compact trigger is summarised; the newest message counts in full", () => {
    const tokens = estimatePreflightInputTokens({
      messages: [userMessage(50_000), userMessage(50_000), userMessage(10_000)],
      systemPrompt: "",
      tools: undefined,
      compactTrigger: 32_000,
    });
    expect(tokens).toBe(32_000 + 10_000);
  });
});

describe("checkInputCost", () => {
  it("refuses a 20-credit guest whose ~300k-token prompt costs ~176 credits of input", () => {
    const result = checkInputCost({
      model: kimi,
      modelCost: 2.5,
      balance: 20,
      messages: [userMessage(300_000)],
      systemPrompt: "",
      tools: undefined,
      compactTrigger: 32_000,
    });
    expect(result.allowed).toBe(false);
    expect(result.inputTokens).toBe(300_000);
    expect(result.inputCredits).toBe(175.5);
  });

  it("lets a normal prompt through on the same wallet", () => {
    const result = checkInputCost({
      model: kimi,
      modelCost: 2.5,
      balance: 20,
      messages: [userMessage(500)],
      systemPrompt: "s".repeat(20_000 * 3.5),
      tools: undefined,
      compactTrigger: 32_000,
    });
    expect(result.allowed).toBe(true);
    expect(result.inputCredits).toBeLessThan(20);
  });

  it("refuses when input alone exceeds the balance, even by a little", () => {
    // 10k tokens at $4.50/M = $0.045 -> 5.9 credits
    const base = {
      model: kimi,
      modelCost: 2.5,
      messages: [userMessage(10_000)],
      systemPrompt: "",
      tools: undefined,
      compactTrigger: NO_COMPACT,
    };
    expect(checkInputCost({ ...base, balance: 5.8 }).allowed).toBe(false);
    expect(checkInputCost({ ...base, balance: 5.9 }).allowed).toBe(true);
  });

  it("free models (flat cost 0) always pass", () => {
    const result = checkInputCost({
      model: kimi,
      modelCost: 0,
      balance: 0,
      messages: [userMessage(300_000)],
      systemPrompt: "",
      tools: undefined,
      compactTrigger: NO_COMPACT,
    });
    expect(result.allowed).toBe(true);
  });
});
