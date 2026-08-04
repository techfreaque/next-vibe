/**
 * Local WAIT execution — sync inline tool dispatch. "Run it here, now, inline."
 *
 * Steps:
 *   1. Pre-execution gates (permission cascade + requiresConfirmation) — ./guards.
 *   2. Execute the target via RouteExecutionExecutor.executeGenericHandler.
 *   3. Race that execution against a mid-flight control signal — ./local-control.
 *   4. Discard the result if the stream was cancelled mid-execution.
 *   5. Return the success data directly.
 *
 * Everything this file needs beyond "call the handler" is behind one call each,
 * on purpose: steps 1 and 3 are the only places an agent layer (favorites/skills,
 * confirmation UI, realtime control channel, task system) reaches into the inline
 * path, and both are declinable modules rather than inline blocks. DETACH /
 * WAKE_UP task creation lives in ./local-async and is reached only from
 * ./local-control, so this file stays DB-free.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { CallbackModeValue } from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";
import { RouteExecutionExecutor } from "./core";
import { ExecuteToolGuards } from "./guards";
import { LocalControl } from "./local-control";
import type { RouteExecuteContext } from "./types";

export class LocalExecution {
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

    const blocked = await ExecuteToolGuards.preflight({
      ctx,
      callbackMode: data.callbackMode,
      instanceId,
    });
    if (blocked) {
      return blocked;
    }

    toolExecutionContext.callerCallbackMode = callbackMode ?? undefined;

    // Subscribe BEFORE starting the execution so a signal delivered while the
    // target is running is not missed. Undefined for every headless caller.
    const controlCallId = toolExecutionContext.callerToolCallId;
    const perCallAbort = new AbortController();
    const control = await LocalControl.subscribe({
      controlCallId,
      user,
      logger,
    });

    const exectoolExecutionContext: ToolExecutionContext = {
      ...toolExecutionContext,
      abortSignal: LocalControl.deriveAbortSignal(
        toolExecutionContext,
        perCallAbort,
      ),
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

    // Race execution against a control signal. Returns a response to
    // short-circuit with (cancel / detach / wakeUp), or null to settle inline.
    const controlled = await LocalControl.settle({
      control,
      execPromise,
      perCallAbort,
      ctx,
      input,
      controlCallId,
    });
    if (controlled) {
      return controlled;
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
      // Validation detail is already baked into `message` by validateData.
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
