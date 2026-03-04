"use client";

/**
 * WebSocket Client Hook
 *
 * Low-level hook for connecting to the WebSocket server.
 * Handles connection, reconnection, and message dispatching.
 * Auth is handled via httpOnly cookies (sent automatically on same-origin).
 *
 * Most consumers should use `useWidgetEvents` instead, which adds
 * type safety from the endpoint definition.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import type { EventHandler, WsWireMessage } from "./types";

// ============================================================================
// CONNECTION MANAGER (singleton per channel)
// ============================================================================

/**
 * Internal wire handler — accepts wire-protocol data (WsWireMessage["data"]).
 * This is the widest Zod output type; consumers narrow it via generics.
 */
type WireHandler = EventHandler<WsWireMessage["data"]>;

interface ConnectionState {
  ws: WebSocket | null;
  /** Event-specific handlers: event name → Set of handlers receiving msg.data */
  listeners: Map<string, Set<WireHandler>>;
  /** Wildcard handlers: receive the full WsWireMessage for lastEvent tracking */
  wildcardListeners: Set<EventHandler<WsWireMessage>>;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  reconnectAttempts: number;
}

const connections = new Map<string, ConnectionState>();

function getOrCreateConnection(channel: string): ConnectionState {
  let state = connections.get(channel);
  if (state) {
    return state;
  }

  state = {
    ws: null,
    listeners: new Map(),
    wildcardListeners: new Set(),
    reconnectTimer: null,
    reconnectAttempts: 0,
  };
  connections.set(channel, state);

  connect(channel, state);
  return state;
}

function connect(channel: string, state: ConnectionState): void {
  if (state.ws?.readyState === WebSocket.OPEN) {
    return;
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const params = new URLSearchParams({ channel });
  // WS handler is on the same host/port as Next.js at path /ws
  // (Bun proxy intercepts the upgrade before forwarding to Next.js)
  const url = `${protocol}//${window.location.host}/ws?${params.toString()}`;

  const ws = new WebSocket(url);

  const handleOpen = (): void => {
    state.reconnectAttempts = 0;
  };

  const handleMessage = (event: MessageEvent): void => {
    try {
      const msg = JSON.parse(event.data as string) as WsWireMessage;
      if (msg.channel !== channel) {
        return;
      }

      const handlers = state.listeners.get(msg.event);
      if (handlers) {
        for (const handler of handlers) {
          handler(msg.data);
        }
      }

      // Notify wildcard listeners (for lastEvent tracking)
      for (const handler of state.wildcardListeners) {
        handler(msg);
      }
    } catch {
      // Invalid JSON — ignore
    }
  };

  const handleClose = (): void => {
    state.ws = null;
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, state.reconnectAttempts), 30000);
    state.reconnectAttempts++;
    state.reconnectTimer = setTimeout(() => {
      connect(channel, state);
    }, delay);
  };

  ws.addEventListener("open", handleOpen);
  ws.addEventListener("message", handleMessage);
  ws.addEventListener("close", handleClose);
  // onerror is followed by onclose, which triggers reconnect

  state.ws = ws;
}

function addListener(
  state: ConnectionState,
  event: string,
  handler: WireHandler,
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
  };
}

function addWildcardListener(
  state: ConnectionState,
  handler: EventHandler<WsWireMessage>,
): () => void {
  state.wildcardListeners.add(handler);

  return (): void => {
    state.wildcardListeners.delete(handler);
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
  const state = getOrCreateConnection(channel);
  // Caller's generic T narrows the wire data — safe since the WS protocol
  // guarantees the event name correlates with the correct payload shape.
  return addListener(state, event, handler as WireHandler);
}

/**
 * Pre-warm a WS channel so the connection is established before handlers
 * are added.  Call this just before starting a stream so the first WS
 * events are not delayed by connection setup.
 * Safe to call multiple times — returns existing connection if already open.
 */
export function preWarmChannel(channel: string): void {
  getOrCreateConnection(channel);
}

/**
 * Disconnect and remove a channel connection entirely.
 * Safe to call even if the channel doesn't exist.
 */
export function disconnectChannel(channel: string): void {
  const state = connections.get(channel);
  if (!state) {
    return;
  }
  if (state.reconnectTimer) {
    clearTimeout(state.reconnectTimer);
  }
  if (state.ws) {
    state.ws.close();
    state.ws = null;
  }
  state.listeners.clear();
  state.wildcardListeners.clear();
  connections.delete(channel);
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
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WsWireMessage | null>(null);
  const stateRef = useRef<ConnectionState | null>(null);

  useEffect(() => {
    if (!channel) {
      return;
    }

    const state = getOrCreateConnection(channel);
    stateRef.current = state;

    // Track connection state
    const checkConnection = setInterval(() => {
      setConnected(state.ws?.readyState === WebSocket.OPEN);
    }, 500);

    // Track last event via wildcard listener — receives full WsWireMessage
    const unsub = addWildcardListener(state, (msg: WsWireMessage) => {
      setLastEvent(msg);
    });

    return (): void => {
      clearInterval(checkConnection);
      unsub();
    };
  }, [channel]);

  const on = useCallback(
    (event: string, handler: WireHandler): (() => void) => {
      if (!stateRef.current) {
        // oxlint-disable-next-line no-empty-function
        return (): void => {
          /* noop */
        };
      }
      return addListener(stateRef.current, event, handler);
    },
    [],
  );

  return { on, connected, lastEvent };
}
