/**
 * Local WAIT execution — sync inline tool dispatch.
 *
 * Only the WAIT / END_LOOP / APPROVE paths live here — no DB imports.
 * DETACH / WAKE_UP task creation and goroutine management live in local-async.ts
 * and are loaded via dynamic import to keep this file DB-free.
 *
 * WAIT path steps:
 *   1. Resolve tool permissions (favorite → skill → null) and enforce whitelist/denylist.
 *   2. Enforce requiresConfirmation (the same gate as a direct call).
 *   3. Execute the target via RouteExecutionExecutor.executeGenericHandler.
 *   4. Discard the result if the stream was cancelled mid-execution.
 *   5. Compact validation errors and return success data directly.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/agent/chat/config";
import { makeHeadlessContext } from "next-vibe/agent/chat/config";
import { formatValidationErrorCompact } from "next-vibe/core/core-utils/format-validation-error";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";

import { getEndpoint } from "@/generated/endpoints/endpoint";

import { CallbackMode, type CallbackModeValue } from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";
// Type-only: the implementation is loaded on demand (see the subscribe site below),
// so ./control-signals and its realtime dependency stay out of the headless graph.
import type { ControlAction } from "./control-signals";
import { RouteExecutionExecutor } from "./core";
import { ExecuteToolGuards } from "./guards";
import type { RouteExecuteContext } from "./types";

export class LocalExecution {
  /**
   * Generate a task ID for local async tasks and remote dispatch callIds.
   *
   * The deterministic part is derived from the originating AI SDK toolCallId
   * (e.g. "functions.execute-tool:11"): it is baked into the recorded model
   * response, so it is identical on fixture record and replay AND identical on
   * every instance that processes the same AI turn. That is exactly what the
   * AI's conversation needs when it later echoes the task id back into a prompt.
   *
   * In production the toolCallId is only unique WITHIN one AI turn (a per-turn
   * counter), so a short random tail is appended to guarantee a globally-unique
   * cronTasks primary key across threads. On a fixture-driven execution
   * (the dispatch carries a toolExecutionContext) that tail is dropped so the id
   * stays fully reproducible on replay and identical across instances.
   *
   * When no toolCallId is present (a task not originating from an AI tool call)
   * the whole id is random — those paths need neither replay nor cross-instance
   * stability.
   */
  static generateTaskId(
    type: "local-bg" | "local-wu" | "remote-ws" | "remote-direct",
    options?: {
      instanceId?: string;
      toolCallId?: string;
      toolExecutionContext: ToolExecutionContext;
    },
  ): string {
    const { instanceId, toolCallId, toolExecutionContext } = options ?? {};
    const prefix = instanceId ? `${type}-${instanceId}` : type;
    if (!toolCallId) {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    // Sanitise the toolCallId into an id-safe token.
    const token = toolCallId
      .replaceAll(/[^a-zA-Z0-9]+/g, "-")
      .replaceAll(/^-+|-+$/g, "");
    const deterministic = `${prefix}-${token}`;
    if (toolExecutionContext) {
      return deterministic;
    }
    return `${deterministic}-${Math.random().toString(36).slice(2, 8)}`;
  }

  static async execute(params: {
    ctx: RouteExecuteContext;
    data: RouteExecuteRequestOutput;
    input: RouteExecuteRequestOutput["input"];
    instanceId: string | undefined;
    callbackMode: CallbackModeValue | null;
  }): Promise<ResponseType<WidgetData>> {
    const { ctx, data, input, instanceId, callbackMode } = params;
    const {
      toolName,
      user,
      locale,
      logger,
      t,
      toolExecutionContext,
      platform,
    } = ctx;
    const { preloadedHandler, urlPathParams } = ctx;

    logger.debug("[RouteExecute] Executing route", { toolName });

    // Resolve the callable tool set (pinned ∪ available) + denied via THE central
    // cascade (favorite → skill → NO_SKILL/role defaults). Uses the toolExecutionContext's
    // favoriteId/skillId set by the AI loop that called us; folder blocks fold in.
    const permissions = await ExecuteToolGuards.resolveToolPermissions({
      favoriteId: toolExecutionContext.favoriteId,
      skillId: toolExecutionContext.skillId,
      user,
      rootFolderId: toolExecutionContext.rootFolderId,
      logger,
    });

    const permissionBlock = ExecuteToolGuards.checkToolPermission(
      toolName,
      permissions,
    );
    if (permissionBlock !== null) {
      logger.warn("[RouteExecute] execute-tool denied by permission cascade", {
        toolName,
        reason: permissionBlock,
        rootFolderId: toolExecutionContext.rootFolderId,
        deniedToolIds: [...permissions.deniedToolIds],
        whitelistSize: permissions.availableTools?.length ?? null,
      });
      return fail({
        message: t("executeTool.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // Enforce requiresConfirmation for the TARGET tool — shared gate with the
    // remote dispatch path: the endpoint definition AND the per-context
    // confirmation cascade both apply uniformly wherever the tool would run.
    if (!instanceId && toolExecutionContext) {
      const gate = await ExecuteToolGuards.applyConfirmationGate({
        toolName,
        data: { callbackMode: data.callbackMode },
        toolExecutionContext,
        logger,
      });
      if (gate) {
        return success(gate);
      }
    }

    if (toolExecutionContext) {
      toolExecutionContext.callerCallbackMode = callbackMode ?? undefined;
    }

    // Subscribe IN PARALLEL to mid-execution control signals for this call (the
    // AI SDK toolCallId). A control TOOL delivers one mid-flight; we race it
    // against the tool's own execution. The actions MIRROR the callback modes:
    //   - cancel → interrupt: abort this call's per-call signal, return the error
    //              AS the tool result (turn + sibling calls continue).
    //   - detach → convert the still-running call to DETACH: it keeps running in
    //              the background, its result is discarded, the turn is unblocked.
    //   - wakeUp → convert the still-running call to WAKE_UP: it keeps running in
    //              the background and revives the thread with its result.
    // detach/wakeUp hand the in-flight execution to the async completion path and
    // return { taskId, hint } immediately — exactly as if it had been dispatched
    // that mode from the start. No registry/store: the waiter is transient.
    const controlCallId = toolExecutionContext?.callerToolCallId;
    const perCallAbort = new AbortController();
    // Control signals ride the realtime ws channel and are only ever reachable
    // when the caller is an AI stream (callerToolCallId set). Headless callers —
    // CLI, MCP, cron — never set it, so keep ./control-signals (and with it the
    // realtime dependency) OUT of their static graph: load it on demand.
    const control = controlCallId
      ? await import("./control-signals").then((m) =>
          m.ControlSignals.subscribe(controlCallId, user, logger),
        )
      : undefined;
    let controlAction: ControlAction | undefined;

    // The handler runs under a signal firing on EITHER the stream abort OR this
    // call's per-call abort (a cancel signal). Aborting one call leaves the turn
    // and sibling calls untouched. For detach/wakeUp the execution must SURVIVE
    // the turn ending, so those paths swap in a fresh, stream-independent signal
    // below (the goroutine handoff).
    const exectoolExecutionContext: ToolExecutionContext = toolExecutionContext
      ? {
          ...toolExecutionContext,
          abortSignal: AbortSignal.any([
            toolExecutionContext.abortSignal,
            perCallAbort.signal,
          ]),
        }
      : {
          // no user context — UTC (dates not user-facing here)
          ...makeHeadlessContext(undefined, undefined, "UTC"),
          callerCallbackMode: callbackMode ?? undefined,
          abortSignal: perCallAbort.signal,
        };

    const execPromise =
      RouteExecutionExecutor.executeGenericHandler<WidgetData>({
        toolName,
        data: input ?? {},
        urlPathParams,
        user,
        locale,
        logger,
        platform,
        preloadedHandler,
        toolExecutionContext: exectoolExecutionContext,
      });

    // Race execution against a control signal.
    if (control) {
      const raced = await Promise.race([
        execPromise.then(() => ({ action: null }) as const),
        control.signal.then((action) => {
          if (action === "cancel") {
            perCallAbort.abort(new Error("tool_cancelled"));
          }
          return { action } as const;
        }),
      ]);
      controlAction = raced.action ?? undefined;
      control.cancel();
    }

    // Cancel signal: INTERRUPT this one call. Return the error AS this call's tool
    // result IMMEDIATELY — do NOT await the aborted execution (a tool that ignores
    // its abort signal, or is stuck, would otherwise hang the cancel forever). The
    // aborted execution unwinds in the background. This is a TOOL-scoped
    // interruption: the stream is untouched (perCallAbort is chained INTO the
    // tool's context only, never the stream signal), the turn and sibling calls
    // keep running, and the AI reads this error as the call's result and continues.
    if (controlAction === "cancel") {
      void execPromise.catch(() => undefined); // swallow the background rejection
      logger.debug("[RouteExecute] Tool call cancelled via control tool", {
        toolName,
        callId: controlCallId,
      });
      return fail({
        message: t("executeTool.post.errors.forbidden.title"),
        errorType: ErrorResponseTypes.FORBIDDEN,
      });
    }

    // detach / wakeUp arrived while the call is STILL running (execPromise not yet
    // settled): convert it to the async path. Hand execPromise to the background
    // completer under the chosen mode and return { taskId, hint } now, so the turn
    // ends while the tool finishes. If execPromise already settled, the race
    // resolved with action:null and we fall through to the normal inline return.
    if (
      (controlAction === "detach" || controlAction === "wakeUp") &&
      toolExecutionContext
    ) {
      const { LocalExecutionAsync } = await import("./local-async");
      return LocalExecutionAsync.convertInFlightToAsync({
        ctx,
        mode:
          controlAction === "wakeUp"
            ? CallbackMode.WAKE_UP
            : CallbackMode.DETACH,
        input,
        execPromise,
        callId: controlCallId,
      });
    }

    // Non-control path: await the execution to settle.
    const result = await execPromise;

    // Discard result if stream was cancelled during tool execution.
    // The abort signal may have fired while the tool was running - any result
    // returned after cancellation should be ignored to prevent ghost responses.
    if (toolExecutionContext.abortSignal.aborted) {
      logger.debug(
        "[RouteExecute] Stream was cancelled during tool execution - discarding result",
        { toolName },
      );
      return fail({
        message: t("executeTool.post.errors.validation.title"),
        errorType: ErrorResponseTypes.VALIDATION_ERROR,
      });
    }

    if (!result.success) {
      const endpoint = await getEndpoint(toolName);
      const compactDetails = formatValidationErrorCompact(
        result.messageParams,
        endpoint,
      );
      if (compactDetails) {
        return {
          ...result,
          message: compactDetails as typeof result.message,
        };
      }
      return result;
    }

    // Preserve isErrorResponse / performance metadata — CLI relies on isErrorResponse
    // for exit codes (e.g. vibe check) and on performance for its execution summary.
    return success(result.data, {
      ...(result.isErrorResponse && { isErrorResponse: true }),
      ...(result.performance && { performance: result.performance }),
    });
  }
}
