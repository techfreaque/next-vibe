/**
 * ToolErrorHandler - Handles tool error events during streaming
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";
import { eq } from "drizzle-orm";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { chatMessages, type ToolCall } from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
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
    const error: ErrorResponseType =
      "error" in part && part.error
        ? typeof part.error === "object" &&
          part.error !== null &&
          "message" in part.error &&
          typeof part.error.message === "string"
          ? // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax
            (part.error as unknown as ErrorResponseType)
          : fail({
              message:
                "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            })
        : fail({
            message:
              "app.api.agent.chat.aiStream.errors.toolExecutionFailed" as const,
            errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          });

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

    // Emit MESSAGE_CREATED event with updated toolCall for TOOL message
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
      toolCall: toolCallWithError, // Include tool call data with error
    });
    controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));

    logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    // Update TOOL message in DB with error (server mode only - incognito stores in localStorage)
    if (!isIncognito) {
      const updateResult = await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: toolCallWithError },
          updatedAt: new Date(),
        })
        .where(eq(chatMessages.id, toolMessageId))
        .returning({ id: chatMessages.id });

      if (updateResult.length === 0) {
        logger.error(
          "[AI Stream] CRITICAL: Tool message update failed - message not found in DB",
          {
            messageId: toolMessageId,
            toolCallId: part.toolCallId,
            toolName: part.toolName,
            threadId,
          },
        );
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
        logger.debug("[AI Stream] Tool message updated in DB with error", {
          messageId: toolMessageId,
          toolName: part.toolName,
        });
      }
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
