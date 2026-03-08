import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * User Permission Roles - Actual roles assigned to users in the database
 * These represent what a user is allowed to do (permissions)
 */
export const {
  enum: UserPermissionRole,
  options: UserPermissionRoleOptions,
  Value: UserPermissionRoleValue,
} = createEnumOptions(scopedTranslation, {
  PUBLIC: "enums.userRole.public",
  CUSTOMER: "enums.userRole.customer",
  PARTNER_ADMIN: "enums.userRole.partnerAdmin",
  PARTNER_EMPLOYEE: "enums.userRole.partnerEmployee",
  ADMIN: "enums.userRole.admin",
});

/**
 * Platform Access Markers - Configuration markers for endpoint platform access
 * These are NEVER stored in database or assigned to users
 *
 * Opt-out markers (_OFF): block a specific platform. All endpoints are accessible
 * by default; add the marker to exclude from that platform.
 *   CLI_OFF       — not available on CLI / MCP (shared opt-out for agent platforms)
 *   AI_TOOL_OFF   — not available as an AI tool
 *   WEB_OFF       — not available on web (tRPC, Next.js pages/API)
 *   MCP_OFF       — not available on MCP specifically (in addition to CLI_OFF)
 *   SKILL_OFF     — excluded from AI skill markdown files (AGENT.md, character skill files, etc.)
 *   PRODUCTION_OFF — disabled in production environment
 *
 * Opt-in markers: endpoint must explicitly include these to be accessible.
 *   MCP_VISIBLE   — endpoint appears in the MCP server's tool *discovery* list
 *   CLI_AUTH_BYPASS — endpoint is accessible without auth for basic routes like check, dev, etc.
 */
export const {
  enum: PlatformMarker,
  options: PlatformMarkerOptions,
  Value: PlatformMarkerValue,
} = createEnumOptions(scopedTranslation, {
  CLI_OFF: "enums.userRole.cliOff",
  CLI_AUTH_BYPASS: "enums.userRole.cliAuthBypass",
  AI_TOOL_OFF: "enums.userRole.aiToolOff",
  WEB_OFF: "enums.userRole.webOff",
  MCP_OFF: "enums.userRole.mcpOff",
  MCP_VISIBLE: "enums.userRole.mcpVisible",
  PRODUCTION_OFF: "enums.userRole.productionOff",
  SKILL_OFF: "enums.userRole.skillOff",
});

/**
 * Combined UserRole enum for backward compatibility and endpoint definitions
 * Endpoint definitions can mix permission roles and platform markers
 */
export const UserRole = {
  ...UserPermissionRole,
  ...PlatformMarker,
} as const;

export type UserRoleValue =
  | typeof UserPermissionRoleValue
  | typeof PlatformMarkerValue;

export const UserRoleOptions = [
  ...UserPermissionRoleOptions,
  ...PlatformMarkerOptions,
];

/**
 * Type guards and filters
 */

/**
 * Check if a role is a user permission role (can be assigned to users)
 */
export function isUserPermissionRole(
  role: UserRoleValue,
): role is typeof UserPermissionRoleValue {
  return !isPlatformMarker(role);
}

/**
 * Check if a role is a platform access marker (config-only, never assigned to users)
 */
export function isPlatformMarker(
  role: UserRoleValue,
): role is typeof PlatformMarkerValue {
  return (
    role === PlatformMarker.CLI_OFF ||
    role === PlatformMarker.WEB_OFF ||
    role === PlatformMarker.AI_TOOL_OFF ||
    role === PlatformMarker.MCP_OFF ||
    role === PlatformMarker.MCP_VISIBLE ||
    role === PlatformMarker.PRODUCTION_OFF ||
    role === PlatformMarker.CLI_AUTH_BYPASS ||
    role === PlatformMarker.SKILL_OFF
  );
}

/**
 * Filter array to get only user permission roles
 */
export function filterUserPermissionRoles(
  roles: readonly UserRoleValue[],
): (typeof UserPermissionRoleValue)[] {
  return roles.filter(isUserPermissionRole);
}

/**
 * Filter array to get only platform markers
 */
export function filterPlatformMarkers(
  roles: readonly UserRoleValue[],
): (typeof PlatformMarkerValue)[] {
  return roles.filter(isPlatformMarker);
}

/**
 * Database enum array for Drizzle - ONLY user permission roles
 * Platform markers should NEVER be stored in the database
 */
export const UserRoleDB = [
  UserPermissionRole.PUBLIC,
  UserPermissionRole.CUSTOMER,
  UserPermissionRole.PARTNER_ADMIN,
  UserPermissionRole.PARTNER_EMPLOYEE,
  UserPermissionRole.ADMIN,
] as const;
