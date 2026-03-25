/**
 * FinishStepHandler - Handles finish-step events during streaming
 */

import "server-only";

import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { AbortReason, StreamAbortError } from "../core/constants";
import type { StreamContext } from "../core/stream-context";
import { FinalizationHandler } from "./finalization-handler";

export class FinishStepHandler {
  /**
   * Process finish-step event and handle tool confirmation checks.
   */
  static async processFinishStep(params: {
    ctx: StreamContext;
    streamAbortController: AbortController;
    streamContext: ToolExecutionContext;
    logger: EndpointLogger;
  }): Promise<{ shouldAbort: boolean }> {
    const { ctx, streamAbortController, logger } = params;

    // Finalize current ASSISTANT message before resetting for next step.
    // For tool-loop steps the usage/finishReason promises may not resolve yet,
    // so we pass null - the content is what matters here for DB persistence.
    if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
      await FinalizationHandler.finalizeAssistantMessage({
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        isInReasoningBlock: ctx.isInReasoningBlock,
        finishReason: null,
        totalTokens: null,
        promptTokens: null,
        completionTokens: null,
        dbWriter: ctx.dbWriter,
        logger,
      });
    }

    // endLoop: abort only when no more tool-calls are pending (supports sequential tool calls).
    // shouldStopLoop persists across steps - once set it stays true until abort.
    // Only abort when pendingToolMessages is empty (all tool steps done, AI response turn next).
    if (ctx.shouldStopLoop && ctx.pendingToolMessages.size === 0) {
      logger.info(
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
      ctx.pendingToolMessages.size === 0
    ) {
      logger.info(
        "[AI Stream] APPROVE - all tool steps complete, aborting before AI response turn",
      );
      streamAbortController.abort(
        new StreamAbortError(AbortReason.TOOL_CONFIRMATION),
      );
      return { shouldAbort: true };
    }

    // Remote queue / wait-for-task: if a tool set pendingTimeoutMs, start the timeout timer.
    // The timer fires AbortReason.STREAM_TIMEOUT so the stream dies cleanly - revival handles
    // continuation when /report delivers the result. Clears itself if stream aborts first.
    const { streamContext } = params;
    if (streamContext.pendingTimeoutMs) {
      const timeoutMs = streamContext.pendingTimeoutMs;
      streamContext.pendingTimeoutMs = undefined; // consume - only fire once
      logger.info(
        "[AI Stream] Starting stream timeout timer (remote result pending)",
        { timeoutMs },
      );
      const timer = setTimeout(() => {
        logger.info("[AI Stream] Stream timeout reached - aborting stream", {
          timeoutMs,
        });
        streamAbortController.abort(
          new StreamAbortError(AbortReason.STREAM_TIMEOUT),
        );
      }, timeoutMs);
      // Cancel the timer if the stream aborts for any other reason first
      streamAbortController.signal.addEventListener("abort", () => {
        clearTimeout(timer);
      });
      // Expose a cancel function so the stream's finally block can cancel
      // the timer when the stream ends naturally (e.g. wakeUp mode where the
      // AI writes a response and the loop exits without hitting the timeout).
      streamContext.cancelPendingStreamTimer = (): void => {
        clearTimeout(timer);
        streamContext.cancelPendingStreamTimer = undefined;
      };
    }

    // After a step finishes, update currentParentId to point to the last message
    logger.debug("[AI Stream] Step finished - updating parent chain", {
      oldParentId: ctx.currentParentId,
      newParentId: ctx.lastParentId,
    });
    ctx.currentParentId = ctx.lastParentId;

    // Reset currentAssistantMessageId so the next step creates a new ASSISTANT message
    ctx.currentAssistantMessageId = null;
    ctx.currentAssistantContent = "";

    // NOTE: do NOT reset stepHasToolsAwaitingConfirmation here —
    // it persists across steps so sequential approve tool calls still abort correctly.

    return { shouldAbort: false };
  }
}
