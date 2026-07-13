import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * User Sort Fields Enum
 */
export const {
  enum: UserSortField,
  options: UserSortFieldOptions,
  Value: UserSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  CREATED_AT: "list.enums.userSortField.createdAt",
  UPDATED_AT: "list.enums.userSortField.updatedAt",
  EMAIL: "list.enums.userSortField.email",
  PRIVATE_NAME: "list.enums.userSortField.privateName",
  PUBLIC_NAME: "list.enums.userSortField.publicName",
});

/**
 * Sort Order Enum
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "list.enums.sortOrder.asc",
  DESC: "list.enums.sortOrder.desc",
});

/**
 * User Status Filter Enum
 */
export const {
  enum: UserStatusFilter,
  options: UserStatusFilterOptions,
  Value: UserStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "list.enums.userStatusFilter.all",
  ACTIVE: "list.enums.userStatusFilter.active",
  INACTIVE: "list.enums.userStatusFilter.inactive",
  PENDING: "list.enums.userStatusFilter.pending",
  SUSPENDED: "list.enums.userStatusFilter.suspended",
  EMAIL_VERIFIED: "list.enums.userStatusFilter.emailVerified",
  EMAIL_UNVERIFIED: "list.enums.userStatusFilter.emailUnverified",
});

/**
 * User Status Enum
 */
export const {
  enum: UserStatus,
  options: UserStatusOptions,
  Value: UserStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "list.enums.userStatus.active",
  INACTIVE: "list.enums.userStatus.inactive",
  PENDING: "list.enums.userStatus.pending",
  SUSPENDED: "list.enums.userStatus.suspended",
});

/**
 * User Role Filter Enum
 */
export const {
  enum: UserRoleFilter,
  Value: UserRoleFilterValue,
  options: UserRoleFilterOptions,
} = createEnumOptions(scopedTranslation, {
  ALL: "list.enums.userRoleFilter.all",
  USER: "list.enums.userRoleFilter.user",
  PUBLIC: "list.enums.userRoleFilter.public",
  CUSTOMER: "list.enums.userRoleFilter.customer",
  MODERATOR: "list.enums.userRoleFilter.moderator",
  PARTNER_ADMIN: "list.enums.userRoleFilter.partnerAdmin",
  PARTNER_EMPLOYEE: "list.enums.userRoleFilter.partnerEmployee",
  ADMIN: "list.enums.userRoleFilter.admin",
  SUPER_ADMIN: "list.enums.userRoleFilter.superAdmin",
});

/**
 * Subscription Status Filter Enum (for filtering users by subscription)
 */
export const {
  enum: SubscriptionStatusFilter,
  options: SubscriptionStatusFilterOptions,
  Value: SubscriptionStatusFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "stats.enums.subscriptionStatusFilter.all",
  ACTIVE: "stats.enums.subscriptionStatusFilter.active",
  TRIALING: "stats.enums.subscriptionStatusFilter.trialing",
  PAST_DUE: "stats.enums.subscriptionStatusFilter.pastDue",
  CANCELED: "stats.enums.subscriptionStatusFilter.canceled",
  UNPAID: "stats.enums.subscriptionStatusFilter.unpaid",
  PAUSED: "stats.enums.subscriptionStatusFilter.paused",
  NO_SUBSCRIPTION: "stats.enums.subscriptionStatusFilter.noSubscription",
});

/**
 * Payment Method Filter Enum (for filtering users by payment method)
 */
export const {
  enum: PaymentMethodFilter,
  options: PaymentMethodFilterOptions,
  Value: PaymentMethodFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "stats.enums.paymentMethodFilter.all",
  CARD: "stats.enums.paymentMethodFilter.card",
  BANK_TRANSFER: "stats.enums.paymentMethodFilter.bankTransfer",
  PAYPAL: "stats.enums.paymentMethodFilter.paypal",
  APPLE_PAY: "stats.enums.paymentMethodFilter.applePay",
  GOOGLE_PAY: "stats.enums.paymentMethodFilter.googlePay",
  SEPA_DEBIT: "stats.enums.paymentMethodFilter.sepaDebit",
  CRYPTO: "stats.enums.paymentMethodFilter.crypto",
  NO_PAYMENT_METHOD: "stats.enums.paymentMethodFilter.noPaymentMethod",
});

/**
 * Subscription Presence Filter - does the user have / had a subscription?
 */
export const {
  enum: SubscriptionPresenceFilter,
  options: SubscriptionPresenceFilterOptions,
  Value: SubscriptionPresenceFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "list.enums.subscriptionPresenceFilter.any",
  HAS_ACTIVE: "list.enums.subscriptionPresenceFilter.hasActive",
  HAD_ANY: "list.enums.subscriptionPresenceFilter.hadAny",
  NEVER: "list.enums.subscriptionPresenceFilter.never",
});

/**
 * Credit Activity Filter - purchased packs / spent credits
 */
export const {
  enum: CreditActivityFilter,
  options: CreditActivityFilterOptions,
  Value: CreditActivityFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "list.enums.creditActivityFilter.any",
  BOUGHT_PACK: "list.enums.creditActivityFilter.boughtPack",
  SPENT_CREDITS: "list.enums.creditActivityFilter.spentCredits",
  NEVER_SPENT: "list.enums.creditActivityFilter.neverSpent",
});

/**
 * Threads Filter - has any threads
 */
export const {
  enum: ThreadsFilter,
  options: ThreadsFilterOptions,
  Value: ThreadsFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "list.enums.threadsFilter.any",
  HAS_THREADS: "list.enums.threadsFilter.hasThreads",
  NO_THREADS: "list.enums.threadsFilter.noThreads",
});

/**
 * Referral Activity Filter - referral link, clicks, signups, paying subscribers
 */
export const {
  enum: ReferralActivityFilter,
  options: ReferralActivityFilterOptions,
  Value: ReferralActivityFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "list.enums.referralActivityFilter.any",
  HAS_CODE: "list.enums.referralActivityFilter.hasCode",
  HAS_CLICKS: "list.enums.referralActivityFilter.hasClicks",
  HAS_SIGNUPS: "list.enums.referralActivityFilter.hasSignups",
  HAS_SUBSCRIBERS: "list.enums.referralActivityFilter.hasSubscribers",
});
