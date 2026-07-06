/**
 * WebSocket Channel Authorization
 *
 * Channel-level access control for WS subscriptions.
 * Called at both upgrade time (channel query param) and subscribe-message time.
 *
 * Auth model:
 *   user/{userId}/ws-*       — user-scoped endpoint channels; only the matching
 *                              user (also how a reverse-ws connector, authed as
 *                              the peer user, joins the bridge endpoint's channel)
 *   ws-* endpoint channels   — rebuilt from the client's structured descriptor
 *                              (anti-spoof), role check via permissionsRegistry,
 *                              then the route's resolveChannel decides admission
 */

import {
  type CountryLanguage,
  defaultLocale,
} from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  AUTH_TOKEN_COOKIE_NAME,
  LEAD_ID_COOKIE_NAME,
} from "@/config/constants";

import { buildWsChannel } from "./channel";
import type { WsChannelDescriptor } from "./types";
import type { WsChannelEntry } from "./ws-channel-registry";

// ─── Endpoint registry lookup ─────────────────────────────────────────────────
// Endpoint channels are authorized from the client's structured descriptor, not
// by parsing the channel string. We index registry entries by endpointPath+method
// so a descriptor maps straight to its entry (and its resolveChannel).

interface IndexedChannelEntry {
  /** "path/segments|METHOD" key for descriptor lookup. */
  key: string;
  entry: WsChannelEntry;
}

let endpointChannelCache: IndexedChannelEntry[] | null = null;

function descriptorKey(
  endpointPath: readonly string[],
  method: string,
): string {
  return `${endpointPath.join("/")}|${method}`;
}

async function getEndpointChannels(): Promise<IndexedChannelEntry[]> {
  if (endpointChannelCache) {
    return endpointChannelCache;
  }
  const { getWsEndpoints } = await import("./ws-channel-registry");
  const wsEndpoints = await getWsEndpoints();
  endpointChannelCache = wsEndpoints.map((entry) => ({
    key: descriptorKey(entry.endpoint.path, entry.endpoint.method),
    entry,
  }));
  return endpointChannelCache;
}

// ─── Cookie auth ──────────────────────────────────────────────────────────────

/** Parse a single cookie value from a Cookie header string */
function parseCookieValue(
  cookieHeader: string,
  name: string,
): string | undefined {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match?.[1];
}

/**
 * Verify JWT and extract userId + leadId from the connection request.
 *
 * Sources (checked in order):
 *   1. httpOnly cookies (browser clients)
 *   2. URL query params ?token=...&leadId=... (server-to-server, e.g. self-hosted relay)
 */
export async function authenticateWsRequest(
  req: Request,
  logger: EndpointLogger,
): Promise<JwtPayloadType | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const url = new URL(req.url);

  const token =
    parseCookieValue(cookieHeader, AUTH_TOKEN_COOKIE_NAME) ??
    url.searchParams.get("token") ??
    null;
  const leadId =
    parseCookieValue(cookieHeader, LEAD_ID_COOKIE_NAME) ??
    url.searchParams.get("leadId") ??
    null;

  if (!leadId) {
    return null;
  }

  if (token) {
    try {
      const { AuthRepository } =
        await import("next-vibe/identity/auth/repository");
      const result = await AuthRepository.verifyJwt(
        token,
        logger,
        defaultLocale,
      );

      if (result.success) {
        return result.data;
      }
    } catch {
      logger.debug("[WS] JWT verification failed during upgrade");
    }
  }

  // Public (unauthenticated) connection
  return {
    isPublic: true,
    leadId,
    roles: [UserPermissionRole.PUBLIC],
  };
}

// ─── Channel authorization ────────────────────────────────────────────────────

/**
 * Authorize a channel subscription request.
 *
 * Rules:
 *   user/{userId}/ws-*       → only the owner (incl. a reverse-ws connector authed
 *                              as the peer user, for the bridge transport event)
 *   ws-* endpoint channels   → role check + resolveChannel; the route resolver
 *                              decides the channel from the structured descriptor
 *                              and we admit ONLY if it matches the one requested
 *   anything else            → denied
 */
export async function authorizeWsChannel(
  user: JwtPayloadType,
  channel: string,
  descriptor: WsChannelDescriptor | undefined,
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<boolean> {
  const userId = user.isPublic ? user.leadId : user.id;

  if (channel.startsWith("user/")) {
    // Only the owner. A reverse-ws connector authenticates as the peer-account
    // user, so its `user/{remoteUserId}` subscription matches here — that's how
    // the bridge transport (a regular scope:"user" event) reaches it.
    return channel === `user/${userId}`;
  }

  if (!channel.startsWith("ws-")) {
    logger.warn("[WS] Channel subscription denied — unknown format", {
      channel,
    });
    return false;
  }

  // Endpoint channel — MUST carry a structured descriptor. We never parse params
  // back out of the channel string; the descriptor is the source of truth and
  // the channel is re-derived from it server-side (anti-spoof).
  if (!descriptor) {
    logger.warn(
      "[WS] Channel subscription denied — endpoint channel without descriptor",
      {
        channel,
      },
    );
    return false;
  }

  const endpointChannels = await getEndpointChannels();
  const match = endpointChannels.find(
    (c) => c.key === descriptorKey(descriptor.endpointPath, descriptor.method),
  );
  if (!match) {
    logger.warn("[WS] Channel subscription denied — no matching endpoint", {
      channel,
      descriptor: descriptorKey(descriptor.endpointPath, descriptor.method),
    });
    return false;
  }
  const { entry } = match;

  // Re-derive the canonical channel server-side from the descriptor. A client
  // that lies about the channel string is caught here: if the rebuilt channel
  // doesn't equal what they asked to join, deny.
  const canonical = buildWsChannel(
    entry.endpoint,
    descriptor.urlPathParams,
    descriptor.requestData,
    logger,
  );
  if (canonical !== channel) {
    logger.warn(
      "[WS] Channel subscription denied — channel/descriptor mismatch",
      {
        requested: channel,
        canonical,
      },
    );
    return false;
  }

  const { permissionsRegistry } =
    await import("next-vibe/core/permissions/registry");
  const { Platform } = await import("next-vibe/core/definition/platform");
  const roleResult = permissionsRegistry.validateEndpointAccess(
    entry.endpoint,
    user,
    Platform.NEXT_PAGE,
    locale,
  );
  if (!roleResult.success) {
    return false;
  }

  // FAIL-CLOSED: every registered channel carries a resolveChannel (the generator
  // wires lazyResolveChannel for each, which itself denies when the route declares
  // none). Absent here means a malformed registry — deny.
  if (!entry.resolveChannel) {
    logger.error(
      "[WS] Channel subscription denied — registry entry has no resolveChannel",
      { channel },
    );
    return false;
  }

  // Run the route resolver with the SUBSCRIBER's identity. The decision both
  // authorizes the subscription AND names where the events ride:
  //   kind "deny"     → the subscriber may not see this resource; reject.
  //   kind "user"     → owner/private: events ride the subscriber's OWN user/{id}
  //                     channel (which they subscribe to separately and which is
  //                     identity-authorized). The path channel they asked for is
  //                     theirs and carries nothing extra — admit (harmless; the
  //                     canonical rebuild above already proved it's their own
  //                     resource key, so they cannot join another user's channel).
  //   kind "resource" → public/shared: events ride this canonical path channel;
  //                     admit. The emitter delivers here for every viewer.
  const decision = await entry.resolveChannel({
    user,
    urlPathParams: descriptor.urlPathParams,
    requestData: descriptor.requestData,
    logger,
    locale,
  });
  return decision.kind !== "deny";
}
