import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import type { Page } from "playwright";
import { describe, expect } from "vitest";
import { z } from "zod";

import windowAverage from "@/analytics/indicators/window-avg/definition";
import { scopedTranslation as averageTranslation } from "@/analytics/indicators/window-avg/i18n";
import accountsDefinition from "@/chart-of-accounts/account/list/definition";
import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  prepareAtlasCompany,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import companyDetails from "@/companies/[companyId]/get/definition";
import { scopedTranslation as providerTranslation } from "@/lead-magnet/i18n";
import { POST as shopifyProvider } from "@/lead-magnet/providers/shopify/definition";
import leadCreate from "@/leads/create/definition";
import { scopedTranslation as leadTranslation } from "@/leads/create/i18n";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import recordPayment from "@/payment/invoice/[invoiceId]/record-payment/definition";
import { scopedTranslation as paymentTranslation } from "@/payment/invoice/[invoiceId]/record-payment/i18n";
import { scopedTranslation as dataflowTranslation } from "@/vibe/dataflow/i18n";
import { scopedTranslation as widgetTranslation } from "@/vibe/unified-ui/hooks/i18n";

import estimateCreate from "./definition";
import { scopedTranslation as estimateTranslation } from "./i18n";

async function expectPhoneFit(page: Page): Promise<void> {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
}

describe("Shared ERP form controls", () => {
  const e2e = useE2E("payment/estimate/form-quality");

  e2e.it(
    "adds and removes a line on an empty estimate and opens the labeled payment calendar",
    async (fixtures) => {
      const { page } = fixtures;
      const companyName = "E2E Form Quality Company";
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        companyName,
      );
      const invoiceId = randomUUID();
      fixtures.cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId));
      });
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        companyId,
        userId,
        amount: "12.50",
        invoiceNumber: "E2E-PAY-001",
        metadata: { customerName: "E2E Billing Customer" },
        currency: "EUR",
        providerInvoiceId: invoiceId,
        status: InvoiceStatus.OPEN,
      });

      const bankAccountName = "E2E Operating Bank";
      const excludedAccountName = "E2E Office Expense";
      await db.insert(accountNodes).values([
        {
          companyId,
          code: "1000",
          name: bankAccountName,
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
          sortOrder: 1,
        },
        {
          companyId,
          code: "5000",
          name: excludedAccountName,
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
          sortOrder: 0,
        },
      ]);

      const accountList = await getAtlasFixture(
        `${fixtures.baseUrl}/api/${E2E_LOCALE}/chart-of-accounts/account/list`,
        {
          companyId,
          postableOnly: "true",
          "subtypes[0]": AccountSubtype.BANK,
          pageSize: "1",
        },
        headers,
      );
      expect(accountList.ok).toBe(true);
      const filteredAccounts = z
        .object({
          success: z.literal(true),
          data: accountsDefinition.GET.responseSchema,
        })
        .safeParse(await accountList.json());
      expect(filteredAccounts.success && filteredAccounts.data.data.total).toBe(
        1,
      );
      expect(
        filteredAccounts.success &&
          filteredAccounts.data.data.accounts[0]?.name,
      ).toBe(bankAccountName);

      await page.setViewportSize({ width: 390, height: 844 });
      await fixtures.open(companyDetails.GET, {
        query: { companyId },
        ready: () =>
          page.getByText(companyName, { exact: true }).last().waitFor(),
      });
      await expectPhoneFit(page);

      const { t: estimateT } = estimateTranslation.scopedT(E2E_LOCALE);
      const estimate = await fixtures.open(estimateCreate.POST, {
        query: { companyId },
      });
      const empty = estimate.root.getByText(estimateT("post.widget.empty"), {
        exact: true,
      });
      await empty.waitFor();
      await estimate.root
        .getByRole("button", { name: estimateT("post.widget.add") })
        .click();
      await empty.waitFor({ state: "hidden" });
      await estimate.root
        .getByRole("button", { name: estimateT("post.widget.remove") })
        .click();
      await empty.waitFor();

      const payment = await fixtures.open(recordPayment.POST, {
        query: { invoiceId },
      });
      await expectPhoneFit(page);
      const { t: paymentT } = paymentTranslation.scopedT(E2E_LOCALE);
      const { t: widgetT } = widgetTranslation.scopedT(E2E_LOCALE);
      const date = payment.root.getByRole("textbox", {
        name: paymentT("paidAt.label"),
        exact: true,
      });
      await payment.root
        .getByText(paymentT("widget.details"), { exact: true })
        .waitFor();
      await payment.field("amount").getByText("EUR", { exact: true }).waitFor();
      const account = payment.root.getByRole("combobox", {
        name: paymentT("accountNodeId.label"),
      });
      await account.click();
      expect(
        await page
          .getByRole("option", { name: new RegExp(excludedAccountName) })
          .count(),
      ).toBe(0);
      await page
        .getByRole("option", { name: `1000 ${bankAccountName}` })
        .click();
      expect(await account.textContent()).toContain(bankAccountName);
      const today = await page.evaluate(() =>
        new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date()),
      );
      expect(await date.inputValue()).toBe(today);
      await payment.root
        .getByText("E2E-PAY-001 · E2E Billing Customer", { exact: true })
        .waitFor();
      await payment.root
        .getByRole("button", { name: paymentT("widget.back"), exact: true })
        .waitFor();
      await date.fill("11/24/2026");
      const storedDay = payment
        .field("paidAt")
        .locator('input[type="hidden"][name="paidAt"]');
      expect(await storedDay.inputValue()).toBe("2026-11-24");
      const dateLabel = payment.field("paidAt").locator("label");
      expect(await dateLabel.getAttribute("for")).toBe(
        await date.getAttribute("id"),
      );
      await dateLabel.click();
      expect(
        await date.evaluate((input) => document.activeElement === input),
      ).toBe(true);

      await payment.root
        .getByRole("button", {
          name: widgetT("widgets.formFields.common.openCalendar"),
        })
        .click();
      const day = page
        .getByRole("grid")
        .getByRole("button", { disabled: false })
        .first();
      await day.click();
      expect(await date.inputValue()).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
      expect(await storedDay.inputValue()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    },
  );

  e2e.it(
    "selects a resolution by its displayed name from the owning translation scope",
    async (fixtures) => {
      const { page } = fixtures;
      await prepareAtlasCompany(fixtures, "E2E Resolution Company");
      const average = await fixtures.open(windowAverage.POST);
      const { t: averageT } = averageTranslation.scopedT(E2E_LOCALE);
      const { t: dataflowT } = dataflowTranslation.scopedT(E2E_LOCALE);
      const resolution = average.root.getByRole("combobox", {
        name: averageT("post.fields.resolution.label"),
      });
      await resolution.click();
      await page
        .getByRole("option", { name: dataflowT("enums.resolution.4h") })
        .click();
      expect(await resolution.textContent()).toContain(
        dataflowT("enums.resolution.4h"),
      );
    },
  );
  e2e.it(
    "keeps lead and provider forms usable on a phone with named actions",
    async (fixtures) => {
      const { page } = fixtures;
      await prepareAtlasCompany(fixtures, "E2E Lead Forms Company");
      await page.setViewportSize({ width: 390, height: 844 });
      const lead = await fixtures.open(leadCreate.POST);
      const { t: leadT } = leadTranslation.scopedT(E2E_LOCALE);
      await lead.root
        .getByText(leadT("post.contactInfo.title"), { exact: true })
        .waitFor();
      await lead.root
        .getByText(leadT("post.locationPreferences.title"), { exact: true })
        .waitFor();
      const email = lead.field("contactInfo.email").getByRole("textbox");
      expect(await email.getAttribute("type")).toBe("email");
      expect(
        await lead.root
          .getByRole("button", { name: leadT("post.email.description") })
          .count(),
      ).toBe(0);
      await email.fill("form-quality@example.com");
      await lead.root
        .getByRole("button", {
          name: leadT("post.submitButton.label"),
          exact: true,
        })
        .waitFor();
      await expectPhoneFit(page);

      const provider = await fixtures.open(shopifyProvider);
      const { t: providerT } = providerTranslation.scopedT(E2E_LOCALE);
      await provider.root
        .getByText(providerT("providers.shared.connectionSettings"), {
          exact: true,
        })
        .waitFor();
      await provider.root
        .getByText(providerT("providers.shared.secretKeepExisting"), {
          exact: true,
        })
        .waitFor();
      await provider
        .field("shopifyDomain")
        .getByRole("textbox")
        .fill("sample.myshopify.example");
      await provider.root
        .getByRole("button", {
          name: providerT("providers.shopify.title"),
          exact: true,
        })
        .waitFor();
      await expectPhoneFit(page);
    },
  );
});
