import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import {
  useE2E,
  type E2EFixtures,
} from "next-vibe/tooling/testing/e2e/harness";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
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
import journalDefinition from "@/chart-of-accounts/journal/[entryId]/get/definition";
import { supplierJournalCopy } from "@/chart-of-accounts/journal/[entryId]/get/i18n/supplier-journal";
import agingDefinition from "@/chart-of-accounts/reports/payables-aging/definition";
import { scopedTranslation as agingCopy } from "@/chart-of-accounts/reports/payables-aging/i18n";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { paymentBills } from "../db";
import { BillStatus } from "../enum";
import { scopedTranslation as approveCopy } from "./[billId]/approve/i18n";
import billDefinition from "./[billId]/get/definition";
import { scopedTranslation as billCopy } from "./[billId]/get/i18n";
import { scopedTranslation as payCopy } from "./[billId]/pay/i18n";

const supplier = "E2E Maple Hardware";
const companionSupplier = "E2E Linden Supplies";
const expenseName = "Supplies expense";
const payableName = "Supplier payable";
const bankName = "AP workflow bank";
const taxName = "Recoverable VAT";
const exampleReference = "AP-E2E-042";

async function createBill(
  fixtures: E2EFixtures,
  companyId: string,
  target: boolean,
): Promise<string> {
  const response = await postAtlas(fixtures, "payment/bill/create", {
    companyId,
    supplierName: target ? supplier : companionSupplier,
    billNumber: target ? exampleReference : "AP-E2E-041",
    dueDate: new Date(Date.now() - 7 * 86_400_000).toISOString(),
    currency: "EUR",
    lineItems: [
      {
        description: "Supplier parts",
        quantity: 1,
        unitPrice: target ? 100 : 37.5,
        taxRate: target ? 0.23 : 0,
      },
    ],
  });
  expect(response.ok).toBe(true);
  return z
    .object({ success: z.literal(true), data: z.object({ id: z.uuid() }) })
    .parse(await response.json()).data.id;
}

describe("E2E: approve, settle and reconcile a supplier bill", () => {
  const e2e = useE2E("payment/bill/approve-settle-aging");

  e2e.it(
    "clicks approval and settlement, removes only that bill from aging and shows both posted entries",
    async (fixtures) => {
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Supplier Accounting",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
      });
      const expenseId = crypto.randomUUID();
      const bankId = crypto.randomUUID();
      const payableId = crypto.randomUUID();
      const vatId = crypto.randomUUID();
      await db.insert(accountNodes).values([
        {
          id: expenseId,
          companyId,
          name: expenseName,
          code: "6000",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: bankId,
          companyId,
          name: bankName,
          code: "1001",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: payableId,
          companyId,
          name: payableName,
          code: "2000",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        },
        {
          id: vatId,
          companyId,
          name: taxName,
          code: "1300",
          type: AccountType.ASSET,
          subtype: AccountSubtype.VAT_RECEIVABLE,
        },
      ]);
      const now = Date.now();
      await db.insert(accountingPeriods).values({
        companyId,
        name: "AP workflow period",
        startDate: new Date(now - 14 * 86_400_000),
        endDate: new Date(now + 86_400_000),
      });
      const targetId = await createBill(fixtures, companyId, true);
      const companionId = await createBill(fixtures, companyId, false);
      const companionApprove = `payment/bill/${companionId}/approve`;
      expect((await postAtlas(fixtures, companionApprove, {})).ok).toBe(true);
      expect((await postAtlas(fixtures, companionApprove, {})).ok).toBe(true);

      const { page, baseUrl } = fixtures;
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), ...headers },
        });
      });
      const { t } = billCopy.scopedT(E2E_LOCALE);
      const { t: tApprove } = approveCopy.scopedT(E2E_LOCALE);
      const { t: tPay } = payCopy.scopedT(E2E_LOCALE);
      const number = page
        .getByText(exampleReference, { exact: false })
        .filter({ visible: true })
        .first();
      const button = (name: string) =>
        page.getByRole("button", { name, exact: true });
      const agingQuery = {
        companyId,
        currency: "EUR",
        agingDate: new Date().toISOString().slice(0, 10),
      };
      const reportSupplier = (name: string) =>
        page.getByRole("button", { name }).filter({ visible: true }).first();
      const journalSourceOnly = process.env["AP_JOURNAL_SOURCE_ONLY"] === "1";
      if (journalSourceOnly) {
        const approvePath = `payment/bill/${targetId}/approve`;
        expect((await postAtlas(fixtures, approvePath, {})).ok).toBe(true);
        expect((await postAtlas(fixtures, approvePath, {})).ok).toBe(true);
        expect((await postAtlas(fixtures, `payment/bill/${targetId}/pay`, {
          accountNodeId: bankId,
        })).ok).toBe(true);
      } else {
        await fixtures.open(billDefinition.GET, {
          query: { billId: targetId },
          ready: () => button(t("widget.markReceived")).waitFor(),
        });
        await number.waitFor();
        const clickConfirm = async (
          action: string,
          confirm: string,
          suffix: string,
        ): Promise<void> => {
          await button(action).click();
          const response = page.waitForResponse(
            (event) =>
              event.request().method() === "POST" &&
              new URL(event.url()).pathname.endsWith(
                `/payment/bill/${targetId}/${suffix}`,
              ),
          );
          await page
            .getByRole("dialog")
            .last()
            .getByRole("button", { name: confirm, exact: true })
            .click();
          expect((await response).ok()).toBe(true);
        };
        await clickConfirm(
          t("widget.markReceived"),
          tApprove("receiveBill"),
          "approve",
        );
        await clickConfirm(
          t("widget.approveBill"),
          tApprove("post.widget.submit"),
          "approve",
        );
        await button(t("widget.payBill")).waitFor();

        await fixtures.open(agingDefinition.GET, {
          query: agingQuery,
          ready: () => reportSupplier(supplier).waitFor(),
        });
        await reportSupplier(companionSupplier).waitFor();
        await reportSupplier(supplier).click();
        await number.waitFor();
        await page
          .getByText(formatMoney(123, "EUR", E2E_LOCALE), { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();

        await fixtures.open(billDefinition.GET, {
          query: { billId: targetId },
          ready: () => button(t("widget.payBill")).waitFor(),
        });
        await button(t("widget.payBill")).click();
        await page
          .getByRole("button", { name: tPay("accountNodeId.label") })
          .click();
        const accountPicker = page.getByRole("dialog").last();
        const bankAccount = accountPicker.getByRole("button", {
          name: bankName,
          exact: true,
        });
        await bankAccount.waitFor();
        expect(
          await accountPicker.getByText(expenseName, { exact: true }).count(),
        ).toBe(0);
        expect(
          await accountPicker.getByText(payableName, { exact: true }).count(),
        ).toBe(0);
        await bankAccount.click();
        await page.getByText(bankName, { exact: true }).waitFor();
        const payResponse = page.waitForResponse(
          (event) =>
            event.request().method() === "POST" &&
            new URL(event.url()).pathname.endsWith(
              `/payment/bill/${targetId}/pay`,
            ),
        );
        await page
          .getByRole("button", { name: tPay("post.widget.submit"), exact: true })
          .click();
        expect((await payResponse).ok()).toBe(true);
        await page
          .getByText(t(BillStatus.PAID), { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
      }
      const [paid] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, targetId));
      expect(paid).toMatchObject({
        companyId,
        status: BillStatus.PAID,
        total: 123,
      });
      expect(paid?.paidAt).toBeInstanceOf(Date);

      const journals = await db
        .select()
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.sourceId, targetId),
            eq(journalEntries.companyId, companyId),
          ),
        );
      expect(journals).toHaveLength(2);
      const approval = journals.find(
        ({ sourceType }) => sourceType === JournalSourceType.AP_BILL,
      );
      const payment = journals.find(
        ({ sourceType }) => sourceType === JournalSourceType.AP_PAYMENT,
      );
      expect(approval).toMatchObject({
        id: paid?.journalEntryId,
        status: JournalEntryStatus.POSTED,
      });
      expect(payment?.status).toBe(JournalEntryStatus.POSTED);
      if (!approval || !payment) return;
      const movements = (id: string) =>
        db
          .select({
            accountId: journalEntryLines.accountId,
            amount: journalEntryLines.amount,
            type: journalEntryLines.type,
            currency: journalEntryLines.currency,
          })
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, id));
      const approvalLines = await movements(approval.id);
      expect(approvalLines).toHaveLength(3);
      expect(approvalLines).toEqual(
        expect.arrayContaining([
          {
            accountId: expenseId,
            type: LineType.DEBIT,
            amount: 100,
            currency: "EUR",
          },
          {
            accountId: vatId,
            type: LineType.DEBIT,
            amount: 23,
            currency: "EUR",
          },
          {
            accountId: payableId,
            type: LineType.CREDIT,
            amount: 123,
            currency: "EUR",
          },
        ]),
      );
      const paymentLines = await movements(payment.id);
      expect(paymentLines).toHaveLength(2);
      expect(paymentLines).toEqual(
        expect.arrayContaining([
          {
            accountId: payableId,
            type: LineType.DEBIT,
            amount: 123,
            currency: "EUR",
          },
          {
            accountId: bankId,
            type: LineType.CREDIT,
            amount: 123,
            currency: "EUR",
          },
        ]),
      );
      const readEvidence = async (): Promise<ReturnType<typeof billDefinition.GET.responseSchema.parse>> => {
        const reply = await getAtlasFixture(
          `${baseUrl}/api/${E2E_LOCALE}/payment/bill/${targetId}/get`,
          {},
          headers,
        );
        expect(reply.ok).toBe(true);
        return z.object({ data: billDefinition.GET.responseSchema })
          .parse(await reply.json()).data;
      };
      const approvalRef = { id: approval.id, number: approval.entryNumber };
      const paymentRef = { id: payment.id, number: payment.entryNumber };
      const { companyId: foreignCompany } = await prepareAtlasCompany(
        fixtures,
        "E2E Unrelated Supplier Accounting",
      );
      const [foreignPeriod] = await db
        .insert(accountingPeriods)
        .values({
          companyId: foreignCompany,
          name: "Unrelated AP fixture period",
          startDate: new Date(now - 86_400_000),
          endDate: new Date(now + 86_400_000),
        })
        .returning({ id: accountingPeriods.id });
      if (!foreignPeriod) {
        return expect.unreachable("Expected the unrelated fixture period");
      }
      const evidenceRow = {
        companyId,
        periodId: approval.periodId,
        date: new Date(now),
        description: "Synthetic bill evidence guard",
        status: JournalEntryStatus.POSTED,
        sourceType: JournalSourceType.AP_PAYMENT,
        sourceId: targetId,
      };
      const [foreignReference] = await db.insert(journalEntries).values([
        {
          ...evidenceRow,
          companyId: foreignCompany,
          periodId: foreignPeriod.id,
          entryNumber: "AP-FOREIGN",
          sourceType: JournalSourceType.AP_BILL,
        },
        { ...evidenceRow, entryNumber: "AP-REVERSAL", reversalOfId: payment.id },
        { ...evidenceRow, entryNumber: "AP-DRAFT", status: JournalEntryStatus.DRAFT },
      ]).returning({ id: journalEntries.id });
      expect(await readEvidence()).toMatchObject({
        approvalJournal: approvalRef, settlementJournal: paymentRef,
      });

      await db.update(paymentBills).set({ journalEntryId: foreignReference.id })
        .where(eq(paymentBills.id, targetId));
      const isolated = await readEvidence();
      expect(isolated.journalEntryId).toBeNull();
      expect(isolated.approvalJournal).toBeUndefined();
      expect(isolated.settlementJournal).toEqual(paymentRef);
      await db.update(paymentBills).set({ journalEntryId: approval.id })
        .where(eq(paymentBills.id, targetId));

      const ambiguous = await db.insert(journalEntries)
        .values([
          { ...evidenceRow, entryNumber: "AP-AMBIGUOUS-1" },
          { ...evidenceRow, entryNumber: "AP-AMBIGUOUS-2" },
        ])
        .returning({ id: journalEntries.id });
      const multiple = await readEvidence();
      expect(multiple.approvalJournal).toEqual(approvalRef);
      expect(multiple.settlementJournal).toBeUndefined();
      await db.delete(journalEntries).where(inArray(journalEntries.id, ambiguous.map(({ id }) => id)));

      const getJournal = async (id: string): Promise<ReturnType<typeof journalDefinition.GET.responseSchema.parse>["result"]> => {
        const reply = await getAtlasFixture(
          `${baseUrl}/api/${E2E_LOCALE}/chart-of-accounts/journal/${id}/get`,
          {},
          headers,
        );
        expect(reply.ok).toBe(true);
        const { data } = z.object({ data: journalDefinition.GET.responseSchema })
          .parse(await reply.json());
        return data.result;
      };
      for (const [posting, entry] of [["approval", approval], ["settlement", payment]] as const) {
        expect(await getJournal(entry.id)).toMatchObject({
          id: entry.id,
          entryNumber: entry.entryNumber,
          description: entry.description,
          supplierBill: {
            id: targetId, number: exampleReference, supplierName: supplier,
            posting, systemDescription: true,
          },
        });
      }
      const foreignJournal = await getJournal(foreignReference.id);
      expect(foreignJournal?.sourceId).toBeNull();
      expect(foreignJournal?.supplierBill).toBeUndefined();

      const reportView = endpointToUrlSegment(agingDefinition.GET);
      const billView = endpointToUrlSegment(billDefinition.GET);
      const reportParams = new URLSearchParams({
        "arg.companyId": companyId,
        "arg.currency": agingQuery.currency,
        "arg.agingDate": agingQuery.agingDate,
      });
      const category = "bill-approval-settlement";
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t: tBill } = billCopy.scopedT(locale);
        const { t: tAging } = agingCopy.scopedT(locale);
        const { t: journalT } = supplierJournalCopy.scopedT(locale);
        const approvalLink = button(`${tBill("widget.approvalJournal")} ${approval.entryNumber}`);
        const paymentLink = button(`${tBill("widget.settlementJournal")} ${payment.entryNumber}`);
        const paidReady = async (): Promise<void> => {
          await number.waitFor();
          await page
            .getByText(tBill(BillStatus.PAID), { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor();
          await approvalLink.waitFor();
          await paymentLink.waitFor();
          expect(await page.getByText(approval.id, { exact: true }).count()).toBe(0);
          expect(await page.getByText(payment.id, { exact: true }).count()).toBe(0);
          if (locale === "sk-SK" && page.viewportSize()?.width === 390) {
            await page.getByRole("heading", { name: `Faktúra ${exampleReference}`, exact: true }).waitFor();
          }
        };
        const agingReady = async (): Promise<void> => {
          await page
            .getByText(tAging("approved.title"), { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor();
          await reportSupplier(companionSupplier).waitFor();
          expect(await reportSupplier(supplier).count()).toBe(0);
          if (page.viewportSize()?.width === 390) {
            const row = reportSupplier(companionSupplier);
            await row
              .getByText(tAging("columns.days1to30"), { exact: true })
              .waitFor();
            await row
              .getByText(tAging("widget.showBills"), { exact: true })
              .waitFor();
          }
          await page
            .getByText(formatMoney(37.5, "EUR", locale), { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor();
        };
        if (!journalSourceOnly) {
          await fixtures.goto(`/tools/${billView}?billId=${targetId}`, locale);
          await saveAdminViewMatrix(
            page,
            category,
            `${locale}-paid-bill`,
            paidReady,
          );
          await fixtures.goto(`/tools/${reportView}?${reportParams}`, locale);
          await saveAdminViewMatrix(
            page,
            category,
            `${locale}-aging-after-settlement`,
            agingReady,
          );
        }
        for (const [label, posting, entry, account, link] of [
          ["approval", "approval", approval, taxName, approvalLink],
          ["payment", "settlement", payment, bankName, paymentLink],
        ] as const) {
          const entryHeading = page.getByRole("heading", {
            name: entry.entryNumber, exact: true,
          });
          for (const timeout of [10_000, 20_000]) {
            await fixtures.goto(`/tools/${billView}?billId=${targetId}`, locale);
            await paidReady();
            await link.click();
            try {
              await entryHeading.waitFor({ timeout });
              break;
            } catch {
              // Retry only this read-only bill-to-journal navigation.
              if (timeout === 20_000) {
                await entryHeading.waitFor({ timeout: 1 });
              }
            }
          }
          expect(new URL(page.url()).searchParams.get("arg.entryId")).toBe(entry.id);
          const sourceLink = button(`${exampleReference}, ${supplier}`);
          await page.getByText(journalT(posting), { exact: true }).waitFor();
          await sourceLink.waitFor();
          expect(await page.getByText(targetId, { exact: false }).count()).toBe(0);
          expect(await page.getByText(entry.description, { exact: true }).count()).toBe(0);
          await saveAdminViewMatrix(
            page,
            category,
            `${locale}-${label}-journal`,
            async () => {
              await sourceLink.waitFor();
              await page
                .getByText(entry.entryNumber, { exact: true })
                .filter({ visible: true })
                .first()
                .waitFor();
              await page
                .getByText(account, { exact: false })
                .filter({ visible: true })
                .first()
                .waitFor();
            },
          );
          await sourceLink.click();
          await paidReady();
          expect(new URL(page.url()).searchParams.get("arg.billId")).toBe(targetId);
        }
      }

      const directAlias = endpointToUrlSegment(journalDefinition.GET);
      await fixtures.goto(`/tools/${directAlias}?arg.entryId=${approval.id}`, "sk-SK");
      await page.getByText("Zaúčtovanie dodávateľskej faktúry", { exact: true }).waitFor();
      await button(`${exampleReference}, ${supplier}`).waitFor();

      const [custom] = await db.insert(journalEntries).values({
        ...evidenceRow,
        entryNumber: "AP-CUSTOM",
        description: "Custom accounting narrative",
      }).returning({ id: journalEntries.id });
      expect(await getJournal(custom.id)).toMatchObject({
        description: "Custom accounting narrative",
        supplierBill: { id: targetId, posting: "settlement", systemDescription: false },
      });

      const retainedRows = await db.select().from(journalEntries)
        .where(inArray(journalEntries.id, [approval.id, payment.id]));
      expect(retainedRows).toEqual(expect.arrayContaining([approval, payment]));
      expect(await movements(approval.id)).toEqual(approvalLines);
      expect(await movements(payment.id)).toEqual(paymentLines);
    },
    240_000,
  );
});
