/**
 * Provider switch rules (pure, no IO)
 *
 * Chosen carry-over rule: the subscriber never pays twice for the same time
 * and never loses paid time or credits.
 * - Billing on the new provider begins when the old paid period ends
 *   (`billingStartAt`). Past due: nothing is paid, so it begins now.
 * - EXTEND_FIRST_PERIOD providers charge at checkout; the first new period
 *   then runs from now until billingStartAt + one interval, and the new
 *   period's credits are granted at once (they expire with that period).
 * - DEFERRED_START providers start billing at billingStartAt themselves; the
 *   row stays active until then on the old paid time and no credits are
 *   granted at checkout (the first paid renewal grants them).
 * - The old plan's credits are untouched and keep their own expiry.
 * - The old card plan is cancelled immediately when it is past due (stops a
 *   late retry from charging a second time) or when its processor takes no
 *   charges anyway; otherwise at period end. Immediate cancel never refunds:
 *   the remaining paid time is what the new period carries over.
 */

import {
  BillingInterval,
  SubscriptionStatus,
  type SubscriptionStatusValue,
} from "../enum";
import { OldPlanCancelMode, SwitchCarryOver } from "./enum";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Same period length the NOWPayments one-off plans use. */
export function intervalMs(billingInterval: string): number {
  return billingInterval === BillingInterval.YEARLY
    ? 365 * DAY_MS
    : 30 * DAY_MS;
}

/** Statuses that still bill on the old card plan. */
export const SWITCHABLE_STATUSES: readonly (typeof SubscriptionStatusValue)[] =
  [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.TRIALING,
    SubscriptionStatus.PAST_DUE,
  ];

export interface SwitchSubscriptionState {
  status: string;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  gracePeriodEndsAt: Date | null;
}

export function resolveBillingStartAt(
  subscription: SwitchSubscriptionState,
  now: Date,
): Date {
  if (subscription.status === SubscriptionStatus.PAST_DUE) {
    return now;
  }
  const paidUntil =
    subscription.status === SubscriptionStatus.TRIALING
      ? (subscription.trialEnd ?? subscription.currentPeriodEnd)
      : subscription.currentPeriodEnd;
  return paidUntil && paidUntil.getTime() > now.getTime() ? paidUntil : now;
}

/**
 * Last day the plan stays live without action: the period end, or the end of
 * the grace period for a past-due plan.
 */
export function resolveSwitchDeadline(
  subscription: SwitchSubscriptionState,
): Date | null {
  if (subscription.status === SubscriptionStatus.PAST_DUE) {
    return subscription.gracePeriodEndsAt ?? subscription.currentPeriodEnd;
  }
  if (subscription.status === SubscriptionStatus.TRIALING) {
    return subscription.trialEnd ?? subscription.currentPeriodEnd;
  }
  return subscription.currentPeriodEnd;
}

export function resolveOldPlanCancelMode(
  status: string,
  oldProcessorChargesPaused: boolean,
): typeof OldPlanCancelMode.AT_PERIOD_END | typeof OldPlanCancelMode.IMMEDIATE {
  if (status === SubscriptionStatus.PAST_DUE || oldProcessorChargesPaused) {
    return OldPlanCancelMode.IMMEDIATE;
  }
  return OldPlanCancelMode.AT_PERIOD_END;
}

export interface SwitchedPeriod {
  periodStart: Date;
  periodEnd: Date;
  /** Grant the new period's credits at checkout. */
  grantCreditsNow: boolean;
}

export function resolveSwitchedPeriod(params: {
  carryOver: string;
  billingStartAt: Date;
  billingInterval: string;
  now: Date;
}): SwitchedPeriod {
  const { carryOver, billingStartAt, billingInterval, now } = params;
  const startsLater = billingStartAt.getTime() > now.getTime();
  if (carryOver === SwitchCarryOver.DEFERRED_START && startsLater) {
    return {
      periodStart: now,
      periodEnd: billingStartAt,
      grantCreditsNow: false,
    };
  }
  const anchor = startsLater ? billingStartAt : now;
  return {
    periodStart: now,
    periodEnd: new Date(anchor.getTime() + intervalMs(billingInterval)),
    grantCreditsNow: true,
  };
}
