import "server-only";

import { and, eq, inArray, sql } from "drizzle-orm";
import { ChatModelId } from "next-vibe/agent/ai-stream/models";
import { success } from "next-vibe/core/route/response.schema";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import Stripe from "stripe";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { creditPacks, creditTransactions, creditWallets } from "@/credits/db";
import { scopedTranslation as creditsTranslation } from "@/credits/i18n";
import { CreditRepository } from "@/credits/repository";
import { paymentTransactions, paymentWebhooks } from "@/payment/db";
import { PaymentProvider } from "@/payment/enum";
import { paymentEnv } from "@/payment/env";
import { StripeProvider } from "@/payment/providers/stripe/repository";
import { PaymentRepository } from "@/payment/repository";
import { subscriptions } from "./db";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { subscriptionRenewalSessionKey } from "./renewal-key";
import { SubscriptionRepository } from "./repository";

const stamp = Date.now();
const start = Math.floor(stamp / 1000);
const end = start + 30 * 86400;
const logger = createEndpointLogger(false, defaultLocale);
const creditsT = creditsTranslation.scopedT(defaultLocale).t;
const secret = "whsec_period_fixture";
const originalSecret = paymentEnv.STRIPE_WEBHOOK_SECRET;
const buyers: TestUser[] = [];
const events = new Set<string>();
const customer = `cus_period_${stamp}`;

function ids(tag: string) {
  const sub = `sub_period_${tag}_${stamp}`;
  return {
    sub,
    invoice: `in_period_${tag}_${stamp}`,
    key: subscriptionRenewalSessionKey(sub, end * 1000),
  };
}

async function deliver(
  tag: string,
  event: string,
  suffix = "",
  reason = "subscription_cycle",
): Promise<boolean> {
  const { sub, invoice } = ids(tag);
  const id = `evt_period_${tag}_${event}_${suffix}_${stamp}`;
  events.add(id);
  const paid =
    event === "invoice.paid" || event === "invoice.payment_succeeded";
  const payload = JSON.stringify({
    id,
    type: event,
    data: {
      object:
        event === "customer.subscription.updated"
          ? { object: "subscription", id: sub }
          : {
              object: "invoice",
              id: invoice,
              customer,
              billing_reason: reason,
              parent: { subscription_details: { subscription: sub } },
              status: paid
                ? "paid"
                : event === "invoice.created"
                  ? "draft"
                  : "open",
              amount_paid: paid ? 800 : 0,
              currency: "usd",
              lines: {
                has_more: tag === "paged",
                data:
                  tag === "paged"
                    ? []
                    : [
                        {
                          period: { start, end },
                          parent: {
                            subscription_item_details: {
                              subscription: sub,
                              proration: false,
                            },
                          },
                        },
                      ],
              },
            },
    },
  });
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

async function grants(tag: string) {
  return db
    .select({
      amount: creditTransactions.amount,
      packId: creditTransactions.packId,
    })
    .from(creditTransactions)
    .where(
      and(
        sql`${creditTransactions.metadata}->>'sessionId' = ${ids(tag).key}`,
        sql`${creditTransactions.amount} > 0`,
      ),
    );
}

async function subscriptionStatus(tag: string) {
  const [row] = await db
    .select({ status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.providerSubscriptionId, ids(tag).sub));
  return row?.status;
}

describe("Stripe renewal credit settlement", () => {
  beforeAll(async () => {
    paymentEnv.STRIPE_WEBHOOK_SECRET = secret;
    vi.spyOn(CreditRepository, "expireCredits").mockResolvedValue(success(0));
    const stripe = new Stripe("sk_test_period_fixture", {
      httpClient: Stripe.createFetchHttpClient(
        Object.assign(
          async (url: string | Request | URL) => {
            if (String(url).includes("/lines")) {
              return Response.json({
                object: "list",
                has_more: false,
                data: [
                  {
                    id: "il_adjustment",
                    period: { start: start - 1, end: start },
                    parent: {
                      subscription_item_details: {
                        subscription: ids("paged").sub,
                        proration: true,
                      },
                    },
                  },
                  {
                    id: "il_renewal",
                    period: { start, end },
                    parent: {
                      subscription_item_details: {
                        subscription: ids("paged").sub,
                        proration: false,
                      },
                    },
                  },
                ],
              });
            }
            const sub = String(url).split("/").pop();
            return Response.json({
              id: sub,
              object: "subscription",
              status: "active",
              cancel_at_period_end: false,
              items: {
                data: [
                  {
                    current_period_start: start,
                    current_period_end: end,
                    price: { metadata: {} },
                  },
                ],
              },
            });
          },
          { preconnect: () => {} },
        ),
      ),
    });
    vi.spyOn(StripeProvider, "getStripe").mockReturnValue(stripe);
    for (const tag of [
      "paid",
      "late",
      "initial",
      "advance",
      "spent",
      "legacy-spent",
      "grace",
      "paged",
    ]) {
      const result = await createTestUser(`period-${tag}-${stamp}@example.com`);
      if (!result.success) {
        return expect.fail("failed to create buyer");
      }
      buyers.push(result.data);
      await db.insert(subscriptions).values({
        userId: result.data.user.id,
        planId: SubscriptionPlan.SUBSCRIPTION,
        status: SubscriptionStatus.ACTIVE,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.STRIPE,
        providerSubscriptionId: ids(tag).sub,
        currentPeriodStart: new Date((start - 30 * 86400) * 1000),
        currentPeriodEnd: new Date(start * 1000),
      });
    }
  }, 60000);

  afterAll(async () => {
    vi.restoreAllMocks();
    paymentEnv.STRIPE_WEBHOOK_SECRET = originalSecret;
    await db
      .delete(paymentWebhooks)
      .where(inArray(paymentWebhooks.providerEventId, [...events]));
    for (const buyer of buyers) {
      await deleteTestUser(buyer.user.id);
    }
  }, 60000);

  it("concurrent paid events and repeat delivery grant one period and one payment", async () => {
    expect(
      await Promise.all(
        ["invoice.paid", "invoice.payment_succeeded"].map((event) =>
          deliver("paid", event),
        ),
      ),
    ).toEqual([true, true]);
    expect(await deliver("paid", "invoice.paid")).toBe(true);
    expect((await grants("paid")).map((g) => g.amount)).toEqual([800]);
    expect(
      await db
        .select({ id: paymentTransactions.id })
        .from(paymentTransactions)
        .where(eq(paymentTransactions.providerInvoiceId, ids("paid").invoice)),
    ).toHaveLength(1);
  });

  it("uses the billed period across paginated invoice lines, ignoring a proration", async () => {
    expect(await deliver("paged", "invoice.paid")).toBe(true);
    expect((await grants("paged")).map((g) => g.amount)).toEqual([800]);
  });

  it("creation, rollover, reads, sync and failure grant nothing; late settlement grants once", async () => {
    for (const event of [
      "invoice.created",
      "customer.subscription.updated",
      "invoice.finalized",
      "invoice.payment_failed",
    ]) {
      expect(await deliver("late", event)).toBe(true);
      expect(await grants("late")).toHaveLength(0);
    }
    expect(await subscriptionStatus("late")).toBe(SubscriptionStatus.PAST_DUE);
    const buyer = buyers[1];
    await SubscriptionRepository.getSubscription(
      buyer.user.id,
      logger,
      defaultLocale,
    );
    await SubscriptionRepository.syncSubscriptionWithStripe(
      buyer.user.id,
      logger,
      defaultLocale,
    );
    expect(await grants("late")).toHaveLength(0);
    expect(await deliver("late", "invoice.payment_failed", "retry")).toBe(true);
    expect(await subscriptionStatus("late")).toBe(SubscriptionStatus.PAST_DUE);
    expect(await deliver("late", "invoice.payment_succeeded")).toBe(true);
    expect(await deliver("late", "invoice.paid")).toBe(true);
    expect(await deliver("late", "invoice.payment_failed", "stale")).toBe(true);
    expect(await subscriptionStatus("late")).toBe(SubscriptionStatus.ACTIVE);
    expect((await grants("late")).map((g) => g.amount)).toEqual([800]);
  });

  it("spending the last credit and replaying the invoice cannot mint a replacement pack", async () => {
    const buyer = buyers[4];
    expect(await deliver("spent", "invoice.paid")).toBe(true);
    const debited = await CreditRepository.deductCreditsForModelUsage(
      buyer.user,
      10000,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(debited.success).toBe(true);
    expect(
      await db
        .select({ id: creditPacks.id })
        .from(creditPacks)
        .where(sql`${creditPacks.metadata}->>'sessionId'=${ids("spent").key}`),
    ).toHaveLength(0);
    expect(await deliver("spent", "invoice.paid", "after-spend")).toBe(true);
    expect(await grants("spent")).toEqual([{ amount: 800, packId: null }]);
    const [wallet] = await db
      .select({ balance: creditWallets.balance })
      .from(creditWallets)
      .where(eq(creditWallets.userId, buyer.user.id));
    expect(wallet.balance).toBe(0);
  });

  it("late payment restores only the unused part of a legacy grant revoked at grace expiry", async () => {
    const buyer = buyers[6];
    const key = ids("grace").key;
    await CreditRepository.addUserCredits(
      buyer.user.id,
      800,
      "subscription",
      logger,
      creditsT,
      new Date(end * 1000),
      key,
    );
    await CreditRepository.deductCreditsForModelUsage(
      buyer.user,
      450,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
    );
    const [pack] = await db
      .select({ remaining: creditPacks.remaining })
      .from(creditPacks)
      .where(sql`${creditPacks.metadata}->>'sessionId'=${key}`);
    expect(pack.remaining).toBeGreaterThan(0);
    expect(pack.remaining).toBeLessThan(800);
    await CreditRepository.addUserCredits(
      buyer.user.id,
      1,
      "subscription",
      logger,
      creditsT,
      new Date(stamp - 1000),
      `expired_${stamp}`,
    );
    await db
      .update(subscriptions)
      .set({
        status: SubscriptionStatus.PAST_DUE,
        paymentFailedAt: new Date(stamp - 8 * 86400000),
        gracePeriodEndsAt: new Date(stamp - 86400000),
      })
      .where(eq(subscriptions.providerSubscriptionId, ids("grace").sub));
    await CreditRepository.deductCreditsForModelUsage(
      buyer.user,
      0.01,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(await subscriptionStatus("grace")).toBe(SubscriptionStatus.CANCELED);
    expect(await deliver("grace", "invoice.paid")).toBe(true);
    expect(await deliver("grace", "invoice.payment_succeeded")).toBe(true);
    const entries = await grants("grace");
    expect(entries.map((g) => g.amount).sort((a, b) => a - b)).toEqual([
      pack.remaining,
      800,
    ]);
  });

  it("leaves a first paid invoice to checkout and honors historical advance grants", async () => {
    expect(
      await deliver("initial", "invoice.paid", "", "subscription_create"),
    ).toBe(true);
    expect(await grants("initial")).toHaveLength(0);
    const buyer = buyers[3];
    const grant = await CreditRepository.addUserCredits(
      buyer.user.id,
      800,
      "subscription",
      logger,
      creditsT,
      new Date(end * 1000),
      ids("advance").key,
    );
    expect(grant.success).toBe(true);
    expect(await deliver("advance", "invoice.payment_failed")).toBe(true);
    expect(await deliver("advance", "invoice.paid")).toBe(true);
    expect((await grants("advance")).map((g) => g.amount)).toEqual([800]);
    const historical = buyers[5];
    const old = await CreditRepository.addUserCredits(
      historical.user.id,
      800,
      "subscription",
      logger,
      creditsT,
      new Date(end * 1000),
      ids("legacy-spent").key,
    );
    expect(old.success).toBe(true);
    await CreditRepository.deductCreditsForModelUsage(
      historical.user,
      10000,
      ChatModelId.GPT_5_MINI,
      logger,
      creditsT,
      defaultLocale,
    );
    expect(await grants("legacy-spent")).toEqual([
      { amount: 800, packId: null },
    ]);
    expect(await deliver("legacy-spent", "invoice.paid")).toBe(true);
    expect(await grants("legacy-spent")).toEqual([
      { amount: 800, packId: null },
    ]);
  });
});
