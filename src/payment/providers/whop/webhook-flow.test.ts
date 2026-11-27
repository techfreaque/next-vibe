/**
 * Whop webhooks end to end through PaymentRepository.handleWebhook (real DB):
 * a signed payment.succeeded grants a credit pack once; a plan's first
 * payment stores the Whop subscription and its credits; membership.updated
 * flips cancel-at-period-end; a renewal books the payment and the next
 * period; a deactivated membership ends the plan.
 *
 * Signed with the webhook secret of the active WHOP_ENVIRONMENT (sandbox on
 * dev machines). The only Whop API call (GET /memberships/{id}) is stubbed.
 */

import { and, eq, sql } from "drizzle-orm";
import { db } from "next-vibe/database";
import { pgliteReady } from "next-vibe/database/client";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterEach, expect, it, vi } from "vitest";

import { creditPacks } from "../../../credits/db";
import { subscriptions } from "../../../subscription/db";
import {
  BillingInterval,
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../../subscription/enum";
import { subscriptionRenewalSessionKey } from "../../../subscription/renewal-key";
import { paymentTransactions } from "../../db";
import { PaymentProvider, PaymentStatus } from "../../enum";
import { PaymentRepository } from "../../repository";
import { getWhopCredentials } from "./config";
import { encodeWhopSignatureHeaders, signWhopPayload } from "./signature";

const logger = createEndpointLogger(false, "en-US");
const secret = getWhopCredentials().webhookSecret;

afterEach(() => {
  vi.restoreAllMocks();
});

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

function deliver(
  type: string,
  data: { [key: string]: Json },
): ReturnType<typeof PaymentRepository.handleWebhook> {
  const id = `msg_${crypto.randomUUID().replaceAll("-", "")}`;
  const timestamp = String(Math.floor(Date.now() / 1000));
  const body = JSON.stringify({
    id,
    type,
    api_version: "v1",
    api_version_date: "2026-11-25",
    timestamp: new Date().toISOString(),
    account_id: "biz_fixture",
    data,
  });
  const signature = signWhopPayload({
    secret: secret ?? "",
    id,
    timestamp,
    body,
  });
  return PaymentRepository.handleWebhook(
    body,
    encodeWhopSignatureHeaders({ id, timestamp, signature }),
    "en-US",
    logger,
    PaymentProvider.WHOP,
  );
}

function stubMembership(membership: { [key: string]: Json }): void {
  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    Response.json(membership),
  );
}

async function packsFor(sessionId: string): Promise<number[]> {
  const rows = await db
    .select({ amount: creditPacks.originalAmount })
    .from(creditPacks)
    .where(sql`${creditPacks.metadata}->>'sessionId' = ${sessionId}`);
  return rows.map((row) => row.amount);
}

const money = (amount: string): { [key: string]: Json } => ({
  amount,
  currency: "usd",
  decimals: 2,
  display_decimals: 2,
});

it.skipIf(!secret)(
  "rejects a forged Whop webhook",
  async () => {
    const body = JSON.stringify({ id: "msg_x", type: "payment.succeeded", data: { id: "pay_x" } });
    const result = await PaymentRepository.handleWebhook(
      body,
      encodeWhopSignatureHeaders({
        id: "msg_x",
        timestamp: String(Math.floor(Date.now() / 1000)),
        signature: "v1,Zm9yZ2Vk",
      }),
      "en-US",
      logger,
      PaymentProvider.WHOP,
    );
    expect(result.success).toBe(false);
  },
);

it.skipIf(!secret)(
  "grants a Whop credit pack once, however often the payment arrives",
  async () => {
    await pgliteReady;
    const created = await createTestUser(
      `whop-pack-${crypto.randomUUID()}@example.test`,
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    const userId = created.data.user.id;
    const checkoutId = `ch_${crypto.randomUUID().replaceAll("-", "")}`;
    const paymentId = `pay_${crypto.randomUUID().replaceAll("-", "")}`;
    try {
      const payment = {
        id: paymentId,
        status: "paid",
        substatus: "succeeded",
        billing_reason: "one_time",
        currency: "usd",
        total: money("10.00"),
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        membership_id: null,
        checkout_configuration_id: checkoutId,
        metadata: {
          userId,
          type: "credit_pack",
          productId: "credit_pack",
          quantity: "2",
          totalAmount: "10",
          totalCredits: "1000",
          provider: PaymentProvider.WHOP,
        },
      };
      const first = await deliver("payment.succeeded", payment);
      expect(first.success, JSON.stringify(first)).toBe(true);
      const again = await deliver("payment.succeeded", payment);
      expect(again.success).toBe(true);

      expect(await packsFor(checkoutId)).toEqual([1000]);
      const [transaction] = await db
        .select()
        .from(paymentTransactions)
        .where(
          and(
            eq(paymentTransactions.provider, PaymentProvider.WHOP),
            eq(paymentTransactions.providerSessionId, checkoutId),
          ),
        );
      expect(transaction).toMatchObject({
        userId,
        status: PaymentStatus.SUCCEEDED,
        providerPaymentIntentId: paymentId,
        amount: "10.00",
        currency: "USD",
      });
    } finally {
      await deleteTestUser(userId);
    }
  },
);

it.skipIf(!secret)(
  "runs a Whop plan through first payment, cancel at period end, renewal and end",
  async () => {
    await pgliteReady;
    const created = await createTestUser(
      `whop-plan-${crypto.randomUUID()}@example.test`,
    );
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    const userId = created.data.user.id;
    const membershipId = `mem_${crypto.randomUUID().replaceAll("-", "")}`;
    const checkoutId = `ch_${crypto.randomUUID().replaceAll("-", "")}`;
    const day = 86_400_000;
    const start = new Date(Math.floor(Date.now() / 1000) * 1000);
    const end = new Date(start.getTime() + 30 * day);
    const nextEnd = new Date(end.getTime() + 30 * day);
    const metadata = {
      userId,
      type: "subscription",
      planId: SubscriptionPlan.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
      productId: "subscription",
      interval: "month",
      provider: PaymentProvider.WHOP,
    };
    try {
      stubMembership({
        id: membershipId,
        status: "active",
        cancel_at_period_end: false,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
        metadata,
      });
      const first = await deliver("payment.succeeded", {
        id: `pay_first_${membershipId}`,
        status: "paid",
        billing_reason: "subscription_create",
        currency: "usd",
        total: money("8.00"),
        paid_at: start.toISOString(),
        created_at: start.toISOString(),
        membership_id: membershipId,
        checkout_configuration_id: checkoutId,
        metadata,
      });
      expect(first.success, JSON.stringify(first)).toBe(true);

      const [row] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(row).toMatchObject({
        provider: PaymentProvider.WHOP,
        providerSubscriptionId: membershipId,
        status: SubscriptionStatus.ACTIVE,
        billingInterval: BillingInterval.MONTHLY,
      });
      expect(row?.currentPeriodEnd?.getTime()).toBe(end.getTime());
      expect(
        await packsFor(
          subscriptionRenewalSessionKey(membershipId, end.getTime()),
        ),
      ).toHaveLength(1);

      const cancel = await deliver("membership.updated", {
        id: membershipId,
        status: "active",
        cancel_at_period_end: true,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
      });
      expect(cancel.success).toBe(true);
      const [canceling] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(canceling?.cancelAtPeriodEnd).toBe(true);
      expect(canceling?.status).toBe(SubscriptionStatus.ACTIVE);

      const uncancel = await deliver("membership.updated", {
        id: membershipId,
        status: "active",
        cancel_at_period_end: false,
        current_period_start: start.toISOString(),
        current_period_end: end.toISOString(),
      });
      expect(uncancel.success).toBe(true);

      vi.restoreAllMocks();
      stubMembership({
        id: membershipId,
        status: "active",
        current_period_start: end.toISOString(),
        current_period_end: nextEnd.toISOString(),
      });
      const renewalId = `pay_cycle_${membershipId}`;
      const renewal = await deliver("payment.succeeded", {
        id: renewalId,
        status: "paid",
        billing_reason: "subscription_cycle",
        currency: "usd",
        total: money("8.00"),
        paid_at: new Date(end.getTime() + 1000).toISOString(),
        membership_id: membershipId,
        metadata,
      });
      expect(renewal.success, JSON.stringify(renewal)).toBe(true);
      const [renewed] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(renewed?.currentPeriodEnd?.getTime()).toBe(nextEnd.getTime());
      expect(renewed?.cancelAtPeriodEnd).toBe(false);
      expect(
        await packsFor(
          subscriptionRenewalSessionKey(membershipId, nextEnd.getTime()),
        ),
      ).toHaveLength(1);
      const [renewalTx] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.providerInvoiceId, renewalId));
      expect(renewalTx).toMatchObject({
        provider: PaymentProvider.WHOP,
        amount: "8.00",
        providerPaymentIntentId: renewalId,
      });

      const ended = await deliver("membership.updated", {
        id: membershipId,
        status: "canceled",
        cancel_at_period_end: false,
        current_period_start: end.toISOString(),
        current_period_end: nextEnd.toISOString(),
      });
      expect(ended.success).toBe(true);
      const [final] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, userId));
      expect(final?.status).toBe(SubscriptionStatus.CANCELED);
    } finally {
      await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
      await deleteTestUser(userId);
    }
  },
);
