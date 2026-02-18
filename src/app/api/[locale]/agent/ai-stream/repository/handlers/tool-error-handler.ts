/**
 * ToolErrorHandler - Handles tool error events during streaming
 */

import type { JSONValue } from "ai";
import type { ErrorResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { type ToolCall } from "../../../chat/db";
import type { MessageDbWriter } from "../core/message-db-writer";

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
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
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
      user,
      dbWriter,
      logger,
    } = params;

    if (!pendingToolMessage) {
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

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

    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error,
    };

    await dbWriter.emitToolResult({
      toolMessageId,
      threadId,
      parentId: toolCallData.parentId,
      depth: toolCallData.depth,
      userId,
      model,
      character,
      sequenceId,
      toolCall: toolCallWithError,
      toolName: part.toolName,
      result: undefined,
      error,
      skipSseEmit: false,
      user,
    });

    logger.info("[AI Stream] TOOL_RESULT event sent (error)", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    return {
      currentParentId: toolMessageId,
      currentDepth: toolCallData.depth,
    };
  }
}
