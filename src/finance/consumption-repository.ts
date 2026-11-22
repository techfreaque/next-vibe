/**
 * Consumption repository: reads credit consumption from credit_transactions
 * and values it with consumption.ts (AI margin, provider cost per provider).
 * Server-only. Read-only.
 */

import "server-only";

import { and, eq, gte, lt, lte, type SQL, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { Resolution, TimeRange } from "next-vibe/dataflow/shared/fields";
import { RESOLUTION_MS } from "next-vibe/dataflow/shared/fields";
import { resolutionBucketExpr } from "next-vibe/dataflow/shared/query-utils";
import { fillGaps } from "next-vibe/dataflow/shared/range";
import type { QueryResultRow } from "pg";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import {
  CreditFundingType,
  CreditFundingTypeDB,
  type CreditFundingTypeDBValue,
  CreditPackType,
  CreditTransactionType,
} from "@/credits/enum";
import { notSignupCarryover } from "@/credits/usage-filter";
import { CheckoutMode, PaymentStatus } from "@/payment/enum";
import {
  getPlanForTierProduct,
  productsRepository,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "@/products/repository-client";
import { BillingInterval } from "@/subscription/enum";
import { agentEnv } from "@/vibe/agent/env";
import { ApiProvider } from "@/vibe/agent/models/models";

import {
  type ConsumptionBucket,
  type ConsumptionGroup,
  type PackFacts,
  packUsdPerCredit,
  PAID_FUNDING,
  valueConsumption,
} from "./consumption";
import { FLAT_RATE_PROVIDERS } from "./cost-providers";

type NumLike = number | string | null;

const num = (v: NumLike): number => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
};

function isFunding(value: string): value is CreditFundingTypeDBValue {
  return CreditFundingTypeDB.some((f) => f === value);
}

/** Normalise a bucket timestamp to one ISO key for JS and SQL buckets alike. */
const bucketKey = (value: string | Date): string =>
  new Date(value).toISOString();

/** Monthly credits per plan value (legacy "app.api.subscription.*" values too). */
function planMonthlyCredits(planId: string | null): number | null {
  if (!planId) {
    return null;
  }
  for (const productId of SUBSCRIPTION_TIER_PRODUCT_IDS) {
    const plan = getPlanForTierProduct(productId);
    if (planId === plan || planId.endsWith(`.${plan}`)) {
      return productsRepository.getProduct(productId, "en-US").credits;
    }
  }
  return null;
}

export class ConsumptionRepository {
  /** Usage rows aggregated per bucket x model x provider x funding x pack. */
  static async groups(
    resolution: Resolution,
    range: { from: Date; to: Date; toInclusive: boolean },
  ): Promise<ConsumptionGroup[]> {
    const bucket = resolutionBucketExpr(
      resolution,
      creditTransactions.createdAt,
    );
    // Rows written before funding_type existed: same fallback as the usage report.
    const funding: SQL<string> = sql<string>`COALESCE(${creditTransactions.fundingType}, CASE
      WHEN ${creditPacks.type} = ${CreditPackType.SUBSCRIPTION} THEN ${CreditFundingType.SUBSCRIPTION}
      WHEN ${creditPacks.type} = ${CreditPackType.PERMANENT} THEN ${CreditFundingType.PURCHASED}
      WHEN ${creditPacks.type} = ${CreditPackType.EARNED} THEN ${CreditFundingType.REFERRAL}
      WHEN ${creditPacks.type} = ${CreditPackType.BONUS} THEN ${CreditFundingType.ADMIN_GRANT}
      WHEN ${creditWallets.leadId} IS NOT NULL
        AND COALESCE((${creditTransactions.metadata}->>'packCreditsUsed')::numeric, 0) = 0
        THEN ${CreditFundingType.FREE_UNKNOWN}
      ELSE ${CreditFundingType.PACK_UNKNOWN} END)`;
    const hasCost = sql`(${creditTransactions.metadata} ? 'upstreamCostUsd' OR ${creditTransactions.metadata} ? 'fallbackCostUsd')`;
    const rows = await db
      .select({
        bucket: bucket.as("bucket"),
        modelId: creditTransactions.modelId,
        apiProvider: sql<
          string | null
        >`NULLIF(${creditTransactions.metadata}->>'apiProvider', '')`.as(
          "api_provider",
        ),
        funding: funding.as("funding"),
        packId: creditTransactions.packId,
        credits: sql<NumLike>`sum(-${creditTransactions.amount})`,
        recordedCost: sql<NumLike>`sum(CASE WHEN ${hasCost} THEN
          COALESCE((${creditTransactions.metadata}->>'upstreamCostUsd')::numeric, 0)
          + COALESCE((${creditTransactions.metadata}->>'fallbackCostUsd')::numeric, 0)
          ELSE 0 END)`,
        uncosted: sql<NumLike>`sum(CASE WHEN ${hasCost} THEN 0 ELSE -${creditTransactions.amount} END)`,
      })
      .from(creditTransactions)
      .innerJoin(
        creditWallets,
        eq(creditWallets.id, creditTransactions.walletId),
      )
      .leftJoin(creditPacks, eq(creditPacks.id, creditTransactions.packId))
      .where(
        and(
          eq(creditTransactions.type, CreditTransactionType.USAGE),
          lt(creditTransactions.amount, 0),
          notSignupCarryover,
          gte(creditTransactions.createdAt, range.from),
          range.toInclusive
            ? lte(creditTransactions.createdAt, range.to)
            : lt(creditTransactions.createdAt, range.to),
        ),
      )
      .groupBy(sql`1, 2, 3, 4, 5`);

    return rows.map((r) => ({
      bucket: bucketKey(r.bucket),
      modelId: r.modelId,
      apiProvider: r.apiProvider,
      funding: isFunding(r.funding)
        ? r.funding
        : CreditFundingType.PACK_UNKNOWN,
      packId: r.packId,
      credits: num(r.credits),
      recordedCostUsd: num(r.recordedCost),
      uncostedCredits: num(r.uncosted),
    }));
  }

  /** Paid USD per credit for each pack id (packs without a linked payment are left out). */
  static async packPrices(
    packIds: readonly string[],
  ): Promise<Map<string, number>> {
    const prices = new Map<string, number>();
    if (packIds.length === 0) {
      return prices;
    }
    const result = await db.execute<
      QueryResultRow & {
        id: string;
        type: string;
        original_amount: NumLike;
        session_amount: NumLike;
        session_currency: string | null;
        sub_amount: NumLike;
        sub_currency: string | null;
        plan_id: string | null;
        billing_interval: string | null;
      }
    >(sql`
      SELECT p.id, p.type, p.original_amount,
        sp.amount AS session_amount, sp.currency AS session_currency,
        subp.amount AS sub_amount, subp.currency AS sub_currency,
        s.plan_id, s.billing_interval
      FROM credit_packs p
      JOIN credit_wallets w ON w.id = p.wallet_id
      LEFT JOIN subscriptions s ON s.user_id = w.user_id
      LEFT JOIN LATERAL (
        SELECT pt.amount, pt.currency FROM payment_transactions pt
        WHERE pt.status = ${PaymentStatus.SUCCEEDED}
          AND p.metadata->>'sessionId' IS NOT NULL
          AND pt.provider_session_id = p.metadata->>'sessionId'
        LIMIT 1
      ) sp ON true
      LEFT JOIN LATERAL (
        SELECT pt.amount, pt.currency FROM payment_transactions pt
        WHERE pt.status = ${PaymentStatus.SUCCEEDED}
          AND pt.mode = ${CheckoutMode.SUBSCRIPTION}
          AND w.user_id IS NOT NULL
          AND pt.user_id = w.user_id
          AND pt.amount > 0
          AND pt.created_at <= p.created_at + interval '1 day'
        ORDER BY pt.created_at DESC
        LIMIT 1
      ) subp ON true
      WHERE p.id IN (${sql.join(
        packIds.map((id) => sql`${id}::uuid`),
        sql`, `,
      )})
    `);
    for (const row of result.rows) {
      const facts: PackFacts = {
        packId: row.id,
        kind:
          row.type === CreditPackType.SUBSCRIPTION
            ? "subscription"
            : row.type === CreditPackType.PERMANENT
              ? "permanent"
              : "other",
        originalCredits: num(row.original_amount),
        sessionPayment:
          row.session_amount !== null && row.session_currency
            ? {
                amount: num(row.session_amount),
                currency: row.session_currency,
              }
            : null,
        subscriptionPayment:
          row.sub_amount !== null && row.sub_currency
            ? { amount: num(row.sub_amount), currency: row.sub_currency }
            : null,
        planMonthlyCredits: planMonthlyCredits(row.plan_id),
        yearly: row.billing_interval === BillingInterval.YEARLY,
      };
      const price = packUsdPerCredit(facts);
      if (price !== null) {
        prices.set(row.id, price);
      }
    }
    return prices;
  }

  /** Flat-rate plan fees per bucket, pro-rated by bucket length within its month. */
  static fixedFeesFor(
    buckets: readonly string[],
    resolution: Resolution,
    now: Date,
  ): (bucket: string) => Readonly<Record<string, number>> {
    const active = Object.entries(FLAT_RATE_PROVIDERS).filter(([provider]) =>
      ConsumptionRepository.flatRateActive(provider),
    );
    const sorted = buckets.toSorted();
    const fees = new Map<string, Record<string, number>>();
    sorted.forEach((bucket, i) => {
      const start = new Date(bucket);
      if (start.getTime() > now.getTime() || active.length === 0) {
        fees.set(bucket, {});
        return;
      }
      const next = sorted[i + 1];
      const lengthMs = next
        ? new Date(next).getTime() - start.getTime()
        : RESOLUTION_MS[resolution];
      const monthMs =
        new Date(
          Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1),
        ).getTime() - Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1);
      const share: Record<string, number> = {};
      for (const [provider, monthly] of active) {
        share[provider] = monthly * (lengthMs / monthMs);
      }
      fees.set(bucket, share);
    });
    return (bucket) => fees.get(bucket) ?? {};
  }

  /** A flat-rate plan only costs money while its key is configured here. */
  private static flatRateActive(provider: string): boolean {
    return provider === ApiProvider.GAB_AI
      ? Boolean(agentEnv.GAB_AI_API_KEY)
      : true;
  }

  /** Valued consumption per bucket across a range (every bucket present). */
  static async valued(
    resolution: Resolution,
    range: TimeRange,
    now: Date = new Date(),
  ): Promise<ConsumptionBucket[]> {
    const groups = await ConsumptionRepository.groups(resolution, {
      from: range.from,
      to: range.to,
      toInclusive: true,
    });
    const packIds = [
      ...new Set(
        groups
          .filter((g) => PAID_FUNDING.has(g.funding) && g.packId !== null)
          .map((g) => g.packId ?? ""),
      ),
    ];
    const packPrices = await ConsumptionRepository.packPrices(packIds);
    const buckets = fillGaps([], range, resolution).map((p) =>
      bucketKey(p.timestamp),
    );
    return valueConsumption({
      groups,
      packPrices,
      fixedFees: ConsumptionRepository.fixedFeesFor(buckets, resolution, now),
      buckets,
    });
  }
}
