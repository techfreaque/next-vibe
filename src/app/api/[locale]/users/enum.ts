import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * User Sort Fields Enum
 */
export const {
  enum: UserSortField,
  options: UserSortFieldOptions,
  Value: UserSortFieldValue,
} = createEnumOptions({
  CREATED_AT: "app.api.users.list.enums.userSortField.createdAt",
  UPDATED_AT: "app.api.users.list.enums.userSortField.updatedAt",
  EMAIL: "app.api.users.list.enums.userSortField.email",
  PRIVATE_NAME: "app.api.users.list.enums.userSortField.privateName",
  PUBLIC_NAME: "app.api.users.list.enums.userSortField.publicName",
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
} = createEnumOptions({
  ASC: "app.api.users.list.enums.sortOrder.asc",
  DESC: "app.api.users.list.enums.sortOrder.desc",
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
  ALL: "app.api.users.list.enums.userStatusFilter.all",
  ACTIVE: "app.api.users.list.enums.userStatusFilter.active",
  INACTIVE: "app.api.users.list.enums.userStatusFilter.inactive",
  PENDING: "app.api.users.list.enums.userStatusFilter.pending",
  SUSPENDED: "app.api.users.list.enums.userStatusFilter.suspended",
  EMAIL_VERIFIED: "app.api.users.list.enums.userStatusFilter.emailVerified",
  EMAIL_UNVERIFIED: "app.api.users.list.enums.userStatusFilter.emailUnverified",
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
  ACTIVE: "app.api.users.list.enums.userStatus.active",
  INACTIVE: "app.api.users.list.enums.userStatus.inactive",
  PENDING: "app.api.users.list.enums.userStatus.pending",
  SUSPENDED: "app.api.users.list.enums.userStatus.suspended",
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
  ALL: "app.api.users.list.enums.userRoleFilter.all",
  USER: "app.api.users.list.enums.userRoleFilter.user",
  PUBLIC: "app.api.users.list.enums.userRoleFilter.public",
  CUSTOMER: "app.api.users.list.enums.userRoleFilter.customer",
  MODERATOR: "app.api.users.list.enums.userRoleFilter.moderator",
  PARTNER_ADMIN: "app.api.users.list.enums.userRoleFilter.partnerAdmin",
  PARTNER_EMPLOYEE: "app.api.users.list.enums.userRoleFilter.partnerEmployee",
  ADMIN: "app.api.users.list.enums.userRoleFilter.admin",
  SUPER_ADMIN: "app.api.users.list.enums.userRoleFilter.superAdmin",
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
} = createEnumOptions({
  ALL: "app.api.users.stats.enums.subscriptionStatusFilter.all",
  ACTIVE: "app.api.users.stats.enums.subscriptionStatusFilter.active",
  TRIALING: "app.api.users.stats.enums.subscriptionStatusFilter.trialing",
  PAST_DUE: "app.api.users.stats.enums.subscriptionStatusFilter.pastDue",
  CANCELED: "app.api.users.stats.enums.subscriptionStatusFilter.canceled",
  UNPAID: "app.api.users.stats.enums.subscriptionStatusFilter.unpaid",
  PAUSED: "app.api.users.stats.enums.subscriptionStatusFilter.paused",
  NO_SUBSCRIPTION: "app.api.users.stats.enums.subscriptionStatusFilter.noSubscription",
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
} = createEnumOptions({
  ALL: "app.api.users.stats.enums.paymentMethodFilter.all",
  CARD: "app.api.users.stats.enums.paymentMethodFilter.card",
  BANK_TRANSFER: "app.api.users.stats.enums.paymentMethodFilter.bankTransfer",
  PAYPAL: "app.api.users.stats.enums.paymentMethodFilter.paypal",
  APPLE_PAY: "app.api.users.stats.enums.paymentMethodFilter.applePay",
  GOOGLE_PAY: "app.api.users.stats.enums.paymentMethodFilter.googlePay",
  SEPA_DEBIT: "app.api.users.stats.enums.paymentMethodFilter.sepaDebit",
  CRYPTO: "app.api.users.stats.enums.paymentMethodFilter.crypto",
  NO_PAYMENT_METHOD: "app.api.users.stats.enums.paymentMethodFilter.noPaymentMethod",
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
