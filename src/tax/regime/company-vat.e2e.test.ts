import {
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { ErrorResponseTypes, fail } from "next-vibe/core/route/response.schema";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles, users } from "next-vibe/identity/user/db";
import { atlasRequest } from "next-vibe/tooling/testing/e2e/atlas-request";
import { authAtlas } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import {
  E2E_LOCALE,
  resolveE2EBaseUrl,
} from "next-vibe/tooling/testing/e2e/config";
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
import { AccountSubtype, LineType } from "@/chart-of-accounts/enum";
import { companies } from "@/companies/db";
import { CompanyType } from "@/companies/enum";
import { paymentBillLines, paymentBills, paymentInvoices } from "@/payment/db";
import { BillStatus, ManualPaymentMethod } from "@/payment/enum";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import taxReportDefinition from "@/tax/report/definition";
import { scopedTranslation as taxTranslation } from "@/tax/i18n";
import { TaxReportDirection } from "@/tax/report/enum";

import { CompanyTaxRegime } from "./enum";
import { scopedTranslation } from "./i18n";

async function readSuccess(
  response: Response,
): Promise<z.infer<ReturnType<typeof z.json>>> {
  const body = z.json().parse(await response.json());
  const status = z
    .object({
      success: z.boolean(),
      errorType: z.object({ errorKey: z.string() }).optional(),
      message: z.string().optional(),
    })
    .safeParse(body);
  expect(
    status.success && status.data.success,
    new URL(response.url).pathname +
      " HTTP " +
      response.status +
      " " +
      (status.success
        ? (status.data.errorType?.errorKey ?? "")
        : "malformed response") +
      " " +
      (status.success ? (status.data.message ?? "") : ""),
  ).toBe(true);
  return body;
}
const ok = <TSchema extends z.ZodType>(data: TSchema) =>
  z.object({ success: z.literal(true), data });
const idResult = z.object({ id: z.uuid() });

describe("Company VAT election and first accounting documents", () => {
  const e2e = useE2E("tax/regime/company-documents");
  e2e.it(
    "sets up a company, issues and settles its exempt invoice and records gross supplier cost and a confirmed reverse charge",
    async (fixtures) => {
      const { page, gotoReady, uniqueEmail, cleanup } = fixtures;
      const email = uniqueEmail("vat-owner");
      const companyName = `E2E tax regime ${crypto.randomUUID()}`;
      cleanup(async () => {
        const [owner] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email));
        if (!owner) return;
        const [owned] = await db
          .select({ id: companies.id })
          .from(companies)
          .where(
            and(
              eq(companies.ownerUserId, owner.id),
              eq(companies.name, companyName),
            ),
          );
        if (owned) {
          await db.transaction(async (tx) => {
            await tx
              .delete(paymentBills)
              .where(eq(paymentBills.companyId, owned.id));
            await tx
              .delete(paymentInvoices)
              .where(eq(paymentInvoices.companyId, owned.id));
            await tx
              .delete(journalEntries)
              .where(eq(journalEntries.companyId, owned.id));
            await tx
              .delete(accountingPeriods)
              .where(eq(accountingPeriods.companyId, owned.id));
            await tx
              .delete(accountNodes)
              .where(eq(accountNodes.companyId, owned.id));
            await tx.delete(companies).where(eq(companies.id, owned.id));
          });
        }
        await deleteTestUser(owner.id);
      });
      const user = await createTestUser(email);
      expect(user.success).toBe(true);
      if (!user.success) return;
      await db
        .insert(userRoles)
        .values({ userId: user.data.user.id, role: UserRole.ADMIN })
        .onConflictDoNothing();
      const identity = { ...user.data.user, roles: [UserRole.ADMIN] };
      const credentials = await authAtlas(fixtures, identity);
      const http = atlasRequest(
        credentials.authorization.slice("Bearer ".length),
        credentials.cookie,
      );
      const api = new URL(
        `/api/${E2E_LOCALE}`,
        resolveE2EBaseUrl() ?? "http://localhost:3000",
      ).href;
      const today = new Date().toISOString().slice(0, 10);
      const start = today.slice(0, 8) + "01";
      const created = await http.post(api + "/companies/create", {
        data: {
          details: {
            name: companyName,
            type: CompanyType.B2B,
            country: "DE",
            currency: "EUR",
          },
        },
      });
      const companyId = ok(z.object({ result: idResult })).parse(
        await readSuccess(created),
      ).data.result.id;
      const onboard = await http.post(`${api}/companies/${companyId}/onboard`, {
        data: {
          country: "DE",
          openFirstPeriod: true,
          periodName: "E2E period",
          periodStart: start,
          periodEnd: today.slice(0, 4) + "-12-31",
        },
      });
      expect(ok(z.object({})).parse(await readSuccess(onboard)).success).toBe(
        true,
      );
      const elect = {
        companyId,
        election: CompanyTaxRegime.DE_SMALL_BUSINESS,
        effectiveFrom: start,
      };
      for (let repeat = 0; repeat < 2; repeat++) {
        const res = await http.post(api + "/tax/regime", {
          data: elect,
        });
        expect(
          ok(
            z.object({
              resultRegime: z.literal(CompanyTaxRegime.DE_SMALL_BUSINESS),
            }),
          ).parse(await readSuccess(res)).success,
        ).toBe(true);
      }
      const lookup = await http.get(api + "/tax/regime", {
        params: { companyId, asOf: today },
      });
      const notice = ok(z.object({ legalNotice: z.string().min(1) })).parse(
        await readSuccess(lookup),
      ).data.legalNotice;
      const line = {
        description: "Consultation",
        quantity: 1,
        unitPrice: 120,
        taxRate: 0,
      };
      const denied = await http.post(api + "/payment/invoice/create", {
        data: { companyId, lineItems: [{ ...line, taxRate: 0.19 }] },
      });
      expect(denied.status).toBe(400);
      expect(
        z.object({ success: z.literal(false) }).parse(await denied.json())
          .success,
      ).toBe(false);
      const sale = await http.post(api + "/payment/invoice/create", {
        data: { companyId, dueDate: today, currency: "EUR", lineItems: [line] },
      });
      const invoiceId = ok(z.object({ invoice: idResult })).parse(
        await readSuccess(sale),
      ).data.invoice.id;
      const issue = await http.post(
        `${api}/payment/invoice/${invoiceId}/send`,
        { data: {} },
      );
      expect(ok(z.object({})).parse(await readSuccess(issue)).success).toBe(
        true,
      );
      const [invoice] = await db
        .select()
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, invoiceId));
      expect(invoice?.notes).toContain(notice);
      expect(invoice?.journalEntryId).toBeTruthy();
      const outstanding = async (): Promise<number> => {
        const aging = await http.get(
          api + "/chart-of-accounts/reports/receivables-aging",
          {
            params: { companyId, currency: "EUR", asOfDate: today },
          },
        );
        return ok(z.object({ totalsTotal: z.number() })).parse(
          await readSuccess(aging),
        ).data.totalsTotal;
      };
      expect(await outstanding()).toBe(120);
      const payment = await http.post(
        `${api}/payment/invoice/${invoiceId}/record-payment`,
        {
          data: {
            amount: 120,
            method: ManualPaymentMethod.BANK_TRANSFER,
            paidAt: today,
            receiptKey: "test-bank-120",
          },
        },
      );
      expect(ok(z.object({})).parse(await readSuccess(payment)).success).toBe(
        true,
      );
      expect(await outstanding()).toBe(0);
      const vendor = await http.post(api + "/payment/bill/create", {
        data: {
          companyId,
          supplierName: "E2E supplier",
          billNumber: "SUP-01",
          billDate: today,
          currency: "EUR",
          lineItems: [
            {
              description: "Service",
              quantity: 1,
              unitPrice: 100,
              taxRate: 0.19,
            },
          ],
        },
      });
      const billId = ok(idResult).parse(await readSuccess(vendor)).data.id;
      const advance = `${api}/payment/bill/${billId}/approve`;
      expect(
        ok(z.object({})).parse(
          await (await http.post(advance, { data: {} })).json(),
        ).success,
      ).toBe(true);
      const approved = await http.post(advance, { data: {} });
      const entryId = ok(z.object({ journalEntryId: z.uuid() })).parse(
        await readSuccess(approved),
      ).data.journalEntryId;
      const movements = await db
        .select({
          subtype: accountNodes.subtype,
          type: journalEntryLines.type,
          amount: journalEntryLines.amount,
        })
        .from(journalEntryLines)
        .innerJoin(
          accountNodes,
          eq(accountNodes.id, journalEntryLines.accountId),
        )
        .where(eq(journalEntryLines.journalEntryId, entryId));
      expect(
        movements.some((m) => m.type === LineType.DEBIT && m.amount === 119),
      ).toBe(true);
      expect(
        movements.some((m) => m.subtype === AccountSubtype.VAT_RECEIVABLE),
      ).toBe(false);
      const foreign = await http.post(api + "/payment/bill/create", {
        data: {
          companyId,
          supplierName: "E2E foreign services",
          billNumber: "SUP-02",
          billDate: today,
          currency: "EUR",
          lineItems: [
            {
              description: "Foreign service",
              quantity: 1,
              unitPrice: 100,
              taxRate: 0,
            },
          ],
        },
      });
      const foreignId = ok(idResult).parse(await readSuccess(foreign)).data.id;
      const approveForeign = `${api}/payment/bill/${foreignId}/approve`;
      expect(
        ok(z.object({})).parse(
          await (await http.post(approveForeign, { data: {} })).json(),
        ).success,
      ).toBe(true);
      const confirmed = await http.post(approveForeign, {
        data: { reverseChargeBase: 100, reverseChargeRatePercent: 19 },
      });
      expect(
        ok(z.object({ journalEntryId: z.uuid() })).parse(
          await readSuccess(confirmed),
        ).success,
      ).toBe(true);
      const report = await http.get(api + "/tax/report", {
        params: { companyId, currency: "EUR", dateFrom: start, dateTo: today },
      });
      const summary = ok(
        z.object({
          totals: z.array(
            z.object({ direction: z.string(), taxAmount: z.number() }),
          ),
        }),
      ).parse(await readSuccess(report)).data.totals;
      expect(
        summary.find((t) => t.direction === TaxReportDirection.REVERSE_CHARGE)
          ?.taxAmount,
      ).toBe(19);
      expect(
        summary.find((t) => t.direction === TaxReportDirection.NON_DEDUCTIBLE)
          ?.taxAmount,
      ).toBe(19);
      expect(
        summary.find((t) => t.direction === TaxReportDirection.SALES)
          ?.taxAmount ?? 0,
      ).toBe(0);
      await page.route(
        (url) => url.pathname.endsWith("/tax/regime"),
        async (route) => {
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: credentials.authorization,
            },
          });
        },
      );
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const loaded = page.waitForResponse(
        (r) =>
          r.request().method() === "GET" &&
          new URL(r.url()).pathname.endsWith("/tax/regime"),
      );
      const regimeName = page
        .getByText(t(CompanyTaxRegime.DE_SMALL_BUSINESS), { exact: true })
        .last();
      await gotoReady(
        "/tools/company-tax-regime-view?arg.companyId=" + companyId,
        () => regimeName.waitFor({ timeout: 18000 }),
      );
      expect((await loaded).ok()).toBe(true);
      await page
        .getByText(notice, { exact: true })
        .last()
        .waitFor({ timeout: 15000 });
      if (process.env["ERP_TAX_VISUALS"] === "1") {
        await saveAdminViewMatrix(
          page,
          "tax",
          "company-tax-regime-view-verified-en",
        );
      }
      await page
        .getByRole("button", { name: t("change"), exact: true })
        .last()
        .click();
      await page
        .getByRole("button", { name: t("save"), exact: true })
        .last()
        .waitFor({ timeout: 12000 });
    },
  );

  e2e.it(
    "keeps no-company state idle and renders real populated VAT headers in German and Slovak",
    async (fixtures) => {
      const { page, baseUrl, cleanup } = fixtures;
      let actorId: string | undefined;
      cleanup(async () => {
        if (actorId) await deleteTestUser(actorId);
      });
      const actor = await createTestUser(
        fixtures.uniqueEmail("vat-visual-owner"),
      );
      expect(actor.success).toBe(true);
      if (!actor.success) return;
      actorId = actor.data.user.id;
      await db
        .insert(userRoles)
        .values({ userId: actorId, role: UserRole.ADMIN })
        .onConflictDoNothing();
      const identity = { ...actor.data.user, roles: [UserRole.ADMIN] };
      await authAtlas(fixtures, identity);
      const initialReports: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        if (url.pathname.endsWith("/tax/report")) {
          initialReports.push(url.searchParams.get("companyId") ?? "");
        }
      });
      const needsCompany = taxTranslation
        .scopedT(E2E_LOCALE)
        .t("report.widget.selectCompany");
      await fixtures.open(taxReportDefinition.GET, {
        ready: () =>
          page
            .getByText(needsCompany, { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor(),
      });
      await page
        .getByText(
          taxTranslation.scopedT(E2E_LOCALE).t("report.widget.scopeHint"),
          { exact: true },
        )
        .waitFor();
      expect(initialReports).toEqual([]);
      if (process.env["ERP_TAX_VISUALS"] === "1") {
        await saveAdminViewMatrix(page, "tax", "vat-report-no-company");
      }
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E VAT localization",
        identity,
      );
      const start = "2026-11-01";
      const today = "2026-11-30";
      const [bill] = await db
        .insert(paymentBills)
        .values({
          companyId,
          supplierName: "VAT localization supplier",
          billNumber: "VAT-LOCALIZED",
          billDate: new Date("2026-11-14"),
          currency: "EUR",
          status: BillStatus.APPROVED,
          subtotal: 100,
          taxAmount: 19,
          total: 119,
          metadata: { inputVatDeductible: false },
        })
        .returning({ id: paymentBills.id });
      await db.insert(paymentBillLines).values({
        billId: bill.id,
        description: "VAT fixture",
        quantity: 1,
        unitPrice: 100,
        taxRate: 0.19,
        taxAmount: 19,
        lineTotal: 119,
      });
      let unavailable = true;
      const outageMessage = taxTranslation
        .scopedT("en-US")
        .t("report.errors.server.title");
      await page.route(
        (url) => url.pathname.endsWith("/tax/report"),
        async (route) => {
          if (unavailable) {
            await route.fulfill({
              status: 503,
              json: fail({
                message: outageMessage,
                errorType: ErrorResponseTypes.INTERNAL_ERROR,
              }),
            });
            return;
          }
          await route.continue({
            headers: {
              ...route.request().headers(),
              authorization: headers.authorization,
            },
          });
        },
      );
      const reportParams = new URLSearchParams({
        "arg.companyId": companyId,
        "arg.currency": "EUR",
        "arg.dateFrom": start,
        "arg.dateTo": today,
      });
      const reportPath = endpointToUrlSegment(taxReportDefinition.GET);
      let reportStatus: number | undefined;
      page.on("response", (response) => {
        if (new URL(response.url()).pathname.endsWith("/tax/report"))
          reportStatus = response.status();
      });
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const localized = taxTranslation.scopedT(locale).t;
        await page.goto(
          `${baseUrl}/${locale}/tools/${reportPath}?${reportParams}`,
          {
            waitUntil: "domcontentloaded",
          },
        );
        const header = page
          .getByRole("columnheader", {
            name: localized("report.response.row.rate"),
            exact: true,
          })
          .first();
        const retry = page.getByRole("button", {
          name: localized("report.widget.retry"),
          exact: true,
        });
        if (locale === "en-US") {
          await page.getByText(outageMessage, { exact: true }).last().waitFor();
          await retry.waitFor();
          expect(reportStatus).toBe(503);
          expect(await header.isVisible()).toBe(false);
          unavailable = false;
          await retry.click();
        }
        for (let attempt = 0; attempt < 3; attempt++) {
          await header.or(retry).first().waitFor({ timeout: 16000 });
          if (await header.isVisible()) break;
          expect([500, 503]).toContain(reportStatus);
          await retry.click();
          await retry
            .waitFor({ state: "hidden", timeout: 5000 })
            .catch(() => undefined);
        }
        for (const key of [
          "report.response.row.rate",
          "report.response.row.taxableAmount",
          "report.response.row.taxAmount",
        ] as const) {
          await page
            .getByRole("columnheader", { name: localized(key), exact: true })
            .first()
            .waitFor({ timeout: 20000 });
        }
        if (locale !== "en-US") {
          expect(
            await page
              .getByRole("columnheader", { name: "Tax amount", exact: true })
              .count(),
          ).toBe(0);
        }
        if (process.env["ERP_TAX_VISUALS"] === "1") {
          await saveAdminViewMatrix(
            page,
            "tax",
            `vat-report-settled-${locale.slice(0, 2)}`,
          );
        }
      }
    },
  );
});
