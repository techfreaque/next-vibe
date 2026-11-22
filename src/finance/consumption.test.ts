/**
 * AI margin from consumption + provider cost attribution: pure logic, no DB.
 */

import { describe, expect, it } from "vitest";

import { CreditFundingType } from "@/credits/enum";
import { allModelDefinitions } from "@/vibe/agent/models/all-models";
import { ApiProvider } from "@/vibe/agent/models/models";

import { FINANCE_CONFIG } from "./config";
import {
  type ConsumptionGroup,
  packUsdPerCredit,
  valueConsumption,
} from "./consumption";
import {
  COST_PROVIDER_KEYS,
  COST_PROVIDERS,
  costProviderNodeSuffix,
  listedCreditsToProviderCostUsd,
  resolveModelProvider,
  UNATTRIBUTED_PROVIDER,
} from "./cost-providers";
import { graphSeeds } from "./graph-seeds";

const DAY = "2026-11-21T00:00:00.000Z";

function group(over: Partial<ConsumptionGroup>): ConsumptionGroup {
  return {
    bucket: DAY,
    modelId: null,
    apiProvider: null,
    funding: CreditFundingType.FREE_ALLOWANCE,
    packId: null,
    credits: 0,
    recordedCostUsd: 0,
    uncostedCredits: 0,
    ...over,
  };
}

const noFees = (): Record<string, number> => ({});

describe("cost providers come from the model registry", () => {
  it("lists every provider any model routes to, minus the self route", () => {
    const fromRegistry = new Set(
      allModelDefinitions.flatMap((d) => d.providers.map((p) => p.apiProvider)),
    );
    fromRegistry.delete(ApiProvider.UNBOTTLED);
    expect(new Set(COST_PROVIDERS)).toEqual(fromRegistry);
    // The providers the old dashboard missed are all there.
    for (const provider of [
      ApiProvider.FREEDOMGPT,
      ApiProvider.GAB_AI,
      ApiProvider.UNCENSORED_AI,
      ApiProvider.MODELSLAB,
    ]) {
      expect(COST_PROVIDERS).toContain(provider);
    }
    expect(COST_PROVIDER_KEYS.at(-1)).toBe(UNATTRIBUTED_PROVIDER);
  });

  it("attributes a model id to its only real route; unknown ids are unattributed", () => {
    let checked = 0;
    for (const definition of allModelDefinitions) {
      const real = [
        ...new Set(
          definition.providers
            .map((p) => p.apiProvider)
            .filter((p) => p !== ApiProvider.UNBOTTLED),
        ),
      ];
      const [only] = real;
      if (real.length !== 1 || only === undefined) {
        continue;
      }
      for (const route of definition.providers) {
        if (route.apiProvider === only) {
          expect(resolveModelProvider(route.id)).toBe(only);
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(20);
    expect(resolveModelProvider(null)).toBe(UNATTRIBUTED_PROVIDER);
    expect(resolveModelProvider("no-such-model")).toBe(UNATTRIBUTED_PROVIDER);
  });

  it("strips the markup from a listed charge to get provider cost", () => {
    // 130 credits charged at list = $1.30 = $1.00 provider cost x 1.3
    expect(listedCreditsToProviderCostUsd(130)).toBeCloseTo(1, 10);
    expect(listedCreditsToProviderCostUsd(0)).toBe(0);
  });
});

describe("valueConsumption", () => {
  const uncensored = allModelDefinitions
    .flatMap((d) => d.providers)
    .find((p) => p.apiProvider === ApiProvider.UNCENSORED_AI)?.id;
  const gab = allModelDefinitions
    .flatMap((d) => d.providers)
    .find((p) => p.apiProvider === ApiProvider.GAB_AI)?.id;
  const openRouterOnly =
    allModelDefinitions
      .find((d) =>
        d.providers.every(
          (p) =>
            p.apiProvider === ApiProvider.OPENROUTER ||
            p.apiProvider === ApiProvider.UNBOTTLED,
        ),
      )
      ?.providers.find((p) => p.apiProvider === ApiProvider.OPENROUTER)?.id ??
    null;

  it("adds provider parts up to the total and values paid credits at their paid price", () => {
    const [day] = valueConsumption({
      buckets: [DAY],
      packPrices: new Map([["pack-sub", 0.0108]]),
      fixedFees: () => ({ [ApiProvider.GAB_AI]: 0.5 }),
      groups: [
        // Paid subscription credits with a real recorded upstream cost.
        group({
          modelId: openRouterOnly,
          funding: CreditFundingType.SUBSCRIPTION,
          packId: "pack-sub",
          credits: 100,
          recordedCostUsd: 0.7,
        }),
        // Free credits on a per-call provider: cost = charge without markup.
        group({
          modelId: uncensored ?? null,
          credits: 260,
          uncostedCredits: 260,
        }),
        // Flat-rate plan: per-call cost is 0, the fee is booked instead.
        group({ modelId: gab ?? null, credits: 50, uncostedCredits: 50 }),
        // A tool row with no model: unattributed, still counted.
        group({ credits: 13, uncostedCredits: 13 }),
      ],
    });
    expect(day).toBeDefined();
    if (!day) {
      return;
    }
    const parts = Object.values(day.costByProvider).reduce((a, b) => a + b, 0);
    expect(parts).toBeCloseTo(day.costTotalUsd, 10);
    expect(day.costByProvider[ApiProvider.OPENROUTER]).toBeCloseTo(0.7, 10);
    expect(day.costByProvider[ApiProvider.UNCENSORED_AI]).toBeCloseTo(2, 10);
    expect(day.costByProvider[ApiProvider.GAB_AI]).toBeCloseTo(0.5, 10);
    expect(day.costByProvider[UNATTRIBUTED_PROVIDER]).toBeCloseTo(0.1, 10);
    expect(day.costTotalUsd).toBeCloseTo(3.3, 10);

    expect(day.consumedListUsd).toBeCloseTo(4.23, 10);
    expect(day.earnedUsd).toBeCloseTo(1.08, 10);
    expect(day.freeListUsd).toBeCloseTo(3.23, 10);
    expect(day.costPaidUsd).toBeCloseTo(0.7, 10);
    expect(day.costFreeUsd).toBeCloseTo(2.1, 10);
    expect(day.costFixedUsd).toBeCloseTo(0.5, 10);

    // AI margin = earned - every provider cost (free usage + flat plans too).
    expect(day.aiMarginUsd).toBeCloseTo(1.08 - 3.3, 10);
    expect(day.aiMarginPct).toBeCloseTo(((1.08 - 3.3) / 1.08) * 100, 10);
    // Paid usage margin = earned - provider cost of the paid usage only.
    expect(day.paidMarginUsd).toBeCloseTo(0.38, 10);
    expect(day.paidMarginPct).toBeCloseTo((0.38 / 1.08) * 100, 10);
  });

  it("never fakes a percentage when nothing was earned, and keeps empty buckets", () => {
    const out = valueConsumption({
      buckets: [DAY, "2026-11-22T00:00:00.000Z"],
      packPrices: new Map(),
      fixedFees: noFees,
      groups: [group({ credits: 10, uncostedCredits: 10 })],
    });
    expect(out).toHaveLength(2);
    expect(out[0]?.earnedUsd).toBe(0);
    expect(out[0]?.aiMarginPct).toBeNull();
    expect(out[0]?.paidMarginPct).toBeNull();
    expect(out[1]?.costTotalUsd).toBe(0);
  });

  it("values paid credits with no linked payment at list price, flagged as estimated", () => {
    const [day] = valueConsumption({
      buckets: [DAY],
      packPrices: new Map(),
      fixedFees: noFees,
      groups: [
        group({
          funding: CreditFundingType.PACK_UNKNOWN,
          credits: 200,
          uncostedCredits: 200,
        }),
      ],
    });
    expect(day?.earnedUsd).toBeCloseTo(200 * FINANCE_CONFIG.creditValueUsd);
    expect(day?.earnedEstimatedUsd).toBeCloseTo(
      200 * FINANCE_CONFIG.creditValueUsd,
    );
  });

  it("prefers a provider stamped on the row over the registry route", () => {
    const [day] = valueConsumption({
      buckets: [DAY],
      packPrices: new Map(),
      fixedFees: noFees,
      groups: [
        group({
          modelId: openRouterOnly,
          apiProvider: ApiProvider.NANO_GPT,
          credits: 13,
          uncostedCredits: 13,
        }),
      ],
    });
    expect(day?.costByProvider[ApiProvider.NANO_GPT]).toBeCloseTo(0.1, 10);
    expect(day?.costByProvider[ApiProvider.OPENROUTER]).toBeUndefined();
  });
});

describe("packUsdPerCredit", () => {
  const base = {
    packId: "p",
    originalCredits: 500,
    sessionPayment: null,
    subscriptionPayment: null,
    planMonthlyCredits: null,
    yearly: false,
  };

  it("prices a permanent pack by its checkout payment", () => {
    expect(
      packUsdPerCredit({
        ...base,
        kind: "permanent",
        originalCredits: 1000,
        sessionPayment: { amount: 5, currency: "USD" },
      }),
    ).toBeCloseTo(0.005, 10);
  });

  it("prices a monthly plan as price / monthly credits, converting the currency", () => {
    expect(
      packUsdPerCredit({
        ...base,
        kind: "subscription",
        subscriptionPayment: { amount: 8, currency: "EUR" },
        planMonthlyCredits: 800,
      }),
    ).toBeCloseTo((8 * 1.08) / 800, 10);
    expect(
      packUsdPerCredit({
        ...base,
        kind: "subscription",
        subscriptionPayment: { amount: 20, currency: "usd" },
        planMonthlyCredits: 2050,
      }),
    ).toBeCloseTo(20 / 2050, 10);
  });

  it("spreads a yearly plan over 12 months of credits", () => {
    expect(
      packUsdPerCredit({
        ...base,
        kind: "subscription",
        subscriptionPayment: { amount: 88, currency: "USD" },
        planMonthlyCredits: 800,
        yearly: true,
      }),
    ).toBeCloseTo(88 / 9600, 10);
  });

  it("returns null when no payment is linked or the currency is unknown", () => {
    expect(packUsdPerCredit({ ...base, kind: "subscription" })).toBeNull();
    expect(
      packUsdPerCredit({
        ...base,
        kind: "permanent",
        sessionPayment: { amount: 5, currency: "JPY" },
      }),
    ).toBeNull();
  });
});

describe("finance graph seed", () => {
  const [seed] = graphSeeds;
  const nodes = seed?.config.nodes ?? {};

  it("has one cost series per registry provider plus unattributed and a total", () => {
    for (const key of COST_PROVIDER_KEYS) {
      expect(nodes[`cost_${costProviderNodeSuffix(key)}`]).toBeDefined();
    }
    expect(nodes.cost_total).toBeDefined();
  });

  it("keeps cash and margin apart and wires every edge to a real node", () => {
    expect(nodes.margin_usd).toBeUndefined();
    expect(nodes.ai_margin_usd).toBeDefined();
    expect(nodes.cash_net_after_refunds).toBeDefined();
    for (const edge of seed?.config.edges ?? []) {
      expect(nodes[edge.from]).toBeDefined();
      expect(nodes[edge.to]).toBeDefined();
    }
  });
});
