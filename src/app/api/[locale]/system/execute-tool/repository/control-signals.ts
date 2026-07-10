/**
 * ControlSignals — the DEFINITION-DRIVEN server↔server (cross-PROCESS, same-
 * instance) `tool-control` signal for a single in-flight tool call.
 *
 * The `tool-control` event is declared on the execute-tool definition. Both sides
 * ride that definition:
 *   - EMIT VIA THE TOOLS — the call-control tools call ControlSignals.deliver,
 *     which emits through createEndpointEmitter(executeDefinition.POST) — the
 *     channel + envelope are derived from the definition, never hand-rolled.
 *   - SUBSCRIBE IN THE TOOL CALL — the running WAIT execution subscribes to the
 *     SAME definition-derived channel on the pub/sub bus and reacts.
 *
 * The pub/sub bus crosses PROCESSES (proxy ↔ app) in a cluster / redis mode —
 * which is the split here. NOT cross-INSTANCE (that is remoteEvent). NO in-memory
 * map, NO DB. execute-tool has no per-call channel key, so all in-flight calls
 * share the endpoint channel and each subscriber filters by its own callId.
 *
 * Actions MIRROR the callback modes — the running WAIT call converts itself:
 *   - `cancel` INTERRUPTS: abort the call, return the error as its result.
 *   - `detach` (= CallbackMode.DETACH): keep running, discard result, unblock now.
 *   - `wakeUp` (= CallbackMode.WAKE_UP): keep running, revive with the result.
 */

import "server-only";

import type { EndpointLogger } from "next-vibe/logger/types";
import { buildWsChannel } from "next-vibe/realtime/channel";
import { getPubSubAdapter } from "next-vibe/realtime/pubsub/index";
import type { AnyEndpointEventEnvelope } from "next-vibe/realtime/structured-events";

import executeDefinition from "../definition";

export type ControlAction = "cancel" | "detach" | "wakeUp";

/** The event name declared on the execute-tool definition (single source). */
const CONTROL_EVENT = "tool-control" as const;

/**
 * The channel a call's control signals ride on: the execute-tool definition's own
 * ws channel (so the namespace is the endpoint's, DERIVED from the definition —
 * not a magic string) suffixed by the event name + callId, so each in-flight call
 * has its OWN channel. Per-call isolation matters because the pub/sub adapter
 * holds one handler per channel — parallel calls must not share.
 */
function controlChannel(callId: string, logger: EndpointLogger): string {
  const base = buildWsChannel(
    executeDefinition.POST,
    {} as never,
    {} as never,
    logger,
  );
  return `${base}/${CONTROL_EVENT}/${callId}`;
}

/** Build the definition-sourced envelope (path/method/eventName from the def). */
function controlEnvelope(
  callId: string,
  action: ControlAction,
  channel: string,
): AnyEndpointEventEnvelope {
  return {
    endpointPath: executeDefinition.POST.path,
    endpointMethod: executeDefinition.POST.method,
    eventName: CONTROL_EVENT,
    responseData: {},
    requestData: {},
    urlPathParams: {},
    payload: { callId, action },
    channel,
  };
}

/** Read + validate {callId, action} off a control envelope's payload. */
function controlFromEnvelope(
  data: AnyEndpointEventEnvelope,
): { callId: string; action: ControlAction } | null {
  const payload = data.payload;
  if (
    payload === null ||
    typeof payload !== "object" ||
    Array.isArray(payload)
  ) {
    return null;
  }
  const { callId, action } = payload as {
    callId?: string;
    action?: ControlAction;
  };
  if (
    typeof callId === "string" &&
    (action === "cancel" || action === "detach" || action === "wakeUp")
  ) {
    return { callId, action };
  }
  return null;
}

export class ControlSignals {
  /**
   * Subscribe to the next control signal for a callId. Subscribes to the
   * execute-tool definition's channel on the pub/sub bus and resolves when a
   * `tool-control` event for THIS callId arrives. cancel() unsubscribes when the
   * tool finishes on its own. The caller races the promise against execution.
   */
  static subscribe(
    callId: string,
    logger: EndpointLogger,
  ): {
    signal: Promise<ControlAction>;
    cancel: () => void;
  } {
    const channel = controlChannel(callId, logger);
    const adapter = getPubSubAdapter();
    let settled = false;
    const signal = new Promise<ControlAction>((resolve) => {
      adapter.subscribe(channel, (event, data) => {
        if (settled || event !== CONTROL_EVENT) {
          return;
        }
        const control = controlFromEnvelope(data);
        if (control && control.callId === callId) {
          settled = true;
          adapter.unsubscribe(channel);
          resolve(control.action);
        }
      });
    });
    const cancel = (): void => {
      if (!settled) {
        settled = true;
        adapter.unsubscribe(channel);
      }
    };
    return { signal, cancel };
  }

  /**
   * Emit the `tool-control` event to a call's control channel. Channel + envelope
   * are DERIVED from the execute-tool definition (its ws channel + declared event
   * name/payload); a per-callId suffix isolates parallel calls, which is why this
   * publishes to the bus directly rather than via createEndpointEmitter (whose
   * channel is fixed per endpoint and cannot be keyed by callId). The running
   * tool's subscription (in whatever process it runs) reacts. Fire-and-forget.
   */
  static deliver(
    callId: string,
    action: ControlAction,
    logger: EndpointLogger,
  ): void {
    const channel = controlChannel(callId, logger);
    getPubSubAdapter().publish(
      channel,
      CONTROL_EVENT,
      controlEnvelope(callId, action, channel),
    );
  }
}
