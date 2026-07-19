/**
 * Confirmed re-execution — the execute-tool-owned half of the confirmation flow.
 *
 * When a tool gated by requiresConfirmation is confirmed by the user, the call is
 * re-executed. The KNOWLEDGE of how to re-run it correctly is execute-tool's, not
 * ai-stream's:
 *   - unwrap the execute-tool wrapper (EXECUTE_TOOL_ALIAS) to call the inner tool
 *     directly (keeping the wrapper double-nests the result and re-triggers the
 *     APPROVE gate) — EXCEPT for wakeUp, where the wrapper owns task creation;
 *   - override callbackMode to WAIT so the inner tool runs inline (or WAKE_UP for
 *     the fire-and-forget wakeUp confirm);
 *   - unwrap the { result: ... } layer for direct (non-wrapper) calls;
 *   - detect the wakeUp confirm race (pending goroutine vs already-landed).
 *
 * ai-stream's confirmation handler keeps ONLY the message-tree persistence (which
 * row to update / defer + the WS emit) — its genuine domain. This module returns
 * the raw executed outcome for it to persist.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import type { ChatMessage, ToolCall } from "next-vibe/agent/chat/db";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ErrorResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { CallbackMode, EXECUTE_TOOL_ALIAS } from "../constants";
import { TaskCompletion } from "./completion";
import { RouteExecuteRepository } from "./index";

export interface ConfirmedExecutionResult {
  /** The tool result to persist (undefined when execution failed). */
  toolResult: WidgetData | undefined;
  /** The error to persist (undefined when execution succeeded). */
  toolError: ErrorResponseType | undefined;
  /** The args the confirmed toolCall should record (original callbackMode preserved). */
  baseArgs: ToolCall["args"];
  /**
   * wakeUp confirm race Case B: the goroutine is still running; the deferred
   * result will arrive via revival. The caller must NOT persist a result now.
   */
  wakeUpPending: boolean;
}

export class ConfirmedExecution {
  /**
   * Re-execute a confirmed tool call and return the raw outcome for the caller to
   * persist. Owns every execute-tool-specific concern; the caller owns only the
   * message-tree write.
   */
  static async run(params: {
    toolCall: ToolCall;
    toolMessage: ChatMessage;
    toolMessageId: string;
    updatedArgs?: Record<string, string | number | boolean | null>;
    isIncognito: boolean;
    user: JwtPayloadType;
    locale: CountryLanguage;
    logger: EndpointLogger;
    toolExecutionContext: ToolExecutionContext;
  }): Promise<ConfirmedExecutionResult> {
    const {
      toolCall,
      toolMessage,
      toolMessageId,
      updatedArgs,
      isIncognito,
      user,
      locale,
      logger,
      toolExecutionContext,
    } = params;

    const baseArgs = updatedArgs
      ? {
          ...(toolCall.args as Record<
            string,
            string | number | boolean | null
          >),
          ...updatedArgs,
        }
      : toolCall.args;

    // Detect original callbackMode BEFORE overriding (needed for the wakeUp
    // fire-and-forget path).
    const isExecuteToolWrapper = toolCall.toolName === EXECUTE_TOOL_ALIAS;
    const originalCallbackMode =
      isExecuteToolWrapper &&
      typeof baseArgs === "object" &&
      baseArgs !== null &&
      !Array.isArray(baseArgs) &&
      "callbackMode" in baseArgs
        ? (baseArgs as Record<string, string | number | boolean | null>)
            .callbackMode
        : null;
    const isWakeUpConfirm = originalCallbackMode === CallbackMode.WAKE_UP;

    // When execute-tool wraps the target tool, unwrap and call the inner tool
    // directly. Keeping execute-tool as the wrapper double-nests the result
    // ({ result: { result: ... } }) and in the APPROVE case re-triggers the
    // APPROVE gate inside execute-tool. Exception: wakeUp — execute-tool's
    // local-async handler owns task creation, so the wrapper must stay.
    const shouldUnwrapExecuteTool = isExecuteToolWrapper && !isWakeUpConfirm;
    const execToolName = shouldUnwrapExecuteTool
      ? String(
          (baseArgs as Record<string, string | number | boolean | null>)
            .toolName ?? toolCall.toolName,
        )
      : toolCall.toolName;
    const execInput = shouldUnwrapExecuteTool
      ? (((baseArgs as Record<string, WidgetData>).input as Record<
          string,
          WidgetData
        > | null) ?? {})
      : (baseArgs as Record<string, WidgetData>);

    // Set currentToolMessageId so the wakeUp path calls handleTaskCompletion with
    // the correct toolMessageId for revival backfill.
    toolExecutionContext.currentToolMessageId = toolMessageId;
    // Signal a confirmed re-execution so execute-tool's requiresConfirmation gate
    // is bypassed — the user already confirmed, we must not halt again.
    toolExecutionContext.isConfirmedReExecution = true;

    logger.debug("[ConfirmedExecution] Executing tool", {
      toolName: execToolName,
      baseArgs,
    });

    let toolResult: WidgetData | undefined;
    let toolError: ErrorResponseType | undefined;

    const execResult = await RouteExecuteRepository.runInProcess({
      toolName: execToolName,
      input: execInput,
      callbackMode: isWakeUpConfirm ? CallbackMode.WAKE_UP : CallbackMode.WAIT,
      user,
      locale,
      logger,
      toolExecutionContext,
      platform: Platform.AI,
    });

    if (execResult.success) {
      // runInProcess wraps tool results in { result: ... } for AI/MCP display.
      // For direct tool calls (not the execute-tool wrapper), unwrap to match the
      // raw tool output the old loadTools()+tool.execute() path returned. For
      // execute-tool wrappers, keep the { result: ... } layer (resolveToolResult
      // strips it).
      const rawData = execResult.data;
      const rawObj =
        rawData !== null &&
        rawData !== undefined &&
        typeof rawData === "object" &&
        !Array.isArray(rawData) &&
        !(rawData instanceof Date)
          ? rawData
          : null;
      toolResult =
        !isExecuteToolWrapper && rawObj !== null && "result" in rawObj
          ? rawObj["result"]
          : rawData;
      if (
        toolResult !== null &&
        typeof toolResult === "object" &&
        !Array.isArray(toolResult) &&
        !(toolResult instanceof Date)
      ) {
        toolResult = {
          ...toolResult,
          _hint:
            "This tool required user confirmation (callbackMode=approve). The user confirmed execution, so the result is now available.",
        };
      }
      logger.debug("[ConfirmedExecution] Tool execution completed", {
        toolName: toolCall.toolName,
        hasResult: !!toolResult,
      });
    } else {
      logger.error("[ConfirmedExecution] Tool execution failed", {
        toolName: toolCall.toolName,
        message: execResult.message,
      });
      toolError = execResult;
    }

    // wakeUp confirm race: execute-tool WAKE_UP returns { taskId, hint }
    // immediately (goroutine is still running). detectWakeUpConfirmRace
    // determines whether the goroutine has already landed its result (Case A)
    // or is still in flight (Case B — caller must not persist a result).
    let wakeUpPending = false;
    const toolResultObj =
      toolResult !== undefined &&
      toolResult !== null &&
      typeof toolResult === "object" &&
      !Array.isArray(toolResult) &&
      !(toolResult instanceof Date)
        ? toolResult
        : null;
    const wakeUpTaskId =
      toolResultObj !== null &&
      "taskId" in toolResultObj &&
      typeof toolResultObj["taskId"] === "string"
        ? toolResultObj["taskId"]
        : undefined;
    if (isWakeUpConfirm && wakeUpTaskId !== undefined && !isIncognito) {
      const pendingTaskId: string = wakeUpTaskId;

      const raceResult = await TaskCompletion.detectWakeUpConfirmRace({
        toolMessage,
        toolCall,
        toolMessageId,
        pendingTaskId,
        user,
        logger,
      });

      if (raceResult.kind === "case-b") {
        wakeUpPending = true;
      }
      // Case A: fall through — caller persists the result.
    }

    return { toolResult, toolError, baseArgs, wakeUpPending };
  }
}
