/**
 * In-process event observers.
 *
 * An observer sees every event this process emits, WITHOUT affecting how that
 * event is delivered. That separation is the whole point:
 *
 *   delivery  — where the event goes for real subscribers. In-process when the
 *               WS proxy shares this process, otherwise a loopback POST to it.
 *               Unchanged by anything here.
 *   observing — a passive local tap. Synchronous, zero network, zero transport.
 *
 * The CLI uses this to drive realtime rendering. It runs endpoints in-process
 * and needs to repaint as events fire, but it must not become the transport:
 *
 *   • No WS server anywhere (a standalone CLI install) — observers still fire,
 *     so realtime works with no server at all.
 *   • WS server running — it keeps receiving every event exactly as before, so
 *     browsers stay live while a CLI command runs.
 *
 * Registering an observer can never change delivery semantics, so it is safe to
 * add one around any execution.
 */

import type { AnyEndpointEventEnvelope } from "./structured-events";

export type EventObserver = (envelope: AnyEndpointEventEnvelope) => void;

const observers = new Set<EventObserver>();

/** Register an observer. Returns a disposer — always call it in a finally. */
export function addEventObserver(observer: EventObserver): () => void {
  observers.add(observer);
  return (): void => {
    observers.delete(observer);
  };
}

/** True when anything is listening — lets callers skip payload work if not. */
export function hasEventObservers(): boolean {
  return observers.size > 0;
}

/**
 * Notify every observer. Never throws: a broken observer must not take down the
 * emit path, which is a side effect of the request being served.
 */
export function notifyEventObservers(envelope: AnyEndpointEventEnvelope): void {
  if (observers.size === 0) {
    return;
  }
  for (const observer of observers) {
    try {
      observer(envelope);
    } catch {
      // Observation is best-effort; delivery has already happened or is about to.
    }
  }
}
