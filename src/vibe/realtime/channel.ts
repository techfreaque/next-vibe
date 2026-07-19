/**
 * WebSocket Channel Key Builder — SINGLE source of truth for WS channel names.
 *
 * Uses the same buildKey algorithm as React Query cache keys to guarantee
 * consistent namespacing. Prefix "ws" distinguishes WS channels from query
 * cache keys ("query") while the method inclusion prevents same-path endpoints
 * from colliding.
 *
 * Two channel kinds, both endpoint-instance-specific:
 *   ws-path-method[-…]              — shared resource channel (kind:"resource")
 *   user/{uid}/ws-path-method[-…]   — the owner's private channel for the SAME
 *                                     endpoint instance (kind:"user")
 *
 * There is NO bundled per-user firehose channel: a user-scoped event rides the
 * user-scoped channel of ITS endpoint instance, so delivery only reaches
 * sockets that subscribed to exactly that endpoint + params. Cross-instance
 * relay rides the remote-event-bridge endpoint's own user-scoped channel the
 * same way — no bespoke transport channel.
 */

import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import type { EndpointLogger } from "next-vibe/logger/types";
import {
  buildKey,
  type CacheKeyRequestInput,
} from "next-vibe/unified-ui/hooks/query-key-builder";

/**
 * Build the shared (resource-kind) WS channel key for an endpoint instance.
 * Mirrors the React Query cache key (prefix "ws" instead of "query") so the
 * same endpoint + params always produces the same channel, with no namespace
 * collisions between different endpoints sharing a path.
 */
export function buildWsChannel<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"],
  requestData: CacheKeyRequestInput<TEndpoint>,
  logger: EndpointLogger,
): string {
  return buildKey("ws", endpoint, urlPathParams, logger, requestData);
}

/**
 * Build the user-scoped (user-kind) WS channel for an endpoint instance: the
 * same canonical endpoint key, partitioned by the owner's identity. Unlike a
 * plain per-user channel this is UNIQUE per endpoint + params + user, so
 * subscribing to it never delivers another endpoint's events.
 *
 * Authorization is by prefix: a socket may subscribe iff the uid segment is its
 * own authenticated identity (see ws-channel-auth.ts).
 */
export function buildUserWsChannel<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  userId: string,
  urlPathParams: TEndpoint["types"]["UrlVariablesOutput"],
  requestData: CacheKeyRequestInput<TEndpoint>,
  logger: EndpointLogger,
): string {
  return `${userChannelPrefix(userId)}${buildKey("ws", endpoint, urlPathParams, logger, requestData)}`;
}

/**
 * The identity prefix every user-scoped channel starts with. The auth layer
 * admits a subscription iff the channel starts with the subscriber's own
 * prefix — identity is the boundary, no resolver needed.
 */
function userChannelPrefix(userId: string): string {
  return `user/${userId}/`;
}
