/**
 * ToolResultHandler - Handles tool result events during streaming
 */

import type { ReadableStreamDefaultController } from "node:stream/web";

import type { JSONValue } from "ai";
import { eq } from "drizzle-orm";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { parseError } from "../../../../shared/utils";
import {
  chatMessages,
  type ToolCall,
  type ToolCallResult,
} from "../../../chat/db";
import { ChatMessageRole } from "../../../chat/enum";
import {
  createErrorMessage,
  createToolMessage,
} from "../../../chat/threads/[threadId]/messages/repository";
import { createStreamEvent, formatSSEEvent } from "../../events";

/**
 * Type guard for tool result values
 * Validates that value is JSON-serializable and matches ToolCallResult type
 * Accepts JSONValue from AI SDK which is the type used for tool inputs/outputs
 */
function isValidToolResult(value: JSONValue): value is ToolCallResult {
  if (value === null) {
    return true; // null is a valid tool result
  }
  if (value === undefined) {
    return false; // ToolCallResult does not include undefined
  }
  if (typeof value === "string") {
    return true;
  }
  if (typeof value === "number") {
    return true;
  }
  if (typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    // Arrays are valid - recursively check elements
    return value.every((item) => isValidToolResult(item));
  }
  if (typeof value === "object") {
    // Objects are valid - recursively check values
    return Object.values(value).every((v) =>
      v !== undefined ? isValidToolResult(v) : false,
    );
  }
  // Reject functions, symbols, etc.
  return false;
}

export class ToolResultHandler {
  /**
   * Process tool-result event from stream
   */
  static async processToolResult(params: {
    part: {
      type: "tool-result";
      toolCallId: string;
      toolName: string;
      output?: JSONValue;
      isError?: boolean;
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
    emittedToolResultIds?: Set<string>;
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
      emittedToolResultIds,
    } = params;

    if (!pendingToolMessage) {
      logger.error(
        "[AI Stream] Tool result received but no pending message found",
        {
          toolCallId: part.toolCallId,
          toolName: part.toolName,
        },
      );
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    logger.info("[AI Stream] Processing tool result", {
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      messageId: toolMessageId,
      hasOutput: "output" in part,
      isError: part.isError,
    });

    // If controller is closed (waiting for confirmation), skip processing
    // The tool result will be processed in the next stream after confirmation
    try {
      if (controller.desiredSize === null) {
        logger.info(
          "[AI Stream] Controller closed - skipping tool result processing",
          {
            toolCallId: part.toolCallId,
            toolName: part.toolName,
          },
        );
        return null;
      }
    } catch (e) {
      logger.warn("[AI Stream] Error checking controller state", parseError(e));
      return null;
    }

    // AI SDK returns 'output' as unknown type
    const output = "output" in part ? part.output : undefined;
    // AI SDK sets isError: true when tool throws an error
    const isError = "isError" in part ? part.isError : false;

    logger.info("[AI Stream] Tool result RAW output", {
      toolName: part.toolName,
      toolCallId: part.toolCallId,
      messageId: toolMessageId,
      hasOutput: "output" in part,
      isError: Boolean(isError),
      outputType: typeof output,
      outputStringified: (JSON.stringify(output) || "undefined").slice(0, 500),
    });

    // Extract error message from AI SDK and structure it for translation
    let toolError: ErrorResponseType | undefined;
    if (isError) {
      // When tool throws error, AI SDK puts error message in output
      const errorMessage =
        typeof output === "string"
          ? output
          : output && typeof output === "object" && "message" in output
            ? String(output.message)
            : JSON.stringify(output);

      toolError = fail({
        message:
          "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
        errorType: ErrorResponseTypes.UNKNOWN_ERROR,
        messageParams: { error: errorMessage },
      });
    }

    // Clean output by removing undefined values (they break validation)
    // Check for both undefined and null to avoid "Cannot convert null to object" error
    const cleanedOutput =
      output !== null && output !== undefined
        ? JSON.parse(JSON.stringify(output))
        : undefined;

    // Validate and type the output using type guard
    const validatedOutput: ToolCallResult | undefined = isValidToolResult(
      cleanedOutput,
    )
      ? cleanedOutput
      : undefined;

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: validatedOutput,
      error: toolError,
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
      toolCall: toolCallWithResult, // Include tool call data with result
    });

    try {
      controller.enqueue(encoder.encode(formatSSEEvent(toolMessageEvent)));
    } catch (e) {
      if (
        e instanceof TypeError &&
        e.message.includes("Controller is already closed")
      ) {
        logger.info("[AI Stream] Controller closed - skipping message event", {
          toolCallId: part.toolCallId,
        });
        return null;
      }
      logger.error(
        "[AI Stream] Failed to enqueue tool message event",
        parseError(e),
      );
      return null;
    }

    logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    // Handle ERROR message if tool failed
    if (toolError) {
      const errorMessageId = crypto.randomUUID();
      const { serializeError } = await import("../../error-utils");

      // Emit ERROR MESSAGE_CREATED event
      const errorMessageEvent = createStreamEvent.messageCreated({
        messageId: errorMessageId,
        threadId,
        role: ChatMessageRole.ERROR,
        content: serializeError(toolError),
        parentId: toolMessageId,
        depth: toolCallData.depth + 1,
        model,
        character,
        sequenceId,
      });
      controller.enqueue(encoder.encode(formatSSEEvent(errorMessageEvent)));

      logger.info("[AI Stream] ERROR MESSAGE_CREATED event sent", {
        errorMessageId,
        toolError,
        isIncognito,
      });

      // Save ERROR message to DB (server mode only - incognito stores in localStorage)
      if (!isIncognito) {
        await createErrorMessage({
          messageId: errorMessageId,
          threadId,
          content: serializeError(toolError),
          errorType: "TOOL_ERROR",
          parentId: toolMessageId,
          depth: toolCallData.depth + 1,
          userId,
          sequenceId,
          logger,
        });

        logger.debug("[AI Stream] ERROR message saved to DB", {
          errorMessageId,
        });
      }
    }

    // Update TOOL message in DB with result (server mode only - incognito stores in localStorage)
    if (!isIncognito) {
      const updateResult = await db
        .update(chatMessages)
        .set({
          metadata: { toolCall: toolCallWithResult },
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
          toolCall: toolCallWithResult,
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
        logger.debug("[AI Stream] Tool message updated in DB", {
          messageId: toolMessageId,
          hasResult: !!validatedOutput,
          hasError: !!toolError,
        });
      }
    }

    logger.info("[AI Stream] Tool result processed", {
      messageId: toolMessageId,
      toolCallId: part.toolCallId,
      toolName: part.toolName,
      hasResult: !!validatedOutput,
      hasError: !!toolError,
      resultType: typeof validatedOutput,
      isValid: isValidToolResult(cleanedOutput),
      wasCleaned: output !== cleanedOutput,
    });

    // Emit TOOL_RESULT event for real-time UX with updated tool call data
    // SKIP if this tool result was already emitted in batch confirmation handler
    if (emittedToolResultIds && emittedToolResultIds.has(toolMessageId)) {
      logger.info(
        "[AI Stream] Skipping TOOL_RESULT emission - already emitted in batch confirmations",
        {
          messageId: toolMessageId,
          toolName: part.toolName,
        },
      );
    } else {
      const toolResultEvent = createStreamEvent.toolResult({
        messageId: toolMessageId,
        toolName: part.toolName,
        result: validatedOutput,
        error: toolError,
        toolCall: toolCallWithResult, // Include full tool call data with result
      });

      try {
        controller.enqueue(encoder.encode(formatSSEEvent(toolResultEvent)));
      } catch (e) {
        if (
          e instanceof TypeError &&
          e.message.includes("Controller is already closed")
        ) {
          logger.info(
            "[AI Stream] Controller closed - skipping tool result event",
            {
              toolCallId: part.toolCallId,
              toolName: part.toolName,
            },
          );
          return null;
        }
        logger.error(
          "[AI Stream] Failed to enqueue tool result event",
          parseError(e),
        );
        return null;
      }
    }

    // NOW update parent chain: tool message is in DB, next message can be its child
    // Return the tool message's depth (not +1) because processToolCall will increment it
    return {
      currentParentId: toolMessageId,
      currentDepth: toolCallData.depth,
    };
  }
}
