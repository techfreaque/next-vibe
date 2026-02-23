/**
 * Subscription API Enums
 * Defines subscription-related enumerations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Subscription plans available in the system
 */
export const {
  enum: SubscriptionPlan,
  options: SubscriptionPlanOptions,
  Value: SubscriptionPlanValue,
} = createEnumOptions(scopedTranslation, {
  SUBSCRIPTION: "enums.plan.subscription",
});

/**
 * Subscription status values
 */
export const {
  enum: SubscriptionStatus,
  options: SubscriptionStatusOptions,
  Value: SubscriptionStatusValue,
} = createEnumOptions(scopedTranslation, {
  INCOMPLETE: "enums.status.incomplete",
  INCOMPLETE_EXPIRED: "enums.status.incompleteExpired",
  TRIALING: "enums.status.trialing",
  ACTIVE: "enums.status.active",
  PAST_DUE: "enums.status.pastDue",
  CANCELED: "enums.status.canceled",
  UNPAID: "enums.status.unpaid",
  PAUSED: "enums.status.paused",
});

/**
 * Billing interval options
 */
export const {
  enum: BillingInterval,
  options: BillingIntervalOptions,
  Value: BillingIntervalValue,
} = createEnumOptions(scopedTranslation, {
  MONTHLY: "enums.billing.monthly",
  YEARLY: "enums.billing.yearly",
});

/**
 * Cancellation reasons
 */
export const {
  enum: CancellationReason,
  options: CancellationReasonOptions,
  Value: CancellationReasonValue,
} = createEnumOptions(scopedTranslation, {
  TOO_EXPENSIVE: "enums.cancellation.tooExpensive",
  MISSING_FEATURES: "enums.cancellation.missingFeatures",
  SWITCHING_SERVICE: "enums.cancellation.switchingService",
  TEMPORARY_PAUSE: "enums.cancellation.temporaryPause",
  OTHER: "enums.cancellation.other",
});

/**
 * Database enum arrays for Drizzle ORM
 * Use the same const arrays everywhere - no separate Value types
 */
export const SubscriptionPlanDB = [SubscriptionPlan.SUBSCRIPTION] as const;

export const SubscriptionStatusDB = [
  SubscriptionStatus.INCOMPLETE,
  SubscriptionStatus.INCOMPLETE_EXPIRED,
  SubscriptionStatus.TRIALING,
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.PAST_DUE,
  SubscriptionStatus.CANCELED,
  SubscriptionStatus.UNPAID,
  SubscriptionStatus.PAUSED,
] as const;

export const BillingIntervalDB = [
  BillingInterval.MONTHLY,
  BillingInterval.YEARLY,
] as const;

export const CancellationReasonDB = [
  CancellationReason.TOO_EXPENSIVE,
  CancellationReason.MISSING_FEATURES,
  CancellationReason.SWITCHING_SERVICE,
  CancellationReason.TEMPORARY_PAUSE,
  CancellationReason.OTHER,
] as const;
