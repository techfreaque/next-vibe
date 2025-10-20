/**
 * Subscription API Enums
 * Defines subscription-related enumerations
 */

import { createEnumOptions } from "../system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Subscription plans available in the system
 */
export const { enum: SubscriptionPlan, options: SubscriptionPlanOptions } =
  createEnumOptions({
    SUBSCRIPTION: "app.api.v1.core.subscription.enums.plan.subscription",
  });

/**
 * Subscription status values
 */
export const { enum: SubscriptionStatus, options: SubscriptionStatusOptions } =
  createEnumOptions({
    INCOMPLETE: "app.api.v1.core.subscription.enums.status.incomplete",
    INCOMPLETE_EXPIRED:
      "app.api.v1.core.subscription.enums.status.incompleteExpired",
    TRIALING: "app.api.v1.core.subscription.enums.status.trialing",
    ACTIVE: "app.api.v1.core.subscription.enums.status.active",
    PAST_DUE: "app.api.v1.core.subscription.enums.status.pastDue",
    CANCELED: "app.api.v1.core.subscription.enums.status.canceled",
    UNPAID: "app.api.v1.core.subscription.enums.status.unpaid",
    PAUSED: "app.api.v1.core.subscription.enums.status.paused",
  });

/**
 * Billing interval options
 */
export const { enum: BillingInterval, options: BillingIntervalOptions } =
  createEnumOptions({
    MONTHLY: "app.api.v1.core.subscription.enums.billing.monthly",
    YEARLY: "app.api.v1.core.subscription.enums.billing.yearly",
  });

/**
 * Cancellation reasons
 */
export const { enum: CancellationReason, options: CancellationReasonOptions } =
  createEnumOptions({
    TOO_EXPENSIVE:
      "app.api.v1.core.subscription.enums.cancellation.tooExpensive",
    MISSING_FEATURES:
      "app.api.v1.core.subscription.enums.cancellation.missingFeatures",
    SWITCHING_SERVICE:
      "app.api.v1.core.subscription.enums.cancellation.switchingService",
    TEMPORARY_PAUSE:
      "app.api.v1.core.subscription.enums.cancellation.temporaryPause",
    OTHER: "app.api.v1.core.subscription.enums.cancellation.other",
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

/**
 * Value types derived directly from DB arrays - ensures same type everywhere
 */
export type SubscriptionPlanValue = (typeof SubscriptionPlanDB)[number];
export type SubscriptionStatusValue = (typeof SubscriptionStatusDB)[number];
export type BillingIntervalValue = (typeof BillingIntervalDB)[number];
export type CancellationReasonValue = (typeof CancellationReasonDB)[number];
