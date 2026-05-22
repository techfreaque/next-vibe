/**
 * StreamExecutionHandler - Handles AI SDK streamText execution and processing
 */

import "server-only";

import type { JSONValue, LanguageModel, ModelMessage } from "ai";
import {
  streamText as aiStreamText,
  stepCountIs,
  type StopCondition,
} from "ai";

const DEFAULT_TEMPERATURE = 0.7;

/**
 * Estimate input token count from a ModelMessage[] array.
 * Used as a fallback when the provider doesn't report real usage in streaming mode
 * (e.g. kimi-k2.6 via Fireworks returns 0 inputTokens in SSE chunks).
 * Uses char/3.5 approximation — consistent with MessageContextBuilder.calculateTotalTokens.
 */
function estimateInputTokensFromMessages(
  messages: ModelMessage[],
  systemPrompt: string,
  tools: Record<string, CoreTool> | undefined,
): number {
  const systemTokens = Math.ceil(systemPrompt.length / 3.5);
  const toolsTokens = tools ? Math.ceil(JSON.stringify(tools).length / 2.5) : 0;
  const messagesTokens = messages.reduce((sum, msg) => {
    const { content } = msg;
    if (typeof content === "string") {
      return sum + Math.ceil(content.length / 3.5);
    }
    if (Array.isArray(content)) {
      const text = (content as Array<Record<string, string | undefined>>)
        .map((p) =>
          p.type === "text"
            ? (p.text ?? "")
            : p.type === "tool-call" || p.type === "tool-result"
              ? JSON.stringify(p)
              : "",
        )
        .join(" ");
      return sum + Math.ceil(text.length / 2.5);
    }
    return sum;
  }, 0);
  return systemTokens + toolsTokens + messagesTokens;
}

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";
import type { CoreTool } from "@/app/api/[locale]/system/unified-interface/ai/tools-loader";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { ChatModelId, ChatModelOption } from "../../models";
import type { AiStreamT } from "../../stream/i18n";
import { MAX_TOOL_CALLS } from "../core/constants";
import type { ProviderFactory } from "../core/provider-factory";
import { QueueRegistry } from "../core/stream-registry";
import type { StreamContext } from "../core/stream-context";
import type { StreamingTTSHandler } from "../streaming-tts";
import type { SystemPromptParams } from "../system-prompt/builder";
import { StreamCompletionHandler } from "./stream-completion-handler";
import { StreamPartHandler } from "./stream-part-handler";

export class StreamExecutionHandler {
  /**
   * Execute AI streaming and process all parts
   */
  static async executeStream(params: {
    provider: ReturnType<typeof ProviderFactory.getProviderForModel>;
    modelConfig: ChatModelOption;
    messages: ModelMessage[];
    streamAbortController: AbortController;
    systemPrompt: string;
    trailingSystemMessage?: string;
    tools: Record<string, CoreTool> | undefined;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number; label: string }
    >;
    /** Set of tool names the model is allowed to execute. null = all allowed. */
    activeToolNames: Set<string> | null;
    ctx: StreamContext;
    threadId: string;
    model: ChatModelId;
    skill: string;
    isIncognito: boolean;
    userId: string | undefined;
    emittedToolResultIds: Set<string> | undefined;
    ttsHandler: StreamingTTSHandler | null;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    t: AiStreamT;
    streamContext: ToolExecutionContext;
    imageSize?: string;
    imageQuality?: string;
    musicDuration?: string;
    /** Params to rebuild the system prompt per-step for fresh cortex context */
    systemPromptParams?: SystemPromptParams;
    /**
     * Real-token threshold (from API) above which mid-stream compacting fires in prepareStep.
     * Only set when tools are present (tool-loop sessions).
     * Computed as Math.min(effectiveCompactTrigger, floor(contextWindow * COMPACT_TRIGGER_PERCENTAGE))
     * — the same logic as pre-stream compacting, applied to real API-reported input token counts.
     */
    midStreamCompactingThreshold: number;
    /** Params forwarded to MidStreamCompactingHandler when mid-stream compacting triggers. */
    midStreamCompactingParams: {
      model: ChatModelId;
      skill: string;
      threadId: string;
      isIncognito: boolean;
      userId: string | undefined;
      user: JwtPayloadType;
      providerModel: Parameters<typeof aiStreamText>[0]["model"];
      t: AiStreamT;
    };
  }): Promise<void> {
    const {
      provider,
      modelConfig,
      messages,
      streamAbortController,
      systemPrompt,
      trailingSystemMessage,
      tools,
      toolsConfig,
      activeToolNames,
      ctx,
      threadId,
      model,
      skill,
      isIncognito,
      userId,
      emittedToolResultIds,
      ttsHandler,
      user,
      locale,
      logger,
      t,
    } = params;

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
    // providerOptions must be Record<string, JSONObject> (provider-keyed objects).
    // We use the "generation" key; custom providers read options.providerOptions?.["generation"].
    const { imageSize, imageQuality, musicDuration } = params;
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

    // Extract user prompt for generated media metadata (image/audio models).
    // Walk messages backwards to find the last user text part.
    let mediaPrompt = "";
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg?.role === "user") {
        const content = msg.content;
        if (typeof content === "string") {
          mediaPrompt = content.trim();
        } else if (Array.isArray(content)) {
          mediaPrompt = content
            .filter(
              (p): p is { type: "text"; text: string } => p.type === "text",
            )
            .map((p) => p.text)
            .join(" ")
            .trim();
        }
        if (mediaPrompt) {
          break;
        }
      }
    }

    const mediaCreditCost = calculateCreditCost(modelConfig, 0, 0, 0, 0);

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

    // Tracks the most recent real input token count (full prompt size that step).
    // onStepFinish is synchronous and fires before prepareStep on the next step,
    // so there is no race (JS single-threaded event loop guarantees ordering).
    // Used by prepareStep for mid-stream compacting threshold check.
    let lastStepInputTokens = 0;

    // Cumulative token accumulators for accurate credit deduction.
    // The AI SDK's streamResult.usage sums ALL steps' input tokens — wrong for billing
    // because each step re-sends the full prompt (mostly cached). We track per-step
    // uncached input (what we actually pay for) and output tokens ourselves.
    const cumulativeTokens = {
      uncachedInputTokens: 0,
      cachedInputTokens: 0,
      cacheWriteTokens: 0,
      outputTokens: 0,
      // Keep the last step's full inputTokens for display/threshold purposes
      lastInputTokens: 0,
    };

    // Some models (e.g. gpt-5-image via OpenRouter) reject the temperature parameter.
    // Only send it when the model explicitly supports it (supportsTemperature !== false).
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
              stepCountIs(MAX_TOOL_CALLS),
              // endLoop / approve / wait: stop before the next AI turn starts.
              // The current step (tool calls + results) finishes naturally;
              // this predicate prevents the AI SDK from making another API request.
              // wakeUp: also yield when a wake-up-ready pub/sub signal has arrived.
              (
                (): StopCondition<typeof tools> => () =>
                  ctx.shouldStopLoop ||
                  ctx.stepHasToolsAwaitingConfirmation ||
                  ctx.shouldYieldForWakeUp ||
                  params.streamContext.waitingForRemoteResult === true
              )(),
            ],
            // Refresh cortex context (trailing system message) before each tool loop step.
            // The AI SDK captures messages once - prepareStep is the official hook to override
            // the message list per-step. We rebuild the embedding query from accumulated
            // conversation context and replace the trailing system message with fresh results.
            // Also handles mid-stream compacting when real token usage exceeds the threshold.
            // Also injects queued user messages so the loop continues without restarting.
            prepareStep: async ({
              messages: stepMessages,
              stepNumber,
            }: {
              messages: ModelMessage[];
              stepNumber: number;
            }): Promise<{ messages?: ModelMessage[] }> => {
              // Step 0 = initial request, already has fresh context from stream-setup
              if (stepNumber === 0) {
                return {};
              }

              // === MID-STREAM COMPACTING ===
              // Runs before cortex refresh so the refreshed context is applied
              // to the compacted messages (not the full accumulated history).
              let activeMessages = stepMessages;
              if (
                params.midStreamCompactingThreshold &&
                params.midStreamCompactingParams
              ) {
                // Prefer real API-reported input tokens. Fall back to an estimate
                // from the accumulated stepMessages when the provider returns 0
                // (e.g. kimi-k2.6 via Fireworks doesn't include usage in SSE chunks).
                const effectiveInputTokens =
                  lastStepInputTokens > 0
                    ? lastStepInputTokens
                    : estimateInputTokensFromMessages(
                        stepMessages,
                        systemPrompt,
                        tools,
                      );

                if (
                  effectiveInputTokens >= params.midStreamCompactingThreshold
                ) {
                  logger.debug(
                    "[prepareStep] Mid-stream compacting threshold reached",
                    {
                      stepNumber,
                      lastStepInputTokens,
                      effectiveInputTokens,
                      threshold: params.midStreamCompactingThreshold,
                    },
                  );
                  const { MidStreamCompactingHandler } =
                    await import("./mid-stream-compacting-handler");
                  const compactResult =
                    await MidStreamCompactingHandler.compact({
                      stepMessages: activeMessages,
                      ctx,
                      ...params.midStreamCompactingParams,
                      abortSignal: streamAbortController.signal,
                      streamAbortController,
                      logger,
                    });
                  if (compactResult) {
                    // Reset so we don't re-compact on the very next step
                    lastStepInputTokens = 0;
                    activeMessages = compactResult.messages;
                    // CRITICAL: update the parent chain so the next assistant message
                    // is a child of the compacting message, not the last tool result.
                    // Any wrong parentId here breaks the linked list and creates a branch.
                    ctx.currentParentId = compactResult.compactingMessageId;
                    ctx.lastParentId = compactResult.compactingMessageId;
                    // Reset sequenceId so messages after compacting belong to a new
                    // sequence block. Without this, the UI groups pre- and post-compact
                    // messages into one block sorted before the compacting message.
                    ctx.sequenceId = crypto.randomUUID();
                  }
                  // On failure: MidStreamCompactingHandler emitted error + aborted stream.
                  // prepareStep returning {} is a no-op — abort signal is already set.
                } // end inner if effectiveInputTokens >= threshold
              } // end outer if midStreamCompactingThreshold

              // === QUEUED MESSAGE INJECTION ===
              // If a user message was queued while this stream is running, inject
              // it as the next user turn so the loop continues without restarting.
              // Race safety: QueueRegistry.shift() is synchronous and atomic in
              // the single-threaded JS event loop - no double-consumption possible.
              //
              const queuedEntry = QueueRegistry.shift(threadId);
              if (queuedEntry) {
                logger.info(
                  "[prepareStep] Injecting queued message into stream",
                  { messageId: queuedEntry.id, stepNumber, threadId },
                );

                // The queued message's parentId was continuously advanced by
                // advanceQueuedMessages(), so it already points to the current
                // frontier. Use ctx.currentParentId as the authoritative source
                // since it's updated on every DB write in this stream.
                const dequeueParentId =
                  ctx.currentParentId ?? ctx.lastParentId ?? null;

                // Clear isQueued in DB BEFORE continuing so processNextQueuedMessage
                // in the finally block doesn't re-process the same message (race safety).
                // Must be awaited — fire-and-forget would allow finally to run first.
                const dequeueNow = new Date();
                const { db: dequeueDb } =
                  await import("@/app/api/[locale]/system/db");
                const { chatMessages: dequeueMessages } =
                  await import("@/app/api/[locale]/agent/chat/db");
                const { eq: dequeueEq, sql: dequeuesSql } =
                  await import("drizzle-orm");
                try {
                  await dequeueDb
                    .update(dequeueMessages)
                    .set({
                      parentId: dequeueParentId,
                      // Merge only isQueued: false into existing metadata JSON
                      // so queuedSettings and other fields are preserved.
                      metadata: dequeuesSql`${dequeueMessages.metadata} || '{"isQueued":false}'::jsonb`,
                      // Update createdAt to now so the UI sorts this message AFTER
                      // the tool result, not before the assistant messages it was
                      // created ahead of (queued message is created before stream 1
                      // even produces its first assistant message).
                      createdAt: dequeueNow,
                      updatedAt: dequeueNow,
                    })
                    .where(dequeueEq(dequeueMessages.id, queuedEntry.id));
                } catch (err) {
                  logger.warn("[prepareStep] Failed to clear isQueued in DB", {
                    messageId: queuedEntry.id,
                    error: err instanceof Error ? err.message : String(err),
                  });
                  // On DB failure: put the entry back so processNextQueuedMessage
                  // can retry. DB still has isQueued=true, which is consistent.
                  QueueRegistry.push(threadId, queuedEntry);
                  return activeMessages !== stepMessages
                    ? { messages: activeMessages }
                    : {};
                }

                // Emit dequeue event so the frontend cache updates isQueued → false.
                const { ChatMessageRole } =
                  await import("@/app/api/[locale]/agent/chat/enum");
                ctx.dbWriter.wsEmit("message-created", {
                  streamingState: "streaming",
                  messages: [
                    {
                      id: queuedEntry.id,
                      threadId,
                      role: ChatMessageRole.USER,
                      isAI: false,
                      content: queuedEntry.content,
                      parentId: dequeueParentId,
                      sequenceId: null,
                      model: null,
                      skill: null,
                      // Explicit false clears isQueued: true from client cache
                      // (deep merge never removes absent keys)
                      metadata: {
                        ...(queuedEntry.metadata ?? {}),
                        isQueued: false,
                      },
                      createdAt: dequeueNow,
                      updatedAt: dequeueNow,
                      authorId: null,
                      authorName: null,
                      errorType: null,
                      errorCode: null,
                      errorMessage: null,
                      upvotes: 0,
                      downvotes: 0,
                      searchVector: null,
                    },
                  ],
                });

                // Advance ctx.currentParentId to the queued message so the
                // next assistant response is a child of it, not a sibling.
                // prepareStep is called by the AI SDK AFTER all step-N events
                // (tool-result, finish-step) have been fully consumed by the
                // for-await loop. Setting currentParentId here is safe — nothing
                // will overwrite it before the next step's text-delta fires.
                ctx.currentParentId = queuedEntry.id;
                ctx.lastParentId = queuedEntry.id;
                ctx.pendingQueueParentId = queuedEntry.id;
                // Reset sequenceId so ai2 gets a new sequence, separate from
                // ai1+tool. Without this, ai1/tool/ai2 share one sequenceId and
                // the UI groups them into a single block rendered before queuedUser.
                ctx.sequenceId = crypto.randomUUID();
                // Mark that a queued message was injected mid-stream so the
                // finally-block processNextQueuedMessage skips this thread.
                ctx.queueInjectedInStream = true;

                // Append user message so the AI SDK continues with it as next turn.
                const withQueued: ModelMessage[] = [
                  ...activeMessages,
                  {
                    role: "user" as const,
                    content: queuedEntry.content,
                  },
                ];
                return { messages: withQueued };
              }

              // === CORTEX REFRESH ===
              // Applied to activeMessages (possibly compacted above).
              // Skip if a queued message was just injected in the previous step —
              // the context was fresh at injection time; re-embedding now is wasteful
              // and creates an extra API call that makes fixture replay non-deterministic.
              if (!params.systemPromptParams || ctx.queueInjectedInStream) {
                return activeMessages !== stepMessages
                  ? { messages: activeMessages }
                  : {};
              }

              try {
                const [{ buildEmbeddingQuery }, { buildSystemPrompt }] =
                  await Promise.all([
                    import("../../../cortex/system-prompt/server"),
                    import("../system-prompt/builder"),
                  ]);

                // activeMessages = initialMessages + responseMessages
                // accumulated by the SDK across all steps. Pass directly
                // to buildEmbeddingQuery which handles all ModelMessage
                // content shapes (string, parts, tool calls, tool results).
                const embeddingQuery = buildEmbeddingQuery(activeMessages);

                const refreshed = await buildSystemPrompt({
                  ...params.systemPromptParams,
                  lastUserMessage: embeddingQuery,
                  voiceTranscription: null,
                });

                // Find the trailing system message index and replace it.
                // It's the last system message before the context line.
                // We find the index first so we can do a targeted splice
                // rather than spreading the entire (potentially huge) array.
                const { isContextLine } =
                  await import("../system-prompt/message-metadata");
                let replaceIdx = -1;
                for (let i = activeMessages.length - 1; i >= 0; i--) {
                  const msg = activeMessages[i];
                  if (
                    msg?.role === "system" &&
                    typeof msg.content === "string" &&
                    !isContextLine(msg.content)
                  ) {
                    replaceIdx = i;
                    break;
                  }
                }
                // Build updated array only when a replacement target is found.
                // Use slice instead of spread to avoid copying the full array.
                const updatedMessages: ModelMessage[] =
                  replaceIdx === -1
                    ? activeMessages
                    : [
                        ...activeMessages.slice(0, replaceIdx),
                        {
                          role: "system" as const,
                          content: refreshed.trailingSystemMessage,
                        },
                        ...activeMessages.slice(replaceIdx + 1),
                      ];

                logger.debug("[prepareStep] Refreshed cortex context", {
                  stepNumber,
                  embeddingQueryLength: embeddingQuery.length,
                  midStreamCompacted: activeMessages !== stepMessages,
                });

                return { messages: updatedMessages };
              } catch (error) {
                logger.warn(
                  "[prepareStep] Cortex refresh failed, using stale context",
                  {
                    stepNumber,
                    error:
                      error instanceof Error ? error.message : String(error),
                  },
                );
                return activeMessages !== stepMessages
                  ? { messages: activeMessages }
                  : {};
              }
            },
            onStepFinish: (stepResult): void => {
              const inputTokens = stepResult.usage.inputTokens ?? 0;
              const outputTokens = stepResult.usage.outputTokens ?? 0;
              const cachedInputTokens =
                stepResult.usage.cachedInputTokens ??
                stepResult.usage.inputTokenDetails?.cacheReadTokens ??
                0;
              const cacheWriteTokens =
                stepResult.usage.inputTokenDetails?.cacheWriteTokens ?? 0;
              const totalTokens = stepResult.usage.totalTokens ?? 0;

              // Track full prompt size for mid-stream compacting threshold.
              // Only update when API reported tokens — some providers (e.g. kimi-k2.6)
              // return empty usage on the final text-only step; keep last valid value.
              if (inputTokens > 0) {
                lastStepInputTokens = inputTokens;
                cumulativeTokens.lastInputTokens = inputTokens;
              }

              // Accumulate per-step uncached input + output for accurate credit billing.
              // Each step re-sends the full prompt (cached portion is cheap/free depending
              // on provider). We sum uncached input tokens across steps, not raw inputTokens,
              // to avoid counting cached tokens multiple times.
              const stepUncached = inputTokens - cachedInputTokens;
              cumulativeTokens.uncachedInputTokens += Math.max(0, stepUncached);
              cumulativeTokens.cachedInputTokens += cachedInputTokens;
              cumulativeTokens.cacheWriteTokens += cacheWriteTokens;
              cumulativeTokens.outputTokens += outputTokens;

              // Emit real per-step token counts for the assistant message that just
              // completed. This corrects any estimated tokens emitted during streaming
              // and gives the UI a live token count after each tool-loop step rather
              // than only at the very end. SSE-only, no DB write - the final
              // StreamCompletionHandler writes the cumulative total to DB.
              const stepAssistantMessageId =
                ctx.currentAssistantMessageId ?? ctx.lastAssistantMessageId;
              if (
                stepAssistantMessageId &&
                (inputTokens > 0 || outputTokens > 0)
              ) {
                const uncachedInputTokens = inputTokens - cachedInputTokens;
                const stepCreditCost = calculateCreditCost(
                  modelConfig,
                  uncachedInputTokens,
                  outputTokens,
                  cachedInputTokens,
                  cacheWriteTokens,
                );
                ctx.dbWriter.emitTokensUpdated({
                  messageId: stepAssistantMessageId,
                  promptTokens: inputTokens,
                  completionTokens: outputTokens,
                  totalTokens,
                  cachedInputTokens,
                  cacheWriteTokens,
                  timeToFirstToken: null,
                  streamingTime: null,
                  finishReason: stepResult.finishReason ?? null,
                  creditCost: stepCreditCost,
                });
              }
            },
          }
        : {}),
    });

    try {
      for await (const part of streamResult.fullStream) {
        const { shouldAbort } = await StreamPartHandler.processPart({
          part,
          ctx,
          threadId,
          model,
          skill,
          isIncognito,
          userId,
          user,
          locale,
          toolsConfig,
          activeToolNames,
          streamAbortController,
          emittedToolResultIds,
          ttsHandler,
          logger,
          t,
          streamContext: params.streamContext,
          mediaPrompt,
          mediaCreditCost,
        });

        if (shouldAbort) {
          // Stream was intentionally aborted (e.g. REMOTE_TOOL_WAIT, endLoop).
          // Run AbortErrorHandler now - the stream loop exited via 'return', not
          // via an exception, so the catch block below will NOT fire.
          // AbortErrorHandler sets thread → "waiting" for REMOTE_TOOL_WAIT so
          // clearStreamingState (in the finally block) sees the state and skips.
          if (streamAbortController.signal.aborted && !ctx.abortHandled) {
            const reason = streamAbortController.signal.reason;
            const abortError =
              reason instanceof Error
                ? reason
                : new Error(String(reason ?? "Stream aborted"));
            const { AbortErrorHandler } = await import("./abort-error-handler");
            await AbortErrorHandler.handleAbortError({
              error: abortError,
              ctx,
              logger,
              threadId,
              isIncognito,
              userId,
              model,
              systemPrompt,
              trailingSystemMessage,
              messages,
              tools,
              toolsConfig,
              user,
              t,
            });
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

      // If stream was intentionally aborted, run AbortErrorHandler for cleanup
      // (save partial content, deduct credits, emit interruption message).
      // The handler is idempotent via ctx.abortHandled flag.
      if (streamAbortController.signal.aborted) {
        const reason = streamAbortController.signal.reason;
        const abortError =
          reason instanceof Error
            ? reason
            : new Error(String(reason ?? "Stream aborted"));

        if (!ctx.abortHandled) {
          const { AbortErrorHandler } = await import("./abort-error-handler");
          await AbortErrorHandler.handleAbortError({
            error: abortError,
            ctx,
            logger,
            threadId,
            isIncognito,
            userId,
            model,
            systemPrompt,
            trailingSystemMessage,
            messages,
            tools,
            toolsConfig,
            user,
            t,
          });
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

      // Non-abort error: try AbortErrorHandler (handles e.g. "Client disconnected")
      if (streamError instanceof Error) {
        const { AbortErrorHandler } = await import("./abort-error-handler");
        const { wasHandled } = await AbortErrorHandler.handleAbortError({
          error: streamError,
          ctx,
          logger,
          threadId,
          isIncognito,
          userId,
          model,
          systemPrompt,
          trailingSystemMessage,
          messages,
          tools,
          user,
          t,
        });

        if (wasHandled) {
          ctx.abortHandled = true;
          return;
        }
      }

      // Not an abort error, re-throw to outer StreamErrorCatchHandler
      // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Re-throw is necessary here to propagate to StreamErrorCatchHandler
      throw streamError;
    }

    const [usageData, providerMeta] = await Promise.all([
      streamResult.usage,
      streamResult.providerMetadata,
    ]);

    // For reasoning tokens we still read from the SDK's aggregate (output-only, not re-sent).
    const reasoningTokens =
      usageData.reasoningTokens ??
      usageData.outputTokenDetails?.reasoningTokens ??
      0;

    // Use our per-step accumulators for accurate billing:
    // - uncachedInputTokens: sum of per-step uncached input (what we actually pay for)
    // - cachedInputTokens: sum of per-step cached reads (cheap/free depending on provider)
    // - cacheWriteTokens: sum of per-step cache writes
    // - outputTokens: sum of per-step output tokens (always fully billed)
    // - lastInputTokens: full prompt size on the last step (for display/threshold)
    //
    // The AI SDK's streamResult.usage.inputTokens is the SUM of all steps' full prompts —
    // this massively over-counts because each step re-sends the cached history.
    // providerMeta cacheWriteTokens fallback for claude-code provider.
    const providerCacheWriteTokens =
      (
        providerMeta?.["claude-code"] as
          | { cacheWriteTokens?: number }
          | undefined
      )?.cacheWriteTokens ?? 0;
    const finalCacheWriteTokens =
      cumulativeTokens.cacheWriteTokens > 0
        ? cumulativeTokens.cacheWriteTokens
        : providerCacheWriteTokens;

    const finalInputTokens = cumulativeTokens.lastInputTokens;
    const finalOutputTokens = cumulativeTokens.outputTokens;
    const finalCachedInputTokens = cumulativeTokens.cachedInputTokens;
    const finalUncachedInputTokens = cumulativeTokens.uncachedInputTokens;
    const finalTotalTokens =
      finalUncachedInputTokens + finalCachedInputTokens + finalOutputTokens;

    const actualCreditCost = calculateCreditCost(
      modelConfig,
      finalUncachedInputTokens,
      finalOutputTokens,
      finalCachedInputTokens,
      finalCacheWriteTokens,
    );

    const cachePercentage =
      finalInputTokens > 0
        ? Math.round((finalCachedInputTokens / finalInputTokens) * 100)
        : 0;

    logger.debug("[CACHE DEBUG] Token usage from AI response", {
      cachePercentage: `${cachePercentage}%`,
      cachedInputTokens: finalCachedInputTokens,
      cacheWriteTokens: finalCacheWriteTokens,
      uncachedInputTokens: finalUncachedInputTokens,
      inputTokens: finalInputTokens,
      outputTokens: finalOutputTokens,
      reasoningTokens,
      totalTokens: finalTotalTokens,
      actualCreditCost,
      model,
      threadId,
      rawUsageData: JSON.stringify(usageData),
    });

    const [finishReason, streamWarnings] = await Promise.all([
      streamResult.finishReason,
      streamResult.warnings,
    ]);

    if (finishReason === "error") {
      logger.error("[AI Stream] Provider returned finishReason=error", {
        model,
        threadId,
        totalTokens: finalTotalTokens,
        warnings: JSON.stringify(streamWarnings ?? []),
        messageCount: messages.length,
        messageRoles: messages.map((m) => m.role).join(","),
        lastMessageRole: messages[messages.length - 1]?.role,
      });
    }

    await StreamCompletionHandler.handleCompletion({
      ctx,
      usage: {
        inputTokens: finalInputTokens,
        outputTokens: finalOutputTokens,
        totalTokens: finalTotalTokens,
        cachedInputTokens: finalCachedInputTokens,
        cacheWriteTokens: finalCacheWriteTokens,
      },
      finishReason: finishReason ?? null,
      ttsHandler,
      user,
      modelCost: actualCreditCost,
      model,
      threadId,
      locale,
      logger,
    });
  }
}
