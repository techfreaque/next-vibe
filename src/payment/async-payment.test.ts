/**
 * Async Stripe payment methods (delayed PayPal / bank payments): a checkout
 * session that completes while still "unpaid" grants nothing; credits come
 * with checkout.session.async_payment_succeeded (once, even when the event is
 * retried or both events carry "paid"); async_payment_failed marks the
 * transaction failed and grants nothing. Events are signed with the
 * configured webhook secret and go through the real webhook handler.
 */

import "server-only";

import { eq, inArray, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import Stripe from "stripe";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { creditPacks } from "@/credits/db";
import { ProductIds } from "@/products/repository-client";

import { paymentTransactions, paymentWebhooks } from "./db";
import { CheckoutMode, PaymentProvider, PaymentStatus } from "./enum";
import { paymentEnv } from "./env";
import { PaymentRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const secret = paymentEnv.STRIPE_WEBHOOK_SECRET ?? "";
const canSign = Boolean(secret && paymentEnv.STRIPE_SECRET_KEY);
const stamp = Date.now();

let user: TestUser;
const eventIds = new Set<string>();

function sessionEvent(
  type: string,
  sessionId: string,
  paymentStatus: "paid" | "unpaid",
  eventSuffix: string,
  customer?: string,
): string {
  const id = `evt_test_async_${stamp}_${eventSuffix}`;
  eventIds.add(id);
  return JSON.stringify({
    id,
    object: "event",
    type,
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        payment_status: paymentStatus,
        customer,
        amount_total: 500,
        currency: "usd",
        metadata: {
          userId: user.user.id,
          type: "credit_pack",
          productId: ProductIds.CREDIT_PACK,
          quantity: "1",
          totalCredits: "500",
        },
      },
    },
  });
}

async function deliver(payload: string): Promise<boolean> {
  const signature = await Stripe.webhooks.generateTestHeaderStringAsync({
    payload,
    secret,
  });
  const res = await PaymentRepository.handleWebhook(
    payload,
    signature,
    defaultLocale,
    logger,
  );
  return res.success;
}

async function packCredits(sessionId: string): Promise<number> {
  const rows = await db
    .select({ amount: creditPacks.originalAmount })
    .from(creditPacks)
    .where(sql`${creditPacks.metadata}->>'sessionId' = ${sessionId}`);
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

async function pendingTransaction(sessionId: string): Promise<void> {
  await db.insert(paymentTransactions).values({
    userId: user.user.id,
    providerSessionId: sessionId,
    amount: "5.00",
    currency: "USD",
    status: PaymentStatus.PENDING,
    provider: PaymentProvider.STRIPE,
    mode: CheckoutMode.PAYMENT,
    metadata: { type: "credit_pack" },
  });
}

async function txStatus(sessionId: string): Promise<string | undefined> {
  const [row] = await db
    .select({ status: paymentTransactions.status })
    .from(paymentTransactions)
    .where(eq(paymentTransactions.providerSessionId, sessionId));
  return row?.status;
}

describe.skipIf(!canSign)("async Stripe payments", () => {
  beforeAll(async () => {
    const created = await createTestUser(`async-pay-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (created.success) {
      user = created.data;
    }
  }, 60_000);

  afterAll(async () => {
    await db.delete(paymentWebhooks).where(inArray(paymentWebhooks.providerEventId, [...eventIds]));
    await deleteTestUser(user.user.id);
  }, 60_000);

  it("unpaid completion grants nothing; async success grants once", async () => {
    const sessionId = `cs_test_async_ok_${stamp}`;
    await pendingTransaction(sessionId);

    expect(
      await deliver(
        sessionEvent("checkout.session.completed", sessionId, "unpaid", "c1"),
      ),
    ).toBe(true);
    expect(await packCredits(sessionId)).toBe(0);
    expect(await txStatus(sessionId)).toBe(PaymentStatus.PENDING);

    const succeeded = sessionEvent(
      "checkout.session.async_payment_succeeded",
      sessionId,
      "paid",
      "s1",
    );
    expect(await deliver(succeeded)).toBe(true);
    expect(await packCredits(sessionId)).toBe(500);
    expect(await txStatus(sessionId)).toBe(PaymentStatus.SUCCEEDED);

    // Retry of the same event, and a different event id for the same session
    expect(await deliver(succeeded)).toBe(true);
    expect(
      await deliver(
        sessionEvent(
          "checkout.session.async_payment_succeeded",
          sessionId,
          "paid",
          "s2",
        ),
      ),
    ).toBe(true);
    expect(await packCredits(sessionId)).toBe(500);
  }, 60_000);

  it("retries a paid checkout until its row exists and records the settled price once", async () => {
    const sessionId = `cs_test_async_retry_${stamp}`;
    const event = sessionEvent("checkout.session.completed", sessionId, "paid", "retry");
    expect(await deliver(event)).toBe(false);
    expect(await packCredits(sessionId)).toBe(0);
    await pendingTransaction(sessionId);
    await db.update(paymentTransactions).set({ amount: "9.00", currency: "EUR" })
      .where(eq(paymentTransactions.providerSessionId, sessionId));
    expect(await deliver(event)).toBe(true);
    expect(await deliver(event)).toBe(true);
    expect(await deliver(sessionEvent("checkout.session.async_payment_failed", sessionId, "unpaid", "stale-failure"))).toBe(true);
    expect(await db.select({
      amount: paymentTransactions.amount, currency: paymentTransactions.currency, status: paymentTransactions.status,
    }).from(paymentTransactions).where(eq(paymentTransactions.providerSessionId, sessionId)))
      .toEqual([{ amount: "5.00", currency: "USD", status: PaymentStatus.SUCCEEDED }]);
    expect(await packCredits(sessionId)).toBe(500);
  }, 60_000);

  it("recovers a missing row from the verified buyer and settles concurrent events once", async () => {
    const sessionId = `cs_test_async_orphan_${stamp}`;
    const customer = `cus_test_async_${stamp}`;
    await db.update(users).set({ stripeCustomerId: customer }).where(eq(users.id, user.user.id));
    const events = ["orphan1", "orphan2"].map((key) =>
      sessionEvent("checkout.session.completed", sessionId, "paid", key, customer));
    expect(await Promise.all(events.map(deliver))).toEqual([true, true]);
    const rows = await db.select().from(paymentTransactions).where(eq(paymentTransactions.providerSessionId, sessionId));
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ userId: user.user.id, status: PaymentStatus.SUCCEEDED, amount: "5.00", currency: "USD" });
    expect(await packCredits(sessionId)).toBe(500);
  }, 60_000);

  it("async failure grants nothing and fails the transaction", async () => {
    const sessionId = `cs_test_async_fail_${stamp}`;
    await pendingTransaction(sessionId);
    expect(
      await deliver(
        sessionEvent("checkout.session.completed", sessionId, "unpaid", "c2"),
      ),
    ).toBe(true);
    expect(
      await deliver(
        sessionEvent(
          "checkout.session.async_payment_failed",
          sessionId,
          "unpaid",
          "f1",
        ),
      ),
    ).toBe(true);
    expect(await packCredits(sessionId)).toBe(0);
    expect(await txStatus(sessionId)).toBe(PaymentStatus.FAILED);
  }, 60_000);

  it("instantly paid completion still grants (cards, wallets, PayPal)", async () => {
    const sessionId = `cs_test_async_instant_${stamp}`;
    await pendingTransaction(sessionId);
    expect(
      await deliver(
        sessionEvent("checkout.session.completed", sessionId, "paid", "c3"),
      ),
    ).toBe(true);
    expect(await packCredits(sessionId)).toBe(500);
  }, 60_000);
});
