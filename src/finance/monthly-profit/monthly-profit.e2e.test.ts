import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { resolveTestAdminUser } from "next-vibe/tooling/testing/testing-suite/resolve-test-user";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalEntryStatus,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  authAtlas,
  getAtlasFixture,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { paymentBills } from "@/payment/db";
import { purchasingVendors } from "@/purchasing/db";

import { FinanceSource } from "../enum";
import { scopedTranslation } from "../i18n";
import { supplierEvidenceRecords } from "../supplier-evidence/db";
import definitions from "./definition";

describe("Finance monthly profit", () => {
  const e2e = useE2E("finance/monthly-profit");

  e2e.it(
    "reports posted net revenue, expense and currency groups and opens the account ledger",
    async ({ cleanup, context, baseUrl, open, page, capture }) => {
      const admin = await resolveTestAdminUser();
      const companyId = randomUUID();
      const periodId = randomUUID();
      const octoberPeriodId = randomUUID();
      const decemberPeriodId = randomUUID();
      const revenueId = randomUUID();
      const expenseId = randomUUID();
      const bankId = randomUUID();
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const endpoint = `${baseUrl}/api/${E2E_LOCALE}/finance/monthly-profit`;

      const providerEvidence = randomUUID();
      const feeEvidence = randomUUID();
      const providerEntry = randomUUID();
      const providerReversal = randomUUID();
      const feeEntry = randomUUID();
      const closeEntry = randomUUID();
      const vendorId = randomUUID();
      const feeBillId = randomUUID();
      cleanup(async () => {
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db.delete(paymentBills).where(eq(paymentBills.id, feeBillId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
        await db
          .delete(journalEntries)
          .where(eq(journalEntries.companyId, companyId));
        await db
          .delete(accountNodes)
          .where(eq(accountNodes.companyId, companyId));
        await db
          .delete(accountingPeriods)
          .where(eq(accountingPeriods.companyId, companyId));
        await db.delete(companies).where(eq(companies.id, companyId));
      });

      await db.insert(companies).values({
        id: companyId,
        name: "E2E Monthly Ledger",
        type: CompanyType.B2B,
        ownerUserId: admin.id,
        currency: "EUR",
      });
      await db.insert(companyMembers).values({
        companyId,
        userId: admin.id,
        role: CompanyMemberRole.OWNER,
      });
      await db.insert(accountingPeriods).values([
        {
          id: octoberPeriodId,
          companyId,
          name: "2026-10",
          startDate: new Date("2026-10-01"),
          endDate: new Date("2026-10-31"),
        },
        {
          id: periodId,
          companyId,
          name: "2026-11",
          startDate: new Date("2026-11-01"),
          endDate: new Date("2026-11-30"),
        },
        {
          id: decemberPeriodId,
          companyId,
          name: "2026-12",
          startDate: new Date("2026-12-01"),
          endDate: new Date("2026-12-31"),
        },
      ]);
      await db.insert(accountNodes).values([
        {
          id: revenueId,
          companyId,
          code: "4100",
          name: "Service income",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SERVICE,
        },
        {
          id: expenseId,
          companyId,
          code: "6200",
          name: "Hosting charge",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: bankId,
          companyId,
          code: "1100",
          name: "Bank",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
      ]);
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: "Fixture expense supplier" });
      await db.insert(paymentBills).values({
        id: feeBillId,
        companyId,
        supplierName: "Fixture expense supplier",
        billDate: new Date("2026-11-22"),
      });
      const items = [
        {
          entryNumber: "E2E-1",
          description: "E2E November sale",
          date: "2026-11-01",
          debit: bankId,
          credit: revenueId,
          amount: 100.0042,
          currency: "EUR",
        },
        {
          entryNumber: "E2E-2",
          description: "E2E November refund",
          date: "2026-11-15",
          debit: revenueId,
          credit: bankId,
          amount: 5.0003,
          currency: "EUR",
        },
        {
          entryNumber: "E2E-3",
          description: "E2E posted cost",
          date: "2026-11-30",
          debit: expenseId,
          credit: bankId,
          amount: 20.25,
          currency: "EUR",
        },
        {
          entryNumber: "E2E-4",
          description: "E2E historical USD",
          date: "2026-11-12",
          debit: bankId,
          credit: revenueId,
          amount: 15,
          currency: "USD",
        },
        {
          entryNumber: "E2E-5",
          description: "E2E draft",
          date: "2026-11-12",
          debit: bankId,
          credit: revenueId,
          amount: 100,
          currency: "EUR",
          status: JournalEntryStatus.DRAFT,
        },
        {
          entryNumber: "E2E-6",
          description: "E2E December",
          date: "2026-12-01",
          debit: bankId,
          credit: revenueId,
          amount: 50,
          currency: "EUR",
        },
        {
          entryNumber: "E2E-7",
          description: "E2E Closing",
          date: "2026-11-30",
          debit: revenueId,
          credit: bankId,
          amount: 100,
          currency: "EUR",
          sourceType: JournalSourceType.PERIOD_CLOSE,
          id: closeEntry,
        },
        {
          entryNumber: "E2E-8",
          description: "Provider October charge",
          date: "2026-10-31",
          debit: expenseId,
          credit: bankId,
          amount: 9.7501,
          currency: "EUR",
          status: JournalEntryStatus.REVERSED,
          sourceType: JournalSourceType.SUPPLIER_EVIDENCE,
          sourceId: providerEvidence,
          id: providerEntry,
        },
        {
          entryNumber: "E2E-9",
          description: "Provider November reversal",
          date: "2026-11-06",
          debit: bankId,
          credit: expenseId,
          amount: 9.7501,
          currency: "EUR",
          sourceType: JournalSourceType.SUPPLIER_EVIDENCE,
          reversalOfId: providerEntry,
          status: JournalEntryStatus.REVERSED,
          id: providerReversal,
        },
        {
          entryNumber: "E2E-13",
          description: "Provider December reinstatement",
          date: "2026-12-05",
          debit: expenseId,
          credit: bankId,
          amount: 9.7501,
          currency: "EUR",
          sourceType: JournalSourceType.SUPPLIER_EVIDENCE,
          reversalOfId: providerReversal,
        },
        {
          entryNumber: "E2E-10",
          description: "Processor November bill",
          date: "2026-11-22",
          debit: expenseId,
          credit: bankId,
          amount: 8,
          currency: "EUR",
          status: JournalEntryStatus.REVERSED,
          sourceType: JournalSourceType.AP_BILL,
          sourceId: feeBillId,
          id: feeEntry,
        },
        {
          entryNumber: "E2E-11",
          description: "Processor December reversal",
          date: "2026-12-03",
          debit: bankId,
          credit: expenseId,
          amount: 8,
          currency: "EUR",
          sourceType: JournalSourceType.AP_BILL,
          reversalOfId: feeEntry,
        },
        {
          entryNumber: "E2E-12",
          description: "Legacy closing counterpart",
          date: "2026-11-30",
          debit: bankId,
          credit: revenueId,
          amount: 100,
          currency: "EUR",
          sourceType: JournalSourceType.MANUAL,
          reversalOfId: closeEntry,
        },
      ];
      for (const {
        date,
        currency,
        amount,
        debit,
        credit,
        id: savedId,
        ...item
      } of items) {
        const id = savedId ?? randomUUID();
        await db.insert(journalEntries).values({
          id,
          companyId,
          periodId: date.startsWith("2026-10")
            ? octoberPeriodId
            : date.startsWith("2026-12")
              ? decemberPeriodId
              : periodId,
          status: JournalEntryStatus.POSTED,
          date: new Date(date),
          ...item,
        });
        await db.insert(journalEntryLines).values([
          {
            journalEntryId: id,
            accountId: debit,
            type: LineType.DEBIT,
            amount,
            currency,
            sortOrder: 0,
          },
          {
            journalEntryId: id,
            accountId: credit,
            type: LineType.CREDIT,
            amount,
            currency,
            sortOrder: 1,
          },
        ]);
      }
      const evidence = {
        companyId,
        vendorId,
        sourceScope: companyId,
        digest: companyId,
        taxAmount: "0.0000",
        currency: "EUR",
        description: "Synthetic expense evidence",
        debitAccountId: expenseId,
        recordedByUserId: admin.id,
      };
      await db.insert(supplierEvidenceRecords).values([
        {
          ...evidence,
          id: providerEvidence,
          kind: "paid",
          provider: FinanceSource.OPENROUTER,
          externalReference: providerEvidence,
          date: new Date("2026-10-31"),
          grossAmount: "9.7501",
          journalEntryId: providerEntry,
        },
        {
          ...evidence,
          id: feeEvidence,
          kind: "processorFee",
          externalReference: feeEvidence,
          date: new Date("2026-11-22"),
          grossAmount: "8.0000",
          billId: feeBillId,
        },
      ]);
      const authorization = await authAtlas(
        { cleanup, context, baseUrl },
        admin,
      );
      const invalid = await getAtlasFixture(
        endpoint,
        { companyId, month: "2026-13" },
        authorization,
      );
      expect(invalid.ok).toBe(false);

      const december = await getAtlasFixture(
        endpoint,
        { companyId, month: "2026-12" },
        authorization,
      );
      expect(december.status).toBe(200);
      expect(await december.json()).toMatchObject({
        success: true,
        data: {
          report: {
            currencies: [
              {
                currency: "EUR",
                revenue: "50.0000",
                expenses: "1.7501",
                net: "48.2499",
                expenseAreas: [
                  { area: "processor", expense: "-8.0000" },
                  { area: "provider", expense: "9.7501" },
                ],
              },
            ],
          },
        },
      });
      await page.route(
        (url) =>
          /\/api\/[^/]+\/(?:finance\/monthly-profit|chart-of-accounts\/ledger\/[^/]+)$/.test(
            url.pathname,
          ),
        async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: authorization.authorization,
            },
          });
        },
      );
      await open(definitions.GET, {
        query: { companyId, month: "2026-11" },
        ready: async () => {
          await page
            .getByRole("button", { name: t("profit.run"), exact: true })
            .waitFor();
        },
      });
      const result = await capture(definitions.GET, () =>
        page
          .getByRole("button", { name: t("profit.run"), exact: true })
          .click(),
      );
      const report = z
        .object({
          success: z.literal(true),
          data: z.object({
            report: z.object({
              currencies: z.array(
                z.object({
                  currency: z.string(),
                  revenue: z.string(),
                  expenses: z.string(),
                  net: z.string(),
                  expenseAreas: z.array(
                    z.object({ area: z.string(), expense: z.string() }),
                  ),
                }),
              ),
            }),
          }),
        })
        .parse(result.response);
      expect(report.data.report.currencies).toEqual([
        {
          currency: "EUR",
          revenue: "95.0039",
          expenses: "18.4999",
          net: "76.5040",
          expenseAreas: [
            { area: "processor", expense: "8.0000" },
            { area: "provider", expense: "-9.7501" },
            { area: "unallocated", expense: "20.2500" },
          ],
        },
        {
          currency: "USD",
          revenue: "15.0000",
          expenses: "0.0000",
          net: "15.0000",
          expenseAreas: [],
        },
      ]);
      await page
        .getByText(t("suppliers.area.provider"), { exact: true })
        .first()
        .waitFor();
      await page
        .getByText(t("suppliers.area.processor"), { exact: true })
        .first()
        .waitFor();
      await page
        .getByText(t("profit.signedExpenseAreas"), { exact: true })
        .waitFor();
      await saveWorkflowScreenshots({ page }, "monthly-profit-source-areas");
      for (const [device, width, height] of [
        ["desktop", 1440, 900],
        ["phone", 390, 844],
      ] as const) {
        await page.setViewportSize({ width, height });
        await page
          .getByText("EUR", { exact: true })
          .first()
          .locator("xpath=../../..")
          .evaluate((section) => section.scrollIntoView({ block: "start" }));
        await page.screenshot({
          path: `.tmp/erp-night/admin-v2-proof/monthly-profit-area-rows-${device}.png`,
        });
      }
      const ledgerRequest = page.waitForRequest((request) =>
        new URL(request.url()).pathname.endsWith(
          `/chart-of-accounts/ledger/${expenseId}`,
        ),
      );
      await page
        .getByText("6200 Hosting charge", { exact: true })
        .first()
        .locator("xpath=../..")
        .getByRole("button", { name: t("profit.openLedger"), exact: true })
        .click();
      const ledgerQuery = new URL((await ledgerRequest).url()).searchParams;
      expect(ledgerQuery.getAll("dateFrom")).toEqual([
        "2026-11-01T00:00:00.000Z",
      ]);
      expect(ledgerQuery.getAll("dateTo")).toEqual([
        "2026-11-30T00:00:00.000Z",
      ]);
      await page.getByText("E2E-9", { exact: true }).first().waitFor();
    },
  );
});
