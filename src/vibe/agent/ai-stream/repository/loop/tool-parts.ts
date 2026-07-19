/**
 * Tool-call / tool-result / tool-error part handlers for the StreamLoop.
 */

import "server-only";

import type { JSONValue } from "ai";
import {
  type ErrorResponseType,
  ErrorResponseTypes,
  fail,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { CallbackMode, CallbackModeDB } from "next-vibe/execute-tool/constants";
import { Platform } from "next-vibe/platforms/platforms";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import type { ToolCall } from "../../../chat/db";
import type { PendingToolData } from "../core/stream";
import { isValidToolResult, sortObjectKeys } from "./helpers";
import type { StreamLoopState } from "./state";

function isPlainRecord(
  v: WidgetData | undefined,
): v is { [key: string]: WidgetData } {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Run the TARGET tool's `requestDefaults` on the args the AI emitted and fold the
 * server-authoritative fields it resolves (e.g. a media-gen `model` from the
 * favorite/skill cascade) back into the recorded args — so the tool message shows
 * what actually ran, not just the AI's partial input. For `execute-tool` the
 * target is the WRAPPED tool and its input is nested under `input`. Never fatal:
 * a resolver hiccup just leaves the recorded args as the AI sent them.
 */
async function enrichToolArgsWithRequestDefaults(
  outerToolName: string,
  toolCallArgs: WidgetData,
  state: StreamLoopState,
  logger: StreamLoopState["p"]["logger"],
): Promise<WidgetData> {
  if (!isPlainRecord(toolCallArgs)) {
    return toolCallArgs;
  }
  const isExecuteWrapper = outerToolName === "execute-tool";
  const targetToolName = isExecuteWrapper
    ? typeof toolCallArgs["toolName"] === "string"
      ? toolCallArgs["toolName"]
      : null
    : outerToolName;
  const targetInput = isExecuteWrapper ? toolCallArgs["input"] : toolCallArgs;
  if (!targetToolName || !isPlainRecord(targetInput)) {
    return toolCallArgs;
  }
  try {
    const { getRouteHandler } = await import("@/generated/routes/handlers");
    const handler = await getRouteHandler(targetToolName).catch(() => null);
    if (!handler?.requestDefaults) {
      return toolCallArgs;
    }
    const patch = await handler.requestDefaults(
      {
        user: state.p.user,
        locale: state.p.locale,
        platform: Platform.AI,
        toolExecutionContext: state.p.toolExecutionContext,
      },
      { requestData: targetInput, urlPathParams: {} },
    );
    if (!patch || Object.keys(patch).length === 0) {
      return toolCallArgs;
    }
    const enrichedInput: { [key: string]: WidgetData } = {
      ...targetInput,
      ...(patch as { [key: string]: WidgetData }),
    };
    return isExecuteWrapper
      ? { ...toolCallArgs, input: enrichedInput }
      : enrichedInput;
  } catch (err) {
    logger.warn("[AI Stream] requestDefaults enrich failed (non-fatal)", {
      targetToolName,
      error: err instanceof Error ? err.message : String(err),
    });
    return toolCallArgs;
  }
}

/** Return type for onToolCall */
export interface ToolCallResult {
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

/**
 * Process tool-call event from stream
 */
export async function onToolCall(
  state: StreamLoopState,
  part: {
    type: "tool-call";
    toolCallId: string;
    toolName: string;
    input?: WidgetData;
  },
): Promise<ToolCallResult> {
  const { ctx, threadId, model, skill, userId, toolsConfig, logger } = state.p;
  const { sequenceId, dbWriter } = ctx;

  // Get tool arguments from the AI SDK part.input
  let toolCallArgs: WidgetData = part.input ?? {};

  // The AI only emits the args it chose (e.g. { prompt }); server-authoritative
  // request fields (like a media-gen `model` resolved from the favorite/skill
  // cascade) are filled in by the target tool's requestDefaults at execution
  // time and were NEVER reflected back into the recorded call — so the tool
  // message showed no model. Resolve them here and fold them into the recorded
  // input so the call reflects what actually ran. For execute-tool the resolved
  // fields belong to the WRAPPED tool and go into its nested `input`.
  toolCallArgs = await enrichToolArgsWithRequestDefaults(
    part.toolName,
    toolCallArgs,
    state,
    logger,
  );

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

  const prep = await state.ensureAssistantMessage(ctx.currentParentId);

  // Mid-stream compacting race: prepareStep can fire and complete its compacting
  // DB write DURING the flushContent() await inside ensureAssistantMessage.
  // When that happens ctx.currentParentId AND pendingQueueParentId are both set
  // to the compacting message ID (the direct sets in performMidStreamCompacting).
  // prep.currentParentId is the stale pre-compacting value captured before the yield.
  //
  // Use the compacting message as tool parent ONLY when currentParentId still points
  // to it — meaning no subsequent message (e.g. a reasoning block) has been created
  // as a child of compact yet. If currentParentId has already advanced past compact
  // (a text-delta created an assistant message that correctly chains off compact),
  // use prep.currentParentId instead — the assistant is the correct parent.
  const compactingId = ctx.pendingQueueParentId;
  const toolParentId =
    compactingId !== null &&
    compactingId !== undefined &&
    ctx.currentParentId === compactingId
      ? compactingId
      : prep.currentParentId;
  if (
    compactingId !== null &&
    compactingId !== undefined &&
    ctx.currentParentId === compactingId
  ) {
    ctx.pendingQueueParentId = null;
  }

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
    parentId: toolParentId,
    userId,
    model,
    skill,
    sequenceId,
    toolCall: toolCallData,
  });

  if (requiresConfirmation) {
    logger.debug(
      "[AI Stream] Tool requires confirmation - stream continues, batch aborts at finish-step",
      {
        messageId: toolMessageId,
        toolName: part.toolName,
        isIncognito: state.p.isIncognito,
      },
    );

    return {
      currentAssistantMessageId: prep.currentAssistantMessageId,
      currentAssistantContent: prep.currentAssistantContent,
      isInReasoningBlock: prep.isInReasoningBlock,
      currentParentId: toolParentId,
      requiresConfirmation: true,
      pendingToolMessage: {
        messageId: toolMessageId,
        toolCallData: {
          toolCall: toolCallData,
          parentId: toolParentId,
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
    currentParentId: toolParentId,
    requiresConfirmation: false,
    pendingToolMessage: {
      messageId: toolMessageId,
      toolCallData: {
        toolCall: toolCallData,
        parentId: toolParentId,
      },
    },
  };
}

/**
 * Process tool-result event from stream
 */
export async function onToolResult(
  state: StreamLoopState,
  part: {
    type: "tool-result";
    toolCallId: string;
    toolName: string;
    output?: JSONValue;
    isError?: boolean;
  },
  pendingToolMessage: PendingToolData | undefined,
): Promise<{
  currentParentId: string | null;
} | null> {
  const {
    ctx,
    toolExecutionContext,
    threadId,
    isIncognito,
    userId,
    user,
    toolsConfig,
    emittedToolResultIds,
    logger,
    t,
    model,
    skill,
  } = state.p;
  const { sequenceId, dbWriter } = ctx;

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
            message: t("errors.toolExecutionErrorDetail", { error: errDetail }),
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
  // 1. toolExecutionContext.waitingForRemoteResult=true - set by escalateToTask or remote queue WAIT/END_LOOP
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
    toolExecutionContext.waitingForRemoteResult === true;
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
    // A tool that signals pending via its OUTPUT SHAPE (execute-tool's remote
    // queue WAIT / wakeUp — the loop-remote path where the executor's own
    // execute-tool returns {status:"status.pending"} rather than going through
    // escalateToTask) must ALSO raise the SHARED toolExecutionContext flag. The
    // finish-step abort (REMOTE_TOOL_WAIT) and the SDK stopWhen predicate both
    // key off `toolExecutionContext.waitingForRemoteResult`; without setting it the loop
    // starts another model turn with a pending (result-less) tool message and the
    // AI SDK throws AI_NoOutputGeneratedError → the whole turn surfaces as a
    // STREAM_ERROR instead of cleanly parking in "waiting" for the revival.
    if (isWaitingForRemote) {
      toolExecutionContext.waitingForRemoteResult = true;
    }
  }

  // For wait/wakeUp-escalated tools (isWaitingForRemote=true): the tool message
  // stays in "executing" state with no result - the real result arrives via
  // handleTaskCompletion → resume-stream when the background task completes.
  // Do NOT emit any result now; leave the message as-is in DB.
  // Only on cancel will a "failed/cancelled" result be written (by cancel/repository.ts).
  // A `waiting_for_confirmation` placeholder is NOT a remote-pending result — it
  // is the confirmation gate's/APPROVE mode's authoritative "halt, await user"
  // marker that MUST be written to the tool message (the abort at finish-step +
  // the phase-2 re-execution both key off it). When this tool runs in a PARALLEL
  // batch alongside a genuinely remote-pending sibling, toolExecutionContext's shared
  // `waitingForRemoteResult` flag leaks onto it and would wrongly skip the write,
  // leaving the approve tool message result-less. Never skip a confirmation
  // placeholder.
  const isConfirmationPlaceholder =
    output !== null &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    ((): boolean => {
      const rec = output as Record<string, JSONValue>;
      const inner = rec["result"];
      return (
        rec["status"] === "waiting_for_confirmation" ||
        (typeof inner === "object" &&
          inner !== null &&
          !Array.isArray(inner) &&
          (inner as Record<string, JSONValue>)["status"] ===
            "waiting_for_confirmation")
      );
    })();
  // A wakeUp DISPATCH result carries a `taskId` — the phase-1 acknowledgement the
  // model MUST see (its two-phase judgement keys off "the dispatch returned a
  // taskId and no responsePath yet"). Unlike `wait` (which has no result at all
  // until revival), wakeUp's `{taskId, status:pending}` IS a real phase-1 result,
  // exactly like detach. On loop-remote the executor's execute-tool returns this
  // via the {status:pending} shape, so isWaitingForRemote is set and the write
  // was SKIPPED — leaving the phase-1 tool message result NULL. The model then
  // read a taskId-less dispatch and (correctly, given the data) judged phase-2
  // FAILED. Write the dispatch result when it carries a taskId; the real output
  // still arrives later as the DEFERRED message via revival.
  const outputHasTaskId =
    output !== null &&
    typeof output === "object" &&
    !Array.isArray(output) &&
    typeof (output as Record<string, JSONValue>)["taskId"] === "string";
  if (
    isWaitingForRemote &&
    !effectiveIsError &&
    !isConfirmationPlaceholder &&
    !outputHasTaskId
  ) {
    logger.debug(
      "[AI Stream] Skipping tool result emit - tool is waiting for remote task",
      { toolMessageId, toolName: part.toolName },
    );
    return { currentParentId: toolMessageId };
  }

  // Confirmation-gate marker: execute-tool's requiresConfirmation gate returns
  // { result: { status: "waiting_for_confirmation", toolName } } WITHOUT
  // executing. The gate also mutates the pendingToolMessages entry, but the AI
  // SDK may run execute() before the tool-call event registers that entry
  // (spin-wait race) — then the mutation lands nowhere and the message would
  // finalize as an ordinary completed result, silently skipping the approval
  // UI. The marker in the output is authoritative: force the parked shape.
  // (Same detection as the isWaitingForRemote-skip guard above — reuse it.)
  const gateParked = !effectiveIsError && isConfirmationPlaceholder;

  const toolCallWithResult: ToolCall = {
    ...toolCallData.toolCall,
    ...(gateParked
      ? {
          requiresConfirmation: true,
          waitingForConfirmation: true,
          isConfirmed: false,
        }
      : {}),
    result: effectiveIsError ? undefined : validatedOutput,
    error: toolError,
    isPartial: false,
    status: effectiveIsError
      ? "failed"
      : isBackground
        ? "pending"
        : "completed",
  };
  if (gateParked) {
    // Mirror of the gate's stream-side effect — guarantees the abort at
    // finish-step even if the per-call snapshot propagation was missed.
    ctx.stepHasToolsAwaitingConfirmation = true;
  }

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
      toolLabel: toolsConfig.get(part.toolName)?.label,
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
  //
  // For wakeUp tools (local or remote): revival is handled by ONE code path:
  // goroutine finishes → handleTaskCompletion → resume-stream → deferred + revival.
  // Do NOT publish wakeUp signals here - that would create duplicate revivals.

  return {
    currentParentId: toolMessageId,
  };
}

/**
 * Process tool-error event from stream.
 *
 * When the AI model calls a tool not in the visible tools set (e.g. discovered
 * via tool-help), the AI SDK emits a tool-error. This handler catches that
 * case and either:
 * 1. Executes the tool via execute-tool (RouteExecuteRepository) if it's in availableTools
 * 2. Returns a "tool disabled by user" error to the model (if not in availableTools)
 * 3. Handles confirmation requirements (if tool requires confirmation)
 *
 * Checks permissions (activeToolNames) and confirmation requirements (toolsConfig)
 * before executing the tool. Mirrors the behavior of a regular tool-call + tool-result
 * flow for tools discovered via tool-help.
 */
export async function onToolError(
  state: StreamLoopState,
  part: {
    type: "tool-error";
    toolCallId: string;
    toolName: string;
    /** Raw input from the AI SDK — present even when validation fails before execute(). */
    input?: JSONValue;
    error?: JSONValue;
  },
  pendingToolMessage: PendingToolData | undefined,
): Promise<{
  currentParentId: string | null;
} | null> {
  const {
    ctx,
    threadId,
    userId,
    user,
    activeToolNames,
    toolsConfig,
    logger,
    t,
    model,
    skill,
  } = state.p;
  const { sequenceId, dbWriter } = ctx;

  if (!pendingToolMessage) {
    // tool-error arrived without a preceding tool-call (e.g. validation failed
    // at the AI SDK layer before our execute() ran). Recover using the input the
    // SDK carries on the error part so the original payload is preserved in DB.
    if (part.input === undefined) {
      logger.warn(
        "[AI Stream] Tool error with no pending message and no input",
        {
          toolName: part.toolName,
          toolCallId: part.toolCallId,
        },
      );
      return null;
    }
    const prep = await state.ensureAssistantMessage(ctx.currentParentId);
    const toolCallId = part.toolCallId;
    const recoveredToolCall: ToolCall = {
      toolCallId,
      toolName: part.toolName,
      args: part.input as WidgetData,
      creditsUsed: 0,
      requiresConfirmation: false,
      isConfirmed: false,
      waitingForConfirmation: false,
      isPartial: false,
      status: "failed",
    };
    const toolMessageId = crypto.randomUUID();
    const parentId = prep.currentParentId;
    await dbWriter.emitToolCall({
      toolMessageId,
      threadId,
      parentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: recoveredToolCall,
    });
    return emitOriginalToolError(state, part, toolMessageId, {
      toolCall: recoveredToolCall,
      parentId,
    });
  }

  const { messageId: toolMessageId, toolCallData } = pendingToolMessage;

  // Step 1: Check if tool is allowed (activeToolNames permission layer).
  // null = all tools allowed. If set and tool not in it, it's disabled for this user.
  if (activeToolNames !== null && !activeToolNames.has(part.toolName)) {
    // Could be unknown tool or just disabled - check if it exists at all
    const unknownEndpoint = await getEndpoint(part.toolName);
    if (!unknownEndpoint) {
      // Tool doesn't exist at all - emit the original error
      return emitOriginalToolError(state, part, toolMessageId, toolCallData);
    }

    logger.debug(
      "[AI Stream] Tool not in availableTools - returning disabled error to model",
      {
        toolName: part.toolName,
        toolCallId: part.toolCallId,
        messageId: toolMessageId,
      },
    );

    const disabledError = fail({
      message: t("errors.toolDisabledByUser"),
      errorType: ErrorResponseTypes.FORBIDDEN,
    });

    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error: disabledError,
      isPartial: false,
      // Terminal state: without it the tool message stays status-null
      // forever — a permanently-"pending" dead end in the thread.
      status: "failed",
    };

    await dbWriter.emitToolResult({
      toolMessageId,
      threadId,
      parentId: toolCallData.parentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallWithError,
      toolName: part.toolName,
      result: undefined,
      error: disabledError,
      skipSseEmit: false,
      user,
    });

    return { currentParentId: toolMessageId };
  }

  // Step 2: Check confirmation requirements.
  // toolsConfig already has the resolved value from setup.
  // For fallback tools (not in pinnedTools), lazy-load to get definition default.
  const toolConfig = toolsConfig.get(part.toolName);
  let requiresConfirmation = toolConfig?.requiresConfirmation;
  if (requiresConfirmation === undefined) {
    const endpoint = await getEndpoint(part.toolName);
    requiresConfirmation = endpoint?.requiresConfirmation ?? false;
  }

  if (requiresConfirmation) {
    logger.debug(
      "[AI Stream] Fallback tool requires confirmation - emitting TOOL_WAITING",
      {
        toolName: part.toolName,
        toolCallId: part.toolCallId,
        messageId: toolMessageId,
      },
    );

    // Update the tool call data with confirmation info
    const toolCallWithConfirmation: ToolCall = {
      ...toolCallData.toolCall,
      requiresConfirmation: true,
      waitingForConfirmation: true,
      isConfirmed: false,
    };

    // Re-emit the tool call with confirmation data and emit TOOL_WAITING
    await dbWriter.emitToolResult({
      toolMessageId,
      threadId,
      parentId: toolCallData.parentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallWithConfirmation,
      toolName: part.toolName,
      result: undefined,
      error: undefined,
      skipSseEmit: false,
      user,
    });

    return {
      currentParentId: toolMessageId,
    };
  }

  // Step 4: Execute the tool (same as regular tool execution)
  const fallbackResult = await executeFallbackTool(
    state,
    part.toolName,
    toolCallData.toolCall.args,
  );

  if (fallbackResult && "data" in fallbackResult) {
    logger.debug(
      "[AI Stream] Tool fallback execution succeeded (discovered via tool-help)",
      {
        toolName: part.toolName,
        toolCallId: part.toolCallId,
        messageId: toolMessageId,
      },
    );

    const toolCallWithResult: ToolCall = {
      ...toolCallData.toolCall,
      result: fallbackResult.data,
      creditsUsed: toolsConfig.get(part.toolName)?.credits ?? 0,
      isPartial: false,
    };

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
      toolLabel: toolsConfig.get(part.toolName)?.label,
      result: fallbackResult.data,
      error: undefined,
      skipSseEmit: false,
      user,
    });

    logger.debug("[AI Stream] TOOL_RESULT event sent (fallback)", {
      messageId: toolMessageId,
      toolName: part.toolName,
      isIncognito: state.p.isIncognito,
    });

    return {
      currentParentId: toolMessageId,
    };
  }

  // Execution failed with a known error - emit it as a tool result so the model can retry
  if (fallbackResult && "error" in fallbackResult) {
    logger.warn("[AI Stream] Emitting tool error result to model", {
      toolName: part.toolName,
      error: fallbackResult.error,
      toolCallId: part.toolCallId,
    });

    // Pass the actual error message from the tool so the model gets actionable context,
    // not a generic "please try again" that hides what went wrong.
    const errorResponse = fail({
      message: fallbackResult.error as typeof fallbackResult.error &
        "createScopedTranslation-key",
      errorType: ErrorResponseTypes.INVALID_REQUEST_ERROR,
    });
    const toolCallWithError: ToolCall = {
      ...toolCallData.toolCall,
      error: errorResponse,
      isPartial: false,
    };

    await dbWriter.emitToolResult({
      toolMessageId,
      threadId,
      parentId: toolCallData.parentId,
      userId,
      model,
      skill,
      sequenceId,
      toolCall: toolCallWithError,
      toolName: part.toolName,
      result: undefined,
      error: toolCallWithError.error,
      skipSseEmit: false,
      user,
    });

    return {
      currentParentId: toolMessageId,
    };
  }

  // Unknown failure - emit original SDK error
  return emitOriginalToolError(state, part, toolMessageId, toolCallData);
}

/**
 * Execute a discovered tool via execute-tool (the single execution path).
 * Returns { data } on success, { error } on failure so callers can forward errors to the model.
 */
async function executeFallbackTool(
  state: StreamLoopState,
  toolName: string,
  args: WidgetData | undefined,
): Promise<{ data: WidgetData } | { error: string } | null> {
  const { user, locale, logger, toolExecutionContext } = state.p;

  try {
    logger.debug(
      "[AI Stream] Attempting fallback execution for discovered tool",
      { toolName },
    );

    const { RouteExecuteRepository } =
      await import("next-vibe/execute-tool/repository");

    // Tool-call args are always a JSON object; narrow the loose WidgetData type.
    const inputArgs: Record<string, WidgetData> =
      args !== null &&
      args !== undefined &&
      typeof args === "object" &&
      !Array.isArray(args) &&
      !(args instanceof Date)
        ? args
        : {};
    const result = await RouteExecuteRepository.runInProcess({
      toolName,
      input: inputArgs,
      callbackMode: CallbackMode.WAIT,
      user,
      locale,
      logger,
      toolExecutionContext,
      platform: Platform.AI,
    });

    if (!result.success) {
      logger.warn("[AI Stream] Fallback tool execution failed", {
        toolName,
        error: result.message,
        messageParams: result.messageParams,
        args: JSON.stringify(args ?? {}).slice(0, 500),
      });
      const extraDetail = result.messageParams?.error;
      const errorMsg =
        extraDetail && !result.message.includes(extraDetail as string)
          ? `${result.message}: ${extraDetail}`
          : result.message;
      return { error: errorMsg };
    }

    // runInProcess wraps success data as { result: actualData } for MCP/AI display.
    // Unwrap it here so the stored tool result matches what tools-loader returns for
    // direct tool calls (the AI sees { tools, ... } not { result: { tools, ... } }).
    const rawData = result.data as Record<string, WidgetData> | null;
    const effectiveData =
      rawData !== null &&
      typeof rawData === "object" &&
      "result" in rawData &&
      rawData["result"] !== null &&
      typeof rawData["result"] === "object" &&
      !Array.isArray(rawData["result"])
        ? (rawData["result"] as WidgetData)
        : result.data;
    return { data: effectiveData };
  } catch (error) {
    logger.warn("[AI Stream] Fallback tool execution threw", {
      toolName,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Emit the original error result when fallback is not possible.
 */
async function emitOriginalToolError(
  state: StreamLoopState,
  part: {
    type: "tool-error";
    toolCallId: string;
    toolName: string;
    error?: JSONValue;
  },
  toolMessageId: string,
  toolCallData: {
    toolCall: ToolCall;
    parentId: string | null;
  },
): Promise<{
  currentParentId: string | null;
}> {
  const { ctx, threadId, isIncognito, userId, user, logger, t, model, skill } =
    state.p;
  const { sequenceId, dbWriter } = ctx;

  // Build a proper ErrorResponseType from the SDK error.
  // The SDK's part.error is JSONValue - it may be a string, object, or anything.
  // We never trust it to be ErrorResponseType; always wrap via fail().
  const sdkError = "error" in part ? part.error : undefined;
  const sdkErrorMessage =
    sdkError &&
    typeof sdkError === "object" &&
    sdkError !== null &&
    "message" in sdkError &&
    typeof sdkError.message === "string"
      ? sdkError.message
      : typeof sdkError === "string"
        ? sdkError
        : undefined;

  const error: ErrorResponseType = sdkErrorMessage
    ? fail({
        message: t("errors.toolExecutionErrorDetail", {
          error: sdkErrorMessage,
        }),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      })
    : fail({
        message: t("errors.toolExecutionFailed"),
        errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
      });

  logger.debug("[AI Stream] Tool error event received", {
    toolName: part.toolName,
    error,
    toolCallId: part.toolCallId,
    messageId: toolMessageId,
  });

  const toolCallWithError: ToolCall = {
    ...toolCallData.toolCall,
    error,
    isPartial: false,
    // Terminal state: without it the tool message stays status-null
    // forever — a permanently-"pending" dead end in the thread.
    status: "failed",
  };

  await dbWriter.emitToolResult({
    toolMessageId,
    threadId,
    parentId: toolCallData.parentId,
    userId,
    model,
    skill,
    sequenceId,
    toolCall: toolCallWithError,
    toolName: part.toolName,
    result: undefined,
    error,
    skipSseEmit: false,
    user,
  });

  logger.debug("[AI Stream] TOOL_RESULT event sent (error)", {
    messageId: toolMessageId,
    toolName: part.toolName,
    isIncognito,
  });

  return {
    currentParentId: toolMessageId,
  };
}
