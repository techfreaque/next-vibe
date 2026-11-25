/**
 * Output-cost cap: bound every model step's OUTPUT to what the wallet can pay.
 *
 * Billing runs after the turn and lets model usage deduct partially (to 0):
 * whatever the provider generated beyond the balance was forgiven. Nothing
 * capped the output, so a 20-credit guest on kimi-k3 got ~120k reasoning
 * tokens (~$1.93 = 251 credits) and paid 20 (prod, 2026-11-16/17).
 *
 * Per step: remaining credits - worst-case input credits = output budget,
 * converted to tokens at the model's output price (reasoning tokens bill as
 * output). The result is passed to the AI SDK as maxOutputTokens. A wallet
 * that can pay the full context window of output is not capped at all, so
 * normal paid balances see no change. For flat-priced models, the wallet
 * must cover the full request, regardless of output length.
 */

import {
  CREDIT_VALUE_USD,
  STANDARD_MARKUP_PERCENTAGE,
} from "@/products/constants";

import { ModelUtility } from "../../../models/enum";
import { activeTokenRates } from "../../../models/token-tariffs";
import type { ChatModelOption } from "../../models";
import { worstCaseInputCredits } from "./input-cost-gate";

/**
 * Smallest output a step is allowed to start with. Below this the turn is
 * refused (402) up-front, or the tool loop stops before the next step.
 */
export const MIN_AFFORDABLE_OUTPUT_TOKENS = 256;

/**
 * Reasoning models spend the first hundreds of output tokens thinking: a
 * 256-400 token cap bought only reasoning and no answer, billed anyway
 * (prod 2026-11-17: deepseek-v4-pro guests, "Turn ended without answer
 * text" / empty streams). They need room for a short thought plus a reply.
 */
export const MIN_AFFORDABLE_REASONING_OUTPUT_TOKENS = 2048;

/** Smallest output worth starting a step with on this model. */
export function minAffordableOutputTokens(model: ChatModelOption): number {
  return model.utilities.includes(ModelUtility.REASONING)
    ? MIN_AFFORDABLE_REASONING_OUTPUT_TOKENS
    : MIN_AFFORDABLE_OUTPUT_TOKENS;
}

/**
 * USD per 1M output tokens the step may be billed at. Image-output models
 * bill image tokens at their (higher) image rate. null = not token-priced.
 */
export function worstCaseOutputTokenCost(
  model: ChatModelOption,
  promptTokens?: number,
): number | null {
  if (typeof model.outputTokenCost !== "number") {
    return null;
  }
  const imageRate =
    model.outputs.includes("image") && "imageOutputTokenCost" in model
      ? (model.imageOutputTokenCost ?? 0)
      : 0;
  return Math.max(
    activeTokenRates(model, promptTokens).outputTokenCost ??
      model.outputTokenCost,
    imageRate,
  );
}

/** Credits (with platform markup) that `outputTokens` cost at worst case */
export function worstCaseOutputCredits(
  model: ChatModelOption,
  outputTokens: number,
  promptTokens?: number,
): number {
  const perMillion = worstCaseOutputTokenCost(model, promptTokens);
  if (perMillion === null || perMillion <= 0 || outputTokens <= 0) {
    return 0;
  }
  return (
    (((perMillion / 1_000_000) * outputTokens) / CREDIT_VALUE_USD) *
    (1 + STANDARD_MARKUP_PERCENTAGE)
  );
}

/** Whole output tokens `credits` can pay for. Infinity when output is free. */
export function affordableOutputTokens(
  model: ChatModelOption,
  credits: number,
  promptTokens?: number,
): number {
  const perMillion = worstCaseOutputTokenCost(model, promptTokens);
  if (perMillion === null || perMillion <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  if (credits <= 0) {
    return 0;
  }
  const usd = (credits * CREDIT_VALUE_USD) / (1 + STANDARD_MARKUP_PERCENTAGE);
  return Math.floor((usd / perMillion) * 1_000_000);
}

/** A flat-priced summary and the answer each incur a full request fee. */
export function canFundCompaction(
  model: ChatModelOption,
  modelCost: number,
  remainingCredits: number,
): boolean {
  return (
    typeof model.creditCost !== "number" ||
    remainingCredits + 1e-9 >= 2 * modelCost
  );
}

export type OutputCap =
  /** The wallet covers any output the model can produce: pass nothing. */
  | { kind: "uncapped" }
  /** Pass maxOutputTokens to the model call. */
  | { kind: "capped"; maxOutputTokens: number }
  /** The wallet cannot cover the request or its minimum token budget. */
  | { kind: "unaffordable"; requiredCredits: number };

/**
 * Output cap for one model step.
 * @param remainingCredits spendable credits left for THIS step (balance at
 *   turn start minus everything this turn already spent)
 * @param inputTokens the step's input (estimated or reported)
 */
export function computeOutputCap(params: {
  model: ChatModelOption;
  modelCost: number;
  remainingCredits: number;
  inputTokens: number;
}): OutputCap {
  const { model, modelCost, remainingCredits, inputTokens } = params;
  if (modelCost === 0) {
    return { kind: "uncapped" };
  }
  if (typeof model.creditCost === "number") {
    return remainingCredits + 1e-9 >= modelCost
      ? { kind: "uncapped" }
      : { kind: "unaffordable", requiredCredits: modelCost };
  }
  const outputPrice = worstCaseOutputTokenCost(model, inputTokens);
  if (outputPrice === null || outputPrice <= 0) {
    return { kind: "uncapped" };
  }
  const inputCredits = worstCaseInputCredits(model, inputTokens);
  const affordable = affordableOutputTokens(
    model,
    remainingCredits - inputCredits,
    inputTokens,
  );
  // The model can never write more than the context window leaves.
  const maxPossibleOutput = Math.max(0, model.contextWindow - inputTokens);
  if (remainingCredits >= inputCredits && affordable >= maxPossibleOutput) {
    return { kind: "uncapped" };
  }
  const minOutput = minAffordableOutputTokens(model);
  if (affordable < minOutput) {
    return {
      kind: "unaffordable",
      requiredCredits:
        Math.ceil(
          (inputCredits +
            worstCaseOutputCredits(model, minOutput, inputTokens)) *
            10,
        ) / 10,
    };
  }
  return { kind: "capped", maxOutputTokens: affordable };
}
