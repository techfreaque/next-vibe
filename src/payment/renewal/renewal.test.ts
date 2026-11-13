/**
 * Subscription renewals: recorded once per invoice, commission on the amount
 * paid, refunds claw back proportionally. Integration tests against the real DB.
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { scopedTranslation as creditsScopedTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import {
  referralCodes,
  referralEarnings,
  userReferrals,
} from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/subscription/enum";
import { subscriptionRenewalSessionKey } from "@/subscription/renewal-key";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";

import { paymentTransactions, paymentWebhooks } from "../db";
import { PaymentProvider } from "../enum";
import { PaymentClawbackRepository } from "../refund/clawback";
import { type PaidRenewalInvoice, PaymentRenewalRepository } from "./renewal";

const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsScopedTranslation.scopedT(defaultLocale).t;
const stamp = Date.now();
const PERIOD_END = new Date(Date.UTC(2026, 11, 13, 12, 0, 0));

let monthlyBuyer: TestUser;
let annualBuyer: TestUser;
let referrer: TestUser;
let upline: TestUser;
const webhookEventIds: string[] = [];

const monthlySub = `sub_test_renewal_monthly_${stamp}`;
const annualSub = `sub_test_renewal_annual_${stamp}`;

function invoice(
  tag: string,
  subscriptionId: string,
  amountPaidMinor: number,
  overrides: Partial<PaidRenewalInvoice> = {},
): PaidRenewalInvoice {
  return {
    invoiceId: `in_test_renewal_${tag}_${stamp}`,
    subscriptionId,
    billingReason: "subscription_cycle",
    amountPaidMinor,
    currency: "usd",
    customerId: null,
    paymentIntentId: null,
    ...overrides,
  };
}

async function earningsOf(transactionId: string): Promise<
  Array<{
    level: number;
    amountCents: number;
    originalAmountCents: number | null;
    baseAmountUsdCents: number | null;
    status: string;
    earnerUserId: string;
  }>
> {
  return db
    .select({
      level: referralEarnings.level,
      amountCents: referralEarnings.amountCents,
      originalAmountCents: referralEarnings.originalAmountCents,
      baseAmountUsdCents: referralEarnings.baseAmountUsdCents,
      status: referralEarnings.status,
      earnerUserId: referralEarnings.earnerUserId,
    })
    .from(referralEarnings)
    .where(eq(referralEarnings.transactionId, transactionId))
    .orderBy(referralEarnings.level);
}

async function transactionsFor(invoiceId: string): Promise<
  Array<{
    id: string;
    amount: string;
    currency: string;
    providerPaymentIntentId: string | null;
    providerSessionId: string | null;
  }>
> {
  return db
    .select({
      id: paymentTransactions.id,
      amount: paymentTransactions.amount,
      currency: paymentTransactions.currency,
      providerPaymentIntentId: paymentTransactions.providerPaymentIntentId,
      providerSessionId: paymentTransactions.providerSessionId,
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.providerInvoiceId, invoiceId));
}

async function addSubscription(
  user: TestUser,
  providerSubscriptionId: string,
  billingInterval: typeof BillingInterval.MONTHLY | typeof BillingInterval.YEARLY,
): Promise<void> {
  await db.insert(subscriptions).values({
    userId: user.user.id,
    status: SubscriptionStatus.ACTIVE,
    planId: SubscriptionPlan.SUBSCRIPTION,
    billingInterval,
    currentPeriodStart: new Date(PERIOD_END.getTime() - 30 * 86_400_000),
    currentPeriodEnd: PERIOD_END,
    provider: PaymentProvider.STRIPE,
    providerSubscriptionId,
  });
}

async function refer(
  referred: TestUser,
  by: TestUser,
  tag: string,
): Promise<void> {
  const [code] = await db
    .insert(referralCodes)
    .values({ code: `RENEW${tag}${stamp}`, ownerUserId: by.user.id })
    .returning({ id: referralCodes.id });
  await db.insert(userReferrals).values({
    referrerUserId: by.user.id,
    referredUserId: referred.user.id,
    referralCodeId: code.id,
  });
}

describe("PaymentRenewalRepository", () => {
  beforeAll(async () => {
    const users = await Promise.all(
      ["monthly", "annual", "referrer", "upline"].map((role) =>
        createTestUser(`renewal-${role}-${stamp}@example.com`),
      ),
    );
    const [m, a, r, u] = users;
    if (!m?.success || !a?.success || !r?.success || !u?.success) {
      expect.fail("test users not created");
      return;
    }
    monthlyBuyer = m.data;
    annualBuyer = a.data;
    referrer = r.data;
    upline = u.data;
    // monthly/annual buyer -> referrer -> upline
    await refer(referrer, upline, "U");
    await refer(monthlyBuyer, referrer, "M");
    await refer(annualBuyer, referrer, "A");
    await addSubscription(monthlyBuyer, monthlySub, BillingInterval.MONTHLY);
    await addSubscription(annualBuyer, annualSub, BillingInterval.YEARLY);
  });

  afterAll(async () => {
    if (webhookEventIds.length > 0) {
      await db
        .delete(paymentWebhooks)
        .where(inArray(paymentWebhooks.providerEventId, webhookEventIds));
    }
    for (const user of [monthlyBuyer, annualBuyer, referrer, upline]) {
      if (user) {
        await deleteTestUser(user.user.id);
      }
    }
  });

  it("monthly renewal: records the payment and books 10% direct + upline, once", async () => {
    const paid = invoice("monthly", monthlySub, 800);
    const result = await PaymentRenewalRepository.recordPaidRenewal(
      paid,
      logger,
      defaultLocale,
    );
    expect(result.success).toBe(true);
    if (!result.success || !result.data.transactionId) {
      expect.fail("renewal not recorded");
      return;
    }
    expect(result.data.revenueUsdCents).toBe(800);

    const txs = await transactionsFor(paid.invoiceId);
    expect(txs).toHaveLength(1);
    expect(txs[0]?.amount).toBe("8.00");
    expect(txs[0]?.currency).toBe("USD");
    expect(txs[0]?.providerSessionId).toBe(
      subscriptionRenewalSessionKey(
        monthlySub,
        PERIOD_END.getTime(),
      ),
    );

    const earnings = await earningsOf(result.data.transactionId);
    expect(earnings).toHaveLength(2);
    expect(earnings[0]).toMatchObject({
      level: 0,
      earnerUserId: referrer.user.id,
      amountCents: 80,
      baseAmountUsdCents: 800,
      status: ReferralEarningStatus.PENDING,
    });
    expect(earnings[1]).toMatchObject({
      level: 1,
      earnerUserId: upline.user.id,
      amountCents: 80,
      status: ReferralEarningStatus.PENDING,
    });
  });

  it("annual renewal books 10% of the annual amount", async () => {
    const paid = invoice("annual", annualSub, 8800);
    const result = await PaymentRenewalRepository.recordPaidRenewal(
      paid,
      logger,
      defaultLocale,
    );
    expect(result.success && result.data.transactionId).toBeTruthy();
    if (!result.success || !result.data.transactionId) {
      return;
    }
    const earnings = await earningsOf(result.data.transactionId);
    expect(earnings.map((e) => [e.level, e.amountCents])).toEqual([
      [0, 880],
      [1, 880],
    ]);
    expect(earnings[0]?.baseAmountUsdCents).toBe(8800);
  });

  it("duplicate and concurrent webhooks for one invoice book once", async () => {
    const paid = invoice("dupe", monthlySub, 800);
    // invoice.paid + invoice.payment_succeeded arrive together, plus retries
    const results = await Promise.all(
      Array.from({ length: 5 }, () =>
        PaymentRenewalRepository.recordPaidRenewal(paid, logger, defaultLocale),
      ),
    );
    expect(results.every((r) => r.success)).toBe(true);
    const replay = await PaymentRenewalRepository.recordPaidRenewal(
      paid,
      logger,
      defaultLocale,
    );
    expect(replay.success).toBe(true);

    const txs = await transactionsFor(paid.invoiceId);
    expect(txs).toHaveLength(1);
    const ids = new Set(
      [...results, replay].map((r) => (r.success ? r.data.transactionId : "")),
    );
    expect([...ids]).toEqual([txs[0]?.id]);
    const earnings = await earningsOf(txs[0]?.id ?? "");
    expect(earnings.map((e) => [e.level, e.amountCents])).toEqual([
      [0, 80],
      [1, 80],
    ]);
  });

  it("the first invoice and $0 invoices record nothing", async () => {
    const first = invoice("create", monthlySub, 800, {
      billingReason: "subscription_create",
    });
    const free = invoice("free", monthlySub, 0);
    for (const paid of [first, free]) {
      const result = await PaymentRenewalRepository.recordPaidRenewal(
        paid,
        logger,
        defaultLocale,
      );
      expect(result.success && result.data.transactionId).toBe(null);
      expect(await transactionsFor(paid.invoiceId)).toHaveLength(0);
    }
  });

  it("refund of a renewal claws back credits and commission proportionally", async () => {
    const paid = invoice("refund", monthlySub, 800);
    const paymentIntentId = `pi_test_renewal_refund_${stamp}`;
    // invoice_payment.paid handled before invoice.paid: only its log row exists
    const eventId = `evt_test_renewal_ip_${stamp}`;
    webhookEventIds.push(eventId);
    await db.insert(paymentWebhooks).values({
      providerEventId: eventId,
      eventType: "invoice_payment.paid",
      processed: true,
      data: JSON.stringify({
        id: eventId,
        type: "invoice_payment.paid",
        data: {
          object: {
            object: "invoice_payment",
            invoice: paid.invoiceId,
            payment: { type: "payment_intent", payment_intent: paymentIntentId },
          },
        },
      }),
    });
    // The renewal credit grant (invoice.created / invoice.paid path)
    const renewalKey = subscriptionRenewalSessionKey(
      monthlySub,
      PERIOD_END.getTime(),
    );
    const granted = await CreditRepository.addUserCredits(
      monthlyBuyer.user.id,
      800,
      "subscription",
      logger,
      creditsT,
      PERIOD_END,
      renewalKey,
    );
    expect(granted.success).toBe(true);

    const result = await PaymentRenewalRepository.recordPaidRenewal(
      paid,
      logger,
      defaultLocale,
    );
    if (!result.success || !result.data.transactionId) {
      expect.fail("renewal not recorded");
      return;
    }
    const [tx] = await transactionsFor(paid.invoiceId);
    expect(tx?.providerPaymentIntentId).toBe(paymentIntentId);

    // charge.refunded with half of the renewal refunded
    const half = await PaymentClawbackRepository.reverseCharge(
      {
        kind: "refund",
        paymentIntentId,
        providerSessionId: null,
        customerId: null,
        chargeCreatedAt: new Date(),
        reversedFraction: 0.5,
        sourceRef: `ch_test_renewal_${stamp}`,
      },
      logger,
    );
    expect(half.success).toBe(true);
    if (!half.success) {
      return;
    }
    expect(half.data.mapped).toBe(true);
    expect(half.data.transactionId).toBe(result.data.transactionId);
    expect(half.data.revokedCredits).toBe(400);
    expect(half.data.referralCanceledPending).toBe(2);

    const earnings = await earningsOf(result.data.transactionId);
    expect(
      earnings.map((e) => [e.level, e.amountCents, e.originalAmountCents]),
    ).toEqual([
      [0, 40, 80],
      [1, 40, 80],
    ]);
  });

  it("invoice_payment.paid after the renewal links the payment intent", async () => {
    const paid = invoice("late-pi", monthlySub, 800);
    await PaymentRenewalRepository.recordPaidRenewal(
      paid,
      logger,
      defaultLocale,
    );
    const paymentIntentId = `pi_test_renewal_late_${stamp}`;
    await PaymentRenewalRepository.linkInvoicePaymentIntent(
      paid.invoiceId,
      paymentIntentId,
      logger,
    );
    const [tx] = await transactionsFor(paid.invoiceId);
    expect(tx?.providerPaymentIntentId).toBe(paymentIntentId);
    // Never overwritten by a later, different intent
    await PaymentRenewalRepository.linkInvoicePaymentIntent(
      paid.invoiceId,
      "pi_other",
      logger,
    );
    const [again] = await transactionsFor(paid.invoiceId);
    expect(again?.providerPaymentIntentId).toBe(paymentIntentId);
  });
});
