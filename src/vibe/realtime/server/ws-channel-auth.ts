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

import { AUTH_TOKEN_COOKIE_NAME, LEAD_ID_COOKIE_NAME } from "@/env/constants";

import {
  type CountryLanguage,
  defaultLocale,
} from "../../core/i18n/core/config";
import type { JwtPayloadType } from "../../identity/auth/types";
import { UserPermissionRole } from "../../identity/roles/enum";
import type { EndpointLogger } from "../../logger/types";
import { buildWsChannel } from "../core/channel";
import type { WsChannelDescriptor } from "../core/types";
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

  const cookieToken = parseCookieValue(cookieHeader, AUTH_TOKEN_COOKIE_NAME);
  const token = cookieToken ?? url.searchParams.get("token") ?? null;
  const leadId =
    parseCookieValue(cookieHeader, LEAD_ID_COOKIE_NAME) ||
    url.searchParams.get("leadId") ||
    null;

  if (!leadId) {
    return null;
  }

  if (token) {
    try {
      const { AuthRepository } = await import("../../identity/auth/repository");
      const result = await AuthRepository.verifyJwt(
        token,
        logger,
        defaultLocale,
      );

      if (result.success && (result.data.isPublic || !cookieToken)) {
        return result.data;
      }
      if (result.success) {
        // Browser cookie: the page treats a JWT whose session row is gone
        // (logout elsewhere, deleted or suspended account) as a guest, so the
        // socket must too. Otherwise the tab renders as guest and asks for
        // user/{leadId}/… while the socket claims the user id, and every
        // subscribe is denied ("client-guest-socket-user"; 2026-11-16/17 two
        // deleted accounts kept a valid JWT cookie for a day).
        const session = await AuthRepository.validateSession(
          token,
          result.data.id,
          defaultLocale,
          logger,
        );
        if (session) {
          return result.data;
        }
        logger.debug("[WS] Cookie JWT has no live session - socket is public", {
          userId: result.data.id,
        });
      } else if (!cookieToken) {
        // Server-to-server connector token rejected: it will fall back to a
        // guest socket whose user/{id} subscriptions all get denied. Say why.
        logger.warn("[WS] Query token rejected - connecting as guest", {
          connectorInstanceId:
            url.searchParams.get("connectorInstanceId") ?? undefined,
          reason: result.message,
        });
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

// ─── Denial diagnostics ───────────────────────────────────────────────────────

/**
 * Diagnostic fields for a denied subscribe. For `user/{uid}/…` channels it
 * tells WHY the prefix did not match: a tab that still holds the guest identity
 * after a login (in this or another tab) asks for `user/{leadId}/…` while its
 * reconnected socket carries the logged-in cookie (`identityMismatch:
 * "client-guest-socket-user"`); that tab then receives no user-channel events
 * until it reloads. `"socket-guest-other-uid"` = a guest socket asked for a uid
 * that is not its lead (logout elsewhere, expired session, rotated lead
 * cookie). `"foreign"` = a logged-in socket asked for an unrelated uid.
 *
 * `requestedUidIsLinkedLead`: the requested uid is an older lead of the socket
 * user (user_lead_links). The JWT only carries the CURRENT lead cookie, so a
 * guest tab left open across a signup (lead rotated on signup) asks for a lead
 * the socket no longer names; without the link check that read as "foreign"
 * (2026-11-15, lead 04de8f9b of user f6e5cfb8).
 */
export function describeSubscribeIdentity(
  user: JwtPayloadType,
  channel: string,
  requestedUidIsLinkedLead = false,
): {
  requestedUid?: string;
  socketUid?: string;
  identityMismatch?:
    | "client-guest-socket-user"
    | "socket-guest-other-uid"
    | "foreign";
} {
  const socketUid = user.isPublic ? user.leadId : user.id;
  const match = /^user\/([^/]+)\//.exec(channel);
  if (!match) {
    // Endpoint (resource) channel: the socket identity still tells a guest
    // socket left over from a signup (private folder denied) from a stranger.
    return { socketUid };
  }
  const requestedUid = match[1];
  if (
    !user.isPublic &&
    (requestedUid === user.leadId || requestedUidIsLinkedLead)
  ) {
    return {
      requestedUid,
      socketUid,
      identityMismatch: "client-guest-socket-user",
    };
  }
  return {
    requestedUid,
    socketUid,
    identityMismatch: user.isPublic ? "socket-guest-other-uid" : "foreign",
  };
}

/**
 * Denial-path only: is `channel`'s `user/{uid}/` an older lead of the
 * logged-in socket user? One indexed lookup per denied subscribe.
 */
export async function isRequestedUidLinkedLead(
  user: JwtPayloadType,
  channel: string,
): Promise<boolean> {
  if (user.isPublic) {
    return false;
  }
  const requestedUid = /^user\/([^/]+)\//.exec(channel)?.[1];
  if (!requestedUid || requestedUid === user.leadId) {
    return false;
  }
  try {
    const [{ db }, { userLeadLinks }, { and, eq }] = await Promise.all([
      import("../../database"),
      import("../../identity/lead/db"),
      import("drizzle-orm"),
    ]);
    const [row] = await db
      .select({ id: userLeadLinks.id })
      .from(userLeadLinks)
      .where(
        and(
          eq(userLeadLinks.userId, user.id),
          eq(userLeadLinks.leadId, requestedUid),
        ),
      )
      .limit(1);
    return row !== undefined;
  } catch {
    // Not a uuid / DB hiccup: the denial still logs, just unclassified.
    return false;
  }
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
    // User-scoped endpoint channels: `user/{uid}/ws-…`. Identity is the
    // boundary — only the owner may join their own prefix. Everything the
    // emitter delivers under that prefix is the owner's own data by
    // construction, so no per-endpoint resolver runs here. (A reverse-ws
    // connector authenticates as the peer-account user and joins the bridge
    // endpoint's user-scoped channel exactly this way.)
    return channel.startsWith(`user/${userId}/`);
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
    await import("../../core/permissions/registry");
  const { Platform } = await import("../../platforms/platforms");
  const roleResult = permissionsRegistry.validateEndpointAccess(
    entry.endpoint,
    user,
    Platform.NEXT_PAGE,
  );
  if (!roleResult.allowed) {
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
