/**
 * WebSocket Channel Key Builder — SINGLE source of truth for WS channel names.
 *
 * Uses the same buildKey algorithm as React Query cache keys to guarantee
 * consistent namespacing. Prefix "ws" distinguishes WS channels from query
 * cache keys ("query") while the method inclusion prevents same-path endpoints
 * from colliding.
 *
 * Format: ws-path-method[-urlPathParams][-cacheKeyFields]
 */

import type { EndpointLogger } from "../../logger/types";
import {
  buildKey,
  type CacheKeyRequestData,
} from "../react/hooks/query-key-builder";
import type { CreateApiEndpointAny } from "../shared/types/endpoint-base";

/**
 * Build the WS channel key for an endpoint instance.
 * Mirrors the React Query cache key (prefix "ws" instead of "query") so the
 * same endpoint + params always produces the same channel, with no namespace
 * collisions between different endpoints sharing a path.
 */
export function buildWsChannel<TEndpoint extends CreateApiEndpointAny>(
  endpoint: TEndpoint,
  urlPathParams: Record<string, string>,
  requestData: CacheKeyRequestData<TEndpoint>,
  logger: EndpointLogger,
): string {
  return buildKey("ws", endpoint, urlPathParams, logger, requestData);
}

/**
 * Build the user-scoped channel for a single-connection-per-tab model.
 * All endpoint events are routed through this channel; the `channel` field
 * in each WsWireMessage still carries the original path-based channel so
 * client-side routing (channels.get(msg.channel)) works transparently.
 *
 * userId is the authenticated user's ID, or leadId for anonymous users.
 */
export function buildUserChannel(userId: string): string {
  return `user/${userId}`;
}

export function buildWsChannel(
  path: readonly string[],
  urlPathParams: Record<string, string>,
  scope?: string,
): string {
  const resolved = path
    .map((segment) => {
      if (segment.startsWith("[") && segment.endsWith("]")) {
        const paramName = segment.slice(1, -1);
        return urlPathParams[paramName] ?? segment;
      }
      return segment;
    })
    .join("/");

  if (scope) {
    // eslint-disable-next-line i18next/no-literal-string
    return `${resolved}/${scope}`;
  }

  return resolved;
}
