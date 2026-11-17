/**
 * Subscription tiers (Max, 2026-11-17): four monthly plans, credits per tier,
 * one consistent price table per currency (PLN = x3.75), plan <-> product
 * mapping incl. legacy plan ids, and copy params read from the same config.
 */

import { describe, expect, test } from "bun:test";

import { SubscriptionPlan } from "@/subscription/enum";

import {
  getPlanForTierProduct,
  getPricingParams,
  getSubscriptionTiers,
  getTierCredits,
  getTierProductForPlan,
  ProductIds,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "../repository-client";

describe("subscription tiers", () => {
  test("credits per tier (100 per $1 plus the unadvertised tier bonus)", () => {
    expect(getTierCredits(ProductIds.SUBSCRIPTION)).toBe(800);
    expect(getTierCredits(ProductIds.SUBSCRIPTION_PLUS)).toBe(2050);
    expect(getTierCredits(ProductIds.SUBSCRIPTION_PRO)).toBe(10500);
    expect(getTierCredits(ProductIds.SUBSCRIPTION_ULTRA)).toBe(22000);
  });

  test("monthly prices: same number in USD and EUR, PLN x3.75", () => {
    const expected: Record<string, [number, number]> = {
      [ProductIds.SUBSCRIPTION]: [8, 30],
      [ProductIds.SUBSCRIPTION_PLUS]: [20, 75],
      [ProductIds.SUBSCRIPTION_PRO]: [100, 375],
      [ProductIds.SUBSCRIPTION_ULTRA]: [200, 750],
    };
    for (const id of SUBSCRIPTION_TIER_PRODUCT_IDS) {
      const [usd, pln] = expected[id];
      const us = productsRepository.getProduct(id, "en-US", "month");
      const de = productsRepository.getProduct(id, "de-DE", "month");
      const fr = productsRepository.getProduct(id, "fr-FR", "month");
      const pl = productsRepository.getProduct(id, "pl-PL", "month");
      expect([us.price, us.currency]).toEqual([usd, "USD"]);
      expect([de.price, de.currency]).toEqual([usd, "EUR"]);
      expect([fr.price, fr.currency]).toEqual([usd, "EUR"]);
      expect([pl.price, pl.currency]).toEqual([pln, "PLN"]);
    }
  });

  test("credit pack follows the same PLN ratio (19 zł for $5)", () => {
    const pack = productsRepository.getProduct(
      ProductIds.CREDIT_PACK,
      "pl-PL",
      "one_time",
    );
    expect(pack.price).toBe(19);
    expect(pack.credits).toBe(500);
  });

  test("every tier sells yearly at 11 months' price", () => {
    const expected: Record<string, [number, number]> = {
      [ProductIds.SUBSCRIPTION]: [88, 330],
      [ProductIds.SUBSCRIPTION_PLUS]: [220, 825],
      [ProductIds.SUBSCRIPTION_PRO]: [1100, 4125],
      [ProductIds.SUBSCRIPTION_ULTRA]: [2200, 8250],
    };
    const defs = productsRepository.getProductDefinitions();
    for (const id of SUBSCRIPTION_TIER_PRODUCT_IDS) {
      const [usd, pln] = expected[id];
      expect(defs[id].allowedIntervals).toEqual(["month", "year"]);
      expect(productsRepository.getProduct(id, "en-US", "year").price).toBe(usd);
      expect(productsRepository.getProduct(id, "de-DE", "year").price).toBe(usd);
      expect(productsRepository.getProduct(id, "pl-PL", "year").price).toBe(pln);
      const monthly = productsRepository.getProduct(id, "en-US", "month").price;
      expect(usd).toBe(monthly * 11);
    }
  });

  test("tier list is ordered cheapest first with formatted labels", () => {
    const tiers = getSubscriptionTiers("en-US");
    expect(tiers.map((tier) => tier.productId)).toEqual([
      ...SUBSCRIPTION_TIER_PRODUCT_IDS,
    ]);
    expect(tiers.map((tier) => tier.priceLabel)).toEqual([
      "$8",
      "$20",
      "$100",
      "$200",
    ]);
    expect(tiers[3].creditsLabel).toBe("22,000");
    expect(tiers[0].yearlyPriceLabel).toBe("$88");
    expect(tiers[1].yearlyPriceLabel).toBe("$220");
    expect(getSubscriptionTiers("pl-PL")[2].priceLabel).toBe("375 zł");
    expect(getSubscriptionTiers("fr-FR")[1].priceLabel).toBe("20 €");
  });

  test("plan <-> product mapping, including legacy prefixed plan ids", () => {
    for (const id of SUBSCRIPTION_TIER_PRODUCT_IDS) {
      expect(getTierProductForPlan(getPlanForTierProduct(id))).toBe(id);
    }
    expect(getTierProductForPlan(SubscriptionPlan.PRO)).toBe(
      ProductIds.SUBSCRIPTION_PRO,
    );
    expect(
      getTierProductForPlan("app.api.subscription.enums.plan.subscription"),
    ).toBe(ProductIds.SUBSCRIPTION);
    expect(getTierProductForPlan("enums.plan.enterprise")).toBeNull();
  });

  test("pricing params expose every tier from config", () => {
    const params = getPricingParams("en-US");
    expect(params.subscriptionPrice).toBe("$8");
    expect(params.subscriptionCredits).toBe("800");
    expect(params.plusPrice).toBe("$20");
    expect(params.plusCredits).toBe("2,050");
    expect(params.proCredits).toBe("10,500");
    expect(params.ultraPrice).toBe("$200");
    expect(params.planCreditsMax).toBe("22,000");
    expect(getPricingParams("de-DE").proCredits).toBe("10.500");
  });
});
