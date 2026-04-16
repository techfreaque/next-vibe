"use client";

/**
 * useEndpointSubscription
 *
 * Subscribes to all declared events on the endpoint's WS channel.
 * Handles two wire protocols:
 *   - `__event__` envelope (framework-emitted via props.emitEvent / createEndpointEmitter)
 *   - Per-event-name messages (legacy stream protocol)
 *
 * For each event received:
 *  1. Looks up endpoint.events[eventName]
 *  2. If declaration has fields: applies operation to GET response cache
 *  3. Calls declaration.onEvent?.({ partial, urlPathParams, queryClient, logger })
 *     where partial is the typed event payload from types.EventPayloads
 *
 * Subscribes to TWO channels:
 *  - path-based channel (e.g. "agent/chat/threads/abc/messages") — for direct emits
 *  - user channel (e.g. "user/xyz") — for batched events routed by the server
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { useEffect, useRef } from "react";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { WidgetData } from "@/app/api/[locale]/system/unified-interface/shared/types/json";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import {
  appendDeltaToCache,
  applyPartialToCache,
  removeFromCache,
} from "../../websocket/cache-merger";
import { buildUserChannel, buildWsChannel } from "../../websocket/channel";
import type { EndpointEventEnvelope } from "../../websocket/structured-events";
import { eventDeclarationHasFields } from "../../websocket/structured-events";
import { subscribeToChannel } from "../../websocket/client";
import { queryClient } from "./store";

export function useEndpointSubscription(
  endpoint: CreateApiEndpointAny | null,
  enabled: boolean,
  urlPathParams: { readonly [K in string]: string } | undefined,
  requestData: Record<string, WidgetData> | undefined,
  logger: EndpointLogger,
  cacheKey: string | undefined,
  user: JwtPayloadType | undefined,
): void {
  // Use a ref so onEvent always reads the latest requestData without causing
  // re-subscription on every render (requestData object identity may change).
  const requestDataRef = useRef<Record<string, WidgetData>>(requestData ?? {});
  requestDataRef.current = requestData ?? {};

  // Serialize urlPathParams to a stable string so a new object with the same
  // values does not trigger re-subscription (common when callers pass inline literals).
  const urlPathParamsKey = urlPathParams
    ? JSON.stringify(
        Object.fromEntries(Object.entries(urlPathParams).toSorted()),
      )
    : undefined;

  // Keep a ref so the effect body always reads the latest params without
  // needing to list the object itself in the dependency array.
  const urlPathParamsRef = useRef(urlPathParams);
  urlPathParamsRef.current = urlPathParams;

  // Stable user id key — avoid re-subscribing when the user object is recreated.
  const userId = user ? (user.isPublic ? user.leadId : user.id) : undefined;

  useEffect(() => {
    if (!enabled || !endpoint?.events) {
      return;
    }

    const resolvedParams = urlPathParamsRef.current ?? {};
    const pathChannel = buildWsChannel(endpoint.path, resolvedParams);
    const userChannel = userId ? buildUserChannel(userId) : undefined;

    function handleEvent(
      eventName: string,
      wirePayload: CreateApiEndpointAny["types"]["EventPayloads"][string],
    ): void {
      const declaration = endpoint?.events?.[eventName];

      if (!declaration) {
        logger.warn(
          `useEndpointSubscription: unknown event "${eventName}" on ${endpoint?.path.join("/")}`,
        );
        return;
      }

      if (eventDeclarationHasFields(declaration) && cacheKey !== undefined) {
        queryClient.setQueryData(
          [cacheKey],
          (
            existing:
              | ResponseType<CreateApiEndpointAny["types"]["ResponseOutput"]>
              | undefined,
          ) => {
            if (!existing?.success || !existing.data) {
              return existing;
            }

            const operation = declaration.operation ?? "merge";
            const newData =
              operation === "append"
                ? appendDeltaToCache(existing.data, wirePayload)
                : operation === "remove"
                  ? removeFromCache(existing.data, wirePayload)
                  : applyPartialToCache(existing.data, wirePayload);

            if (newData === existing.data) {
              return existing;
            }
            return { ...existing, data: newData };
          },
        );
      }

      declaration.onEvent?.({
        partial: wirePayload,
        urlPathParams: resolvedParams,
        requestData: requestDataRef.current,
        queryClient,
        logger,
      });
    }

    const unsubscribers: Array<() => void> = [];

    // ── Path channel: direct emits + legacy __event__ envelope ──
    unsubscribers.push(
      subscribeToChannel<
        EndpointEventEnvelope<
          CreateApiEndpointAny["types"]["EventPayloads"][string]
        >
      >(pathChannel, "__event__", (envelope) => {
        handleEvent(envelope.eventName, envelope.payload);
      }),
    );

    for (const eventName of Object.keys(endpoint.events)) {
      unsubscribers.push(
        subscribeToChannel<
          CreateApiEndpointAny["types"]["EventPayloads"][string]
        >(pathChannel, eventName, (data) => {
          handleEvent(eventName, data);
        }),
      );
    }

    // ── User channel: batched events routed by channel field ──
    // Events arrive with channel === pathChannel so the server can fan-out
    // to all endpoints for this user in one batch frame.
    if (userChannel) {
      unsubscribers.push(
        subscribeToChannel<
          EndpointEventEnvelope<
            CreateApiEndpointAny["types"]["EventPayloads"][string]
          >
        >(userChannel, "__event__", (envelope) => {
          if (envelope.channel === pathChannel) {
            handleEvent(envelope.eventName, envelope.payload);
          }
        }),
      );

      for (const eventName of Object.keys(endpoint.events)) {
        unsubscribers.push(
          subscribeToChannel<
            CreateApiEndpointAny["types"]["EventPayloads"][string] & {
              __channel?: string;
            }
          >(userChannel, eventName, (data) => {
            // Events routed via user channel carry a __channel field so we
            // can verify they belong to this endpoint instance.
            if ("__channel" in data && data.__channel !== pathChannel) {
              return;
            }
            handleEvent(eventName, data);
          }),
        );
      }
    }

    return (): void => {
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
    // urlPathParamsKey is a stable JSON string — re-subscribe only when values actually change.
    // userId is derived from user so we don't need user in the dep array too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, endpoint, urlPathParamsKey, logger, cacheKey, userId]);
}
