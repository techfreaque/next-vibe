import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * User Sort Fields Enum
 */
export const {
  enum: UserSortField,
  options: UserSortFieldOptions,
  Value: UserSortFieldValue,
} = createEnumOptions({
  CREATED_AT: "app.api.v1.core.users.list.enums.userSortField.createdAt",
  UPDATED_AT: "app.api.v1.core.users.list.enums.userSortField.updatedAt",
  EMAIL: "app.api.v1.core.users.list.enums.userSortField.email",
  FIRST_NAME: "app.api.v1.core.users.list.enums.userSortField.firstName",
  LAST_NAME: "app.api.v1.core.users.list.enums.userSortField.lastName",
  COMPANY: "app.api.v1.core.users.list.enums.userSortField.company",
  LAST_LOGIN: "app.api.v1.core.users.list.enums.userSortField.lastLogin",
});
export const UserSortFieldDB = [
  UserSortField.CREATED_AT,
  UserSortField.UPDATED_AT,
  UserSortField.EMAIL,
  UserSortField.FIRST_NAME,
  UserSortField.LAST_NAME,
  UserSortField.COMPANY,
  UserSortField.LAST_LOGIN,
] as const;

/**
 * Sort Order Enum
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions({
  ASC: "app.api.v1.core.users.list.enums.sortOrder.asc",
  DESC: "app.api.v1.core.users.list.enums.sortOrder.desc",
});
export const SortOrderDB = [SortOrder.ASC, SortOrder.DESC] as const;

/**
 * User Status Filter Enum
 */
export const {
  enum: UserStatusFilter,
  options: UserStatusFilterOptions,
  Value: UserStatusFilterValue,
} = createEnumOptions({
  ALL: "app.api.v1.core.users.list.enums.userStatusFilter.all",
  ACTIVE: "app.api.v1.core.users.list.enums.userStatusFilter.active",
  INACTIVE: "app.api.v1.core.users.list.enums.userStatusFilter.inactive",
  PENDING: "app.api.v1.core.users.list.enums.userStatusFilter.pending",
  SUSPENDED: "app.api.v1.core.users.list.enums.userStatusFilter.suspended",
  EMAIL_VERIFIED:
    "app.api.v1.core.users.list.enums.userStatusFilter.emailVerified",
  EMAIL_UNVERIFIED:
    "app.api.v1.core.users.list.enums.userStatusFilter.emailUnverified",
});
export const UserStatusFilterDB = [
  UserStatusFilter.ALL,
  UserStatusFilter.ACTIVE,
  UserStatusFilter.INACTIVE,
  UserStatusFilter.PENDING,
  UserStatusFilter.SUSPENDED,
  UserStatusFilter.EMAIL_VERIFIED,
  UserStatusFilter.EMAIL_UNVERIFIED,
] as const;

/**
 * User Status Enum
 */
export const {
  enum: UserStatus,
  options: UserStatusOptions,
  Value: UserStatusValue,
} = createEnumOptions({
  ACTIVE: "app.api.v1.core.users.list.enums.userStatus.active",
  INACTIVE: "app.api.v1.core.users.list.enums.userStatus.inactive",
  PENDING: "app.api.v1.core.users.list.enums.userStatus.pending",
  SUSPENDED: "app.api.v1.core.users.list.enums.userStatus.suspended",
});
export const UserStatusDB = [
  UserStatus.ACTIVE,
  UserStatus.INACTIVE,
  UserStatus.PENDING,
  UserStatus.SUSPENDED,
] as const;

/**
 * User Role Filter Enum
 */
export const {
  enum: UserRoleFilter,
  Value: UserRoleFilterValue,
  options: UserRoleFilterOptions,
} = createEnumOptions({
  ALL: "app.api.v1.core.users.list.enums.userRoleFilter.all",
  USER: "app.api.v1.core.users.list.enums.userRoleFilter.user",
  PUBLIC: "app.api.v1.core.users.list.enums.userRoleFilter.public",
  CUSTOMER: "app.api.v1.core.users.list.enums.userRoleFilter.customer",
  MODERATOR: "app.api.v1.core.users.list.enums.userRoleFilter.moderator",
  PARTNER_ADMIN: "app.api.v1.core.users.list.enums.userRoleFilter.partnerAdmin",
  PARTNER_EMPLOYEE:
    "app.api.v1.core.users.list.enums.userRoleFilter.partnerEmployee",
  ADMIN: "app.api.v1.core.users.list.enums.userRoleFilter.admin",
  SUPER_ADMIN: "app.api.v1.core.users.list.enums.userRoleFilter.superAdmin",
});
export const UserRoleFilterDB = [
  UserRoleFilter.ALL,
  UserRoleFilter.USER,
  UserRoleFilter.PUBLIC,
  UserRoleFilter.CUSTOMER,
  UserRoleFilter.MODERATOR,
  UserRoleFilter.PARTNER_ADMIN,
  UserRoleFilter.PARTNER_EMPLOYEE,
  UserRoleFilter.ADMIN,
  UserRoleFilter.SUPER_ADMIN,
] as const;
