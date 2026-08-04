/**
 * ResultSignals — delivery of a remote tool's finished `tool-execute-result`
 * back to the DISPATCHING call, INLINE, cross-process and cross-instance.
 *
 * A thin wrapper over KeyedRemoteSignal (the single WS-hub + bridge primitive):
 *   - SUBSCRIBE (the dispatching WAIT/END_LOOP call) as it sends the request,
 *     keyed by callId; resolves when the result arrives.
 *   - DELIVER (handleToolResult, wherever it runs) publishes the finished result
 *     to the same per-callId channel.
 *
 * The event name + endpoint channel are the execute-tool definition's own
 * `tool-execute-result`; the primitive spans the process boundary (test harness
 * vs server) and, with a targetInstanceId, the instance boundary.
 */

import "server-only";

import type { WidgetData } from "../../core/utils/json";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import type { WsWireMessage } from "../../realtime/core/types";
import {
  KeyedRemoteSignal,
  type KeyedSignalSubscription,
} from "../../realtime/server/keyed-signal";
import executeDefinition from "../definition";

const RESULT_EVENT = "tool-execute-result" as const;

/**
 * The finished-result payload delivered to the dispatching call. `output`
 * mirrors PendingCallResult.output so the two waiter paths (in-process
 * PendingCalls, cross-process KeyedRemoteSignal) unify without conversion.
 */
export interface ToolExecuteResultSignal {
  status: "completed" | "failed";
  output: Record<string, WidgetData> | null;
  hint?: string;
}

/** Narrow a wire payload to a result signal for the given callId. */
function parseFor(
  callId: string,
): (
  payload: WsWireMessage["data"]["payload"],
) => ToolExecuteResultSignal | null {
  return (payload) => {
    if (
      payload === null ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return null;
    }
    const p = payload as {
      callId?: string;
      status?: "completed" | "failed";
      output?: Record<string, WidgetData> | null;
      hint?: string;
    };
    if (p.callId !== callId) {
      return null;
    }
    if (p.status !== "completed" && p.status !== "failed") {
      return null;
    }
    return { status: p.status, output: p.output ?? null, hint: p.hint };
  };
}

export class ResultSignals {
  /**
   * Subscribe to the result for a callId. Resolves when a `tool-execute-result`
   * for THIS callId arrives, regardless of which process/instance ran
   * handleToolResult. The caller races `signal` against the inline timeout.
   */
  static subscribe(
    callId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): KeyedSignalSubscription<ToolExecuteResultSignal> {
    return KeyedRemoteSignal.subscribe({
      ref: {
        endpoint: executeDefinition.POST,
        eventName: RESULT_EVENT,
        key: callId,
      },
      user,
      parse: parseFor(callId),
      logger,
    });
  }

  /**
   * Publish a finished tool result to the dispatching call's channel. Set
   * `targetInstanceId` to also relay to another instance's hub. Fire-and-forget.
   */
  static deliver(
    callId: string,
    signal: ToolExecuteResultSignal,
    user: JwtPayloadType,
    logger: EndpointLogger,
    targetInstanceId?: string,
  ): void {
    KeyedRemoteSignal.deliver({
      ref: {
        endpoint: executeDefinition.POST,
        eventName: RESULT_EVENT,
        key: callId,
      },
      payload: {
        callId,
        status: signal.status,
        output: signal.output,
        ...(signal.hint !== undefined ? { hint: signal.hint } : {}),
      },
      user,
      ...(targetInstanceId ? { targetInstanceId } : {}),
      logger,
    });
  }
}
