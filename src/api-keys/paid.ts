/**
 * "Paid" test for the API: /v1 and key creation are for paying customers only.
 *
 * Same definition the lead lifecycle uses for `isPaid` (leads/lifecycle/snapshots):
 *  - a live subscription (ACTIVE / TRIALING / PAST_DUE grace), OR
 *  - a purchase history: a PURCHASE or SUBSCRIPTION credit transaction, OR
 *  - a succeeded payment.
 * Free grants, bonus and earned credits never count.
 */

import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";

import { creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { subscriptions } from "@/subscription/db";
import { SubscriptionStatus } from "@/subscription/enum";

/** Paid status only ever turns true, so positives are cached per process. */
const PAID_CACHE_TTL_MS = 5 * 60 * 1000;
const paidCache = new Map<string, number>();

export function resetPaidCache(userId?: string): void {
  if (userId) {
    paidCache.delete(userId);
  } else {
    paidCache.clear();
  }
}

export async function isPaidUser(userId: string): Promise<boolean> {
  const cachedAt = paidCache.get(userId);
  if (cachedAt !== undefined && Date.now() - cachedAt < PAID_CACHE_TTL_MS) {
    return true;
  }
  const paid = await queryIsPaid(userId);
  if (paid) {
    paidCache.set(userId, Date.now());
  }
  return paid;
}

async function queryIsPaid(userId: string): Promise<boolean> {
  const [sub] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        inArray(subscriptions.status, [
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.TRIALING,
          SubscriptionStatus.PAST_DUE,
        ]),
      ),
    )
    .limit(1);
  if (sub) {
    return true;
  }
  const [tx] = await db
    .select({ id: creditTransactions.id })
    .from(creditTransactions)
    .innerJoin(creditWallets, eq(creditTransactions.walletId, creditWallets.id))
    .where(
      and(
        eq(creditWallets.userId, userId),
        inArray(creditTransactions.type, [
          CreditTransactionType.PURCHASE,
          CreditTransactionType.SUBSCRIPTION,
        ]),
      ),
    )
    .limit(1);
  if (tx) {
    return true;
  }
  const [payment] = await db
    .select({ id: paymentTransactions.id })
    .from(paymentTransactions)
    .where(
      and(
        eq(paymentTransactions.userId, userId),
        eq(paymentTransactions.status, PaymentStatus.SUCCEEDED),
      ),
    )
    .limit(1);
  return payment !== undefined;
}
