/**
 * E2E: Whop as the card option while Stripe is paused. The buy page reads
 * `checkoutProviders` from GET /subscription; with Whop in it the payment
 * dialog shows "Card" (Whop) enabled, hides the dead Stripe button and the
 * pause note, and the plan checkout POST goes to Whop.
 *
 * The subscription read is patched at the browser (Stripe paused, Whop on).
 * The checkout leg is real when the dev server runs with Whop SANDBOX keys
 * (WHOP_ENVIRONMENT=sandbox): a sandbox checkout configuration is created
 * and the browser is sent to sandbox.whop.com (stubbed here, nothing is
 * paid). Requires a server: `vibe dev`.
 */

import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { E2E_HYDRATION_TIMEOUT_MS } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Page } from "playwright";
import { describe, expect } from "vitest";

import { scopedTranslation as checkoutScopedTranslation } from "@/payment/checkout/i18n";
import { PaymentProvider } from "@/payment/enum";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import { getSubscriptionTiers, ProductIds } from "@/products/repository-client";

import subscriptionCreateEndpoints from "./create/definition";
import { BillingInterval, SubscriptionPlan } from "./enum";
import { scopedTranslation } from "./i18n";

const BUY_PAGE = "/subscription/buy";
const WHOP_CHECKOUT = /^https:\/\/(sandbox\.)?whop\.com\//;
const SUBSCRIPTION_READ = /\/api\/[^/]+\/subscription(\?.*)?$/;

const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tProducts } = productsScopedTranslation.scopedT(defaultLocale);
const { t: tCheckout } = checkoutScopedTranslation.scopedT(defaultLocale);
const tiers = getSubscriptionTiers(defaultLocale);

async function stripePausedWhopOn(page: Page): Promise<void> {
  await page.route(SUBSCRIPTION_READ, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({
          json: {
            success: true,
            data: {
              hasSubscription: false,
              checkoutProviders: [
                PaymentProvider.NOWPAYMENTS,
                PaymentProvider.WHOP,
              ],
            },
          },
        })
      : route.fallback(),
  );
}

describe("E2E: Whop card checkout", () => {
  const e2e = useE2E("subscription/whop-card");

  e2e.it(
    "offers Whop as Card while Stripe is paused and starts a Whop checkout for Starter monthly",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(fixtures.uniqueEmail("whop-card"));
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(() => deleteTestUser(account.user.id));
      await fixtures.loginAs(account.user);

      await stripePausedWhopOn(page);
      await page.route(WHOP_CHECKOUT, (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>whop stub</title>",
        }),
      );

      await fixtures.gotoReady(BUY_PAGE, () =>
        page
          .getByTestId("plan-picker")
          .getByRole("heading", { name: t("tiers.heading"), exact: true })
          .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 }),
      );
      const starter = tiers.find(
        (tier) => tier.productId === ProductIds.SUBSCRIPTION,
      );
      expect(starter).toBeTruthy();
      if (!starter) {
        return;
      }

      // Starter monthly: the plan crypto cannot sell, card must.
      const picker = page.getByTestId("plan-picker");
      await picker.getByTestId(`plan-tier-${starter.productId}`).click();
      await picker
        .getByRole("button", {
          name: t("tiers.cta.start", { plan: tProducts(starter.name) }),
          exact: true,
        })
        .click();

      const dialog = page.getByRole("dialog");
      const whop = dialog.getByTestId("whop-card-option");
      await whop.waitFor();
      expect(await whop.innerText()).toContain(
        tCheckout("availability.whopCardLabel"),
      );
      expect(await whop.isDisabled()).toBe(false);
      expect(await dialog.getByTestId("card-checkout-paused").count()).toBe(0);
      expect(
        await dialog
          .getByRole("button", { name: t("buy.provider.stripe") })
          .count(),
      ).toBe(0);

      const call = await fixtures.capture(
        subscriptionCreateEndpoints.POST,
        async () => {
          await whop.click();
        },
      );
      expect(call.requestBody).toMatchObject({
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.WHOP,
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
