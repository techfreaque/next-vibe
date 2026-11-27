/**
 * E2E: crypto checkout lists only coins that accept the amount. Starter
 * monthly ($8) used to be card-only; with live NOWPayments minimums it takes
 * the coins whose minimum fits, and the picked coin goes to checkout.
 *
 * GET /subscription is patched at the browser (card paused + fixed coin
 * minimums) so the coin list is deterministic. The checkout leg is real: the
 * dev server holds a NOWPayments SANDBOX key and checks the pick against the
 * sandbox minimums, nowpayments.io itself is stubbed. Requires `vibe dev`.
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

import {
  CryptoCoin,
  type CryptoCoinMinimum,
} from "@/payment/checkout/crypto-coins";
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

// Live NOWPayments minimums 2026-11-27 (USD, fee paid by the buyer).
const COINS: CryptoCoinMinimum[] = [
  { coin: CryptoCoin.BTC, minUsd: 6.94 },
  { coin: CryptoCoin.ETH, minUsd: 6.48 },
  { coin: CryptoCoin.USDT_TRC20, minUsd: 16.5 },
  { coin: CryptoCoin.LTC, minUsd: 6.29 },
  { coin: CryptoCoin.XMR, minUsd: 12.62 },
];

async function serveCryptoOnly(page: Page): Promise<void> {
  await page.route(SUBSCRIPTION_READ, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({
          json: {
            success: true,
            data: {
              hasSubscription: false,
              checkoutProviders: [PaymentProvider.NOWPAYMENTS],
              cryptoCoins: COINS,
            },
          },
        })
      : route.fallback(),
  );
}

describe("E2E: crypto coin checkout", () => {
  const e2e = useE2E("subscription/crypto-coins");

  e2e.it(
    "offers Starter monthly via crypto with only the coins above their minimum",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(
        fixtures.uniqueEmail("crypto-coins"),
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
      const coins = dialog.getByTestId("crypto-coin-option");
      await coins.first().waitFor();
      expect(await coins.allInnerTexts()).toEqual([
        tCheckout(CryptoCoin.BTC),
        tCheckout(CryptoCoin.ETH),
        tCheckout(CryptoCoin.LTC),
      ]);
      expect(await dialog.getByTestId("crypto-below-minimum").count()).toBe(0);

      const call = await fixtures.capture(
        subscriptionCreateEndpoints.POST,
        async () => {
          await coins
            .filter({ hasText: tCheckout(CryptoCoin.BTC) })
            .click();
        },
      );
      expect(call.requestBody).toMatchObject({
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.MONTHLY,
        provider: PaymentProvider.NOWPAYMENTS,
        payCurrency: CryptoCoin.BTC,
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
