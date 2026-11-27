/**
 * The one execution path behind every /v1 wire format (OpenAI chat
 * completions, OpenAI responses, Anthropic messages). Each format converts its
 * request into model messages + tools, then hands off here for: model
 * capability checks, the fail-closed credit pre-flight, inference through the
 * shared provider layer, billing at real usage, and the SSE loop (heartbeats,
 * abort, bill-what-ran). Formats only translate; they never bill or call a
 * provider themselves.
 */

import "server-only";

import type { ModelMessage, ProviderMetadata } from "ai";
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import { computeOutputCap } from "next-vibe/agent/ai-stream/repository/core/output-cost-cap";
import { summarizePromptToolHistory } from "next-vibe/agent/ai-stream/repository/loop/prompt-size";
import { TokenAccumulator } from "next-vibe/agent/ai-stream/repository/loop/token-accumulator";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { calculateCreditCost } from "next-vibe/agent/models/models";
import { UncensoredConsentRepository } from "next-vibe/agent/models/uncensored-consent/repository";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { protectedBalance } from "@/credits/anti-farming/spending";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { creditValidator } from "@/credits/validator";
import { formatCreditAmount } from "@/products/credit-money";

import type { V1T } from "../i18n";
import { V1_MAX_OUTPUT_TOKENS } from "./constants";
import {
  extractUpstreamRateLimit,
  type UpstreamRateLimit,
  upstreamRateLimitError,
  type V1Error,
  v1Error,
  type V1ErrorRenderer,
} from "./errors";
import type {
  InferenceRequest,
  InferenceResult,
  InferenceRunner,
  InferenceStreamEvent,
  InferenceTool,
  InferenceToolChoice,
  InferenceUsage,
  OpenAiFinishReason,
} from "./inference";
import { type ModelResolveMode, resolveRequestedModel } from "./models";
import { sseResponse } from "./openai";
import { CHARS_PER_TOKEN } from "./tokens";

export { CHARS_PER_TOKEN, estimateTokens, TOKENS_PER_IMAGE } from "./tokens";

const DEFAULT_ESTIMATED_OUTPUT_TOKENS = 4_096;
/** Idle gap after which a stream sends a heartbeat (clients have idle timeouts). */
export const V1_HEARTBEAT_MS = 15_000;

export function clientIp(request: Request | undefined): string | undefined {
  return (
    request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request?.headers.get("x-real-ip") ||
    undefined
  );
}

/** Resolves the request's model for the API key's user, or a 404 V1Error. */
export async function resolveV1Model(
  requested: string,
  payer: JwtPrivatePayloadType,
  t: V1T,
  mode: ModelResolveMode = "openai",
): Promise<
  { ok: true; model: ChatModelOption } | { ok: false; error: V1Error }
> {
  const availability = await getEnvAvailability();
  const model = resolveRequestedModel(requested, payer, availability, mode);
  if (!model) {
    return {
      ok: false,
      error: v1Error(
        404,
        t("openai.modelNotFound", { model: requested }),
        "not_found_error",
        "model_not_found",
        "model",
      ),
    };
  }
  return { ok: true, model };
}

export interface V1CallInput {
  cacheControl?: InferenceRequest["cacheControl"];
  payer: JwtPrivatePayloadType;
  model: ChatModelOption;
  messages: ModelMessage[];
  /** messages + tool definitions, estimated before the call */
  estimatedInputTokens: number;
  tools: InferenceTool[];
  toolChoice: InferenceToolChoice | undefined;
  temperature: number | undefined;
  topP: number | undefined;
  /** as requested by the client; clamped to V1_MAX_OUTPUT_TOKENS */
  maxOutputTokens: number | undefined;
  stopSequences: string[] | undefined;
  request: Request | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: V1T;
  toolExecutionContext: ToolExecutionContext;
  /** log prefix, e.g. "v1/responses" */
  logTag: string;
  /** param name of the tools field in this wire format (error pointers) */
  toolsParam?: string;
}

/** Token + credit totals of one finished call, in neutral form. */
export interface V1Totals {
  /** all input tokens, cached included */
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
  cacheWriteTokens?: number;
  reasoningTokens: number;
  credits: number;
}

export interface V1Call {
  model: ChatModelOption;
  inference: InferenceRequest;
  estimatedInputTokens: number;
  logger: EndpointLogger;
  logTag: string;
  /**
   * Charges real usage (estimate when the provider reported none). OpenRouter
   * models bill the call's real upstream cost from providerMetadata, exactly
   * like chat turns.
   */
  bill: (
    usage: InferenceUsage | undefined,
    outputChars: number,
    providerMetadata: ProviderMetadata | undefined,
    providerJobId?: string | undefined,
  ) => Promise<V1Totals>;
}

/**
 * Capability checks + credit pre-flight. Returns the ready-to-run call, or the
 * V1Error to render when the call must not run (nothing is charged then).
 */
export async function prepareV1Call(
  input: V1CallInput,
): Promise<{ ok: true; call: V1Call } | { ok: false; error: V1Error }> {
  const { payer, model, tools, toolChoice, t, logger, locale } = input;
  if (tools.length > 0 && !model.supportsTools) {
    return {
      ok: false,
      error: v1Error(
        400,
        t("openai.toolsUnsupportedByModel"),
        "invalid_request_error",
        "tools_not_supported",
        input.toolsParam ?? "tools",
      ),
    };
  }
  const effectiveChoice = tools.length > 0 ? toolChoice : undefined;
  if (
    typeof effectiveChoice === "object" &&
    !tools.some((spec) => spec.name === effectiveChoice.toolName)
  ) {
    return {
      ok: false,
      error: v1Error(
        400,
        t("openai.toolChoiceUnknown", { name: effectiveChoice.toolName }),
        "invalid_request_error",
        "invalid_value",
        "tool_choice",
      ),
    };
  }

  // Uncensored models: the key's account must have confirmed 18+ and
  // unfiltered output once (API keys page). 403, never charged.
  const consentGate = await UncensoredConsentRepository.gate({
    content: model.content,
    modelName: model.name,
    user: payer,
    locale,
    logger,
    surface: "api",
  });
  if (!consentGate.success) {
    return {
      ok: false,
      error: v1Error(
        consentGate.errorType.errorCode,
        consentGate.message,
        consentGate.errorType.errorCode === 403
          ? "permission_error"
          : "server_error",
        consentGate.errorType.errorCode === 403
          ? "uncensored_consent_required"
          : null,
        "model",
      ),
    };
  }

  const requestedMaxOutputTokens =
    input.maxOutputTokens === undefined
      ? undefined
      : Math.min(input.maxOutputTokens, V1_MAX_OUTPUT_TOKENS);
  const estimatedCost = calculateCreditCost(
    model,
    input.estimatedInputTokens,
    requestedMaxOutputTokens ?? DEFAULT_ESTIMATED_OUTPUT_TOKENS,
  );
  const preflightResult = await preflight({
    user: payer,
    model,
    estimatedCost,
    ip: clientIp(input.request),
    locale,
    logger,
    t,
  });
  if ("error" in preflightResult) {
    return { ok: false, error: preflightResult.error };
  }
  // Billing deducts model usage partially (to 0), so output past the wallet
  // was free. Bound it to what the balance pays after the worst-case input.
  const outputCap = computeOutputCap({
    model,
    modelCost: estimatedCost,
    remainingCredits: preflightResult.balance,
    inputTokens: input.estimatedInputTokens,
  });
  if (outputCap.kind === "unaffordable") {
    return {
      ok: false,
      error: v1Error(
        402,
        preflightResult.dailyLimitMessage ??
          t("openai.insufficientCredits", {
            cost: formatCreditAmount(outputCap.requiredCredits, locale),
            balance: formatCreditAmount(preflightResult.balance, locale),
          }),
        "insufficient_quota",
        preflightResult.dailyLimitMessage
          ? "free_tier_cap_reached"
          : "insufficient_credits",
      ),
    };
  }
  const maxOutputTokens =
    outputCap.kind === "capped"
      ? Math.min(
          requestedMaxOutputTokens ?? outputCap.maxOutputTokens,
          outputCap.maxOutputTokens,
        )
      : requestedMaxOutputTokens;

  const inference: InferenceRequest = {
    cacheControl: input.cacheControl,
    model,
    messages: input.messages,
    temperature: input.temperature,
    topP: input.topP,
    maxOutputTokens,
    stopSequences: input.stopSequences,
    abortSignal: input.request?.signal,
    tools,
    toolChoice: effectiveChoice,
    logger,
    toolExecutionContext: input.toolExecutionContext,
  };
  const requestStartedAt = Date.now();
  const estimatedInputTokens = input.estimatedInputTokens;
  return {
    ok: true,
    call: {
      model,
      inference,
      estimatedInputTokens,
      logger,
      logTag: input.logTag,
      bill: (usage, outputChars, providerMetadata, providerJobId) =>
        bill({
          user: payer,
          model,
          usage,
          providerMetadata,
          providerJobId,
          estimatedInputTokens,
          requestStartedAt,
          outputChars,
          locale,
          logger,
          logTag: input.logTag,
        }),
    },
  };
}

/** A V1Error when the call must not run, else the spendable balance. */
async function preflight(params: {
  user: JwtPrivatePayloadType;
  model: ChatModelOption;
  estimatedCost: number;
  ip: string | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: V1T;
}): Promise<
  { error: V1Error } | { balance: number; dailyLimitMessage?: string }
> {
  const { user, model, estimatedCost, ip, locale, logger, t } = params;
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
  const validation = await creditValidator.validateUserCredits(
    user,
    model.id,
    estimatedCost,
    logger,
    creditsT,
    locale,
  );
  if (!validation.success) {
    // Fail closed: cannot read the balance -> do not run.
    return {
      error: v1Error(
        503,
        t("openai.balanceCheckFailed"),
        "server_error",
        "balance_unavailable",
      ),
    };
  }
  const eligible = await protectedBalance(
    user.id,
    user.leadId,
    model.id,
    validation.data.balance,
    estimatedCost,
    creditsT,
    locale,
  );
  if (!eligible.success) {
    return {
      error: v1Error(
        402,
        eligible.message,
        "insufficient_quota",
        "free_credit_policy",
      ),
    };
  }
  if (!validation.data.canUseModel) {
    return {
      error: v1Error(
        402,
        t("openai.insufficientCredits", {
          cost: formatCreditAmount(estimatedCost, locale),
          balance: formatCreditAmount(validation.data.balance, locale),
        }),
        "insufficient_quota",
        "insufficient_credits",
      ),
    };
  }
  const cap = await CreditRepository.gateFreeTierCap(
    user,
    ip,
    estimatedCost,
    model.id,
    logger,
    creditsT,
    locale,
    eligible.data,
  );
  if (!cap.success) {
    return {
      error: v1Error(
        402,
        cap.message,
        "insufficient_quota",
        "free_tier_cap_reached",
      ),
    };
  }
  return {
    balance: Math.min(eligible.data, cap.data?.remaining ?? eligible.data),
    dailyLimitMessage:
      cap.data && cap.data.remaining < eligible.data
        ? cap.data.limitMessage
        : undefined,
  };
}

async function bill(params: {
  requestStartedAt: number;
  user: JwtPrivatePayloadType;
  model: ChatModelOption;
  usage: InferenceUsage | undefined;
  providerMetadata: ProviderMetadata | undefined;
  providerJobId?: string | undefined;
  estimatedInputTokens: number;
  outputChars: number;
  locale: CountryLanguage;
  logger: EndpointLogger;
  logTag: string;
}): Promise<V1Totals> {
  const { user, model, usage, locale, logger } = params;
  const inputTokens = usage?.inputTokens ?? params.estimatedInputTokens;
  const outputTokens =
    usage?.outputTokens ?? Math.ceil(params.outputChars / CHARS_PER_TOKEN);
  const cachedInputTokens = usage?.cachedInputTokens ?? 0;
  const cacheWriteTokens = usage?.cacheWriteTokens ?? 0;
  // Same rule as chat turns: OpenRouter per-token models bill the call's
  // real upstream cost x markup; a call without a reported cost (stream cut,
  // provider omitted it) falls back to the listed token price with a warning.
  const { credits: cost, upstreamCost } = TokenAccumulator.chargeSingleCall(
    model,
    {
      inputTokens,
      outputTokens,
      cachedInputTokens,
      cacheWriteTokens,
      hourWriteTokens: usage?.hourWriteTokens,
      requestStartedAt: params.requestStartedAt,
      promptCountKnown:
        usage?.inputTokens !== undefined && usage.inputTokens > 0,
      imageOutputTokens: usage?.imageOutputTokens ?? 0,
    },
    params.providerMetadata,
    logger,
  );
  logger.info(`[${params.logTag}] Call charge`, {
    model: model.id,
    creditCost: cost,
    upstreamCostUsd: upstreamCost?.upstreamCostUsd ?? null,
    upstreamProvider: upstreamCost?.upstreamProvider ?? null,
    billingBasis: upstreamCost?.billingBasis ?? "token_price",
  });
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
  const deducted = await CreditRepository.deductCreditsForModelUsage(
    user,
    cost,
    model.id,
    logger,
    creditsT,
    locale,
    upstreamCost,
    model.apiProvider,
    { cachedInputTokens, cacheWriteTokens },
    params.providerJobId ? { providerJobId: params.providerJobId } : undefined,
  );
  if (!deducted.success) {
    logger.error(
      `[${params.logTag}] Credit deduction failed after generation`,
      {
        userId: user.id,
        model: model.id,
        cost,
      },
    );
  }
  return {
    inputTokens,
    outputTokens,
    cachedInputTokens,
    cacheWriteTokens,
    reasoningTokens: usage?.reasoningTokens ?? 0,
    credits: cost,
  };
}

function resultChars(result: InferenceResult): number {
  let chars = 0;
  for (const part of result.parts) {
    chars +=
      part.type === "tool-call"
        ? part.name.length + part.arguments.length
        : part.text.length;
  }
  return Math.max(chars, result.text.length);
}

/** Non-streaming run: generate, bill, return the neutral result + totals. */
export async function runV1Generate(
  call: V1Call,
  runner: InferenceRunner,
  t: V1T,
): Promise<
  | { ok: true; result: InferenceResult; totals: V1Totals }
  | { ok: false; error: V1Error }
> {
  try {
    const result = await runner.generate(call.inference);
    const totals = await call.bill(
      result.usage,
      resultChars(result),
      result.providerMetadata,
      result.providerJobId,
    );
    return { ok: true, result, totals };
  } catch (error) {
    const rateLimit = extractUpstreamRateLimit(
      error instanceof Error ? error : undefined,
    );
    if (rateLimit) {
      call.logger.warn(`[${call.logTag}] Upstream rate limited`, {
        model: call.model.id,
        apiProvider: call.inference.model.apiProvider,
        retryAfter: rateLimit.retryAfter,
      });
      return {
        ok: false,
        error: upstreamRateLimitError(rateLimit, t),
      };
    }
    const parsedError = parseError(error);
    const { message } = parsedError;
    call.logger.error(`[${call.logTag}] Inference failed`, parsedError, {
      model: call.model.id,
      apiProvider: call.inference.model.apiProvider,
    });
    return {
      ok: false,
      error: v1Error(
        502,
        t("openai.upstreamFailed", { error: message }),
        "server_error",
        "upstream_error",
      ),
    };
  }
}

/** Content events a format encoder renders (finish/error are handled by the loop). */
export type V1ContentEvent = Exclude<
  InferenceStreamEvent,
  { type: "finish" } | { type: "error" }
>;

/** Turns neutral stream events into one wire format's SSE text. */
export interface V1StreamEncoder {
  /** sent before the model runs (e.g. message_start / response.created) */
  start(): string;
  event(event: V1ContentEvent): string;
  /** normal end; the call is already billed */
  finish(finishReason: OpenAiFinishReason, totals: V1Totals): string;
  /** provider error mid-stream; what ran is already billed */
  fail(
    message: string,
    rateLimit: UpstreamRateLimit | undefined,
    totals: V1Totals,
  ): string;
  /** keeps idle-timeout clients alive while the model thinks */
  heartbeat(): string;
}

export interface RunV1StreamOptions {
  renderError: V1ErrorRenderer;
  t: V1T;
  /** Called once when the stream ends, fails, or is cancelled (e.g. release concurrency slot). */
  onDone?: () => void;
}

/**
 * Streams one call through an encoder. Bills what ran in every case: normal
 * finish, provider error, or client abort. If the upstream provider rejects
 * immediately with HTTP 429 before any content is streamed, passes through
 * HTTP 429 with Retry-After and charges nothing.
 */
export async function runV1Stream(
  call: V1Call,
  runner: InferenceRunner,
  encoder: V1StreamEncoder,
  options: RunV1StreamOptions,
): Promise<StreamingResponse> {
  const encoderBytes = new TextEncoder();
  const abort = new AbortController();
  call.inference.abortSignal?.addEventListener("abort", () => abort.abort());
  const run: InferenceRequest = {
    ...call.inference,
    abortSignal: abort.signal,
  };

  const iterator = runner.stream(run)[Symbol.asyncIterator]();
  let firstEvent: InferenceStreamEvent | undefined;
  let firstDone = false;
  let initialFailure:
    | {
        message: string;
        source: "error-event" | "exception";
        rateLimit?: UpstreamRateLimit;
      }
    | undefined;

  try {
    const first = await iterator.next();
    if (first.done) {
      firstDone = true;
    } else if (first.value.type === "error") {
      if (first.value.upstreamRateLimit) {
        call.logger.warn(`[${call.logTag}] Upstream rate limited`, {
          model: call.model.id,
          apiProvider: run.model.apiProvider,
          retryAfter: first.value.upstreamRateLimit.retryAfter,
        });
        options.onDone?.();
        return options.renderError(
          upstreamRateLimitError(first.value.upstreamRateLimit, options.t),
        );
      }
      initialFailure = {
        message: first.value.message,
        source: "error-event",
      };
      firstDone = true;
    } else {
      firstEvent = first.value;
    }
  } catch (error) {
    const rateLimit = extractUpstreamRateLimit(
      error instanceof Error ? error : undefined,
    );
    if (rateLimit) {
      call.logger.warn(`[${call.logTag}] Upstream rate limited`, {
        model: call.model.id,
        apiProvider: run.model.apiProvider,
        retryAfter: rateLimit.retryAfter,
      });
      options.onDone?.();
      return options.renderError(upstreamRateLimitError(rateLimit, options.t));
    }
    initialFailure = {
      message: parseError(error).message,
      source: "exception",
    };
    firstDone = true;
  }

  const body = new ReadableStream<Uint8Array>({
    async start(controller): Promise<void> {
      let lastSent = Date.now();
      const send = (text: string): void => {
        if (text === "") {
          return;
        }
        lastSent = Date.now();
        try {
          controller.enqueue(encoderBytes.encode(text));
        } catch {
          // client went away; the loop below stops via abort
        }
      };
      const heartbeat = setInterval(() => {
        if (Date.now() - lastSent >= V1_HEARTBEAT_MS) {
          send(encoder.heartbeat());
        }
      }, V1_HEARTBEAT_MS / 3);

      let outputChars = 0;
      let usage: InferenceUsage | undefined;
      let providerMetadata: ProviderMetadata | undefined;
      let providerJobId: string | undefined;
      let finishReason: OpenAiFinishReason = "stop";
      let failed: string | undefined = initialFailure?.message;
      let failureSource: "error-event" | "exception" | undefined =
        initialFailure?.source;
      let failureRateLimit: UpstreamRateLimit | undefined =
        initialFailure?.rateLimit;

      const processEvent = (event: InferenceStreamEvent): void => {
        if (event.type === "finish") {
          usage = event.usage;
          providerMetadata = event.providerMetadata;
          providerJobId = event.providerJobId;
          finishReason = event.finishReason;
          return;
        }
        if (event.type === "error") {
          failed = event.message;
          failureSource = "error-event";
          failureRateLimit = event.upstreamRateLimit;
          return;
        }
        if (event.type === "text" || event.type === "reasoning") {
          outputChars += event.text.length;
        } else if (event.type === "tool-call-start") {
          outputChars += event.name.length;
        } else if (event.type === "tool-call-delta") {
          outputChars += event.argumentsDelta.length;
        }
        send(encoder.event(event));
      };

      try {
        send(encoder.start());
        if (firstEvent !== undefined) {
          processEvent(firstEvent);
        }
        if (!firstDone && failed === undefined) {
          try {
            while (true) {
              const next = await iterator.next();
              if (next.done) {
                break;
              }
              processEvent(next.value);
              if (failed !== undefined) {
                break;
              }
            }
          } catch (error) {
            failureRateLimit = extractUpstreamRateLimit(
              error instanceof Error ? error : undefined,
            );
            failed = failureRateLimit?.message ?? parseError(error).message;
            failureSource = "exception";
          }
        }
        clearInterval(heartbeat);
        // Bill what ran - even on provider error or client abort.
        const totals = await call.bill(
          usage,
          outputChars,
          providerMetadata,
          providerJobId,
        );
        if (failed !== undefined) {
          call.logger.error(`[${call.logTag}] Stream failed`, {
            model: call.model.id,
            streamFailureEvidence: {
              apiProvider: run.model.apiProvider,
              providerModel: run.model.providerModel,
              promptToolHistory: summarizePromptToolHistory(run.messages),
              offeredToolCount: run.tools?.length ?? 0,
              outputChars,
              usageReported: usage !== undefined,
              aborted: abort.signal.aborted,
              failureSource,
            },
            error: failed,
          });
          send(encoder.fail(failed, failureRateLimit, totals));
        } else {
          send(encoder.finish(finishReason, totals));
        }
        try {
          controller.close();
        } catch {
          // already closed by cancel
        }
      } finally {
        clearInterval(heartbeat);
        options.onDone?.();
      }
    },
    cancel(): void {
      abort.abort();
      options.onDone?.();
    },
  });

  return sseResponse(body);
}
