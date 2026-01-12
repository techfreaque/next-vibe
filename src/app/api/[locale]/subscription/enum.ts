/**
 * Subscription API Enums
 * Defines subscription-related enumerations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Subscription plans available in the system
 */
export const {
  enum: SubscriptionPlan,
  options: SubscriptionPlanOptions,
  Value: SubscriptionPlanValue,
} = createEnumOptions({
  SUBSCRIPTION: "app.api.subscription.enums.plan.subscription",
});

/**
 * Subscription status values
 */
export const {
  enum: SubscriptionStatus,
  options: SubscriptionStatusOptions,
  Value: SubscriptionStatusValue,
} = createEnumOptions({
  INCOMPLETE: "app.api.subscription.enums.status.incomplete",
  INCOMPLETE_EXPIRED: "app.api.subscription.enums.status.incompleteExpired",
  TRIALING: "app.api.subscription.enums.status.trialing",
  ACTIVE: "app.api.subscription.enums.status.active",
  PAST_DUE: "app.api.subscription.enums.status.pastDue",
  CANCELED: "app.api.subscription.enums.status.canceled",
  UNPAID: "app.api.subscription.enums.status.unpaid",
  PAUSED: "app.api.subscription.enums.status.paused",
});

/**
 * Billing interval options
 */
export const {
  enum: BillingInterval,
  options: BillingIntervalOptions,
  Value: BillingIntervalValue,
} = createEnumOptions({
  MONTHLY: "app.api.subscription.enums.billing.monthly",
  YEARLY: "app.api.subscription.enums.billing.yearly",
});

/**
 * Cancellation reasons
 */
export const {
  enum: CancellationReason,
  options: CancellationReasonOptions,
  Value: CancellationReasonValue,
} = createEnumOptions({
  TOO_EXPENSIVE: "app.api.subscription.enums.cancellation.tooExpensive",
  MISSING_FEATURES: "app.api.subscription.enums.cancellation.missingFeatures",
  SWITCHING_SERVICE: "app.api.subscription.enums.cancellation.switchingService",
  TEMPORARY_PAUSE: "app.api.subscription.enums.cancellation.temporaryPause",
  OTHER: "app.api.subscription.enums.cancellation.other",
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
