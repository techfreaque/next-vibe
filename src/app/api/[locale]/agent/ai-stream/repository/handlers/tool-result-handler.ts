/**
 * ToolResultHandler - Handles tool result events during streaming
 */

import type { JSONValue } from "ai";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import type { ToolExecutionContext } from "@/app/api/[locale]/agent/chat/config";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import { parseError } from "../../../../shared/utils";

import { type ToolCall } from "../../../chat/db";
import type { AiStreamT } from "../../stream/i18n";
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
        return sorted;
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
function isValidToolResult(value: JSONValue): value is JSONValue & WidgetData {
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
          };
        }
      | undefined;
    /** Stream context - used to detect waitingForRemoteResult for escalated tools */
    streamContext: ToolExecutionContext;
    threadId: string;
    model: ChatModelId;
    skill: string;
    sequenceId: string;
    isIncognito: boolean;
    userId: string | undefined;
    user: JwtPayloadType;
    dbWriter: MessageDbWriter;
    logger: EndpointLogger;
    emittedToolResultIds?: Set<string>;
    t: AiStreamT;
  }): Promise<{
    currentParentId: string | null;
  } | null> {
    const {
      part,
      pendingToolMessage,
      streamContext,
      threadId,
      model,
      skill,
      sequenceId,
      isIncognito,
      userId,
      user,
      dbWriter,
      logger,
      emittedToolResultIds,
      t,
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

    const output = "output" in part ? part.output : undefined;
    const isError = "isError" in part ? part.isError : false;

    // Detect ErrorResponseType returned as a "successful" tool result.
    // When a tool returns fail({...}) without throwing, the AI SDK treats it as
    // isError=false, but the output is {success: false, message: ..., errorType: ...}.
    const isErrorResponse =
      !isError &&
      output !== null &&
      output !== undefined &&
      typeof output === "object" &&
      !Array.isArray(output) &&
      "success" in output &&
      output.success === false &&
      "message" in output &&
      typeof output.message === "string";

    const effectiveIsError = isError || isErrorResponse;

    let toolError: ErrorResponseType | undefined;
    if (effectiveIsError) {
      if (isErrorResponse && typeof output === "object" && output !== null) {
        // Output is a structured ErrorResponseType from fail() - pass through its
        // message as messageParams so the AI sees the specific error detail
        // (e.g. "Tool not found: xyz") rather than a generic wrapper.
        const errObj = output as Record<string, JSONValue>;
        const errDetail =
          typeof errObj.message === "string" ? errObj.message : "";
        toolError = errDetail
          ? fail({
              message: t("errors.toolExecutionErrorDetail"),
              messageParams: { error: errDetail },
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            })
          : fail({
              message: t("errors.toolExecutionError"),
              errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
            });
      } else {
        toolError = fail({
          message: t("errors.toolExecutionError"),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    const cleanedOutput: JSONValue | undefined =
      output !== null && output !== undefined
        ? sortObjectKeys(JSON.parse(JSON.stringify(output)) as JSONValue)
        : undefined;

    const validatedOutput: WidgetData | undefined =
      cleanedOutput !== undefined && isValidToolResult(cleanedOutput)
        ? cleanedOutput
        : undefined;

    // detach: fire-and-forget, AI gets taskId immediately, result arrives later
    // wakeUp: original message is never modified - deferred message carries the real result
    // Both start as "pending" - handleTaskCompletion/resume-stream backfill when done
    const isBackground =
      !effectiveIsError &&
      (toolCallData.toolCall.callbackMode === "detach" ||
        toolCallData.toolCall.callbackMode === "wakeUp");
    // Mark as "pending" for remote wait when:
    // 1. streamContext.waitingForRemoteResult=true - set by escalateToTask or remote queue WAIT/END_LOOP
    //    before processToolResult is called. This covers escalated tools (e.g. claude-code) whose
    //    own output shape doesn't signal pending.
    // 2. Output shape {status: "status.pending"} - set by execute-tool for remote queue WAIT/wakeUp.
    //    tools-loader unwraps success().data, so output is {status: "status.pending"} directly.
    // NOTE: detach mode also returns {taskId, status: "status.pending"} but that IS the final result
    // (the task was detached successfully). Do NOT treat detach as isWaitingForRemote - its result
    // must be written to DB so handleTaskCompletion can attach the deferred result later.
    const isDetach = toolCallData.toolCall.callbackMode === "detach";
    let isWaitingForRemote =
      !effectiveIsError &&
      !isDetach &&
      streamContext.waitingForRemoteResult === true;
    if (
      !isWaitingForRemote &&
      !effectiveIsError &&
      !isDetach &&
      output !== null &&
      output !== undefined
    ) {
      if (
        typeof output === "object" &&
        !Array.isArray(output) &&
        "status" in output &&
        output.status === "status.pending"
      ) {
        isWaitingForRemote = true;
      } else if (typeof output === "string") {
        try {
          const parsed = JSON.parse(output) as JSONValue;
          if (
            typeof parsed === "object" &&
            parsed !== null &&
            !Array.isArray(parsed) &&
            "status" in parsed &&
            parsed.status === "status.pending"
          ) {
            isWaitingForRemote = true;
          }
        } catch {
          // Not JSON, ignore
        }
      }
    }

    // For wait/wakeUp-escalated tools (isWaitingForRemote=true): the tool message
    // stays in "executing" state with no result - the real result arrives via
    // handleTaskCompletion → resume-stream when the background task completes.
    // Do NOT emit any result now; leave the message as-is in DB.
    // Only on cancel will a "failed/cancelled" result be written (by cancel/repository.ts).
    if (isWaitingForRemote && !effectiveIsError) {
      logger.debug(
        "[AI Stream] Skipping tool result emit - tool is waiting for remote task",
        { toolMessageId, toolName: part.toolName },
      );
      return { currentParentId: toolMessageId };
    }

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: effectiveIsError ? undefined : validatedOutput,
      error: toolError,
      status: effectiveIsError
        ? "failed"
        : isBackground
          ? "pending"
          : "completed",
    };

    try {
      await dbWriter.emitToolResult({
        toolMessageId,
        threadId,
        parentId: toolCallData.parentId,
        userId,
        model,
        skill,
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

    logger.debug("[AI Stream] TOOL MESSAGE_CREATED event sent", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito,
    });

    // Note: for detach tasks, the execute-tool goroutine handles its own
    // handleTaskCompletion call (WS event, optional wakeUp revival). Do NOT
    // call handleTaskCompletion here - it would race with the goroutine and
    // overwrite the initial { taskId, status, hint } result with null.

    return {
      currentParentId: toolMessageId,
    };
  }
}
