/**
 * ToolErrorHandler - Handles tool error events during streaming
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";
import { eq } from "drizzle-orm";
import type { MessageResponseType } from "next-vibe/shared/types/response.schema";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { chatMessages, type ToolCall } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import type { ModelId } from "../../../chat/model-access/models";
import { createToolMessage } from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

export class ToolErrorHandler {
  /**
   * Process tool-error event from stream
   */
  static async processToolError(params: {
    part: {
      type: "tool-error";
      toolCallId: string;
      toolName: string;
      error?: JSONValue;
    };
    pendingToolMessage:
      | {
          messageId: string;
          toolCallData: {
            toolCall: ToolCall;
            parentId: string | null;
            depth: number;
          };
        }
      | undefined;
    threadId: string;
    model: ModelId;
    character: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    controller: ReadableStreamDefaultController<Uint8Array>;
    encoder: TextEncoder;
    logger: EndpointLogger;
  }): Promise<{
    currentParentId: string | null;
    currentDepth: number;
  } | null> {
    const {
      part,
      pendingToolMessage,
      threadId,
      model,
      character,
      sequenceId,
      isIncognito,
      userId,
      controller,
      encoder,
      logger,
    } = params;

    if (!pendingToolMessage) {
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    // Extract error from the tool-error event and structure it for translation
    const error: MessageResponseType =
      "error" in part && part.error
        ? part.error instanceof Error
          ? ({
              message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
              messageParams: { error: part.error.message },
            } satisfies MessageResponseType)
          : typeof part.error === "object" &&
              part.error !== null &&
              "message" in part.error &&
              typeof part.error.message === "string"
            ? (part.error as MessageResponseType)
            : ({
                message: "app.api.agent.chat.aiStream.errors.toolExecutionError",
                messageParams: { error: String(part.error) },
              } satisfies MessageResponseType)
        : ({
            message: "app.api.agent.chat.aiStream.errors.toolExecutionFailed",
          } satisfies MessageResponseType);

    logger.info("[AI Stream] Tool error event received", {
      toolName: part.toolName,
      error,
      toolCallId: part.toolCallId,
      messageId: toolMessageId,
    });

    // Add error to tool call data (for UI)
    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error,
    };

    // Store TOOL message in DB (or emit for incognito)
    // NO separate ERROR message - error is stored in TOOL message metadata
    if (!isIncognito && userId) {
      // DB mode: UPDATE existing TOOL message with error in metadata
      // The tool message was already created when tool-call event arrived
      const updateResult = await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: toolCallWithError },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        logger.error("[AI Stream] CRITICAL: Tool message update failed - message not found in DB", {
          messageId: toolMessageId,
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          threadId,
        });
        // Fallback: create message if update failed
        await createToolMessage({
          messageId: toolMessageId,
          threadId,
          toolCall: toolCallWithError,
          parentId: toolCallData.parentId,
          depth: toolCallData.depth,
          userId,
          sequenceId,
          model,
          character,
          logger,
        });
        logger.warn("[AI Stream] Created missing tool message as fallback", {
          messageId: toolMessageId,
        });
      } else {
        logger.info("[AI Stream] Tool message updated with error", {
          messageId: toolMessageId,
          toolName: part.toolName,
          error,
        });
      }

      logger.info("[AI Stream] TOOL message stored in DB (error)", {
        messageId: toolMessageId,
        toolName: part.toolName,
        error,
      });
    } else if (isIncognito) {
      // Incognito mode: Emit MESSAGE_CREATED event for TOOL message
      const toolMessageEvent = createStreamEvent.messageCreated({
        messageId: toolMessageId,
        threadId,
        role: ChatMessageRole.TOOL,
        content: null, // Tool messages have no text content
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithError, // Include tool call data with error (singular - each TOOL message has exactly one tool call)
      });
      controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));

      logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent (incognito)", {
        messageId: toolMessageId,
        toolName: part.toolName,
      });
    }

    // Emit TOOL_RESULT event to frontend with error
    const toolResultEvent = createStreamEvent.toolResult({
      messageId: toolMessageId,
      toolName: part.toolName,
      result: undefined,
      error,
      toolCall: toolCallWithError,
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));

    logger.info("[AI Stream] TOOL_RESULT event sent (error)", {
      messageId: toolMessageId,
      toolName: part.toolName,
    });

    // After tool error, next message should be a child of the TOOL message
    // NO separate ERROR message - error is displayed in the TOOL message UI
    return {
      currentParentId: toolMessageId, // Next message is child of TOOL
      currentDepth: toolCallData.depth + 1, // One level deeper than TOOL
    };
  }
}
