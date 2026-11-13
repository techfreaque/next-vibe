/**
 * Per-step token accounting for the StreamLoop.
 *
 * Stateless: the running counters live on the ToolExecutionContextImpl (core state);
 * these static ops read/write them so multi-step billing stays accurate
 * without a per-loop instance.
 */

import "server-only";

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
>;

/** Billable token totals in the shape calculateCreditCost expects. */
export interface BillableTokens {
  /** FULL input (uncached + cached): calculateCreditCost subtracts cached itself. */
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  cacheWriteTokens: number;
}

/** Accumulates per-step token counts for accurate multi-step credit billing. */
export class TokenAccumulator {
  static accumulate(
    ctx: TokenCounters,
    step: {
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens: number;
      cacheWriteTokens: number;
    },
  ): void {
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
