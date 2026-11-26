import "server-only";

import { mkdir } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import {
  useE2E,
  type E2EFixtures,
} from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import {
  AccountSubtype,
  AccountType,
  LineType,
} from "@/chart-of-accounts/enum";
import {
  postAtlas,
  prepareAtlasCompany,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companyTaxRegimes } from "@/tax/regime/db";
import { CompanyTaxRegime } from "@/tax/regime/enum";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { paymentBillLines, paymentBills } from "../../db";
import { BillStatus } from "../../enum";
import detail from "../[billId]/get/definition";
import { scopedTranslation as detailCopy } from "../[billId]/get/i18n";
import removeDefinition from "./[billId]/[lineId]/remove/definition";
import { scopedTranslation as removeCopy } from "./[billId]/[lineId]/remove/i18n";

const line = {
  description: "Rounded shaft",
  quantity: 1,
  unitPrice: 1.07,
  taxRate: 0.23,
};
const otherLine = { ...line, description: "Rounded coupling" };
const settled = { subtotal: 2.14, taxAmount: 0.5, total: 2.64 };

async function createFixtureBill(
  fixtures: E2EFixtures,
  companyId: string,
): Promise<string> {
  const response = await postAtlas(fixtures, "payment/bill/create", {
    companyId,
    supplierName: "Synthetic hardware supplier",
    currency: "EUR",
    lineItems: [line, otherLine],
  });
  expect(response.ok).toBe(true);
  return z
    .object({ success: z.literal(true), data: z.object({ id: z.uuid() }) })
    .parse(await response.json()).data.id;
}

async function readBill(
  id: string,
): Promise<typeof paymentBills.$inferSelect | undefined> {
  const [bill] = await db
    .select()
    .from(paymentBills)
    .where(eq(paymentBills.id, id));
  return bill;
}

describe("E2E: manual bill line settlement", () => {
  const e2e = useE2E("payment/bill/line/cent-settlement");

  e2e.it(
    "uses exact cents for manual bills and posts deductible VAT or exempt gross, preserving evidence and legacy lines",
    async (fixtures) => {
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        "Synthetic bill settlement",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(companyTaxRegimes)
          .where(eq(companyTaxRegimes.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
      });
      const expenseId = crypto.randomUUID();
      const apId = crypto.randomUUID();
      const vatId = crypto.randomUUID();
      await db.insert(accountNodes).values([
        {
          id: expenseId,
          companyId,
          name: "Expense",
          code: "601",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: apId,
          companyId,
          name: "Payable",
          code: "401",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        },
        {
          id: vatId,
          companyId,
          name: "VAT",
          code: "223",
          type: AccountType.ASSET,
          subtype: AccountSubtype.VAT_RECEIVABLE,
        },
      ]);
      const now = Date.now();
      await db.insert(accountingPeriods).values({
        companyId,
        name: "Synthetic settlement period",
        startDate: new Date(now - 86_400_000),
        endDate: new Date(now + 86_400_000),
      });
      const standardId = await createFixtureBill(fixtures, companyId);
      expect(await readBill(standardId)).toMatchObject({
        ...settled,
        metadata: { lineSettlement: LINE_SETTLEMENT_V1 },
      });
      const [stored] = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, standardId));
      expect(stored).toMatchObject({ taxAmount: 0.25, lineTotal: 1.32 });
      if (!stored) return;
      const add = (billId: string): Promise<Response> =>
        postAtlas(fixtures, "payment/bill/line/add", { billId, ...line });
      const remove = (billId: string, lineId: string): Promise<Response> =>
        postAtlas(fixtures, `payment/bill/line/${billId}/${lineId}/remove`, {});
      expect((await remove(standardId, stored.id)).ok).toBe(true);
      expect(await readBill(standardId)).toMatchObject({
        subtotal: 1.07,
        taxAmount: 0.25,
        total: 1.32,
      });
      expect((await add(standardId)).ok).toBe(true);
      expect(await readBill(standardId)).toMatchObject(settled);

      const approve = async (billId: string): Promise<string> => {
        const path = `payment/bill/${billId}/approve`;
        expect((await postAtlas(fixtures, path, {})).ok).toBe(true);
        const approval = await postAtlas(fixtures, path, {});
        expect(approval.ok).toBe(true);
        return z
          .object({ data: z.object({ journalEntryId: z.uuid() }) })
          .parse(await approval.json()).data.journalEntryId;
      };
      const movements = (journalId: string) =>
        db
          .select({
            accountId: journalEntryLines.accountId,
            type: journalEntryLines.type,
            amount: journalEntryLines.amount,
          })
          .from(journalEntryLines)
          .where(eq(journalEntryLines.journalEntryId, journalId));
      const normal = await movements(await approve(standardId));
      expect(
        normal
          .filter(({ accountId }) => accountId === expenseId)
          .map(({ amount }) => amount),
      ).toEqual([1.07, 1.07]);
      expect(normal).toContainEqual({
        accountId: vatId,
        type: LineType.DEBIT,
        amount: 0.5,
      });
      expect(normal).toContainEqual({
        accountId: apId,
        type: LineType.CREDIT,
        amount: 2.64,
      });
      const [confirmedLine] = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, standardId));
      if (!confirmedLine) return;
      expect((await remove(standardId, confirmedLine.id)).ok).toBe(false);

      await db.insert(companyTaxRegimes).values({
        companyId,
        recordedBy: userId,
        effectiveFrom: new Date().toISOString().slice(0, 10),
        regime: CompanyTaxRegime.DE_SMALL_BUSINESS,
      });
      const exemptId = await createFixtureBill(fixtures, companyId);
      const exempt = await movements(await approve(exemptId));
      expect(
        exempt
          .filter(({ accountId }) => accountId === expenseId)
          .map(({ amount }) => amount),
      ).toEqual([1.32, 1.32]);
      expect(exempt.some(({ accountId }) => accountId === vatId)).toBe(false);
      expect(exempt).toContainEqual({
        accountId: apId,
        type: LineType.CREDIT,
        amount: 2.64,
      });

      for (const totals of [
        { ...settled, subtotal: 2.13 },
        { ...settled, taxAmount: 0.49 },
        { ...settled, total: 2.63 },
      ]) {
        const conflictId = await createFixtureBill(fixtures, companyId);
        await db
          .update(paymentBills)
          .set({ ...totals, status: BillStatus.RECEIVED })
          .where(eq(paymentBills.id, conflictId));
        const response = await postAtlas(
          fixtures,
          `payment/bill/${conflictId}/approve`,
          {},
        );
        expect(response.status).toBe(409);
        expect(await readBill(conflictId)).toMatchObject({
          ...totals,
          status: BillStatus.RECEIVED,
          journalEntryId: null,
        });
      }

      for (const kind of ["legacy", "evidenced", "unallocated"] as const) {
        const id = crypto.randomUUID();
        const metadata =
          kind === "evidenced"
            ? { supplierEvidenceId: crypto.randomUUID() }
            : null;
        await db.insert(paymentBills).values({
          id,
          companyId,
          supplierName: `Supplier ${kind}`,
          currency: "EUR",
          billDate: new Date(),
          status: BillStatus.DRAFT,
          subtotal: 1.07,
          taxAmount: 0.2461,
          total: 1.3161,
          metadata,
        });
        const lineId = crypto.randomUUID();
        if (kind !== "unallocated") {
          await db.insert(paymentBillLines).values({
            id: lineId,
            billId: id,
            ...line,
            taxAmount: 0.2461,
            lineTotal: 1.3161,
          });
        }
        const valid = kind === "legacy";
        expect((await add(id)).ok).toBe(valid);
        if (valid) {
          expect(await readBill(id)).toMatchObject({
            subtotal: 2.14,
            taxAmount: 0.4922,
            total: 2.6322,
            metadata: null,
          });
          expect((await remove(id, confirmedLine.id)).ok).toBe(false);
        }
        expect((await remove(id, lineId)).ok).toBe(valid);
        expect(await readBill(id)).toMatchObject({
          subtotal: 1.07,
          taxAmount: 0.2461,
          total: 1.3161,
          metadata,
        });
      }
      const { page, baseUrl } = fixtures;
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), ...headers },
        });
      });
      await page.setViewportSize({ width: 390, height: 844 });
      const { t } = detailCopy.scopedT(E2E_LOCALE);
      await fixtures.open(detail.GET, {
        query: { billId: standardId },
        ready: async () => {
          await page
            .getByText(t(BillStatus.APPROVED), { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor();
          await page
            .getByText(formatMoney(2.64, "EUR", E2E_LOCALE), { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor();
        },
      });
      const shotDir = "scratchpad/erp/shots/v2/bill-cent-settlement";
      await mkdir(shotDir, { recursive: true });
      await page.screenshot({
        path: `${shotDir}/approved-phone.png`,
        fullPage: true,
      });
    },
  );

  e2e.it(
    "removes the exact line from the phone bill screen and refreshes totals",
    async (fixtures) => {
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "Synthetic bill browser workflow",
      );
      fixtures.cleanup(async () => {
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
      });
      const id = await createFixtureBill(fixtures, companyId);
      const { page, baseUrl } = fixtures;
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), ...headers },
        });
      });
      await page.setViewportSize({ width: 390, height: 844 });
      const { t } = detailCopy.scopedT(E2E_LOCALE);
      const { t: tRemove } = removeCopy.scopedT(E2E_LOCALE);
      await fixtures.open(removeDefinition.POST, {
        query: { billId: id, lineId: crypto.randomUUID() },
        ready: () =>
          page
            .getByText(tRemove("widget.unavailable"), { exact: true })
            .filter({ visible: true })
            .last()
            .waitFor(),
      });
      expect(
        await page
          .getByRole("button", { name: tRemove("widget.submit"), exact: true })
          .count(),
      ).toBe(0);
      const action = page.getByRole("button", {
        name: t("widget.removeLine", { description: line.description }),
        exact: true,
      });
      await fixtures.open(detail.GET, {
        query: { billId: id },
        ready: () => action.waitFor(),
      });
      await page
        .getByText(formatMoney(2.64, "EUR", E2E_LOCALE), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      const shotDir = "scratchpad/erp/shots/v2/bill-cent-settlement";
      await mkdir(shotDir, { recursive: true });
      await page.screenshot({
        path: `${shotDir}/draft-phone.png`,
        fullPage: true,
      });
      await action.click();
      const confirm = page.getByRole("button", {
        name: tRemove("widget.submit"),
        exact: true,
      });
      await confirm.waitFor();
      const dialog = page.getByRole("dialog").last();
      await dialog.getByText(line.description, { exact: true }).waitFor();
      await dialog
        .getByText(
          tRemove("widget.lineGross", {
            amount: formatMoney(1.32, "EUR", E2E_LOCALE),
          }),
          { exact: true },
        )
        .waitFor();
      expect(
        await dialog.getByText(otherLine.description, { exact: true }).count(),
      ).toBe(0);
      await page.screenshot({ path: `${shotDir}/remove-confirm-phone.png` });
      const removed = page.waitForResponse(
        (response) =>
          response.ok() &&
          /\/payment\/bill\/line\/[^/]+\/[^/]+\/remove$/.test(
            new URL(response.url()).pathname,
          ),
      );
      await confirm.click();
      await removed;
      await action.waitFor({ state: "hidden" });
      await page
        .getByRole("button", {
          name: t("widget.removeLine", { description: otherLine.description }),
          exact: true,
        })
        .waitFor();
      await page.screenshot({
        path: `${shotDir}/remaining-lines-phone.png`,
        fullPage: true,
      });
      expect(await readBill(id)).toMatchObject({
        subtotal: 1.07,
        taxAmount: 0.25,
        total: 1.32,
      });
      const remaining = await db
        .select()
        .from(paymentBillLines)
        .where(eq(paymentBillLines.billId, id));
      expect(remaining.map(({ description }) => description)).toEqual([
        otherLine.description,
      ]);
    },
  );
});
