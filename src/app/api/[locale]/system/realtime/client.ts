"use client";

/**
 * WebSocket Client — single shared browser connection + imperative subscribe API.
 *
 * One WebSocket per browser tab. All channel subscriptions are virtual: the
 * client sends `{type:"subscribe", channel, locale, descriptor?}` /
 * `{type:"unsubscribe", channel}`; the server filters broadcasts accordingly. For
 * endpoint (ws-*) channels the structured `descriptor` lets the server rebuild
 * and authorize the canonical channel (it never trusts the raw channel string).
 *
 * Auth is handled via httpOnly cookies (sent automatically on same-origin).
 *
 * Consumers use `useEndpointSubscription`, which derives the channel + descriptor
 * from the endpoint definition and applies events to the React Query cache. This
 * module is the transport beneath it: `subscribeToChannel` registers a handler,
 * `preWarmChannel` opens the socket early (e.g. just before a stream POST).
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { EndpointLogger } from "next-vibe/logger/types";
import { getCurrentHost, getCurrentProtocol } from "next-vibe/ui/lib/location";

import type {
  EventHandler,
  WsChannelDescriptor,
  WsClientMessage,
  WsWireMessage,
} from "./types";
import { parseWsFrame } from "./types";

/**
 * Internal wire handler — accepts wire-protocol data (WsWireMessage["data"]).
 * This is the widest Zod output type; consumers narrow it via generics.
 */
type WireHandler = EventHandler<WsWireMessage["data"]>;

/**
 * Per-channel subscription state. The physical WS connection is shared; this
 * tracks the virtual subscriptions multiplexed over it.
 */
interface ChannelState {
  /** Handlers per event name (always "__event__" for endpoint channels). */
  listeners: Map<string, Set<WireHandler>>;
  /** Locale used when subscribing — sent to the server for authorization. */
  locale: CountryLanguage;
  /**
   * Structured descriptor for endpoint (ws-*) channels. The server rebuilds and
   * authorizes the channel from this; absent for user/ and system/ channels.
   * Stored so reconnect re-sends it with the subscription.
   */
  descriptor?: WsChannelDescriptor;
}

// Shared connection state
let sharedWs: WebSocket | null = null;
let reconnectAttempts = 0;

// Virtual channel subscriptions: channel → ChannelState
const channels = new Map<string, ChannelState>();

function sendToServer(msg: WsClientMessage): void {
  if (sharedWs?.readyState === WebSocket.OPEN) {
    sharedWs.send(JSON.stringify(msg));
  }
}

// The connection is shared across channels, but a logger is REQUIRED to open it.
// It is threaded from the subscribe/preWarm caller's EndpointLogger and captured
// in the socket's handlers (and the reconnect closure) so connection-level events
// like frame-parse failures always have a logger — never optional, never global.
function connect(logger: EndpointLogger): void {
  if (
    sharedWs?.readyState === WebSocket.OPEN ||
    sharedWs?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  if (typeof WebSocket === "undefined") {
    return;
  }

  const protocol = getCurrentProtocol() === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${getCurrentHost()}/ws`;

  const ws = new WebSocket(url);
  sharedWs = ws;

  const handleOpen = (): void => {
    reconnectAttempts = 0;
    // Re-subscribe to all active channels after reconnect.
    for (const [channel, state] of channels.entries()) {
      sendToServer({
        type: "subscribe",
        channel,
        locale: state.locale,
        descriptor: state.descriptor,
      });
    }
  };

  function dispatch(msg: WsWireMessage): void {
    const handlers = channels.get(msg.channel)?.listeners.get(msg.event);
    if (handlers) {
      for (const handler of handlers) {
        handler(msg.data);
      }
    }
  }

  const handleMessage = (event: MessageEvent): void => {
    if (typeof event.data !== "string") {
      logger.error("[WS Client] Ignored non-string frame");
      return;
    }
    const frame = parseWsFrame(event.data);
    if (!frame) {
      logger.error("[WS Client] Failed to parse message", {
        dataPreview: event.data.slice(0, 500),
      });
      return;
    }
    if ("type" in frame) {
      for (const msg of frame.events) {
        dispatch(msg);
      }
    } else {
      dispatch(frame);
    }
  };

  const handleClose = (): void => {
    sharedWs = null;
    if (channels.size === 0) {
      return;
    }
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectAttempts++;
    setTimeout(() => {
      connect(logger);
    }, delay);
  };

  ws.addEventListener("open", handleOpen);
  ws.addEventListener("message", handleMessage);
  ws.addEventListener("close", handleClose);
  // onerror is followed by onclose, which triggers reconnect.
}

function ensureConnected(logger: EndpointLogger): void {
  if (
    !sharedWs ||
    sharedWs.readyState === WebSocket.CLOSED ||
    sharedWs.readyState === WebSocket.CLOSING
  ) {
    connect(logger);
  }
}

function getOrCreateChannel(
  channel: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
): ChannelState {
  const existing = channels.get(channel);
  if (existing) {
    // Backfill the descriptor if a later subscriber supplies one (e.g. a
    // preWarm without descriptor followed by the real endpoint subscription).
    if (descriptor && !existing.descriptor) {
      existing.descriptor = descriptor;
    }
    return existing;
  }

  const state: ChannelState = { listeners: new Map(), locale, descriptor };
  channels.set(channel, state);

  ensureConnected(logger);
  sendToServer({ type: "subscribe", channel, locale, descriptor });
  return state;
}

function addListener(
  state: ChannelState,
  event: string,
  handler: WireHandler,
  channel: string,
): () => void {
  let handlers = state.listeners.get(event);
  if (!handlers) {
    handlers = new Set();
    state.listeners.set(event, handlers);
  }
  handlers.add(handler);

  return (): void => {
    handlers.delete(handler);
    if (handlers.size === 0) {
      state.listeners.delete(event);
    }
    if (state.listeners.size === 0) {
      channels.delete(channel);
      sendToServer({ type: "unsubscribe", channel });
    }
  };
}

/**
 * Subscribe to a WS channel. Returns an unsubscribe function that removes the
 * handler and, when the channel has no handlers left, unsubscribes server-side.
 * The caller's generic `T` is the inferred event payload from the endpoint
 * definition; it threads through unconstrained so the handler is fully typed.
 */
export function subscribeToChannel<T = WsWireMessage["data"]>(
  channel: string,
  event: string,
  handler: EventHandler<T>,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
): () => void {
  const state = getOrCreateChannel(channel, locale, logger, descriptor);
  return addListener(state, event, handler as WireHandler, channel);
}

/**
 * Pre-warm a WS channel so the socket is established (and the subscription sent)
 * before handlers are added — e.g. just before a stream POST so the first events
 * are not delayed by connection setup. Idempotent.
 */
export function preWarmChannel(
  channel: string,
  locale: CountryLanguage,
  logger: EndpointLogger,
  descriptor?: WsChannelDescriptor,
): void {
  getOrCreateChannel(channel, locale, logger, descriptor);
}
