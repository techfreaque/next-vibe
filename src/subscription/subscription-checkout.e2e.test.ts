/**
 * E2E: /subscription/buy → checkout. A guest sees the plans and is sent to
 * sign in; a signed-in customer picks yearly, chooses card, and the page
 * creates a Stripe checkout session and redirects to it. The payment step
 * itself is never reached: checkout.stripe.com is stubbed at the browser, and
 * the dev server only holds a Stripe test-mode key (sessions are test-mode,
 * nothing can be charged). Requires a server: `vibe dev`.
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

import { scopedTranslation as purchaseScopedTranslation } from "@/credits/purchase/i18n";
import checkoutEndpoints from "@/payment/checkout/definition";
import { PaymentProvider } from "@/payment/enum";
import { ProductIds, productsRepository } from "@/products/platform-products";

import subscriptionCreateEndpoints from "./create/definition";
import { BillingInterval, SubscriptionPlan } from "./enum";
import { scopedTranslation } from "./i18n";

const BUY_PAGE = "/subscription/buy";
/** Stripe's hosted checkout. Stubbed: the test must never load (or pay on) it. */
const STRIPE_CHECKOUT = /^https:\/\/checkout\.stripe\.com\//;
const STRIPE_STUB_HTML = "<!doctype html><title>stripe stub</title>";

const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tPurchase } = purchaseScopedTranslation.scopedT(defaultLocale);

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat(defaultLocale, {
    style: "currency",
    currency,
  }).format(price);
}

/** Both plan cards rendered and hydrated. */
async function plansVisible(page: Page): Promise<void> {
  await page
    .getByText(t("buy.subscription.title"), { exact: true })
    .first()
    .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
  await page
    .getByText(tPurchase("post.pack.title"), { exact: true })
    .first()
    .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
}

describe("E2E: subscription checkout", () => {
  const e2e = useE2E("subscription/checkout");

  e2e.it("shows a guest the plans and asks them to sign in", async (fixtures) => {
    const { page } = fixtures;
    await fixtures.gotoReady(BUY_PAGE, () => plansVisible(page));

    const subscription = productsRepository.getProduct(
      ProductIds.SUBSCRIPTION,
      defaultLocale,
    );
    await page
      .getByText(formatPrice(subscription.price, subscription.currency), {
        exact: true,
      })
      .first()
      .waitFor();
    await page
      .getByText(
        t("buy.subscription.features.credits", {
          count: subscription.credits,
        }),
      )
      .first()
      .waitFor();

    // No checkout for guests: sign-in / sign-up instead of the subscribe button
    expect(
      await page
        .getByRole("button", { name: t("buy.subscription.button") })
        .count(),
    ).toBe(0);
    const signIn = page.getByRole("link", {
      name: t("buy.login"),
      exact: true,
    });
    await signIn.waitFor();
    expect(await signIn.getAttribute("href")).toBe(
      `/${defaultLocale}/user/login`,
    );
    expect(
      await page
        .getByRole("link", { name: t("buy.signup"), exact: true })
        .getAttribute("href"),
    ).toBe(`/${defaultLocale}/user/signup`);
  });

  e2e.it(
    "starts a yearly Stripe checkout and redirects to it",
    async (fixtures) => {
      const { page } = fixtures;
      const created = await createTestUser(fixtures.uniqueEmail("checkout"));
      expect(created.success, JSON.stringify(created)).toBe(true);
      if (!created.success) {
        return;
      }
      const account = created.data;
      fixtures.cleanup(() => deleteTestUser(account.user.id));
      await fixtures.loginAs(account.user);

      await page.route(STRIPE_CHECKOUT, (route) =>
        route.fulfill({
          status: 200,
          contentType: "text/html",
          body: STRIPE_STUB_HTML,
        }),
      );

      await fixtures.gotoReady(BUY_PAGE, () => plansVisible(page));
      const subscribe = page.getByRole("button", {
        name: t("buy.subscription.button"),
        exact: true,
      });
      await subscribe.waitFor();

      const yearly = productsRepository.getProduct(
        ProductIds.SUBSCRIPTION,
        defaultLocale,
        "year",
      );
      await page
        .getByRole("button", { name: t("billing.yearly"), exact: true })
        .click();
      await page
        .getByText(formatPrice(yearly.price, yearly.currency), { exact: true })
        .first()
        .waitFor();
      await page.getByText(t("buy.subscription.perYear")).first().waitFor();

      await subscribe.click();
      const dialog = page.getByRole("dialog");
      await dialog
        .getByText(t("checkout.form.fields.provider.label"))
        .waitFor();

      const call = await fixtures.capture(
        subscriptionCreateEndpoints.POST,
        async () => {
          await dialog
            .getByRole("button", { name: t("buy.provider.stripe") })
            .click();
        },
      );

      expect(call.requestBody).toMatchObject({
        plan: SubscriptionPlan.SUBSCRIPTION,
        billingInterval: BillingInterval.YEARLY,
        provider: PaymentProvider.STRIPE,
      });
      expect(call.response.success, JSON.stringify(call.response)).toBe(true);
      if (!call.response.success) {
        return;
      }
      const { checkoutUrl, sessionId } = call.response.data;
      expect(checkoutUrl).toMatch(STRIPE_CHECKOUT);
      // Test-mode key only: a live session here would mean a real charge path
      expect(sessionId).toMatch(/^cs_test_/);

      await page.waitForURL(checkoutUrl);
    },
  );

  e2e.it("checkout API creates a monthly test-mode session", async (fixtures) => {
    const created = await createTestUser(fixtures.uniqueEmail("api-checkout"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const account = created.data;
    fixtures.cleanup(() => deleteTestUser(account.user.id));
    await fixtures.loginAs(account.user);

    // No page of its own: driven from its /tools/<alias> surface
    const form = await fixtures.open(checkoutEndpoints.POST);
    await form.fill({
      planId: SubscriptionPlan.SUBSCRIPTION,
      billingInterval: BillingInterval.MONTHLY,
    });

    const result = await form.submit();
    expect(result.sent).toBe(true);
    if (!result.sent) {
      return;
    }
    expect(result.response.success, JSON.stringify(result.response)).toBe(
      true,
    );
    if (!result.response.success) {
      return;
    }
    expect(result.response.data.checkoutUrl).toMatch(STRIPE_CHECKOUT);
    expect(result.response.data.sessionId).toMatch(/^cs_test_/);
  });

  e2e.it("checkout API refuses a request without a plan", async (fixtures) => {
    const created = await createTestUser(fixtures.uniqueEmail("no-plan"));
    expect(created.success, JSON.stringify(created)).toBe(true);
    if (!created.success) {
      return;
    }
    const account = created.data;
    fixtures.cleanup(() => deleteTestUser(account.user.id));
    await fixtures.loginAs(account.user);

    const form = await fixtures.open(checkoutEndpoints.POST);
    await form.fill({ billingInterval: BillingInterval.MONTHLY });

    const result = await form.submit();
    expect(result.sent).toBe(false);
    if (result.sent) {
      return;
    }
    expect(Object.keys(result.fieldErrors)).toContain("planId");
  });
});
