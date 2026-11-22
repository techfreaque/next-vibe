/**
 * AI margin from credit CONSUMPTION (pure logic, no IO).
 *
 * We are paid in lumps (monthly / yearly subscriptions, packs) and spend at
 * the providers every day, so cash received in a period is never compared with
 * provider spend in that period. Instead every consumed credit is valued at
 * what its buyer actually paid for it:
 *
 *   earned      = sum(paid credits consumed x paid USD per credit of their pack)
 *                 (subscription: plan price / credits per period, yearly price /
 *                 12 months of credits; pack: pack price / pack credits)
 *   free value  = free / bonus / admin / referral credits consumed x list price
 *                 (earns nothing; shown so free usage is visible as a cost driver)
 *   cost        = provider cost of ALL consumption (recorded upstream cost, else
 *                 the listed charge without our markup) + flat-rate plan fees
 *   AI margin   = earned - cost            (pct of earned; null when earned = 0)
 *   paid margin = earned - cost of paid consumption (pricing health)
 *
 * Cash (Stripe / NOWPayments / refunds) stays a separate cash-flow series.
 *
 * Client+server safe. No server imports.
 */

import {
  CreditFundingType,
  type CreditFundingTypeDBValue,
} from "@/credits/enum";

import { FINANCE_CONFIG } from "./config";
import {
  FLAT_RATE_PROVIDERS,
  listedCreditsToProviderCostUsd,
  resolveModelProvider,
} from "./cost-providers";

/** Funding buckets whose credits were paid for. */
export const PAID_FUNDING: ReadonlySet<CreditFundingTypeDBValue> = new Set([
  CreditFundingType.PURCHASED,
  CreditFundingType.SUBSCRIPTION,
  CreditFundingType.PACK_UNKNOWN,
]);

/** One aggregated group of usage rows (same bucket, model, funding, pack). */
export interface ConsumptionGroup {
  /** Bucket start (ISO) */
  bucket: string;
  modelId: string | null;
  /** Provider stamped on the row, when the writer recorded it */
  apiProvider: string | null;
  funding: CreditFundingTypeDBValue;
  packId: string | null;
  credits: number;
  /** Sum of recorded upstream + fallback cost on rows that recorded one */
  recordedCostUsd: number;
  /** Credits on rows that recorded no upstream cost */
  uncostedCredits: number;
}

export interface ConsumptionBucket {
  bucket: string;
  /** All consumed credits at list price ($0.01): the old "billed" figure */
  consumedListUsd: number;
  /** Paid credits consumed x what was actually paid per credit */
  earnedUsd: number;
  /** Paid credits valued at list price only because their pack price is unknown */
  earnedEstimatedUsd: number;
  /** Free / bonus / admin / referral credits consumed at list price */
  freeListUsd: number;
  costPaidUsd: number;
  costFreeUsd: number;
  /** Flat-rate plan fees for the bucket */
  costFixedUsd: number;
  costTotalUsd: number;
  /** Per cost-provider key, including UNATTRIBUTED; sums to costTotalUsd */
  costByProvider: Record<string, number>;
  aiMarginUsd: number;
  aiMarginPct: number | null;
  paidMarginUsd: number;
  paidMarginPct: number | null;
}

/** Paid USD per credit for a pack id; missing = unknown (valued at list). */
export type PackPrices = ReadonlyMap<string, number>;

/** Provider cost of one group: recorded cost + listed charge without markup. */
export function groupProviderCostUsd(group: ConsumptionGroup): {
  provider: string;
  costUsd: number;
} {
  const provider = group.apiProvider ?? resolveModelProvider(group.modelId);
  if (FLAT_RATE_PROVIDERS[provider] !== undefined) {
    return { provider, costUsd: 0 };
  }
  return {
    provider,
    costUsd:
      group.recordedCostUsd +
      listedCreditsToProviderCostUsd(group.uncostedCredits),
  };
}

function pct(part: number, whole: number): number | null {
  return whole > 0 ? (part / whole) * 100 : null;
}

/**
 * Value consumption per bucket. `fixedDailyUsd(bucketStart, hours)` returns the
 * flat-rate fees per provider key for one bucket.
 */
export function valueConsumption(input: {
  groups: readonly ConsumptionGroup[];
  packPrices: PackPrices;
  /** Flat-rate fees per provider key for a bucket (already pro-rated) */
  fixedFees: (bucket: string) => Readonly<Record<string, number>>;
  /** Buckets to emit even without usage (so fixed fees still show) */
  buckets: readonly string[];
}): ConsumptionBucket[] {
  const listValue = FINANCE_CONFIG.creditValueUsd;
  const byBucket = new Map<string, ConsumptionBucket>();
  const ensure = (bucket: string): ConsumptionBucket => {
    const existing = byBucket.get(bucket);
    if (existing) {
      return existing;
    }
    const fresh: ConsumptionBucket = {
      bucket,
      consumedListUsd: 0,
      earnedUsd: 0,
      earnedEstimatedUsd: 0,
      freeListUsd: 0,
      costPaidUsd: 0,
      costFreeUsd: 0,
      costFixedUsd: 0,
      costTotalUsd: 0,
      costByProvider: {},
      aiMarginUsd: 0,
      aiMarginPct: null,
      paidMarginUsd: 0,
      paidMarginPct: null,
    };
    byBucket.set(bucket, fresh);
    return fresh;
  };
  for (const bucket of input.buckets) {
    ensure(bucket);
  }

  for (const group of input.groups) {
    const out = ensure(group.bucket);
    out.consumedListUsd += group.credits * listValue;
    const { provider, costUsd } = groupProviderCostUsd(group);
    out.costByProvider[provider] =
      (out.costByProvider[provider] ?? 0) + costUsd;
    if (PAID_FUNDING.has(group.funding)) {
      const price = group.packId
        ? input.packPrices.get(group.packId)
        : undefined;
      if (price === undefined) {
        out.earnedUsd += group.credits * listValue;
        out.earnedEstimatedUsd += group.credits * listValue;
      } else {
        out.earnedUsd += group.credits * price;
      }
      out.costPaidUsd += costUsd;
    } else {
      out.freeListUsd += group.credits * listValue;
      out.costFreeUsd += costUsd;
    }
  }

  for (const out of byBucket.values()) {
    for (const [provider, fee] of Object.entries(input.fixedFees(out.bucket))) {
      out.costByProvider[provider] = (out.costByProvider[provider] ?? 0) + fee;
      out.costFixedUsd += fee;
    }
    out.costTotalUsd = Object.values(out.costByProvider).reduce(
      (a, b) => a + b,
      0,
    );
    out.aiMarginUsd = out.earnedUsd - out.costTotalUsd;
    out.aiMarginPct = pct(out.aiMarginUsd, out.earnedUsd);
    out.paidMarginUsd = out.earnedUsd - out.costPaidUsd;
    out.paidMarginPct = pct(out.paidMarginUsd, out.earnedUsd);
  }
  return [...byBucket.values()].toSorted((a, b) =>
    a.bucket.localeCompare(b.bucket),
  );
}

// ─── Pack prices ─────────────────────────────────────────────────────────────

export interface PackFacts {
  packId: string;
  kind: "subscription" | "permanent" | "other";
  originalCredits: number;
  /** Payment matched by the pack's checkout session (permanent packs) */
  sessionPayment: { amount: number; currency: string } | null;
  /** Latest succeeded subscription payment of the pack owner at grant time */
  subscriptionPayment: { amount: number; currency: string } | null;
  /** Monthly credits of the owner's plan (catalog); null when unknown */
  planMonthlyCredits: number | null;
  yearly: boolean;
}

/** Static FX to USD; null when the currency is not convertible. */
export function toUsd(amount: number, currency: string): number | null {
  const rate = FINANCE_CONFIG.fxToUsd[currency.toLowerCase()];
  return rate === undefined ? null : amount * rate;
}

/**
 * Paid USD per credit of one pack. Permanent: what the checkout session paid /
 * pack credits. Subscription: the owner's subscription payment / credits that
 * payment buys (monthly credits, or 12 x monthly for a yearly plan). null when
 * no payment is linked: the caller values those credits at list price and
 * reports them as estimated.
 */
export function packUsdPerCredit(pack: PackFacts): number | null {
  if (pack.kind === "permanent" && pack.sessionPayment) {
    const usd = toUsd(pack.sessionPayment.amount, pack.sessionPayment.currency);
    if (usd !== null && usd > 0 && pack.originalCredits > 0) {
      return usd / pack.originalCredits;
    }
  }
  if (pack.kind === "subscription" && pack.subscriptionPayment) {
    const usd = toUsd(
      pack.subscriptionPayment.amount,
      pack.subscriptionPayment.currency,
    );
    const credits =
      pack.planMonthlyCredits !== null
        ? pack.planMonthlyCredits * (pack.yearly ? 12 : 1)
        : null;
    if (usd !== null && usd > 0 && credits !== null && credits > 0) {
      return usd / credits;
    }
  }
  return null;
}
