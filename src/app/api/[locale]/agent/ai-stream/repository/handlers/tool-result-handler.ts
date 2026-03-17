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
import { CallbackMode } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { handleTaskCompletion } from "@/app/api/[locale]/system/unified-interface/tasks/task-completion-handler";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { parseError } from "../../../../shared/utils";
import { type ToolCall, type ToolCallResult } from "../../../chat/db";
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
          };
        }
      | undefined;
    threadId: string;
    model: ModelId;
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
        // Output is a structured ErrorResponseType from fail() — extract the error
        // detail and wrap in our translation key so types are satisfied.
        const errObj = output as Record<string, JSONValue>;
        const errDetail =
          typeof errObj.message === "string" ? errObj.message : "";
        toolError = fail({
          message: t(
            "errors.toolExecutionError",
            errDetail ? { error: errDetail } : undefined,
          ),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      } else {
        toolError = fail({
          message: t(
            "errors.toolExecutionError",
            typeof output === "string" ? { error: output } : undefined,
          ),
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
        });
      }
    }

    const cleanedOutput: JSONValue | undefined =
      output !== null && output !== undefined
        ? sortObjectKeys(JSON.parse(JSON.stringify(output)) as JSONValue)
        : undefined;

    const validatedOutput: ToolCallResult | undefined =
      cleanedOutput !== undefined && isValidToolResult(cleanedOutput)
        ? cleanedOutput
        : undefined;

    const isBackground =
      !effectiveIsError && toolCallData.toolCall.callbackMode === "detach";
    // Mark as "pending" for remote wait when the output signals a dispatched task.
    // tools-loader unwraps success().data, so output is {status: "status.pending"} directly.
    // Note: callbackMode may not be set on toolCallData.toolCall at this point —
    // the AI calls execute-tool which internally defaults to WAIT, but the AI SDK
    // tool call args don't include callbackMode. So we check the output shape only.
    // Check if output signals a pending remote task.
    // tools-loader may return the result as a JSON string, so we need to handle both
    // object and string-encoded-object forms.
    let isWaitingForRemote = false;
    if (!effectiveIsError && output !== null && output !== undefined) {
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

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: effectiveIsError ? undefined : validatedOutput,
      error: toolError,
      status: effectiveIsError
        ? "failed"
        : isBackground || isWaitingForRemote
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

    // For local background calls: tool message is now persisted, so we can
    // insert the deferred result message and emit TASK_COMPLETED WS event.
    // The taskId is in the tool result output (set by execute-tool/repository.ts).
    if (
      isBackground &&
      userId &&
      typeof output === "object" &&
      output !== null &&
      !Array.isArray(output) &&
      "taskId" in output &&
      typeof output.taskId === "string"
    ) {
      const bgTaskId = output.taskId;
      // Fire-and-forget — don't block the stream response
      void (async (): Promise<void> => {
        try {
          const { db } = await import("@/app/api/[locale]/system/db");
          const { eq, desc } = await import("drizzle-orm");
          const { cronTaskExecutions } =
            await import("@/app/api/[locale]/system/unified-interface/tasks/cron/db");
          const { CronTaskStatus } =
            await import("@/app/api/[locale]/system/unified-interface/tasks/enum");

          const [execution] = await db
            .select({
              result: cronTaskExecutions.result,
              status: cronTaskExecutions.status,
            })
            .from(cronTaskExecutions)
            .where(eq(cronTaskExecutions.taskId, bgTaskId))
            .orderBy(desc(cronTaskExecutions.completedAt))
            .limit(1);

          const bgStatus = execution?.status ?? CronTaskStatus.COMPLETED;
          const bgResult = execution?.result ?? null;

          await handleTaskCompletion({
            toolMessageId,
            threadId,
            callbackMode: CallbackMode.DETACH,
            status: bgStatus,
            output: bgResult,
            taskId: bgTaskId,
            userId,
            logger,
          });
        } catch (err) {
          logger.error(
            "[AI Stream] Failed to call handleTaskCompletion for background task",
            {
              toolMessageId,
              bgTaskId,
              error: parseError(err).message,
            },
          );
        }
      })();
    }

    return {
      currentParentId: toolMessageId,
    };
  }
}
