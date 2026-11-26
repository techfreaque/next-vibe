/**
 * Pre-flight input-cost gate.
 *
 * The flat credit check (credit-validator-handler) prices a fixed 16k/1k
 * token turn at the model's LISTED price. OpenRouter lists the cheapest
 * endpoint but routes across all of them: kimi-k3 lists $0.20/M input while
 * most endpoints charge $3-4.50/M. One 20-credit guest prompt routed to
 * Amazon Bedrock cost $1.94 (251.7 credits) and only 17.8 could be charged.
 *
 * This gate prices the ACTUAL prompt (system prompt + tools + messages) at
 * the buffered input price and refuses when the wallet cannot
 * cover the input alone. Output is not capped here.
 */

import type { ModelMessage } from "ai";
import type { CoreTool } from "next-vibe/platforms/ai/tools-loader";

import { ApiProvider, upstreamCostToCredits } from "../../../models/models";
import { activeTokenRates } from "../../../models/token-tariffs";
import type { ChatModelOption } from "../../models";
import { OPENROUTER_TOKEN_FALLBACK_MULTIPLIER } from "../../providers/openrouter/pricing";
import { estimateInputTokens } from "./token-estimator";

/**
 * Input tokens the first step will send. History beyond the compact trigger
 * is summarised before the call, so only the newest message counts in full
 * past that point. `compactTrigger` = Number.MAX_SAFE_INTEGER when compacting
 * is disabled (the full history is sent).
 */
export function estimatePreflightInputTokens(params: {
  messages: ModelMessage[];
  systemPrompt: string;
  tools: Record<string, CoreTool> | undefined;
  compactTrigger: number;
}): number {
  const { messages, systemPrompt, tools, compactTrigger } = params;
  const overhead = estimateInputTokens([], systemPrompt, tools);
  const historyTokens = estimateInputTokens(messages, "", undefined);
  const newest = messages.at(-1);
  const newestTokens = newest
    ? estimateInputTokens([newest], "", undefined)
    : 0;
  const sentHistory = Math.min(historyTokens, compactTrigger + newestTokens);
  return overhead + sentHistory;
}

/**
 * USD per 1M input tokens reserved for the call: the largest applicable
 * tariff, including OpenRouter's observed maximum and fallback buffer.
 * null for flat-priced models (no token pricing: the flat check covers them).
 */
export function worstCaseInputTokenCost(
  model: ChatModelOption,
  inputTokens = 0,
): number | null {
  if (typeof model.inputTokenCost !== "number") {
    return null;
  }
  const rates = activeTokenRates(model, inputTokens);
  const input = rates.inputTokenCost ?? model.inputTokenCost;
  const multiplier =
    model.apiProvider === ApiProvider.OPENROUTER
      ? OPENROUTER_TOKEN_FALLBACK_MULTIPLIER
      : 1;
  return Math.max(
    model.maxInputTokenCost ?? 0,
    multiplier *
      Math.max(
        input,
        rates.cacheReadTokenCost ?? 0,
        rates.cacheWriteTokenCost ?? 0,
        rates.cacheWrite1hTokenCost ?? 0,
      ),
  );
}

/** Credits (with platform markup) for `inputTokens` at the worst-case price */
export function worstCaseInputCredits(
  model: ChatModelOption,
  inputTokens: number,
): number {
  const perMillion = worstCaseInputTokenCost(model, inputTokens);
  if (perMillion === null || inputTokens <= 0) {
    return 0;
  }
  return upstreamCostToCredits((perMillion / 1_000_000) * inputTokens);
}

export interface InputCostGateResult {
  allowed: boolean;
  inputTokens: number;
  inputCredits: number;
}

/**
 * Can the wallet cover the request's input at the worst-case price?
 * Free models (flat cost 0) always pass.
 */
export function checkInputCost(params: {
  model: ChatModelOption;
  modelCost: number;
  balance: number;
  messages: ModelMessage[];
  systemPrompt: string;
  tools: Record<string, CoreTool> | undefined;
  compactTrigger: number;
}): InputCostGateResult {
  const { model, modelCost, balance } = params;
  const inputTokens = estimatePreflightInputTokens(params);
  const inputCredits =
    modelCost === 0 ? 0 : worstCaseInputCredits(model, inputTokens);
  return {
    allowed: inputCredits <= balance,
    inputTokens,
    inputCredits,
  };
}
