"use client";

/**
 * WebSocket Client Hook
 *
 * One WebSocket per browser tab. All channel subscriptions are virtual:
 * the client sends {type:"subscribe", channel} / {type:"unsubscribe", channel}
 * messages to the server, which filters broadcasts accordingly.
 *
 * Auth is handled via httpOnly cookies (sent automatically on same-origin).
 *
 * Most consumers should use `useWidgetEvents` instead, which adds
 * type safety from the endpoint definition.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  EventHandler,
  WsClientMessage,
  WsWireFrame,
  WsWireMessage,
} from "./types";

// ============================================================================
// CONNECTION MANAGER (single shared connection, virtual channel routing)
// ============================================================================

/**
 * Internal wire handler - accepts wire-protocol data (WsWireMessage["data"]).
 * This is the widest Zod output type; consumers narrow it via generics.
 */
type WireHandler = EventHandler<WsWireMessage["data"]>;

/**
 * Per-channel subscription state.
 * The physical WS connection is shared; this tracks virtual subscriptions.
 */
interface ChannelState {
  /** Event-specific handlers: event name → Set of handlers receiving msg.data */
  listeners: Map<string, Set<WireHandler>>;
  /** Wildcard handlers: receive the full WsWireMessage for lastEvent tracking */
  wildcardListeners: Set<EventHandler<WsWireMessage>>;
}

// Shared connection state
let sharedWs: WebSocket | null = null;
let reconnectAttempts = 0;

// Connection state listeners - notified immediately on open/close
const connectionListeners = new Set<(connected: boolean) => void>();

function notifyConnectionState(connected: boolean): void {
  for (const listener of connectionListeners) {
    listener(connected);
  }
}

// Virtual channel subscriptions: channel → ChannelState
const channels = new Map<string, ChannelState>();

function sendToServer(msg: WsClientMessage): void {
  if (sharedWs?.readyState === WebSocket.OPEN) {
    sharedWs.send(JSON.stringify(msg));
  }
}

function connect(): void {
  if (
    sharedWs?.readyState === WebSocket.OPEN ||
    sharedWs?.readyState === WebSocket.CONNECTING
  ) {
    return;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const url = `${protocol}//${window.location.host}/ws`;

  const ws = new WebSocket(url);
  sharedWs = ws;

  const handleOpen = (): void => {
    reconnectAttempts = 0;
    notifyConnectionState(true);
    // Re-subscribe to all active channels after reconnect
    for (const channel of channels.keys()) {
      sendToServer({ type: "subscribe", channel });
    }
  };

  function dispatch(msg: WsWireMessage): void {
    const channelState = channels.get(msg.channel);
    if (!channelState) {
      return;
    }

    const handlers = channelState.listeners.get(msg.event);
    if (handlers) {
      for (const handler of handlers) {
        handler(msg.data);
      }
    }

    // Notify wildcard listeners (for lastEvent tracking)
    for (const handler of channelState.wildcardListeners) {
      handler(msg);
    }
  }

  const handleMessage = (event: MessageEvent): void => {
    try {
      const frame = JSON.parse(event.data as string) as WsWireFrame;
      if ("type" in frame && frame.type === "batch") {
        for (const msg of frame.events) {
          dispatch(msg);
        }
      } else {
        dispatch(frame as WsWireMessage);
      }
    } catch {
      // Invalid JSON - ignore
    }
  };

  const handleClose = (): void => {
    sharedWs = null;
    notifyConnectionState(false);
    if (channels.size === 0) {
      return;
    }
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectAttempts++;
    setTimeout(() => {
      connect();
    }, delay);
  };

  ws.addEventListener("open", handleOpen);
  ws.addEventListener("message", handleMessage);
  ws.addEventListener("close", handleClose);
  // onerror is followed by onclose, which triggers reconnect
}

function ensureConnected(): void {
  if (
    !sharedWs ||
    sharedWs.readyState === WebSocket.CLOSED ||
    sharedWs.readyState === WebSocket.CLOSING
  ) {
    connect();
  }
}

function getOrCreateChannel(channel: string): ChannelState {
  let state = channels.get(channel);
  if (state) {
    return state;
  }

  state = {
    listeners: new Map(),
    wildcardListeners: new Set(),
  };
  channels.set(channel, state);

  ensureConnected();
  sendToServer({ type: "subscribe", channel });
  return state;
}

function removeChannelIfEmpty(channel: string): void {
  const state = channels.get(channel);
  if (!state) {
    return;
  }
  if (state.listeners.size === 0 && state.wildcardListeners.size === 0) {
    channels.delete(channel);
    sendToServer({ type: "unsubscribe", channel });
  }
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
    removeChannelIfEmpty(channel);
  };
}

function addWildcardListener(
  state: ChannelState,
  handler: EventHandler<WsWireMessage>,
  channel: string,
): () => void {
  state.wildcardListeners.add(handler);

  return (): void => {
    state.wildcardListeners.delete(handler);
    removeChannelIfEmpty(channel);
  };
}

// ============================================================================
// IMPERATIVE API (for non-React code like startStream callbacks)
// ============================================================================

/**
 * Subscribe to a WS channel imperatively (outside React lifecycle).
 * Returns an unsubscribe function that cleans up the listener.
 */
export function subscribeToChannel<T extends WsWireMessage["data"]>(
  channel: string,
  event: string,
  handler: EventHandler<T>,
): () => void {
  const state = getOrCreateChannel(channel);
  // Caller's generic T narrows the wire data - safe since the WS protocol
  // guarantees the event name correlates with the correct payload shape.
  return addListener(state, event, handler as WireHandler, channel);
}

/**
 * Pre-warm a WS channel so the connection is established before handlers
 * are added.  Call this just before starting a stream so the first WS
 * events are not delayed by connection setup.
 * Safe to call multiple times - returns existing connection if already open.
 */
export function preWarmChannel(channel: string): void {
  getOrCreateChannel(channel);
}

/**
 * Unsubscribe from a channel and remove all its local listeners.
 * The shared WS connection is kept open for other channels.
 * Safe to call even if the channel doesn't exist.
 */
export function disconnectChannel(channel: string): void {
  const state = channels.get(channel);
  if (!state) {
    return;
  }
  state.listeners.clear();
  state.wildcardListeners.clear();
  channels.delete(channel);
  sendToServer({ type: "unsubscribe", channel });
}

// ============================================================================
// REACT HOOK
// ============================================================================

export interface UseWebSocketReturn {
  /** Subscribe to events on this channel */
  on: (event: string, handler: WireHandler) => () => void;
  /** Whether the WebSocket is currently connected */
  connected: boolean;
  /** Last event received on this channel */
  lastEvent: WsWireMessage | null;
}

/**
 * Low-level WebSocket hook. Connects to a channel and provides event subscription.
 * Auth is handled automatically via httpOnly cookies on same-origin connections.
 *
 * @param channel - Channel to subscribe to (e.g. "agent/chat/threads/{threadId}/messages")
 */
export function useWebSocket(channel: string | null): UseWebSocketReturn {
  const [connected, setConnected] = useState(
    () => sharedWs?.readyState === WebSocket.OPEN,
  );
  const [lastEvent, setLastEvent] = useState<WsWireMessage | null>(null);
  const channelRef = useRef<string | null>(null);

  useEffect(() => {
    if (!channel) {
      return;
    }

    channelRef.current = channel;
    const state = getOrCreateChannel(channel);

    // Sync initial state (connection may already be open before mount)
    setConnected(sharedWs?.readyState === WebSocket.OPEN);

    // Track connection state via event-driven listeners (no polling)
    connectionListeners.add(setConnected);

    // Track last event via wildcard listener - receives full WsWireMessage
    const unsub = addWildcardListener(
      state,
      (msg: WsWireMessage) => {
        setLastEvent(msg);
      },
      channel,
    );

    return (): void => {
      connectionListeners.delete(setConnected);
      unsub();
    };
  }, [channel]);

  const on = useCallback(
    (event: string, handler: WireHandler): (() => void) => {
      const ch = channelRef.current;
      if (!ch) {
        // oxlint-disable-next-line no-empty-function
        return (): void => {
          /* noop */
        };
      }
      const state = getOrCreateChannel(ch);
      return addListener(state, event, handler, ch);
    },
    [],
  );

  return { on, connected, lastEvent };
}
