/**
 * Per-step token accounting for the StreamLoop.
 *
 * Stateless: the running counters live on the ToolExecutionContextImpl (core state);
 * these static ops read/write them so multi-step billing stays accurate
 * without a per-loop instance.
 */

import "server-only";

import type { ToolExecutionContextImpl } from "../core/stream";

/** Accumulates per-step token counts for accurate multi-step credit billing. */
export class TokenAccumulator {
  static accumulate(
    ctx: ToolExecutionContextImpl,
    step: {
      inputTokens: number;
      outputTokens: number;
      cachedInputTokens: number;
      cacheWriteTokens: number;
    },
  ): void {
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
    ctx: ToolExecutionContextImpl,
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
}
