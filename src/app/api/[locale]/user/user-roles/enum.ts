import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * User Permission Roles - Actual roles assigned to users in the database
 * These represent what a user is allowed to do (permissions)
 */
export const {
  enum: UserPermissionRole,
  options: UserPermissionRoleOptions,
  Value: UserPermissionRoleValue,
} = createEnumOptions({
  PUBLIC: "app.api.user.userRoles.enums.userRole.public",
  CUSTOMER: "app.api.user.userRoles.enums.userRole.customer",
  PARTNER_ADMIN: "app.api.user.userRoles.enums.userRole.partnerAdmin",
  PARTNER_EMPLOYEE: "app.api.user.userRoles.enums.userRole.partnerEmployee",
  ADMIN: "app.api.user.userRoles.enums.userRole.admin",
});

/**
 * Platform Access Markers - Configuration markers for endpoint platform access
 * These are NEVER stored in database or assigned to users
 * They control which platforms can access an endpoint (_OFF) or bypass auth
 * MCP_ON is an opt-in marker - only endpoints with MCP_ON are accessible via MCP
 * REMOTE_SKILL is an opt-in marker - only endpoints with REMOTE_SKILL appear in AI skill markdown files (AGENT.md, PUBLIC_USER_SKILL.md, USER_WITH_ACCOUNT_SKILL.md)
 */
export const {
  enum: PlatformMarker,
  options: PlatformMarkerOptions,
  Value: PlatformMarkerValue,
} = createEnumOptions({
  CLI_OFF: "app.api.user.userRoles.enums.userRole.cliOff",
  CLI_AUTH_BYPASS: "app.api.user.userRoles.enums.userRole.cliAuthBypass",
  AI_TOOL_OFF: "app.api.user.userRoles.enums.userRole.aiToolOff",
  WEB_OFF: "app.api.user.userRoles.enums.userRole.webOff",
  MCP_ON: "app.api.user.userRoles.enums.userRole.mcpOn",
  PRODUCTION_OFF: "app.api.user.userRoles.enums.userRole.productionOff",
  REMOTE_SKILL: "app.api.user.userRoles.enums.userRole.remoteSkill",
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
    role === PlatformMarker.MCP_ON ||
    role === PlatformMarker.PRODUCTION_OFF ||
    role === PlatformMarker.CLI_AUTH_BYPASS ||
    role === PlatformMarker.REMOTE_SKILL
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
