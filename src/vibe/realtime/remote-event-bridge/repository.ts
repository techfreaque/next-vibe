/**
 * Remote Event Bridge — the one framework every cross-instance remote event uses.
 *
 * A remote event has exactly two delivery legs, chosen per remoteConnection:
 *   - direct-http: relay the event to the peer's bridge endpoint via the single
 *     canonical remote-call path, runInProcessTyped({ instanceId }).
 *   - reverse-ws:  publish the `remote-event` frame on our local hub; the peer's
 *     persistent connector (opened only when the peer is NOT directly reachable
 *     over http) delivers it. This hub publish is the leg runInProcessTyped
 *     itself resolves to — it is the irreducible base primitive.
 *
 * The receiving side dispatches the relayed envelope to the target route's
 * onRemoteEvent. The route is the runner; the payload is the target event's own
 * definition fields. No per-domain branching: cache invalidation, chat stream
 * relay, and domain sync are all remoteEvents on their own endpoints, dispatched
 * the same way. Echo prevention is the one universal rule.
 *
 * Everything above this (execute-tool, sync, …) is a regular endpoint that just
 * relays its events through here — it never hand-rolls a transport.
 */

import "server-only";

import { and, eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";

import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";

import type {
  RemoteEventRelayPayload,
  RemoteEventWirePayload,
} from "../emitter";
import { createEndpointEmitter } from "../emitter";
import type { AnyEndpointEventEnvelope } from "../structured-events";
import type {
  RemoteEventBridgeRequestOutput,
  RemoteEventBridgeResponseOutput,
} from "./definition";
import { dispatchRemoteEvent } from "./registry";
import type { ResolvedRelayContext } from "./relay-context";

/**
 * The generic remote-event wire payload. The envelope carries all 4 event fields
 * (responseData, requestData, urlPathParams, payload) plus routing metadata
 * (endpointPath, endpointMethod, eventName). No duplication at the wire level.
 */
interface RemoteEventPayload {
  originInstanceId?: string;
  syncDomain?: string;
  envelope?: AnyEndpointEventEnvelope;
}

/**
 * The bridge's transport event name — the single `remote-event` event on the
 * bridge endpoint that carries any route's relayed event. Used for the
 * direct-http POST's eventName and the receive() dispatch check.
 */
const BRIDGE_TRANSPORT_EVENT = "remote-event" as const;

/**
 * Per-connection ORDERED relay queue for content/reasoning DELTAS.
 *
 * Deltas are APPENDED on the mirror, so they must arrive in emit order — a
 * fire-and-forget POST race scrambled the mirror (`hermes`+`ToolExec: her` →
 * `hermesToolExec: her`). We serialize the DELTA relays of a given (userId,
 * instanceId) so each POST is applied before the next is sent. Only deltas are
 * ordered — every other event is id-keyed + idempotent and relays DETACH (a
 * terminal event whose apply relays BACK must never block this chain). TEST mode
 * THROTTLE_MS=0 emits a delta per token; consecutive PENDING same-message deltas
 * MERGE (concat their increments) into one trailing POST so ordering costs a
 * handful of round-trips, not hundreds — as fast as local, exact text, ordered.
 * globalThis-backed to survive vite SSR module duplication.
 */
interface DeltaRelayState {
  tail: Promise<void>;
  /**
   * The delta currently at the tail END that has not begun draining. A same-key
   * delta merges into `open.wire`; a different key or a drain SEALS it (→ null),
   * so a later same-key delta can never merge out of order past an intervening
   * one. `key` = its coalesceKey.
   */
  open: { key: string; wire: RemoteEventWirePayload; drained: boolean } | null;
}
function getDeltaRelayQueues(): Map<string, DeltaRelayState> {
  const g = globalThis as typeof globalThis & {
    __nvDeltaRelayQ?: Map<string, DeltaRelayState>;
  };
  g.__nvDeltaRelayQ ??= new Map<string, DeltaRelayState>();
  return g.__nvDeltaRelayQ;
}
/** Concat a follow-up delta's increment onto a pending merged wire. */
function mergeDeltaWire(
  base: RemoteEventWirePayload,
  next: RemoteEventWirePayload,
): RemoteEventWirePayload {
  const b = base.envelope?.responseData?.["messages"]?.[0];
  const n = next.envelope?.responseData?.["messages"]?.[0];
  if (
    !b ||
    !n ||
    typeof b.content !== "string" ||
    typeof n.content !== "string"
  ) {
    return next;
  }
  return {
    ...next,
    envelope: {
      ...next.envelope,
      responseData: {
        ...next.envelope?.responseData,
        messages: [{ ...n, content: b.content + n.content }],
      },
    },
  };
}
/**
 * Coalesce key for a delta = eventName + messageId — so only consecutive deltas
 * of the SAME type/message merge (both append to `content`; concatenating their
 * increments is exact). CROSS-TYPE ordering (content vs reasoning of the same
 * message, which BOTH append to `content` and interleaved into `hermesBoth
 * answers…` when raced) is guaranteed separately by the per-connection shared
 * `tail`: every delta enqueues onto it in emit order, so a content delta and a
 * reasoning delta are applied in the order they were emitted regardless of key.
 * Null for non-deltas (they relay DETACH).
 */
function deltaCoalesceKey(envelope: AnyEndpointEventEnvelope): string | null {
  const name = envelope.eventName;
  if (name !== "content-delta" && name !== "reasoning-delta") {
    return null;
  }
  const id = envelope.responseData?.["messages"]?.[0]?.id;
  return typeof id === "string" ? `${name}:${id}` : null;
}

/**
 * `content-done` carries the AUTHORITATIVE full text and SETs it (not append).
 * It MUST apply strictly AFTER every preceding delta for the same message —
 * otherwise, relayed fire-and-forget, it can overtake the still-draining delta
 * tail: content-done SETs the full text, then a late delta APPENDS onto it →
 * scrambled/duplicated content. So it rides the SAME per-connection tail as the
 * deltas, as a non-coalescing BARRIER (seals any open delta, then WAIT-posts).
 * Returns the message id for a done event, else null.
 */
function doneMessageId(envelope: AnyEndpointEventEnvelope): string | null {
  if (envelope.eventName !== "content-done") {
    return null;
  }
  const id = envelope.responseData?.["messages"]?.[0]?.id;
  return typeof id === "string" ? id : null;
}

export class RemoteEventBridgeRepository {
  /**
   * Relay a route's remoteEvent to every connected peer that has its domain
   * enabled. The single entry point for sending any cross-instance event.
   *
   * Per-connection, per-user gating: a user may have N connections, each with
   * its own `syncScope`. A connection receives the event iff `syncDomain` is
   * undefined (always-relay, e.g. cache invalidation) OR `syncScope[syncDomain]`
   * is true on that connection. Gating happens HERE, at the sender — peers
   * receive only what they asked for; nothing is sent-then-dropped.
   *
   * Two delivery legs, decided per connection:
   *   - reverse-ws:  publish the `remote-event` frame on our local hub
   *     (the remote-event channel); the peer's connector delivers it. The
   *     irreducible base primitive — the leg runInProcessTyped itself resolves to.
   *   - direct-http: relay via runInProcessTyped({ instanceId }) → the peer's
   *     bridge endpoint, with auth applied by the canonical remote-call path.
   *
   * The peer's bridge runs the event via the target route's onRemoteEvent.
   * Fire-and-forget: errors are logged, not thrown.
   */
  /**
   * Resolve the relay context for a user once — call at stream/session start
   * and pass the result into every emitter's resolvedRelayContext option.
   * Eliminates per-event DB queries for originInstanceId + activeConnections.
   */
  static async resolveRemoteEventContext(
    userId: string,
  ): Promise<ResolvedRelayContext> {
    const originInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);
    let connections: ResolvedRelayContext["connections"] = [];
    try {
      const rows = await db
        .select({
          instanceId: remoteConnections.instanceId,
          token: remoteConnections.token,
          tokenLeadId: remoteConnections.leadId,
          remoteUserId: remoteConnections.remoteUserId,
          isReverseEntry: remoteConnections.isReverseEntry,
          transportMode: remoteConnections.transportMode,
          remoteTransportMode: remoteConnections.remoteTransportMode,
          syncScope: remoteConnections.syncScope,
        })
        .from(remoteConnections)
        .where(
          and(
            eq(remoteConnections.userId, userId),
            eq(remoteConnections.isActive, true),
          ),
        );
      connections = rows
        .filter((r) => r.token)
        .map((r) => ({
          instanceId: r.instanceId,
          tokenLeadId: r.tokenLeadId,
          remoteUserId: r.remoteUserId,
          isReverseEntry: r.isReverseEntry,
          transportMode: r.transportMode,
          remoteTransportMode: r.remoteTransportMode ?? null,
          syncScope: r.syncScope,
        }));
    } catch {
      // Non-fatal: falls back to per-event queries inside pushRemoteEvent.
    }
    return { originInstanceId, connections };
  }

  static async pushRemoteEvent(params: RemoteEventRelayPayload): Promise<void> {
    const {
      userId,
      logger,
      syncDomain,
      envelope,
      targetInstanceId,
      resolvedRelayContext,
    } = params;

    // Domain relay gate: the OWNING domain decides whether an event tagged
    // with its syncDomain may leave the instance (e.g. threads gate incognito
    // and transient threads). Domain logic lives in the domain's sync
    // provider — the bridge stays domain-agnostic.
    if (syncDomain) {
      const { ensureProvidersRegistered, getSyncProviders } =
        await import("@/app/api/[locale]/remote-connection/sync/provider");
      await ensureProvidersRegistered();
      const provider = getSyncProviders().get(syncDomain);
      if (provider?.remoteEventGate) {
        const urlPathParams: Record<string, string> = {};
        for (const [k, v] of Object.entries(envelope.urlPathParams ?? {})) {
          if (typeof v === "string") {
            urlPathParams[k] = v;
          }
        }
        if (!(await provider.remoteEventGate(userId, urlPathParams))) {
          logger.debug("[RemoteEventBridge] domain gate REJECTED event", {
            syncDomain,
            eventName: envelope.eventName,
            userId,
          });
          return;
        }
      }
    }

    // Use pre-resolved context when available (eliminates per-event DB queries).
    const originInstanceId =
      resolvedRelayContext?.originInstanceId ??
      (await RemoteConnectionRepository.getLocalInstanceId(userId));

    const wire: RemoteEventWirePayload = {
      originInstanceId,
      syncDomain,
      envelope,
      ...(targetInstanceId ? { targetInstanceId } : {}),
    };

    let connections: ResolvedRelayContext["connections"];

    if (resolvedRelayContext) {
      connections = resolvedRelayContext.connections;
    } else {
      try {
        const rows = await db
          .select({
            instanceId: remoteConnections.instanceId,
            token: remoteConnections.token,
            tokenLeadId: remoteConnections.leadId,
            remoteUserId: remoteConnections.remoteUserId,
            isReverseEntry: remoteConnections.isReverseEntry,
            transportMode: remoteConnections.transportMode,
            remoteTransportMode: remoteConnections.remoteTransportMode,
            syncScope: remoteConnections.syncScope,
          })
          .from(remoteConnections)
          .where(
            and(
              eq(remoteConnections.userId, userId),
              eq(remoteConnections.isActive, true),
            ),
          );

        connections = rows
          .filter((r) => r.token)
          .map((r) => ({
            instanceId: r.instanceId,
            tokenLeadId: r.tokenLeadId,
            remoteUserId: r.remoteUserId,
            isReverseEntry: r.isReverseEntry,
            transportMode: r.transportMode,
            remoteTransportMode: r.remoteTransportMode ?? null,
            syncScope: r.syncScope,
          }));
      } catch (err) {
        logger.warn("[RemoteEventBridge] pushRemoteEvent: DB lookup failed", {
          error: err instanceof Error ? err.message : String(err),
        });
        return;
      }
    }

    if (connections.length === 0) {
      logger.debug("[RemoteEventBridge] pushRemoteEvent: no connections", {
        userId,
        eventName: envelope.eventName,
      });
      return;
    }

    // Delivery leg per connection — each connection carries its OWN transport
    // mode (the local side's choice). One direction only; the back channel is a
    // separate pushRemoteEvent on the peer, decided by the peer's own mode.
    //
    //  • reverse-ws: the peer's connector is subscribed to the BRIDGE endpoint's
    //    user-scoped channel on us (it authenticates here as our local userId).
    //    We emit the bridge transport event — a regular scope:"user" event —
    //    and the emitter delivers it on that channel. Only connectors subscribe
    //    to it; browser tabs never see bridge frames.
    //
    //  • direct-http: POST to the peer's bridge via the canonical remote-call.
    for (const conn of connections) {
      // Point-to-point events (tool dispatch) relay over exactly ONE
      // connection — every other peer of this account must never see them
      // (double execution / cross-peer leakage otherwise).
      if (targetInstanceId && conn.instanceId !== targetInstanceId) {
        continue;
      }
      // Per-connection domain gate. A domain-less event (e.g. cache
      // invalidation) always relays; a domained event relays only where the
      // peer enabled it.
      if (syncDomain && conn.syncScope?.[syncDomain] !== true) {
        continue;
      }

      if (conn.transportMode === "reverse-ws") {
        // Emit the bridge event on OUR hub as OUR local userId. The peer's
        // connector authenticates HERE with this account's token — i.e. as
        // OUR local userId — and subscribes to the bridge endpoint's
        // user-scoped channel for exactly that identity, which is where the
        // emitter delivers a scope:"user" event.
        //
        // Point-to-point events additionally carry the connection's leadId as
        // the frame ADDRESS: the hub channel is shared by every peer connector
        // of this account, so non-addressed connectors must drop the frame.
        await RemoteEventBridgeRepository.emitBridgeEventToPeer(
          userId,
          conn.tokenLeadId,
          targetInstanceId ? { ...wire, targetLeadId: conn.tokenLeadId } : wire,
          logger,
        );
        void RemoteConnectionRepository.recordTransportUse(
          userId,
          conn.instanceId,
          "reverse-ws",
        );
        continue;
      }

      // direct-http: POST to the peer's bridge via the canonical remote-call.
      // DELTAS (content/reasoning) go through the per-connection ORDERED queue
      // (WAIT — the peer's receive() awaits its applier, so the next delta is
      // sent only after this one is appended → never scrambled; consecutive
      // pending same-message deltas coalesce). EVERYTHING ELSE is id-keyed +
      // idempotent and relays DETACH (fire-and-forget) — a terminal event whose
      // apply relays BACK must not block, which is why only deltas are ordered.
      const relayLeadId = conn.tokenLeadId;
      const relayInstanceId = conn.instanceId;
      const relayUser: JwtPrivatePayloadType = {
        id: userId,
        leadId: relayLeadId,
        isPublic: false,
        roles: [],
      };
      const doPost = async (
        w: RemoteEventWirePayload,
        mode: "WAIT" | "DETACH",
      ): Promise<void> => {
        const { RouteExecuteRepository } =
          await import("next-vibe/execute-tool/repository");
        const { CallbackMode } =
          await import("next-vibe/execute-tool/constants");
        const { default: bridgeDefinition } = await import("./definition");
        await RouteExecuteRepository.runInProcessTyped({
          definition: bridgeDefinition.POST,
          instanceId: relayInstanceId,
          callbackMode:
            mode === "WAIT" ? CallbackMode.WAIT : CallbackMode.DETACH,
          user: relayUser,
          locale: defaultLocale,
          logger,
          input: { eventName: BRIDGE_TRANSPORT_EVENT, payload: w },
        }).catch((err) => {
          logger.error("[RemoteEventBridge] pushRemoteEvent dispatch failed", {
            instanceId: relayInstanceId,
            eventName: envelope.eventName,
            error: err instanceof Error ? err.message : String(err),
          });
        });
      };
      const coalesceKey = deltaCoalesceKey(envelope);
      const doneMsgId = doneMessageId(envelope);
      if (coalesceKey === null && doneMsgId === null) {
        // Not delta nor content-done: fire-and-forget, no ordering needed.
        void doPost(wire, "DETACH");
      } else if (coalesceKey === null) {
        // content-done: rides the per-connection tail so it is SENT strictly
        // after every preceding delta (its authoritative SET must not overtake a
        // still-queued append), but it POSTs DETACH — a terminal event whose apply
        // re-emits a mirror event that relays BACK, so WAITing on it would deadlock
        // (mutual cross-instance WAIT). Ordering the SEND is enough: deltas already
        // applied (WAIT) before content-done is dispatched.
        const queues = getDeltaRelayQueues();
        const qk = `${userId}:${relayInstanceId}`;
        const state = queues.get(qk) ?? { tail: Promise.resolve(), open: null };
        queues.set(qk, state);
        state.open = null; // seal any open delta — the barrier follows it
        const doneWire = wire;
        state.tail = state.tail
          .then(() => doPost(doneWire, "DETACH"))
          .catch(() => undefined);
      } else {
        // Delta: enqueue onto the per-connection tail (serializes ALL deltas —
        // content + reasoning, every message — in emit order → no scramble).
        // COALESCING optimization: the `open` holder is the delta currently at the
        // END of the tail that has NOT started draining. A new delta with the SAME
        // coalesceKey merges its increment into `open.wire` instead of enqueuing
        // another POST. A different key SEALS `open` (nulls it) and enqueues a
        // fresh task — so cross-type deltas never merge out of order.
        const queues = getDeltaRelayQueues();
        const qk = `${userId}:${relayInstanceId}`;
        const state = queues.get(qk) ?? {
          tail: Promise.resolve(),
          open: null,
        };
        queues.set(qk, state);
        if (state.open && state.open.key === coalesceKey) {
          state.open.wire = mergeDeltaWire(state.open.wire, wire);
        } else {
          const open = { key: coalesceKey, wire, drained: false };
          state.open = open;
          const drain = async (): Promise<void> => {
            open.drained = true;
            if (state.open === open) {
              state.open = null; // seal — later merges can't reach a drained entry
            }
            await doPost(open.wire, "WAIT");
          };
          state.tail = state.tail.then(drain).catch(() => undefined);
        }
      }
      void RemoteConnectionRepository.recordTransportUse(
        userId,
        conn.instanceId,
        "direct-http",
      );
    }
  }

  /**
   * Emit the bridge transport event onto OUR account's user channel — the
   * channel the reverse-ws peer's connector subscribed to on THIS hub.
   *
   * The transport is a regular scope:"user" event on the bridge endpoint. The
   * peer's connector authenticates on this hub with this account's token (our
   * LOCAL userId), and WS channel auth only admits `user/{auth userId}` — so we
   * emit AS that user and the emitter delivers on exactly that channel. The
   * relay payload rides the event's responseData; the connector receives a
   * normal __event__ envelope and dispatches it.
   */
  private static async emitBridgeEventToPeer(
    localUserId: string,
    peerLeadId: string,
    wire: RemoteEventWirePayload,
    logger: EndpointLogger,
  ): Promise<void> {
    const { default: bridgeDefinition } = await import("./definition");
    const peerUser: JwtPrivatePayloadType = {
      id: localUserId,
      leadId: peerLeadId,
      isPublic: false,
      roles: [],
    };
    createEndpointEmitter(
      bridgeDefinition.POST,
      logger,
      peerUser,
    )("remote-event", {
      requestData: {
        payload: {
          originInstanceId: wire.originInstanceId,
          syncDomain: wire.syncDomain,
          envelope: wire.envelope,
          targetLeadId: wire.targetLeadId,
        },
      },
    });
  }

  /**
   * HTTP handler — direct-http peers POST a relayed remote event here.
   */
  static async receive(
    data: RemoteEventBridgeRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<RemoteEventBridgeResponseOutput>> {
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;

    if (data.eventName === BRIDGE_TRANSPORT_EVENT) {
      await RemoteEventBridgeRepository.handleRemoteEvent(
        data.payload,
        userId,
        logger,
      );
    } else {
      logger.warn("[RemoteEventBridge] Unknown eventName — ignored", {
        eventName: data.eventName,
      });
    }

    return success();
  }

  /**
   * Run a relayed remote event from a peer: dispatch it to the target route's
   * onRemoteEvent handler. The route applies it (persist, re-emit, both — its
   * own concern). Echo prevention: drop events that originated on this instance.
   */
  static async handleRemoteEvent(
    evt: RemoteEventPayload,
    userId: string | null,
    logger: EndpointLogger,
  ): Promise<void> {
    const envelope = evt.envelope;
    if (
      !envelope?.endpointPath ||
      !envelope.endpointMethod ||
      !envelope.eventName ||
      !evt.originInstanceId
    ) {
      return;
    }

    if (!userId) {
      logger.warn(
        "[RemoteEventBridge] handleRemoteEvent: no userId — skipped",
        {
          eventName: envelope.eventName,
        },
      );
      return;
    }

    // Echo guard against THIS user's configured self-instance-id (which the user
    // may have set explicitly — never the derived default). Drop events we
    // ourselves fanned out, preventing A→B→A loops.
    const selfInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);
    if (evt.originInstanceId === selfInstanceId) {
      logger.debug("[RemoteEventBridge] Echo-guard: dropping own event", {
        originInstanceId: evt.originInstanceId,
        endpointPath: envelope.endpointPath,
        eventName: envelope.eventName,
      });
      return;
    }

    try {
      // Run the relayed event as the REAL user with their real roles — the
      // event was authenticated by the bearer token / WS auth at the boundary;
      // its effects (onRemoteEvent) must respect that user's actual permissions,
      // not a fabricated role.
      const { UserRolesRepository } =
        await import("next-vibe/identity/roles/repository");
      const rolesResult = await UserRolesRepository.getUserRoles(
        userId,
        logger,
        defaultLocale,
      );
      if (!rolesResult.success) {
        logger.error(
          "[RemoteEventBridge] Failed to resolve user roles for relayed event",
          { userId, eventName: envelope.eventName },
        );
        return;
      }

      const user: JwtPrivatePayloadType = {
        id: userId,
        leadId: userId,
        isPublic: false,
        roles: rolesResult.data,
      };
      await dispatchRemoteEvent(
        envelope.endpointPath,
        envelope.endpointMethod,
        envelope,
        {
          instanceId: selfInstanceId,
          originInstanceId: evt.originInstanceId,
          user,
          locale: defaultLocale,
          logger,
          isServer: true,
        },
      );
    } catch (err) {
      logger.warn("[RemoteEventBridge] remote-event dispatch failed", {
        eventName: envelope.eventName,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
