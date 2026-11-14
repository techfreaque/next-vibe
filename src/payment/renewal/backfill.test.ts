/**
 * Renewal commission backfill: renewals paid before renewals were recorded are
 * replayed from the webhook log through recordPaidRenewal, for referred buyers
 * only, dated at the payment, once. Integration test against the dev DB.
 */

import "server-only";

import { eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { referralCodes, referralEarnings, userReferrals } from "@/referral/db";
import { ReferralEarningStatus } from "@/referral/enum";
import { subscriptions } from "@/subscription/db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@/subscription/enum";
import { subscriptionRenewalSessionKey } from "@/subscription/renewal-key";

import { paymentTransactions, paymentWebhooks } from "../db";
import { PaymentProvider } from "../enum";
import {
  backfillReferredRenewalCommissions,
  RENEWAL_RECORDING_START,
} from "./backfill";

const logger = createEndpointLogger(false, defaultLocale);
const stamp = Date.now();
const DAY = 86_400_000;
const referredSub = `sub_test_backfill_referred_${stamp}`;
const plainSub = `sub_test_backfill_plain_${stamp}`;
const eventIds: string[] = [];

let referred: TestUser;
let plain: TestUser;
let referrer: TestUser;

const sec = (d: Date): number => Math.floor(d.getTime() / 1000);

/** Paid invoices as Stripe sent them (both events, like production) */
const OLD_PAID = new Date(RENEWAL_RECORDING_START.getTime() - 120 * DAY);
const OLD_PERIOD_END = new Date(OLD_PAID.getTime() + 30 * DAY);
const RECENT_PAID = new Date(Date.now() - 2 * DAY);
const invoices = {
  old: `in_test_backfill_old_${stamp}`,
  recent: `in_test_backfill_recent_${stamp}`,
  initial: `in_test_backfill_initial_${stamp}`,
  plain: `in_test_backfill_plain_${stamp}`,
};

async function logInvoice(
  invoiceId: string,
  subscriptionId: string,
  billingReason: string,
  paidAt: Date,
  periodEnd: Date,
  receivedAt: Date,
): Promise<void> {
  for (const type of ["invoice.paid", "invoice.payment_succeeded"]) {
    const eventId = `evt_test_backfill_${type}_${invoiceId}`;
    eventIds.push(eventId);
    await db.insert(paymentWebhooks).values({
      providerEventId: eventId,
      eventType: type,
      processed: true,
      createdAt: receivedAt,
      data: JSON.stringify({
        id: eventId,
        type,
        data: {
          object: {
            id: invoiceId,
            object: "invoice",
            billing_reason: billingReason,
            amount_paid: 800,
            currency: "usd",
            customer: null,
            parent: { subscription_details: { subscription: subscriptionId } },
            status_transitions: { paid_at: sec(paidAt) },
            lines: {
              data: [{ period: { start: sec(paidAt), end: sec(periodEnd) } }],
            },
          },
        },
      }),
    });
  }
}

async function addSubscription(user: TestUser, id: string): Promise<void> {
  await db.insert(subscriptions).values({
    userId: user.user.id,
    status: SubscriptionStatus.CANCELED,
    planId: SubscriptionPlan.SUBSCRIPTION,
    billingInterval: BillingInterval.MONTHLY,
    currentPeriodStart: new Date(Date.now() - 30 * DAY),
    currentPeriodEnd: new Date(Date.now() + 30 * DAY),
    provider: PaymentProvider.STRIPE,
    providerSubscriptionId: id,
  });
}

async function txFor(invoiceId: string): Promise<
  Array<{ id: string; createdAt: Date; providerSessionId: string | null }>
> {
  return db
    .select({
      id: paymentTransactions.id,
      createdAt: paymentTransactions.createdAt,
      providerSessionId: paymentTransactions.providerSessionId,
    })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.providerInvoiceId, invoiceId));
}

describe("backfillReferredRenewalCommissions", () => {
  beforeAll(async () => {
    const created = await Promise.all(
      ["referred", "plain", "referrer"].map((role) =>
        createTestUser(`backfill-${role}-${stamp}@example.com`),
      ),
    );
    const [a, b, c] = created;
    if (!a?.success || !b?.success || !c?.success) {
      expect.fail("test users not created");
      return;
    }
    referred = a.data;
    plain = b.data;
    referrer = c.data;
    const [code] = await db
      .insert(referralCodes)
      .values({ code: `BACKFILL${stamp}`, ownerUserId: referrer.user.id })
      .returning({ id: referralCodes.id });
    await db.insert(userReferrals).values({
      referrerUserId: referrer.user.id,
      referredUserId: referred.user.id,
      referralCodeId: code.id,
    });
    await addSubscription(referred, referredSub);
    await addSubscription(plain, plainSub);

    const beforeStart = new Date(RENEWAL_RECORDING_START.getTime() - DAY);
    await logInvoice(invoices.old, referredSub, "subscription_cycle", OLD_PAID, OLD_PERIOD_END, beforeStart);
    await logInvoice(invoices.recent, referredSub, "subscription_cycle", RECENT_PAID, new Date(RECENT_PAID.getTime() + 30 * DAY), beforeStart);
    await logInvoice(invoices.initial, referredSub, "subscription_create", OLD_PAID, OLD_PERIOD_END, beforeStart);
    await logInvoice(invoices.plain, plainSub, "subscription_cycle", OLD_PAID, OLD_PERIOD_END, beforeStart);
  });

  afterAll(async () => {
    if (eventIds.length > 0) {
      await db
        .delete(paymentWebhooks)
        .where(inArray(paymentWebhooks.providerEventId, eventIds));
    }
    for (const user of [referred, plain, referrer]) {
      if (user) {
        await deleteTestUser(user.user.id);
      }
    }
  });

  it("books the referred renewals once, dated at payment; matured ones confirm", async () => {
    await backfillReferredRenewalCommissions(logger, defaultLocale);

    const [old] = await txFor(invoices.old);
    const [recent] = await txFor(invoices.recent);
    expect(old).toBeDefined();
    expect(recent).toBeDefined();
    if (!old || !recent) {
      return;
    }
    expect(old.createdAt.getTime()).toBe(sec(OLD_PAID) * 1000);
    expect(old.providerSessionId).toBe(
      subscriptionRenewalSessionKey(referredSub, sec(OLD_PERIOD_END) * 1000),
    );

    // Initial invoices belong to checkout; non-referred renewals owe nothing
    expect(await txFor(invoices.initial)).toHaveLength(0);
    expect(await txFor(invoices.plain)).toHaveLength(0);

    const earnings = await db
      .select({
        transactionId: referralEarnings.transactionId,
        earnerUserId: referralEarnings.earnerUserId,
        amountCents: referralEarnings.amountCents,
        status: referralEarnings.status,
      })
      .from(referralEarnings)
      .where(inArray(referralEarnings.transactionId, [old.id, recent.id]));
    const oldEarning = earnings.find((e) => e.transactionId === old.id);
    const recentEarning = earnings.find((e) => e.transactionId === recent.id);
    expect(oldEarning?.earnerUserId).toBe(referrer.user.id);
    expect(oldEarning?.amountCents).toBe(80);
    // Paid long ago: the hold period is over, so it is confirmed now
    expect(oldEarning?.status).toBe(ReferralEarningStatus.CONFIRMED);
    // Paid two days ago: still in the hold period
    expect(recentEarning?.status).toBe(ReferralEarningStatus.PENDING);

    // Rerun: nothing new
    const again = await backfillReferredRenewalCommissions(
      logger,
      defaultLocale,
    );
    expect(again.replayed).toBe(0);
    expect(await txFor(invoices.old)).toHaveLength(1);
    const rerunEarnings = await db
      .select({ id: referralEarnings.id })
      .from(referralEarnings)
      .where(inArray(referralEarnings.transactionId, [old.id, recent.id]));
    expect(rerunEarnings).toHaveLength(2);
  }, 60_000);
});
