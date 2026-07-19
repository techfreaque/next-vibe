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
  TextStreamPart,
  ToolSet,
} from "ai";
import {
  stepCountIs,
  type StopCondition,
  streamText as aiStreamText,
} from "ai";
import { calculateCreditCost } from "next-vibe/agent/models/models";
import type { WidgetData } from "next-vibe/core/utils/json";

import {
  AbortReason,
  MAX_TOOL_CALLS,
  StreamAbortError,
} from "../core/constants";
import { claimResultToolCallId, type PendingToolData } from "../core/stream";
import {
  abortReasonAsError,
  complete,
  finalizeAssistant,
  runAbortHandler,
} from "./finalize";
import { DEFAULT_TEMPERATURE } from "./helpers";
import { extractMediaPrompt, onFilePart } from "./media-parts";
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
} from "./text-parts";
import {
  onToolCall,
  onToolError,
  onToolResult,
  type ToolCallResult,
} from "./tool-parts";
import { FirstPartWatchdog } from "./watchdog";

export class StreamLoop implements StreamLoopState {
  constructor(readonly p: StreamLoopParams) {}

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
   */
  async run(): Promise<void> {
    const {
      provider,
      modelConfig,
      messages,
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
    const tools = loadedTools;

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

    // Some models (e.g. gpt-5-image via OpenRouter) reject the temperature
    // parameter. Only send it when the model explicitly supports it.
    const temperatureParam =
      modelConfig.features.supportsTemperature !== false
        ? { temperature: DEFAULT_TEMPERATURE }
        : {};

    const streamResult = aiStreamText({
      model: provider.chat(modelConfig.providerModel) as LanguageModel,
      messages,
      ...temperatureParam,
      abortSignal: streamAbortController.signal,
      system: systemWithCacheControl,
      ...(Object.keys(providerOptions).length > 0 ? { providerOptions } : {}),
      ...(tools
        ? {
            tools,
            stopWhen: [
              stepCountIs(this.p.maxToolCalls ?? MAX_TOOL_CALLS),
              // endLoop / approve / wait: stop before the next AI turn starts.
              // The current step (tool calls + results) finishes naturally;
              // this predicate prevents the AI SDK from making another API
              // request. (wakeUp results do NOT stop the loop — they are
              // injected into the next step by prepareStep so the model
              // acknowledges them in-context.)
              (
                (): StopCondition<typeof tools> => () =>
                  ctx.shouldStopLoop ||
                  ctx.stepHasToolsAwaitingConfirmation ||
                  // execute-tool's confirmation gate sets the flag on the tool
                  // execution context synchronously inside execute() - read it
                  // here too so the SDK never starts the next step before the
                  // part consumer has bridged it onto the loop context.
                  this.p.toolExecutionContext
                    .stepHasToolsAwaitingConfirmation === true ||
                  this.p.toolExecutionContext.waitingForRemoteResult === true
              )(),
            ],
            // Per-step message-list override — the official AI SDK hook.
            // Pipeline: mid-stream compacting → wakeUp result injection →
            // queued-message injection → cortex refresh.
            prepareStep: async ({
              messages: stepMessages,
              stepNumber,
            }: {
              messages: ModelMessage[];
              stepNumber: number;
            }): Promise<{
              messages?: ModelMessage[];
              toolChoice?: "none";
            }> => this.prepareStep(stepMessages, stepNumber),
            onStepFinish: (stepResult): void => {
              this.onStepFinish(stepResult);
            },
          }
        : {}),
    });

    FirstPartWatchdog.arm(this.p.ctx, () => this.firstPartTimeout());

    try {
      for await (const part of streamResult.fullStream) {
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
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw is necessary here to propagate to StreamErrorCatchHandler
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
      const textContent = part.text;
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

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-start") {
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

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-delta") {
      const reasoningText = part.text;
      ctx.currentAssistantContent = this.onReasoningDelta(reasoningText);

      return { shouldAbort: false };
    }

    if (part.type === "reasoning-end") {
      if (ctx.isInReasoningBlock) {
        ctx.currentAssistantContent = this.onReasoningEnd();
        ctx.isInReasoningBlock = false;
      }

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

        const result = await this.onToolCall({
          type: "tool-call",
          toolCallId: effectiveToolCallId,
          toolName: part.toolName,
          input: "input" in part ? (part.input as JSONValue) : undefined,
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
      logger.error("[AI Stream] Provider emitted error part", {
        error:
          rawError instanceof Error
            ? rawError.message
            : rawError !== undefined && rawError !== null
              ? JSON.stringify(rawError)
              : "unknown",
        model,
        threadId,
      });
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
  private onReasoningDelta(reasoningText: string): string {
    return onReasoningDelta(this, reasoningText);
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
    };
    finishReason?: string;
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
