"use client";

/**
 * useWidgetEvents — Typed WebSocket event hook for widgets.
 *
 * Derives the channel from the widget's endpoint definition + URL path params,
 * and provides a typed `on()` function that only accepts event names
 * and payloads declared in the definition's `events` record.
 *
 * Usage in widget.tsx:
 * ```tsx
 * const { on, connected } = useWidgetEvents(definition.POST, { threadId: "abc" });
 *
 * useEffect(() => {
 *   return on("contentDelta", (data) => {
 *     // data is typed: { messageId: string; delta: string }
 *     appendContent(data.delta);
 *   });
 * }, [on]);
 * ```
 */

import { useMemo } from "react";

import { buildWsChannel } from "./channel";
import { useWebSocket } from "./client";
import type { EventSchemas, UseWidgetEventsReturn } from "./types";

/**
 * Minimal endpoint shape needed by this hook.
 * Avoids importing the full CreateApiEndpoint type (which is server-only heavy).
 */
interface EndpointWithEvents<
  TEvents extends EventSchemas | never = EventSchemas,
> {
  readonly path: readonly string[];
  readonly events?: TEvents;
}

/**
 * Context for building the WS channel. Mirrors React Query's queryKey pattern.
 * Pass URL path params to resolve `[param]` segments, and optional scope for
 * endpoints without path params.
 */
interface WidgetEventContext {
  /** URL path params to resolve bracket segments (e.g. { threadId: "abc" }) */
  urlPathParams?: Record<string, string>;
  /** Additional scope for endpoints without path params (e.g. threadId for ai-stream) */
  scope?: string;
}

/**
 * Typed WebSocket event hook for widgets.
 *
 * @param endpoint - The endpoint definition (must have `events` defined)
 * @param context - URL path params and/or scope for channel resolution
 * @returns Typed event subscription interface
 */
export function useWidgetEvents<TEvents extends EventSchemas | never>(
  endpoint: EndpointWithEvents<TEvents>,
  context: WidgetEventContext,
): UseWidgetEventsReturn<TEvents> {
  const { urlPathParams, scope } = context;

  const channel = useMemo(() => {
    if (!endpoint.events) {
      return null;
    }
    return buildWsChannel(endpoint.path, urlPathParams ?? {}, scope);
  }, [endpoint.path, endpoint.events, urlPathParams, scope]);

  const { on: rawOn, connected, lastEvent } = useWebSocket(channel);

  // rawOn is untyped (string event, generic handler).
  // We return it as the typed UseWidgetEventsReturn which narrows
  // event names and handler payloads via TEvents generics.
  // This is safe because the Zod schemas validate on the emit side.
  const typedReturn: UseWidgetEventsReturn<TEvents> = {
    on: rawOn as UseWidgetEventsReturn<TEvents>["on"],
    connected,
    lastEvent,
  };

  return typedReturn;
}
