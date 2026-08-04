/**
 * Mid-execution control signals for an in-flight local call.
 *
 * A control TOOL can deliver cancel/detach/wakeUp while the target is still
 * running; this module owns the subscription, the per-call abort controller, the
 * race against the target's own promise, and the handoff to the async completer.
 * The actions MIRROR the callback modes:
 *   - cancel → interrupt: abort this call's per-call signal, return the error
 *              AS the tool result (turn + sibling calls continue).
 *   - detach → convert the still-running call to DETACH: it keeps running in
 *              the background, its result is discarded, the turn is unblocked.
 *   - wakeUp → convert the still-running call to WAKE_UP: it keeps running in
 *              the background and revives the thread with its result.
 * detach/wakeUp hand the in-flight execution to the async completion path and
 * return { taskId, hint } immediately — exactly as if it had been dispatched
 * that mode from the start. No registry/store: the waiter is transient.
 *
 * Split out of ./local because every one of those outcomes needs a layer the
 * inline path does not: the realtime ws channel to receive a signal, and the task
 * system to convert into. Control signals are only ever reachable when the caller
 * is an AI stream (callerToolCallId set) — headless callers (CLI, MCP, cron) never
 * set it — so on those surfaces this whole module is inert. A deployment without
 * a realtime channel or a task system declines it and runs ./local unchanged.
 *
 * BIND TIMING: the ./control-signals and ./local-async imports below are lazy ON
 * PURPOSE and must stay lazy, and must stay at these exact points. They are what
 * keeps the realtime dependency (and the task-system DB graph) out of the static
 * module graph of every headless caller. Hoisting either to a static import at
 * the top of this file re-introduces exactly the dependency the split removes.
 */

import "server-only";

import type { ToolExecutionContext } from "next-vibe/core/execution-context";

import type { ResponseType } from "../../core/route/response.schema";
import { ErrorResponseTypes, fail } from "../../core/route/response.schema";
import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { CallbackMode } from "../constants";
import type { RouteExecuteRequestOutput } from "../definition";
// Type-only: the implementation is loaded on demand (see subscribe below), so
// ./control-signals and its realtime dependency stay out of the headless graph.
import type { ControlAction } from "./control-signals";
import type { RouteExecuteContext } from "./types";

/** A live control subscription raced against the target's execution. */
interface ControlSubscription {
  signal: Promise<ControlAction>;
  cancel: () => void;
}

export class LocalControl {
  /**
   * Subscribe to control signals for this call, if the caller is an AI stream.
   *
   * Returns undefined for every headless caller, which is what keeps
   * ./control-signals off their static graph — the import below only ever
   * evaluates when a callerToolCallId is present.
   */
  static async subscribe(params: {
    controlCallId: string | undefined;
    user: JwtPayloadType;
    logger: EndpointLogger;
  }): Promise<ControlSubscription | undefined> {
    const { controlCallId, user, logger } = params;
    if (!controlCallId) {
      return undefined;
    }
    // Control signals ride the realtime ws channel and are only ever reachable
    // when the caller is an AI stream (callerToolCallId set). Headless callers —
    // CLI, MCP, cron — never set it, so keep ./control-signals (and with it the
    // realtime dependency) OUT of their static graph: load it on demand.
    return await import("./control-signals").then((m) =>
      m.ControlSignals.subscribe(controlCallId, user, logger),
    );
  }

  /**
   * Derive the signal the target handler runs under.
   *
   * Fires on EITHER the stream abort OR this call's per-call abort (a cancel
   * signal), so aborting one call leaves the turn and sibling calls untouched.
   * For detach/wakeUp the execution must SURVIVE the turn ending, so those paths
   * swap in a fresh, stream-independent signal (the goroutine handoff).
   */
  static deriveAbortSignal(
    toolExecutionContext: ToolExecutionContext,
    perCallAbort: AbortController,
  ): AbortSignal {
    return AbortSignal.any([
      toolExecutionContext.abortSignal,
      perCallAbort.signal,
    ]);
  }

  /**
   * Race the target's execution against a control signal and act on the winner.
   *
   * Returns a response to short-circuit with, or null to let ./local await
   * execPromise and return the result inline (which is also what happens when
   * the execution simply wins the race).
   */
  static async settle(params: {
    control: ControlSubscription | undefined;
    execPromise: Promise<ResponseType<WidgetData>>;
    perCallAbort: AbortController;
    ctx: RouteExecuteContext;
    input: RouteExecuteRequestOutput["input"];
    controlCallId: string | undefined;
  }): Promise<ResponseType<WidgetData> | null> {
    const { control, execPromise, perCallAbort, ctx, input, controlCallId } =
      params;
    const { toolName, logger, t } = ctx;

    if (!control) {
      return null;
    }

    const raced = await Promise.race([
      execPromise.then(() => ({ action: null }) as const),
      control.signal.then((action) => {
        if (action === "cancel") {
          perCallAbort.abort(new Error("tool_cancelled"));
        }
        return { action } as const;
      }),
    ]);
    const controlAction: ControlAction | undefined = raced.action ?? undefined;
    control.cancel();

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
    if (controlAction === "detach" || controlAction === "wakeUp") {
      const { LocalExecutionAsync } = await import("./local-async");
      return await LocalExecutionAsync.convertInFlightToAsync({
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

    return null;
  }
}
