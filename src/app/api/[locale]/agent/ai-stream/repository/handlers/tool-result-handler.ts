/**
 * ToolResultHandler - Handles tool result events during streaming
 */

import type { JSONValue } from "ai";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { parseError } from "../../../../shared/utils";
import { type ToolCall, type ToolCallResult } from "../../../chat/db";
import type { MessageDbWriter } from "../core/message-db-writer";

/**
 * Recursively sort object keys for stable serialization (cache-friendly)
 * Also handles strings that contain JSON (like tool args/results)
 */
function sortObjectKeys(obj: JSONValue): JSONValue {
  if (obj === null) {
    return obj;
  }

  // Handle strings that might contain JSON
  if (typeof obj === "string") {
    if (
      (obj.startsWith("{") && obj.endsWith("}")) ||
      (obj.startsWith("[") && obj.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(obj) as JSONValue;
        const sorted = sortObjectKeys(parsed);
        return JSON.stringify(sorted);
      } catch {
        return obj;
      }
    }
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  const sorted: Record<string, JSONValue> = {};
  for (const key of Object.keys(obj).toSorted()) {
    const value = obj[key];
    if (value !== undefined) {
      sorted[key] = sortObjectKeys(value);
    }
  }
  return sorted;
}

/**
 * Type guard for tool result values
 */
function isValidToolResult(value: JSONValue): value is ToolCallResult {
  if (value === null) {
    return true;
  }
  if (value === undefined) {
    return false;
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
    return value.every((item) => isValidToolResult(item));
  }
  if (typeof value === "object") {
    return Object.values(value).every((v) =>
      v !== undefined ? isValidToolResult(v) : false,
    );
  }
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
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
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
      user,
      dbWriter,
      logger,
      emittedToolResultIds,
    } = params;

    if (!pendingToolMessage) {
      logger.error(
        "[AI Stream] Tool result received but no pending message found",
        { toolCallId: part.toolCallId, toolName: part.toolName },
      );
      return null;
    }

    const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

    const output = "output" in part ? part.output : undefined;
    const isError = "isError" in part ? part.isError : false;

    let toolError: ErrorResponseType | undefined;
    if (isError) {
      const errorMessage =
        typeof output === "string"
          ? output
          : output && typeof output === "object" && "message" in output
            ? String(output.message)
            : JSON.stringify(output);
      toolError = fail({
        message:
          "app.api.agent.chat.aiStream.errors.toolExecutionError" as const,
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        messageParams: { error: errorMessage },
      });
    }

    const cleanedOutput: JSONValue | undefined =
      output !== null && output !== undefined
        ? sortObjectKeys(JSON.parse(JSON.stringify(output)) as JSONValue)
        : undefined;

    const validatedOutput: ToolCallResult | undefined =
      cleanedOutput !== undefined && isValidToolResult(cleanedOutput)
        ? cleanedOutput
        : undefined;

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: validatedOutput,
      error: toolError,
    };

    try {
      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        depth: toolCallData.depth,
        userId,
        model,
        character,
        sequenceId,
        toolCall: toolCallWithResult,
        toolName: part.toolName,
        result: validatedOutput,
        error: toolError,
        skipSseEmit: emittedToolResultIds?.has(toolMessageId),
        user,
      });
    } catch (e) {
      logger.error("[AI Stream] Failed to process tool result", parseError(e));
      return null;
    }

    logger.info("[AI Stream] TOOL MESSAGE_CREATED event sent", {
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
