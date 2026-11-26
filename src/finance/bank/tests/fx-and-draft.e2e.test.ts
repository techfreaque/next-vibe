import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
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
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentBillLines, paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, InvoiceStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import candidates from "../candidates/definition";
import { scopedTranslation } from "../i18n";
import { bankAccountReconciliationSettings, bankStatementLines } from "../db";

describe("Bank FX and supplier evidence", () => {
  const e2e = useE2E("finance/bank-fx-draft");

  e2e.it(
    "posts documented fee and FX independently, reverses once and creates a provisional payable once",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E FX Bank Company",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        await db
          .delete(bankAccountReconciliationSettings)
          .where(eq(bankAccountReconciliationSettings.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        expect(
          await db
            .select()
            .from(bankStatementLines)
            .where(eq(bankStatementLines.companyId, companyId)),
        ).toEqual([]);
      });
      const bank = randomUUID();
      const payable = randomUUID();
      const gain = randomUUID();
      const loss = randomUUID();
      const fee = randomUUID();
      const vendorId = randomUUID();
      const periodId = randomUUID();
      const billId = randomUUID();
      const journalId = randomUUID();
      const carryingId = randomUUID();
      const date = "2026-11-25";
      await db.insert(accountingPeriods).values({
        id: periodId,
        companyId,
        name: "E2E November",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });
      await db.insert(accountNodes).values([
        {
          id: bank,
          companyId,
          code: "1100",
          name: "Bank",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: payable,
          companyId,
          code: "2200",
          name: "Payable",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        },
        {
          id: gain,
          companyId,
          code: "4500",
          name: "FX gain",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.FINANCIAL_INCOME,
        },
        {
          id: loss,
          companyId,
          code: "6300",
          name: "FX loss",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.FINANCIAL_EXPENSE,
        },
        {
          id: fee,
          companyId,
          code: "6400",
          name: "Bank fees",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
      ]);
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: "E2E Verified Supplier" });
      await db.insert(paymentBills).values({
        id: billId,
        companyId,
        supplierName: "E2E Verified Supplier",
        billDate: new Date(date),
        currency: "USD",
        status: BillStatus.PAID,
        total: 120,
        subtotal: 120,
        metadata: { vendorId },
      });
      await db.insert(journalEntries).values({
        id: journalId,
        companyId,
        periodId,
        entryNumber: "FX-CARRY-E2E",
        date: new Date(date),
        description: "Approved foreign liability settlement carrying amount",
        status: JournalEntryStatus.POSTED,
        sourceType: JournalSourceType.AP_PAYMENT,
        sourceId: billId,
      });
      await db.insert(journalEntryLines).values([
        {
          id: carryingId,
          journalEntryId: journalId,
          accountId: bank,
          type: LineType.CREDIT,
          amount: 100,
          currency: "EUR",
        },
        {
          journalEntryId: journalId,
          accountId: payable,
          type: LineType.DEBIT,
          amount: 100,
          currency: "EUR",
        },
      ]);

      const settings = {
        companyId,
        accountId: bank,
        bookedCurrency: "EUR",
        foreignCurrency: "USD",
        maxFxDifference: "5.00",
        maxFxBps: 500,
        maxDateDistanceDays: 7,
        gainAccountId: gain,
        lossAccountId: loss,
        feeAccountId: fee,
      };
      expect(
        (
          await postAtlas(fixtures, "finance/bank/settings", {
            ...settings,
            gainAccountId: bank,
          })
        ).ok,
      ).toBe(false);
      expect(
        (await postAtlas(fixtures, "finance/bank/settings", settings)).ok,
      ).toBe(true);
      const source = {
        companyId,
        accountId: bank,
        format: "revolutBusiness",
        csv: "ID,Date completed (UTC),Payment currency,Amount,Original currency,Original amount,Fee,State\nFX-BOOKED,2026-11-25 08:24:02,EUR,-101.50,USD,120,0.25,COMPLETED",
      };
      const preview = await postAtlas(fixtures, "finance/bank/import", {
        ...source,
        dryRun: true,
      });
      expect(preview.ok).toBe(true);
      expect(
        await db
          .select()
          .from(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId)),
      ).toHaveLength(0);
      expect(
        (await postAtlas(fixtures, "finance/bank/import", source)).ok,
      ).toBe(true);
      const [line] = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.companyId, companyId));
      expect(line).toMatchObject({
        amount: "-101.5000",
        nativeAmount: "-120.0000",
        nativeCurrency: "USD",
        feeAmount: "-0.2500",
        feeCurrency: "EUR",
      });
      if (!line) {
        return;
      }
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      await fixtures.open(candidates.GET, {
        query: { companyId, lineId: line.id },
        ready: async () => {
          await fixtures.page.locator("[data-hydrated]").first().waitFor();
        },
      });
      const review = fixtures.page.getByRole("button", {
        name: t("ui.review"),
        exact: true,
      });
      if (await review.isVisible()) {
        await review.click();
      }
      await fixtures.page.getByText(t("adjustment.fxDifference"), { exact: false }).first().waitFor();
      expect(await fixtures.page.getByText(t("ui.sameDay"), { exact: true }).count()).toBe(0);
      await fixtures.page
        .getByRole("button", { name: t("ui.matchRow"), exact: true })
        .first()
        .click();
      await fixtures.page
        .getByText(t("adjustment.fxDifference"), { exact: true })
        .waitFor();
      await fixtures.page.getByText(t("adjustment.confirmHint"), { exact: true }).waitFor();
      expect(await fixtures.page.getByText(t("ui.confirmHint"), { exact: true }).count()).toBe(0);
      await saveWorkflowScreenshots(fixtures, "bank-fx-and-fee-preview");

      const matchInput = {
        companyId,
        lineId: line.id,
        journalLineId: carryingId,
        confirm: true,
      };
      const attempts = await Promise.all([
        postAtlas(fixtures, "finance/bank/match", matchInput),
        postAtlas(fixtures, "finance/bank/match", matchInput),
      ]);
      expect(attempts.every((attempt) => attempt.ok)).toBe(true);
      const [matched] = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.id, line.id));
      expect(matched?.matchKind).toBe("fx");
      const adjustment = matched?.adjustmentJournalEntryId;
      expect(adjustment).toBeDefined();
      if (!adjustment || !matched?.matchedAt) {
        return;
      }
      const actualLines = await db
        .select()
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, adjustment));
      expect(actualLines).toHaveLength(3);
      expect(actualLines).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            accountId: bank,
            type: LineType.CREDIT,
            amount: 1.5,
          }),
          expect.objectContaining({
            accountId: loss,
            type: LineType.DEBIT,
            amount: 1.25,
          }),
          expect.objectContaining({
            accountId: fee,
            type: LineType.DEBIT,
            amount: 0.25,
          }),
        ]),
      );
      expect(
        (
          await postAtlas(
            fixtures,
            `chart-of-accounts/journal/${adjustment}/reverse`,
            { reversalDate: date },
          )
        ).ok,
      ).toBe(false);
      const release = {
        companyId,
        lineId: line.id,
        action: "release",
        expectedJournalLineId: carryingId,
        expectedMatchedAt: matched.matchedAt.toISOString(),
        reverseDate: date,
        reason: "Verified test correction",
        confirm: true,
      };
      expect(
        (await postAtlas(fixtures, "finance/bank/followup", release)).ok,
      ).toBe(true);
      expect(
        (await postAtlas(fixtures, "finance/bank/followup", release)).ok,
      ).toBe(true);
      expect(
        await db
          .select()
          .from(journalEntries)
          .where(
            and(
              eq(journalEntries.companyId, companyId),
              eq(journalEntries.reversalOfId, adjustment),
            ),
          ),
      ).toHaveLength(1);

      const c24 = {
        companyId,
        accountId: bank,
        format: "c24",
        csv: "Buchungstag;Betrag;Verwendungszweck;Zahlungspartner\n26.11.2026;-15,55;Hosting;Sample supplier",
      };
      expect((await postAtlas(fixtures, "finance/bank/import", c24)).ok).toBe(
        true,
      );
      const [missing] = await db
        .select()
        .from(bankStatementLines)
        .where(
          and(
            eq(bankStatementLines.companyId, companyId),
            eq(bankStatementLines.bookedDate, "2026-11-26"),
          ),
        );
      expect(missing?.id).toBeDefined();
      if (!missing) {
        return;
      }
      const billInput = {
        companyId,
        lineId: missing.id,
        action: "draft",
        vendorId,
        expenseAccountId: fee,
        confirm: true,
      };
      const outcome = z.object({
        success: z.literal(true),
        data: z.object({ billId: z.uuid() }),
      });
      const posted = outcome.parse(
        await (
          await postAtlas(fixtures, "finance/bank/followup", billInput)
        ).json(),
      );
      const replayed = outcome.parse(
        await (
          await postAtlas(fixtures, "finance/bank/followup", billInput)
        ).json(),
      );
      expect(posted.data.billId).toBe(replayed.data.billId);
      const [draft] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, posted.data.billId));
      expect(draft).toMatchObject({
        status: BillStatus.DRAFT,
        currency: "EUR",
        taxAmount: 0,
        total: 15.55,
        journalEntryId: null,
        metadata: {
          bankStatementLineId: missing.id,
          originalSupplierInvoicePending: true,
        },
      });
      expect(
        await db
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, posted.data.billId)),
      ).toHaveLength(1);

      const autoSource = {
        ...source,
        autoMatch: true,
        csv: "ID,Date completed (UTC),Payment currency,Amount,Original currency,Original amount,Fee,State,Counterparty\nAUTO-UNIQUE,2026-11-25 09:00:00,EUR,-100,USD,120,0,COMPLETED,E2E Verified Supplier",
      };
      const dry = await postAtlas(fixtures, "finance/bank/import", {
        ...autoSource,
        dryRun: true,
      });
      expect(await dry.json()).toMatchObject({
        success: true,
        data: { imported: 1, autoMatched: 0, preview: true },
      });
      const auto = await postAtlas(fixtures, "finance/bank/import", autoSource);
      expect(await auto.json()).toMatchObject({
        success: true,
        data: { imported: 1, autoMatched: 1 },
      });
      const replay = await postAtlas(
        fixtures,
        "finance/bank/import",
        autoSource,
      );
      expect(await replay.json()).toMatchObject({
        success: true,
        data: { imported: 0, autoMatched: 0 },
      });

      for (let occurrence = 1; occurrence <= 2; occurrence++) {
        const payableBillId = randomUUID();
        const settledId = randomUUID();
        await db.insert(paymentBills).values({
          id: payableBillId,
          companyId,
          supplierName: "E2E Verified Supplier",
          billDate: new Date(date),
          currency: "EUR",
          status: BillStatus.PAID,
          total: 200,
          subtotal: 200,
          metadata: { vendorId },
        });
        await db.insert(journalEntries).values({
          id: settledId,
          companyId,
          periodId,
          date: new Date(date),
          entryNumber: `AUTO-MULTIPLE-${occurrence}`,
          description: "Ambiguous same-amount supplier payment",
          status: JournalEntryStatus.POSTED,
          sourceType: JournalSourceType.AP_PAYMENT,
          sourceId: payableBillId,
        });
        await db.insert(journalEntryLines).values([
          {
            journalEntryId: settledId,
            accountId: bank,
            type: LineType.CREDIT,
            amount: 200,
            currency: "EUR",
          },
          {
            journalEntryId: settledId,
            accountId: payable,
            type: LineType.DEBIT,
            amount: 200,
            currency: "EUR",
          },
        ]);
      }
      const ambiguous = await postAtlas(fixtures, "finance/bank/import", {
        ...c24,
        autoMatch: true,
        csv: "Buchungstag;Betrag;Verwendungszweck;Zahlungspartner\n25.11.2026;-200,00;Multiple possible supplier payments;E2E Verified Supplier",
      });
      expect(await ambiguous.json()).toMatchObject({
        success: true,
        data: { imported: 1, autoMatched: 0 },
      });
      const all = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.companyId, companyId));
      expect(
        all.filter(({ matchedJournalLineId }) => matchedJournalLineId),
      ).toHaveLength(1);
      expect(
        all.find(({ amount }) => amount === "-200.0000")?.matchedJournalLineId,
      ).toBeNull();

      const receivable = randomUUID();
      const invoiceId = randomUUID();
      const receiptId = randomUUID();
      const receiptBankLine = randomUUID();
      await db.insert(accountNodes).values({
        id: receivable,
        companyId,
        code: "1200",
        name: "Accounts receivable",
        type: AccountType.ASSET,
        subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
      });
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        companyId,
        userId,
        providerInvoiceId: `bank-e2e-${invoiceId}`,
        amount: "75.00",
        currency: "EUR",
        status: InvoiceStatus.PAID,
        paidAt: new Date(date),
      });
      await db.insert(journalEntries).values({
        id: receiptId,
        companyId,
        periodId,
        date: new Date(date),
        entryNumber: "AR-RECEIPT-E2E",
        description: "Customer receipt before matching",
        status: JournalEntryStatus.POSTED,
        sourceType: JournalSourceType.AR_PAYMENT,
        sourceId: invoiceId,
      });
      await db.insert(journalEntryLines).values([
        {
          id: receiptBankLine,
          journalEntryId: receiptId,
          accountId: bank,
          type: LineType.DEBIT,
          amount: 75,
          currency: "EUR",
        },
        {
          journalEntryId: receiptId,
          accountId: receivable,
          type: LineType.CREDIT,
          amount: 75,
          currency: "EUR",
        },
      ]);
      expect(
        (
          await postAtlas(fixtures, "finance/bank/import", {
            companyId,
            accountId: bank,
            csv: "transactionId,date,amount,currency\nAR-BANK-E2E,2026-11-25,75,EUR",
          })
        ).ok,
      ).toBe(true);
      const [receiptStatement] = await db
        .select()
        .from(bankStatementLines)
        .where(
          and(
            eq(bankStatementLines.companyId, companyId),
            eq(bankStatementLines.transactionId, "AR-BANK-E2E"),
          ),
        );
      expect(receiptStatement?.id).toBeDefined();
      if (!receiptStatement) {
        return;
      }
      expect(
        (
          await postAtlas(fixtures, "finance/bank/match", {
            companyId,
            lineId: receiptStatement.id,
            journalLineId: receiptBankLine,
            confirm: true,
          })
        ).ok,
      ).toBe(true);
      const reverseReceipt = () =>
        postAtlas(fixtures, `payment/invoice/${invoiceId}/reverse-payment`, {
          paymentEntryId: receiptId,
          reversalDate: date,
          reason: "Verified receipt correction",
        });
      expect((await reverseReceipt()).status).toBe(409);
      const [receiptMatch] = await db
        .select()
        .from(bankStatementLines)
        .where(eq(bankStatementLines.id, receiptStatement.id));
      expect(
        (
          await postAtlas(fixtures, "finance/bank/followup", {
            companyId,
            lineId: receiptStatement.id,
            action: "release",
            expectedJournalLineId: receiptBankLine,
            expectedMatchedAt: receiptMatch?.matchedAt?.toISOString() ?? "",
            reason: "Prior bank match reviewed",
            confirm: true,
          })
        ).ok,
      ).toBe(true);
      expect((await reverseReceipt()).ok).toBe(true);
      const [reopened] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      expect(reopened?.status).toBe(InvoiceStatus.OPEN);
    },
  );
});
