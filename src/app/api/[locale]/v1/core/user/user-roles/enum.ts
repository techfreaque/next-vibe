import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

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
  CLI_OFF: "app.api.v1.core.user.userRoles.enums.userRole.cliOff",
  AI_TOOL_OFF: "app.api.v1.core.user.userRoles.enums.userRole.aiToolOff",
  WEB_OFF: "app.api.v1.core.user.userRoles.enums.userRole.webOff",
});

// Create DB enum array for Drizzle
export const UserRoleDB = [
  UserRole.PUBLIC,
  UserRole.CUSTOMER,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
  UserRole.ADMIN,
  UserRole.CLI_OFF,
  UserRole.AI_TOOL_OFF,
  UserRole.WEB_OFF,
] as const;
