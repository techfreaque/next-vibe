/**
 * E2E: /subscription/buy → checkout. A guest sees the plans and is sent to
 * sign in; a signed-in customer picks Starter yearly, chooses card, and the page
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

import checkoutEndpoints from "@/payment/checkout/definition";
import { PaymentProvider } from "@/payment/enum";
import { scopedTranslation as productsScopedTranslation } from "@/products/i18n";
import {
  getPricingParams,
  getSubscriptionTiers,
  ProductIds,
  SUBSCRIPTION_TIER_PRODUCT_IDS,
} from "@/products/repository-client";

import subscriptionCreateEndpoints from "./create/definition";
import { BillingInterval, SubscriptionPlan } from "./enum";
import { scopedTranslation } from "./i18n";

const BUY_PAGE = "/subscription/buy";
/** Stripe's hosted checkout. Stubbed: the test must never load (or pay on) it. */
const STRIPE_CHECKOUT = /^https:\/\/checkout\.stripe\.com\//;
const STRIPE_STUB_HTML = "<!doctype html><title>stripe stub</title>";

const { t } = scopedTranslation.scopedT(defaultLocale);
const { t: tProducts } = productsScopedTranslation.scopedT(defaultLocale);
const tiers = getSubscriptionTiers(defaultLocale);

async function plansVisible(page: Page): Promise<void> {
  await page
    .getByTestId("plan-picker")
    .getByRole("heading", { name: t("tiers.heading"), exact: true })
    .waitFor({ timeout: E2E_HYDRATION_TIMEOUT_MS / 2 });
}

describe("E2E: subscription checkout", () => {
  const e2e = useE2E("subscription/checkout");

  e2e.it("shows a guest the plans and asks them to sign in", async (fixtures) => {
    const { page } = fixtures;
    await fixtures.gotoReady(BUY_PAGE, () => plansVisible(page));

    const picker = page.getByTestId("plan-picker");
    expect(tiers.map((tier) => tier.productId)).toEqual([
      ...SUBSCRIPTION_TIER_PRODUCT_IDS,
    ]);
    expect(await picker.getByTestId(/^plan-tier-/).count()).toBe(4);
    for (const tier of tiers) {
      const card = picker.getByTestId(`plan-tier-${tier.productId}`);
      await card.getByText(tProducts(tier.name), { exact: true }).waitFor();
      await card.getByText(tier.priceLabel, { exact: true }).waitFor();
      await card.getByText(tier.creditsLabel, { exact: true }).waitFor();
      await card.getByText(t("tiers.creditsPerMonth"), { exact: true }).waitFor();
    }

    const { packPrice, packCredits } = getPricingParams(defaultLocale);
    await page
      .getByText(
        t("tiers.packsLocked.title", {
          price: packPrice,
          credits: packCredits,
        }),
        { exact: true },
      )
      .waitFor();

    expect(await picker.getByTestId("plan-start").count()).toBe(0);
    const signIn = picker.getByRole("link", {
      name: t("buy.login"),
      exact: true,
    });
    await signIn.waitFor();
    expect(await signIn.getAttribute("href")).toBe(
      `/${defaultLocale}/user/login`,
    );
    expect(
      await picker
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
      const starter = tiers.find(
        (tier) => tier.productId === ProductIds.SUBSCRIPTION,
      );
      expect(starter?.yearlyPriceLabel).toBeTruthy();
      if (!starter?.yearlyPriceLabel) {
        return;
      }

      const picker = page.getByTestId("plan-picker");
      const starterCard = picker.getByTestId(`plan-tier-${starter.productId}`);
      await starterCard.click();
      const subscribe = picker.getByRole("button", {
        name: t("tiers.cta.start", { plan: tProducts(starter.name) }),
        exact: true,
      });
      await subscribe.waitFor();
      expect(await starterCard.getAttribute("aria-pressed")).toBe("true");

      const yearly = picker.getByRole("button", {
        name: t("billing.yearly"),
        exact: true,
      });
      await yearly.click();
      expect(await yearly.getAttribute("aria-pressed")).toBe("true");
      await picker
        .getByText(starter.yearlyPriceLabel, { exact: true })
        .waitFor();
      await picker.getByText(t("tiers.perYear"), { exact: true }).waitFor();

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
