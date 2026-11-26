import { and, eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userAddresses, userRoles, users } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { scopedTranslation as statementsTranslation } from "@/chart-of-accounts/reports/statutory-statements/i18n";
import { companies } from "@/companies/db";
import { paymentInvoiceLines, paymentInvoices } from "@/payment/db";
import { scopedTranslation as fiscalTranslation } from "@/pos/fiscal/i18n";
import { taxRates } from "@/tax/db";

import { companyTaxRegimes } from "../regime/db";
import { CompanyTaxRegime } from "../regime/enum";
import { ComplianceIssue, VatTreatment } from "./enum";
import { scopedTranslation as vatReturnTranslation } from "../vat-return/i18n";
import { scopedTranslation as complianceTranslation } from "./i18n";
import { readLegalSnapshot } from "./legal-snapshot";

const envelope = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.json().optional(),
});

async function body(
  response: Response,
): Promise<z.infer<typeof envelope>> {
  return envelope.parse(await response.json());
}

describe("Slovak company: SK VAT, reverse charge, VAT return", () => {
  const e2e = useE2E("tax/compliance/sk-company");
  e2e.it(
    "issues SK VAT and reverse charge invoices and prepares the DPH return and KV DPH",
    async (fixtures) => {
      const { companyId, headers } = await prepareAtlasCompany(
        fixtures,
        `E2E SK ${crypto.randomUUID().slice(0, 8)}`,
      );
      const domesticCustomerId = crypto.randomUUID();
      const euCustomerId = crypto.randomUUID();
      const customerIds = [domesticCustomerId, euCustomerId];
      fixtures.cleanup(async () => {
        const invoices = await db
          .select({ id: paymentInvoices.id })
          .from(paymentInvoices)
          .where(eq(paymentInvoices.companyId, companyId));
        if (invoices.length > 0) {
          await db.delete(paymentInvoiceLines).where(
            inArray(
              paymentInvoiceLines.invoiceId,
              invoices.map((invoice) => invoice.id),
            ),
          );
          await db
            .delete(paymentInvoices)
            .where(eq(paymentInvoices.companyId, companyId));
        }
        await db.delete(taxRates).where(eq(taxRates.companyId, companyId));
        await db
          .delete(companyTaxRegimes)
          .where(eq(companyTaxRegimes.companyId, companyId));
        await db
          .delete(userRoles)
          .where(inArray(userRoles.userId, customerIds));
        await db
          .delete(userAddresses)
          .where(inArray(userAddresses.userId, customerIds));
        await db.delete(users).where(inArray(users.id, customerIds));
      });

      // A Slovak company without IČO cannot issue invoices yet.
      await db
        .update(companies)
        .set({
          country: "SK",
          taxId: "2020273893",
          vatNumber: "SK2020273893",
          addressLine1: "Hlavná 1",
          city: "Bratislava",
          postalCode: "811 01",
        })
        .where(eq(companies.id, companyId));
      const year = new Date().getUTCFullYear();
      const onboard = await body(
        await postAtlas(fixtures, `companies/${companyId}/onboard`, {
          country: "SK",
          openFirstPeriod: true,
          periodName: `${year}`,
          periodStart: `${year}-01-01`,
          periodEnd: `${year}-12-31`,
        }),
      );
      expect(onboard.success, onboard.message).toBe(true);
      const rates = await db
        .select({ code: taxRates.code, validTo: taxRates.validTo })
        .from(taxRates)
        .where(eq(taxRates.companyId, companyId));
      expect(rates.map((rate) => rate.code)).toEqual(
        expect.arrayContaining(["SK_VAT_23", "SK_VAT_19", "SK_VAT_5", "SK_VAT_20"]),
      );
      expect(rates.find((rate) => rate.code === "SK_VAT_20")?.validTo).toBe(
        "2024-12-31",
      );
      await db.insert(companyTaxRegimes).values({
        companyId,
        effectiveFrom: "2025-01-01",
        regime: CompanyTaxRegime.STANDARD,
      });

      for (const customer of [
        { id: domesticCustomerId, name: "Tatra Obchod s.r.o.", country: "SK", vatNumber: "SK2021869234" },
        { id: euCustomerId, name: "Vltava Digital s.r.o.", country: "CZ", vatNumber: "CZ12345678" },
      ]) {
        const { id } = customer;
        await db.insert(users).values({
          id,
          email: `sk-e2e-${id}@demo-company.example`,
          privateName: customer.name,
          publicName: customer.name,
          password: "!",
          locale: E2E_LOCALE,
          isActive: false,
        });
        await db
          .insert(userRoles)
          .values({ userId: id, role: UserRole.CUSTOMER });
        await db.insert(userAddresses).values({
          userId: id,
          label: "Billing",
          company: customer.name,
          addressLine1: "Ulica 1",
          city: "Mesto",
          postalCode: "00000",
          country: customer.country,
          vatNumber: customer.vatNumber,
          isDefaultBilling: true,
        });
      }

      const today = new Date().toISOString().slice(0, 10);
      const draft = async (
        customerId: string,
        vatTreatment: string,
        lineItems: { description: string; quantity: number; unitPrice: number; taxRate: number }[],
      ): Promise<string> => {
        const created = await body(
          await postAtlas(fixtures, "payment/invoice/create", {
            companyId,
            customerId,
            currency: "EUR",
            supplyDate: today,
            vatTreatment,
            lineItems,
          }),
        );
        expect(created.success, created.message).toBe(true);
        return z
          .object({ invoice: z.object({ id: z.uuid() }) })
          .parse(created.data).invoice.id;
      };
      const send = async (invoiceId: string): Promise<z.infer<typeof envelope>> =>
        body(await postAtlas(fixtures, `payment/invoice/${invoiceId}/send`, {}));

      // Missing IČO blocks the issue with the country message.
      const domesticId = await draft(domesticCustomerId, VatTreatment.DOMESTIC, [
        { description: "Služby", quantity: 10, unitPrice: 80, taxRate: 0.23 },
        { description: "Kniha", quantity: 2, unitPrice: 25, taxRate: 0.05 },
      ]);
      const blocked = await send(domesticId);
      expect(blocked.success).toBe(false);
      expect(blocked.message).toContain("IČO");
      await db
        .update(companies)
        .set({ registrationNumber: "35763469" })
        .where(eq(companies.id, companyId));
      const issued = await send(domesticId);
      expect(issued.success, issued.message).toBe(true);

      // The old 20 % rate is rejected for a 2026 supply.
      const oldRateId = await draft(domesticCustomerId, VatTreatment.DOMESTIC, [
        { description: "Starý tarif", quantity: 1, unitPrice: 10, taxRate: 0.2 },
      ]);
      const oldRate = await send(oldRateId);
      expect(oldRate.success).toBe(false);
      expect(oldRate.message).toContain("20");

      // Reverse charge to a CZ business: 0 %, legal note, customer VAT id.
      const reverseId = await draft(
        euCustomerId,
        VatTreatment.EU_SERVICES_REVERSE_CHARGE,
        [{ description: "Konzultácie", quantity: 1, unitPrice: 1200, taxRate: 0 }],
      );
      const reverse = await send(reverseId);
      expect(reverse.success, reverse.message).toBe(true);
      const [reverseRow] = await db
        .select({ notes: paymentInvoices.notes, metadata: paymentInvoices.metadata })
        .from(paymentInvoices)
        .where(eq(paymentInvoices.id, reverseId));
      expect(reverseRow?.notes).toContain("Prenesenie daňovej povinnosti");
      const legal = readLegalSnapshot(reverseRow?.metadata ?? null);
      expect(legal?.customer?.vatNumber).toBe("CZ12345678");
      expect(legal?.issuer.registrationNumber).toBe("35763469");
      await db
        .delete(paymentInvoices)
        .where(
          and(
            eq(paymentInvoices.id, oldRateId),
            eq(paymentInvoices.companyId, companyId),
          ),
        );

      const period = today.slice(0, 7);
      const vatReturn = await body(
        await getAtlasFixture(
          `${fixtures.baseUrl}/api/${E2E_LOCALE}/tax/vat-return`,
          { companyId, period },
          headers,
        ),
      );
      expect(vatReturn.success, vatReturn.message).toBe(true);
      const prepared = z
        .object({
          lines: z.array(z.object({ line: z.string(), amount: z.number() })),
          sections: z.array(z.object({ section: z.string(), count: z.number() })),
          kvXml: z.string(),
        })
        .parse(vatReturn.data);
      const line = (id: string): number | undefined =>
        prepared.lines.find((entry) => entry.line === id)?.amount;
      expect(line("r03")).toBe(800);
      expect(line("r04")).toBe(184);
      expect(line("r01a")).toBe(50);
      expect(line("r02a")).toBe(2.5);
      expect(line("r32")).toBe(186.5);
      expect(prepared.sections.find((s) => s.section === "A1")?.count).toBe(2);
      expect(prepared.kvXml).toContain('Odb="SK2021869234"');
      expect(prepared.kvXml).not.toContain("CZ12345678");

      const compliance = await body(
        await getAtlasFixture(
          `${fixtures.baseUrl}/api/${E2E_LOCALE}/tax/compliance`,
          { companyId },
          headers,
        ),
      );
      expect(compliance.success, compliance.message).toBe(true);
      const findings = z
        .object({ findings: z.array(z.object({ code: z.string() })) })
        .parse(compliance.data)
        .findings.map((finding) => finding.code);
      expect(findings).toContain(ComplianceIssue.FISCAL_PROVIDER_MISSING);
      expect(findings).not.toContain(ComplianceIssue.ISSUER_REGISTRATION_MISSING);
      expect(findings).not.toContain(ComplianceIssue.CHART_TEMPLATE_MISMATCH);

      // Rendered pages, as an operator sees them (en and sk).
      const { page } = fixtures;
      for (const locale of ["en-US", "sk-SK"] as const) {
        const returnT = vatReturnTranslation.scopedT(locale).t;
        await page.goto(
          `${fixtures.baseUrl}/${locale}/tools/tax-vat-return?arg.companyId=${companyId}&arg.period=${period}`,
          { waitUntil: "domcontentloaded" },
        );
        await page
          .getByText(returnT("lines.r04"), { exact: true })
          .first()
          .waitFor({ timeout: 30000 });
        await page
          .getByText(returnT("sections.A1"), { exact: true })
          .first()
          .waitFor({ timeout: 10000 });
        await saveAdminViewMatrix(
          page,
          "tax",
          `sk-vat-return-${locale.slice(0, 2)}`,
        );
        const complianceT = complianceTranslation.scopedT(locale).t;
        await page.goto(
          `${fixtures.baseUrl}/${locale}/tools/tax-compliance?arg.companyId=${companyId}`,
          { waitUntil: "domcontentloaded" },
        );
        await page
          .getByText(complianceT("issues.fiscalProviderMissing"), {
            exact: true,
          })
          .first()
          .waitFor({ timeout: 30000 });
        await saveAdminViewMatrix(
          page,
          "tax",
          `sk-compliance-${locale.slice(0, 2)}`,
        );
        await page.goto(
          `${fixtures.baseUrl}/${locale}/tools/pos-fiscal-settings?arg.companyId=${companyId}`,
          { waitUntil: "domcontentloaded" },
        );
        await page
          .getByText(fiscalTranslation.scopedT(locale).t("widget.blockedTitle"), {
            exact: true,
          })
          .first()
          .waitFor({ timeout: 30000 });
        await saveAdminViewMatrix(page, "tax", `sk-fiscal-${locale.slice(0, 2)}`);
        await page.goto(
          `${fixtures.baseUrl}/${locale}/tools/coa-statutory-statements?arg.companyId=${companyId}&arg.from=${year}-01-01&arg.to=${year}-12-31`,
          { waitUntil: "domcontentloaded" },
        );
        await page
          .getByText(
            statementsTranslation.scopedT(locale).t("response.balanceSheet"),
            { exact: true },
          )
          .first()
          .waitFor({ timeout: 30000 });
        await saveAdminViewMatrix(
          page,
          "tax",
          `sk-statements-${locale.slice(0, 2)}`,
        );
      }
    },
  );
});
