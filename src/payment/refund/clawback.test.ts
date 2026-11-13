/**
 * Refund / dispute clawback — integration tests against the real DB.
 *
 * A buyer gets a credit pack from a payment; refunds and disputes revoke the
 * credits that payment granted (cumulative, idempotent, never below zero) and
 * reduce the referral earnings it produced by the same share.
 */

import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { CreditTransactionType } from "@/credits/enum";
import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  referralCodes,
  referralEarnings,
  userReferrals,
} from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { ReferralRepository } from "@/referral/repository";

import { paymentTransactions } from "../db";
import { PaymentStatus } from "../enum";
import { PaymentClawbackRepository } from "./clawback";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();

let buyer: TestUser;
let referrer: TestUser;

async function walletBalance(userId: string): Promise<number> {
  const [wallet] = await db
    .select({ balance: creditWallets.balance })
    .from(creditWallets)
    .where(eq(creditWallets.userId, userId));
  return wallet?.balance ?? 0;
}

/** A paid credit pack: payment transaction + the 500-credit pack it granted. */
async function buyPack(tag: string): Promise<{
  transactionId: string;
  paymentIntentId: string;
  sessionId: string;
}> {
  const sessionId = `cs_test_clawback_${tag}_${stamp}`;
  const paymentIntentId = `pi_test_clawback_${tag}_${stamp}`;
  const [tx] = await db
    .insert(paymentTransactions)
    .values({
      userId: buyer.user.id,
      providerSessionId: sessionId,
      providerPaymentIntentId: paymentIntentId,
      amount: "5.00",
      currency: "USD",
      status: PaymentStatus.SUCCEEDED,
    })
    .returning({ id: paymentTransactions.id });
  const granted = await CreditRepository.addUserCredits(
    buyer.user.id,
    500,
    "permanent",
    logger,
    creditsT,
    undefined,
    sessionId,
  );
  expect(granted.success).toBe(true);
  return { transactionId: tx.id, paymentIntentId, sessionId };
}

function refundOf(
  paymentIntentId: string,
  reversedFraction: number,
): Parameters<typeof PaymentClawbackRepository.reverseCharge>[0] {
  return {
    kind: "refund",
    paymentIntentId,
    providerSessionId: null,
    customerId: null,
    chargeCreatedAt: new Date(),
    reversedFraction,
    sourceRef: `ch_test_${paymentIntentId}`,
  };
}

describe("PaymentClawbackRepository", () => {
  beforeAll(async () => {
    const b = await createTestUser(`clawback-buyer-${stamp}@example.com`);
    const r = await createTestUser(`clawback-referrer-${stamp}@example.com`);
    expect(b.success && r.success).toBe(true);
    if (!b.success || !r.success) {
      return;
    }
    buyer = b.data;
    referrer = r.data;
    const [code] = await db
      .insert(referralCodes)
      .values({ code: `CLAWBACK${stamp}`, ownerUserId: referrer.user.id })
      .returning({ id: referralCodes.id });
    await db.insert(userReferrals).values({
      referrerUserId: referrer.user.id,
      referredUserId: buyer.user.id,
      referralCodeId: code.id,
    });
  });

  afterAll(async () => {
    await deleteTestUser(buyer.user.id);
    await deleteTestUser(referrer.user.id);
  });

  it("partial refund revokes the refunded share; retries never double-revoke", async () => {
    const { paymentIntentId } = await buyPack("partial");
    const before = await walletBalance(buyer.user.id);

    const half = await PaymentClawbackRepository.reverseCharge(
      refundOf(paymentIntentId, 0.5),
      logger,
    );
    expect(half.success).toBe(true);
    if (!half.success) {
      return;
    }
    expect(half.data.mapped).toBe(true);
    expect(half.data.revokedCredits).toBe(250);
    expect(half.data.unrecoveredCredits).toBe(0);
    expect(await walletBalance(buyer.user.id)).toBe(before - 250);

    // Same webhook delivered again → nothing more revoked
    const replay = await PaymentClawbackRepository.reverseCharge(
      refundOf(paymentIntentId, 0.5),
      logger,
    );
    expect(replay.success && replay.data.revokedCredits).toBe(0);
    expect(await walletBalance(buyer.user.id)).toBe(before - 250);

    // Rest refunded later (cumulative amount_refunded) → the other half
    const full = await PaymentClawbackRepository.reverseCharge(
      refundOf(paymentIntentId, 1),
      logger,
    );
    expect(full.success && full.data.revokedCredits).toBe(250);
    expect(await walletBalance(buyer.user.id)).toBe(before - 500);
  });

  it("marks a fully refunded payment REFUNDED", async () => {
    const { paymentIntentId, transactionId } = await buyPack("status");
    await PaymentClawbackRepository.reverseCharge(
      refundOf(paymentIntentId, 1),
      logger,
    );
    const [tx] = await db
      .select({ status: paymentTransactions.status })
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, transactionId));
    expect(tx?.status).toBe(PaymentStatus.REFUNDED);
  });

  it("already-spent credits are flagged unrecovered, wallet never negative", async () => {
    const { paymentIntentId, sessionId } = await buyPack("spent");
    // Simulate usage: 400 of the 500 already spent from this pack
    await db
      .update(creditPacks)
      .set({ remaining: 100 })
      .where(sql`${creditPacks.metadata}->>'sessionId' = ${sessionId}`);
    const [wallet] = await db
      .select({ id: creditWallets.id })
      .from(creditWallets)
      .where(eq(creditWallets.userId, buyer.user.id));
    await db
      .update(creditWallets)
      .set({ balance: sql`GREATEST(0, ${creditWallets.balance} - 400)` })
      .where(eq(creditWallets.id, wallet.id));
    const before = await walletBalance(buyer.user.id);

    const result = await PaymentClawbackRepository.reverseCharge(
      { ...refundOf(paymentIntentId, 1), kind: "dispute" },
      logger,
    );
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.revokedCredits).toBe(500);
    expect(result.data.recoveredCredits).toBe(100);
    expect(result.data.unrecoveredCredits).toBe(400);
    const after = await walletBalance(buyer.user.id);
    expect(after).toBe(Math.max(0, before - 100));
    expect(after).toBeGreaterThanOrEqual(0);

    const [refundTx] = await db
      .select({ metadata: creditTransactions.metadata })
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.walletId, wallet.id),
          eq(creditTransactions.type, CreditTransactionType.REFUND),
          sql`${creditTransactions.metadata}->>'reason' = 'payment_dispute'`,
        ),
      );
    expect(refundTx?.metadata).toMatchObject({ unrecoveredCredits: 400 });
  });

  it("a won dispute restores what the dispute revoked, once", async () => {
    const { paymentIntentId } = await buyPack("won");
    const before = await walletBalance(buyer.user.id);
    await PaymentClawbackRepository.reverseCharge(
      { ...refundOf(paymentIntentId, 1), kind: "dispute" },
      logger,
    );
    expect(await walletBalance(buyer.user.id)).toBe(before - 500);

    const base = {
      paymentIntentId,
      providerSessionId: null,
      customerId: null,
      chargeCreatedAt: new Date(),
      sourceRef: "dp_test",
    };
    const won = await PaymentClawbackRepository.restoreWonDispute(
      base,
      `dp_test_won_${stamp}`,
      logger,
    );
    expect(won.success && won.data.restoredCredits).toBe(500);
    const again = await PaymentClawbackRepository.restoreWonDispute(
      base,
      `dp_test_won_${stamp}`,
      logger,
    );
    expect(again.success && again.data.restoredCredits).toBe(0);
    expect(await walletBalance(buyer.user.id)).toBe(before);
  });

  it("refund cancels the payment's referral earnings (pending and confirmed)", async () => {
    const { paymentIntentId, transactionId } = await buyPack("referral");
    const applied = await ReferralRepository.applyReferralPayoutOnPayment(
      transactionId,
      buyer.user.id,
      500,
      logger,
      defaultLocale,
      500,
    );
    expect(applied.success).toBe(true);

    const [earning] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, transactionId));
    expect(earning?.status).toBe(ReferralEarningStatus.PENDING);
    expect(earning?.baseCredits).toBe(500);
    expect(earning?.baseAmountUsdCents).toBe(500);

    // Confirm it (as the cron would after the hold window) — credits granted
    const confirmed = await ReferralRepository.confirmMaturedEarnings(
      logger,
      creditsT,
      new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    );
    expect(confirmed.success).toBe(true);
    const earnedBefore = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(earnedBefore.success && earnedBefore.data.total).toBeGreaterThanOrEqual(
      earning?.amountCents ?? 0,
    );

    const reversed = await PaymentClawbackRepository.reverseCharge(
      refundOf(paymentIntentId, 1),
      logger,
    );
    expect(reversed.success && reversed.data.referralReversedConfirmed).toBe(1);

    const [after] = await db
      .select({ status: referralEarnings.status })
      .from(referralEarnings)
      .where(eq(referralEarnings.id, earning?.id ?? ""));
    expect(after?.status).toBe(ReferralEarningStatus.CANCELED);
    const earnedAfter = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(earnedAfter.success && earnedBefore.success).toBe(true);
    if (earnedAfter.success && earnedBefore.success) {
      expect(earnedAfter.data.total).toBe(
        earnedBefore.data.total - (earning?.amountCents ?? 0),
      );
    }
  });

  it("commission is 10% of revenue: an $88 annual plan pays $8.80, not $0.80", async () => {
    const { transactionId } = await buyPack("annual");
    const applied = await ReferralRepository.applyReferralPayoutOnPayment(
      transactionId,
      buyer.user.id,
      8800,
      logger,
      defaultLocale,
      800,
    );
    expect(applied.success).toBe(true);
    const [earning] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, transactionId));
    expect(earning?.level).toBe(0);
    expect(earning?.amountCents).toBe(880);
    expect(earning?.baseAmountUsdCents).toBe(8800);
    expect(earning?.baseCredits).toBe(800);
  });

  it("partial refunds reduce referral earnings proportionally, retries never double-reverse", async () => {
    // Pending earning: 10% of $20 = 200, half refunded -> 100 left
    const pending = await buyPack("ref-partial-pending");
    await ReferralRepository.applyReferralPayoutOnPayment(
      pending.transactionId,
      buyer.user.id,
      2000,
      logger,
      defaultLocale,
    );
    const half = await PaymentClawbackRepository.reverseCharge(
      refundOf(pending.paymentIntentId, 0.5),
      logger,
    );
    expect(half.success && half.data.referralCanceledPending).toBe(1);
    const again = await PaymentClawbackRepository.reverseCharge(
      refundOf(pending.paymentIntentId, 0.5),
      logger,
    );
    expect(again.success && again.data.referralCanceledPending).toBe(0);
    const [p] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, pending.transactionId));
    expect(p?.status).toBe(ReferralEarningStatus.PENDING);
    expect(p?.amountCents).toBe(100);
    expect(p?.originalAmountCents).toBe(200);

    // Confirmed earning: 10% of $40 = 400, 25% refunded -> 100 clawed back
    const confirmedPay = await buyPack("ref-partial-confirmed");
    await ReferralRepository.applyReferralPayoutOnPayment(
      confirmedPay.transactionId,
      buyer.user.id,
      4000,
      logger,
      defaultLocale,
    );
    const confirmed = await ReferralRepository.confirmMaturedEarnings(
      logger,
      creditsT,
      new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    );
    expect(confirmed.success).toBe(true);
    const earnedBefore = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    const quarter = await PaymentClawbackRepository.reverseCharge(
      refundOf(confirmedPay.paymentIntentId, 0.25),
      logger,
    );
    expect(quarter.success && quarter.data.referralReversedConfirmed).toBe(1);
    const [c] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, confirmedPay.transactionId));
    expect(c?.status).toBe(ReferralEarningStatus.CONFIRMED);
    expect(c?.amountCents).toBe(300);
    const earnedAfter = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(earnedBefore.success && earnedAfter.success).toBe(true);
    if (earnedBefore.success && earnedAfter.success) {
      expect(earnedAfter.data.total).toBe(earnedBefore.data.total - 100);
    }

    // Rest refunded: the earning is canceled and the remaining 300 reversed
    const full = await PaymentClawbackRepository.reverseCharge(
      refundOf(confirmedPay.paymentIntentId, 1),
      logger,
    );
    expect(full.success && full.data.referralReversedConfirmed).toBe(1);
    const [cAfter] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, confirmedPay.transactionId));
    expect(cAfter?.status).toBe(ReferralEarningStatus.CANCELED);
    expect(cAfter?.amountCents).toBe(0);
    expect(cAfter?.originalAmountCents).toBe(400);
  });

  it("an unmappable charge is reported unmapped, not guessed", async () => {
    const result = await PaymentClawbackRepository.reverseCharge(
      refundOf(`pi_test_unknown_${stamp}`, 1),
      logger,
    );
    expect(result.success && result.data.mapped).toBe(false);
  });
});
