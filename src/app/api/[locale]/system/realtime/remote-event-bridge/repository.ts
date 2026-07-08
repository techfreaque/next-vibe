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
  static async pushRemoteEvent(params: RemoteEventRelayPayload): Promise<void> {
    const { userId, logger, syncDomain, envelope, targetInstanceId } = params;

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

    // Stamp the user's CONFIGURED self-instance-id (which the user may have set
    // explicitly) — never a derived default. Peers echo-guard against it.
    const originInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);

    const wire: RemoteEventWirePayload = {
      originInstanceId,
      syncDomain,
      envelope,
      ...(targetInstanceId ? { targetInstanceId } : {}),
    };

    let connections: Array<{
      instanceId: string;
      tokenLeadId: string;
      remoteUserId: string | null;
      isReverseEntry: boolean;
      transportMode: string | null;
      syncScope: Record<string, boolean> | null;
    }>;

    try {
      const rows = await db
        .select({
          instanceId: remoteConnections.instanceId,
          token: remoteConnections.token,
          tokenLeadId: remoteConnections.leadId,
          remoteUserId: remoteConnections.remoteUserId,
          isReverseEntry: remoteConnections.isReverseEntry,
          transportMode: remoteConnections.transportMode,
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
          syncScope: r.syncScope,
        }));
    } catch (err) {
      logger.warn("[RemoteEventBridge] pushRemoteEvent: DB lookup failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return;
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

      // direct-http: relay the remote-event to the peer's bridge via the single
      // canonical remote-call path. runInProcessTyped({ instanceId }) resolves
      // the connection (auth handled inside the connection layer), picks the
      // direct-http leg, and POSTs to the peer's bridge. The peer dispatches it
      // to the target route's onRemoteEvent. DETACH = fire-and-forget: pure
      // transport; the relayed event handles its own result on the peer.
      // Single-shot by design: delivery either works or it doesn't — a failure
      // is logged, never retried (the appliers are idempotent upserts, so the
      // mirror converges from the remaining events / the local reconcile).
      const { RouteExecuteRepository } =
        await import("next-vibe/execute-tool/repository");
      const { CallbackMode } = await import("next-vibe/execute-tool/constants");
      const { default: bridgeDefinition } = await import("./definition");
      void RouteExecuteRepository.runInProcessTyped({
        definition: bridgeDefinition.POST,
        instanceId: conn.instanceId,
        callbackMode: CallbackMode.DETACH,
        user: {
          id: userId,
          leadId: conn.tokenLeadId,
          isPublic: false,
          roles: [],
        },
        locale: defaultLocale,
        logger,
        input: {
          eventName: BRIDGE_TRANSPORT_EVENT,
          leadId: conn.tokenLeadId,
          payload: wire,
        },
      }).catch((err) => {
        logger.error("[RemoteEventBridge] pushRemoteEvent dispatch failed", {
          instanceId: conn.instanceId,
          eventName: envelope.eventName,
          error: err instanceof Error ? err.message : String(err),
        });
      });
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
      responseData: {
        originInstanceId: wire.originInstanceId,
        syncDomain: wire.syncDomain,
        envelope: wire.envelope,
        targetLeadId: wire.targetLeadId,
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

    return success({ received: true });
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
