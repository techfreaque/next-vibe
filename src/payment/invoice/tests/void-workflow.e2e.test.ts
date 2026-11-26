import { randomUUID } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { createEndpointLogger } from "next-vibe/logger/server";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatDocDate, formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountNodes, accountingPeriods, journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType, JournalEntryStatus, JournalSourceType, LineType } from "@/chart-of-accounts/enum";
import agingDefinition from "@/chart-of-accounts/reports/receivables-aging/definition";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { CreditNoteCreateRepository } from "@/payment/credit-note/create/repository";
import { paymentInvoiceLines, paymentInvoices } from "@/payment/db";
import { InvoiceStatus, ManualPaymentMethod } from "@/payment/enum";

import invoiceDefinition from "../[invoiceId]/get/definition";
import { InvoiceRecordPaymentRepository } from "../[invoiceId]/record-payment/repository";
import { InvoiceSendRepository } from "../[invoiceId]/send/repository";
import { scopedTranslation } from "../[invoiceId]/void/i18n";

const agingResponse = z.object({
  success: z.literal(true),
  data: agingDefinition.GET.responseSchema,
});
const invoiceResponse = z.object({
  success: z.literal(true),
  data: invoiceDefinition.GET.responseSchema,
});

describe("Manual invoice void on Atlas", () => {
  const e2e = useE2E("payments/invoice-void");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`voids an issued invoice through the browser in ${locale}`, async (fixture) => {
      const { baseUrl, cleanup, page } = fixture;
      const actor = await createTestUser(fixture.uniqueEmail("invoice-void"));
      expect(actor.success).toBe(true);
      if (!actor.success) return;
      const owner = {
        ...actor.data.user,
        roles: [UserPermissionRole.ADMIN, ...actor.data.user.roles],
      };
      cleanup(async () => { await deleteTestUser(owner.id); });
      await db.insert(userRoles).values({ userId: owner.id, role: UserPermissionRole.ADMIN });
      const { companyId, headers } = await prepareAtlasCompany(fixture, "Fixture Invoice Books", owner);
      cleanup(async () => { await db.delete(paymentInvoices).where(eq(paymentInvoices.companyId, companyId)); });

      const now = new Date();
      const year = now.getUTCFullYear();
      const month = now.getUTCMonth();
      await db.insert(accountingPeriods).values({
        companyId,
        name: "Fixture accounting month",
        startDate: new Date(Date.UTC(year, month, 1)),
        endDate: new Date(Date.UTC(year, month + 1, 0)),
      });
      const ar = randomUUID();
      const revenue = randomUUID();
      const bank = randomUUID();
      await db.insert(accountNodes).values([
        { id: ar, companyId, code: "1100", name: "Fixture receivables", type: AccountType.ASSET, subtype: AccountSubtype.ACCOUNTS_RECEIVABLE },
        { id: bank, companyId, code: "1120", name: "Fixture bank", type: AccountType.ASSET, subtype: AccountSubtype.BANK },
        { id: revenue, companyId, code: "4100", name: "Fixture service revenue", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SERVICE },
      ]);
      const logger = createEndpointLogger(false, locale);
      const issue = async (invoiceNumber: string): Promise<string> => {
        const invoiceId = randomUUID();
        await db.insert(paymentInvoices).values({
          id: invoiceId,
          userId: owner.id,
          companyId,
          invoiceNumber,
          providerInvoiceId: `manual-fixture-${invoiceId}`,
          status: InvoiceStatus.DRAFT,
          currency: "EUR",
          amount: "120.00",
          dueDate: now,
          metadata: { customerName: "Fixture Customer" },
        });
        await db.insert(paymentInvoiceLines).values({
          invoiceId,
          description: "Fixture design service",
          quantity: 1,
          unitPrice: 120,
          lineTotal: 120,
        });
        const result = await InvoiceSendRepository.sendInvoice(owner.id, { invoiceId }, logger, locale);
        expect(result.success).toBe(true);
        return invoiceId;
      };

      const invoiceNumber = "INV-VOID-104";
      const id = await issue(invoiceNumber);
      const path = `/api/${locale}/payment/invoice/${id}`;
      const agingUrl = `${baseUrl}/api/${locale}/chart-of-accounts/reports/receivables-aging`;
      const readAging = async (): Promise<number> => {
        const report = await getAtlasFixture(agingUrl, { companyId, currency: "EUR" }, headers);
        expect(report.status).toBe(200);
        return agingResponse.parse(await report.json()).data.totalsTotal;
      };
      const [original] = await db.select().from(journalEntries)
        .where(and(eq(journalEntries.sourceId, id), eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE)));
      expect(original?.status).toBe(JournalEntryStatus.POSTED);
      if (!original) return;
      const getOriginalLines = async () => await db.select().from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, original.id)).orderBy(journalEntryLines.id);
      const originalLines = await getOriginalLines();
      expect(originalLines).toHaveLength(2);
      expect(await readAging()).toBe(120);

      const journalPath = (entryId: string): string =>
        `/api/${locale}/chart-of-accounts/journal/${entryId}/get`;
      const protectedPaths = new Set([`${path}/get`, `${path}/void`, journalPath(original.id), `/api/${locale}/payment/invoice/list`]);
      const origin = new URL(baseUrl).origin;
      await page.route(
        (url) => url.origin === origin && protectedPaths.has(url.pathname),
        async (route) => {
          await route.continue({
            headers: { ...route.request().headers(), authorization: headers.authorization },
          });
        },
      );
      const { t: invoiceT } = invoiceDefinition.GET.scopedTranslation.scopedT(locale);
      const { t } = scopedTranslation.scopedT(locale);
      const short = locale.slice(0, 2);
      await fixture.goto(`/tools/payment-invoice-get?arg.invoiceId=${id}`, locale);
      await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
      const voidAction = page.getByRole("button", { name: invoiceT("widget.void"), exact: true });
      await voidAction.click();
      const dialog = page.getByRole("dialog");
      const invoiceTotal = formatMoney(120, "EUR", locale);
      const confirmReady = async (): Promise<void> => {
        await dialog.getByText(invoiceNumber, { exact: true }).waitFor();
        await dialog.getByText(invoiceTotal, { exact: true }).waitFor();
        await dialog.getByText(t("widget.reversal"), { exact: true }).waitFor();
      };
      await confirmReady();
      if (process.env["INVOICE_VOID_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "documents", `invoice-void-confirm-${short}`, confirmReady);
      }

      const [voided] = await Promise.all([
        page.waitForResponse((response) => response.request().method() === "POST" &&
          new URL(response.url()).pathname === `${path}/void`, { timeout: 45_000 }),
        dialog.getByRole("button", { name: t("widget.submit"), exact: true }).click(),
      ]);
      expect(voided.status()).toBe(200);
      expect(await voided.json()).toMatchObject({ success: true, data: { success: true } });
      await dialog.waitFor({ state: "hidden" });
      const reversals = () => db.select().from(journalEntries).where(eq(journalEntries.reversalOfId, original.id));
      const [reversal] = await reversals();
      expect(reversal).toBeDefined();
      if (!reversal) return;
      protectedPaths.add(journalPath(reversal.id));
      const journalOriginal = page.getByRole("button", { name: invoiceT("widget.viewOriginalJournal") });
      const journalReversal = page.getByRole("button", { name: invoiceT("widget.viewVoidReversal") });
      const finalReady = async (): Promise<void> => {
        await page.getByText(invoiceT("widget.status.void"), { exact: true }).first().waitFor();
        await page.getByText(invoiceNumber, { exact: true }).first().waitFor();
        const balance = page
          .getByText(invoiceT("widget.remainingBalance"), { exact: true })
          .locator("xpath=../../..");
        await balance.getByText(formatMoney(0, "EUR", locale), { exact: true }).first().waitFor();
        await balance.getByText(invoiceT("widget.originalTotal"), { exact: true }).waitFor();
        await balance.getByText(invoiceTotal, { exact: true }).first().waitFor();
        await balance.getByText(invoiceT("widget.voidReversalDate"), { exact: true }).waitFor();
        await balance.getByText(formatDocDate(reversal.date, locale), { exact: true }).waitFor();
        await journalOriginal.getByText(original.entryNumber, {exact:true}).waitFor();
        const entryReference=journalReversal.getByText(reversal.entryNumber, {exact:true});
        await entryReference.waitFor();
        expect(await entryReference.evaluate((el)=>{
          const range=el.ownerDocument.createRange();
          range.selectNodeContents(el);
          return range.getClientRects().length;
        })).toBe(1);
      };
      await finalReady();
      if (process.env["INVOICE_VOID_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "documents", `invoice-void-r44-final-${short}`, finalReady);
      }

      const after = await getAtlasFixture(`${baseUrl}${path}/get`, {}, headers);
      expect(after.status).toBe(200);
      expect(invoiceResponse.parse(await after.json()).data).toMatchObject({
        status: InvoiceStatus.VOID,
        amountDue: 0,
        journalEntryId: original.id,
        voidReversal: {
          originalEntryNumber: original.entryNumber,
          entryId: reversal.id,
          entryNumber: reversal.entryNumber,
          effectiveDate: reversal.date,
        },
      });
      expect(await readAging()).toBe(0);
      const [updatedOriginal] = await db.select().from(journalEntries).where(eq(journalEntries.id, original.id));
      expect(updatedOriginal).toMatchObject({
        id: original.id,
        periodId: original.periodId,
        entryNumber: original.entryNumber,
        date: original.date,
        description: original.description,
        sourceId: original.sourceId,
        status: JournalEntryStatus.REVERSED,
      });
      expect(await getOriginalLines()).toEqual(originalLines);

      expect(reversal.id).toBe(updatedOriginal?.reversedById);
      expect(reversal.id).not.toBe(original.id);
      expect(reversal.status).toBe(JournalEntryStatus.POSTED);
      const legs = await db.select().from(journalEntryLines).where(eq(journalEntryLines.journalEntryId, reversal.id));
      expect(legs).toHaveLength(originalLines.length);
      const signedCents = (line: (typeof legs)[number]): number =>
        Math.round(line.amount * 100) * (line.type === LineType.DEBIT ? 1 : -1);
      expect(legs.reduce((total, line) => total + signedCents(line), 0)).toBe(0);
      expect([...originalLines, ...legs]
        .filter(({ accountId }) => accountId === ar)
        .reduce((total, line) => total + signedCents(line), 0)).toBe(0);
      for (const line of originalLines) {
        expect(legs).toContainEqual(expect.objectContaining({
          accountId: line.accountId,
          amount: line.amount,
          currency: line.currency,
          type: line.type === LineType.DEBIT ? LineType.CREDIT : LineType.DEBIT,
        }));
      }
      const replay = await postAtlas(fixture, `payment/invoice/${id}/void`, {});
      expect(replay.status).toBe(200);
      expect(await replay.json()).toMatchObject({ success: true, data: { success: true } });
      expect(await reversals()).toHaveLength(1);

      for (const [button, entry] of [[journalOriginal, original], [journalReversal, reversal]] as const) {
        const [journal] = await Promise.all([
          page.waitForResponse((response) => response.request().method() === "GET" &&
            new URL(response.url()).pathname === journalPath(entry.id), { timeout: 25_000 }),
          button.click(),
        ]);
        expect(journal.status()).toBe(200);
        await page.getByRole("heading", { name: entry.entryNumber, exact: true }).waitFor();
        await page.goBack({ waitUntil: "commit" });
        await finalReady();
      }
      await fixture.goto(`/tools/payment-invoice-get?arg.invoiceId=${id}`, locale);
      await page.locator('#admin-tools-toolbar[data-admin-ready="true"]').waitFor();
      await page.getByRole("button", { name: invoiceT("widget.backToInvoiceList"), exact: true }).click();
      await page.waitForURL((url) => url.pathname.endsWith("/tools/payment-invoice-list"));

      if (locale === "en-US") {
        const paidId = await issue("INV-PARTIAL-105");
        const creditedId = await issue("INV-CREDIT-106");
        const receipt = await InvoiceRecordPaymentRepository.recordPayment(
          owner.id, { invoiceId: paidId }, { amount: 10, method: ManualPaymentMethod.BANK_TRANSFER, accountNodeId: bank },
          logger, locale,
        );
        expect(receipt.success).toBe(true);
        const credit = await CreditNoteCreateRepository.createCreditNote(
          owner.id,
          {
            invoiceId: creditedId,
            companyId,
            reason: "Fixture partial adjustment",
            lineItems: [{ description: "Partial credit", quantity: 1, unitPrice: 10, taxRate: 0 }],
          },
          logger, locale,
        );
        expect(credit.success).toBe(true);
        for (const invoiceId of [paidId, creditedId]) {
          const denied = await postAtlas(fixture, `payment/invoice/${invoiceId}/void`, {});
          expect(denied.status).toBe(409);
          expect(await denied.json()).toMatchObject({
            success: false,
            message: t("post.errors.appliedPayments"),
          });
          const [unchanged] = await db.select().from(paymentInvoices).where(eq(paymentInvoices.id, invoiceId));
          expect(unchanged?.status).toBe(InvoiceStatus.OPEN);
          const originals = await db.select().from(journalEntries).where(and(
            eq(journalEntries.sourceId, invoiceId),
            eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
          ));
          expect(originals).toMatchObject([{ status: JournalEntryStatus.POSTED, reversedById: null }]);
        }
        expect(await readAging()).toBe(220);
      }
    }, 150_000);
  }
});
