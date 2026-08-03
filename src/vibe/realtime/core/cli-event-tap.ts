/**
 * In-process endpoint event tap for the CLI.
 *
 * The CLI executes endpoints IN-PROCESS (RouteExecuteRepository.runInProcess) and
 * never opens a WebSocket, so the browser subscription path does not apply. This
 * module instead registers a passive OBSERVER (see event-observers.ts): every
 * event the repository emits is handed to us synchronously, merged into an
 * accumulator with the same cache-merger the web client uses, and pushed to a
 * subscriber that repaints the terminal frame.
 *
 * Observing is deliberately not delivery. That gives both properties we need:
 *
 *   • No WS server at all (standalone CLI install) — realtime still works, with
 *     zero transport and zero network.
 *   • WS server running — it keeps receiving every event unchanged, so browsers
 *     stay live while a CLI command runs. The tap never intercepts.
 *
 * Result: `events: {...}` on a definition drives realtime on the CLI with no
 * sockets and no endpoint-specific plumbing.
 */

import "server-only";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { WidgetData } from "../../core/utils/json";
import type { EndpointLogger } from "../../logger/types";
import { applyPartialToCache } from "../../unified-ui/hooks/cache-merger";

import { addEventObserver } from "./event-observers";
import type { AnyEndpointEventEnvelope } from "./structured-events";

export interface CliEventTap {
  /** Register the repaint callback. Fires on every accepted event. */
  onUpdate: (cb: (data: WidgetData) => void) => void;
  /** The accumulated partial response so far. */
  current: () => WidgetData;
  /** Restore the previous broadcast target. Always call in a finally block. */
  stop: () => void;
}

/**
 * True when the endpoint declares at least one event — i.e. it can drive a live
 * frame. Cheap enough to call on every CLI execution.
 */
export function endpointHasEvents(endpoint: CreateApiEndpointAny): boolean {
  const events = endpoint.events;
  return (
    events !== undefined && events !== null && Object.keys(events).length > 0
  );
}

/**
 * Read the declared merge operation for an event. Mirrors the web subscription's
 * behaviour: anything that is not an explicit append/remove is a structural merge.
 * `append` is deliberately NOT supported here — appendDeltaToCache is hardcoded to
 * the chat `{messages:[{content}]}` shape and is meaningless for other endpoints.
 */
function insertMissingForEvent(
  endpoint: CreateApiEndpointAny,
  eventName: string,
): boolean {
  const declaration = endpoint.events?.[eventName];
  return declaration?.operation === "upsert";
}

/**
 * Start tapping in-process events for one endpoint execution.
 *
 * Events are accepted by matching the envelope's endpointPath/endpointMethod
 * rather than by rebuilding the channel string. A CLI process runs exactly one
 * endpoint, and channel keys depend on `includeInCacheKey` request fields — so
 * path matching is both sufficient and immune to a key-derivation mismatch
 * silently swallowing every event.
 */
export function startCliEventTap({
  endpoint,
  logger,
  initialData,
}: {
  endpoint: CreateApiEndpointAny;
  logger: EndpointLogger;
  initialData?: WidgetData;
}): CliEventTap {
  const endpointPathKey = endpoint.path.join("/");
  const endpointMethod = endpoint.method;

  let accumulated: WidgetData = initialData ?? {};
  let subscriber: ((data: WidgetData) => void) | null = null;

  function accept(envelope: AnyEndpointEventEnvelope): void {
    if (
      envelope.endpointPath.join("/") !== endpointPathKey ||
      envelope.endpointMethod !== endpointMethod
    ) {
      // Another endpoint emitted during this execution (nested call). Not ours.
      return;
    }
    const partial: WidgetData = envelope.responseData ?? envelope.payload;
    if (partial === undefined || partial === null) {
      return;
    }
    accumulated = applyPartialToCache(
      accumulated,
      partial,
      insertMissingForEvent(endpoint, envelope.eventName),
    );
    subscriber?.(accumulated);
  }

  const dispose = addEventObserver(accept);
  logger.debug(`[CliEventTap] tapping ${endpointPathKey} ${endpointMethod}`);

  return {
    onUpdate: (cb): void => {
      subscriber = cb;
    },
    current: (): WidgetData => accumulated,
    stop: (): void => {
      subscriber = null;
      dispose();
    },
  };
}
