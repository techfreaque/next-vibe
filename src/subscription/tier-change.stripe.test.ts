/**
 * Tier changes against Stripe TEST mode (skipped without an sk_test key).
 * A real Stripe subscription on the Starter price (test card pm_card_visa),
 * then: upgrade to Plus (prorated invoice paid now, prorated extra credits,
 * row + Stripe price switch), downgrade to Starter (no charge, new price from
 * the next renewal, row keeps Plus until then), taking the downgrade back,
 * same plan (no-op).
 */

import "server-only";

import { eq, sql } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import {
  createTestUser,
  deleteTestUser,
  type TestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { creditPacks, creditWallets } from "@/credits/db";
import { scopedTranslation as checkoutScopedTranslation } from "@/payment/checkout/i18n";
import { SubscriptionCheckoutRepository } from "@/payment/checkout/repository";
import { PaymentProvider } from "@/payment/enum";
import { paymentEnv } from "@/payment/env";
import { stripePriceManager } from "@/payment/providers/stripe/prices";
import { StripeProvider } from "@/payment/providers/stripe/repository";
import { ProductIds } from "@/products/repository-client";

import { subscriptions } from "./db";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "./enum";
import { SubscriptionRepository } from "./repository";

const logger = createEndpointLogger(false, defaultLocale);
const isTestKey = (paymentEnv.STRIPE_SECRET_KEY ?? "").startsWith("sk_test");
const stamp = Date.now();

let user: TestUser;
let stripeSubscriptionId = "";
let customerId = "";

async function upgradeCredits(userId: string): Promise<number> {
  const rows = await db
    .select({ amount: creditPacks.originalAmount })
    .from(creditPacks)
    .innerJoin(creditWallets, eq(creditPacks.walletId, creditWallets.id))
    .where(
      sql`${creditWallets.userId} = ${userId} AND ${creditPacks.metadata}->>'sessionId' LIKE 'tier-upgrade:%'`,
    );
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

describe.skipIf(!isTestKey)("subscription tier change (Stripe test mode)", () => {
  beforeAll(async () => {
    const created = await createTestUser(`tier-change-${stamp}@example.com`);
    expect(created.success).toBe(true);
    if (!created.success) {
      return;
    }
    user = created.data;
    const stripe = StripeProvider.getStripe();
    if (!stripe) {
      return;
    }
    const customer = await stripe.customers.create({
      email: user.email,
      payment_method: "pm_card_visa",
      invoice_settings: { default_payment_method: "pm_card_visa" },
      metadata: { userId: user.user.id },
    });
    customerId = customer.id;
    const price = await stripePriceManager.ensurePrice(
      ProductIds.SUBSCRIPTION,
      "en-US",
      "month",
      logger,
    );
    expect(price.success).toBe(true);
    if (!price.success) {
      return;
    }
    const sub = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.data.priceId }],
      metadata: { userId: user.user.id },
    });
    stripeSubscriptionId = sub.id;
    const item = sub.items.data[0];
    await db.insert(subscriptions).values({
      userId: user.user.id,
      planId: SubscriptionPlan.SUBSCRIPTION,
      productId: ProductIds.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
      status: SubscriptionStatus.ACTIVE,
      provider: PaymentProvider.STRIPE,
      providerSubscriptionId: sub.id,
      currentPeriodStart: new Date(item.current_period_start * 1000),
      currentPeriodEnd: new Date(item.current_period_end * 1000),
    });
  }, 120_000);

  afterAll(async () => {
    const stripe = StripeProvider.getStripe();
    if (stripe && stripeSubscriptionId) {
      await stripe.subscriptions.cancel(stripeSubscriptionId);
    }
    if (stripe && customerId) {
      await stripe.customers.del(customerId);
    }
    await db.delete(subscriptions).where(eq(subscriptions.userId, user.user.id));
    await deleteTestUser(user.user.id);
  }, 120_000);

  it("refuses a second checkout while the plan is active", async () => {
    const res = await SubscriptionCheckoutRepository.createCheckoutSession(
      {
        planId: SubscriptionPlan.PLUS,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.STRIPE,
      },
      user.user,
      defaultLocale,
      logger,
      checkoutScopedTranslation.scopedT(defaultLocale).t,
    );
    expect(res.success).toBe(false);
  });

  it("same plan is a no-op", async () => {
    const res = await SubscriptionRepository.updateSubscription(
      { plan: SubscriptionPlan.SUBSCRIPTION, billingInterval: BillingInterval.MONTHLY },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    expect(await upgradeCredits(user.user.id)).toBe(0);
  });

  it("upgrade charges the prorated difference and adds prorated credits", async () => {
    const res = await SubscriptionRepository.updateSubscription(
      { plan: SubscriptionPlan.PLUS, billingInterval: BillingInterval.MONTHLY },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    if (res.success) {
      expect(res.data.plan).toBe(SubscriptionPlan.PLUS);
    }
    // Just created: almost the whole period is left, so ~ (2050 - 800)
    const extra = await upgradeCredits(user.user.id);
    expect(extra).toBeGreaterThan(1200);
    expect(extra).toBeLessThanOrEqual(1250);

    const [row] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.user.id));
    expect(row?.productId).toBe(ProductIds.SUBSCRIPTION_PLUS);

    const stripe = StripeProvider.getStripe();
    const sub = await stripe?.subscriptions.retrieve(stripeSubscriptionId, {
      expand: ["latest_invoice"],
    });
    expect(sub?.items.data[0]?.price.metadata.internalProductId).toBe(
      ProductIds.SUBSCRIPTION_PLUS,
    );
    expect(sub?.pending_update).toBeNull();
    const invoice = sub?.latest_invoice;
    expect(typeof invoice === "object" && invoice?.status).toBe("paid");
    // $20 - $8 for (almost) the full month
    expect(typeof invoice === "object" && invoice ? invoice.amount_paid : 0)
      .toBeGreaterThan(1100);
  }, 60_000);

  it("repeating the upgrade grants nothing more", async () => {
    const before = await upgradeCredits(user.user.id);
    const res = await SubscriptionRepository.updateSubscription(
      { plan: SubscriptionPlan.PLUS, billingInterval: BillingInterval.MONTHLY },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(res.success).toBe(true);
    expect(await upgradeCredits(user.user.id)).toBe(before);
  }, 60_000);

  it("downgrade switches the price for the next renewal without a charge", async () => {
    const stripe = StripeProvider.getStripe();
    const invoicesBefore = await stripe?.invoices.list({
      subscription: stripeSubscriptionId,
    });
    const res = await SubscriptionRepository.updateSubscription(
      {
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
      },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    const sub = await stripe?.subscriptions.retrieve(stripeSubscriptionId);
    expect(sub?.items.data[0]?.price.metadata.internalProductId).toBe(
      ProductIds.SUBSCRIPTION,
    );
    const invoicesAfter = await stripe?.invoices.list({
      subscription: stripeSubscriptionId,
    });
    expect(invoicesAfter?.data.length).toBe(invoicesBefore?.data.length);
    // The row keeps the plan paid for this period until renewal
    const [row] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.user.id));
    expect(row?.productId).toBe(ProductIds.SUBSCRIPTION_PLUS);
    expect(row?.planId).toBe(SubscriptionPlan.PLUS);
  }, 60_000);

  it("picking the current plan again takes the pending downgrade back", async () => {
    const stripe = StripeProvider.getStripe();
    const invoicesBefore = await stripe?.invoices.list({
      subscription: stripeSubscriptionId,
    });
    const res = await SubscriptionRepository.updateSubscription(
      { plan: SubscriptionPlan.PLUS, billingInterval: BillingInterval.MONTHLY },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(res.success, JSON.stringify(res)).toBe(true);
    const sub = await stripe?.subscriptions.retrieve(stripeSubscriptionId);
    expect(sub?.items.data[0]?.price.metadata.internalProductId).toBe(
      ProductIds.SUBSCRIPTION_PLUS,
    );
    const invoicesAfter = await stripe?.invoices.list({
      subscription: stripeSubscriptionId,
    });
    expect(invoicesAfter?.data.length).toBe(invoicesBefore?.data.length);
    // And now it really is unchanged
    const again = await SubscriptionRepository.updateSubscription(
      { plan: SubscriptionPlan.PLUS, billingInterval: BillingInterval.MONTHLY },
      user.user.id,
      defaultLocale,
      logger,
    );
    expect(again.success).toBe(true);
  }, 60_000);
});
