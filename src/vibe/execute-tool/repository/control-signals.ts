/**
 * ControlSignals — the mid-execution control signal (`cancel` / `detach` /
 * `wakeUp`) for a single in-flight tool call, keyed by callId.
 *
 * A thin wrapper over KeyedRemoteSignal (the one WS-hub + bridge primitive):
 *   - SUBSCRIBE IN THE TOOL CALL — the running WAIT execution subscribes to the
 *     execute-tool definition's `tool-control` channel for its callId and reacts.
 *   - DELIVER VIA THE TOOLS — the call-control tools publish a `tool-control`
 *     event to that per-callId channel.
 *
 * The primitive spans PROCESSES (proxy ↔ app, out-of-server callers) and, with a
 * targetInstanceId, INSTANCES — so a call running on another instance (a
 * remote-folder loop) is reachable with no bespoke forwarding, in local mode
 * too. Actions MIRROR the callback modes; the running WAIT call converts itself.
 */

import "server-only";

import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import {
  KeyedRemoteSignal,
  type KeyedSignalSubscription,
} from "../../realtime/server/keyed-signal";
import type { WsWireMessage } from "../../realtime/core/types";

import executeDefinition from "../definition";

export type ControlAction = "cancel" | "detach" | "wakeUp";

const CONTROL_EVENT = "tool-control" as const;

/** Narrow a wire payload to a control action for the given callId. */
function parseFor(
  callId: string,
): (payload: WsWireMessage["data"]["payload"]) => ControlAction | null {
  return (payload) => {
    if (
      payload === null ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return null;
    }
    const p = payload as { callId?: string; action?: ControlAction };
    if (p.callId !== callId) {
      return null;
    }
    if (
      p.action === "cancel" ||
      p.action === "detach" ||
      p.action === "wakeUp"
    ) {
      return p.action;
    }
    return null;
  };
}

export class ControlSignals {
  /**
   * Subscribe to the next control signal for a callId. Resolves when a
   * `tool-control` event for THIS callId arrives (from whatever process/instance
   * emitted it). The caller races the promise against execution.
   */
  static subscribe(
    callId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): KeyedSignalSubscription<ControlAction> {
    return KeyedRemoteSignal.subscribe({
      ref: {
        endpoint: executeDefinition.POST,
        eventName: CONTROL_EVENT,
        key: callId,
      },
      user,
      parse: parseFor(callId),
      logger,
    });
  }

  /**
   * Emit a control signal to a call's channel. Set `targetInstanceId` to reach a
   * call running on another instance. The running tool's subscription reacts.
   * Fire-and-forget.
   */
  static deliver(
    callId: string,
    action: ControlAction,
    user: JwtPayloadType,
    logger: EndpointLogger,
    targetInstanceId?: string,
  ): void {
    KeyedRemoteSignal.deliver({
      ref: {
        endpoint: executeDefinition.POST,
        eventName: CONTROL_EVENT,
        key: callId,
      },
      payload: { callId, action },
      user,
      ...(targetInstanceId ? { targetInstanceId } : {}),
      logger,
    });
  }
}
