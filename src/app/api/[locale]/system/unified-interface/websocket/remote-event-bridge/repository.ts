/**
 * Remote Event Bridge Repository
 *
 * The generic runner for cross-instance remote events. A peer relays ANY route's
 * remoteEvent here; the bridge dispatches it to that route's onRemoteEvent — the
 * route is the runner, the payload is the target event's own definition fields.
 *
 * One handler, one event. There is no per-domain branching: cache invalidation,
 * chat stream relay, and domain sync are all remoteEvents on their own
 * endpoints, dispatched the same way. Echo prevention is the one universal rule.
 *
 * Called from two paths:
 *   - HTTP POST (direct-http peers call this endpoint directly)
 *   - onRemoteEvent in route.ts (reverse-WS peers — typed payload from definition)
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { success } from "next-vibe/shared/types/response.schema";

import { RemoteConnectionRepository } from "@/app/api/[locale]/remote-connection/repository";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import { dispatchRemoteEvent } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/remote-event-registry";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
} from "@/app/api/[locale]/user/auth/types";

import type {
  RemoteEventBridgeRequestOutput,
  RemoteEventBridgeResponseOutput,
} from "./definition";

// ─── Typed event payload shape (derived from definition fields) ────────────────

/**
 * The generic remote-event payload. Identifies the target route + event and
 * carries that event's own definition-driven payload. `domain` is the target
 * event's `sync.domain`, used for per-connection syncScope gating at the sender.
 */
export interface RemoteEventPayload {
  originInstanceId?: string;
  syncDomain?: string;
  endpointPath?: string[];
  endpointMethod?: string;
  urlPathParams?: Record<string, string>;
  endpointEventName?: string;
  endpointPayload?: WidgetData;
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class RemoteEventBridgeRepository {
  /**
   * HTTP handler — direct-http peers POST a relayed remote event here.
   */
  static async receive(
    data: RemoteEventBridgeRequestOutput,
    user: JwtPayloadType,
    logger: EndpointLogger,
  ): Promise<ResponseType<RemoteEventBridgeResponseOutput>> {
    const userId = "id" in user && typeof user.id === "string" ? user.id : null;

    if (data.eventName === "remote-event") {
      await RemoteEventBridgeRepository.handleRemoteEvent(
        data.payload as RemoteEventPayload,
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
    if (
      !evt.endpointPath ||
      !evt.endpointMethod ||
      !evt.endpointEventName ||
      !evt.originInstanceId
    ) {
      return;
    }

    if (!userId) {
      logger.warn(
        "[RemoteEventBridge] handleRemoteEvent: no userId — skipped",
        {
          eventName: evt.endpointEventName,
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
      logger.error("Emitted a remote event to local", {
        originInstanceId: evt.originInstanceId,
        endpointPath: evt.endpointPath,
        endpointEventName: evt.endpointEventName,
      });
      return;
    }

    try {
      const user: JwtPrivatePayloadType = {
        id: userId,
        leadId: userId,
        isPublic: false,
        roles: [],
      };
      await dispatchRemoteEvent(
        evt.endpointPath,
        evt.endpointMethod,
        evt.endpointEventName,
        evt.endpointPayload,
        {
          instanceId: selfInstanceId,
          user,
          urlPathParams: evt.urlPathParams ?? {},
          logger,
          isServer: true,
        },
      );
    } catch (err) {
      logger.warn("[RemoteEventBridge] remote-event dispatch failed", {
        eventName: evt.endpointEventName,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}
