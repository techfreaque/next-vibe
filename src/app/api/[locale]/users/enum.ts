import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

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
export const UserSortFieldDB = [
  UserSortField.CREATED_AT,
  UserSortField.UPDATED_AT,
  UserSortField.EMAIL,
  UserSortField.PRIVATE_NAME,
  UserSortField.PUBLIC_NAME,
] as const;

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
export const SortOrderDB = [SortOrder.ASC, SortOrder.DESC] as const;

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
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "list.enums.userStatus.active",
  INACTIVE: "list.enums.userStatus.inactive",
  PENDING: "list.enums.userStatus.pending",
  SUSPENDED: "list.enums.userStatus.suspended",
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
export const SubscriptionStatusFilterDB = [
  SubscriptionStatusFilter.ALL,
  SubscriptionStatusFilter.ACTIVE,
  SubscriptionStatusFilter.TRIALING,
  SubscriptionStatusFilter.PAST_DUE,
  SubscriptionStatusFilter.CANCELED,
  SubscriptionStatusFilter.UNPAID,
  SubscriptionStatusFilter.PAUSED,
  SubscriptionStatusFilter.NO_SUBSCRIPTION,
] as const;

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
export const PaymentMethodFilterDB = [
  PaymentMethodFilter.ALL,
  PaymentMethodFilter.CARD,
  PaymentMethodFilter.BANK_TRANSFER,
  PaymentMethodFilter.PAYPAL,
  PaymentMethodFilter.APPLE_PAY,
  PaymentMethodFilter.GOOGLE_PAY,
  PaymentMethodFilter.SEPA_DEBIT,
  PaymentMethodFilter.CRYPTO,
  PaymentMethodFilter.NO_PAYMENT_METHOD,
] as const;
