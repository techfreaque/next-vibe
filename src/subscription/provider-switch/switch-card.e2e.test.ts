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
const NOWPAYMENTS_CHECKOUT = /^https:\/\/(sandbox\.)?nowpayments\.io\//;
const WHOP_CHECKOUT = /^https:\/\/(sandbox\.)?whop\.com\//;
const SHOT_DIR = process.env.SWITCH_CARD_SHOT_DIR;

const { t } = scopedTranslation.scopedT(defaultLocale);

describe("E2E: provider switch card", () => {
  const e2e = useE2E("subscription/provider-switch-card");

  const defineCase = (
    name: string,
    choice: "card" | "crypto",
  ): void => {
    e2e.it(name, async (fixtures) => {
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
      await page.route(NOWPAYMENTS_CHECKOUT, (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<!doctype html><title>nowpayments stub</title>",
        }),
      );
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

      // The shield sits centered on the first line of the footer text.
      const footer = card.getByText(t("widget.noDoubleCharge"));
      const offset = await footer.evaluate((text) => {
        const icon = text.previousElementSibling;
        const lineHeight = Number.parseFloat(getComputedStyle(text).lineHeight);
        const textTop = text.getBoundingClientRect().top;
        const iconBox = icon?.getBoundingClientRect();
        return iconBox
          ? iconBox.top + iconBox.height / 2 - (textTop + lineHeight / 2)
          : Number.NaN;
      });
      expect(Math.abs(offset)).toBeLessThanOrEqual(1);

      // The description wraps inside the card at desktop and phone widths.
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        const fits = await card.evaluate((el) =>
          [...el.querySelectorAll("p")].every(
            (p) =>
              p.getBoundingClientRect().right <=
              el.getBoundingClientRect().right + 0.5,
          ),
        );
        expect(fits, `text overflows the card at ${width}px`).toBe(true);
      }

      if (SHOT_DIR) {
        await page.screenshot({
          path: `${SHOT_DIR}/overview-desktop.png`,
          fullPage: true,
        });
        for (const scheme of ["light", "dark"] as const) {
          await page.emulateMedia({ colorScheme: scheme });
          /* oxlint-disable restricted/no-browser-globals -- browser screenshot setup */
          await page.evaluate((value) => {
            const key = "theme_v2";
            const oldValue = localStorage.getItem(key);
            localStorage.setItem(key, value);
            window.dispatchEvent(
              new StorageEvent("storage", { key, oldValue, newValue: value }),
            );
          }, scheme);
          await page.waitForFunction(
            (dark) => document.documentElement.classList.contains("dark") === dark,
            scheme === "dark",
          );
          /* oxlint-enable restricted/no-browser-globals */
          for (const { device, width, height } of [
            { device: "desktop", width: 1440, height: 900 },
            { device: "phone", width: 390, height: 844 },
          ]) {
            await page.setViewportSize({ width, height });
            await card.scrollIntoViewIfNeeded();
            await card.screenshot({
              path: `${SHOT_DIR}/card-${device}-${scheme}.png`,
            });
          }
        }
        await page.screenshot({
          path: `${SHOT_DIR}/overview-phone.png`,
          fullPage: true,
        });
      }

      // "Move my plan" asks how to pay: the same Card / Crypto choice as the
      // regular plan purchase (no Stripe option).
      await move.click();
      await page.getByTestId("whop-card-option").waitFor();
      expect(
        await page.getByTestId("crypto-checkout-option").isVisible(),
      ).toBe(true);
      const call = await fixtures.capture(definitions.POST, async () => {
        await (choice === "card"
          ? page.getByTestId("whop-card-option")
          : page.getByTestId("crypto-checkout-option").getByRole("button")
        ).click();
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {
        return;
      }
      const expected = choice === "card" ? WHOP_CHECKOUT : NOWPAYMENTS_CHECKOUT;
      expect(call.response.data.checkoutUrl).toMatch(expected);
      await page.waitForURL(expected);
    });
  };

  defineCase(
    "Move my plan offers Card and Crypto; Card opens a Whop checkout",
    "card",
  );
  defineCase(
    "Move my plan: Crypto opens a NOWPayments invoice for the same plan",
    "crypto",
  );
});
