/**
 * CLI user resolution — the auth seam.
 *
 * Resolves WHO the CLI is acting as before an endpoint runs. The full version
 * consults env + the session file + the DB (via ./auth/cli-user) to load a real
 * user, falling back to the synthetic CLI_AUTH_BYPASS admin.
 *
 * WHY IT IS A SEPARATE FILE
 * This is the ONLY reason the CLI runtime reaches the auth stack (identity/auth
 * base-auth-handler, identity/env) and the database on a normal command. The
 * access decision itself does NOT live here — that is the permission registry's
 * job, driven by allowedRoles + platform markers, and it runs identically either
 * way.
 *
 * A deployment that trusts its local operator (a dev CLI on your own machine)
 * has no session to resolve: it swaps ./route-executor's single import for
 * ./cli-auth-local, always acts as the marker-driven bypass admin, and drops the
 * auth + DB dependency surface. Platform markers and allowedRoles still gate
 * every endpoint exactly as before.
 */

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import type {
  JwtPayloadType,
  JWTPublicPayloadType,
} from "../../../identity/auth/types";
import {
  filterPlatformMarkers,
  PlatformMarker,
  UserPermissionRole,
} from "../../../identity/roles/enum";
import type { EndpointLogger } from "../../../logger/types";
import { createCliBypassUser } from "../auth/cli-bypass-user";
import type { getCliUser } from "../auth/cli-user";
import { CliTarget, type CliTargetValue } from "../types/cli-target";
import { Platform } from "../../platforms";

// Lazy-loaded: only needed for MCP + non-bypass paths, not for normal `vibe c`
let _getCliUser: typeof getCliUser | null = null;
async function loadGetCliUser(): Promise<typeof getCliUser> {
  if (!_getCliUser) {
    _getCliUser = (await import("../auth/cli-user")).getCliUser;
  }
  return _getCliUser;
}

/**
 * Resolve the CLI user for this command.
 *
 * On the local CLI, CLI_AUTH_BYPASS means what it says: no auth, and therefore
 * no database. MCP and remote targets still try for a real user, because there
 * the caller's identity is not a given.
 */
export async function resolveCliUser(params: {
  endpoint: CreateApiEndpointAny | null | undefined;
  platform: Platform;
  cliTarget: CliTargetValue;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<JwtPayloadType> {
  const { endpoint, platform, cliTarget, locale, logger } = params;

  const isCliAuthBypass =
    endpoint !== null &&
    endpoint !== undefined &&
    filterPlatformMarkers(endpoint.allowedRoles).includes(
      PlatformMarker.CLI_AUTH_BYPASS,
    );

  if (
    isCliAuthBypass &&
    platform !== Platform.MCP &&
    cliTarget !== CliTarget.REMOTE
  ) {
    // No DB, for every bypass route — not just `check`.
    //
    // This used to try the real admin user first and fall back to the synthetic
    // one, with `check` string-matched out of that path "for performance". Two
    // problems: the match was on the command name, so it broke the moment an
    // alias changed; and the fallback only helps if the lookup RETURNS. With no
    // database reachable the connection never resolves, so `vibe gen` and
    // `vibe setup` hung forever instead of falling back — on a developer machine
    // that has no reason to run Postgres to generate a file.
    //
    // A route that genuinely needs the real user must not declare
    // CLI_AUTH_BYPASS; the marker's whole meaning is that it does not.
    return createCliBypassUser();
  }

  if (
    isCliAuthBypass &&
    platform === Platform.MCP &&
    cliTarget !== CliTarget.REMOTE
  ) {
    // MCP with CLI_AUTH_BYPASS: try DB/session for a real user, fall back to bypass
    const cliUserResult = await (await loadGetCliUser())(logger, locale);
    return cliUserResult.success && !cliUserResult.data.isPublic
      ? cliUserResult.data
      : createCliBypassUser();
  }

  const cliUserResult = await (await loadGetCliUser())(logger, locale);
  if (cliUserResult.success) {
    return cliUserResult.data;
  }
  logger.debug("Failed to get CLI user", cliUserResult);
  return {
    isPublic: true,
    leadId: "temp-for-loading",
    roles: [UserPermissionRole.PUBLIC],
  } satisfies JWTPublicPayloadType;
}
