/**
 * Per-step token accounting for the StreamLoop.
 *
 * Stateless: the running counters live on the ToolExecutionContextImpl (core state);
 * these static ops read/write them so multi-step billing stays accurate
 * without a per-loop instance.
 */

import "server-only";

import type { JSONValue, ProviderMetadata } from "ai";
import type { EndpointLogger } from "next-vibe/logger/types";

import type { UsageUpstreamCost } from "@/credits/db";

import {
  ApiProvider,
  calculateCreditCost,
  calculateTokenCostUsd,
  DEFAULT_ESTIMATED_IMAGE_OUTPUT_TOKENS,
  listedCostToCredits,
  type ModelOptionTokenBased,
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
  | "tokenImageOutput"
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
  hourWriteTokens?: number;
  requestStartedAt?: number;
  promptCountKnown?: boolean;
  /** IMAGE part of outputTokens (image-output models). Billed at the model's
   *  imageOutputTokenCost in the token-price fallback. Absent = 0. */
  imageOutputTokens?: number;
}

/** The real upstream cost one step reported, read from provider metadata. */
export interface StepUpstreamCost {
  /** USD, null when the step reported none. */
  costUsd: number | null;
  /** Upstream endpoint that served the step, when reported. */
  provider: string | null;
  /** The provider-metadata usage object as reported (null when absent), for
   *  logging a missing cost. */
  reportedUsage: JSONValue | null;
}

/** What a turn (or a set of finished steps) is charged. */
export interface TurnCharge {
  credits: number;
  /** Set when the charge is based on the real upstream cost. */
  upstreamCost: UsageUpstreamCost | undefined;
}

/**
 * Token-priced models whose provider reports the REAL charge of every call:
 * OpenRouter (`usage.cost`; it load-balances a model across endpoints up to
 * ~5x pricier than the cheapest one we list), NanoGPT (`usage.cost` /
 * `x_nanogpt_pricing`) and Venice (`cost.usd`). The NanoGPT and Venice
 * providers surface it as provider metadata `{ <apiProvider>: { usage: { cost } } }`,
 * the same shape OpenRouter uses.
 */
const UPSTREAM_COST_PROVIDERS: ReadonlySet<ApiProvider> = new Set([
  ApiProvider.OPENROUTER,
  ApiProvider.NANO_GPT,
  ApiProvider.VENICE_AI,
  ApiProvider.CLAUDE_CODE,
]);

/** Model shapes the actual-cost rules bill (chat + vision bridge models). */
export type UpstreamBilledModel = ChatModelOption | ModelOptionTokenBased;

/**
 * Models billed by the provider's REAL per-step cost x markup instead of the
 * listed token price (see UPSTREAM_COST_PROVIDERS). Other providers return no
 * reliable cost. Media / per-message priced models keep their fixed price.
 */
export function billsUpstreamCost(
  modelConfig: Pick<ChatModelOption, "apiProvider" | "creditCost">,
): boolean {
  return (
    UPSTREAM_COST_PROVIDERS.has(modelConfig.apiProvider) &&
    typeof modelConfig.creditCost === "function"
  );
}

/**
 * IMAGE output tokens of one step. OpenRouter reports them in the raw usage
 * (`completion_tokens_details.image_tokens`), which the provider package
 * passes through as `usage.raw` but does not map. When the provider gives no
 * split but the step produced an image, ALL its output tokens count as image
 * tokens: the image rate is 4-20x the text rate, so this never bills under
 * the real cost. Clamped to outputTokens.
 */
export function readImageOutputTokens(
  usage: { outputTokens?: number; raw?: JSONValue },
  producedImage: boolean,
): number {
  const outputTokens = Math.max(0, usage.outputTokens ?? 0);
  const raw = usage.raw;
  if (isJsonRecord(raw)) {
    const details = raw.completion_tokens_details;
    if (isJsonRecord(details)) {
      const imageTokens = details.image_tokens;
      if (
        typeof imageTokens === "number" &&
        Number.isFinite(imageTokens) &&
        imageTokens >= 0
      ) {
        return Math.min(imageTokens, outputTokens);
      }
    }
  }
  return producedImage ? outputTokens : 0;
}

const count = (value: JSONValue | undefined): number | undefined =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : undefined;

/** Cache splits can be absent in SDK mappings even when present on the wire. */
export function readCacheUsage(
  usage: {
    inputTokenDetails?: { cacheReadTokens?: number; cacheWriteTokens?: number };
    cachedInputTokens?: number;
    raw?: JSONValue;
  },
  providerMetadata?: ProviderMetadata,
  hourCacheRequested = false,
): {
  cachedInputTokens: number;
  cacheWriteTokens: number;
  hourWriteTokens: number;
} {
  const raw = isJsonRecord(usage.raw) ? usage.raw : {};
  const details = isJsonRecord(raw.prompt_tokens_details)
    ? raw.prompt_tokens_details
    : {};
  const cacheWriteTokens =
    count(details.cache_write_tokens) ??
    count(raw.cache_creation_input_tokens) ??
    count(providerMetadata?.["claude-code"]?.cacheWriteTokens) ??
    usage.inputTokenDetails?.cacheWriteTokens ??
    0;
  const breakdown = isJsonRecord(raw.cache_creation) ? raw.cache_creation : {};
  const hourWriteTokens =
    count(breakdown.ephemeral_1h_input_tokens) ??
    count(providerMetadata?.["claude-code"]?.hourWriteTokens) ??
    (hourCacheRequested ? cacheWriteTokens : 0);
  return {
    cachedInputTokens:
      count(details.cached_tokens) ??
      count(raw.cache_read_input_tokens) ??
      count(raw.prompt_cache_hit_tokens) ??
      count(raw.cachedContentTokenCount) ??
      usage.inputTokenDetails?.cacheReadTokens ??
      usage.cachedInputTokens ??
      0,
    cacheWriteTokens,
    hourWriteTokens,
  };
}

function isJsonRecord(
  value: JSONValue | undefined,
): value is { readonly [key: string]: JSONValue | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** True when any generated file of the step is an image. */
export function producedImageFile(
  files: ReadonlyArray<{ mediaType: string }> | undefined,
): boolean {
  return files?.some((file) => file.mediaType.startsWith("image/")) ?? false;
}

/** Estimated charge of a step cut off before the provider reported usage. */
export interface CutOffStepEstimate {
  credits: number;
  /** Text estimate + the estimated image tokens. */
  completionTokens: number;
  /** IMAGE part of completionTokens. */
  imageOutputTokens: number;
}

/**
 * Credits for an in-flight step that was cut off (user stop, disconnect):
 * no usage arrives, so the prompt and the streamed text are estimated from
 * context. Images the step already delivered never show up in that text
 * estimate, so each adds the model's estimated image tokens, priced at its
 * imageOutputTokenCost (models without one fall back to the output rate).
 */
export function estimateCutOffStepCost(
  modelConfig: Parameters<typeof calculateCreditCost>[0] & {
    estimatedImageOutputTokens?: number;
  },
  promptTokens: number,
  textCompletionTokens: number,
  imageCount: number,
  requestStartedAt?: number,
): CutOffStepEstimate {
  const imageOutputTokens =
    Math.max(0, imageCount) *
    (modelConfig.estimatedImageOutputTokens ??
      DEFAULT_ESTIMATED_IMAGE_OUTPUT_TOKENS);
  const completionTokens =
    Math.max(0, textCompletionTokens) + imageOutputTokens;
  return {
    credits: calculateCreditCost(
      modelConfig,
      promptTokens,
      completionTokens,
      0,
      0,
      imageOutputTokens,
      0,
      requestStartedAt,
      false,
    ),
    completionTokens,
    imageOutputTokens,
  };
}

/**
 * A step's real upstream usage.cost + serving endpoint from provider metadata
 * (OpenRouter, or the NanoGPT / Venice cost the providers attach under their
 * ApiProvider key). OpenRouter wins when several are present.
 */
export function readStepUpstreamCost(
  providerMetadata: ProviderMetadata | undefined,
): StepUpstreamCost {
  const costKey = [...UPSTREAM_COST_PROVIDERS].find(
    (key) => providerMetadata?.[key]?.usage !== undefined,
  );
  const entry = costKey ? providerMetadata?.[costKey] : undefined;
  const provider =
    typeof entry?.provider === "string" && entry.provider !== ""
      ? entry.provider
      : null;
  const usage = entry?.usage;
  const reportedUsage = usage ?? null;
  if (!isJsonRecord(usage)) {
    return { costUsd: null, provider, reportedUsage };
  }
  const upstream = isJsonRecord(usage.costDetails)
    ? usage.costDetails.upstreamInferenceCost
    : undefined;
  const costs = [usage.cost, upstream].filter(
    (value): value is number =>
      typeof value === "number" && Number.isFinite(value) && value >= 0,
  );
  return {
    costUsd: costs.length ? Math.max(...costs) : null,
    provider,
    reportedUsage,
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
    ctx.tokenImageOutput += step.imageOutputTokens ?? 0;
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
      imageOutputTokens: number;
    },
    providerCacheWriteTokens: number,
  ): {
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    uncachedInputTokens: number;
    cacheWriteTokens: number;
    imageOutputTokens: number;
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
          imageOutputTokens: sdk.imageOutputTokens,
        }
      : {
          inputTokens: ctx.tokenLastInput,
          outputTokens: ctx.tokenOutput,
          cachedInputTokens: ctx.tokenCachedInput,
          uncachedInputTokens: ctx.tokenUncachedInput,
          cacheWriteTokens,
          imageOutputTokens: ctx.tokenImageOutput,
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
    modelConfig: UpstreamBilledModel,
    step: StepTokens,
    upstream: StepUpstreamCost,
    logger: EndpointLogger,
  ): void {
    const usesInvoice = billsUpstreamCost(modelConfig);
    if (
      !usesInvoice &&
      !modelConfig.pricingTiers?.length &&
      !modelConfig.longContextPricing
    ) {
      return;
    }
    if (usesInvoice && upstream.costUsd !== null) {
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
      step.imageOutputTokens ?? 0,
      step.hourWriteTokens ?? 0,
      step.requestStartedAt,
      step.promptCountKnown,
    );
    ctx.upstreamFallbackCostUsd += fallbackUsd;
    ctx.upstreamCostMissingSteps += 1;
    if (!usesInvoice) {
      return;
    }
    logger.warn(
      "[AI Stream] Upstream cost missing for step - billing listed token price",
      {
        model: modelConfig.id,
        apiProvider: modelConfig.apiProvider,
        providerModel: modelConfig.providerModel,
        upstreamProvider: upstream.provider,
        ...step,
        fallbackUsd,
        // What the provider DID report, so the next missing cost is diagnosable.
        reportedUsage: upstream.reportedUsage,
        upstreamCostEvidence:
          upstream.reportedUsage === null
            ? "usage-missing"
            : typeof upstream.reportedUsage === "object" &&
                "cost" in upstream.reportedUsage
              ? "cost-invalid"
              : "cost-field-missing",
        // No tokens at all = the step failed upstream before any usage (its
        // error part is logged separately); nothing is billed for it.
        emptyStep: step.inputTokens === 0 && step.outputTokens === 0,
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
    modelConfig: UpstreamBilledModel,
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
    if (ctx.upstreamCostMissingSteps > 0) {
      // Tier thresholds and one-hour writes belong to individual calls.
      return {
        credits: listedCostToCredits(ctx.upstreamFallbackCostUsd),
        upstreamCost: undefined,
      };
    }
    return {
      credits: calculateCreditCost(
        modelConfig,
        tokens.inputTokens,
        tokens.outputTokens,
        tokens.cachedInputTokens,
        tokens.cacheWriteTokens,
        tokens.imageOutputTokens ?? 0,
        tokens.hourWriteTokens ?? 0,
        tokens.requestStartedAt,
        tokens.promptCountKnown,
      ),
      upstreamCost: undefined,
    };
  }

  /**
   * Credits the finished steps of this turn will be charged (not yet
   * deducted: model usage is billed once at turn end). 0 before any step.
   */
  static spentCredits(
    ctx: TokenCounters,
    modelConfig: ChatModelOption,
  ): number {
    if (ctx.tokenStepCount === 0) {
      return 0;
    }
    return TokenAccumulator.resolveCharge(ctx, modelConfig, {
      inputTokens: ctx.tokenUncachedInput + ctx.tokenCachedInput,
      outputTokens: ctx.tokenOutput,
      cachedInputTokens: ctx.tokenCachedInput,
      cacheWriteTokens: ctx.tokenCacheWrite,
      imageOutputTokens: ctx.tokenImageOutput,
    }).credits;
  }

  /**
   * Charge for ONE standalone model call outside the turn loop (compacting,
   * /v1, describe-image/video): same actual-cost rules, with throwaway counters.
   */
  static chargeSingleCall(
    modelConfig: UpstreamBilledModel,
    tokens: StepTokens,
    providerMetadata: ProviderMetadata | undefined,
    logger: EndpointLogger,
  ): TurnCharge {
    const counters: TokenCounters = {
      tokenUncachedInput: 0,
      tokenCachedInput: 0,
      tokenCacheWrite: 0,
      tokenOutput: 0,
      tokenImageOutput: 0,
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
      imageOutputTokens: ctx.tokenImageOutput,
    };
  }
}
