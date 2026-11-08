/**
 * Referral earnings lifecycle + payout safety — integration tests (real DB).
 *
 * - New earnings are PENDING: visible, but neither spendable nor payable.
 * - After the refund window the confirm cron makes them available.
 * - Concurrent payout requests cannot double-spend the same balance.
 * - A CREDITS conversion moves earned → permanent credits exactly once.
 */

import "server-only";

import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { paymentTransactions } from "@/payment/db";
import { PaymentStatus } from "@/payment/enum";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { REFERRAL_CONFIG } from "../config";
import {
  payoutRequests,
  referralCodes,
  referralEarnings,
  userReferrals,
} from "../db";
import { PayoutCurrency, PayoutStatus, ReferralEarningStatus } from "../enum";
import { ReferralRepository } from "../repository";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();
const DAY_MS = 24 * 60 * 60 * 1000;

let buyer: TestUser;
let referrer: TestUser;

/** One paid purchase by the buyer → referral earning for the referrer. */
async function purchase(credits: number, tag: string): Promise<string> {
  const [tx] = await db
    .insert(paymentTransactions)
    .values({
      userId: buyer.user.id,
      providerSessionId: `cs_test_payout_${tag}_${stamp}`,
      amount: "50.00",
      currency: "USD",
      status: PaymentStatus.SUCCEEDED,
    })
    .returning({ id: paymentTransactions.id });
  const applied = await ReferralRepository.applyReferralPayoutOnPayment(
    tx.id,
    buyer.user.id,
    credits,
    logger,
    defaultLocale,
  );
  expect(applied.success).toBe(true);
  return tx.id;
}

async function confirmAll(): Promise<void> {
  const result = await ReferralRepository.confirmMaturedEarnings(
    logger,
    creditsT,
    new Date(Date.now() + (REFERRAL_CONFIG.EARNING_HOLD_DAYS + 1) * DAY_MS),
  );
  expect(result.success).toBe(true);
}

describe("Referral earnings + payouts", () => {
  beforeAll(async () => {
    const b = await createTestUser(`payout-buyer-${stamp}@example.com`);
    const r = await createTestUser(`payout-referrer-${stamp}@example.com`);
    expect(b.success && r.success).toBe(true);
    if (!b.success || !r.success) {
      return;
    }
    buyer = b.data;
    referrer = r.data;
    const [code] = await db
      .insert(referralCodes)
      .values({ code: `PAYOUT${stamp}`, ownerUserId: referrer.user.id })
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

  it("new earnings are pending: shown, not spendable, not payable", async () => {
    const txId = await purchase(10_000, "pending");
    const [earning] = await db
      .select()
      .from(referralEarnings)
      .where(eq(referralEarnings.transactionId, txId));
    expect(earning?.status).toBe(ReferralEarningStatus.PENDING);
    expect(earning?.amountCents).toBe(1000); // 10% direct

    const balance = await ReferralRepository.getEarnedBalance(
      referrer.user.id,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(balance.success).toBe(true);
    if (!balance.success) {
      return;
    }
    expect(balance.data.earnedCredits.pending).toBe(1000);
    expect(balance.data.earnedCredits.available).toBe(0);

    // Inside the window the cron leaves it alone
    const early = await ReferralRepository.confirmMaturedEarnings(
      logger,
      creditsT,
      new Date(Date.now() + DAY_MS),
    );
    expect(early.success).toBe(true);
    const [still] = await db
      .select({ status: referralEarnings.status })
      .from(referralEarnings)
      .where(eq(referralEarnings.id, earning?.id ?? ""));
    expect(still?.status).toBe(ReferralEarningStatus.PENDING);
  });

  it("after the refund window the earning becomes available, once", async () => {
    await confirmAll();
    await confirmAll(); // idempotent: no second grant
    const balance = await ReferralRepository.getEarnedBalance(
      referrer.user.id,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(balance.success).toBe(true);
    if (!balance.success) {
      return;
    }
    expect(balance.data.earnedCredits.pending).toBe(0);
    expect(balance.data.earnedCredits.available).toBe(1000);
  });

  it("concurrent payout requests cannot double-spend", async () => {
    // Top up to 5000 available (one payout of 4000 fits, two do not)
    await purchase(40_000, "concurrent");
    await confirmAll();
    const before = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(before.success && before.data.available).toBe(5000);

    const requests = await Promise.all(
      Array.from({ length: 4 }, () =>
        ReferralRepository.requestPayout(
          referrer.user.id,
          REFERRAL_CONFIG.MIN_PAYOUT_CENTS,
          PayoutCurrency.BTC,
          "bc1qtestwalletaddress",
          logger,
          creditsT,
          defaultLocale,
        ),
      ),
    );
    expect(requests.filter((r) => r.success)).toHaveLength(1);

    const open = await db
      .select({ amountCents: payoutRequests.amountCents })
      .from(payoutRequests)
      .where(eq(payoutRequests.userId, referrer.user.id));
    expect(open).toHaveLength(1);
    const after = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(after.success && after.data.available).toBe(1000);
  });

  it("converting earnings to credits completes and moves the balance", async () => {
    // Free the locked BTC request so the full 5000 is convertible again
    await db
      .update(payoutRequests)
      .set({ status: PayoutStatus.REJECTED })
      .where(eq(payoutRequests.userId, referrer.user.id));

    const converted = await ReferralRepository.requestPayout(
      referrer.user.id,
      REFERRAL_CONFIG.MIN_PAYOUT_CENTS,
      PayoutCurrency.CREDITS,
      null,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(converted.success).toBe(true);
    if (!converted.success) {
      return;
    }
    const [request] = await db
      .select({ status: payoutRequests.status })
      .from(payoutRequests)
      .where(eq(payoutRequests.id, converted.data.payoutRequestId));
    expect(request?.status).toBe(PayoutStatus.COMPLETED);

    const earned = await CreditRepository.getEarnedCreditsBalance(
      referrer.user.id,
      logger,
      creditsT,
    );
    expect(earned.success && earned.data.total).toBe(1000);
  });
});
