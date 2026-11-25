/**
 * Abort handling + stream completion for the StreamLoop: final assistant
 * message persistence, token/credit finalization, and cleanup.
 */

import "server-only";

import type { JSONValue, streamText as aiStreamText } from "ai";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";

import { repairMangledStorageUrlsInText } from "../../../chat/storage/storage-url";
import {
  ApiProvider,
  creditsWithoutPlatformMarkup,
} from "../../../models/models";
import { StreamErrorType } from "../core/constants";
import { clearStreamingState } from "../core/stream";
import { providerErrorTranslationKey } from "../errors/provider-error-key";
import { endLoopNeedsAnswerStep } from "./helpers";
import type { StreamLoopState } from "./state";
import {
  producedImageFile,
  readCacheUsage,
  readImageOutputTokens,
  readStepUpstreamCost,
  TokenAccumulator,
} from "./token-accumulator";

/**
 * Finalize ASSISTANT message at stream end.
 *
 * Closes any open reasoning block, emits CONTENT_DONE SSE, flushes + writes
 * final content to DB, and writes token metadata. Pass null for token params
 * when usage is not available (e.g. mid-stream tool-loop step finalization).
 */
export async function finalizeAssistant(
  state: StreamLoopState,
  params: {
    currentAssistantMessageId: string;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    finishReason: string | null | undefined;
    totalTokens: number | null | undefined;
    promptTokens: number | null | undefined;
    completionTokens: number | null | undefined;
  },
): Promise<void> {
  const { logger } = state.p;
  const { dbWriter, currentReasoningSignature, currentReasoningRedactedData } =
    state.p.ctx;
  const {
    currentAssistantMessageId,
    isInReasoningBlock,
    finishReason,
    totalTokens,
    promptTokens,
    completionTokens,
  } = params;

  // Models rebuilding a media link from a tool result's bare URL drop the
  // /files segment: repair exactly that pattern before it is persisted
  // (CONTENT_DONE carries the repaired content to the client too).
  let currentAssistantContent = repairMangledStorageUrlsInText(
    params.currentAssistantContent,
  );

  // If reasoning block is still open, close it
  if (isInReasoningBlock) {
    const thinkCloseTag = "</think>";
    currentAssistantContent += thinkCloseTag;
    dbWriter.emitClosingDelta(currentAssistantMessageId, thinkCloseTag);
  }

  // Emit CONTENT_DONE + flush + write final content + token metadata to DB
  await dbWriter.emitContentDone({
    messageId: currentAssistantMessageId,
    content: currentAssistantContent,
    finishReason: finishReason ?? null,
    totalTokens: totalTokens ?? null,
    promptTokens: promptTokens ?? null,
    completionTokens: completionTokens ?? null,
    reasoningSignature: currentReasoningSignature ?? undefined,
    reasoningRedactedData: currentReasoningRedactedData ?? undefined,
  });

  logger.debug("[FinalizationHandler] Persisted ASSISTANT message", {
    messageId: currentAssistantMessageId,
    contentLength: currentAssistantContent.length,
  });
}

export function abortReasonAsError(
  reason: JSONValue | Error | undefined,
): Error {
  return reason instanceof Error
    ? reason
    : new Error(String(reason ?? "Stream aborted"));
}

/**
 * Bill the steps that already finished when a turn ends without complete():
 * endLoop / approve / wait park-aborts, user stop, client disconnect,
 * superseded, provider error. The provider charged for every finished step;
 * before this, all of them were dropped. A new thread's first turn ends with
 * rename-thread + endLoop, so it was never billed at all.
 * Idempotent via ctx.tokensBilled (complete() sets it too).
 */
export async function billCompletedSteps(
  state: StreamLoopState,
): Promise<void> {
  const { ctx, modelConfig, model, user, logger } = state.p;
  // The AI SDK enqueues the finish-step part BEFORE it awaits onStepFinish
  // (where the counters are accumulated). A park-abort fires from the
  // finish-step part handler, so yield one macrotask to let the last step's
  // onStepFinish land before reading the counters.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
  const steps = TokenAccumulator.unbilledCompletedSteps(ctx);
  if (!steps) {
    return;
  }
  ctx.tokensBilled = true;
  const { credits: creditCost, upstreamCost } = TokenAccumulator.resolveCharge(
    ctx,
    modelConfig,
    steps,
  );
  logger.info("[AI Stream] Billing finished steps of a turn ended early", {
    model,
    ...steps,
    ...upstreamCost,
    creditCost,
  });
  const messageId = ctx.lastAssistantMessageId ?? ctx.currentAssistantMessageId;
  if (messageId) {
    await ctx.dbWriter.writeTokenMetadataOnly(messageId, {
      promptTokens: ctx.tokenLastInput,
      completionTokens: steps.outputTokens,
      finishReason: null,
      cachedInputTokens: steps.cachedInputTokens,
      cacheWriteTokens: steps.cacheWriteTokens,
      creditCost,
    });
  }
  await ctx.dbWriter.deductAndEmitCredits({
    user,
    amount: creditCost,
    feature: model,
    type: "model",
    model,
    tokenUsage: {
      cachedInputTokens: steps.cachedInputTokens,
      cacheWriteTokens: steps.cacheWriteTokens,
    },
    upstreamCost,
    apiProvider: modelConfig.apiProvider,
  });
}

/** ONE abort-handler invocation shared by the pump-return and catch paths
 *  (previously duplicated verbatim). Bills finished steps first: every path
 *  that reaches here skipped complete(). */
export async function runAbortHandler(
  state: StreamLoopState,
  error: Error,
): Promise<{ wasHandled: boolean }> {
  await billCompletedSteps(state);
  const { AbortErrorHandler } = await import("../errors/errors");
  return AbortErrorHandler.handleAbortError({
    error,
    ctx: state.p.ctx,
    logger: state.p.logger,
    threadId: state.p.threadId,
    isIncognito: state.p.isIncognito,
    userId: state.p.userId,
    model: state.p.model,
    modelConfig: state.p.modelConfig,
    systemPrompt: state.p.systemPrompt,
    trailingSystemMessage: state.p.trailingSystemMessage,
    messages: state.p.messages,
    tools: state.p.tools,
    user: state.p.user,
    t: state.p.t,
  });
}

export async function complete(
  state: StreamLoopState,
  streamResult: ReturnType<typeof aiStreamText>,
): Promise<void> {
  const { modelConfig, messages, model, threadId, logger } = state.p;

  const [usageData, providerMeta, generatedFiles] = await Promise.all([
    streamResult.usage,
    streamResult.providerMetadata,
    streamResult.files,
  ]);

  // For reasoning tokens we still read from the SDK's aggregate (output-only, not re-sent).
  const reasoningTokens = usageData.outputTokenDetails?.reasoningTokens ?? 0;

  const {
    cachedInputTokens,
    cacheWriteTokens: providerCacheWriteTokens,
    hourWriteTokens,
  } = readCacheUsage(
    usageData,
    providerMeta,
    modelConfig.providerModel.startsWith("anthropic/") ||
      modelConfig.apiProvider === ApiProvider.CLAUDE_CODE,
  );
  const sdkTotals = {
    inputTokens: usageData.inputTokens ?? 0,
    outputTokens: usageData.outputTokens ?? 0,
    cachedInputTokens,
    imageOutputTokens: readImageOutputTokens(
      usageData,
      producedImageFile(generatedFiles),
    ),
  };
  // Models without tools never register onStepFinish, so their single step's
  // real upstream cost is read from the aggregate provider metadata here.
  if (state.p.ctx.tokenStepCount === 0) {
    TokenAccumulator.recordUpstreamCost(
      state.p.ctx,
      modelConfig,
      {
        ...sdkTotals,
        requestStartedAt: state.p.ctx.stepPricingStartedAt,
        promptCountKnown: (usageData.inputTokens ?? 0) > 0,
        cacheWriteTokens: providerCacheWriteTokens,
        hourWriteTokens,
      },
      readStepUpstreamCost(providerMeta),
      logger,
    );
  }
  const {
    inputTokens: finalInputTokens,
    outputTokens: finalOutputTokens,
    cachedInputTokens: finalCachedInputTokens,
    uncachedInputTokens: finalUncachedInputTokens,
    cacheWriteTokens: finalCacheWriteTokens,
    imageOutputTokens: finalImageOutputTokens,
  } = TokenAccumulator.finalize(
    state.p.ctx,
    sdkTotals,
    providerCacheWriteTokens,
  );
  const finalTotalTokens =
    finalUncachedInputTokens + finalCachedInputTokens + finalOutputTokens;

  // calculateCreditCost takes the FULL input and subtracts the cached part
  // itself. Passing the already-uncached count subtracted cached twice: cache
  // hits were billed below zero and long cached tool loops went negative
  // (deductAndEmitCredits skips amount <= 0, so the whole turn was free).
  // Actual-cost models (OpenRouter) bill the summed real per-step cost.
  const { credits: fullCreditCost, upstreamCost } =
    TokenAccumulator.resolveCharge(state.p.ctx, modelConfig, {
      inputTokens: finalUncachedInputTokens + finalCachedInputTokens,
      outputTokens: finalOutputTokens,
      cachedInputTokens: finalCachedInputTokens,
      cacheWriteTokens: finalCacheWriteTokens,
      imageOutputTokens: finalImageOutputTokens,
    });
  // Empty answer: the turn streamed no visible text (provider returned
  // nothing, reasoning-only output, tool-only turn that never answered) and
  // produced no media. The provider still charged for the tokens, so the user
  // pays that real cost; the platform waives its markup. Background task
  // turns may legitimately end without prose and keep the normal charge.
  const producedMedia =
    generatedFiles.length > 0 ||
    Boolean(state.p.ctx.dbWriter.lastGeneratedMediaUrl);
  const isEmptyAnswer =
    !state.p.ctx.turnHasAnswerText &&
    !producedMedia &&
    endLoopNeedsAnswerStep(state.p.toolExecutionContext);
  const actualCreditCost = isEmptyAnswer
    ? creditsWithoutPlatformMarkup(fullCreditCost)
    : fullCreditCost;
  state.p.ctx.tokensBilled = true;
  logger.info("[AI Stream] Turn charge", {
    model,
    threadId,
    creditCost: actualCreditCost,
    ...(isEmptyAnswer
      ? { emptyAnswer: true, creditCostBeforeMarkupWaiver: fullCreditCost }
      : {}),
    upstreamCostUsd: upstreamCost?.upstreamCostUsd ?? null,
    fallbackCostUsd: upstreamCost?.fallbackCostUsd ?? null,
    upstreamProvider: upstreamCost?.upstreamProvider ?? null,
    billingBasis: upstreamCost?.billingBasis ?? "token_price",
    steps: state.p.ctx.tokenStepCount,
    imageOutputTokens: finalImageOutputTokens,
  });

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

  const providerErrorText = state.p.ctx.lastProviderErrorText;
  const providerFailed = finishReason === "error" || providerErrorText !== null;
  const providerKey = providerErrorTranslationKey(providerErrorText);
  if (finishReason === "error") {
    // The provider's error part (if any) was already logged where it arrived,
    // classified transient (warn) vs real (error). Only a finishReason=error
    // with NO error part is unexplained - that one stays an error.
    const rawFinishReason = await Promise.resolve(
      streamResult.rawFinishReason,
    ).catch(() => null);
    (providerErrorText === null ? logger.error : logger.warn).bind(logger)(
      "[AI Stream] Provider returned finishReason=error",
      {
        model,
        threadId,
        providerError: providerErrorText,
        providerNativeFinishReason:
          rawFinishReason && /^[A-Za-z0-9_.-]{1,80}$/.test(rawFinishReason)
            ? rawFinishReason
            : null,
        providerErrorPartReceived: providerErrorText !== null,
        providerFailureKey: providerKey,
        apiProvider: modelConfig.apiProvider,
        providerModel: modelConfig.providerModel,
        offeredToolCount: Object.keys(state.p.tools ?? {}).length,
        partialOutputChars: state.p.ctx.currentAssistantContent.length,
        totalTokens: finalTotalTokens,
        warnings: JSON.stringify(streamWarnings ?? []),
        messageCount: messages.length,
        messageRoles: messages.map((m) => m.role).join(","),
        lastMessageRole: messages[messages.length - 1]?.role,
      },
    );
  }

  if (finishReason === "content-filter") {
    logger.warn("[AI Stream] Provider content filter triggered", {
      model,
      threadId,
      apiProvider: modelConfig.apiProvider,
      providerModel: modelConfig.providerModel,
      partialOutputChars: state.p.ctx.currentAssistantContent.length,
      outputTokens: finalOutputTokens,
    });
    const { ctx, user, t } = state.p;
    await ctx.dbWriter.emitErrorMessage({
      threadId,
      errorType: StreamErrorType.STREAM_ERROR,
      error: fail({
        message: t("errors.contentFiltered"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      }),
      content: t("errors.contentFiltered"),
      parentId: ctx.lastParentId,
      sequenceId: ctx.lastSequenceId,
      user,
    });
  }

  // ── Stream completion: finalize message, flush TTS, deduct credits, cleanup.
  //
  // SSE event ordering (matches what frontend expects):
  //   CONTENT_DONE → TOKENS_UPDATED → CREDITS_DEDUCTED
  //
  // DB write ordering:
  //   content flush → token metadata → credit deduction
  const { ctx, ttsHandler, user, t } = state.p;
  const budgetMessageKey = ctx.creditBudgetStopped
    ? "errors.insufficientCredits"
    : "errors.creditBudgetReached";
  const usage = {
    inputTokens: finalInputTokens,
    outputTokens: finalOutputTokens,
    totalTokens: finalTotalTokens,
    cachedInputTokens: finalCachedInputTokens,
    cacheWriteTokens: finalCacheWriteTokens,
  };

  // Finalize current ASSISTANT message if exists.
  // Emits CONTENT_DONE and does the final DB flush.
  if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
    logger.debug("[AI Stream] Calling finalizeAssistantMessage", {
      messageId: ctx.currentAssistantMessageId,
      contentLength: ctx.currentAssistantContent.length,
    });
    await finalizeAssistant(state, {
      currentAssistantMessageId: ctx.currentAssistantMessageId,
      currentAssistantContent: ctx.currentAssistantContent,
      isInReasoningBlock: ctx.isInReasoningBlock,
      finishReason: finishReason ?? null,
      totalTokens: usage.totalTokens ?? null,
      promptTokens: usage.inputTokens ?? null,
      completionTokens: usage.outputTokens ?? null,
    });
  } else {
    logger.debug("[AI Stream] Skipping finalization", {
      hasCurrentAssistantMessageId: !!ctx.currentAssistantMessageId,
      hasCurrentAssistantContent: !!ctx.currentAssistantContent,
    });
  }

  // Flush TTS handler to emit any remaining audio
  if (ttsHandler) {
    await ttsHandler.flush();
    logger.debug("[AI Stream] TTS handler flushed");
  }

  // Emit TOKENS_UPDATED after CONTENT_DONE so frontend processes message finalization first
  const messageIdForTokens =
    ctx.lastAssistantMessageId || ctx.currentAssistantMessageId;

  if (messageIdForTokens) {
    // True TTFT: time from request sent to first token received
    const timeToFirstToken =
      ctx.requestStartTime !== null && ctx.streamStartTime !== null
        ? ctx.streamStartTime - ctx.requestStartTime
        : null;
    // Total streaming duration: time from first token to stream end
    const streamingTime =
      ctx.streamStartTime !== null ? Date.now() - ctx.streamStartTime : null;

    // Write token metadata to DB. This is a no-op if finalizeAssistantMessage already wrote
    // it via writeContentAndTokens, but is essential when finalization was skipped (the common
    // case for multi-step streams where content was flushed via throttled writes).
    await ctx.dbWriter.writeTokenMetadataOnly(messageIdForTokens, {
      promptTokens: usage.inputTokens,
      completionTokens: usage.outputTokens,
      finishReason: finishReason ?? null,
      cachedInputTokens: usage.cachedInputTokens,
      cacheWriteTokens: usage.cacheWriteTokens,
      timeToFirstToken,
      streamingTime,
      creditCost: actualCreditCost,
    });

    ctx.dbWriter.emitTokensUpdated({
      messageId: messageIdForTokens,
      promptTokens: usage.inputTokens,
      completionTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
      cachedInputTokens: usage.cachedInputTokens,
      cacheWriteTokens: usage.cacheWriteTokens,
      timeToFirstToken,
      streamingTime,
      finishReason: finishReason ?? null,
      creditCost: actualCreditCost,
    });

    // The wallet ran out: the output hit its balance cap, or the tool loop
    // stopped before a step it could not pay. Say so instead of leaving a
    // cut-off (or blank) reply unexplained.
    // A capped step that produced no answer was also cut by the balance:
    // some providers report "stop" (not "length") when max_tokens runs out
    // mid-reasoning (prod 2026-11-17, deepseek-v4-pro guests).
    const budgetCut =
      !providerFailed &&
      finishReason !== "content-filter" &&
      (ctx.creditBudgetStopped ||
        (ctx.creditBudgetCapped &&
          (finishReason === "length" || isEmptyAnswer)));
    if (budgetCut) {
      logger.warn("[AI Stream] Turn cut short by the remaining balance", {
        threadId,
        model,
        finishReason: finishReason ?? null,
        loopStopped: ctx.creditBudgetStopped,
        budgetCutStage: ctx.creditBudgetStopped ? "next-step-input" : "output",
        budgetNextInputTokens: ctx.creditBudgetNextInputTokens,
        outputCapped: ctx.creditBudgetCapped,
        balanceEvidence: {
          spendableCreditsAtStart: state.p.creditBalance,
          creditsAlreadyDeducted: ctx.dbWriter.totalCreditsDeducted,
        },
        isEmptyAnswer,
        errorKey: ErrorResponseTypes.PAYMENT_REQUIRED.errorKey,
        steps: ctx.tokenStepCount,
        creditCost: actualCreditCost,
      });
      await ctx.dbWriter.emitErrorMessage({
        threadId,
        errorType: StreamErrorType.STREAM_ERROR,
        error: fail({
          message: t(budgetMessageKey),
          errorType: ErrorResponseTypes.PAYMENT_REQUIRED,
        }),
        content: t(budgetMessageKey),
        parentId: ctx.lastParentId,
        sequenceId: ctx.lastSequenceId,
        user,
      });
    } else if (
      (isEmptyAnswer || providerFailed) &&
      finishReason !== "content-filter"
    ) {
      // The turn created a message but never answered (reasoning-only, or
      // tool calls with no reply): without this the user sees a
      // blank/thinking-only bubble with a charge. content-filter already
      // showed its own message.
      if (isEmptyAnswer) {
        const [rawFinishReason, toolCalls] = await Promise.all([
          streamResult.rawFinishReason,
          streamResult.toolCalls,
        ]);
        logger.warn("[AI Stream] Turn ended without answer text", {
          threadId,
          model,
          apiProvider: modelConfig.apiProvider,
          providerModel: modelConfig.providerModel,
          finishReason: finishReason ?? null,
          rawFinishReason: rawFinishReason ?? null,
          offeredToolCount: Object.keys(state.p.tools ?? {}).length,
          finalStepToolCallCount: toolCalls.length,
          steps: ctx.tokenStepCount,
          outputTokens: usage.outputTokens,
          reasoningTokens,
          creditCost: actualCreditCost,
          creditCostBeforeMarkupWaiver: fullCreditCost,
        });
      }
      const errorKey = providerFailed
        ? (providerKey ?? "errors.streamError")
        : "errors.emptyAnswer";
      await ctx.dbWriter.emitErrorMessage({
        threadId,
        errorType: StreamErrorType.STREAM_ERROR,
        error: fail({
          message: t(errorKey),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        }),
        content: t(errorKey),
        parentId: ctx.lastParentId,
        sequenceId: ctx.lastSequenceId,
        user,
      });
    }
  } else {
    // Provider returned an empty stream - no text was generated.
    // Emit CONTENT_DONE on the pre-generated ID so the frontend closes the pending slot,
    // then show an error bubble so the user knows something went wrong.
    // finishReason "error" means the provider's error part was already logged
    // (with its cause); "content-filter" is the provider refusing the prompt.
    // Neither is a bug of ours - only an unexplained empty stream is an error.
    const explained =
      finishReason === "error" || finishReason === "content-filter";
    // providerError carries the error part that preceded the empty stream
    // (if any) so this line is self-explanatory without correlating rows.
    const emptyStreamMeta = {
      threadId,
      model,
      apiProvider: modelConfig.apiProvider,
      providerModel: modelConfig.providerModel,
      providerError: ctx.lastProviderErrorText,
      totalTokens: usage.totalTokens,
      outputTokens: usage.outputTokens,
      reasoningTokens,
      finishReason: finishReason ?? null,
      outputCapped: ctx.creditBudgetCapped,
      loopStopped: ctx.creditBudgetStopped,
    };
    if (explained) {
      logger.warn(
        "[AI Stream] Provider returned empty stream - no assistant message created",
        emptyStreamMeta,
      );
    } else {
      logger.error(
        "[AI Stream] Provider returned empty stream - no assistant message created",
        emptyStreamMeta,
      );
    }
    ctx.dbWriter.emitContentDoneRaw({
      messageId: ctx.preGeneratedAssistantMessageId,
      content: "",
      totalTokens: null,
      finishReason: finishReason ?? null,
    });
    // A content filter already emitted its specific error above. All other
    // empty streams need a visible explanation, including balance caps.
    if (finishReason !== "content-filter") {
      const emptyKey = providerFailed
        ? (providerKey ?? "errors.streamError")
        : ctx.creditBudgetStopped || ctx.creditBudgetCapped
          ? budgetMessageKey
          : actualCreditCost > 0
            ? "errors.emptyAnswer"
            : "errors.noResponse";
      await ctx.dbWriter.emitErrorMessage({
        threadId,
        errorType: StreamErrorType.STREAM_ERROR,
        error: fail({
          message: t(emptyKey),
          errorType:
            emptyKey === "errors.creditBudgetReached" ||
            emptyKey === "errors.insufficientCredits"
              ? ErrorResponseTypes.PAYMENT_REQUIRED
              : providerFailed
                ? ErrorResponseTypes.EXTERNAL_SERVICE_ERROR
                : ErrorResponseTypes.INTERNAL_ERROR,
        }),
        content: t(emptyKey),
        parentId: ctx.lastParentId,
        sequenceId: ctx.lastSequenceId,
        user,
      });
    }
  }

  logger.debug("[AI Stream] Stream completed", {
    totalTokens: usage.totalTokens,
  });

  // Deduct credits AFTER successful completion (not optimistically).
  // DB write happens before the SSE event so the client never sees
  // a CREDITS_DEDUCTED event for something that wasn't actually deducted.
  await ctx.dbWriter.deductAndEmitCredits({
    user,
    amount: actualCreditCost,
    feature: model,
    type: "model",
    model,
    tokenUsage: {
      cachedInputTokens: finalCachedInputTokens,
      cacheWriteTokens: finalCacheWriteTokens,
    },
    upstreamCost,
    apiProvider: modelConfig.apiProvider,
  });

  // Flush ALL pending throttled writes BEFORE signaling idle. Anyone who
  // reads the thread the moment streamingState flips (queued turns, tests,
  // mirrors) must see every message committed — cleanup()'s fire-and-forget
  // flush is too late and left the tip message uncommitted ("parent not
  // committed" on the next turn).
  await ctx.dbWriter.flushAll();

  // Clear streaming state in DB + registry — owned clear: no-ops if a newer
  // stream (queued turn, revival) has taken over the claim.
  await clearStreamingState(
    threadId,
    logger,
    user,
    state.p.toolExecutionContext.streamRunId,
  );

  // Fire-and-forget: mirror the finished thread to connected peers via the
  // thread-updated remote EVENT (column-gated by syncEligible/incognito, NOT by
  // syncScope — placement is event-driven and independent of the pull-sync
  // domain). The live message events already streamed; this push carries
  // title/placement (origin folder chain) so the peer's mirror lands at
  // REMOTE/<origin>/<path>.
  if (!user.isPublic) {
    const mirrorUserId = user.id;
    void import("../../../chat/threads/sync-provider")
      .then(({ pushThreadSync }) =>
        pushThreadSync(threadId, mirrorUserId, logger),
      )
      .catch(() => {
        // Intentional no-op: mirror push is best-effort (pull-sync converges)
      });
  }

  // No embedding work at finalize. Per-MESSAGE vectors are written AT
  // MESSAGE-WRITE TIME (createUserMessage + emitContentDone). The thread STUB
  // (title/description → cortex_nodes) is a function of the thread's IDENTITY,
  // which only changes on rename — so it is embedded there (rename/repository)
  // and nowhere else. Embedding it on every turn-finalize was pure re-work.

  // Cleanup stream context
  ctx.cleanup();
}
