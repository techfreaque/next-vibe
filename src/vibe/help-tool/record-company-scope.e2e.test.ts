import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { accountingPeriods, journalEntries } from "@/chart-of-accounts/db";
import { JournalEntryStatus, JournalSourceType } from "@/chart-of-accounts/enum";
import {
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";

import { scopedTranslation } from "./i18n";

describe("Fixed company on authorized ERP records", () => {
  const e2e = useE2E("admin-record-company");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`shows the record company without changing the workspace in ${locale}`, async (fixture) => {
      const { page, baseUrl, cleanup } = fixture;
      const workspaceName = "Fixture workspace company";
      const recordName = "Fixture record company";
      const invoiceNumber = "INV-SCOPE-105";
      const entryNumber = "JE-SCOPE-105";
      const savedCompany = await prepareAtlasCompany(fixture, workspaceName);
      const recordCompany = await prepareAtlasCompany(fixture, recordName);
      const invoiceId = randomUUID();
      const entryId = randomUUID();
      const missingId = randomUUID();
      const periodId = randomUUID();
      cleanup(async () => {
        await db.delete(paymentInvoices).where(eq(paymentInvoices.id, invoiceId));
      });
      const now = new Date();
      await db.insert(accountingPeriods).values({
        id: periodId,
        companyId: recordCompany.companyId,
        name: "Fixture accounting period",
        startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
        endDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)),
      });
      await db.insert(journalEntries).values({
        id: entryId,
        companyId: recordCompany.companyId,
        periodId,
        entryNumber,
        date: now,
        description: "Fixture customer invoice posting",
        status: JournalEntryStatus.POSTED,
        sourceType: JournalSourceType.AR_INVOICE,
        sourceId: invoiceId,
        postedAt: now,
      });
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        userId: recordCompany.userId,
        companyId: recordCompany.companyId,
        invoiceNumber,
        providerInvoiceId: `manual-fixture-${invoiceId}`,
        status: InvoiceStatus.OPEN,
        journalEntryId: entryId,
        currency: "EUR",
        amount: "120.00",
      });

      const origin = new URL(baseUrl).origin;
      const invoicePath = `/api/${locale}/payment/invoice/${invoiceId}/get`;
      const journalPath = `/api/${locale}/chart-of-accounts/journal/${entryId}/get`;
      const missingPath = `/api/${locale}/chart-of-accounts/journal/${missingId}/get`;
      const reportPath = `/api/${locale}/chart-of-accounts/reports/receivables-aging`;
      const paths = new Set([invoicePath, journalPath, missingPath, reportPath]);
      await page.route(
        (url) => url.origin === origin && paths.has(url.pathname),
        async (route) => {
          await route.continue({
            headers: { ...route.request().headers(), authorization: recordCompany.headers.authorization },
          });
        },
      );
      const { t } = scopedTranslation.scopedT(locale);
      const toolbar = page.locator('#admin-tools-toolbar[data-admin-ready="true"]');
      const recordCompanyLabel = t("erp.companySwitch.current", { name: recordName });
      const workspaceCompanyLabel = t("erp.companySwitch.current", { name: workspaceName });
      const fixedCompany = toolbar.getByText(recordName, { exact: true });
      const savedSwitcher = page.getByRole("button", { name: workspaceCompanyLabel, exact: true });
      const fixedCompanyReady = async (): Promise<void> => {
        await fixedCompany.waitFor();
        expect(await toolbar.getByText(recordCompanyLabel, { exact: true }).count()).toBe(1);
        expect(await toolbar.getByRole("button", { name: recordCompanyLabel, exact: true }).count()).toBe(0);
        expect(await savedSwitcher.count()).toBe(0);
      };

      await page.setViewportSize({ width: 390, height: 844 });
      await fixture.goto("/tools?cat=accounting", locale);
      await toolbar.waitFor();
      await toolbar.getByRole("button", { name: t("erp.companySwitch.select"), exact: true }).click();
      await page.getByRole("menuitemradio").filter({ hasText: workspaceName }).click();
      await savedSwitcher.waitFor();

      const short = locale.slice(0, 2);
      for (const record of [
        { url: `/tools/payment-invoice-get?arg.invoiceId=${invoiceId}`, heading: invoiceNumber, name: "invoice" },
        { url: `/tools/coa-journal-entry-get?arg.entryId=${entryId}`, heading: entryNumber, name: "journal" },
      ]) {
        await fixture.goto(record.url, locale);
        const ready = async (): Promise<void> => {
          await page.getByRole("heading", { name: record.heading, exact: true }).waitFor();
          await fixedCompanyReady();
        };
        await ready();
        if (process.env["RECORD_COMPANY_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "accounting", `record-company-${record.name}-${short}`, ready);
        }
        await page.setViewportSize({ width: 390, height: 844 });
      }

      const [missing] = await Promise.all([
        page.waitForResponse((result) => new URL(result.url()).pathname === missingPath),
        fixture.goto(`/tools/coa-journal-entry-get?arg.entryId=${missingId}`, locale),
      ]);
      expect(missing.status()).toBe(404);
      await toolbar.waitFor();
      expect(await fixedCompany.count()).toBe(0);
      expect(await savedSwitcher.count()).toBe(0);

      const [report] = await Promise.all([
        page.waitForResponse((result) => {
          const url = new URL(result.url());
          return url.pathname === reportPath && url.searchParams.get("companyId") === savedCompany.companyId;
        }),
        fixture.goto("/tools/coa-receivables-aging", locale),
      ]);
      expect(report.status()).toBe(200);
      await savedSwitcher.waitFor();
      expect(await fixedCompany.count()).toBe(0);
    }, 120_000);
  }
});
