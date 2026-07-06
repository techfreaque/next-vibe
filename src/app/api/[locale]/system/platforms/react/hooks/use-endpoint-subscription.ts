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
 *  3. Calls declaration.onEvent?.({ responseData, requestData, urlPathParams, queryClient, logger })
 *     where partial is the typed event payload from types.EventPayloads
 *
 * Subscribes to TWO channels for the SAME endpoint instance:
 *  - the shared path channel (kind:"resource" emits)
 *  - the user-scoped channel `user/{uid}/{pathChannel}` (kind:"user" emits)
 * Both carry only THIS endpoint instance's events — no cross-endpoint filtering.
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import type { WidgetData } from "next-vibe/core/utils/json";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import type { EndpointLogger } from "next-vibe/logger/types";
import { buildUserWsChannel, buildWsChannel } from "next-vibe/realtime/channel";
import { subscribeToChannel } from "next-vibe/realtime/client";
import type { AnyEndpointEventEnvelope } from "next-vibe/realtime/structured-events";
import { eventDeclarationHasFields } from "next-vibe/realtime/structured-events";
import type { WsChannelDescriptor } from "next-vibe/realtime/types";
import { useEffect, useRef } from "react";

import { useProviderAvailability } from "@/app/api/[locale]/agent/env-availability-context";

import {
  appendDeltaToCache,
  applyPartialToCache,
  removeFromCache,
} from "./cache-merger";
import { toCacheKeyParams } from "./query-key-builder";
import { queryClient } from "./store";

export function useEndpointSubscription(
  endpoint: CreateApiEndpointAny | null,
  enabled: boolean,
  urlPathParams: { readonly [K in string]: string } | undefined,
  requestData: Record<string, WidgetData> | undefined,
  logger: EndpointLogger,
  cacheKey: string | undefined,
  user: JwtPayloadType | undefined,
  locale: CountryLanguage,
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

  // Refs so onEvent reads the latest user/locale without re-subscribing.
  const userRef = useRef(user);
  userRef.current = user;
  const localeRef = useRef(locale);
  localeRef.current = locale;
  // Client-side availability from the provider context (never the server module).
  const availability = useProviderAvailability();
  const availabilityRef = useRef(availability);
  availabilityRef.current = availability;

  // Stable user id key - avoid re-subscribing when the user object is recreated.
  const userId = user ? (user.isPublic ? user.leadId : user.id) : undefined;

  useEffect(() => {
    if (!enabled || !endpoint?.events) {
      return;
    }

    const resolvedParams = urlPathParamsRef.current ?? {};
    const pathChannel = buildWsChannel(
      endpoint,
      resolvedParams,
      // requestData is typed as Record<string, WidgetData> in this generic hook;
      // CacheKeyRequestData<CreateApiEndpointAny> resolves to undefined but the
      // runtime value is always a plain object — cast is safe.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      requestDataRef.current as any,
      logger,
    );
    const userChannel = userId
      ? buildUserWsChannel(
          endpoint,
          userId,
          resolvedParams,
          // Same erased-boundary cast as the path channel above.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          requestDataRef.current as any,
          logger,
        )
      : undefined;

    // Structured descriptor for the endpoint (path) channel. The server rebuilds
    // and authorizes the channel from this — never from the channel string — and
    // hands urlPathParams/requestData straight to the route's resolveChannel.
    const descriptor: WsChannelDescriptor = {
      endpointPath: endpoint.path,
      method: endpoint.method,
      urlPathParams: resolvedParams,
      requestData: toCacheKeyParams(requestDataRef.current),
    };

    /**
     * Dispatch a received event to cache-merger + onEvent. Every event arrives as
     * a single `__event__` envelope (the only wire shape the emitter produces),
     * which carries the emitter's own responseData/requestData/urlPathParams.
     */
    function handleEvent(envelope: AnyEndpointEventEnvelope): void {
      const eventName = envelope.eventName;
      const wirePayload = envelope.responseData ?? envelope.payload;
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

      const currentUser = userRef.current;
      if (declaration.onEvent && currentUser) {
        void declaration.onEvent({
          responseData: wirePayload,
          // The envelope carries the emitter's own requestData/urlPathParams, so
          // onEvent gets the EVENT's context, not the subscriber's.
          requestData: envelope.requestData ?? requestDataRef.current,
          urlPathParams: envelope.urlPathParams ?? resolvedParams,
          payload: envelope.payload,
          logger,
          user: currentUser,
          locale: localeRef.current,
          agentEnvAvailability: availabilityRef.current,
        });
      }
    }

    const unsubscribers: Array<() => void> = [];

    // Every emit delivers a single `__event__` envelope (see createEndpointEmitter).
    // We listen on BOTH channels because the delivery channel is decided per
    // resource at emit time by the route's resolveChannel:
    //   - resource-scope events ride the shared PATH channel,
    //   - user-scope events ride the user-scoped channel of the SAME endpoint
    //     instance (`user/{uid}/{pathChannel}`).
    // Both channels are unique to this endpoint + params, so everything that
    // arrives is ours — no envelope filtering.
    unsubscribers.push(
      subscribeToChannel<AnyEndpointEventEnvelope>(
        pathChannel,
        "__event__",
        handleEvent,
        locale,
        logger,
        descriptor,
      ),
    );

    if (userChannel) {
      unsubscribers.push(
        subscribeToChannel<AnyEndpointEventEnvelope>(
          userChannel,
          "__event__",
          handleEvent,
          locale,
          logger,
        ),
      );
    }

    return (): void => {
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, [enabled, endpoint, urlPathParamsKey, logger, cacheKey, userId, locale]);
}
