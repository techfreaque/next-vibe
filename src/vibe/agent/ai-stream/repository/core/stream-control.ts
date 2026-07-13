/**
 * StreamControl — the `stream-control` signal for a running AI stream, keyed by
 * threadId. Cancellation reaches the stream in WHATEVER process/instance runs it.
 *
 * A thin wrapper over KeyedRemoteSignal (the one WS-hub + bridge primitive):
 *   - DELIVER (cancel endpoint): publishes a `stream-control` event to the
 *     thread's channel. Set `targetInstanceId` to reach a stream on another
 *     instance (a remote-folder loop).
 *   - SUBSCRIBE (the running stream): subscribes to the same channel and aborts
 *     its own controller when a signal for its threadId arrives.
 *
 * The primitive spans PROCESSES (proxy ↔ app) and, with a targetInstanceId,
 * INSTANCES — in local mode too, not only redis. Channel + event name are
 * DERIVED from the ai-stream POST definition. NO in-memory map, NO DB.
 */

import "server-only";

import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  KeyedRemoteSignal,
  type KeyedSignalSubscription,
} from "next-vibe/realtime/keyed-signal";
import type { WsWireMessage } from "next-vibe/realtime/types";

import streamDefinition from "../../stream/definition";

/** Extensible; only `cancel` today (add e.g. `pause` later if needed). */
export type StreamControlAction = "cancel";

const STREAM_CONTROL_EVENT = "stream-control" as const;

/** Narrow a wire payload to a stream-control action for the given threadId. */
function parseFor(
  threadId: string,
): (payload: WsWireMessage["data"]["payload"]) => StreamControlAction | null {
  return (payload) => {
    if (
      payload === null ||
      typeof payload !== "object" ||
      Array.isArray(payload)
    ) {
      return null;
    }
    const p = payload as { threadId?: string; action?: StreamControlAction };
    if (p.threadId === threadId && p.action === "cancel") {
      return "cancel";
    }
    return null;
  };
}

export class StreamControl {
  /**
   * Subscribe to the next control signal for a threadId. Resolves when a
   * `stream-control` event for THIS thread arrives (from whatever
   * process/instance emitted it). The running stream races `signal` against its
   * own lifetime; `cancel()` tears the subscription down when the stream ends.
   */
  static subscribe(
    threadId: string,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): KeyedSignalSubscription<StreamControlAction> {
    return KeyedRemoteSignal.subscribe({
      ref: {
        endpoint: streamDefinition.POST,
        eventName: STREAM_CONTROL_EVENT,
        key: threadId,
      },
      user,
      parse: parseFor(threadId),
      logger,
    });
  }

  /**
   * Emit a `stream-control` event to a thread's channel. Set `targetInstanceId`
   * to reach a stream running on another instance. Fire-and-forget: a thread not
   * being streamed anywhere simply has no reactor.
   */
  static deliver(
    threadId: string,
    action: StreamControlAction,
    user: JwtPayloadType,
    logger: EndpointLogger,
    targetInstanceId?: string,
  ): void {
    KeyedRemoteSignal.deliver({
      ref: {
        endpoint: streamDefinition.POST,
        eventName: STREAM_CONTROL_EVENT,
        key: threadId,
      },
      payload: { threadId, action },
      user,
      ...(targetInstanceId ? { targetInstanceId } : {}),
      logger,
    });
  }
}
