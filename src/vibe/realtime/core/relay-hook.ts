/**
 * Cross-instance relay registration hook.
 *
 * The emitter must be able to hand a `remoteEvent: true` emit to the remote-event
 * bridge WITHOUT importing it. Two reasons, both real:
 *
 *   1. The bridge imports `next-vibe/database`. On a CLI/MCP install with no DB
 *      that module is absent, so reaching it from the emitter turned a single
 *      `remoteEvent` declaration into an unhandled rejection — the emitter used a
 *      `void import(...).then(...)` with no `.catch`, which takes the process down.
 *      With registration, an install that never loads the bridge simply has no
 *      relay: `pushRemote` is a no-op and the emit reports `relayed: false`.
 *   2. It removes a genuine cycle (emitter → bridge/repository → emitter) that the
 *      dynamic import was only hiding from the module graph, not resolving.
 *
 * Same shape as `local-broadcast.ts`: the owner of the capability registers itself
 * at module init, core calls through the registration if it exists.
 */

import type { EndpointLogger } from "../../logger/types";
import type { ResolvedRelayContext } from "./relay-context";
import type { AnyEndpointEventEnvelope } from "./structured-events";
import type { SyncDomain } from "./sync-domain";

/**
 * Generic remote-event relay payload. One relay shape for every cross-instance
 * remote event. Identifies the target route + event and carries that event's own
 * envelope (all 4 fields together): endpointPath, endpointMethod, eventName,
 * urlPathParams, responseData, requestData, and payload — no duplication.
 *
 * Defined here rather than in the bridge because it IS the hook's contract: core
 * builds it, the bridge consumes it, and neither may import the other.
 */
export interface RemoteEventRelayPayload<TPayload = AnyEndpointEventEnvelope> {
  userId: string;
  logger: EndpointLogger;
  syncDomain?: SyncDomain;
  envelope: TPayload;
  /**
   * Point-to-point delivery: relay ONLY over the connection to this instance.
   * Broadcast semantics (thread mirroring etc.) leave it unset. Tool dispatch
   * (tool-execute-request/result) MUST set it — an account with several peers
   * would otherwise double-execute requests and leak results across peers.
   */
  targetInstanceId?: string;
  /**
   * Pre-resolved relay context for this session (originInstanceId + connections).
   * When provided, pushRemoteEvent skips both per-event DB queries entirely.
   * Resolve once at session/stream start via resolveRemoteEventContext().
   */
  resolvedRelayContext?: ResolvedRelayContext;
}

/** What a registered relay does with a payload. Fire-and-forget by contract. */
type RemoteRelay = (payload: RemoteEventRelayPayload) => void;

let registered: RemoteRelay | null = null;

/**
 * Called by the remote-event bridge at module init. Only the bridge registers;
 * a process that never imports it keeps relaying disabled.
 */
export function registerRemoteRelay(relay: RemoteRelay): void {
  registered = relay;
}

/** Clear the registration (test teardown). */
export function clearRemoteRelay(): void {
  registered = null;
}

/** True when a bridge is available to relay cross-instance events. */
export function hasRemoteRelay(): boolean {
  return registered !== null;
}

/**
 * Hand a remote event to the registered bridge. A no-op when nothing registered —
 * an install without a DB has no peers to relay to, so dropping is correct.
 */
export function pushRemote(payload: RemoteEventRelayPayload): void {
  registered?.(payload);
}
