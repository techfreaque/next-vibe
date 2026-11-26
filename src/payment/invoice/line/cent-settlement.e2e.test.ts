import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { defaultLocale } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { createTestSessionToken } from "next-vibe/tooling/testing/e2e/auth";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountNodes,
  accountingPeriods,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { postAtlasFixture } from "../../accounting/atlas-test-http";
import { paymentInvoiceLines, paymentInvoices } from "../../db";

describe("E2E: invoice settlement and partial credits", () => {
  const e2e = useE2E("payment/invoice/line/cent-settlement");

  e2e.it(
    "persists draft lines, issues settled totals and credits both rounded lines without exceeding caps",
    async ({ baseUrl, cleanup, uniqueEmail, page, loginAs }) => {
      const companyId = crypto.randomUUID();
      let userId: string | undefined;
      cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        await db
          .delete(journalEntryLines)
          .where(
            inArray(
              journalEntryLines.journalEntryId,
              db
                .select({ id: journalEntries.id })
                .from(journalEntries)
                .where(eq(journalEntries.companyId, companyId)),
            ),
          );
        await db
          .delete(journalEntries)
          .where(eq(journalEntries.companyId, companyId));
        await db
          .delete(accountNodes)
          .where(eq(accountNodes.companyId, companyId));
        await db
          .delete(accountingPeriods)
          .where(eq(accountingPeriods.companyId, companyId));
        await db
          .delete(companyMembers)
          .where(eq(companyMembers.companyId, companyId));
        await db.delete(companies).where(eq(companies.id, companyId));
        if (userId) await deleteTestUser(userId);
      });
      const user = await createTestUser(uniqueEmail("invoice-cent-settlement"));
      expect(user.success).toBe(true);
      if (!user.success) return;
      userId = user.data.user.id;
      await db.insert(userRoles).values({ userId, role: UserRole.ADMIN });
      const identity = {
        ...user.data.user,
        roles: [...user.data.user.roles, UserRole.ADMIN],
      };
      await loginAs(identity);
      const token = await createTestSessionToken(identity);
      expect(token.success).toBe(true);
      if (!token.success) return;
      const headers = { authorization: `Bearer ${token.data}` };
      await db.insert(companies).values({
        id: companyId,
        ownerUserId: userId,
        name: "Settlement fixture",
        type: CompanyType.B2B,
        currency: "PLN",
      });
      await db.insert(companyMembers).values({
        companyId,
        userId,
        role: CompanyMemberRole.OWNER,
      });
      const arId = crypto.randomUUID();
      const revenueId = crypto.randomUUID();
      const vatId = crypto.randomUUID();
      await db.insert(accountNodes).values([
        {
          id: arId,
          companyId,
          name: "Receivable",
          code: "201",
          type: AccountType.ASSET,
          subtype: AccountSubtype.ACCOUNTS_RECEIVABLE,
        },
        {
          id: revenueId,
          companyId,
          name: "Revenue",
          code: "701",
          type: AccountType.REVENUE,
          subtype: AccountSubtype.REVENUE_SALES,
        },
        {
          id: vatId,
          companyId,
          name: "VAT",
          code: "221",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.VAT_PAYABLE,
        },
      ]);
      const now = Date.now();
      await db.insert(accountingPeriods).values({
        companyId,
        name: "Settlement fixture",
        startDate: new Date(now - 86_400_000),
        endDate: new Date(now + 86_400_000),
      });

      const api = `${baseUrl}/api/${defaultLocale}/payment`;
      const post = (
        path: string,
        data: z.infer<ReturnType<typeof z.json>>,
      ): Promise<Response> =>
        postAtlasFixture(`${api}/${path}`, { data, headers });
      const line = {
        description: "Catalogue page",
        quantity: 1,
        unitPrice: 1.07,
        taxRate: 0.23,
      };
      const created = await post("invoice/create", {
        companyId,
        lineItems: [line, line],
      });
      expect(created.ok).toBe(true);
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.companyId, companyId));
      expect(invoice).toMatchObject({
        amount: "2.64",
        currency: "PLN",
        metadata: { lineSettlement: LINE_SETTLEMENT_V1 },
      });
      if (!invoice) return;
      const lines = await db
        .select()
        .from(paymentInvoiceLines)
        .where(eq(paymentInvoiceLines.invoiceId, invoice.id))
        .orderBy(paymentInvoiceLines.sortOrder);
      expect(lines).toHaveLength(2);
      for (const originalLine of lines) {
        expect(originalLine).toMatchObject({
          taxAmount: 0.25,
          lineTotal: 1.32,
        });
      }
      const removed = lines[0];
      if (!removed) return;
      expect((await post(`invoice/line/${removed.id}/remove`, {})).ok).toBe(
        true,
      );
      expect(
        (
          await db
            .select({ amount: paymentInvoices.amount })
            .from(paymentInvoices)
            .where(eq(paymentInvoices.id, invoice.id))
        )[0]?.amount,
      ).toBe("1.32");
      expect(
        (await post("invoice/line/add", { invoiceId: invoice.id, ...line })).ok,
      ).toBe(true);
      expect((await post(`invoice/${invoice.id}/send`, {})).ok).toBe(true);
      const bookedFor = (sourceId: string) =>
        db
          .select({
            account: journalEntryLines.accountId,
            amount: journalEntryLines.amount,
            type: journalEntryLines.type,
          })
          .from(journalEntryLines)
          .innerJoin(
            journalEntries,
            eq(journalEntryLines.journalEntryId, journalEntries.id),
          )
          .where(
            and(
              eq(journalEntries.sourceId, sourceId),
              eq(journalEntries.sourceType, JournalSourceType.AR_INVOICE),
            ),
          )
          .orderBy(journalEntryLines.sortOrder);
      expect(await bookedFor(invoice.id)).toEqual([
        { account: arId, amount: 2.64, type: LineType.DEBIT },
        { account: revenueId, amount: 2.14, type: LineType.CREDIT },
        { account: vatId, amount: 0.5, type: LineType.CREDIT },
      ]);

      const credit = (description: string): Promise<Response> =>
        post("credit-note/create", {
          companyId,
          invoiceId: invoice.id,
          reason: description,
          lineItems: [{ ...line, description, taxRate: 23 }],
        });
      expect((await credit("First catalogue page")).ok).toBe(true);
      expect((await credit("Second catalogue page")).ok).toBe(true);
      expect((await credit("Excess catalogue page")).ok).toBe(false);
      const notes = (
        await db
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId))
      ).filter((document) => document.id !== invoice.id);
      expect(notes).toHaveLength(2);
      for (const note of notes) {
        expect(note).toMatchObject({
          amount: "-1.32",
          currency: "PLN",
          metadata: {
            originalInvoiceId: invoice.id,
            lineSettlement: LINE_SETTLEMENT_V1,
          },
        });
        expect(await bookedFor(note.id)).toEqual([
          { account: arId, amount: 1.32, type: LineType.CREDIT },
          { account: revenueId, amount: 1.07, type: LineType.DEBIT },
          { account: vatId, amount: 0.25, type: LineType.DEBIT },
        ]);
      }

      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), ...headers },
        });
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(
        `${baseUrl}/${defaultLocale}/tools/payment-invoice-get?invoiceId=${invoice.id}`,
      );
      await page
        .getByText(formatMoney(2.64, "PLN", defaultLocale), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      await page
        .getByText(line.description, { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      await page
        .getByText(formatMoney(1.32, "PLN", defaultLocale), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
    },
  );
});
