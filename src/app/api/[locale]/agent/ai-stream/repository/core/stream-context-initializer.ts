/**
 * StreamContextInitializer - Initializes stream context for AI streaming
 */

import "server-only";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ToolCall } from "../../../chat/db";
import { StreamContext } from "./stream-context";

export class StreamContextInitializer {
  /**
   * Initialize stream context with proper parent/depth tracking
   */
  static initializeContext(params: {
    userMessageId: string | null;
    effectiveParentMessageId: string | null | undefined;
    messageDepth: number;
    toolConfirmationResults: Array<{
      messageId: string;
      sequenceId: string;
      toolCall: ToolCall;
    }>;
    logger: EndpointLogger;
  }): StreamContext {
    const {
      userMessageId,
      effectiveParentMessageId,
      messageDepth,
      toolConfirmationResults,
      logger,
    } = params;

    // Calculate initial parent and depth for AI message
    // IMPORTANT: Always prefer userMessageId when available (works for both incognito and server-persisted threads)
    const initialAiParentId = userMessageId ?? effectiveParentMessageId ?? null;
    const initialAiDepth = userMessageId ? messageDepth + 1 : messageDepth;

    // Initialize stream context OUTSIDE try block so it's accessible in catch blocks
    const lastConfirmedTool = toolConfirmationResults[toolConfirmationResults.length - 1];
    const sequenceId = lastConfirmedTool?.sequenceId ?? crypto.randomUUID();
    const initialParentForContext = lastConfirmedTool?.messageId ?? initialAiParentId;
    const initialDepthForContext = lastConfirmedTool ? messageDepth + 1 : initialAiDepth;

    const ctx = new StreamContext({
      sequenceId,
      initialParentId: initialParentForContext,
      initialDepth: initialDepthForContext,
    });

    // Update last known values for error handling (accessible in catch blocks)
    ctx.updateErrorTracking();

    logger.info("[AI Stream] Sequence ID initialized", {
      sequenceId: ctx.sequenceId,
      isToolContinuation: !!lastConfirmedTool,
      toolMessageId: lastConfirmedTool?.messageId,
      confirmedToolCount: toolConfirmationResults.length,
    });

    return ctx;
  }
}
