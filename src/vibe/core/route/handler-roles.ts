/**
 * Role → JWT payload inference.
 *
 * A leaf module by necessity, not just tidiness. This type is consumed by the
 * messaging providers (`@/messenger/**`, `@/sms/**`), which `handler.ts` in turn
 * reaches through `handler-messaging.ts`. Leaving it in `handler.ts` closes that
 * loop — handler → messaging → messenger → handler — and TypeScript resolves the
 * cycle by giving up on `MethodHandlerConfig`, which silently degrades every
 * route's `handler` parameters to implicit `any`. Keeping it here means the
 * providers depend on the role vocabulary alone and never on the handler.
 *
 * Types only; nothing here exists at runtime.
 */

import type {
  JwtPayloadType,
  JwtPrivatePayloadType,
  JWTPublicPayloadType,
} from "../../identity/auth/types";
import type { UserRole, UserRoleValue } from "../../identity/roles/enum";

/**
 * Type helper to filter out platform markers from role arrays
 * Platform markers (CLI_OFF, WEB_OFF, etc.) don't affect JWT payload type
 *
 * Platform markers are identified by their values:
 * - CLI_OFF, CLI_AUTH_BYPASS, AI_TOOL_OFF, WEB_OFF, MCP_VISIBLE, PRODUCTION_OFF, REMOTE_SKILL
 */
type FilterPlatformMarkers<TRoles extends readonly UserRoleValue[]> = Exclude<
  TRoles[number],
  | typeof UserRole.CLI_OFF
  | typeof UserRole.CLI_AUTH_BYPASS
  | typeof UserRole.AI_TOOL_OFF
  | typeof UserRole.WEB_OFF
  | typeof UserRole.MCP_VISIBLE
  | typeof UserRole.PRODUCTION_OFF
  | typeof UserRole.SKILL_OFF
>;

/**
 * Type helper for arrays of user roles
 *
 * Logic:
 * 1. First, filter out platform markers (CLI_OFF, WEB_OFF, etc.) - they don't affect auth
 * 2. Check if filtering resulted in an empty set (never):
 *    - If FilterPlatformMarkers<TRoles> is never → only platform markers, treat as private (JwtPrivatePayloadType)
 * 3. Otherwise, apply the standard logic:
 *    - Exclude<FilteredRoles, "PUBLIC"> removes "PUBLIC" from the union
 *    - If the result is never, then ONLY PUBLIC was in the filtered array → JWTPublicPayloadType
 *    - If FilteredRoles includes "PUBLIC" (check with Extract) → JwtPayloadType (mixed)
 *    - Otherwise → JwtPrivatePayloadType (no PUBLIC, guaranteed authenticated)
 *
 * Examples:
 * - ["PUBLIC", "CLI_OFF", "WEB_OFF"] → JWTPublicPayloadType (only PUBLIC after filtering)
 * - ["PUBLIC", "ADMIN", "CLI_OFF"] → JwtPayloadType (PUBLIC + ADMIN after filtering)
 * - ["ADMIN", "CLI_OFF"] → JwtPrivatePayloadType (only ADMIN after filtering)
 * - ["CLI_OFF"] → JwtPrivatePayloadType (no user permission roles, platform markers only)
 */
export type InferJwtPayloadTypeFromRoles<
  TRoles extends readonly UserRoleValue[],
> = [FilterPlatformMarkers<TRoles>] extends [never]
  ? JwtPrivatePayloadType
  : Exclude<FilterPlatformMarkers<TRoles>, typeof UserRole.PUBLIC> extends never
    ? JWTPublicPayloadType
    : Extract<
          FilterPlatformMarkers<TRoles>,
          typeof UserRole.PUBLIC
        > extends never
      ? JwtPrivatePayloadType
      : JwtPayloadType;
