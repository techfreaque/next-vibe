/**
 * E2E: crypto checkout goes straight to the NOWPayments invoice page, where
 * the buyer picks any coin. No coin step in our dialog. Starter monthly ($8)
 * used to be card-only; it is above the lowest coin minimum, so it takes
 * crypto.
 *
 * GET /subscription is patched at the browser (card paused + a fixed crypto
 * floor) so the dialog is deterministic. The checkout leg is real: the dev
 * server holds a NOWPayments SANDBOX key and creates the invoice there without
 * pay_currency; nowpayments.io itself is stubbed. Requires `vibe dev`.
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

import { cryptoMinimumUsd } from "@/payment/checkout/crypto-coins";
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
const tiers = getSubscriptionTiers(defaultLocale);

// Lowest live NOWPayments minimum 2026-11-27 (LTC, USD, fee paid by buyer).
const CRYPTO_MIN_USD = cryptoMinimumUsd(6.29);

async function serveCryptoOnly(page: Page): Promise<void> {
  await page.route(SUBSCRIPTION_READ, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({
          json: {
            success: true,
            data: {
              hasSubscription: false,
              checkoutProviders: [PaymentProvider.NOWPAYMENTS],
              cryptoMinUsd: CRYPTO_MIN_USD,
            },
          },
        })
      : route.fallback(),
  );
}

describe("E2E: crypto checkout", () => {
  const e2e = useE2E("subscription/crypto-checkout");

  e2e.it(
    "sends Starter monthly straight to the NOWPayments invoice page",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(
        fixtures.uniqueEmail("crypto-checkout"),
      );
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(() => deleteTestUser(account.user.id));
      await fixtures.loginAs(account.user);

      await serveCryptoOnly(page);
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

      const picker = page.getByTestId("plan-picker");
      await picker.getByTestId(`plan-tier-${starter.productId}`).click();
      await picker
        .getByRole("button", { name: t("billing.monthly"), exact: true })
        .click();
      await picker
        .getByRole("button", {
          name: t("tiers.cta.start", { plan: tProducts(starter.name) }),
          exact: true,
        })
        .click();

      const dialog = page.getByRole("dialog");
      const option = dialog.getByTestId("crypto-checkout-option");
      await option.waitFor();
      // One button to the hosted page: no coin list, no minimum notice.
      expect(await dialog.getByTestId("crypto-coin-option").count()).toBe(0);
      expect(await dialog.getByTestId("crypto-below-minimum").count()).toBe(0);
      const crypto = option.getByRole("button", {
        name: t("buy.provider.nowpayments"),
      });
      expect(await crypto.isDisabled()).toBe(false);

      const call = await fixtures.capture(
        subscriptionCreateEndpoints.POST,
        async () => {
          await crypto.click();
        },
      );
      expect(call.requestBody).toMatchObject({
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.NOWPAYMENTS,
      });
      expect(call.requestBody).not.toHaveProperty("payCurrency");
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {
        return;
      }
      expect(call.response.data.checkoutUrl).toMatch(NOWPAYMENTS_CHECKOUT);
      await page.waitForURL(NOWPAYMENTS_CHECKOUT);
    },
  );
});
