/**
 * Which credit offers a viewer gets (Max, 2026-11-17): credit packs top up a
 * plan, so only a live plan unlocks them. Everyone else sees the plan tiers.
 * Pure and client-safe: the subscription page, the credits header and the
 * chat's out-of-credits card all decide from here. The server enforces the
 * same rule (subscription/active-plan.ts); this mirrors it from the GET
 * subscription response so the UI never offers a pack checkout that fails.
 */

import { PaymentProvider } from "@/payment/enum";
import {
  getTierProductForPlan,
  ProductIds,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
  type SubscriptionTier,
  type SubscriptionTierProductId,
} from "@/products/repository-client";

import type { SubscriptionGetResponseOutput } from "./definition";
import { BillingInterval, SubscriptionStatus } from "./enum";

/** Same slack as the server: a card renewal webhook may still be on its way. */
const RENEWAL_SLACK_MS = 2 * 24 * 60 * 60 * 1000;

/** Highlighted when nothing else decides: the step up most people want. */
export const RECOMMENDED_TIER: SubscriptionTierProductId =
  ProductIds.SUBSCRIPTION_PLUS;

/** How many tiers the compact (chat) offer shows before "all plans". */
export const COMPACT_TIER_COUNT = 2;

export type OfferMode =
  /** Not signed in: account first, plans shown for orientation only. */
  | "guest"
  /** Signed in without a live plan: pick a plan. Packs are locked. */
  | "plans"
  /** Live plan: top up with packs, or move to another tier. */
  | "topUp";

export interface PlanOfferState {
  mode: OfferMode;
  /** The live plan's tier, null without one. */
  currentTier: SubscriptionTierProductId | null;
  currentInterval:
    | typeof BillingInterval.MONTHLY
    | typeof BillingInterval.YEARLY
    | null;
  /** Card plans switch tiers in place; crypto plans cannot mid-period. */
  canSwitchTier: boolean;
}

export type SubscriptionSnapshot = Pick<
  SubscriptionGetResponseOutput,
  "hasSubscription" | "status" | "plan" | "billingInterval" | "provider"
> & {
  currentPeriodEnd?: SubscriptionGetResponseOutput["currentPeriodEnd"];
};

/** True while the subscription still counts as a plan (mirrors hasLivePlan). */
export function isLivePlan(
  subscription: SubscriptionSnapshot | undefined,
  now: number = Date.now(),
): boolean {
  if (!subscription?.hasSubscription || !subscription.status) {
    return false;
  }
  const { status } = subscription;
  if (status === SubscriptionStatus.PAST_DUE) {
    // The grace period is server-side; the pack checkout re-checks it.
    return true;
  }
  if (
    status !== SubscriptionStatus.ACTIVE &&
    status !== SubscriptionStatus.TRIALING
  ) {
    return false;
  }
  if (!subscription.currentPeriodEnd) {
    return true;
  }
  return (
    new Date(subscription.currentPeriodEnd).getTime() + RENEWAL_SLACK_MS > now
  );
}

export function getPlanOfferState(params: {
  isPublic: boolean;
  subscription: SubscriptionSnapshot | undefined;
  now?: number;
}): PlanOfferState {
  const { isPublic, subscription, now } = params;
  if (isPublic) {
    return {
      mode: "guest",
      currentTier: null,
      currentInterval: null,
      canSwitchTier: false,
    };
  }
  if (!subscription || !isLivePlan(subscription, now)) {
    return {
      mode: "plans",
      currentTier: null,
      currentInterval: null,
      canSwitchTier: false,
    };
  }
  const currentTier = subscription.plan
    ? (getTierProductForPlan(subscription.plan) ?? ProductIds.SUBSCRIPTION)
    : ProductIds.SUBSCRIPTION;
  const live =
    subscription.status === SubscriptionStatus.ACTIVE ||
    subscription.status === SubscriptionStatus.TRIALING;
  return {
    mode: "topUp",
    currentTier,
    currentInterval:
      subscription.billingInterval === BillingInterval.YEARLY
        ? BillingInterval.YEARLY
        : BillingInterval.MONTHLY,
    canSwitchTier: live && subscription.provider === PaymentProvider.STRIPE,
  };
}

export type TierChangeKind = "current" | "upgrade" | "downgrade" | "interval";

/**
 * What picking a tier/interval means for a subscriber. Mirrors the server
 * (SubscriptionRepository.changeStripeTier): an interval change restarts the
 * period, otherwise more credits = upgrade (charged now, prorated) and fewer
 * = downgrade (from the next renewal).
 */
export function getTierChangeKind(params: {
  currentTier: SubscriptionTierProductId;
  currentInterval:
    | typeof BillingInterval.MONTHLY
    | typeof BillingInterval.YEARLY;
  targetTier: SubscriptionTierProductId;
  targetInterval:
    | typeof BillingInterval.MONTHLY
    | typeof BillingInterval.YEARLY;
}): TierChangeKind {
  const { currentTier, currentInterval, targetTier, targetInterval } = params;
  if (currentTier === targetTier && currentInterval === targetInterval) {
    return "current";
  }
  if (currentInterval !== targetInterval) {
    return "interval";
  }
  return tierRank(targetTier) > tierRank(currentTier) ? "upgrade" : "downgrade";
}

function tierRank(tier: SubscriptionTierProductId): number {
  return SUBSCRIPTION_TIER_PRODUCT_IDS.indexOf(tier);
}

/** The next tier up from the current one, null at the top. */
export function getUpgradeTier(
  tiers: readonly SubscriptionTier[],
  currentTier: SubscriptionTierProductId,
): SubscriptionTier | null {
  const rank = tierRank(currentTier);
  return tiers.find((tier) => tierRank(tier.productId) > rank) ?? null;
}

/**
 * Which tier the plan picker opens on: the next tier up for a subscriber
 * (the move they came for), else the recommended one.
 */
export function getDefaultPickedTier(
  tiers: readonly SubscriptionTier[],
  currentTier: SubscriptionTierProductId | null,
): SubscriptionTierProductId {
  if (currentTier) {
    return (
      (getUpgradeTier(tiers, currentTier) ?? tiers.at(-1))?.productId ??
      currentTier
    );
  }
  return tiers.some((tier) => tier.productId === RECOMMENDED_TIER)
    ? RECOMMENDED_TIER
    : (tiers[0]?.productId ?? ProductIds.SUBSCRIPTION);
}

/** The cheapest tiers, for the compact offer in chat. */
export function getCompactTiers(
  tiers: readonly SubscriptionTier[],
): SubscriptionTier[] {
  return tiers.slice(0, COMPACT_TIER_COUNT);
}
