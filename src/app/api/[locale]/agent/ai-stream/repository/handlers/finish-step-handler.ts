/**
 * FinishStepHandler - Handles finish-step events during streaming
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { StreamContext } from "../core/stream-context";
import { FinalizationHandler } from "./finalization-handler";

export class FinishStepHandler {
  /**
   * Process finish-step event and handle tool confirmation checks
   */
  static async processFinishStep(params: {
    ctx: StreamContext;
    streamAbortController: AbortController;
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

    // Check if any tools in this step require confirmation
    // If yes, abort stream AFTER all tool calls have been processed
    if (ctx.stepHasToolsAwaitingConfirmation) {
      logger.info(
        "[AI Stream] Step complete - tools require confirmation, aborting stream",
        { toolCallsInStep: ctx.pendingToolMessages.size },
      );

      streamAbortController.abort(new Error("Tool requires user confirmation"));
      ctx.dbWriter.closeController();

      return { shouldAbort: true };
    }

    // Check if model requested to stop the loop via noLoop parameter
    if (ctx.shouldStopLoop) {
      logger.info(
        "[AI Stream] Step complete - model requested loop stop via noLoop, aborting stream",
        { toolCallsInStep: ctx.pendingToolMessages.size },
      );

      streamAbortController.abort(new Error("Model requested loop stop"));
      ctx.dbWriter.closeController();

      return { shouldAbort: true };
    }

    // After a step finishes, update currentParentId/currentDepth to point to the last message
    logger.debug("[AI Stream] Step finished - updating parent chain", {
      oldParentId: ctx.currentParentId,
      newParentId: ctx.lastParentId,
      oldDepth: ctx.currentDepth,
      newDepth: ctx.lastDepth + 1,
    });
    ctx.currentParentId = ctx.lastParentId;
    ctx.currentDepth = ctx.lastDepth + 1;

    // Reset currentAssistantMessageId so the next step creates a new ASSISTANT message
    ctx.currentAssistantMessageId = null;
    ctx.currentAssistantContent = "";

    // Reset confirmation tracking for next step
    ctx.stepHasToolsAwaitingConfirmation = false;

    return { shouldAbort: false };
  }
}
