import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Subscription Status Filter (admin view)
 */
export const {
  enum: SubscriptionStatusAdminFilter,
  options: SubscriptionStatusAdminFilterOptions,
  Value: SubscriptionStatusAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.subscriptionStatusFilter.all",
  ACTIVE: "enums.subscriptionStatusFilter.active",
  TRIALING: "enums.subscriptionStatusFilter.trialing",
  PAST_DUE: "enums.subscriptionStatusFilter.pastDue",
  CANCELED: "enums.subscriptionStatusFilter.canceled",
  UNPAID: "enums.subscriptionStatusFilter.unpaid",
  PAUSED: "enums.subscriptionStatusFilter.paused",
});
export const SubscriptionStatusAdminFilterDB = [
  SubscriptionStatusAdminFilter.ALL,
  SubscriptionStatusAdminFilter.ACTIVE,
  SubscriptionStatusAdminFilter.TRIALING,
  SubscriptionStatusAdminFilter.PAST_DUE,
  SubscriptionStatusAdminFilter.CANCELED,
  SubscriptionStatusAdminFilter.UNPAID,
  SubscriptionStatusAdminFilter.PAUSED,
] as const;

/**
 * Billing Interval Filter
 */
export const {
  enum: BillingIntervalAdminFilter,
  options: BillingIntervalAdminFilterOptions,
  Value: BillingIntervalAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.billingIntervalFilter.any",
  MONTHLY: "enums.billingIntervalFilter.monthly",
  YEARLY: "enums.billingIntervalFilter.yearly",
});
export const BillingIntervalAdminFilterDB = [
  BillingIntervalAdminFilter.ANY,
  BillingIntervalAdminFilter.MONTHLY,
  BillingIntervalAdminFilter.YEARLY,
] as const;

/**
 * Provider Filter
 */
export const {
  enum: ProviderAdminFilter,
  options: ProviderAdminFilterOptions,
  Value: ProviderAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.providerFilter.any",
  STRIPE: "enums.providerFilter.stripe",
  NOWPAYMENTS: "enums.providerFilter.nowpayments",
});
export const ProviderAdminFilterDB = [
  ProviderAdminFilter.ANY,
  ProviderAdminFilter.STRIPE,
  ProviderAdminFilter.NOWPAYMENTS,
] as const;

/**
 * Subscription Sort Field
 */
export const {
  enum: SubscriptionSortField,
  options: SubscriptionSortFieldOptions,
  Value: SubscriptionSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  CREATED_AT: "enums.subscriptionSortField.createdAt",
  STATUS: "enums.subscriptionSortField.status",
  INTERVAL: "enums.subscriptionSortField.interval",
  USER_EMAIL: "enums.subscriptionSortField.userEmail",
});
export const SubscriptionSortFieldDB = [
  SubscriptionSortField.CREATED_AT,
  SubscriptionSortField.STATUS,
  SubscriptionSortField.INTERVAL,
  SubscriptionSortField.USER_EMAIL,
] as const;

/**
 * Sort Order
 */
export const {
  enum: SortOrder,
  options: SortOrderOptions,
  Value: SortOrderValue,
} = createEnumOptions(scopedTranslation, {
  ASC: "enums.sortOrder.asc",
  DESC: "enums.sortOrder.desc",
});
export const SortOrderDB = [SortOrder.ASC, SortOrder.DESC] as const;

/**
 * Credit Pack Type Filter
 */
export const {
  enum: CreditPackTypeAdminFilter,
  options: CreditPackTypeAdminFilterOptions,
  Value: CreditPackTypeAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.creditPackTypeFilter.any",
  SUBSCRIPTION: "enums.creditPackTypeFilter.subscription",
  PERMANENT: "enums.creditPackTypeFilter.permanent",
  BONUS: "enums.creditPackTypeFilter.bonus",
  EARNED: "enums.creditPackTypeFilter.earned",
});
export const CreditPackTypeAdminFilterDB = [
  CreditPackTypeAdminFilter.ANY,
  CreditPackTypeAdminFilter.SUBSCRIPTION,
  CreditPackTypeAdminFilter.PERMANENT,
  CreditPackTypeAdminFilter.BONUS,
  CreditPackTypeAdminFilter.EARNED,
] as const;

/**
 * Credit Pack Source Filter
 */
export const {
  enum: CreditPackSourceAdminFilter,
  options: CreditPackSourceAdminFilterOptions,
  Value: CreditPackSourceAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ANY: "enums.creditPackSourceFilter.any",
  STRIPE_PURCHASE: "enums.creditPackSourceFilter.stripePurchase",
  STRIPE_SUBSCRIPTION: "enums.creditPackSourceFilter.stripeSubscription",
  ADMIN_GRANT: "enums.creditPackSourceFilter.adminGrant",
  REFERRAL_EARNING: "enums.creditPackSourceFilter.referralEarning",
});
export const CreditPackSourceAdminFilterDB = [
  CreditPackSourceAdminFilter.ANY,
  CreditPackSourceAdminFilter.STRIPE_PURCHASE,
  CreditPackSourceAdminFilter.STRIPE_SUBSCRIPTION,
  CreditPackSourceAdminFilter.ADMIN_GRANT,
  CreditPackSourceAdminFilter.REFERRAL_EARNING,
] as const;

/**
 * Purchase Sort Field
 */
export const {
  enum: PurchaseSortField,
  options: PurchaseSortFieldOptions,
  Value: PurchaseSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  CREATED_AT: "enums.purchaseSortField.createdAt",
  AMOUNT: "enums.purchaseSortField.amount",
  TYPE: "enums.purchaseSortField.type",
  USER_EMAIL: "enums.purchaseSortField.userEmail",
});
export const PurchaseSortFieldDB = [
  PurchaseSortField.CREATED_AT,
  PurchaseSortField.AMOUNT,
  PurchaseSortField.TYPE,
  PurchaseSortField.USER_EMAIL,
] as const;

/**
 * Payout Status Filter
 */
export const {
  enum: PayoutStatusAdminFilter,
  options: PayoutStatusAdminFilterOptions,
  Value: PayoutStatusAdminFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.payoutStatusFilter.all",
  PENDING: "enums.payoutStatusFilter.pending",
  APPROVED: "enums.payoutStatusFilter.approved",
  REJECTED: "enums.payoutStatusFilter.rejected",
  PROCESSING: "enums.payoutStatusFilter.processing",
  COMPLETED: "enums.payoutStatusFilter.completed",
  FAILED: "enums.payoutStatusFilter.failed",
});
export const PayoutStatusAdminFilterDB = [
  PayoutStatusAdminFilter.ALL,
  PayoutStatusAdminFilter.PENDING,
  PayoutStatusAdminFilter.APPROVED,
  PayoutStatusAdminFilter.REJECTED,
  PayoutStatusAdminFilter.PROCESSING,
  PayoutStatusAdminFilter.COMPLETED,
  PayoutStatusAdminFilter.FAILED,
] as const;

/**
 * Referral Sort Field
 */
export const {
  enum: ReferralSortField,
  options: ReferralSortFieldOptions,
  Value: ReferralSortFieldValue,
} = createEnumOptions(scopedTranslation, {
  CREATED_AT: "enums.referralSortField.createdAt",
  EARNINGS: "enums.referralSortField.earnings",
  SIGNUPS: "enums.referralSortField.signups",
});
export const ReferralSortFieldDB = [
  ReferralSortField.CREATED_AT,
  ReferralSortField.EARNINGS,
  ReferralSortField.SIGNUPS,
] as const;

/**
 * Payout Action
 */
export const {
  enum: PayoutAction,
  options: PayoutActionOptions,
  Value: PayoutActionValue,
} = createEnumOptions(scopedTranslation, {
  APPROVE: "enums.payoutAction.approve",
  REJECT: "enums.payoutAction.reject",
  COMPLETE: "enums.payoutAction.complete",
});
export const PayoutActionDB = [
  PayoutAction.APPROVE,
  PayoutAction.REJECT,
  PayoutAction.COMPLETE,
] as const;
