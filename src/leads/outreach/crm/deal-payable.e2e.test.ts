import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  accountingPeriods,
  accountNodes,
  journalEntries,
} from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType } from "@/chart-of-accounts/enum";
import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as financeTranslation } from "@/finance/i18n";
import { supplierEvidenceRecords } from "@/finance/supplier-evidence/db";
import evidence, {
  type SupplierEvidenceInput,
} from "@/finance/supplier-evidence/definition";
import { paymentBills } from "@/payment/db";
import billDetail from "@/payment/bill/[billId]/get/definition";
import { BillStatus } from "@/payment/enum";
import { purchasingVendors } from "@/purchasing/db";

import { outreachContacts, outreachDeals } from "../db";
import { OutreachDealStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import crm from "./definition";

describe("Creator deal supplier evidence", () => {
  const e2e = useE2E("creator-deal-payable");

  e2e.it(
    "opens supplier evidence from a live creator deal and records one source-backed draft",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "Disposable Creator Studio",
      );
      const paidId = randomUUID();
      const proposedId = randomUUID();
      const contactId = randomUUID();
      const vendorId = randomUUID();
      const expenseId = randomUUID();
      const payableId = randomUUID();
      const creator = "Disposable Creator Fixture";
      const deliverable = "Fixture video sponsorship";
      fixtures.cleanup(async () => {
        await db
          .delete(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId));
        await db
          .delete(paymentBills)
          .where(eq(paymentBills.companyId, companyId));
        await db
          .delete(outreachDeals)
          .where(inArray(outreachDeals.id, [paidId, proposedId]));
        await db
          .delete(outreachContacts)
          .where(eq(outreachContacts.id, contactId));
      });
      await db.insert(outreachContacts).values({
        id: contactId,
        email: `fixture-creator-${contactId}@example.invalid`,
        name: creator,
      });
      await db.insert(outreachDeals).values([
        {
          id: paidId,
          contactId,
          deliverable,
          amountCents: 16240,
          currency: "EUR",
          status: OutreachDealStatus.PAID,
          liveAt: new Date("2026-11-20"),
          paidAt: new Date("2026-11-22"),
        },
        {
          id: proposedId,
          contactId,
          deliverable: "Fixture unconfirmed sponsorship",
          amountCents: 30000,
          currency: "EUR",
          status: OutreachDealStatus.PROPOSED,
        },
      ]);
      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: "Disposable Fixture Vendor" });
      await db.insert(accountNodes).values([
        {
          id: expenseId,
          companyId,
          code: "6711",
          name: "Creator expenses",
          type: AccountType.EXPENSE,
          subtype: AccountSubtype.OPEX,
        },
        {
          id: payableId,
          companyId,
          code: "2200",
          name: "Supplier payables",
          type: AccountType.LIABILITY,
          subtype: AccountSubtype.ACCOUNTS_PAYABLE,
        },
      ]);
      await db.insert(accountingPeriods).values({
        companyId,
        name: "November 2026",
        startDate: new Date("2026-11-01"),
        endDate: new Date("2026-11-30"),
      });

      const input = {
        operation: "sponsorship",
        companyId,
        vendorId,
        externalReference: paidId,
        invoiceReference: "FIXTURE-CREATOR-01",
        grossAmount: "1.00",
        taxAmount: "0",
        currency: "USD",
        debitAccountId: expenseId,
        description: "Wrong operator input",
        dryRun: true,
      } satisfies SupplierEvidenceInput;
      const apiPath = "/api/en-US/finance/supplier-evidence";
      const fixtureOrigin = `${baseUrl}/creator-payable-test-origin`;
      await page.route(
        fixtureOrigin,
        (route) =>
          route.fulfill({ contentType: "text/html", body: "<!doctype html>" }),
        { times: 1 },
      );
      await page.goto(fixtureOrigin);
      const result = async (data: SupplierEvidenceInput) => {
        const response = await page.evaluate(
          async ({ path, payload }) => {
            // oxlint-disable-next-line restricted/no-raw-fetch -- real authenticated Atlas browser fixture using session cookies
            const posted = await fetch(path, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload),
              signal: AbortSignal.timeout(30_000),
            });
            return { status: posted.status, body: await posted.text() };
          },
          { path: apiPath, payload: data },
        );
        expect(response.status).toBe(200);
        return z
          .object({
            success: z.literal(true),
            data: evidence.POST.responseSchema,
          })
          .parse(JSON.parse(response.body)).data.result;
      };
      for (const incomplete of [
        { ...input, invoiceReference: undefined },
        { ...input, taxAmount: undefined },
      ]) {
        expect(await result(incomplete)).toMatchObject({
          outcome: "review",
          grossAmount: "162.40",
          currency: "EUR",
        });
      }
      expect(
        (
          await result({
            ...input,
            externalReference: proposedId,
            dryRun: false,
          })
        ).outcome,
      ).toBe("review");
      expect((await result(input)).outcome).toBe("preview");
      expect(
        await db
          .select()
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(0);

      const crmUrl = `${baseUrl}/api/en-US/leads/outreach/crm`;
      const crmResult = await getAtlasFixture(crmUrl, {}, headers).catch(() =>
        getAtlasFixture(crmUrl, {}, headers),
      );
      expect(crmResult.ok).toBe(true);
      const live = z
        .object({ success: z.literal(true), data: crm.GET.responseSchema })
        .parse(await crmResult.json()).data;
      const deals = live.deals.filter(
        ({ id }) => id === paidId || id === proposedId,
      );
      expect(deals).toHaveLength(2);
      // Browser receives only the two real disposable deal rows. No other outreach contacts or summaries enter the capture.
      await page.route("**/api/*/leads/outreach/crm*", (route) =>
        route.fulfill({
          json: {
            success: true,
            data: {
              ...live,
              summary: {
                ...live.summary,
                total: 0,
                matching: 0,
                answered: 0,
                page: 1,
                pageCount: 1,
                byStatus: [],
              },
              contacts: [],
              angles: [],
              deals,
              dealTotals: [
                { currency: "EUR", paidCents: 16240, committedCents: 0 },
              ],
            },
          },
        }),
      );
      for (const locale of ["de-DE", "sk-SK", "en-US"] as const) {
        const { t } = scopedTranslation.scopedT(locale);
        const { t: finance } = financeTranslation.scopedT(locale);
        await page.setViewportSize({ width: 390, height: 844 });
        const navigation = await page.goto(
          `${baseUrl}/${locale}/tools/${endpointToUrlSegment(crm.GET)}`,
          { waitUntil: "domcontentloaded" },
        );
        expect(navigation?.ok()).toBe(true);
        const cards = page.locator("[data-deal-summary]");
        const paid = cards.filter({ hasText: deliverable });
        const trigger = paid.getByRole("button", {
          name: t("crm.get.widget.deals.prepareBill"),
          exact: true,
        });
        await trigger.waitFor();
        expect(
          await cards
            .filter({ hasText: "Fixture unconfirmed sponsorship" })
            .getByRole("button", {
              name: t("crm.get.widget.deals.prepareBill"),
              exact: true,
            })
            .count(),
        ).toBe(0);
        const amount = new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "EUR",
        }).format(162.4);
        await paid
          .getByText(t("crm.get.widget.deals.columns.status"), { exact: true })
          .waitFor();
        await paid
          .getByText(t("crm.get.widget.deals.columns.spend"), { exact: true })
          .waitFor();
        await paid
          .getByText(t(OutreachDealStatus.PAID), { exact: true })
          .waitFor();
        await paid.getByText(amount, { exact: true }).waitFor();
        await trigger.scrollIntoViewIfNeeded();
        const position = await trigger.boundingBox();
        expect(position?.x ?? -1).toBeGreaterThanOrEqual(0);
        expect(
          (position?.x ?? 390) + (position?.width ?? 1),
        ).toBeLessThanOrEqual(390);
        if (process.env["CREATOR_PAYABLE_SHOTS"] === "1") {
          await saveAdminViewMatrix(
            page,
            "creator-deal-payable",
            `crm-${locale}`,
          );
        }
        await trigger.focus();
        await page.keyboard.press("Enter");
        await page
          .getByText(finance("suppliers.sponsorshipSource"), { exact: true })
          .waitFor();
        await page
          .getByText(deliverable, { exact: true })
          .filter({ visible: true })
          .waitFor();
        await page
          .getByText(amount, { exact: true })
          .filter({ visible: true })
          .waitFor();
        const disclosure = page
          .locator("summary")
          .filter({ hasText: finance("suppliers.reference") });
        const reference = page
          .getByRole("textbox", {
            name: finance("suppliers.reference"),
            exact: true,
          })
          .filter({ visible: true });
        expect(await reference.count()).toBe(0);
        await disclosure.click();
        await reference.waitFor();
        expect(await reference.inputValue()).toBe(paidId);
        await disclosure.click();
        const bankPicker = await page
          .locator("button")
          .filter({ hasText: finance("suppliers.bankDraftBill") })
          .filter({ visible: true })
          .boundingBox();
        expect(bankPicker?.x ?? -1).toBeGreaterThanOrEqual(0);
        expect(
          (bankPicker?.x ?? 390) + (bankPicker?.width ?? 1),
        ).toBeLessThanOrEqual(390);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        if (process.env["CREATOR_PAYABLE_SHOTS"] === "1") {
          await saveAdminViewMatrix(
            page,
            "creator-deal-payable",
            `handoff-${locale}`,
          );
        }
      }

      const { t } = financeTranslation.scopedT("en-US");
      const invoiceNumber = page.getByRole("textbox", {
        name: t("suppliers.invoiceReference"),
        exact: true,
      });
      await invoiceNumber.fill(input.invoiceReference);
      await page
        .getByRole("button", { name: /Select Company/u })
        .filter({ visible: true })
        .last()
        .click();
      await page
        .getByText("Disposable Creator Studio", { exact: true })
        .filter({ visible: true })
        .last()
        .click();
      await page
        .getByRole("button", {
          name: t("suppliers.chooseSupplier"),
          exact: true,
        })
        .click();
      await page
        .getByText("Disposable Fixture Vendor", { exact: true })
        .filter({ visible: true })
        .last()
        .click();
      await page
        .getByRole("button", { name: "Disposable Fixture Vendor", exact: true })
        .waitFor();
      expect(await invoiceNumber.inputValue()).toBe(input.invoiceReference);
      await page
        .getByRole("button", { name: t("suppliers.debit"), exact: true })
        .click();
      await page
        .getByText("Creator expenses", { exact: true })
        .filter({ visible: true })
        .last()
        .click();
      await page
        .getByRole("button", { name: "Creator expenses", exact: true })
        .waitFor();
      expect(await invoiceNumber.inputValue()).toBe(input.invoiceReference);
      await page
        .getByRole("textbox", { name: t("suppliers.tax"), exact: true })
        .fill(input.taxAmount);
      await page
        .getByRole("button", {
          name: t("suppliers.previewEvidence"),
          exact: true,
        })
        .click();
      await page
        .getByText(t("suppliers.outcome.preview"), { exact: true })
        .filter({ visible: true })
        .waitFor();
      const preview = page
        .getByRole("checkbox", { name: t("suppliers.preview"), exact: true })
        .or(
          page.getByRole("switch", {
            name: t("suppliers.preview"),
            exact: true,
          }),
        );
      await preview.filter({ visible: true }).first().click();
      const record = page
        .getByRole("button", { name: t("suppliers.record"), exact: true })
        .filter({ visible: true });
      await record.click();
      const open = page
        .getByRole("button", { name: t("suppliers.openBill"), exact: true })
        .filter({ visible: true })
        .first();
      await open.waitFor();
      const replay = page.waitForResponse(
        (reply) =>
          reply.ok() &&
          reply.request().method() === "POST" &&
          new URL(reply.url()).pathname.endsWith("/finance/supplier-evidence"),
      );
      await record.click();
      const replayed = z
        .object({
          success: z.literal(true),
          data: evidence.POST.responseSchema,
        })
        .parse(await (await replay).json()).data.result;
      expect(replayed.outcome).toBe("replayed");
      await page
        .getByText(t("suppliers.outcome.replayed"), { exact: true })
        .filter({ visible: true })
        .waitFor();
      await open.click();
      await page
        .getByRole("heading", { name: new RegExp(input.invoiceReference) })
        .filter({ visible: true })
        .first()
        .waitFor();
      if (process.env["CREATOR_PAYABLE_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "creator-deal-payable", "draft-en-US");
      }

      const [bill] = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.companyId, companyId));
      expect(bill).toMatchObject({
        total: 162.4,
        currency: "EUR",
        status: BillStatus.DRAFT,
        journalEntryId: null,
      });
      expect(replayed.billId).toBe(bill.id);
      if (process.env["CREATOR_PAYABLE_SHOTS"] === "1") {
        for (const locale of ["de-DE", "sk-SK"] as const) {
          const url = new URL(
            `/${locale}/tools/${endpointToUrlSegment(billDetail.GET)}`,
            baseUrl,
          );
          url.searchParams.set("billId", bill.id);
          const response = await page.goto(url.toString(), {
            waitUntil: "commit",
            timeout: 60_000,
          });
          expect(response?.ok()).toBe(true);
          await page
            .getByRole("heading", { name: new RegExp(input.invoiceReference) })
            .filter({ visible: true })
            .first()
            .waitFor();
          await saveAdminViewMatrix(
            page,
            "creator-deal-payable",
            `draft-${locale}`,
          );
        }
      }
      expect(
        await db
          .select()
          .from(supplierEvidenceRecords)
          .where(eq(supplierEvidenceRecords.companyId, companyId)),
      ).toHaveLength(1);
      expect(
        await db
          .select()
          .from(paymentBills)
          .where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(1);
      expect(
        await db
          .select()
          .from(journalEntries)
          .where(eq(journalEntries.companyId, companyId)),
      ).toHaveLength(0);
    },
  );
});
