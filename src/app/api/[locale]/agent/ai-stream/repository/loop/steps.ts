/**
 * Step lifecycle for the StreamLoop: finish-step handling, the prepareStep
 * pipeline (mid-stream compacting → wakeUp injection → queued-message
 * injection → cortex refresh), and per-step token accounting.
 */

import "server-only";

import type { ModelMessage } from "ai";

import { calculateCreditCost } from "@/app/api/[locale]/agent/models/models";

import { ThreadStreamingState } from "../../../chat/enum";
import {
  AbortReason,
  MAX_TOOL_CALLS,
  StreamAbortError,
} from "../core/constants";
import { buildSseMessageRow } from "../core/db-writer/sse-row";
import { QueueRegistry } from "../core/stream";
import { estimateInputTokens } from "../core/token-estimator";
import { injectPendingWakeUpResults } from "../revival/revival";
import { FINAL_STEP_INSTRUCTIONS } from "./helpers";
import type { StreamLoopState } from "./state";
import { TokenAccumulator } from "./token-accumulator";

/**
 * Process finish-step event and handle tool confirmation checks.
 */
export async function onFinishStep(
  state: StreamLoopState,
): Promise<{ shouldAbort: boolean }> {
  const { ctx, streamAbortController, streamContext, logger } = state.p;

  // Finalize current ASSISTANT message before resetting for next step.
  // For tool-loop steps the usage/finishReason promises may not resolve yet,
  // so we pass null - the content is what matters here for DB persistence.
  if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
    await state.finalizeAssistant({
      currentAssistantMessageId: ctx.currentAssistantMessageId,
      currentAssistantContent: ctx.currentAssistantContent,
      isInReasoningBlock: ctx.isInReasoningBlock,
      finishReason: null,
      totalTokens: null,
      promptTokens: null,
      completionTokens: null,
    });
  }

  // endLoop + remote queue: if a remote task is still in-flight (waitingForRemoteResult),
  // use REMOTE_TOOL_WAIT instead of LOOP_STOP so the thread enters "waiting" state and
  // the pulse path executes the task, backfills the result, then transitions → "idle".
  // The endLoop flag is preserved in wakeUpCallbackMode on the cron task; handleTaskCompletion
  // inserts a deferred message and clears the waiting state without firing revival.
  if (
    ctx.shouldStopLoop &&
    streamContext.waitingForRemoteResult &&
    ctx.pendingToolMessages.size === 0
  ) {
    streamContext.waitingForRemoteResult = false;
    logger.debug(
      "[AI Stream] endLoop + remote queue - using REMOTE_TOOL_WAIT so pulse can backfill",
    );
    streamAbortController.abort(
      new StreamAbortError(AbortReason.REMOTE_TOOL_WAIT),
    );
    return { shouldAbort: true };
  }

  // endLoop: abort only when no more tool-calls are pending (supports sequential tool calls).
  // shouldStopLoop persists across steps - once set it stays true until abort.
  // Only abort when pendingToolMessages is empty (all tool steps done, AI response turn next).
  if (ctx.shouldStopLoop && ctx.pendingToolMessages.size === 0) {
    logger.debug(
      "[AI Stream] Step complete - model requested loop stop via endLoop, aborting stream",
    );

    streamAbortController.abort(new StreamAbortError(AbortReason.LOOP_STOP));

    return { shouldAbort: true };
  }

  // APPROVE: abort after ALL tool-call steps complete (supports sequential tool calls).
  // stepHasToolsAwaitingConfirmation persists across steps - once set, it stays true
  // until the stream aborts. Only abort when no more tool-calls are pending
  // (pendingToolMessages is empty), meaning the AI has finished all tool steps and
  // would start the AI-response turn next. This prevents the AI from processing
  // the placeholder results and generating a response before user confirms.
  if (
    ctx.stepHasToolsAwaitingConfirmation &&
    ctx.pendingToolMessages.size === 0 &&
    !streamContext.waitingForRemoteResult
  ) {
    logger.debug(
      "[AI Stream] APPROVE - all tool steps complete, aborting before AI response turn",
    );
    streamAbortController.abort(
      new StreamAbortError(AbortReason.TOOL_CONFIRMATION),
    );
    return { shouldAbort: true };
  }

  // WAIT mode: abort here (at finish-step) to prevent the AI SDK from making
  // another API call (call 2) with the pending tool result. Deferring from tool-result
  // to here guarantees no race between the abort signal and the next HTTP request.
  if (
    streamContext.waitingForRemoteResult &&
    ctx.pendingToolMessages.size === 0
  ) {
    streamContext.waitingForRemoteResult = false;
    logger.debug(
      "[AI Stream] WAIT mode - all tool steps complete, aborting before AI response turn",
    );
    streamAbortController.abort(
      new StreamAbortError(AbortReason.REMOTE_TOOL_WAIT),
    );
    return { shouldAbort: true };
  }

  // Remote queue / await-task: if a tool set pendingTimeoutMs, start the timeout timer.
  // The timer fires AbortReason.STREAM_TIMEOUT so the stream dies cleanly - revival handles
  // continuation when /report delivers the result. Clears itself if stream aborts first.
  if (streamContext.pendingTimeoutMs) {
    const timeoutMs = streamContext.pendingTimeoutMs;
    streamContext.pendingTimeoutMs = undefined; // consume - only fire once
    logger.debug(
      "[AI Stream] Starting stream timeout timer (remote result pending)",
      { timeoutMs },
    );
    const timer = setTimeout(() => {
      logger.debug("[AI Stream] Stream timeout reached - aborting stream", {
        timeoutMs,
      });
      streamAbortController.abort(
        new StreamAbortError(AbortReason.STREAM_TIMEOUT),
      );
    }, timeoutMs);
    // Cancel the timer if the stream aborts for any other reason first
    streamAbortController.signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
      },
      { once: true },
    );
    // Expose a cancel function so the stream's finally block can cancel
    // the timer when the stream ends naturally (e.g. wakeUp mode where the
    // AI writes a response and the loop exits without hitting the timeout).
    streamContext.cancelPendingStreamTimer = (): void => {
      clearTimeout(timer);
      streamContext.cancelPendingStreamTimer = undefined;
    };
  }

  // After a step finishes, update currentParentId to point to the last message.
  // If prepareStep injected a queued message (pendingQueueParentId is set),
  // override to the queued message so the next AI turn is its child.
  // prepareStep fires BEFORE the consumer processes tool-result/finish-step events,
  // so we can't set currentParentId there directly — it would be overwritten by
  // tool-result processing. We defer the override to here instead.
  const nextParentId = ctx.pendingQueueParentId ?? ctx.lastParentId;
  logger.debug("[AI Stream] Step finished - updating parent chain", {
    oldParentId: ctx.currentParentId,
    newParentId: nextParentId,
    pendingQueueParentId: ctx.pendingQueueParentId,
  });
  ctx.currentParentId = nextParentId;
  ctx.pendingQueueParentId = null;

  // Reset currentAssistantMessageId so the next step creates a new ASSISTANT message
  ctx.currentAssistantMessageId = null;
  ctx.currentAssistantContent = "";

  // Clear seen toolCallIds so next step can use any ID.
  // The duplicate guard is per-step: within one step, duplicate IDs cause DB conflicts.
  // Across steps, the same ID is valid (different tool call in a new step).
  ctx.allSeenToolCallIds.clear();
  // Same-step scope as allSeenToolCallIds - see stream.ts for what these track.
  ctx.duplicateToolCallKeys.clear();
  ctx.executeClaimCount.clear();
  ctx.resultClaimCount.clear();

  // NOTE: do NOT reset stepHasToolsAwaitingConfirmation here —
  // it persists across steps so sequential approve tool calls still abort correctly.

  return { shouldAbort: false };
}

// ─── prepareStep pipeline ───────────────────────────────────────────────────

export async function prepareStep(
  state: StreamLoopState,
  stepMessages: ModelMessage[],
  stepNumber: number,
): Promise<{ messages?: ModelMessage[]; toolChoice?: "none" }> {
  // Final permitted step (stepCountIs stops AFTER it): force a text-only
  // turn so every stream ends with an assistant answer, never on a dangling
  // tool result. Without this, a sub-agent that hits its maxToolCalls cap
  // mid-tool-loop returns an empty final message to ai-run and the parent
  // model flounders hunting for the missing result. toolChoice alone is not
  // enough — a model that still wants a tool emits its tool-call syntax as
  // raw text — so the wrap-up instruction is injected alongside it.
  const cap = state.p.maxToolCalls ?? MAX_TOOL_CALLS;
  const isFinalStep = stepNumber >= cap - 1 && stepNumber > 0;
  // Revival streams get NO special clamp: the completed tool call + result
  // are in the history, and a model with well-formed state continues its
  // task from there — including further tool calls for long-running work.
  // If a revival ever re-dispatches the completed call, the HISTORY is
  // broken (missing/misordered result) and that is the bug to fix.
  const finalStepGuard: { toolChoice?: "none" } = isFinalStep
    ? { toolChoice: "none" }
    : {};
  const withFinalStepNote = (messages: ModelMessage[]): ModelMessage[] =>
    isFinalStep
      ? [...messages, { role: "system", content: FINAL_STEP_INSTRUCTIONS }]
      : messages;

  // Step 0 = initial request, already has fresh context from stream-setup
  if (stepNumber === 0) {
    return finalStepGuard.toolChoice ? finalStepGuard : {};
  }

  // Runs before cortex refresh so the refreshed context is applied
  // to the compacted messages (not the full accumulated history).
  const compacted = await performMidStreamCompacting(
    state,
    stepMessages,
    stepNumber,
  );

  // wakeUp results that completed while this stream runs: write the
  // deferred message at the live chain tip and inject the result
  // into the in-flight context — the model acknowledges it as the
  // natural next step (no separate revival turn).
  const { ctx } = state.p;
  const wakeUpDrained =
    ctx.pendingWakeUpInjections.length > 0
      ? await injectPendingWakeUpResults({
          messages: compacted,
          payloads: ctx.pendingWakeUpInjections.splice(
            0,
            ctx.pendingWakeUpInjections.length,
          ),
          ctx,
          streamContext: state.p.streamContext,
          threadId: state.p.threadId,
          modelConfig: state.p.modelConfig,
          user: state.p.user,
          logger: state.p.logger,
        })
      : null;
  const activeMessages = wakeUpDrained ?? compacted;

  // If a user message was queued while this stream is running, inject
  // it as the next user turn so the loop continues without restarting.
  // Race safety: QueueRegistry.shift() is synchronous and atomic in
  // the single-threaded JS event loop - no double-consumption possible.
  const injected = await injectQueuedMessage(state, activeMessages, stepNumber);
  if (injected === "skip-cortex") {
    // DB failure writing dequeue — entry re-queued; return compacted messages.
    return {
      messages: withFinalStepNote(activeMessages),
      ...finalStepGuard,
    };
  }
  if (injected !== null) {
    // A queued USER message enters the stream: from here on this is a real
    // user turn — lift the revival text-only constraint (keep only the
    // final-step guard).
    state.p.ctx.queuedMessageInjected = true;
    return {
      ...injected,
      ...(injected.messages
        ? { messages: withFinalStepNote(injected.messages) }
        : {}),
      ...(isFinalStep ? { toolChoice: "none" as const } : {}),
    };
  }

  // Cortex refresh — applied to activeMessages (possibly compacted above).
  // Skipped if a queued message was just injected in a prior step —
  // the context was fresh at injection time; re-embedding now is wasteful
  // and creates an extra API call that makes fixture replay non-deterministic.
  const updatedMessages = await refreshCortexContext(
    state,
    activeMessages,
    stepNumber,
    activeMessages !== stepMessages,
  );

  return {
    messages: withFinalStepNote(updatedMessages),
    ...finalStepGuard,
  };
}

async function performMidStreamCompacting(
  state: StreamLoopState,
  stepMessages: ModelMessage[],
  stepNumber: number,
): Promise<ModelMessage[]> {
  const { ctx, logger, streamAbortController } = state.p;
  if (
    !state.p.midStreamCompactingThreshold ||
    !state.p.midStreamCompactingParams
  ) {
    return stepMessages;
  }
  // Prefer real API-reported input tokens. Fall back to an estimate
  // from the accumulated stepMessages when the provider returns 0
  // (e.g. kimi-k2.6 via Fireworks doesn't include usage in SSE chunks).
  const effectiveInputTokens =
    state.p.ctx.lastStepInputTokens > 0
      ? state.p.ctx.lastStepInputTokens
      : estimateInputTokens(stepMessages, state.p.systemPrompt, state.p.tools);

  if (effectiveInputTokens < state.p.midStreamCompactingThreshold) {
    return stepMessages;
  }

  logger.debug("[prepareStep] Mid-stream compacting threshold reached", {
    stepNumber,
    lastStepInputTokens: state.p.ctx.lastStepInputTokens,
    effectiveInputTokens,
    threshold: state.p.midStreamCompactingThreshold,
  });
  const { MidStreamCompactingHandler } =
    await import("../compacting/mid-stream");
  const compactResult = await MidStreamCompactingHandler.compact({
    stepMessages,
    ctx,
    ...state.p.midStreamCompactingParams,
    abortSignal: streamAbortController.signal,
    streamAbortController,
    logger,
  });
  if (compactResult) {
    // Reset to 1 (not 0) so the fallback estimator is suppressed on
    // the next prepareStep. With 0, the estimator would re-evaluate
    // from the compacted messages and could immediately re-trigger.
    state.p.ctx.lastStepInputTokens = 1;
    // CRITICAL: update the parent chain so the next assistant message
    // is a child of the compacting message, not the last tool result.
    // Any wrong parentId here breaks the linked list and creates a branch.
    ctx.currentParentId = compactResult.compactingMessageId;
    ctx.lastParentId = compactResult.compactingMessageId;
    // prepareStep can fire BEFORE the consumer has processed the
    // previous step's tool-result/finish-step parts - those would
    // overwrite the direct sets above with the pre-compacting tool
    // tip, and the stream would continue from before the compacting
    // message. pendingQueueParentId is the deferred override that
    // finish-step consumes LAST, after all tool results.
    ctx.pendingQueueParentId = compactResult.compactingMessageId;
    // Reset sequenceId so messages after compacting belong to a new
    // sequence block. Without this, the UI groups pre- and post-compact
    // messages into one block sorted before the compacting message.
    ctx.sequenceId = crypto.randomUUID();
    return compactResult.messages;
  }
  // On failure: MidStreamCompactingHandler emitted error + aborted stream.
  // Returning stepMessages is a no-op — abort signal is already set.
  return stepMessages;
}

/**
 * Returns:
 *  { messages } — injected; use as return value for prepareStep
 *  "skip-cortex" — DB failure; return activeMessages directly, skip cortex refresh
 *  null — no queued entry; proceed to cortex refresh
 */
async function injectQueuedMessage(
  state: StreamLoopState,
  activeMessages: ModelMessage[],
  stepNumber: number,
): Promise<{ messages: ModelMessage[] } | "skip-cortex" | null> {
  const { ctx, threadId, logger } = state.p;
  const queuedEntry = QueueRegistry.shift(threadId);
  if (!queuedEntry) {
    return null;
  }

  logger.info("[prepareStep] Injecting queued message into stream", {
    messageId: queuedEntry.id,
    stepNumber,
    threadId,
  });

  // The queued message's parentId was continuously advanced by
  // advanceQueuedMessages(), so it already points to the current
  // frontier. Prefer pendingQueueParentId (set when compacting
  // inserted a message this prepareStep - the consumer may have
  // overwritten currentParentId with the pre-compacting tool tip),
  // then ctx.currentParentId which is updated on every DB write.
  const dequeueParentId =
    ctx.pendingQueueParentId ?? ctx.currentParentId ?? ctx.lastParentId ?? null;

  // Clear isQueued in DB BEFORE continuing so processNextQueuedMessage
  // in the finally block doesn't re-process the same message (race safety).
  // Must be awaited — fire-and-forget would allow finally to run first.
  const dequeueNow = new Date();
  const { db: dequeueDb } = await import("next-vibe/database");
  const { chatMessages: dequeueMessages } =
    await import("@/app/api/[locale]/agent/chat/db");
  const { eq: dequeueEq, sql: dequeuesSql } = await import("drizzle-orm");
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
    return "skip-cortex";
  }

  // Emit dequeue event so the frontend cache updates isQueued → false.
  const { ChatMessageRole } =
    await import("@/app/api/[locale]/agent/chat/enum");
  ctx.dbWriter.wsEmit("message-created", {
    urlPathParams: { threadId },
    responseData: {
      streamingState: ThreadStreamingState.STREAMING,
      messages: [
        buildSseMessageRow({
          id: queuedEntry.id,
          threadId,
          role: ChatMessageRole.USER,
          content: queuedEntry.content,
          parentId: dequeueParentId,
          // Explicit false clears isQueued: true from client cache
          // (deep merge never removes absent keys)
          metadata: {
            ...queuedEntry.metadata,
            isQueued: false,
          },
          createdAt: dequeueNow,
          updatedAt: dequeueNow,
        }),
      ],
    },
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
  return {
    messages: [
      ...activeMessages,
      { role: "user" as const, content: queuedEntry.content },
    ],
  };
}

async function refreshCortexContext(
  state: StreamLoopState,
  activeMessages: ModelMessage[],
  stepNumber: number,
  compacted: boolean,
): Promise<ModelMessage[]> {
  const { ctx, logger } = state.p;
  if (!state.p.systemPromptParams || ctx.queueInjectedInStream) {
    return activeMessages;
  }

  try {
    const { buildSystemPrompt } = await import("../../system-prompt/builder");

    // Await the previous assistant message's write-time embed so the cortex
    // search below sees this turn's assistant vector. The search reads STORED
    // message vectors only — no query is re-embedded here. Best-effort: a failed
    // embed just means one fewer query vector, never a blocked refresh.
    if (ctx.dbWriter.assistantEmbedPromise) {
      await ctx.dbWriter.assistantEmbedPromise.catch(() => undefined);
    }

    const refreshed = await buildSystemPrompt({
      ...state.p.systemPromptParams,
      voiceTranscription: null,
    });

    // Find the trailing system message index and replace it.
    // It's the last system message before the context line.
    // We find the index first so we can do a targeted splice
    // rather than spreading the entire (potentially huge) array.
    const { isContextLine } = await import("../../system-prompt/builder");
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
      midStreamCompacted: compacted,
    });

    return updatedMessages;
  } catch (error) {
    logger.warn("[prepareStep] Cortex refresh failed, using stale context", {
      stepNumber,
      error: error instanceof Error ? error.message : String(error),
    });
    return activeMessages;
  }
}

// ─── step accounting ────────────────────────────────────────────────────────

export function onStepFinish(
  state: StreamLoopState,
  stepResult: {
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
  },
): void {
  const { ctx, modelConfig } = state.p;
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
    state.p.ctx.lastStepInputTokens = inputTokens;
  }

  TokenAccumulator.accumulate(state.p.ctx, {
    inputTokens,
    outputTokens,
    cachedInputTokens,
    cacheWriteTokens,
  });

  // Emit real per-step token counts for the assistant message that just
  // completed. This corrects any estimated tokens emitted during streaming
  // and gives the UI a live token count after each tool-loop step rather
  // than only at the very end. SSE-only, no DB write - the final
  // completion writes the cumulative total to DB.
  const stepAssistantMessageId =
    ctx.currentAssistantMessageId ?? ctx.lastAssistantMessageId;
  if (stepAssistantMessageId && (inputTokens > 0 || outputTokens > 0)) {
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
}
