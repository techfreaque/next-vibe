/**
 * Per-step token accounting for the StreamLoop.
 *
 * Stateless: the running counters live on the ToolExecutionContextImpl (core state);
 * these static ops read/write them so multi-step billing stays accurate
 * without a per-loop instance.
 */

import "server-only";

import type { ProviderMetadata } from "ai";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { UsageUpstreamCost } from "@/credits/db";

import {
  ApiProvider,
  calculateCreditCost,
  calculateTokenCostUsd,
  upstreamCostToCredits,
} from "../../../models/models";
import type { ChatModelOption } from "../../models";
import type { ToolExecutionContextImpl } from "../core/stream";

/** The per-step token counters these ops read and write on the stream context. */
export type TokenCounters = Pick<
  ToolExecutionContextImpl,
  | "tokenUncachedInput"
  | "tokenCachedInput"
  | "tokenCacheWrite"
  | "tokenOutput"
  | "tokenLastInput"
  | "tokensBilled"
  | "tokenStepCount"
  | "upstreamCostUsd"
  | "upstreamFallbackCostUsd"
  | "upstreamCostSteps"
  | "upstreamCostMissingSteps"
  | "upstreamProvider"
>;

/** One finished step's token usage (full input, cached part included). */
export interface StepTokens {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  cacheWriteTokens: number;
}

/** The real upstream cost one step reported, read from provider metadata. */
export interface StepUpstreamCost {
  /** USD, null when the step reported none. */
  costUsd: number | null;
  /** Upstream endpoint that served the step, when reported. */
  provider: string | null;
}

/** What a turn (or a set of finished steps) is charged. */
export interface TurnCharge {
  credits: number;
  /** Set when the charge is based on the real upstream cost. */
  upstreamCost: UsageUpstreamCost | undefined;
}

/**
 * Models billed by the provider's REAL per-step cost x markup instead of the
 * listed token price. OpenRouter load-balances a model across endpoints up to
 * ~5x pricier than the cheapest one we list, and returns the real charge as
 * usage.cost on every step. Other providers return no reliable cost.
 * Media / per-message priced models keep their fixed price.
 */
export function billsUpstreamCost(
  modelConfig: Pick<ChatModelOption, "apiProvider" | "creditCost">,
): boolean {
  return (
    modelConfig.apiProvider === ApiProvider.OPENROUTER &&
    typeof modelConfig.creditCost === "function"
  );
}

/** OpenRouter's per-step usage.cost + serving endpoint from provider metadata. */
export function readStepUpstreamCost(
  providerMetadata: ProviderMetadata | undefined,
): StepUpstreamCost {
  const openrouter = providerMetadata?.openrouter;
  const provider =
    typeof openrouter?.provider === "string" && openrouter.provider !== ""
      ? openrouter.provider
      : null;
  const usage = openrouter?.usage;
  if (
    usage === null ||
    usage === undefined ||
    typeof usage !== "object" ||
    !("cost" in usage)
  ) {
    return { costUsd: null, provider };
  }
  const cost = usage.cost;
  return {
    costUsd:
      typeof cost === "number" && Number.isFinite(cost) && cost >= 0
        ? cost
        : null,
    provider,
  };
}

/** Billable token totals in the shape calculateCreditCost expects.
 *  inputTokens is the FULL input: calculateCreditCost subtracts cached itself. */
export type BillableTokens = StepTokens;

/** Accumulates per-step token counts for accurate multi-step credit billing. */
export class TokenAccumulator {
  static accumulate(ctx: TokenCounters, step: StepTokens): void {
    ctx.tokenStepCount += 1;
    if (step.inputTokens > 0) {
      ctx.tokenLastInput = step.inputTokens;
    }
    // Sum uncached input across steps (not raw inputTokens) to avoid counting
    // cached history multiple times — each step re-sends the full prompt.
    ctx.tokenUncachedInput += Math.max(
      0,
      step.inputTokens - step.cachedInputTokens,
    );
    ctx.tokenCachedInput += step.cachedInputTokens;
    ctx.tokenCacheWrite += step.cacheWriteTokens;
    ctx.tokenOutput += step.outputTokens;
  }

  /**
   * Merge accumulated step data with the SDK's aggregate totals.
   * For models with supportsTools=false, onStepFinish is never registered so
   * accumulators stay at zero — fall back to SDK aggregate (single-step, accurate).
   */
  static finalize(
    ctx: TokenCounters,
    sdk: {
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens: number;
    },
    providerCacheWriteTokens: number,
  ): {
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    uncachedInputTokens: number;
    cacheWriteTokens: number;
  } {
    const noStepData = ctx.tokenLastInput === 0 && ctx.tokenOutput === 0;
    const cacheWriteTokens =
      ctx.tokenCacheWrite > 0 ? ctx.tokenCacheWrite : providerCacheWriteTokens;
    return noStepData
      ? {
          inputTokens: sdk.inputTokens,
          outputTokens: sdk.outputTokens,
          cachedInputTokens: sdk.cachedInputTokens,
          uncachedInputTokens: Math.max(
            0,
            sdk.inputTokens - sdk.cachedInputTokens,
          ),
          cacheWriteTokens,
        }
      : {
          inputTokens: ctx.tokenLastInput,
          outputTokens: ctx.tokenOutput,
          cachedInputTokens: ctx.tokenCachedInput,
          uncachedInputTokens: ctx.tokenUncachedInput,
          cacheWriteTokens,
        };
  }

  /**
   * Record one finished step's REAL upstream cost (actual-cost models only).
   * A step without a reported cost (stream cut, provider omitted it) falls
   * back to its listed token price and logs a warning, so finance can see
   * how often that happens. Call once per finished step, next to accumulate().
   */
  static recordUpstreamCost(
    ctx: TokenCounters,
    modelConfig: ChatModelOption,
    step: StepTokens,
    upstream: StepUpstreamCost,
    logger: EndpointLogger,
  ): void {
    if (!billsUpstreamCost(modelConfig)) {
      return;
    }
    if (upstream.costUsd !== null) {
      ctx.upstreamCostUsd += upstream.costUsd;
      ctx.upstreamCostSteps += 1;
      if (upstream.provider) {
        ctx.upstreamProvider = upstream.provider;
      }
      return;
    }
    const fallbackUsd = calculateTokenCostUsd(
      modelConfig,
      step.inputTokens,
      step.outputTokens,
      step.cachedInputTokens,
      step.cacheWriteTokens,
    );
    ctx.upstreamFallbackCostUsd += fallbackUsd;
    ctx.upstreamCostMissingSteps += 1;
    logger.warn(
      "[AI Stream] Upstream cost missing for step - billing listed token price",
      {
        model: modelConfig.id,
        apiProvider: modelConfig.apiProvider,
        providerModel: modelConfig.providerModel,
        upstreamProvider: upstream.provider,
        ...step,
        fallbackUsd,
      },
    );
  }

  /**
   * What the accumulated finished steps are charged. Actual-cost models with
   * at least one costed step: (real cost + fallback token cost of uncosted
   * steps) x markup, ceil to 0.1 credit. Everything else (other providers,
   * or no step reported a cost at all): the listed token price, unchanged.
   */
  static resolveCharge(
    ctx: TokenCounters,
    modelConfig: ChatModelOption,
    tokens: StepTokens,
  ): TurnCharge {
    if (billsUpstreamCost(modelConfig) && ctx.upstreamCostSteps > 0) {
      return {
        credits: upstreamCostToCredits(
          ctx.upstreamCostUsd + ctx.upstreamFallbackCostUsd,
        ),
        upstreamCost: {
          upstreamCostUsd: ctx.upstreamCostUsd,
          fallbackCostUsd: ctx.upstreamFallbackCostUsd,
          upstreamProvider: ctx.upstreamProvider,
          billingBasis:
            ctx.upstreamCostMissingSteps > 0 ? "mixed" : "upstream_cost",
        },
      };
    }
    return {
      credits: calculateCreditCost(
        modelConfig,
        tokens.inputTokens,
        tokens.outputTokens,
        tokens.cachedInputTokens,
        tokens.cacheWriteTokens,
      ),
      upstreamCost: undefined,
    };
  }

  /**
   * Charge for ONE standalone model call outside the turn loop (compacting):
   * same actual-cost rules, with throwaway counters.
   */
  static chargeSingleCall(
    modelConfig: ChatModelOption,
    tokens: StepTokens,
    providerMetadata: ProviderMetadata | undefined,
    logger: EndpointLogger,
  ): TurnCharge {
    const counters: TokenCounters = {
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
    TokenAccumulator.recordUpstreamCost(
      counters,
      modelConfig,
      tokens,
      readStepUpstreamCost(providerMetadata),
      logger,
    );
    return TokenAccumulator.resolveCharge(counters, modelConfig, tokens);
  }

  /**
   * Billable totals of the steps that already FINISHED, for a turn that ends
   * without complete(): endLoop / approve / wait park-aborts, user stop,
   * client disconnect, superseded, provider error. Those paths used to drop
   * every finished step on the floor (a new thread's first turn ends with
   * rename-thread + endLoop, so it was never billed). null when no step
   * finished or the turn was already billed. Token counts can be all zero for
   * per-message priced models; calculateCreditCost still charges them.
   */
  static unbilledCompletedSteps(ctx: TokenCounters): BillableTokens | null {
    if (ctx.tokensBilled) {
      return null;
    }
    if (ctx.tokenStepCount === 0) {
      return null;
    }
    return {
      inputTokens: ctx.tokenUncachedInput + ctx.tokenCachedInput,
      outputTokens: ctx.tokenOutput,
      cachedInputTokens: ctx.tokenCachedInput,
      cacheWriteTokens: ctx.tokenCacheWrite,
    };
  }
}
