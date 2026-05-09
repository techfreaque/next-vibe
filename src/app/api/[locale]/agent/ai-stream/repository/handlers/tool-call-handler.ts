/**
 * ToolCallHandler - Handles tool call events during streaming
 */

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import {
  CallbackMode,
  CallbackModeDB,
} from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { ToolExecutionContext } from "../../../chat/config";

import type { ToolCall } from "../../../chat/db";
import type { MessageDbWriter } from "../core/message-db-writer";
import type { StreamContext } from "../core/stream-context";

/** Shared return type for both processToolInputStart and processToolCall */
interface ToolCallResult {
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
}

/** Shared params for assistant message preparation */
interface AssistantPrepParams {
  ctx: StreamContext;
  currentAssistantMessageId: string | null;
  currentAssistantContent: string;
  isInReasoningBlock: boolean;
  initialParentId: string | null;
  threadId: string;
  model: ChatModelId;
  skill: string;
  sequenceId: string;
  userId: string | undefined;
  dbWriter: MessageDbWriter;
  logger: EndpointLogger;
}

/** Return type from assistant message preparation */
interface AssistantPrepResult {
  currentAssistantMessageId: string | null;
  currentAssistantContent: string;
  isInReasoningBlock: boolean;
  currentParentId: string | null;
}

export class ToolCallHandler {
  /**
   * Ensure an ASSISTANT message exists and finalize any open reasoning block.
   * Shared by processToolInputStart and processToolCall (fallback path).
   */
  private static async prepareAssistantMessage(
    params: AssistantPrepParams,
  ): Promise<AssistantPrepResult> {
    const {
      ctx,
      currentAssistantContent,
      isInReasoningBlock,
      threadId,
      model,
      skill,
      sequenceId,
      userId,
      dbWriter,
      logger,
    } = params;

    let { currentAssistantMessageId } = params;
    let currentParentId = params.initialParentId;

    // Tool call event without preceding text/reasoning - create placeholder ASSISTANT message
    // CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
    if (!currentAssistantMessageId) {
      currentAssistantMessageId = ctx.getNextAssistantMessageId();
      currentParentId = currentAssistantMessageId;

      logger.debug(
        "[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain",
        {
          messageId: currentAssistantMessageId,
          reason: "Tool call without preceding text/reasoning",
          parentId: params.initialParentId,
        },
      );

      await dbWriter.emitPlaceholderAssistantMessage({
        messageId: currentAssistantMessageId,
        threadId,
        parentId: params.initialParentId,
        userId,
        model,
        skill,
        sequenceId,
      });

      logger.debug("[AI Stream] Created placeholder ASSISTANT message", {
        messageId: currentAssistantMessageId,
        threadId,
      });
    }

    let newAssistantContent = currentAssistantContent;
    let newIsInReasoningBlock = isInReasoningBlock;

    // Finalize current ASSISTANT message before creating tool message
    if (currentAssistantMessageId) {
      // If reasoning block is still open, close it before tool call
      if (isInReasoningBlock) {
        const thinkCloseTag = "</think>";
        newAssistantContent += thinkCloseTag;
        dbWriter.emitClosingDelta(currentAssistantMessageId, thinkCloseTag);
        newIsInReasoningBlock = false;

        logger.debug(
          "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
          {
            messageId: currentAssistantMessageId,
          },
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

    return {
      currentAssistantMessageId,
      currentAssistantContent: newAssistantContent,
      isInReasoningBlock: newIsInReasoningBlock,
      currentParentId,
    };
  }

  /**
   * Process tool-input-start event from stream.
   * Creates the tool message early so the UI shows the tool name immediately.
   * Arguments will stream in via tool-input-delta events.
   */
  static async processToolInputStart(params: {
    toolCallId: string;
    toolName: string;
    ctx: StreamContext;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    threadId: string;
    currentParentId: string | null;
    model: ChatModelId;
    skill: string;
    sequenceId: string;
    userId: string | undefined;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
  }): Promise<ToolCallResult> {
    const {
      toolCallId,
      toolName,
      ctx,
      threadId,
      model,
      skill,
      sequenceId,
      userId,
      dbWriter,
      logger,
    } = params;

    const prep = await ToolCallHandler.prepareAssistantMessage({
      ctx,
      currentAssistantMessageId: params.currentAssistantMessageId,
      currentAssistantContent: params.currentAssistantContent,
      isInReasoningBlock: params.isInReasoningBlock,
      initialParentId: params.currentParentId,
      threadId,
      model,
      skill,
      sequenceId,
      userId,
      dbWriter,
      logger,
    });

    const toolCallData: ToolCall = {
      toolCallId,
      toolName,
      args: {},
      isInputStreaming: true,
    };

    const toolMessageId = crypto.randomUUID();

    // Emit MESSAGE_CREATED + create DB row with streaming placeholder
    await dbWriter.emitToolCall({
      toolMessageId,
      threadId,
      parentId: prep.currentParentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallData,
    });

    // Initialize accumulated args text
    ctx.streamingToolInputs.set(toolCallId, "");

    logger.debug(
      "[AI Stream] Tool input streaming started - message created early",
      { toolMessageId, toolName, toolCallId },
    );

    return {
      currentAssistantMessageId: prep.currentAssistantMessageId,
      currentAssistantContent: prep.currentAssistantContent,
      isInReasoningBlock: prep.isInReasoningBlock,
      currentParentId: prep.currentParentId,
      requiresConfirmation: false,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: prep.currentParentId,
        },
      },
    };
  }

  /**
   * Process tool-call event from stream
   */
  static async processToolCall(params: {
    part: {
      type: "tool-call";
      toolCallId: string;
      toolName: string;
      input?: WidgetData;
    };
    ctx: StreamContext;
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    threadId: string;
    currentParentId: string | null;
    model: ChatModelId;
    skill: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    toolsConfig: Map<
      string,
      { requiresConfirmation: boolean; credits: number; label: string }
    >;
    streamAbortController: AbortController;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    streamContext: ToolExecutionContext;
  }): Promise<ToolCallResult> {
    const {
      part,
      ctx,
      threadId,
      model,
      skill,
      sequenceId,
      userId,
      toolsConfig,
      dbWriter,
      logger,
    } = params;

    // Get tool arguments from the AI SDK part.input
    const toolCallArgs = part.input || {};

    // Read callbackMode from tool args - any tool can pass this to control loop behavior
    const callbackModeArg =
      typeof toolCallArgs === "object" &&
      toolCallArgs !== null &&
      !Array.isArray(toolCallArgs) &&
      "callbackMode" in toolCallArgs
        ? (CallbackModeDB.find(
            (m) => m === String(toolCallArgs["callbackMode"]),
          ) ?? null)
        : null;

    // endLoop: stop the AI loop after this step completes.
    // wakeUp does NOT stop the loop - the AI gets {taskId, hint} back immediately
    // and continues its turn (generates acknowledgement text), then ends naturally.
    // The revival happens later when the background task completes.
    if (callbackModeArg === CallbackMode.END_LOOP) {
      ctx.shouldStopLoop = true;
      logger.debug(
        "[AI Stream] Model requested loop stop via callbackMode endLoop",
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

    // Check if this tool message was already created by tool-input-start
    const existingPending = ctx.pendingToolMessages.get(part.toolCallId);

    if (existingPending) {
      // Tool message already exists from tool-input-start - update with final args
      const toolCallData: ToolCall = {
        toolCallId: part.toolCallId,
        toolName: part.toolName,
        args: toolCallArgs,
        creditsUsed: creditCost,
        requiresConfirmation,
        isConfirmed: false,
        waitingForConfirmation: requiresConfirmation,
        isInputStreaming: false,
        ...(callbackModeArg ? { callbackMode: callbackModeArg } : {}),
      };

      // Update the pending entry with final toolCall data
      existingPending.toolCallData.toolCall = toolCallData;

      // Clean up streaming state
      ctx.streamingToolInputs.delete(part.toolCallId);

      // Update the existing tool message in DB + emit WS event with final args
      await dbWriter.emitToolCallUpdate({
        toolMessageId: existingPending.messageId,
        threadId,
        toolCall: toolCallData,
      });

      logger.debug(
        "[AI Stream] Updated existing tool message with final parsed args",
        {
          messageId: existingPending.messageId,
          toolName: part.toolName,
          toolCallId: part.toolCallId,
        },
      );

      if (requiresConfirmation) {
        dbWriter.emitToolWaiting();
      }

      return {
        currentAssistantMessageId: params.currentAssistantMessageId,
        currentAssistantContent: params.currentAssistantContent,
        isInReasoningBlock: params.isInReasoningBlock,
        currentParentId: params.currentParentId,
        requiresConfirmation,
        pendingToolMessage: existingPending,
      };
    }

    // Fallback: no tool-input-start preceded this - create tool message now
    // (backward compatibility for providers that don't emit tool-input-* events)
    const prep = await ToolCallHandler.prepareAssistantMessage({
      ctx,
      currentAssistantMessageId: params.currentAssistantMessageId,
      currentAssistantContent: params.currentAssistantContent,
      isInReasoningBlock: params.isInReasoningBlock,
      initialParentId: params.currentParentId,
      threadId,
      model,
      skill,
      sequenceId,
      userId,
      dbWriter,
      logger,
    });

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
      parentId: prep.currentParentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallData,
    });

    if (requiresConfirmation) {
      logger.debug(
        "[AI Stream] Tool requires confirmation - emitting TOOL_WAITING (stream will continue)",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito: params.isIncognito,
        },
      );

      dbWriter.emitToolWaiting();

      logger.debug(
        "[AI Stream] Emitted TOOL_WAITING event - continuing to process more tool calls",
        { messageId: toolMessageId, toolName: part.toolName },
      );

      return {
        currentAssistantMessageId: prep.currentAssistantMessageId,
        currentAssistantContent: prep.currentAssistantContent,
        isInReasoningBlock: prep.isInReasoningBlock,
        currentParentId: prep.currentParentId,
        requiresConfirmation: true,
        pendingToolMessage: {
          messageId: toolMessageId,
          toolCallData: {
            toolCall: toolCallData,
            parentId: prep.currentParentId,
          },
        },
      };
    }

    logger.debug(
      "[AI Stream] Tool does NOT require confirmation - AI SDK will execute automatically",
      { messageId: toolMessageId, toolName: part.toolName, toolCallId },
    );

    return {
      currentAssistantMessageId: prep.currentAssistantMessageId,
      currentAssistantContent: prep.currentAssistantContent,
      isInReasoningBlock: prep.isInReasoningBlock,
      currentParentId: prep.currentParentId,
      requiresConfirmation: false,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: prep.currentParentId,
        },
      },
    };
  }
}
