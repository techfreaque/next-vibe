/**
 * E2E: a Stripe card subscriber sees the "move your plan" card on the real
 * subscription page (/subscription/overview, rendered by the credits tab
 * header), the Stripe portal button is demoted to "cancel old card plan",
 * and "Move my plan" opens a Whop checkout for the same plan.
 *
 * Requires a server started with the switch live and Whop SANDBOX keys:
 * `SUBSCRIPTION_SWITCH_PROVIDER=WHOP SUBSCRIPTION_SWITCH_ENABLED=true
 * STRIPE_CHECKOUT_PAUSED=true vibe dev` (WHOP_ENVIRONMENT=sandbox). The
 * Whop page itself is stubbed; nothing is paid. The old plan is a real
 * Stripe TEST subscription (the subscription read syncs with Stripe and
 * would cancel a made-up id); it is cancelled again in cleanup.
 */

import { eq } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";

import { PaymentProvider } from "../../payment/enum";
import { StripeProvider } from "../../payment/providers/stripe/repository";
import { subscriptions } from "../db";
import { BillingInterval, SubscriptionPlan, SubscriptionStatus } from "../enum";
import { PROVIDER_SWITCH_ANCHOR } from "./anchor";
import definitions from "./definition";
import { scopedTranslation } from "./i18n";

const OVERVIEW_PAGE = "/subscription/overview";
const WHOP_CHECKOUT = /^https:\/\/(sandbox\.)?whop\.com\//;
const SHOT_DIR = process.env.SWITCH_CARD_SHOT_DIR;

const { t } = scopedTranslation.scopedT(defaultLocale);

describe("E2E: provider switch card", () => {
  const e2e = useE2E("subscription/provider-switch-card");

  e2e.it(
    "shows Move my plan for a Stripe Starter monthly plan and opens a Whop checkout",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(
        fixtures.uniqueEmail("switch-card"),
      );
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(async () => {
        await db
          .delete(subscriptions)
          .where(eq(subscriptions.userId, account.user.id));
        await deleteTestUser(account.user.id);
      });
      const stripe = StripeProvider.getStripe();
      expect(stripe).toBeTruthy();
      if (!stripe) {
        return;
      }
      const customer = await stripe.customers.create({
        email: account.email,
        payment_method: "pm_card_visa",
        invoice_settings: { default_payment_method: "pm_card_visa" },
      });
      const product = await stripe.products.create({
        name: "E2E switch card Starter",
      });
      const stripeSub = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: "usd",
              product: product.id,
              unit_amount: 800,
              recurring: { interval: "month" },
            },
          },
        ],
      });
      fixtures.cleanup(async () => {
        await stripe.subscriptions.cancel(stripeSub.id);
        await stripe.customers.del(customer.id);
      });
      const now = Date.now();
      await db.insert(subscriptions).values({
        userId: account.user.id,
        status: SubscriptionStatus.ACTIVE,
        planId: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.STRIPE,
        providerSubscriptionId: stripeSub.id,
        currentPeriodStart: new Date(now - 2 * 86_400_000),
        currentPeriodEnd: new Date(now + 28 * 86_400_000),
      });
      await fixtures.loginAs(account.user);
      await page.route(WHOP_CHECKOUT, (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>whop stub</title>",
        }),
      );

      const card = page.locator(`#${PROVIDER_SWITCH_ANCHOR}`);
      await fixtures.gotoReady(OVERVIEW_PAGE, () =>
        card.waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 }),
      );
      const move = card.getByRole("button", {
        name: t("widget.cta"),
        exact: true,
      });
      expect(await move.isVisible()).toBe(true);
      // The Stripe portal is no longer the plan path: it reads "cancel".
      const cancelOld = page.getByRole("button", {
        name: t("manage.cancelOld"),
      });
      await cancelOld.waitFor();
      expect(await page.getByText(t("manage.moveFirst")).isVisible()).toBe(
        true,
      );

      if (SHOT_DIR) {
        await page.screenshot({
          path: `${SHOT_DIR}/overview-desktop.png`,
          fullPage: true,
        });
        await page.setViewportSize({ width: 390, height: 844 });
        await card.scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${SHOT_DIR}/overview-phone.png`,
          fullPage: true,
        });
      }

      const call = await fixtures.capture(definitions.POST, async () => {
        await move.click();
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {
        return;
      }
      expect(call.response.data.checkoutUrl).toMatch(WHOP_CHECKOUT);
      await page.waitForURL(WHOP_CHECKOUT);
    },
  );
});
