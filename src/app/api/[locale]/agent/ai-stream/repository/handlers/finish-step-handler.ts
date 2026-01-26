/**
 * FinishStepHandler - Handles finish-step events during streaming
 */

import "server-only";

import type { streamText } from "ai";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { StreamContext } from "../core/stream-context";
import { FinalizationHandler } from "./finalization-handler";

export class FinishStepHandler {
  /**
   * Process finish-step event and handle tool confirmation checks
   */
  static async processFinishStep(params: {
    ctx: StreamContext;
    streamResult: {
      usage: ReturnType<typeof streamText>["usage"];
      finishReason: ReturnType<typeof streamText>["finishReason"];
    };
    isIncognito: boolean;
    streamAbortController: AbortController;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{ shouldAbort: boolean }> {
    const {
      ctx,
      streamResult,
      isIncognito,
      streamAbortController,
      controller,
      encoder,
      logger,
    } = params;

    // Finalize current ASSISTANT message before resetting for next step
    if (ctx.currentAssistantMessageId && ctx.currentAssistantContent) {
      const usage = await streamResult.usage;
      const finishReason = await streamResult.finishReason;

      await FinalizationHandler.finalizeAssistantMessage({
        currentAssistantMessageId: ctx.currentAssistantMessageId,
        currentAssistantContent: ctx.currentAssistantContent,
        isInReasoningBlock: ctx.isInReasoningBlock,
        streamResult: {
          finishReason,
          usage,
        },
        isIncognito,
        controller,
        encoder,
        logger,
      });
    }

    // Check if any tools in this step require confirmation
    // If yes, abort stream AFTER all tool calls have been processed
    if (ctx.stepHasToolsAwaitingConfirmation) {
      logger.info(
        "[AI Stream] Step complete - tools require confirmation, aborting stream",
        {
          toolCallsInStep: ctx.pendingToolMessages.size,
        },
      );

      // Abort the stream to stop the AI SDK from processing further
      streamAbortController.abort(new Error("Tool requires user confirmation"));

      // Close the controller to stop sending events to client
      controller.close();

      // Signal to exit the loop - stream is done until user confirms
      return { shouldAbort: true };
    }

    // Check if model requested to stop the loop via noLoop parameter
    if (ctx.shouldStopLoop) {
      logger.info(
        "[AI Stream] Step complete - model requested loop stop via noLoop, aborting stream",
        {
          toolCallsInStep: ctx.pendingToolMessages.size,
        },
      );

      // Abort the stream to stop the AI SDK from processing further
      streamAbortController.abort(new Error("Model requested loop stop"));

      // Close the controller to stop sending events to client
      controller.close();

      // Signal to exit the loop - model has enough information
      return { shouldAbort: true };
    }

    // After a step finishes, update currentParentId/currentDepth to point to the last message
    // The next ASSISTANT message should be a CHILD of the last tool message, so increment depth
    logger.info("[AI Stream] Step finished - updating parent chain", {
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
