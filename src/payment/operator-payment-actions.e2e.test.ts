import type { CreateApiEndpointAny } from "next-vibe/core/definition/endpoint-base";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import {
  type E2EFixtures,
  useE2E,
} from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import type { Request } from "playwright";
import { describe, expect } from "vitest";

import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import expire from "@/credits/expire/definition";
import purchase from "@/credits/purchase/definition";
import { scopedTranslation as purchaseTranslation } from "@/credits/purchase/i18n";
import confirm from "@/referral/earnings/confirm/definition";
import subscription from "@/subscription/definition";
import { scopedTranslation as usersTranslation } from "@/users/list/i18n";

import { PaymentProvider } from "./enum";
import invoice from "./invoice/definition";
import { scopedTranslation as invoiceTranslation } from "./invoice/i18n";
import processor from "./processor/definition";
import refund from "./refund/definition";
import { scopedTranslation as refundTranslation } from "./refund/i18n";

const locale = "en-US";

function apiPath(endpoint: CreateApiEndpointAny): string {
  return `/api/${locale}/${endpoint.path.join("/")}`;
}

async function replay(
  { page }: E2EFixtures,
  endpoint: CreateApiEndpointAny,
  data: ReturnType<CreateApiEndpointAny["responseSchema"]["parse"]>,
): Promise<void> {
  await page.route(
    (url) => url.pathname === apiPath(endpoint),
    (route) =>
      route.request().method() === endpoint.method
        ? route.fulfill({ json: { success: true, data } })
        : route.fallback(),
  );
}

function waitForReplay(
  { page }: E2EFixtures,
  endpoint: CreateApiEndpointAny,
): Promise<Request> {
  return page.waitForRequest(
    (request) =>
      new URL(request.url()).pathname === apiPath(endpoint) &&
      request.method() === endpoint.method,
  );
}

describe("E2E: payment and ledger actions with provider and batch fixtures", () => {
  const e2e = useE2E("payments/operator-actions");

  e2e.it(
    "submits the global credit expiry and commission confirmation forms",
    async (fixture) => {
      const { page } = fixture;
      await authAtlas(fixture, await resolveTestAdminUser());
      for (const action of [
        {
          endpoint: expire.POST,
          path: "/tools/credits/expire/POST",
          view: "credits_expire_POST",
          data: { expiredCount: 4 },
        },
        {
          endpoint: confirm.POST,
          path: "/tools/referral/earnings/confirm/POST",
          view: "referral_earnings_confirm_POST",
          data: { confirmedCount: 3, failedCount: 0 },
        },
      ]) {
        // Global batch operations use saved results on the shared instance.
        await replay(fixture, action.endpoint, action.data);
        await fixture.goto(action.path, locale);
        const submit = page
          .getByTestId("endpoint-submit")
          .filter({ visible: true });
        await submit.waitFor();
        const [request] = await Promise.all([
          waitForReplay(fixture, action.endpoint),
          submit.click(),
        ]);
        expect(request.method()).toBe("POST");
        await page
          .getByText(String(Object.values(action.data)[0]), { exact: true })
          .last()
          .waitFor();
        await saveAdminReviewScreenshots(page, action.view, locale);
      }
    },
  );

  e2e.it(
    "submits an invoice for the selected customer and due date",
    async (fixture) => {
      const { page } = fixture;
      const { t } = invoiceTranslation.scopedT(locale);
      const { t: usersT } = usersTranslation.scopedT(locale);
      const admin = await resolveTestAdminUser();
      let customerId: string | undefined;
      fixture.cleanup(async () => {
        if (customerId) {
          await deleteTestUser(customerId);
        }
      });
      const created = await createTestUser(
        fixture.uniqueEmail("stripe-invoice"),
        "River Mitchell",
      );
      expect(created.success).toBe(true);
      if (!created.success) {
        return;
      }
      const customer = created.data;
      customerId = customer.user.id;
      await authAtlas(fixture, admin);
      const example = invoice.POST.responseSchema.parse(
        invoice.POST.examples.responses?.default,
      );
      const issued = {
        ...example,
        invoice: {
          ...example.invoice,
          id: "in_fixture_invoice",
          invoiceNumber: "INV-104",
        },
      };
      await replay(fixture, invoice.POST, issued);
      const date = "2026-12-20T00:00:00.000Z";
      await fixture.goto(
        `/tools/payment/invoice/POST?arg.dueDate=${encodeURIComponent(date)}`,
        locale,
      );
      await page.locator('button[name="customerId"]').click();
      const picker = page.getByRole("dialog");
      await picker
        .getByRole("textbox", {
          name: usersT("get.fields.search.label"),
          exact: true,
        })
        .fill(customer.email);
      await picker
        .getByText(customer.publicName, { exact: true })
        .first()
        .click();
      await picker.waitFor({ state: "hidden" });
      await page.getByLabel(t("amount.label"), { exact: true }).fill("99.99");
      await page
        .getByRole("combobox", { name: t("currency.label"), exact: true })
        .click();
      await page
        .getByRole("option", { name: t("currency.eur"), exact: true })
        .click();
      await page
        .getByLabel(t("description.label"), { exact: true })
        .fill("Quarterly platform support");
      await saveAdminReviewScreenshots(page, "payment_invoice_POST", locale);
      const [request] = await Promise.all([
        waitForReplay(fixture, invoice.POST),
        page.getByTestId("endpoint-submit").filter({ visible: true }).click(),
      ]);
      expect(request.postDataJSON()).toMatchObject({
        customerId: customer.user.id,
        dueDate: date,
        amount: 99.99,
        currency: "EUR",
      });
      await page.getByText("INV-104", { exact: true }).waitFor();
    },
  );

  e2e.it("reviews, cancels and confirms a partial refund", async (fixture) => {
    const { page } = fixture;
    const { t } = refundTranslation.scopedT(locale);
    await authAtlas(fixture, await resolveTestAdminUser());
    const payment = processor.GET.responseSchema.parse(
      processor.GET.examples.responses?.eligible,
    );
    const [transaction] = payment.transactions;
    const example = refund.POST.responseSchema.parse(
      refund.POST.examples.responses?.partial,
    );
    const refunded = {
      ...example,
      refund: { ...example.refund, transactionId: transaction.id, amount: 7.5 },
    };
    await replay(fixture, processor.GET, payment);
    await replay(fixture, refund.POST, refunded);
    await fixture.goto("/tools/payment/refund/POST", locale);
    await page
      .getByRole("button", { name: t("widget.chooseTransaction"), exact: true })
      .click();
    await page.locator('[id="admin-tool-payment-processor"]').waitFor();
    await fixture.goto(
      `/tools/payment/refund/POST?arg.transactionId=${transaction.id}`,
      locale,
    );
    await page
      .getByLabel(t("form.fields.amount.label"), { exact: true })
      .fill("7.50");
    await page
      .getByLabel(t("form.fields.reason.label"), { exact: true })
      .fill("Billing adjustment");
    const review = page.getByRole("button", {
      name: t("widget.review"),
      exact: true,
    });
    await saveAdminReviewScreenshots(page, "payment_refund_POST", locale);
    await review.click();
    await page
      .getByRole("button", { name: t("widget.cancel"), exact: true })
      .click();
    await review.click();
    const [request] = await Promise.all([
      waitForReplay(fixture, refund.POST),
      page
        .getByRole("button", { name: t("widget.confirm"), exact: true })
        .click(),
    ]);
    expect(request.postDataJSON()).toMatchObject({
      transactionId: transaction.id,
      amount: 7.5,
      reason: "Billing adjustment",
    });
    await page
      .getByText(example.refund.stripeRefundId, { exact: true })
      .waitFor();
  });

  e2e.it(
    "chooses a payment method and opens a saved checkout session",
    async (fixture) => {
      const { page } = fixture;
      const { t } = purchaseTranslation.scopedT(locale);
      await authAtlas(fixture, await resolveTestAdminUser());
      const active = subscription.GET.responseSchema.parse(
        subscription.GET.examples.responses?.default,
      );
      await replay(fixture, subscription.GET, {
        ...active,
        currentPeriodEnd: new Date(Date.now() + 86_400_000),
      });
      const checkout = purchase.POST.responseSchema.parse(
        purchase.POST.examples.responses?.default,
      );
      const checkoutUrl = "https://checkout.example.test/credits";
      await replay(fixture, purchase.POST, { ...checkout, checkoutUrl });
      await page.route(checkoutUrl, (route) =>
        route.fulfill({ body: "Checkout fixture" }),
      );
      await fixture.goto("/tools/credits/purchase/POST", locale);
      const buy = page.getByRole("button", {
        name: t("post.submit.text"),
        exact: true,
      });
      await buy.waitFor();
      const removePack = page.getByRole("button", {
        name: t("post.pack.removePack"),
        exact: true,
      });
      expect(await removePack.isDisabled()).toBe(true);
      await page
        .getByRole("button", {
          name: t("post.pack.addPack"),
          exact: true,
        })
        .click();
      expect(await removePack.isEnabled()).toBe(true);
      await removePack.click();
      await saveAdminReviewScreenshots(page, "credits_purchase_POST", locale);
      await buy.click();
      expect(
        await page
          .getByRole("button", {
            name: new RegExp(t("post.provider.nowpayments")),
          })
          .isDisabled(),
      ).toBe(true);
      const [request] = await Promise.all([
        waitForReplay(fixture, purchase.POST),
        page
          .getByRole("button", { name: new RegExp(t("post.provider.stripe")) })
          .click(),
      ]);
      expect(request.postDataJSON()).toMatchObject({
        quantity: 1,
        provider: PaymentProvider.STRIPE,
      });
      await page.waitForURL(checkoutUrl);
    },
  );
});
