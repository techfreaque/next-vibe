/**
 * StreamLoop — THE agent loop. One class instance per stream owns the whole
 * AI SDK lifecycle: streamText configuration (stopWhen / prepareStep /
 * onStepFinish), the fullStream part pump, abort handling, token accounting,
 * and completion.
 *
 * Design: the loop is a single stateful object instead of a dozen static
 * handler classes threading 15-param objects. Per-step state that used to be
 * closure variables (lastStepInputTokens, tokenAccumulator, watchdog) are
 * instance fields; the prepareStep pipeline (mid-stream compacting → wakeUp
 * injection → queued-message injection → cortex refresh) lives in
 * loop/steps.ts. Part-type processing lives in onPart() which dispatches over
 * part types to per-part handlers in loop/{text,media,tool}-parts.ts; abort +
 * completion live in loop/finalize.ts. The handlers share the loop's mutable
 * instance state via the StreamLoopState facade (loop/state.ts) — this class
 * implements it and passes itself as the state argument. toolExecutionContext
 * remains the shared state store readable by the registry and the
 * orchestrator (index.ts).
 */

import "server-only";

import type {
  GeneratedFile,
  JSONValue,
  LanguageModel,
  ModelMessage,
  ProviderMetadata,
  StepResult,
  TextStreamPart,
  ToolSet,
} from "ai";
import {
  APICallError,
  InvalidToolInputError,
  modelMessageSchema,
  streamText as aiStreamText,
} from "ai";
import { errorResponseSchema } from "next-vibe/core/route/error-response.schema";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { WidgetDataSchema } from "next-vibe/core/utils/json";
import {
  CallbackMode,
  EXECUTE_TOOL_ALIAS,
} from "next-vibe/execute-tool/constants";
import { z } from "zod";

import { formatCreditAmount } from "@/products/credit-money";

import { DEFAULT_TURN_STEP_LIMIT } from "../../../chat/settings/constants";
import { ApiProvider, calculateCreditCost } from "../../../models/models";
import {
  GARBLED_REPLACE_HEADER,
  GARBLED_RETRY_MARKER_KEY,
  garbledRetryMarkerSchema,
  UPSTREAM_BODY_READ_RETRY_RULE,
} from "../../providers/openrouter/garbled-guard";
import { liveExecuteToolOutput } from "../context/tool-output";
import {
  AbortReason,
  StreamAbortError,
  StreamErrorType,
} from "../core/constants";
import type { InlineThinkEvent } from "../core/inline-think-splitter";
import { computeOutputCap, type OutputCap } from "../core/output-cost-cap";
import {
  claimResultToolCallId,
  type PendingToolData,
  QueueRegistry,
} from "../core/stream";
import { estimateInputTokens } from "../core/token-estimator";
import { providerErrorTranslationKey } from "../errors/provider-error-key";
import { isTransientErrorText } from "../errors/transient";
import {
  deregisterActiveLoop,
  type DrainableLoop,
  registerActiveLoop,
} from "./active-loops";
import { modelDispatchControls } from "./execute-tool-args";
import {
  abortReasonAsError,
  complete,
  finalizeAssistant,
  runAbortHandler,
} from "./finalize";
import {
  DEFAULT_TEMPERATURE,
  endLoopNeedsAnswerStep,
  isThreadRenameCall,
} from "./helpers";
import { extractMediaPrompt, onFilePart } from "./media-parts";
import {
  isContextOverflowText,
  summarizePromptSize,
  summarizePromptToolHistory,
} from "./prompt-size";
import type {
  AssistantPrepResult,
  StreamLoopParams,
  StreamLoopState,
} from "./state";
import { onFinishStep, onStepFinish, prepareStep } from "./steps";
import {
  advanceTip,
  ensureAssistantMessage,
  onReasoningDelta,
  onReasoningEnd,
  onReasoningStart,
  onTextDelta,
  type ReasoningProviderMetadata,
} from "./text-parts";
import { TokenAccumulator } from "./token-accumulator";
import {
  answerMissingToolResults,
  findUnansweredToolCalls,
} from "./tool-pairing";
import {
  onToolCall,
  onToolError,
  onToolResult,
  type ToolCallResult,
} from "./tool-parts";
import { FirstPartWatchdog } from "./watchdog";

interface PreparedStep {
  messages?: ModelMessage[];
  toolChoice?: "none";
  maxOutputTokens?: number;
}

function validationRejectedToolCalls(step: StepResult<ToolSet>): Set<string> {
  return new Set(
    step.toolResults
      .filter(
        (result) =>
          errorResponseSchema.safeParse(result.output).data?.errorType
            .errorKey === ErrorResponseTypes.VALIDATION_ERROR.errorKey,
      )
      .map((result) => result.toolCallId),
  );
}

function onlyRejectedRenames(step: StepResult<ToolSet>): boolean {
  const rejected = validationRejectedToolCalls(step);
  return (
    step.toolCalls.length > 0 &&
    step.toolCalls.every((call) => {
      const { wrappedToolName } = modelDispatchControls(
        call.toolName,
        WidgetDataSchema.safeParse(call.input).data,
      );
      return (
        isThreadRenameCall(call.toolName, wrappedToolName) &&
        (rejected.has(call.toolCallId) ||
          InvalidToolInputError.isInstance(call.error))
      );
    })
  );
}

export class StreamLoop implements StreamLoopState {
  constructor(readonly p: StreamLoopParams) {}

  /**
   * Assistant state at the current step's start, restored when an
   * OpenRouter attempt is replaced by its retry.
   */
  private stepStart: { content: string; messageId: string | null } = {
    content: "",
    messageId: null,
  };
  /** The provider's text part started this step (its reasoning is closed). */
  private stepSawText = false;

  /** Messages of the most recent model request (initial, then each
   *  prepareStep result) - sized in the log on a context-length overflow. */
  private lastPromptMessages: readonly ModelMessage[] = [];
  private lastPromptStep = 0;

  /** Credits left for the next step: turn-start balance minus what this turn
   *  already spent (tools + compacting are deducted as they run; model steps
   *  are billed at turn end, so their charge so far is added here). */
  private remainingCredits(): number {
    const { ctx, creditBalance, modelConfig } = this.p;
    return (
      creditBalance -
      ctx.dbWriter.totalCreditsDeducted -
      TokenAccumulator.spentCredits(ctx, modelConfig)
    );
  }

  /** Estimated input of a step that sends `messages` (system + tools included). */
  private estimateStepInput(messages: ModelMessage[]): number {
    return estimateInputTokens(messages, this.p.systemPrompt, this.p.tools);
  }

  private applyStepOutputCap(
    cap: Exclude<OutputCap, { kind: "unaffordable" }>,
    inputTokens: number,
    stepNumber: number,
  ): number | undefined {
    const { modelConfig, ctx, logger } = this.p;
    if (cap.kind === "uncapped") {
      return undefined;
    }
    ctx.creditBudgetCapped = true;
    logger.debug("[AI Stream] Output capped by remaining balance", {
      model: modelConfig.id,
      stepNumber,
      remainingCredits: this.remainingCredits(),
      inputTokens,
      maxOutputTokens: cap.maxOutputTokens,
    });
    return cap.maxOutputTokens;
  }

  /** Price a follow-up using the last reported prompt size to correct underestimates. */
  private checkNextStepBudget(
    messages: ModelMessage[],
    priorPromptEstimate: number,
    stepNumber: number,
  ): { cap: OutputCap; inputTokens: number } {
    const { modelConfig, modelCost, ctx, logger } = this.p;
    const inputTokens =
      this.estimateStepInput(messages) +
      Math.max(0, ctx.lastStepInputTokens - priorPromptEstimate);
    const remainingCredits = this.remainingCredits();
    const cap = computeOutputCap({
      model: modelConfig,
      modelCost,
      remainingCredits,
      inputTokens,
    });
    if (cap.kind === "unaffordable") {
      ctx.creditBudgetStopped = true;
      ctx.creditBudgetNextStep = {
        inputTokens,
        requiredCredits: cap.requiredCredits,
        remainingCredits,
      };
      logger.info("[AI Stream] Balance cannot pay another step - ending loop", {
        model: modelConfig.id,
        threadId: this.p.threadId,
        steps: stepNumber,
        remainingCredits,
        nextInputTokens: inputTokens,
        requiredCredits: cap.requiredCredits,
      });
    }
    return { cap, inputTokens };
  }

  /**
   * The SDK invokes stopWhen after recording the step and before requesting
   * the next one. Prepare here so a late budget refusal can finish normally.
   */
  private async prepareAffordableNextStep(
    steps: Array<StepResult<ToolSet>>,
  ): Promise<PreparedStep | null> {
    const lastStep = steps.at(-1);
    if (!lastStep) {
      return null;
    }
    const stepNumber = steps.length;
    // The SDK uses the previous request plus the tool results after toModelOutput.
    const priorPromptEstimate = this.estimateStepInput([
      ...this.lastPromptMessages,
    ]);
    const nextMessages = [
      ...this.lastPromptMessages,
      ...lastStep.response.messages,
    ];
    const beforePrep = this.checkNextStepBudget(
      nextMessages,
      priorPromptEstimate,
      stepNumber,
    );
    if (beforePrep.cap.kind === "unaffordable") {
      return null;
    }
    const prepared = this.answerUnansweredToolCalls(
      await this.prepareStep(nextMessages, stepNumber),
      nextMessages,
      stepNumber,
    );
    const messages = prepared.messages ?? nextMessages;
    const { cap, inputTokens } = this.checkNextStepBudget(
      messages,
      priorPromptEstimate,
      stepNumber,
    );
    if (cap.kind === "unaffordable") {
      return null;
    }
    const maxOutputTokens = this.applyStepOutputCap(
      cap,
      inputTokens,
      stepNumber,
    );
    this.lastPromptStep = stepNumber;
    this.lastPromptMessages = messages;
    return { ...prepared, messages, maxOutputTokens };
  }

  /** First-part watchdog timeout: a dead provider connection sent no output
   *  within the window — log and abort the stream. Shared by every arm site. */
  private firstPartTimeout(): void {
    this.p.logger.warn(
      "[AI Stream] Provider sent no output within first-part timeout - aborting stream",
      {
        timeoutMs: FirstPartWatchdog.TIMEOUT_MS,
        threadId: this.p.threadId,
        model: this.p.model,
      },
    );
    this.p.streamAbortController.abort(
      new StreamAbortError(AbortReason.STREAM_TIMEOUT),
    );
  }

  /**
   * Run the loop to completion: configure streamText, pump every part,
   * handle aborts/errors, finalize tokens + credits, complete the stream.
   *
   * Thin wrapper over {@link runInner} that registers this loop in the
   * process-local active-loop registry for the duration of the run. The
   * graceful-shutdown drain (G1, see loop/active-loops.ts) waits on that
   * registry so a rolling deploy never severs an in-flight AI stream.
   * Deregistration is in `finally`, so it fires on completion, abort and error
   * alike.
   */
  async run(): Promise<ErrorResponseType | void> {
    // Compaction and attachment bridges can spend credits after setup. Recheck
    // before dispatch so a short wallet never buys just the model's minimum.
    const {
      modelConfig,
      modelCost,
      ctx,
      threadId,
      user,
      locale,
      t,
      dailyLimitMessage,
    } = this.p;
    // JSON-reparse sanitizes tool results containing Drizzle dates before the
    // SDK validates messages. Price the same prompt we will actually send.
    const cleaned =
      z
        .array(modelMessageSchema)
        .safeParse(JSON.parse(JSON.stringify(this.p.messages))).data ??
      this.p.messages;
    const messages = this.p.tools
      ? this.answerUnansweredToolCalls({ messages: cleaned }, cleaned, 0)
          .messages
      : cleaned;
    const remainingCredits = this.remainingCredits();
    const inputTokens = this.estimateStepInput(messages);
    const cap = computeOutputCap({
      model: modelConfig,
      modelCost,
      remainingCredits,
      inputTokens,
    });
    if (cap.kind === "unaffordable") {
      const message =
        dailyLimitMessage ??
        t("route.errors.insufficientCredits", {
          cost: formatCreditAmount(cap.requiredCredits, locale),
          balance: formatCreditAmount(Math.max(0, remainingCredits), locale),
        });
      const error = fail({
        message,
        errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
      });
      this.p.logger.warn("[AI Stream] Balance refused prepared model request", {
        model: modelConfig.id,
        inputTokens,
        requiredCredits: cap.requiredCredits,
        remainingCredits,
        preparationCredits: ctx.dbWriter.totalCreditsDeducted,
      });
      await ctx.dbWriter.emitErrorMessage({
        threadId,
        user,
        content: message,
        error,
        errorType: StreamErrorType.STREAM_ERROR,
        parentId: ctx.lastParentId,
        sequenceId: ctx.lastSequenceId,
      });
      return error;
    }
    const drainable: DrainableLoop = {
      abort: (reason: string): void => {
        if (!this.p.streamAbortController.signal.aborted) {
          this.p.streamAbortController.abort(
            new StreamAbortError(AbortReason.SERVER_SHUTDOWN),
          );
        }
        this.p.logger.warn(
          "[AI Stream] Loop aborted by shutdown drain (timed out waiting to finish)",
          { reason, threadId: this.p.threadId },
        );
      },
    };
    registerActiveLoop(drainable);
    try {
      await this.runInner(
        messages,
        this.applyStepOutputCap(cap, inputTokens, 0),
      );
    } finally {
      deregisterActiveLoop(drainable);
    }
  }

  private async runInner(
    messages: ModelMessage[],
    initialMaxOutputTokens: number | undefined,
  ): Promise<void> {
    const {
      provider,
      modelConfig,
      streamAbortController,
      systemPrompt,
      tools: loadedTools,
      ctx,
      ttsHandler,
      logger,
    } = this.p;

    // Revival turns are TEXT-ONLY BY CONTRACT (see prepareStep): tools stay
    // loaded (a queued user message may arrive mid-revival and turn the stream
    // into a real turn), but the ack steps run with toolChoice:"none".
    const executeTool = loadedTools?.[EXECUTE_TOOL_ALIAS];
    const tools: ToolSet | undefined =
      executeTool && !executeTool.toModelOutput
        ? {
            ...loadedTools,
            [EXECUTE_TOOL_ALIAS]: {
              ...executeTool,
              toModelOutput: ({ output }: { output: WidgetData }) =>
                liveExecuteToolOutput(output, modelConfig, logger),
            },
          }
        : loadedTools;

    const systemWithCacheControl = systemPrompt
      ? [
          {
            role: "system" as const,
            content: systemPrompt,
            providerOptions: {
              openrouter: {
                cacheControl: { type: "ephemeral" as const, ttl: "1h" },
              },
            },
          },
        ]
      : undefined;

    // Build generation settings for custom media providers.
    // providerOptions must be Record<string, JSONObject> (provider-keyed
    // objects). We use the "generation" key; custom providers read
    // options.providerOptions?.["generation"].
    const { imageSize, imageQuality, musicDuration } = this.p;
    const generationSettings: Record<string, string> = {};
    if (imageSize) {
      generationSettings["imageSize"] = imageSize;
    }
    if (imageQuality) {
      generationSettings["imageQuality"] = imageQuality;
    }
    if (musicDuration) {
      generationSettings["musicDuration"] = musicDuration;
    }
    const hasGenerationSettings = Object.keys(generationSettings).length > 0;

    this.p.ctx.mediaPrompt = this.extractMediaPrompt();
    this.p.ctx.mediaCreditCost = calculateCreditCost(modelConfig, 0, 0, 0, 0);

    const providerOptions: Record<string, Record<string, JSONValue>> = {};
    if (hasGenerationSettings) {
      providerOptions["generation"] = generationSettings;
    }
    if (modelConfig.outputs?.includes("image")) {
      providerOptions["openrouter"] = {
        modalities: ["text", "image"] as JSONValue,
      };
    }

    // Record the time the request is sent to the model - used for true TTFT calculation
    ctx.requestStartTime = Date.now();
    ctx.stepPricingStartedAt = ctx.requestStartTime;

    // Some models (e.g. gpt-5-image via OpenRouter) reject the temperature
    // parameter. Only send it when the model explicitly supports it.
    const temperatureParam =
      modelConfig.features.supportsTemperature !== false
        ? { temperature: DEFAULT_TEMPERATURE }
        : {};

    this.lastPromptMessages = messages;
    let nextStep: PreparedStep | null = null;
    // OpenRouter: the garbled-output guard may replace a broken attempt with
    // a retry mid-step; its in-band marker arrives as a `raw` part.
    const garbledGuardParams =
      modelConfig.apiProvider === ApiProvider.OPENROUTER
        ? {
            includeRawChunks: true,
            headers: { [GARBLED_REPLACE_HEADER]: "1" },
          }
        : {};
    ctx.creditBudgetOutputTokens = initialMaxOutputTokens ?? null;
    const streamResult = aiStreamText({
      model: provider.chat(modelConfig.providerModel) as LanguageModel,
      messages,
      ...garbledGuardParams,
      ...temperatureParam,
      ...(initialMaxOutputTokens !== undefined
        ? { maxOutputTokens: initialMaxOutputTokens }
        : {}),
      abortSignal: streamAbortController.signal,
      system: systemWithCacheControl,
      allowSystemInMessages: true,
      ...(Object.keys(providerOptions).length > 0 ? { providerOptions } : {}),
      ...(tools
        ? {
            tools,
            stopWhen: async ({ steps }): Promise<boolean> => {
              // endLoop / approve / wait: stop before the next AI turn starts.
              // The current step (tool calls + results) finishes naturally;
              // this predicate prevents the AI SDK from making another API
              // request. (wakeUp results do NOT stop the loop — they are
              // injected into the next step by prepareStep so the model
              // acknowledges them in-context.)
              const { maxToolCalls, toolExecutionContext } = this.p;
              if (
                streamAbortController.signal.aborted ||
                ctx.shouldStopLoop ||
                ctx.sdkEndLoopStop ||
                ctx.stepHasToolsAwaitingConfirmation ||
                toolExecutionContext.stepHasToolsAwaitingConfirmation ===
                  true ||
                toolExecutionContext.waitingForRemoteResult === true
              ) {
                return true;
              }
              // One repair attempt is enough for a housekeeping rename. If
              // this turn still owes a reply, spend the next step on that.
              // Pending user input and completed tools take precedence.
              if (
                endLoopNeedsAnswerStep(toolExecutionContext) &&
                steps.length - ctx.turnStepOffset >= 2 &&
                ctx.pendingWakeUpInjections.length === 0 &&
                !QueueRegistry.hasQueued(this.p.threadId) &&
                steps.slice(-2).every(onlyRejectedRenames)
              ) {
                if (ctx.sdkTurnHasAnswerText || ctx.forcedAnswerStepUsed) {
                  return true;
                }
                ctx.forceAnswerNextStep = true;
              }
              if (maxToolCalls !== undefined) {
                if (steps.length === maxToolCalls) {
                  return true;
                }
              } else {
                const limit = this.p.turnStepLimit ?? DEFAULT_TURN_STEP_LIMIT;
                if (steps.length - ctx.turnStepOffset >= limit) {
                  ctx.reachedTurnStepLimit = limit;
                  return true;
                }
              }
              nextStep = await this.prepareAffordableNextStep(steps);
              return nextStep === null || streamAbortController.signal.aborted;
            },
            prepareStep: (): PreparedStep => {
              ctx.stepPricingStartedAt = Date.now();
              ctx.creditBudgetOutputTokens =
                nextStep?.maxOutputTokens ?? initialMaxOutputTokens ?? null;
              return nextStep ?? {};
            },
            onStepFinish: (stepResult): void => {
              // Read here (SDK-typed) so steps.ts stays free of the SDK's
              // untyped tool input: which calls of this step asked endLoop,
              // and were they all the silent rename?
              const rejected = validationRejectedToolCalls(stepResult);
              const endLoopCalls = stepResult.toolCalls.flatMap((call) => {
                if (
                  rejected.has(call.toolCallId) ||
                  InvalidToolInputError.isInstance(call.error)
                ) {
                  return [];
                }
                const controls = modelDispatchControls(
                  call.toolName,
                  WidgetDataSchema.safeParse(call.input).data,
                );
                return controls.callbackMode === CallbackMode.END_LOOP
                  ? [
                      isThreadRenameCall(
                        call.toolName,
                        controls.wrappedToolName,
                      ),
                    ]
                  : [];
              });
              // Explicit fields, never a spread: the SDK's step result is a
              // class whose usage/text/files are prototype getters.
              this.onStepFinish({
                usage: stepResult.usage,
                finishReason: stepResult.finishReason,
                providerMetadata: stepResult.providerMetadata,
                response: stepResult.response,
                files: stepResult.files,
                text: stepResult.text,
                requestedEndLoop: endLoopCalls.length > 0,
                endLoopOnlyRename:
                  endLoopCalls.length > 0 &&
                  endLoopCalls.every((isRename) => isRename),
              });
            },
          }
        : {}),
    });

    FirstPartWatchdog.arm(this.p.ctx, () => this.firstPartTimeout());

    try {
      for await (const part of streamResult.fullStream) {
        // Eagerly bail out if the stream was cancelled — do not drain buffered
        // parts that the AI provider already sent. Without this check the SDK
        // keeps yielding already-buffered tokens even after abort fires.
        if (streamAbortController.signal.aborted) {
          // oxlint-disable-next-line restricted/restricted-syntax -- Throw is required here to escape the for-await loop cleanly and reach the catch block that calls runAbortHandler
          throw new DOMException("Stream aborted", "AbortError");
        }
        if (part.type === "start-step") {
          FirstPartWatchdog.arm(this.p.ctx, () => this.firstPartTimeout());
        } else {
          FirstPartWatchdog.clear(this.p.ctx);
        }
        const { shouldAbort } = await this.onPart(part);

        if (shouldAbort) {
          // Stream was intentionally aborted (e.g. REMOTE_TOOL_WAIT, endLoop).
          // Run the abort handler now - the loop exits via 'return', not via an
          // exception, so the catch below will NOT fire. The handler sets
          // thread → "waiting" for REMOTE_TOOL_WAIT so clearStreamingState (in
          // the orchestrator's finally) sees the state and skips.
          if (streamAbortController.signal.aborted && !ctx.abortHandled) {
            await this.runAbortHandler(
              this.abortReasonAsError(streamAbortController.signal.reason),
            );
            ctx.abortHandled = true;
          }
          return;
        }
      }
    } catch (streamError) {
      // Cancel TTS generation immediately to avoid wasting API calls + credits
      if (ttsHandler) {
        ttsHandler.cancel();
      }

      // If the stream was intentionally aborted, run the abort handler for
      // cleanup (save partial content, deduct credits, emit interruption
      // message). Idempotent via ctx.abortHandled.
      if (streamAbortController.signal.aborted) {
        const abortError = this.abortReasonAsError(
          streamAbortController.signal.reason,
        );

        if (!ctx.abortHandled) {
          await this.runAbortHandler(abortError);
          ctx.abortHandled = true;
        } else {
          logger.debug(
            "[AI Stream] Swallowing post-abort error (already handled)",
            {
              abortReason: abortError.message,
              errorName:
                streamError instanceof Error ? streamError.name : "unknown",
              errorMessage:
                streamError instanceof Error
                  ? streamError.message
                  : String(streamError),
            },
          );
        }
        return;
      }

      // Non-abort error: try the abort handler (handles e.g. "Client disconnected")
      if (streamError instanceof Error) {
        const { wasHandled } = await this.runAbortHandler(streamError);
        if (wasHandled) {
          ctx.abortHandled = true;
          return;
        }
      }

      // Not an abort error, re-throw to outer StreamErrorCatchHandler
      // oxlint-disable-next-line restricted/restricted-syntax -- Re-throw is necessary here to propagate to StreamErrorCatchHandler
      throw streamError;
    } finally {
      FirstPartWatchdog.clear(this.p.ctx);
    }

    await this.complete(streamResult);
  }

  // ─── part pump ──────────────────────────────────────────────────────────────

  /**
   * Process a single stream part and update context
   */
  private async onPart<TOOLS extends ToolSet>(
    part: TextStreamPart<TOOLS>,
  ): Promise<{ shouldAbort: boolean }> {
    const {
      ctx,
      threadId,
      model,
      streamAbortController,
      ttsHandler,
      logger,
      toolExecutionContext,
    } = this.p;

    // Raw provider chunks (OpenRouter only): nothing but the garbled-retry
    // marker is acted on; they must not reach the inline-think flush below.
    if (part.type === "raw") {
      const retry = garbledRetryMarkerSchema.safeParse(part.rawValue);
      if (retry.success) {
        this.onProviderRetry(retry.data[GARBLED_RETRY_MARKER_KEY].rule);
      }
      return { shouldAbort: false };
    }
    if (part.type === "start-step") {
      this.stepStart = {
        content: ctx.currentAssistantContent,
        messageId: ctx.currentAssistantMessageId,
      };
      this.stepSawText = false;
    } else if (part.type === "text-start" || part.type === "text-delta") {
      this.stepSawText = true;
    }

    // A text block ended: release a held-back partial "<think" as content.
    // Any other non-text part ends the text run: also close an inline block
    // that the model never closed, before the part is handled.
    if (part.type === "text-end") {
      await this.applyInlineThinkEvents(ctx.inlineThink.flushBuffer());
    } else if (part.type !== "text-delta" && part.type !== "text-start") {
      await this.applyInlineThinkEvents(ctx.inlineThink.flush());
    }

    if (part.type === "file") {
      await this.onFilePart(part.file);
      return { shouldAbort: false };
    }

    if (part.type === "finish-step") {
      const { shouldAbort } = await this.onFinishStep();

      // Flush and reset TTS between steps so the generationChain doesn't grow
      // unboundedly across a multi-step run. Each step gets a clean chain;
      // audio for step N is fully emitted before step N+1 starts.
      // On abort we skip this - completion (complete()) handles the final flush.
      if (!shouldAbort && ttsHandler) {
        await ttsHandler.flush();
        ttsHandler.reset();
      }

      return { shouldAbort };
    }

    if (part.type === "text-delta") {
      // Once a tool in this step requires confirmation, discard any subsequent
      // text-deltas in the same step. The AI often emits follow-up text after
      // tool calls (e.g. "Waiting for your approval...") - we don't want this
      // persisted since the stream will stop at finish-step and the confirm flow
      // takes over. Do NOT abort the stream here - let the step finish naturally.
      if (ctx.stepHasToolsAwaitingConfirmation) {
        return { shouldAbort: false };
      }
      // Inline <think>…</think> in answer text becomes reasoning, for any model.
      await this.applyInlineThinkEvents(ctx.inlineThink.push(part.text));
      return { shouldAbort: false };
    }

    if (part.type === "reasoning-start") {
      await this.handleReasoningStart();
      return { shouldAbort: false };
    }

    if (part.type === "reasoning-delta") {
      const reasoningText = part.text;
      ctx.currentAssistantContent = this.onReasoningDelta(
        reasoningText,
        part.providerMetadata,
      );

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-end") {
      this.handleReasoningEnd();
      return { shouldAbort: false };
    }

    if (part.type === "tool-call") {
      if (
        "toolCallId" in part &&
        "toolName" in part &&
        typeof part.toolCallId === "string" &&
        typeof part.toolName === "string"
      ) {
        // Guard against duplicate toolCallIds within one step. Some providers
        // (e.g. Gemini's OpenAI-compat shim) synthesize ids positionally per
        // response ("functions.<tool>:<index>"), which can collide for two
        // genuinely different parallel calls to the same tool. A second DB
        // row under the SAME toolCallId would violate "tool_use ids must be
        // unique" when history is resent - so the repeat occurrence gets its
        // own de-duplicated key instead of being silently dropped. The AI SDK
        // still runs this call for real regardless of what we do here, so
        // dropping it would lose a real result, not just log noise.
        const isRepeatToolCallId = ctx.allSeenToolCallIds.has(part.toolCallId);
        let effectiveToolCallId = part.toolCallId;
        if (isRepeatToolCallId) {
          const queue = ctx.duplicateToolCallKeys.get(part.toolCallId) ?? [];
          effectiveToolCallId = `${part.toolCallId}::dup${queue.length + 1}`;
          queue.push(effectiveToolCallId);
          ctx.duplicateToolCallKeys.set(part.toolCallId, queue);
          logger.warn(
            "[AI Stream] Duplicate toolCallId from model - disambiguating",
            {
              toolCallId: part.toolCallId,
              effectiveToolCallId,
              toolName: part.toolName,
            },
          );
        }
        ctx.allSeenToolCallIds.add(part.toolCallId);

        // SDK error messages interpolate the entire raw payload. Keep only the
        // schema issues for persistence and telemetry, including malformed JSON.
        let validationIssues: string | undefined;
        if (InvalidToolInputError.isInstance(part.error)) {
          const cause = part.error.cause;
          const issues = cause instanceof Error ? cause.cause : undefined;
          validationIssues =
            issues instanceof z.ZodError
              ? issues.issues
                  .map((issue) =>
                    [issue.path.join("."), issue.message]
                      .filter(Boolean)
                      .join(": "),
                  )
                  .join(". ")
              : "Expected a JSON object matching the tool argument schema.";
        }
        const result = await this.onToolCall({
          validationIssues,
          type: "tool-call",
          toolCallId: effectiveToolCallId,
          toolName: part.toolName,
          input:
            "input" in part
              ? WidgetDataSchema.safeParse(part.input).data
              : undefined,
        });
        ctx.currentAssistantMessageId = result.currentAssistantMessageId;
        ctx.currentAssistantContent = result.currentAssistantContent;
        ctx.isInReasoningBlock = result.isInReasoningBlock;
        if (result.currentAssistantMessageId) {
          ctx.lastAssistantMessageId = result.currentAssistantMessageId;
        }

        this.advanceTip(result.pendingToolMessage.messageId, {
          clearPendingQueueParent: false,
        });

        // Expose the current tool message ID to toolExecutionContext.
        // tools-loader execute() wrapper reads from ctx.pendingToolMessages
        // keyed by toolCallId for parallel-safe per-tool lookup.
        toolExecutionContext.currentToolMessageId =
          result.pendingToolMessage.messageId;

        // If escalateToTask() fired BEFORE this TOOL message was created (the common
        // case for interactive tools like claude-code), backfill the correct TOOL message
        // ID onto the escalated task row now that we have it.
        if (toolExecutionContext.pendingEscalatedTaskId) {
          const escalatedId = toolExecutionContext.pendingEscalatedTaskId;
          toolExecutionContext.pendingEscalatedTaskId = undefined; // consume it
          const toolMsgId = result.pendingToolMessage.messageId;
          void (async (): Promise<void> => {
            try {
              const { db: dbInst } = await import("next-vibe/database");
              const { cronTasks: cronTasksTable } =
                await import("next-vibe/tasks/cron/db");
              const { eq: drizzleEq } = await import("drizzle-orm");
              // Backfill wakeUpToolMessageId into the parked resume-stream task's taskInput jsonb.
              const parkedId = `resume-stream-parked-${escalatedId}`;
              const { sql: drizzleSql } = await import("drizzle-orm");
              await dbInst
                .update(cronTasksTable)
                .set({
                  taskInput: drizzleSql`${cronTasksTable.taskInput} || ${JSON.stringify({ wakeUpToolMessageId: toolMsgId })}::jsonb`,
                  updatedAt: new Date(),
                })
                .where(drizzleEq(cronTasksTable.id, parkedId));
              logger.debug(
                "[AI Stream] Backfilled wakeUpToolMessageId on parked resume task",
                { escalatedId, parkedId, toolMsgId },
              );
            } catch (err) {
              logger.warn(
                "[AI Stream] Failed to backfill toolMessageId on parked resume task",
                {
                  escalatedId,
                  toolMsgId,
                  error: err instanceof Error ? err.message : String(err),
                },
              );
            }
          })();
        }

        // Track the branch tip at the time of this tool call.
        // parentId is the assistant message that spawned the tool - this is the
        // correct leaf for deferred result insertion (wakeUp, approve, remote).
        // Updated on every tool-call so it reflects the latest branch tip if
        // multiple sequential tool calls happen in the same step.
        if (result.pendingToolMessage.toolCallData.parentId) {
          toolExecutionContext.leafMessageId =
            result.pendingToolMessage.toolCallData.parentId;
        }

        ctx.pendingToolMessages.set(
          effectiveToolCallId,
          result.pendingToolMessage,
        );

        // APPROVE: mark that this stream has approve tools - abort deferred to finish-step.
        // stepHasToolsAwaitingConfirmation persists across steps so sequential tool calls
        // all complete before the stream aborts at the AI-response turn boundary.
        if (result.requiresConfirmation) {
          ctx.stepHasToolsAwaitingConfirmation = true;
          logger.debug(
            "[AI Stream] Tool requires confirmation - will abort at finish-step after all tool steps complete",
            {
              toolName: part.toolName,
              messageId: result.pendingToolMessage.messageId,
            },
          );
        }
      }

      return { shouldAbort: false };
    }

    if (part.type === "tool-error") {
      if (
        "toolCallId" in part &&
        "toolName" in part &&
        typeof part.toolCallId === "string" &&
        typeof part.toolName === "string"
      ) {
        const { effectiveToolCallId, pending } = this.resolvePendingToolMessage(
          part.toolCallId,
        );
        const result = await this.onToolError(
          {
            type: "tool-error",
            toolCallId: effectiveToolCallId,
            toolName: part.toolName,
            input: "input" in part ? (part.input as JSONValue) : undefined,
            error: "error" in part ? (part.error as JSONValue) : undefined,
          },
          pending,
        );
        if (result) {
          // Same tip-rewind guard as tool-result below: a matched pending
          // entry means the chain already advanced at tool-call time.
          if (!pending) {
            this.advanceTip(result.currentParentId, {
              clearPendingQueueParent: false,
            });
          }
          ctx.pendingToolMessages.delete(effectiveToolCallId);
        }
      }

      return { shouldAbort: false };
    }

    if (
      part.type === "tool-result" &&
      "toolCallId" in part &&
      "toolName" in part &&
      typeof part.toolCallId === "string" &&
      typeof part.toolName === "string"
    ) {
      // Wrapped confirmation gate: execute-tool sets the flag on the tool
      // execution context (it has no LoopContext access). Mirror it onto the
      // loop context so stopWhen/finish-step abort before the AI-response turn,
      // exactly like a direct call to a requiresConfirmation tool.
      if (toolExecutionContext.stepHasToolsAwaitingConfirmation) {
        ctx.stepHasToolsAwaitingConfirmation = true;
      }
      const { effectiveToolCallId, pending } = this.resolvePendingToolMessage(
        part.toolCallId,
      );
      const result = await this.onToolResult(
        {
          type: "tool-result",
          toolCallId: effectiveToolCallId,
          toolName: part.toolName,
          output: "output" in part ? (part.output as JSONValue) : undefined,
          isError: "isError" in part ? Boolean(part.isError) : false,
        },
        pending,
      );
      if (result) {
        // The chain tip already advanced when the tool-call created its
        // message. Re-assigning from the result would REWIND the tip when a
        // later tool-call has advanced it meanwhile (rapid sequential calls:
        // result N can process after call N+1 created its message, forking
        // the chain). Only advance when the handler created a NEW message
        // (no pending entry - provider-executed tools).
        if (!pending) {
          this.advanceTip(result.currentParentId, {
            clearPendingQueueParent: false,
          });
        }
        ctx.pendingToolMessages.delete(effectiveToolCallId);

        // Finalize and reset assistant message state so the next turn creates
        // a fresh message. This is critical for provider-executed tool loops
        // (e.g. Agent SDK) where the entire multi-turn conversation arrives
        // in a single stream without finish-step between turns.
        if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
          await this.finalizeAssistant({
            currentAssistantMessageId: ctx.currentAssistantMessageId,
            currentAssistantContent: ctx.currentAssistantContent,
            isInReasoningBlock: ctx.isInReasoningBlock,
            finishReason: null,
            totalTokens: null,
            promptTokens: null,
            completionTokens: null,
          });
        }
        ctx.currentAssistantMessageId = null;
        ctx.currentAssistantContent = "";
        ctx.isInReasoningBlock = false;

        // APPROVE: once every tool of this step has resolved and one of them
        // awaits confirmation, abort NOW - the provider stream may still be
        // open, and everything it sends past this point is discarded anyway.
        // Waiting for finish-step would hold the thread (and keep billing)
        // until the provider closes the stream on its own.
        if (
          ctx.stepHasToolsAwaitingConfirmation &&
          ctx.pendingToolMessages.size === 0 &&
          !toolExecutionContext.waitingForRemoteResult
        ) {
          logger.debug(
            "[AI Stream] APPROVE - all tool results in, aborting provider stream before AI response turn",
            { toolName: part.toolName, toolCallId: part.toolCallId },
          );
          streamAbortController.abort(
            new StreamAbortError(AbortReason.TOOL_CONFIRMATION),
          );
          return { shouldAbort: true };
        }

        // Remote tool with callbackMode=wait: defer abort to finish-step (same as endLoop/approve).
        // finish-step fires after all tool results, before the AI SDK makes the next API call.
        // Aborting here (at tool-result) caused the AI SDK to sometimes initiate call 2 before
        // the abort signal was checked, consuming an extra fetch-cache counter slot and
        // skewing fixture indices. Deferring to finish-step guarantees no call 2.
        // /report backfills the real result and resume-stream wakes the thread.
        if (toolExecutionContext.waitingForRemoteResult) {
          logger.debug(
            "[AI Stream] Remote tool wait mode - deferring abort to finish-step",
            {
              toolName: part.toolName,
              toolCallId: part.toolCallId,
            },
          );
          // Don't clear waitingForRemoteResult yet - onFinishStep reads it.
        }

        // endLoop: defer abort to finish-step (same as approve).
        // The step must fully complete (all parallel tool results received) before
        // aborting - otherwise the abort fires mid-step and kills sibling tools.
        // finish-step fires after all tool results in the step, before the AI SDK
        // makes the next API call, so deferring there is always safe.
        if (ctx.shouldStopLoop) {
          logger.debug(
            "[AI Stream] endLoop tool result received - deferring abort to finish-step",
            {
              toolName: part.toolName,
              toolCallId: part.toolCallId,
              pendingTools: ctx.pendingToolMessages.size,
            },
          );
        }
      }

      return { shouldAbort: false };
    }

    if (part.type === "error") {
      const rawError = "error" in part ? part.error : undefined;
      const upstreamError = APICallError.isInstance(rawError) ? rawError : null;
      // The AI SDK often surfaces only the human-readable `message`, burying the
      // HTTP status and the provider's own error-type (e.g. OpenRouter's
      // `{ code: 502, metadata: { error_type: "provider_unavailable" } }`) in
      // sibling fields. Fold the structured fields into the text so the
      // transient classifier below sees the `502` / `provider_unavailable`
      // signal and treats the outage as the transient upstream failure it is.
      const errorText = upstreamError
        ? [
            upstreamError.message,
            upstreamError.statusCode === undefined
              ? ""
              : String(upstreamError.statusCode),
            typeof upstreamError.responseBody === "string"
              ? upstreamError.responseBody
              : "",
          ]
            .filter(Boolean)
            .join(" ")
        : rawError instanceof Error
          ? rawError.message
          : rawError !== undefined && rawError !== null
            ? JSON.stringify(rawError)
            : "unknown";
      // Upstream capacity/availability problems (rate limit, 5xx, overload,
      // timeouts) are outside our control and already shown to the user as an
      // error bubble - warn, so the error log stays for actual bugs.
      const transient = isTransientErrorText(errorText);
      const promptImages = this.lastPromptMessages.flatMap((message) =>
        message.role === "user" && Array.isArray(message.content)
          ? message.content.filter((item) => item.type === "image")
          : [],
      );
      // Mid-stream error parts are NOT retried (the AI SDK's maxRetries only
      // covers the initial request) - the turn ends with an error bubble.
      // Record which upstream served it and how far the stream got so an
      // idle-timeout / outage is attributable to the provider at a glance.
      const errorMeta = {
        error: errorText,
        promptToolHistory: summarizePromptToolHistory(this.lastPromptMessages),
        // Which call lacked a result (ids/names only, never tool input).
        unansweredToolCalls: findUnansweredToolCalls(this.lastPromptMessages)
          .slice(0, 5)
          .map(({ toolCallId, toolName, closedBy }) => ({
            toolCallId,
            toolName,
            closedBy,
          })),
        promptStep: this.lastPromptStep,
        providerStepEvidence: {
          sawVisibleText: this.p.ctx.stepHasAnswerText,
          waitingToolResults: this.p.ctx.pendingToolMessages.size,
        },
        initialPromptToolHistory:
          this.lastPromptStep > 0
            ? summarizePromptToolHistory(this.p.messages)
            : undefined,
        upstreamStatus: upstreamError?.statusCode,
        upstreamCauseName:
          upstreamError?.cause instanceof Error
            ? upstreamError.cause.name
            : null,
        upstreamContentType: upstreamError?.responseHeaders?.["content-type"],
        upstreamResponseBytes: upstreamError?.responseBody?.length,
        completedTokenSteps: this.p.ctx.tokenStepCount,
        upstreamReason: providerErrorTranslationKey(errorText),
        model,
        apiProvider: this.p.modelConfig.apiProvider,
        providerModel: this.p.modelConfig.providerModel,
        offeredToolCount: Object.keys(this.p.tools ?? {}).length,
        promptImageCount: promptImages.length,
        promptImageUrlCount: promptImages.filter(
          (item) => item.image instanceof URL,
        ).length,
        threadId,
        transient,
        retried: false,
        elapsedMs:
          this.p.ctx.requestStartTime === null
            ? null
            : Date.now() - this.p.ctx.requestStartTime,
        partialOutputChars: this.p.ctx.currentAssistantContent.length,
      };
      this.p.ctx.lastProviderErrorText = errorText;
      if (transient) {
        logger.warn(
          "[AI Stream] Provider emitted transient error part",
          errorMeta,
        );
      } else {
        logger.error("[AI Stream] Provider emitted error part", errorMeta);
      }
      // A context-length overflow names only the total: log where the
      // characters are (per role / part type, largest parts) so an inlined
      // payload (e.g. media as base64 text) is identifiable from the log.
      if (isContextOverflowText(errorText)) {
        logger.error("[AI Stream] Context overflow: prompt size breakdown", {
          model,
          apiProvider: this.p.modelConfig.apiProvider,
          providerModel: this.p.modelConfig.providerModel,
          contextWindow: this.p.modelConfig.contextWindow,
          threadId,
          ...summarizePromptSize(this.p.systemPrompt, this.lastPromptMessages),
        });
      }
    }

    return { shouldAbort: false };
  }

  // ─── per-part handlers ──────────────────────────────────────────────────────

  /** See loop/text-parts.ts (advanceTip) for the full contract. */
  advanceTip(
    messageId: string | null,
    opts: { clearPendingQueueParent: boolean },
  ): void {
    return advanceTip(this, messageId, opts);
  }

  /**
   * A provider attempt failed after text was shown and the retry on another
   * host follows. Drop what the
   * attempt added to the assistant message and show the step-start content
   * again; the retry's parts then stream in on top. Provider reasoning that
   * was still open stays open (the retry continues it without a new
   * reasoning-start); after text started the provider drops retry reasoning.
   */
  private onProviderRetry(rule: string): void {
    const { ctx, logger } = this.p;
    // Discard a half-parsed inline <think> of the dropped attempt.
    ctx.inlineThink.flush();
    const messageId = ctx.currentAssistantMessageId;
    if (!messageId) {
      return;
    }
    const sameMessage = this.stepStart.messageId === messageId;
    const base = sameMessage ? this.stepStart.content : "";
    const providerReasoningOpen = ctx.isInReasoningBlock && !this.stepSawText;
    ctx.currentAssistantContent = providerReasoningOpen
      ? `${base}<think>`
      : base;
    ctx.isInReasoningBlock = providerReasoningOpen;
    ctx.lastEstimatedTokenEmitLength = 0;
    ctx.dbWriter.emitContentReplaced(messageId, ctx.currentAssistantContent);
    logger.info(
      rule === UPSTREAM_BODY_READ_RETRY_RULE
        ? "[AI Stream] Interrupted provider attempt replaced by retry"
        : "[AI Stream] Garbled provider attempt replaced by retry",
      {
        messageId,
        keptChars: ctx.currentAssistantContent.length,
      },
    );
  }

  /** Dispatch the events the inline <think> splitter resolved. */
  private async applyInlineThinkEvents(
    events: InlineThinkEvent[],
  ): Promise<void> {
    for (const event of events) {
      if (event.type === "text") {
        await this.handleTextDelta(event.text);
      } else if (event.type === "reasoning-start") {
        await this.handleReasoningStart();
      } else if (event.type === "reasoning-delta") {
        this.p.ctx.currentAssistantContent = this.onReasoningDelta(event.text);
      } else {
        this.handleReasoningEnd();
      }
    }
  }

  /** Answer text: create/extend the assistant message, track TTFT and the
   *  estimated token counter. */
  private async handleTextDelta(textContent: string): Promise<void> {
    const { ctx } = this.p;
    const result = await this.onTextDelta(textContent);
    ctx.currentAssistantMessageId = result.currentAssistantMessageId;
    ctx.currentAssistantContent = result.currentAssistantContent;
    if (result.currentAssistantMessageId) {
      ctx.lastAssistantMessageId = result.currentAssistantMessageId;
    }

    if (result.wasCreated) {
      // If pendingQueueParentId was the parent for this new message, the chain
      // has advanced past the compacting point - advanceTip clears it so
      // finish-step and onToolCall don't re-apply the compacting ID as parent.
      this.advanceTip(result.currentAssistantMessageId, {
        clearPendingQueueParent: true,
      });
      // Record time-to-first-token on first message creation
      if (ctx.streamStartTime === null) {
        ctx.streamStartTime = Date.now();
      }
      // Reset estimated token counter for the new message
      ctx.lastEstimatedTokenEmitLength = 0;
    }

    // Emit estimated token count every ~200 chars of accumulated content.
    // SSE-only, no DB write. Corrected by real counts from onStepFinish.
    if (ctx.currentAssistantMessageId) {
      const contentLength = ctx.currentAssistantContent.length;
      if (contentLength - ctx.lastEstimatedTokenEmitLength >= 200) {
        ctx.lastEstimatedTokenEmitLength = contentLength;
        ctx.dbWriter.emitEstimatedTokens(
          ctx.currentAssistantMessageId,
          contentLength,
          ctx.estimatedInputTokens || undefined,
        );
      }
    }
  }

  /** Open a reasoning block (provider reasoning-start or inline <think>). */
  private async handleReasoningStart(): Promise<void> {
    const { ctx, ttsHandler } = this.p;
    if (ctx.isInReasoningBlock) {
      // Already open (e.g. inline <think> inside provider reasoning): one block.
      return;
    }
    ctx.isInReasoningBlock = true;
    const result = await this.onReasoningStart();
    ctx.currentAssistantMessageId = result.currentAssistantMessageId;
    ctx.currentAssistantContent = result.currentAssistantContent;
    if (result.currentAssistantMessageId) {
      ctx.lastAssistantMessageId = result.currentAssistantMessageId;
    }

    if (result.wasCreated) {
      // Chain advanced past the compacting point — clear deferred override.
      this.advanceTip(result.currentAssistantMessageId, {
        clearPendingQueueParent: true,
      });
      // Notify TTS handler of the new message ID so subsequent text-deltas
      // can be processed. Reasoning content is inside <think> tags and will
      // be automatically skipped by ttsHandler.addDelta(), but the messageId
      // must be set so text-deltas that follow reasoning are not silently dropped.
      if (ttsHandler) {
        ttsHandler.setMessageId(result.currentAssistantMessageId);
      }
    }
  }

  /** Close the open reasoning block, if any. */
  private handleReasoningEnd(): void {
    const { ctx } = this.p;
    if (ctx.isInReasoningBlock) {
      ctx.currentAssistantContent = this.onReasoningEnd();
      ctx.isInReasoningBlock = false;
    }
  }

  /** Handle a text-delta part: create the assistant message on first delta,
   *  then emit SSE + throttled DB updates for subsequent deltas. */
  private async onTextDelta(textDelta: string): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
  }> {
    return onTextDelta(this, textDelta);
  }

  /** Handle a reasoning-start part (o1-style models): open a <think> block,
   *  creating the assistant message if this is the first content. */
  private async onReasoningStart(): Promise<{
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    wasCreated: boolean;
  }> {
    return onReasoningStart(this);
  }

  /** Handle a reasoning-delta part: append reasoning text inside the open
   *  <think> block. Returns the new accumulated content. */
  private onReasoningDelta(
    reasoningText: string,
    providerMetadata?: ReasoningProviderMetadata,
  ): string {
    return onReasoningDelta(this, reasoningText, providerMetadata);
  }

  /** Handle a reasoning-end part: close the <think> block.
   *  Returns the new accumulated content. */
  private onReasoningEnd(): string {
    return onReasoningEnd(this);
  }

  /**
   * Process a `file` stream part from a media generation provider
   * (openai-images, replicate-image, fal-ai-image, etc. emit a single `file`
   * part instead of text deltas when generation finishes):
   *  1. Determines the media type (image / audio).
   *  2. Uploads the raw base64 bytes to the storage adapter → gets a permanent URL.
   *  3. Creates an ASSISTANT message with `generatedMedia` metadata so the
   *     frontend can render the result immediately.
   *  4. Emits CONTENT_DONE so the completion handler can flush cleanly.
   */
  private async onFilePart(file: GeneratedFile): Promise<void> {
    return onFilePart(this, file);
  }

  /**
   * Ensure an ASSISTANT message exists and finalize any open reasoning block.
   */
  async ensureAssistantMessage(
    initialParentId: string | null,
  ): Promise<AssistantPrepResult> {
    return ensureAssistantMessage(this, initialParentId);
  }

  /**
   * Process tool-call event from stream
   */
  private async onToolCall(part: {
    validationIssues?: string;
    type: "tool-call";
    toolCallId: string;
    toolName: string;
    input?: WidgetData;
  }): Promise<ToolCallResult> {
    return onToolCall(this, part);
  }

  /**
   * Resolve the pendingToolMessages entry for a RAW toolCallId as emitted by
   * the provider - routing to the correct de-duplicated key when this raw id
   * collided within the step (see duplicateToolCallKeys on toolExecutionContext).
   * Best-effort FIFO: the Nth tool-result/tool-error for a raw id is assumed
   * to correspond to the Nth tool-call for that raw id, which holds whenever
   * completion order matches call order (true for same-tool same-step calls
   * in practice, though not guaranteed by the SDK).
   */
  private resolvePendingToolMessage(rawToolCallId: string): {
    effectiveToolCallId: string;
    pending: PendingToolData | undefined;
  } {
    const ctx = this.p.ctx;
    const effectiveToolCallId = claimResultToolCallId(ctx, rawToolCallId);
    return {
      effectiveToolCallId,
      pending: ctx.pendingToolMessages.get(effectiveToolCallId),
    };
  }

  /**
   * Process tool-result event from stream
   */
  private async onToolResult(
    part: {
      type: "tool-result";
      toolCallId: string;
      toolName: string;
      output?: JSONValue;
      isError?: boolean;
    },
    pendingToolMessage: PendingToolData | undefined,
  ): Promise<{
    currentParentId: string | null;
  } | null> {
    return onToolResult(this, part, pendingToolMessage);
  }

  /** Process tool-error event from stream — see loop/tool-parts.ts for the
   *  full fallback-execution contract. */
  private async onToolError(
    part: {
      type: "tool-error";
      toolCallId: string;
      toolName: string;
      input?: JSONValue;
      error?: JSONValue;
    },
    pendingToolMessage: PendingToolData | undefined,
  ): Promise<{
    currentParentId: string | null;
  } | null> {
    return onToolError(this, part, pendingToolMessage);
  }

  /**
   * Process finish-step event and handle tool confirmation checks.
   */
  private async onFinishStep(): Promise<{ shouldAbort: boolean }> {
    return onFinishStep(this);
  }

  /**
   * Finalize ASSISTANT message at stream end.
   *
   * Closes any open reasoning block, emits CONTENT_DONE SSE, flushes + writes
   * final content to DB, and writes token metadata. Pass null for token params
   * when usage is not available (e.g. mid-stream tool-loop step finalization).
   */
  async finalizeAssistant(params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    finishReason: string | null | undefined;
    totalTokens: number | null | undefined;
    promptTokens: number | null | undefined;
    completionTokens: number | null | undefined;
  }): Promise<void> {
    return finalizeAssistant(this, params);
  }

  // ─── prepareStep pipeline ───────────────────────────────────────────────────
  // (mid-stream compacting → wakeUp injection → queued-message injection →
  //  cortex refresh — see loop/steps.ts)

  /**
   * Last line of defence before the SDK builds the step request: a tool call
   * without a result makes it throw AI_MissingToolResultsError and the whole
   * turn dies. Name the call (and whether the SDK's own step messages already
   * lacked it or our pipeline - compacting / injection - dropped it), then
   * answer it with an error result so the model can re-run it if needed.
   */
  private answerUnansweredToolCalls<T extends { messages?: ModelMessage[] }>(
    prepared: T,
    stepMessages: ModelMessage[],
    stepNumber: number,
  ): T {
    const candidate = prepared.messages ?? stepMessages;
    const unanswered = findUnansweredToolCalls(candidate);
    if (unanswered.length === 0) {
      return prepared;
    }
    const inSdkStepMessages = new Set(
      findUnansweredToolCalls(stepMessages).map((call) => call.toolCallId),
    );
    this.p.logger.error(
      "[prepareStep] Tool call without a result in the step prompt - answered with an error result",
      {
        stepNumber,
        threadId: this.p.threadId,
        model: this.p.model,
        pipelineRewrotePrompt: prepared.messages !== undefined,
        unansweredCount: unanswered.length,
        unansweredToolCalls: unanswered.slice(0, 5).map((call) => ({
          toolCallId: call.toolCallId,
          toolName: call.toolName,
          closedBy: call.closedBy,
          messageIndex: call.messageIndex,
          cause: inSdkStepMessages.has(call.toolCallId)
            ? "missing-in-sdk-step-messages"
            : "dropped-by-prepare-step-pipeline",
        })),
        promptToolHistory: summarizePromptToolHistory(candidate),
      },
    );
    return {
      ...prepared,
      messages: answerMissingToolResults(candidate, unanswered),
    };
  }

  private async prepareStep(
    stepMessages: ModelMessage[],
    stepNumber: number,
  ): Promise<{ messages?: ModelMessage[]; toolChoice?: "none" }> {
    return prepareStep(this, stepMessages, stepNumber);
  }

  // ─── step accounting ────────────────────────────────────────────────────────

  private onStepFinish(stepResult: {
    usage: {
      inputTokens?: number;
      outputTokens?: number;
      cachedInputTokens?: number;
      totalTokens?: number;
      inputTokenDetails?: {
        cacheReadTokens?: number;
        cacheWriteTokens?: number;
      };
      raw?: JSONValue;
    };
    finishReason?: string;
    providerMetadata?: ProviderMetadata;
    response?: {
      id?: string;
      headers?: Readonly<Record<string, string>>;
    };
    files?: ReadonlyArray<{ mediaType: string }>;
    text: string;
    requestedEndLoop: boolean;
    endLoopOnlyRename: boolean;
  }): void {
    return onStepFinish(this, stepResult);
  }

  // ─── abort + completion ─────────────────────────────────────────────────────
  // (see loop/finalize.ts)

  private abortReasonAsError(reason: JSONValue | Error | undefined): Error {
    return abortReasonAsError(reason);
  }

  /** ONE abort-handler invocation shared by the pump-return and catch paths
   *  (previously duplicated verbatim). */
  private async runAbortHandler(
    error: Error,
  ): Promise<{ wasHandled: boolean }> {
    return runAbortHandler(this, error);
  }

  private async complete(
    streamResult: ReturnType<typeof aiStreamText>,
  ): Promise<void> {
    return complete(this, streamResult);
  }

  // ─── helpers ────────────────────────────────────────────────────────────────

  /** Extract the user prompt for generated-media metadata (image/audio models):
   *  walk messages backwards to the last user text part. */
  private extractMediaPrompt(): string {
    return extractMediaPrompt(this);
  }
}
