/**
 * Users List Enums
 * Filters and sort fields that only the admin users list uses.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * Sortable columns
 */
export const {
  enum: UserListSortField,
  options: UserListSortFieldOptions,
  Value: UserListSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  CREATED_AT: "enums.sortField.createdAt",
  LAST_ACTIVE: "enums.sortField.lastActive",
  CREDITS: "enums.sortField.credits",
  TOTAL_PAID: "enums.sortField.totalPaid",
  CREDITS_SPENT: "enums.sortField.creditsSpent",
  EMAIL: "enums.sortField.email",
  NAME: "enums.sortField.name",
});

/**
 * Account state (multi-select, user matches ANY selected)
 */
export const {
  enum: AccountStateFilter,
  options: AccountStateFilterOptions,
  Value: AccountStateFilterValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.accountState.active",
  INACTIVE: "enums.accountState.inactive",
  BANNED: "enums.accountState.banned",
  VERIFIED: "enums.accountState.verified",
  UNVERIFIED: "enums.accountState.unverified",
});

/**
 * Paid vs free: paid = at least one succeeded payment ever
 */
export const {
  enum: PayerFilter,
  options: PayerFilterOptions,
  Value: PayerFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.payer.any",
  PAID: "enums.payer.paid",
  FREE: "enums.payer.free",
});

/**
 * Last activity window (activity = credit spend or a new login session)
 */
export const {
  enum: LastActiveFilter,
  options: LastActiveFilterOptions,
  Value: LastActiveFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.lastActive.any",
  DAY: "enums.lastActive.day",
  WEEK: "enums.lastActive.week",
  MONTH: "enums.lastActive.month",
  DORMANT: "enums.lastActive.dormant",
  NEVER: "enums.lastActive.never",
});

/**
 * Sort direction
 */
export const {
  enum: ListSortOrder,
  options: ListSortOrderOptions,
  Value: ListSortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "enums.sortOrder.asc",
  DESC: "enums.sortOrder.desc",
});

/**
 * Role filter (multi-select, user holds ANY selected role)
 */
export const {
  enum: RoleFilter,
  options: RoleFilterOptions,
  Value: RoleFilterValue,
} = createEnumOptions(scopedTranslation, {
  ADMIN: "enums.role.admin",
  CUSTOMER: "enums.role.customer",
  PARTNER_ADMIN: "enums.role.partnerAdmin",
  PARTNER_EMPLOYEE: "enums.role.partnerEmployee",
  PUBLIC: "enums.role.public",
});

/**
 * Subscription presence
 */
export const {
  enum: SubscriptionFilter,
  options: SubscriptionFilterOptions,
  Value: SubscriptionFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.subscription.any",
  HAS_ACTIVE: "enums.subscription.hasActive",
  HAD_ANY: "enums.subscription.hadAny",
  NEVER: "enums.subscription.never",
});

/**
 * What a user produced as a referrer
 */
export const {
  enum: ReferrerFilter,
  options: ReferrerFilterOptions,
  Value: ReferrerFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.referrer.any",
  HAS_CODE: "enums.referrer.hasCode",
  HAS_CLICKS: "enums.referrer.hasClicks",
  HAS_SIGNUPS: "enums.referrer.hasSignups",
  HAS_SUBSCRIBERS: "enums.referrer.hasSubscribers",
});
