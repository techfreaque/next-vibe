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

import type { ModelMessage } from "ai";
import type { ChatModelOption } from "next-vibe/agent/ai-stream/models";
import { getEnvAvailability } from "next-vibe/agent/env-availability";
import { calculateCreditCost } from "next-vibe/agent/models/models";
import type { ToolExecutionContext } from "next-vibe/core/execution-context";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { StreamingResponse } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JwtPrivatePayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { creditValidator } from "@/credits/validator";

import type { V1T } from "../i18n";
import { V1_MAX_OUTPUT_TOKENS } from "./constants";
import { type V1Error, v1Error } from "./errors";
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
import { resolveRequestedModel, type ModelResolveMode } from "./models";
import { sseResponse } from "./openai";
import { CHARS_PER_TOKEN } from "./tokens";

export { CHARS_PER_TOKEN, TOKENS_PER_IMAGE, estimateTokens } from "./tokens";

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
  reasoningTokens: number;
  credits: number;
}

export interface V1Call {
  model: ChatModelOption;
  inference: InferenceRequest;
  estimatedInputTokens: number;
  logger: EndpointLogger;
  logTag: string;
  /** charges real usage (estimate when the provider reported none) */
  bill: (
    usage: InferenceUsage | undefined,
    outputChars: number,
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

  const maxOutputTokens =
    input.maxOutputTokens === undefined
      ? undefined
      : Math.min(input.maxOutputTokens, V1_MAX_OUTPUT_TOKENS);
  const estimatedCost = calculateCreditCost(
    model,
    input.estimatedInputTokens,
    maxOutputTokens ?? DEFAULT_ESTIMATED_OUTPUT_TOKENS,
  );
  const preflightError = await preflight({
    user: payer,
    model,
    estimatedCost,
    ip: clientIp(input.request),
    locale,
    logger,
    t,
  });
  if (preflightError) {
    return { ok: false, error: preflightError };
  }

  const inference: InferenceRequest = {
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
  const estimatedInputTokens = input.estimatedInputTokens;
  return {
    ok: true,
    call: {
      model,
      inference,
      estimatedInputTokens,
      logger,
      logTag: input.logTag,
      bill: (usage, outputChars) =>
        bill({
          user: payer,
          model,
          usage,
          estimatedInputTokens,
          outputChars,
          locale,
          logger,
          logTag: input.logTag,
        }),
    },
  };
}

/** Returns a V1Error when the call must not run, undefined to proceed. */
async function preflight(params: {
  user: JwtPrivatePayloadType;
  model: ChatModelOption;
  estimatedCost: number;
  ip: string | undefined;
  locale: CountryLanguage;
  logger: EndpointLogger;
  t: V1T;
}): Promise<V1Error | undefined> {
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
    return v1Error(
      503,
      t("openai.balanceCheckFailed"),
      "server_error",
      "balance_unavailable",
    );
  }
  if (!validation.data.canUseModel) {
    return v1Error(
      402,
      t("openai.insufficientCredits", {
        cost: estimatedCost,
        balance: validation.data.balance,
      }),
      "insufficient_quota",
      "insufficient_credits",
    );
  }
  const cap = await CreditRepository.gateFreeTierCap(
    user,
    ip,
    estimatedCost,
    model.id,
    logger,
    creditsT,
    locale,
  );
  if (!cap.success) {
    return v1Error(
      402,
      cap.message,
      "insufficient_quota",
      "free_tier_cap_reached",
    );
  }
  return undefined;
}

async function bill(params: {
  user: JwtPrivatePayloadType;
  model: ChatModelOption;
  usage: InferenceUsage | undefined;
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
  const cost = calculateCreditCost(
    model,
    inputTokens,
    outputTokens,
    cachedInputTokens,
  );
  const { t: creditsT } = creditsScopedTranslation.scopedT(locale);
  const deducted = await CreditRepository.deductCreditsForModelUsage(
    user,
    cost,
    model.id,
    logger,
    creditsT,
    locale,
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
    const totals = await call.bill(result.usage, resultChars(result));
    return { ok: true, result, totals };
  } catch (error) {
    const message = parseError(error).message;
    call.logger.error(`[${call.logTag}] Inference failed`, {
      model: call.model.id,
      error: message,
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
  fail(message: string, totals: V1Totals): string;
  /** keeps idle-timeout clients alive while the model thinks */
  heartbeat(): string;
}

/**
 * Streams one call through an encoder. Bills what ran in every case: normal
 * finish, provider error, or client abort.
 */
export function runV1Stream(
  call: V1Call,
  runner: InferenceRunner,
  encoder: V1StreamEncoder,
): StreamingResponse {
  const encoderBytes = new TextEncoder();
  const abort = new AbortController();
  call.inference.abortSignal?.addEventListener("abort", () => abort.abort());
  const run: InferenceRequest = {
    ...call.inference,
    abortSignal: abort.signal,
  };

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
      let finishReason: OpenAiFinishReason = "stop";
      let failed: string | undefined;
      send(encoder.start());
      try {
        for await (const event of runner.stream(run)) {
          if (event.type === "finish") {
            usage = event.usage;
            finishReason = event.finishReason;
            continue;
          }
          if (event.type === "error") {
            failed = event.message;
            continue;
          }
          if (event.type === "text" || event.type === "reasoning") {
            outputChars += event.text.length;
          } else if (event.type === "tool-call-start") {
            outputChars += event.name.length;
          } else if (event.type === "tool-call-delta") {
            outputChars += event.argumentsDelta.length;
          }
          send(encoder.event(event));
        }
      } catch (error) {
        failed = parseError(error).message;
      }
      clearInterval(heartbeat);
      // Bill what ran - even on provider error or client abort.
      const totals = await call.bill(usage, outputChars);
      if (failed !== undefined) {
        call.logger.error(`[${call.logTag}] Stream failed`, {
          model: call.model.id,
          error: failed,
        });
        send(encoder.fail(failed, totals));
      } else {
        send(encoder.finish(finishReason, totals));
      }
      try {
        controller.close();
      } catch {
        // already closed by cancel
      }
    },
    cancel(): void {
      abort.abort();
    },
  });

  return sseResponse(body);
}
