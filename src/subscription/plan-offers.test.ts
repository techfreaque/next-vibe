import { describe, expect, it } from "bun:test";

import { PaymentProvider } from "@/payment/enum";
import { getSubscriptionTiers, ProductIds } from "@/products/repository-client";

import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import {
  getCompactTiers,
  getDefaultPickedTier,
  getPlanOfferState,
  getTierChangeKind,
  getUpgradeTier,
  isLivePlan,
  RECOMMENDED_TIER,
} from "./plan-offers";

const NOW = Date.parse("2026-11-17T12:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const tiers = getSubscriptionTiers("en-GLOBAL");

const activeCard = {
  hasSubscription: true,
  status: SubscriptionStatus.ACTIVE,
  plan: SubscriptionPlan.PLUS,
  billingInterval: BillingInterval.MONTHLY,
  provider: PaymentProvider.STRIPE,
  currentPeriodEnd: new Date(NOW + 10 * DAY),
};

describe("isLivePlan", () => {
  it("is false without a subscription", () => {
    expect(isLivePlan(undefined, NOW)).toBe(false);
    expect(isLivePlan({ hasSubscription: false }, NOW)).toBe(false);
  });

  it("counts active, trialing and past-due plans", () => {
    expect(isLivePlan(activeCard, NOW)).toBe(true);
    expect(
      isLivePlan({ ...activeCard, status: SubscriptionStatus.TRIALING }, NOW),
    ).toBe(true);
    expect(
      isLivePlan({ ...activeCard, status: SubscriptionStatus.PAST_DUE }, NOW),
    ).toBe(true);
  });

  it("keeps a past-due plan live only while its grace period runs", () => {
    const pastDue = { ...activeCard, status: SubscriptionStatus.PAST_DUE };
    expect(
      isLivePlan(
        { ...pastDue, gracePeriodEndsAt: new Date(NOW + DAY).toISOString() },
        NOW,
      ),
    ).toBe(true);
    expect(
      isLivePlan(
        { ...pastDue, gracePeriodEndsAt: new Date(NOW - DAY).toISOString() },
        NOW,
      ),
    ).toBe(false);
  });

  it("drops canceled plans and periods long over", () => {
    expect(
      isLivePlan({ ...activeCard, status: SubscriptionStatus.CANCELED }, NOW),
    ).toBe(false);
    expect(
      isLivePlan(
        {
          ...activeCard,
          currentPeriodEnd: new Date(NOW - 3 * DAY),
        },
        NOW,
      ),
    ).toBe(false);
    // Renewal webhook still on its way: one day over is still live
    expect(
      isLivePlan(
        { ...activeCard, currentPeriodEnd: new Date(NOW - DAY) },
        NOW,
      ),
    ).toBe(true);
  });
});

describe("getPlanOfferState", () => {
  it("guests get the guest flow", () => {
    expect(
      getPlanOfferState({ isPublic: true, subscription: activeCard, now: NOW })
        .mode,
    ).toBe("guest");
  });

  it("members without a live plan get plans, never packs", () => {
    const state = getPlanOfferState({
      isPublic: false,
      subscription: { ...activeCard, status: SubscriptionStatus.CANCELED },
      now: NOW,
    });
    expect(state.mode).toBe("plans");
    expect(state.currentTier).toBeNull();
    expect(
      getPlanOfferState({ isPublic: false, subscription: undefined }).mode,
    ).toBe("plans");
  });

  it("subscribers top up and know their tier", () => {
    const state = getPlanOfferState({
      isPublic: false,
      subscription: activeCard,
      now: NOW,
    });
    expect(state).toEqual({
      mode: "topUp",
      currentTier: ProductIds.SUBSCRIPTION_PLUS,
      currentInterval: BillingInterval.MONTHLY,
      canSwitchTier: true,
    });
  });

  it("crypto and past-due plans can't switch tiers in place", () => {
    expect(
      getPlanOfferState({
        isPublic: false,
        subscription: { ...activeCard, provider: PaymentProvider.NOWPAYMENTS },
        now: NOW,
      }).canSwitchTier,
    ).toBe(false);
    expect(
      getPlanOfferState({
        isPublic: false,
        subscription: { ...activeCard, status: SubscriptionStatus.PAST_DUE },
        now: NOW,
      }).canSwitchTier,
    ).toBe(false);
  });
});

describe("tier changes", () => {
  const monthly = BillingInterval.MONTHLY;
  it("classifies upgrade, downgrade, interval and current", () => {
    const base = {
      currentTier: ProductIds.SUBSCRIPTION_PLUS,
      currentInterval: monthly,
      targetInterval: monthly,
    } as const;
    expect(
      getTierChangeKind({ ...base, targetTier: ProductIds.SUBSCRIPTION_PRO }),
    ).toBe("upgrade");
    expect(
      getTierChangeKind({ ...base, targetTier: ProductIds.SUBSCRIPTION }),
    ).toBe("downgrade");
    expect(
      getTierChangeKind({ ...base, targetTier: ProductIds.SUBSCRIPTION_PLUS }),
    ).toBe("current");
    expect(
      getTierChangeKind({
        currentTier: ProductIds.SUBSCRIPTION,
        currentInterval: BillingInterval.YEARLY,
        targetTier: ProductIds.SUBSCRIPTION_PRO,
        targetInterval: monthly,
      }),
    ).toBe("interval");
  });

  it("finds the next tier up, none above the top", () => {
    expect(getUpgradeTier(tiers, ProductIds.SUBSCRIPTION)?.productId).toBe(
      ProductIds.SUBSCRIPTION_PLUS,
    );
    expect(getUpgradeTier(tiers, ProductIds.SUBSCRIPTION_ULTRA)).toBeNull();
  });

  it("opens the picker on the step up, or the recommended tier", () => {
    const plans = getPlanOfferState({ isPublic: false, subscription: undefined });
    expect(getDefaultPickedTier(tiers, plans.currentTier)).toBe(RECOMMENDED_TIER);
    const onPlus = getPlanOfferState({
      isPublic: false,
      subscription: activeCard,
      now: NOW,
    });
    expect(getDefaultPickedTier(tiers, onPlus.currentTier)).toBe(
      ProductIds.SUBSCRIPTION_PRO,
    );
    const onUltra = getPlanOfferState({
      isPublic: false,
      subscription: { ...activeCard, plan: SubscriptionPlan.ULTRA },
      now: NOW,
    });
    expect(getDefaultPickedTier(tiers, onUltra.currentTier)).toBe(
      ProductIds.SUBSCRIPTION_ULTRA,
    );
  });

  it("the compact offer shows the two cheapest tiers", () => {
    expect(getCompactTiers(tiers).map((tier) => tier.productId)).toEqual([
      ProductIds.SUBSCRIPTION,
      ProductIds.SUBSCRIPTION_PLUS,
    ]);
  });
});
