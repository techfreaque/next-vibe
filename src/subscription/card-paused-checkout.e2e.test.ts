/**
 * E2E: card checkout paused (Stripe account on hold, 2026-11-27). The buy
 * page reads `checkoutProviders` from GET /subscription; without Stripe in it
 * the payment dialog shows the pause note, disables card and sends crypto.
 *
 * The subscription read is patched at the browser so the test does not need
 * a paused server. The crypto leg is real: the dev server holds a NOWPayments
 * SANDBOX key, so the invoice is created in sandbox (nothing can be paid) and
 * nowpayments.io itself is stubbed. Requires a server: `vibe dev`.
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
const NOWPAYMENTS_CHECKOUT = /^https:\/\/(sandbox\.)?nowpayments\.io\//;
const SUBSCRIPTION_READ = /\/api\/[^/]+\/subscription(\?.*)?$/;

const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tProducts } = productsScopedTranslation.scopedT(defaultLocale);
const { t: tCheckout } = checkoutScopedTranslation.scopedT(defaultLocale);
const tiers = getSubscriptionTiers(defaultLocale);

/**
 * Serve GET /subscription as a server with Stripe paused would, for a user
 * without a plan (the test user is fresh). Synthetic on purpose: proxying the
 * real response through route.fetch() breaks on Bun (relative Set-Cookie URL).
 */
async function pauseCardCheckout(page: Page): Promise<void> {
  await page.route(SUBSCRIPTION_READ, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({
          json: {
            success: true,
            data: {
              hasSubscription: false,
              checkoutProviders: [PaymentProvider.NOWPAYMENTS],
            },
          },
        })
      : route.fallback(),
  );
}

describe("E2E: card checkout paused", () => {
  const e2e = useE2E("subscription/card-paused");

  e2e.it(
    "offers crypto with a pause note and starts a sandbox crypto checkout",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(fixtures.uniqueEmail("card-paused"));
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(() => deleteTestUser(account.user.id));
      await fixtures.loginAs(account.user);

      await pauseCardCheckout(page);
      await page.route(NOWPAYMENTS_CHECKOUT, (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>nowpayments stub</title>",
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

      // Starter takes crypto yearly; pick yearly so crypto is selectable.
      const picker = page.getByTestId("plan-picker");
      await picker.getByTestId(`plan-tier-${starter.productId}`).click();
      await picker
        .getByRole("button", { name: t("billing.yearly"), exact: true })
        .click();
      await picker
        .getByRole("button", {
          name: t("tiers.cta.start", { plan: tProducts(starter.name) }),
          exact: true,
        })
        .click();

      const dialog = page.getByRole("dialog");
      const note = dialog.getByTestId("card-checkout-paused");
      await note.waitFor();
      expect(await note.innerText()).toContain(
        tCheckout("availability.cardPaused"),
      );
      const card = dialog.getByRole("button", {
        name: t("buy.provider.stripe"),
      });
      expect(await card.isDisabled()).toBe(true);

      const call = await fixtures.capture(
        subscriptionCreateEndpoints.POST,
        async () => {
          await dialog
            .getByRole("button", { name: t("buy.provider.nowpayments") })
            .click();
        },
      );
      expect(call.requestBody).toMatchObject({
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
        provider: PaymentProvider.NOWPAYMENTS,
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {
        return;
      }
      expect(call.response.data.checkoutUrl).toMatch(NOWPAYMENTS_CHECKOUT);
      await page.waitForURL(NOWPAYMENTS_CHECKOUT);
    },
  );
});
