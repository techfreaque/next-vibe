import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  createTestUser,
  deleteTestUser,
} from "next-vibe/tooling/testing/testing-suite/test-users";
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
  LineType,
} from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";
import { payoutRequests } from "@/referral/db";
import { PayoutCurrency, PayoutStatus } from "@/referral/enum";
import { scopedTranslation as payoutTranslation } from "@/referral/i18n";

import { scopedTranslation } from "../i18n";
import monthlyProfit from "../monthly-profit/definition";
import { supplierEvidenceRecords } from "./db";
import definition, { type SupplierEvidenceInput } from "./definition";

describe("Documented referral payable", () => {
  const e2e = useE2E("finance/referral-payable");
  e2e.it(
    "links an approved payout once to its recipient's actual supplier document",
    async (fixtures) => {
      const { page } = fixtures;
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Referral Studio",
      );
      await page.route("**/api/*/finance/supplier-evidence", (route) =>
        route.continue({ headers: { ...route.request().headers(), ...headers } }),
      );
      await page.route("**/api/*/payment/bill/*/get*", (route) =>
        route.continue({ headers: { ...route.request().headers(), ...headers } }),
      );
      const other = await prepareAtlasCompany(
        fixtures,
        "E2E Other Referral Studio",
      );
      const otherVendor = randomUUID();
      const payableId = randomUUID();
      const payoutId = randomUUID();
      const vendorId = randomUUID();
      const expenseId = randomUUID();
      const incompatibleVendor = randomUUID();
      const ids: string[] = [];
      fixtures.cleanup(async () => {
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db.delete(payoutRequests).where(eq(payoutRequests.id, payoutId));
        for (const id of ids) await deleteTestUser(id);
      });
      const email = fixtures.uniqueEmail("referral-doc");
      const recipient = await createTestUser(email, "E2E Partner");
      expect(recipient.success).toBe(true);
      if (!recipient.success) return;
      ids.push(recipient.data.user.id);
      await db
        .update(users)
        .set({ emailVerified: true })
        .where(eq(users.id, recipient.data.user.id));
      await db.insert(purchasingVendors).values([
        { id: vendorId, companyId, name: "E2E Design Studio", email },
        {
          id: otherVendor,
          companyId: other.companyId,
          name: "E2E Same Recipient",
          email,
        },
        {
          id: incompatibleVendor,
          companyId,
          name: "E2E Other Studio",
          email: "other@example.invalid",
        },
      ]);
      await db.insert(accountNodes).values({
        id: expenseId,
        companyId,
        code: "6711",
        name: "Referral commissions",
        type: AccountType.EXPENSE,
        subtype: AccountSubtype.OPEX,
      });
      await db.insert(accountNodes).values({
        id: payableId,
        companyId,
        code: "2200",
        name: "Supplier payables",
        type: AccountType.LIABILITY,
        subtype: AccountSubtype.ACCOUNTS_PAYABLE,
      });
      await db.insert(accountingPeriods).values({
        companyId,
        name: "November 2026",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });
      await db.insert(payoutRequests).values({
        id: payoutId,
        userId: recipient.data.user.id,
        currency: PayoutCurrency.USDC,
        status: PayoutStatus.PENDING,
        amountCents: 7320,
      });
      const input = {
        operation: "referral",
        companyId,
        vendorId,
        externalReference: payoutId,
        invoiceReference: "E2E-REF-22",
        grossAmount: "64.15",
        taxAmount: "0",
        currency: "EUR",
        date: "2026-11-24",
        debitAccountId: expenseId,
        description: "Documented referral commission",
        dryRun: true,
      } satisfies SupplierEvidenceInput;
      const send = (data: SupplierEvidenceInput) =>
        postAtlas(fixtures, "finance/supplier-evidence", data);
      const result = async (response: Response) => {
        expect(response.ok).toBe(true);
        return z
          .object({
            success: z.literal(true),
            data: definition.POST.responseSchema,
          })
          .parse(await response.json()).data.result;
      };
      expect((await result(await send(input))).outcome).toBe("review");
      await db
        .update(payoutRequests)
        .set({
          status: PayoutStatus.APPROVED,
          currency: PayoutCurrency.CREDITS,
        })
        .where(eq(payoutRequests.id, payoutId));
      expect((await result(await send(input))).outcome).toBe("review");
      await db
        .update(payoutRequests)
        .set({ currency: PayoutCurrency.USDC })
        .where(eq(payoutRequests.id, payoutId));
      expect(
        (await result(await send({ ...input, grossAmount: undefined })))
          .outcome,
      ).toBe("review");
      expect((await send({ ...input, vendorId: incompatibleVendor })).ok).toBe(
        false,
      );
      expect((await result(await send(input))).outcome).toBe("preview");
      expect(
        await db
          .select({ id: paymentBills.id })
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(0);
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const { t: tp } = payoutTranslation.scopedT(locale);
        await fixtures.goto(
          "/tools/referral/admin/payouts/GET?arg.requestId=" + payoutId,
          locale,
        );
        await page
          .getByRole("button", {
            name: tp("admin.payouts.widget.prepareBill"),
            exact: true,
          })
          .click();
        await page
          .getByText(t("suppliers.referralHint"), { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        expect(
          await page
            .getByRole("textbox", {
              name: t("suppliers.reference"),
              exact: true,
            })
            .filter({ visible: true })
            .inputValue(),
        ).toBe(payoutId);
      }
      const { t } = scopedTranslation.scopedT("en-US");
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(input))
        params.set("arg." + key, String(value));
      await fixtures.gotoReady(
        "/tools/supplier-evidence-record?" + params,
        () =>
          page
            .getByRole("button", {
              name: t("suppliers.previewEvidence"),
              exact: true,
            })
            .waitFor(),
      );
      await page
        .getByRole("button", {
          name: t("suppliers.previewEvidence"),
          exact: true,
        })
        .click();
      const preview = page
        .getByText(t("suppliers.outcome.preview"), { exact: true })
        .filter({ visible: true });
      await preview.waitFor();
      const toggle = page
        .getByRole("checkbox", { name: t("suppliers.preview"), exact: true })
        .or(
          page.getByRole("switch", {
            name: t("suppliers.preview"),
            exact: true,
          }),
        );
      await toggle.filter({ visible: true }).first().click();
      await page
        .getByRole("button", { name: t("suppliers.record"), exact: true })
        .filter({ visible: true })
        .click();
      const open = page
        .getByRole("button", { name: t("suppliers.openBill"), exact: true })
        .filter({ visible: true })
        .first();
      await open.waitFor();
      await open.click();
      await page
        .getByRole("heading", { name: new RegExp(input.invoiceReference) })
        .filter({ visible: true })
        .first()
        .waitFor();
      await saveAdminViewMatrix(
        page,
        "referral",
        "documented-payable-verified-en",
      );
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.companyId, companyId));
      expect(bill?.supplierName).toBe("E2E Design Studio");
      expect(bill?.total).toBe(64.15);
      expect(bill?.currency).toBe("EUR");
      expect(bill?.status).toBe(BillStatus.DRAFT);
      expect(bill?.journalEntryId).toBeNull();
      expect(
        (await result(await send({ ...input, dryRun: false }))).billId,
      ).toBe(bill.id);
      expect(
        (await send({ ...input, dryRun: false, grossAmount: "65.15" })).status,
      ).toBe(409);
      expect(
        await db
          .select({ id: supplierEvidenceRecords.id })
          .from(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId)),
      ).toHaveLength(1);
      expect(
        await db
          .select({ id: journalEntries.id })
          .from(journalEntries)
          .where(eq(journalEntries.companyId, companyId)),
      ).toHaveLength(0);
      const [payout] = await db
        .select({
          status: payoutRequests.status,
          amount: payoutRequests.amountCents,
        })
        .from(payoutRequests)
        .where(eq(payoutRequests.id, payoutId));
      expect(payout).toEqual({ status: PayoutStatus.APPROVED, amount: 7320 });
      expect(
        (
          await send({
            ...input,
            companyId: other.companyId,
            vendorId: otherVendor,
            dryRun: false,
          })
        ).status,
      ).toBe(409);
      const approvePath = "payment/bill/" + bill.id + "/approve";
      expect((await postAtlas(fixtures, approvePath, {})).ok).toBe(true);
      expect((await postAtlas(fixtures, approvePath, {})).ok).toBe(true);
      const [entry] = await db
        .select({ id: journalEntries.id })
        .from(journalEntries)
        .where(eq(journalEntries.companyId, companyId));
      const lines = await db
        .select({
          account: journalEntryLines.accountId,
          side: journalEntryLines.type,
          currency: journalEntryLines.currency,
          amount: journalEntryLines.amount,
        })
        .from(journalEntryLines)
        .where(eq(journalEntryLines.journalEntryId, entry.id));
      expect(lines).toHaveLength(2);
      expect(lines).toContainEqual({
        account: expenseId,
        side: LineType.DEBIT,
        currency: "EUR",
        amount: 64.15,
      });
      expect(lines).toContainEqual({
        account: payableId,
        side: LineType.CREDIT,
        currency: "EUR",
        amount: 64.15,
      });
      const report = await getAtlasFixture(
        fixtures.baseUrl + "/api/en-US/finance/monthly-profit",
        { companyId, month: "2026-11" },
        headers,
      );
      const parsed = z
        .object({
          success: z.literal(true),
          data: monthlyProfit.GET.responseSchema,
        })
        .parse(await report.json());
      const eur = parsed.data.report.currencies.find(
        (row) => row.currency === "EUR",
      );
      expect(
        Number(
          eur?.expenseAreas.find((row) => row.area === "referral")?.expense,
        ),
      ).toBe(64.15);
      expect(Number(eur?.net)).toBe(-64.15);
    },
    210000,
  );
});
