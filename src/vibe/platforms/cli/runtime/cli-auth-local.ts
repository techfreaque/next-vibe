/**
 * CLI user resolution — local-only seam.
 *
 * Same contract as ./cli-auth, with the session/DB lookup removed. The CLI always
 * acts as the marker-driven bypass admin.
 *
 * WHAT THIS DOES *NOT* WEAKEN
 * Access control is unchanged. Whether an endpoint may run on this platform, and
 * for which roles, is decided by the permission registry from the endpoint's
 * `allowedRoles` + platform markers (CLI_OFF / MCP_OFF / MCP_VISIBLE /
 * PRODUCTION_OFF / CLI_AUTH_BYPASS) — not here. This function only answers
 * "which user record do we present", and the answer is the same admin the full
 * version already falls back to whenever no session exists.
 *
 * WHAT IT DOES CHANGE, PLAINLY
 * There is no multi-user CLI: every command runs as the bypass admin, so an
 * endpoint that is admin-gated is reachable by whoever can run the binary. That
 * is the correct trade for a local dev CLI on a trusted machine (the full
 * version already degrades to exactly this when the session file is absent), and
 * the wrong one for anything serving multiple users — use ./cli-auth there.
 *
 * HOW TO USE IT: point ./route-executor's `./cli-auth` import at this file. That
 * ONE line is the switch; ./auth/cli-user.ts, ./auth/session-file.ts and the
 * identity/DB dependency surface can then be dropped.
 */

import type { CreateApiEndpointAny } from "../../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../../core/i18n/core/config";
import type { JwtPayloadType } from "../../../identity/auth/types";
import type { EndpointLogger } from "../../../logger/types";
import { createCliBypassUser } from "../auth/cli-bypass-user";
import type { CliTargetValue } from "../types/cli-target";
import type { Platform } from "../../platforms";

/** Always the marker-driven bypass admin. See the note above on what this trades. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- seam parity: the signature must match ./cli-auth
export function resolveCliUser(_params: {
  endpoint: CreateApiEndpointAny | null | undefined;
  platform: Platform;
  cliTarget: CliTargetValue;
  locale: CountryLanguage;
  logger: EndpointLogger;
}): Promise<JwtPayloadType> {
  return Promise.resolve(createCliBypassUser());
}
