/**
 * ToolCallHandler - Handles tool call events during streaming
 */

import type { JSONValue } from "ai";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import {
  CallbackMode,
  CallbackModeDB,
} from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { ToolCall, ToolCallResult } from "../../../chat/db";
import { NO_LOOP_PARAM } from "../core/constants";
import type { MessageDbWriter } from "../core/message-db-writer";
import type { StreamContext } from "../core/stream-context";

export class ToolCallHandler {
  /**
   * Process tool-call event from stream
   */
  static async processToolCall(params: {
    part: {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      input?: JSONValue;
    };
    ctx: StreamContext;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    threadId: string;
    currentParentId: string | null;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number }
    >;
    streamAbortController: AbortController;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<{
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    currentParentId: string | null;
    requiresConfirmation: boolean;
    pendingToolMessage: {
      messageId: string;
      toolCallData: {
        toolCall: ToolCall;
        parentId: string | null;
      };
    };
  }> {
    const {
      part,
      ctx,
      currentAssistantContent,
      isInReasoningBlock,
      threadId,
      model,
      character,
      sequenceId,
      userId,
      toolsConfig,
      dbWriter,
      logger,
    } = params;

    let { currentAssistantMessageId, currentParentId } = params;

    // Tool call event without preceding text/reasoning - create placeholder ASSISTANT message
    // CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
    if (!currentAssistantMessageId) {
      currentAssistantMessageId = ctx.getNextAssistantMessageId();
      currentParentId = currentAssistantMessageId;

      logger.info(
        "[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain",
        {
          messageId: currentAssistantMessageId,
          reason: "Tool call without preceding text/reasoning",
          parentId: params.currentParentId,
        },
      );

      await dbWriter.emitPlaceholderAssistantMessage({
        messageId: currentAssistantMessageId,
        threadId,
        parentId: params.currentParentId,
        userId,
        model,
        character,
        sequenceId,
      });

      logger.info("[AI Stream] Created placeholder ASSISTANT message", {
        messageId: currentAssistantMessageId,
        threadId,
      });
    }

    let newAssistantContent = currentAssistantContent;
    let _newIsInReasoningBlock = isInReasoningBlock;

    // Finalize current ASSISTANT message before creating tool message
    if (currentAssistantMessageId) {
      // If reasoning block is still open, close it before tool call
      if (isInReasoningBlock) {
        const thinkCloseTag = "</think>";
        newAssistantContent += thinkCloseTag;
        dbWriter.emitClosingDelta(currentAssistantMessageId, thinkCloseTag);
        _newIsInReasoningBlock = false;

        logger.info(
          "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
          { messageId: currentAssistantMessageId },
        );
      }

      // Flush pending writes and write final ASSISTANT content before tool message
      if (newAssistantContent) {
        await dbWriter.flushContent(
          currentAssistantMessageId,
          newAssistantContent,
        );
      }

      logger.debug("Finalized ASSISTANT message before tool call", {
        messageId: currentAssistantMessageId,
        contentLength: newAssistantContent.length,
      });
    }

    // Get tool arguments from the AI SDK part.input
    const toolCallArgs = (part.input as ToolCallResult) || {};

    // Read callbackMode from tool args — any tool can pass this to control loop behavior
    const callbackModeArg =
      typeof toolCallArgs === "object" &&
      toolCallArgs !== null &&
      !Array.isArray(toolCallArgs) &&
      "callbackMode" in toolCallArgs
        ? (CallbackModeDB.find(
            (m) => m === String(toolCallArgs["callbackMode"]),
          ) ?? null)
        : null;

    // Legacy: noLoop param still works for backward compat
    const hasLegacyNoLoop =
      typeof toolCallArgs === "object" &&
      toolCallArgs !== null &&
      !Array.isArray(toolCallArgs) &&
      NO_LOOP_PARAM in toolCallArgs &&
      toolCallArgs[NO_LOOP_PARAM] === true;

    if (callbackModeArg === CallbackMode.END_LOOP || hasLegacyNoLoop) {
      ctx.shouldStopLoop = true;
      logger.debug(
        "[AI Stream] Model requested loop stop via callbackMode/noLoop parameter",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
          callbackMode: callbackModeArg,
        },
      );
    }

    // All tool metadata comes from toolsConfig built during setup
    const toolConfig = toolsConfig.get(part.toolName);
    const creditCost = toolConfig?.credits ?? 0;
    // requiresConfirmation from toolsConfig takes precedence; callbackMode can also request it
    const requiresConfirmation =
      (toolConfig?.requiresConfirmation ?? false) ||
      callbackModeArg === CallbackMode.APPROVE;

    const newCurrentParentId = currentParentId;

    logger.debug("[AI Stream] Tool confirmation check", {
      toolName: part.toolName,
      toolConfigFound: !!toolConfig,
      requiresConfirmation,
      toolsConfigSize: toolsConfig.size,
      creditCost,
    });

    const toolCallId = part.toolCallId;
    const toolCallData: ToolCall = {
      toolCallId,
      toolName: part.toolName,
      args: toolCallArgs,
      creditsUsed: creditCost,
      requiresConfirmation,
      isConfirmed: false,
      waitingForConfirmation: requiresConfirmation,
      ...(callbackModeArg ? { callbackMode: callbackModeArg } : {}),
    };

    const toolMessageId = crypto.randomUUID();

    // Emit MESSAGE_CREATED + TOOL_CALL SSE events + create DB row
    await dbWriter.emitToolCall({
      toolMessageId,
      threadId,
      parentId: newCurrentParentId,
      userId,
      model,
      character,
      sequenceId,
      toolCall: toolCallData,
    });

    if (requiresConfirmation) {
      logger.info(
        "[AI Stream] Tool requires confirmation - emitting TOOL_WAITING (stream will continue)",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito: params.isIncognito,
        },
      );

      dbWriter.emitToolWaiting({
        toolMessageId,
        toolName: part.toolName,
        toolCallId,
      });

      logger.info(
        "[AI Stream] Emitted TOOL_WAITING event - continuing to process more tool calls",
        { messageId: toolMessageId, toolName: part.toolName },
      );

      return {
        currentAssistantMessageId,
        currentAssistantContent: newAssistantContent,
        isInReasoningBlock: _newIsInReasoningBlock,
        currentParentId: newCurrentParentId,
        requiresConfirmation: true,
        pendingToolMessage: {
          messageId: toolMessageId,
          toolCallData: {
            toolCall: toolCallData,
            parentId: newCurrentParentId,
          },
        },
      };
    }

    logger.debug(
      "[AI Stream] Tool does NOT require confirmation - AI SDK will execute automatically",
      { messageId: toolMessageId, toolName: part.toolName, toolCallId },
    );

    return {
      currentAssistantMessageId,
      currentAssistantContent: newAssistantContent,
      isInReasoningBlock: _newIsInReasoningBlock,
      currentParentId: newCurrentParentId,
      requiresConfirmation: false,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: newCurrentParentId,
        },
      },
    };
  }
}
