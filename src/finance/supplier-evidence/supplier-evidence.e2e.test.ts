import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
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
  JournalSourceType,
  LineType,
} from "@/chart-of-accounts/enum";
import { postAtlasFixture } from "@/payment/accounting/atlas-test-http";
import {
  authAtlas,
  getAtlasFixture,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { ProviderSources } from "../enum";
import { scopedTranslation } from "../i18n";
import { supplierEvidenceRecords, supplierProviderBindings } from "./db";
import definitions, { type SupplierEvidenceInput } from "./definition";

describe("Supplier evidence", () => {
  const e2e = useE2E("finance/supplier-evidence");

  e2e.it(
    "previews, creates, replays and follows the supplier bill and prepaid journal",
    async ({ cleanup, loginAs, context, baseUrl, open, page, capture }) => {
      const admin = await resolveTestAdminUser();
      const companyId = randomUUID();
      const vendorId = randomUUID();
      const debitAccountId = randomUUID();
      const prepaidId = randomUUID();
      const bankId = randomUUID();
      const start = new Date("2026-11-01T00:00:00.000Z");
      const end = new Date("2026-11-30T00:00:00.000Z");
      const date = "2026-11-12";
      const endpoint = `${baseUrl}/api/${E2E_LOCALE}/finance/supplier-evidence`;
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);

      cleanup(async () => {
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db
          .delete(supplierProviderBindings)
          .where(eq(supplierProviderBindings.companyId, companyId));
        await db
          .delete(journalEntries)
          .where(eq(journalEntries.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(accountNodes)
          .where(eq(accountNodes.companyId, companyId));
        await db
          .delete(accountingPeriods)
          .where(eq(accountingPeriods.companyId, companyId));
        await db
          .delete(purchasingVendors)
          .where(eq(purchasingVendors.companyId, companyId));
        await db.delete(companies).where(eq(companies.id, companyId));
        expect(
          await db.select().from(companies).where(eq(companies.id, companyId)),
        ).toEqual([]);
      });

      const bound = await db
        .select({ provider: supplierProviderBindings.provider })
        .from(supplierProviderBindings);
      const provider = ProviderSources.find(
        (key) => !bound.some((row) => row.provider === key),
      );
      expect(provider).toBeDefined();
      if (!provider) {
        return;
      }
      await db.insert(companies).values({
        id: companyId,
        ownerUserId: admin.id,
        name: "E2E Evidence Company",
        type: CompanyType.B2B,
        currency: "EUR",
      });
      await db.insert(companyMembers).values({
        companyId,
        userId: admin.id,
        role: CompanyMemberRole.OWNER,
      });
      await db.insert(purchasingVendors).values({
        id: vendorId,
        companyId,
        name: "E2E Evidence Supplier",
      });
      await db.insert(accountingPeriods).values({
        companyId,
        name: "November 2026",
        startDate: start,
        endDate: end,
      });
      await db.insert(accountNodes).values([
        {
          id: debitAccountId,
          companyId,
          code: "6210",
          name: "Hosting",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: prepaidId,
          companyId,
          code: "1410",
          name: "Prepaid hosting",
          type: AccountType.ASSET,
          subtype: AccountSubtype.PREPAID,
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
      await db.insert(accountNodes).values({
        companyId,
        code: "2200",
        name: "Accounts payable",
        type: AccountType.LIABILITY,
        subtype: AccountSubtype.ACCOUNTS_PAYABLE,
      });
      const authorization = await authAtlas(
        { cleanup, context, baseUrl },
        admin,
      );

      const send = async (
        url: string,
        data: SupplierEvidenceInput | Record<string, never>,
      ) => {
        return await postAtlasFixture(url, {
          data,
          headers: authorization,
        });
      };
      const post = async (data: SupplierEvidenceInput) => {
        const response = await send(endpoint, data);
        expect(response.ok, `Supplier post HTTP ${response.status}`).toBe(true);
        const envelope = z
          .object({
            success: z.literal(true),
            data: z.object({
              result: z.object({
                outcome: z.string(),
                billId: z.uuid().nullable(),
                journalEntryId: z.uuid().nullable(),
              }),
            }),
          })
          .parse(await response.json());
        return envelope.data.result;
      };
      const binding = {
        companyId,
        vendorId,
        operation: "bind",
        provider,
        dryRun: true,
      } satisfies SupplierEvidenceInput;
      expect((await post(binding)).outcome).toBe("preview");
      expect(
        await db
          .select()
          .from(supplierProviderBindings)
          .where(eq(supplierProviderBindings.companyId, companyId)),
      ).toHaveLength(0);
      expect((await post({ ...binding, dryRun: false })).outcome).toBe("bound");

      const data = {
        companyId,
        vendorId,
        operation: "bill",
        externalReference: "HOST-42",
        date,
        grossAmount: "12.0000",
        taxAmount: "2.0000",
        currency: "EUR",
        description: "November hosting service",
        debitAccountId,
        dryRun: true,
      } satisfies SupplierEvidenceInput;
      expect((await post(data)).outcome).toBe("preview");
      expect(
        await db
          .select()
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(0);
      const first = await post({ ...data, dryRun: false });
      const again = await post({
        ...data,
        externalReference: "host-42",
        dryRun: false,
      });
      expect(first.outcome).toBe("bill");
      expect(again.outcome).toBe("replayed");
      expect(again.billId).toBe(first.billId);
      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.companyId, companyId));
      expect(bill?.status).toBe(BillStatus.DRAFT);
      expect(bill?.total).toBe(12);
      expect(bill?.taxAmount).toBe(2);
      expect(bill?.journalEntryId).toBeNull();

      const topup = {
        companyId,
        vendorId,
        operation: "fund",
        provider,
        externalReference: "FUND-42",
        date,
        grossAmount: "30.0000",
        currency: "EUR",
        description: "Prepaid hosting",
        debitAccountId: prepaidId,
        creditAccountId: bankId,
        dryRun: false,
      } satisfies SupplierEvidenceInput;
      expect((await send(endpoint, { ...topup, currency: "USD" })).ok).toBe(
        false,
      );
      const funded = await post(topup);
      const fundedAgain = await post(topup);
      expect(funded.outcome).toBe("posted");
      expect(fundedAgain.journalEntryId).toBe(funded.journalEntryId);
      const entries = await db
        .select()
        .from(journalEntries)
        .where(eq(journalEntries.companyId, companyId));
      const [entry] = entries;
      expect(entries).toHaveLength(1);
      expect(entry?.sourceType).toBe(JournalSourceType.SUPPLIER_EVIDENCE);
      expect(
        await db
          .select()
          .from(journalEntryLines)
          .where(
            and(
              eq(journalEntryLines.journalEntryId, entry?.id ?? randomUUID()),
              eq(journalEntryLines.accountId, prepaidId),
            ),
          ),
      ).toEqual([
        expect.objectContaining({
          amount: 30,
          type: LineType.DEBIT,
          currency: "EUR",
        }),
      ]);

      await open(definitions.GET, {
        query: { companyId },
        ready: async () => {
          await page
            .getByRole("button", { name: t("suppliers.run"), exact: true })
            .waitFor();
        },
      });
      const response = await capture(definitions.GET, () =>
        page
          .getByRole("button", { name: t("suppliers.run"), exact: true })
          .click(),
      );
      expect(response.response.success).toBe(true);
      await page
        .getByText("November hosting service", { exact: true })
        .waitFor();
      await page
        .getByText("E2E Evidence Supplier", { exact: true })
        .first()
        .waitFor();
      await page
        .getByRole("button", { name: t("suppliers.run"), exact: true })
        .waitFor();
      await saveWorkflowScreenshots({ page }, "supplier-evidence");
      await page
        .getByRole("button", { name: t("suppliers.openBill"), exact: true })
        .click();
      await page.getByText("HOST-42", { exact: true }).first().waitFor();

      const draftFunding = {
        ...data,
        operation: "fundBill",
        externalReference: "PREPAID-82",
        grossAmount: "40.0000",
        taxAmount: "0",
        debitAccountId: prepaidId,
        dryRun: false,
      } satisfies SupplierEvidenceInput;
      const draft = await post(draftFunding);
      expect(draft.outcome).toBe("bill");
      expect(draft.journalEntryId).toBeNull();
      expect(
        (
          await send(endpoint, {
            ...topup,
            externalReference: draftFunding.externalReference,
          })
        ).ok,
      ).toBe(false);
      const approveUrl = `${baseUrl}/api/${E2E_LOCALE}/payment/bill/${draft.billId}/approve`;
      expect((await send(approveUrl, {})).ok).toBe(true);
      expect((await send(approveUrl, {})).ok).toBe(true);
      const [approval] = await db
        .select()
        .from(journalEntries)
        .where(
          and(
            eq(journalEntries.companyId, companyId),
            eq(journalEntries.sourceType, JournalSourceType.AP_BILL),
          ),
        );
      expect(approval?.sourceId).toBe(draft.billId);
      expect(
        await db
          .select()
          .from(journalEntryLines)
          .where(
            and(
              eq(
                journalEntryLines.journalEntryId,
                approval?.id ?? randomUUID(),
              ),
              eq(journalEntryLines.accountId, prepaidId),
            ),
          ),
      ).toEqual([
        expect.objectContaining({ amount: 40, type: LineType.DEBIT }),
      ]);

      const monthly = await getAtlasFixture(
        endpoint,
        { companyId, month: "2026-11" },
        authorization,
      );
      expect(monthly.ok).toBe(true);
      expect(await monthly.json()).toMatchObject({
        success: true,
        data: {
          monthly: {
            providerReview: [
              {
                provider,
                receipts: [
                  {
                    currency: "EUR",
                    savedGross: "70.0000",
                    count: 2,
                    postedCount: 2,
                  },
                ],
              },
            ],
          },
        },
      });
    },
  );
});
