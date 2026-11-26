import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { createEndpointLogger } from "next-vibe/logger/server";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import {
  formatDocDate,
  formatMoney,
} from "next-vibe/unified-ui/_shared/format-money";
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
  JournalSourceType,
} from "@/chart-of-accounts/enum";
import {
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as financeTranslations } from "@/finance/i18n";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import supplierDefinition from "@/finance/supplier-evidence/definition";
import { SupplierEvidenceRepository } from "@/finance/supplier-evidence/repository";
import { BillApproveRepository } from "@/payment/bill/[billId]/approve/repository";
import { scopedTranslation as billTranslations } from "@/payment/bill/[billId]/get/i18n";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { bankStatementLines } from "../db";
import followup from "../followup/definition";
import { BankFollowupRepository } from "../followup/repository";

describe("Bank-origin bills and supplier evidence", () => {
  const e2e = useE2E("finance/bank-bill-evidence");

  e2e.it(
    "shows authenticated bank transaction context when linking a supplier document",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E Bank Link Context",
      );
      const vendorId = randomUUID();
      const bankId = randomUUID();
      const expenseId = randomUUID();
      const lineId = randomUUID();
      fixtures.cleanup(async () => {
        await db
          .delete(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
      });
      await db.insert(accountNodes).values([
        {
          id: bankId,
          companyId,
          name: "Fixture bank",
          code: "1010",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: expenseId,
          companyId,
          name: "Fixture expense",
          code: "6100",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
      ]);
      const supplier = "Fixture hosting supplier";
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: supplier });
      await db.insert(bankStatementLines).values({
        id: lineId,
        companyId,
        accountId: bankId,
        transactionId: lineId,
        bookedDate: "2026-11-26",
        currency: "EUR",
        amount: "-24.0000",
        description: "Fixture bank narrative that should stay out of the form",
      });
      const logger = createEndpointLogger(false, E2E_LOCALE);
      const result = await BankFollowupRepository.run(
        followup.POST.requestSchema.parse({
          lineId,
          companyId,
          vendorId,
          expenseAccountId: expenseId,
          action: "draft",
          confirm: true,
        }),
        userId,
        logger,
        E2E_LOCALE,
      );
      expect(result.success).toBe(true);
      if (!result.success || !result.data.billId) return;
      const { t: billT } = billTranslations.scopedT(E2E_LOCALE);
      const { t: financeT } = financeTranslations.scopedT(E2E_LOCALE);
      const link = fixtures.page
        .getByRole("button", {
          name: String(billT("widget.linkBankDocument")),
          exact: true,
        })
        .last();
      await fixtures.gotoReady(
        `/tools/payment-bill-get?arg.billId=${result.data.billId}`,
        () => link.waitFor(),
      );
      await link.click();
      const context = fixtures.page.getByText(supplier, { exact: true }).last();
      await context.waitFor();
      await fixtures.page
        .getByText(formatDocDate("2026-11-26", E2E_LOCALE), { exact: true })
        .last()
        .waitFor();
      await fixtures.page
        .getByText(formatMoney(24, "EUR", E2E_LOCALE), { exact: true })
        .last()
        .waitFor();
      await fixtures.page
        .getByRole("button", {
          name: String(financeT("suppliers.previewBankLink")),
          exact: true,
        })
        .last()
        .waitFor();
      expect(
        await fixtures.page
          .getByText("Fixture bank narrative that should stay out of the form")
          .filter({ visible: true })
          .count(),
      ).toBe(0);
      await saveWorkflowScreenshots(fixtures, "bank-bill-link-document");
    },
  );

  e2e.it(
    "links verified documents before and after gross-only approval without booking twice",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E Bank Evidence",
      );
      const vendorId = randomUUID();
      const bankId = randomUUID();
      const expenseId = randomUUID();
      const payablesId = randomUUID();
      const vatId = randomUUID();
      const firstLineId = randomUUID();
      const lateLineId = randomUUID();
      fixtures.cleanup(async () => {
        await db
          .delete(bankStatementLines)
          .where(eq(bankStatementLines.companyId, companyId));
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.id, vendorId));
        expect(
          await db
            .select({ id: paymentBills.id })
            .from(paymentBills)
            .where(eq(paymentBills.companyId, companyId)),
        ).toEqual([]);
      });

      await db.insert(accountingPeriods).values({
        companyId,
        name: "November 2026",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });
      await db.insert(accountNodes).values([
        {
          id: bankId,
          companyId,
          name: "Fixture bank",
          code: "1010",
          type: AccountType.ASSET,
          subtype: AccountSubtype.BANK,
        },
        {
          id: expenseId,
          companyId,
          name: "Fixture hosting",
          code: "6100",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: payablesId,
          companyId,
          name: "Fixture AP",
          code: "2110",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        },
        {
          id: vatId,
          companyId,
          name: "Fixture VAT receivable",
          code: "1400",
          type: AccountType.ASSET,
          subtype: AccountSubtype.VAT_RECEIVABLE,
        },
      ]);
      await db.insert(purchasingVendors).values({
        id: vendorId,
        companyId,
        name: "Fixture hosting supplier",
      });
      await db.insert(bankStatementLines).values([
        {
          id: firstLineId,
          companyId,
          accountId: bankId,
          transactionId: firstLineId,
          bookedDate: "2026-11-24",
          currency: "EUR",
          amount: "-120.0000",
        },
        {
          id: lateLineId,
          companyId,
          accountId: bankId,
          transactionId: lateLineId,
          bookedDate: "2026-11-26",
          currency: "EUR",
          amount: "-24.0000",
        },
      ]);

      async function post(
        endpointPath: string,
        input: z.infer<ReturnType<typeof z.json>>,
      ): Promise<Response> {
        const response = await postAtlas(fixtures, endpointPath, input);
        if (response.status !== 429 && response.status !== 503) {
          return response;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 5_000));
        return postAtlas(fixtures, endpointPath, input);
      }
      const bankBillResponse = z.object({
        success: z.literal(true),
        data: z.object({ billId: z.uuid() }),
      });
      async function createDraft(lineId: string): Promise<string> {
        const response = await post("finance/bank/followup", {
          companyId,
          lineId,
          action: "draft",
          vendorId,
          expenseAccountId: expenseId,
          confirm: true,
        });
        expect(response.status).toBe(200);
        return bankBillResponse.parse(await response.json()).data.billId;
      }

      const earlyBillId = await createDraft(firstLineId);
      const lateBillId = await createDraft(lateLineId);
      const fixtureBody = {
        companyId,
        vendorId,
        debitAccountId: expenseId,
        operation: "bill",
        externalReference: "NOV-HOSTING-001",
        description: "Fixture November hosting invoice",
        date: "2026-11-20",
        currency: "EUR",
        grossAmount: "120.0000",
        taxAmount: "20.0000",
        dryRun: false,
      };
      const path = "finance/supplier-evidence";
      const unlinked = await post(path, fixtureBody);
      expect(unlinked.status).toBe(409);
      const invalid = await post(path, {
        ...fixtureBody,
        bankDraftBillId: lateBillId,
      });
      expect(invalid.status).toBe(409);

      const selected = { ...fixtureBody, bankDraftBillId: earlyBillId };
      const preview = await post(path, {
        ...selected,
        dryRun: true,
      });
      expect(preview.status).toBe(200);
      expect(await preview.json()).toMatchObject({
        success: true,
        data: { result: { outcome: "preview", billId: earlyBillId } },
      });
      const [beforeApply] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, earlyBillId));
      expect(beforeApply).toMatchObject({ billNumber: null, taxAmount: 0 });

      const concurrent = await Promise.all([
        post(path, selected),
        post(path, selected),
      ]);
      for (const response of concurrent) {
        expect(response.status).toBe(200);
        expect(await response.json()).toMatchObject({
          success: true,
          data: { result: { billId: earlyBillId } },
        });
      }
      const [early] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, earlyBillId));
      expect(early).toMatchObject({
        billNumber: fixtureBody.externalReference,
        billDate: new Date(fixtureBody.date),
        subtotal: 100,
        taxAmount: 20,
        journalEntryId: null,
        metadata: { originalSupplierInvoicePending: false },
      });

      const { t: billT } = billTranslations.scopedT(E2E_LOCALE);
      const { t: financeT } = financeTranslations.scopedT(E2E_LOCALE);
      await fixtures.gotoReady(
        `/tools/payment-bill-get?arg.billId=${lateBillId}`,
        () =>
          fixtures.page
            .getByRole("button", {
              name: String(billT("widget.linkBankDocument")),
              exact: true,
            })
            .last()
            .waitFor(),
      );
      await fixtures.page
        .getByRole("button", {
          name: String(billT("widget.linkBankDocument")),
          exact: true,
        })
        .last()
        .click();
      await fixtures.page
        .getByText("Fixture hosting supplier", { exact: true })
        .last()
        .waitFor();
      await fixtures.page
        .getByRole("button", {
          name: String(financeT("suppliers.previewBankLink")),
          exact: true,
        })
        .last()
        .waitFor();
      await saveWorkflowScreenshots(fixtures, "bank-bill-link-document");

      const logger = createEndpointLogger(false, E2E_LOCALE);
      const billPath = { billId: lateBillId };
      const received = await BillApproveRepository.approveBill(
        userId,
        billPath,
        logger,
        E2E_LOCALE,
      );
      expect(received).toMatchObject({
        success: true,
        data: { status: BillStatus.RECEIVED, journalEntryId: null },
      });
      const denied = await BillApproveRepository.approveBill(
        userId,
        billPath,
        logger,
        E2E_LOCALE,
      );
      expect(denied.success).toBe(false);
      const approved = await BillApproveRepository.approveBill(
        userId,
        billPath,
        logger,
        E2E_LOCALE,
        { confirmNoSupplierDocument: true },
      );
      expect(approved).toMatchObject({
        success: true,
        data: { status: BillStatus.APPROVED },
      });
      const [posted] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, lateBillId));
      expect(posted).toMatchObject({
        status: BillStatus.APPROVED,
        taxAmount: 0,
        metadata: {
          originalSupplierInvoicePending: true,
          inputVatDeductible: false,
          noSupplierDocumentConfirmedBy: userId,
        },
      });
      expect(posted?.journalEntryId).toBeTruthy();
      if (!posted?.journalEntryId) return;
      const lines = await db
        .select({
          accountId: journalEntryLines.accountId,
          amount: journalEntryLines.amount,
        })
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, posted.journalEntryId));
      expect(lines).toHaveLength(2);
      expect(lines).toEqual(
        expect.arrayContaining([
          { accountId: expenseId, amount: 24 },
          { accountId: payablesId, amount: 24 },
        ]),
      );

      const late = {
        ...fixtureBody,
        date: "2026-11-23",
        externalReference: "NOV-HOSTING-002",
        grossAmount: "24.0000",
        taxAmount: "4.0000",
      };
      const blocked = await SupplierEvidenceRepository.record(
        supplierDefinition.POST.requestSchema.parse(late),
        userId,
        financeT,
        logger,
      );
      expect(blocked.success).toBe(false);
      const attached = await SupplierEvidenceRepository.record(
        supplierDefinition.POST.requestSchema.parse({
          ...late,
          bankDraftBillId: lateBillId,
        }),
        userId,
        financeT,
        logger,
      );
      expect(attached).toMatchObject({
        success: true,
        data: { result: { outcome: "linked", billId: lateBillId } },
      });
      const [linked] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.id, lateBillId));
      expect(linked).toMatchObject({
        billNumber: late.externalReference,
        billDate: new Date("2026-11-26"),
        journalEntryId: posted.journalEntryId,
        subtotal: 24,
        taxAmount: 0,
        metadata: {
          originalSupplierInvoicePending: false,
          supplierDocumentLinkedAfterPosting: true,
          supplierDocumentTaxAmount: "4.0000",
        },
      });
      expect(
        await db
          .select()
          .from(journalEntries)
          .where(
            and(
              eq(journalEntries.companyId, companyId),
              eq(journalEntries.sourceType, JournalSourceType.AP_BILL),
            ),
          ),
      ).toHaveLength(1);
      expect(
        await db
          .select()
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(2);
      expect(
        await db
          .select()
          .from(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId)),
      ).toHaveLength(2);
    },
  );
});
