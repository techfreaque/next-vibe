import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * User role enum using createEnumOptions pattern
 */
export const {
  enum: UserRole,
  options: UserRoleOptions,
  Value: UserRoleValue,
} = createEnumOptions({
  PUBLIC: "app.api.v1.core.user.userRoles.enums.userRole.public",
  CUSTOMER: "app.api.v1.core.user.userRoles.enums.userRole.customer",
  PARTNER_ADMIN: "app.api.v1.core.user.userRoles.enums.userRole.partnerAdmin",
  PARTNER_EMPLOYEE:
    "app.api.v1.core.user.userRoles.enums.userRole.partnerEmployee",
  ADMIN: "app.api.v1.core.user.userRoles.enums.userRole.admin",
  CLI_ONLY: "app.api.v1.core.user.userRoles.enums.userRole.cliOnly",
  CLI_WEB: "app.api.v1.core.user.userRoles.enums.userRole.cliWeb",
  WEB_ONLY: "app.api.v1.core.user.userRoles.enums.userRole.webOnly",
});

// Create DB enum array for Drizzle
export const UserRoleDB = [
  UserRole.PUBLIC,
  UserRole.CUSTOMER,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
  UserRole.ADMIN,
  UserRole.CLI_ONLY,
  UserRole.CLI_WEB,
  UserRole.WEB_ONLY,
] as const;
