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
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { remoteConnections } from "@/app/api/[locale]/remote-connection/db";
import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { REMOTE_EVENT_NAME } from "@/app/api/[locale]/system/unified-interface/websocket/channel";
import {
  publishRemoteEventToHub,
  type RemoteEventRelayPayload,
  type RemoteEventWirePayload,
} from "@/app/api/[locale]/system/unified-interface/websocket/emitter";
import { dispatchRemoteEvent } from "@/app/api/[locale]/system/unified-interface/websocket/remote-event-bridge/registry";
import type { AnyEndpointEventEnvelope } from "@/app/api/[locale]/system/unified-interface/websocket/structured-events";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";
import { defaultLocale } from "@/i18n/core/config";

import type {
  RemoteEventBridgeRequestOutput,
  RemoteEventBridgeResponseOutput,
} from "./definition";

/**
 * The generic remote-event wire payload. The envelope carries all 4 event fields
 * (responseData, requestData, urlPathParams, payload) plus routing metadata
 * (endpointPath, endpointMethod, eventName). No duplication at the wire level.
 */
export interface RemoteEventPayload {
  originInstanceId?: string;
  syncDomain?: string;
  envelope?: AnyEndpointEventEnvelope;
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
  static async pushRemoteEvent(params: RemoteEventRelayPayload): Promise<void> {
    const { userId, logger, syncDomain, envelope } = params;

    // Stamp the user's CONFIGURED self-instance-id (which the user may have set
    // explicitly) — never a derived default. Peers echo-guard against it.
    const originInstanceId =
      await RemoteConnectionRepository.getLocalInstanceId(userId);

    const wire: RemoteEventWirePayload = {
      originInstanceId,
      syncDomain,
      envelope,
    };

    let connections: Array<{
      instanceId: string;
      tokenLeadId: string;
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
      return;
    }

    // Delivery leg per connection — each connection carries its OWN transport
    // mode (the local side's choice). One direction only; the back channel is a
    // separate pushRemoteEvent on the peer, decided by the peer's own mode.
    //
    //  • reverse-ws: the peer runs a connector subscribed to our remote-event
    //    hub — one hub publish reaches it. The irreducible base primitive.
    //
    //  • direct-http: POST to the peer's bridge via the canonical remote-call.
    let publishedToHub = false;

    for (const conn of connections) {
      // Per-connection domain gate. A domain-less event (e.g. cache
      // invalidation) always relays; a domained event relays only where the
      // peer enabled it.
      if (syncDomain && conn.syncScope?.[syncDomain] !== true) {
        continue;
      }

      if (conn.transportMode === "reverse-ws") {
        // Publish once per fan-out — every reverse-ws peer shares our hub.
        if (!publishedToHub) {
          publishRemoteEventToHub(userId, wire, logger);
          publishedToHub = true;
        }
        continue;
      }

      // direct-http: relay the remote-event to the peer's bridge via the single
      // canonical remote-call path. runInProcessTyped({ instanceId }) resolves
      // the connection (auth handled inside the connection layer), picks the
      // direct-http leg, and POSTs to the peer's bridge. The peer dispatches it
      // to the target route's onRemoteEvent. DETACH = fire-and-forget: pure
      // transport; the relayed event handles its own result on the peer.
      const { RouteExecuteRepository } =
        await import("@/app/api/[locale]/system/unified-interface/execute-tool/repository");
      const { CallbackMode } =
        await import("@/app/api/[locale]/system/unified-interface/execute-tool/constants");
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
          eventName: REMOTE_EVENT_NAME,
          leadId: conn.tokenLeadId,
          payload: wire,
        },
      }).catch((err) => {
        logger.warn("[RemoteEventBridge] pushRemoteEvent dispatch failed", {
          instanceId: conn.instanceId,
          error: err instanceof Error ? err.message : String(err),
        });
      });
    }
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

    if (data.eventName === REMOTE_EVENT_NAME) {
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
        await import("@/app/api/[locale]/user/user-roles/repository");
      const rolesResult = await UserRolesRepository.getUserRoles(
        userId,
        logger,
        defaultLocale,
      );
      if (!rolesResult.success) {
        logger.error();
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
