/**
 * ToolCallHandler - Handles tool call events during streaming
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { definitionsRegistry } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definitions/registry";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredToolName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { ToolCall, ToolCallResult } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import {
  createTextMessage,
  createToolMessage,
  updateMessageContent,
} from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";
import { NO_LOOP_PARAM } from "../core/constants";
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
    currentDepth: number;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    toolsConfig: Map<string, { requiresConfirmation: boolean }>;
    streamAbortController: AbortController;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    currentAssistantMessageId: string | null;
    currentAssistantContent: string;
    isInReasoningBlock: boolean;
    currentParentId: string | null;
    currentDepth: number;
    requiresConfirmation: boolean;
    pendingToolMessage: {
      messageId: string;
      toolCallData: {
        toolCall: ToolCall;
        parentId: string | null;
        depth: number;
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
      isIncognito,
      userId,
      toolsConfig,
      controller,
      encoder,
      logger,
    } = params;

    let { currentAssistantMessageId, currentParentId, currentDepth } = params;

    // Tool call event without preceding text/reasoning - create placeholder ASSISTANT message
    // CRITICAL: Must CREATE the message in DB so TOOL messages can reference it as parent_id
    if (!currentAssistantMessageId) {
      // Get next assistant message ID (first one uses pre-generated ID for cache stability)
      currentAssistantMessageId = ctx.getNextAssistantMessageId();

      // Update parent chain to point to the placeholder ASSISTANT message
      // This ensures the TOOL message becomes a child of the ASSISTANT message
      const newParentId = currentAssistantMessageId;
      const newDepth = currentDepth;
      currentParentId = newParentId;
      // currentDepth stays the same - ASSISTANT message is at the same depth

      logger.info(
        "[AI Stream] Creating placeholder ASSISTANT message for tool-call parent chain",
        {
          messageId: currentAssistantMessageId,
          reason: "Tool call without preceding text/reasoning",
          parentId: params.currentParentId,
          depth: newDepth,
        },
      );

      // CRITICAL FIX: Create the ASSISTANT message in the database immediately
      // This prevents foreign key errors when TOOL messages try to reference it as parent_id
      if (!isIncognito) {
        await createTextMessage({
          messageId: currentAssistantMessageId,
          threadId,
          content: "", // Empty content - will be saved as null and updated if AI generates text
          parentId: params.currentParentId,
          depth: newDepth,
          sequenceId,
          userId,
          model,
          character,
          logger,
        });

        logger.info(
          "[AI Stream] Created placeholder ASSISTANT message in database",
          {
            messageId: currentAssistantMessageId,
            threadId,
          },
        );
      }

      // CRITICAL FIX: Emit MESSAGE_CREATED event for placeholder ASSISTANT messages
      // This is required so the parent chain is maintained in the UI
      // Without this, TOOL messages appear orphaned because their parent doesn't exist in frontend store
      const placeholderMessageEvent = createStreamEvent.messageCreated({
        messageId: currentAssistantMessageId,
        threadId,
        role: ChatMessageRole.ASSISTANT,
        content: "", // Empty content - will be updated if AI generates text
        parentId: params.currentParentId,
        depth: currentDepth,
        sequenceId,
        model,
        character,
      });
      controller.enqueue(
        encoder.encode(formatSSEEvent(placeholderMessageEvent)),
      );

      logger.info(
        "[AI Stream] MESSAGE_CREATED event sent for placeholder ASSISTANT",
        {
          messageId: currentAssistantMessageId,
          parentId: params.currentParentId,
          depth: currentDepth,
        },
      );
    }

    let newAssistantContent = currentAssistantContent;
    let _newIsInReasoningBlock = isInReasoningBlock;

    // Finalize current ASSISTANT message before creating tool message
    if (currentAssistantMessageId) {
      // If reasoning block is still open, close it before tool call
      if (isInReasoningBlock) {
        const thinkCloseTag = "</think>";
        newAssistantContent += thinkCloseTag;

        // Emit closing tag delta
        const thinkCloseDelta = createStreamEvent.contentDelta({
          messageId: currentAssistantMessageId,
          delta: thinkCloseTag,
        });
        controller.enqueue(encoder.encode(formatSSEEvent(thinkCloseDelta)));

        _newIsInReasoningBlock = false;

        logger.info(
          "[AI Stream] ⏱️ Reasoning interrupted by tool call → </think>",
          {
            messageId: currentAssistantMessageId,
          },
        );
      }

      // Update ASSISTANT message in database with accumulated content
      // Public users (userId undefined) are allowed - helper converts to null
      if (!isIncognito && newAssistantContent) {
        await updateMessageContent({
          messageId: currentAssistantMessageId,
          content: newAssistantContent,
          logger,
        });
      }

      logger.debug("Finalized ASSISTANT message before tool call", {
        messageId: currentAssistantMessageId,
        contentLength: newAssistantContent.length,
      });
    }

    // Get tool arguments from the AI SDK part.input
    const toolCallArgs = (part.input as ToolCallResult) || {};

    // Check for noLoop parameter to stop the tool calling loop
    if (
      typeof toolCallArgs === "object" &&
      toolCallArgs !== null &&
      !Array.isArray(toolCallArgs) &&
      NO_LOOP_PARAM in toolCallArgs &&
      toolCallArgs[NO_LOOP_PARAM] === true
    ) {
      ctx.shouldStopLoop = true;
      logger.debug(
        `[AI Stream] Model requested loop stop via ${NO_LOOP_PARAM} parameter`,
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
        },
      );
    }

    // Get tool config to determine if confirmation is required
    const toolConfig = toolsConfig.get(part.toolName);
    const requiresConfirmation = toolConfig?.requiresConfirmation ?? false;

    // Look up endpoint to get credit cost
    const allEndpoints = definitionsRegistry.getEndpointsForUser(
      Platform.AI,
      params.user,
    );
    const endpoint = allEndpoints.find((e) => {
      const preferredName = getPreferredToolName(e);
      return preferredName === part.toolName;
    });
    const creditCost = endpoint?.credits ?? 0;

    // Update parent chain: TOOL message is always child of the ASSISTANT message
    // currentParentId now points to the ASSISTANT message (either existing or just created)
    // This creates the chain: USER → ASSISTANT → TOOL1 → TOOL2 → ASSISTANT (next step)
    const newCurrentParentId = currentParentId;
    const newCurrentDepth = currentDepth + 1;

    logger.info("[AI Stream] Tool confirmation check", {
      toolName: part.toolName,
      toolConfigFound: !!toolConfig,
      requiresConfirmation,
      toolsConfigSize: toolsConfig.size,
      creditCost,
    });

    // Extract tool call ID from AI SDK (used for matching tool results)
    const toolCallId = part.toolCallId; // AI SDK provides unique ID for each tool call

    // Create tool call with args from AI SDK
    const toolCallData: ToolCall = {
      toolCallId, // CRITICAL: Store AI SDK tool call ID for proper result matching
      toolName: part.toolName,
      args: toolCallArgs,
      creditsUsed: creditCost,
      requiresConfirmation,
      isConfirmed: false,
      waitingForConfirmation: requiresConfirmation, // Set to true if confirmation needed
    };

    // Create tool message ID and emit to UI immediately
    const toolMessageId = crypto.randomUUID();

    // Emit MESSAGE_CREATED event for UI (immediate feedback)
    // Include toolCall object so frontend can render tool display
    const toolMessageEvent = createStreamEvent.messageCreated({
      messageId: toolMessageId,
      threadId,
      role: ChatMessageRole.TOOL,
      content: null, // Tool messages have no text content
      parentId: newCurrentParentId,
      depth: newCurrentDepth,
      sequenceId,
      toolCall: toolCallData, // Include tool call data for frontend rendering (singular - each TOOL message has exactly one tool call)
      model,
      character,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));

    // Emit TOOL_CALL event for real-time UX
    const toolCallEvent = createStreamEvent.toolCall({
      messageId: toolMessageId,
      toolName: toolCallData.toolName,
      args: toolCallData.args,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolCallEvent)));

    // CRITICAL: Store tool message to DB immediately (if not incognito)
    // This is required so subsequent tool calls can use this message as parent
    // Without this, parallel tool calls will fail with foreign key constraint errors
    if (!isIncognito) {
      logger.info("[AI Stream] Creating tool message in DB", {
        messageId: toolMessageId,
        toolCallId,
        toolName: part.toolName,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
        threadId,
        sequenceId,
      });

      await createToolMessage({
        messageId: toolMessageId,
        threadId,
        toolCall: toolCallData,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
        userId,
        sequenceId,
        model,
        character,
        logger,
      });

      logger.info("[AI Stream] Tool message saved to DB immediately", {
        messageId: toolMessageId,
        toolCallId,
        toolName: part.toolName,
        parentId: newCurrentParentId,
        depth: newCurrentDepth,
      });
    }

    // If tool requires confirmation, emit TOOL_WAITING event
    // DON'T abort stream yet - allow all tool calls to be processed first
    // Stream will abort at finish-step if any tools require confirmation
    if (requiresConfirmation) {
      logger.info(
        "[AI Stream] Tool requires confirmation - emitting TOOL_WAITING (stream will continue)",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito,
        },
      );

      // Tool message already saved to DB above (for both confirmation and non-confirmation tools)
      // No need to save again here

      // Emit TOOL_WAITING event to notify frontend
      // This works for both logged-in and incognito modes
      const waitingEvent = createStreamEvent.toolWaiting({
        messageId: toolMessageId,
        toolName: part.toolName,
        toolCallId,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(waitingEvent)));

      logger.info(
        "[AI Stream] Emitted TOOL_WAITING event - continuing to process more tool calls",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
          isIncognito,
        },
      );

      // DON'T abort or close controller here - continue processing
      // IMPORTANT: Preserve currentAssistantMessageId so multiple tool calls in the same step
      // all remain children of the same ASSISTANT message (not creating branches)
      return {
        currentAssistantMessageId,
        currentAssistantContent: newAssistantContent,
        isInReasoningBlock: _newIsInReasoningBlock,
        currentParentId: newCurrentParentId,
        currentDepth: newCurrentDepth,
        requiresConfirmation: true,
        pendingToolMessage: {
          messageId: toolMessageId,
          toolCallData: {
            toolCall: toolCallData,
            parentId: newCurrentParentId,
            depth: newCurrentDepth,
          },
        },
      };
    }

    // Tool does NOT require confirmation - AI SDK will execute it automatically
    // Store the tool message info so we can update it when tool-result arrives
    logger.info(
      "[AI Stream] Tool does NOT require confirmation - AI SDK will execute automatically",
      {
        messageId: toolMessageId,
        toolName: part.toolName,
        toolCallId,
      },
    );

    // IMPORTANT: When requiresConfirmation is false, we still need to store the tool in pendingToolMessage
    // so that when the tool-result event arrives, we can match it and save it to the database.
    // The AI SDK will execute the tool automatically and send us the result via tool-result event.
    // IMPORTANT: Preserve currentAssistantMessageId so multiple tool calls in the same step
    // all remain children of the same ASSISTANT message (not creating branches)
    // IMPORTANT: Return the tool message ID so the caller can update the parent chain
    // This creates: USER → ASSISTANT → TOOL1 → TOOL2 → TOOL3 (chained)
    return {
      currentAssistantMessageId,
      currentAssistantContent: newAssistantContent,
      isInReasoningBlock: _newIsInReasoningBlock,
      currentParentId: newCurrentParentId,
      currentDepth: newCurrentDepth,
      requiresConfirmation: false,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: newCurrentParentId,
          depth: newCurrentDepth,
        },
      },
    };
  }
}
