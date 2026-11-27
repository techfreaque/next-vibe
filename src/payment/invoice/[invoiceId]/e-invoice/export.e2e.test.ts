import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { saveAdminReviewScreenshots } from "next-vibe/tooling/testing/e2e/admin-review-screenshots";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { paymentInvoiceLines, paymentInvoices } from "@/payment/db";
import { InvoiceStatus } from "@/payment/enum";
import { VatTreatment } from "@/tax/compliance/enum";
import type {
  LegalSnapshot,
  PartySnapshot,
} from "@/tax/compliance/legal-snapshot";
import { CompanyTaxRegime } from "@/tax/regime/enum";

import definition from "./definition";

const locale = "en-US";

describe("E-invoice exports on Atlas", () => {
  const e2e = useE2E("payment/e-invoice/export");
  const { t } = definition.GET.scopedTranslation.scopedT(locale);

  e2e.it(
    "previews and downloads Peppol XML and prepares XRechnung from the buyer reference",
    async (fixtures) => {
      const { page, goto, cleanup } = fixtures;
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "Northbridge Design",
      );
      const invoiceId = randomUUID();
      cleanup(async () => {
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId));
      });
      const issuer: PartySnapshot = {
        name: "Northbridge Design",
        country: "DE",
        addressLine1: "Musterstraße 17",
        addressLine2: null,
        city: "Berlin",
        postalCode: "10115",
        registrationNumber: "HRB 12345",
        taxId: null,
        vatNumber: "DE123456789",
        email: "billing@example.invalid",
        phone: "+49305550100",
      };
      const legal: LegalSnapshot = {
        version: 1,
        country: "DE",
        regime: CompanyTaxRegime.STANDARD,
        treatment: VatTreatment.DOMESTIC,
        issueDate: "2026-11-10",
        supplyDate: "2026-11-10",
        issuer,
        customer: {
          ...issuer,
          name: "Maple Public Studio",
          vatNumber: "DE987654321",
        },
        notes: [],
      };
      const number = "INV-2026-0042";
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        companyId,
        userId,
        providerInvoiceId: `fixture-${invoiceId}`,
        invoiceNumber: number,
        status: InvoiceStatus.OPEN,
        amount: "119.00",
        currency: "EUR",
        dueDate: new Date("2026-12-10"),
        metadata: { legal },
      });
      await db.insert(paymentInvoiceLines).values({
        invoiceId,
        description: "Website maintenance",
        quantity: 1,
        unitPrice: 100,
        taxRate: 0.19,
        taxAmount: 19,
        lineTotal: 119,
      });

      const view = page.locator("#admin-tool-invoice-e-invoice");
      const peppol = view.getByRole("button", {
        name: t("widget.peppol"),
        exact: true,
      });
      await goto(`/tools/invoice-e-invoice?arg.invoiceId=${invoiceId}`, locale);
      await peppol.waitFor();
      await view.getByRole("listitem").filter({ hasText: t("fields.bt10") }).waitFor();
      const preview = view.getByRole("button", {
        name: t("widget.preview"),
        exact: true,
      });
      await preview.click();
      const xml = view.locator("pre");
      await xml.waitFor();
      expect(await xml.textContent()).toContain(`<cbc:ID>${number}</cbc:ID>`);
      const [peppolFile] = await Promise.all([
        page.waitForEvent("download"),
        peppol.click(),
      ]);
      expect(peppolFile.suggestedFilename()).toBe(`invoice-${number}.xml`);
      expect(await readFile(await peppolFile.path(), "utf8")).toBe(
        await xml.textContent(),
      );
      await preview.click();

      const buyerReference = "04011000-12345ABCD-12";
      await view
        .getByRole("textbox", { name: t("buyerReference.label") })
        .fill(buyerReference);
      const [prepared] = await Promise.all([
        page.waitForResponse((reply) => {
          const url = new URL(reply.url());
          return url.pathname.endsWith(`/${invoiceId}/e-invoice`) && url.searchParams.get("buyerReference") === buyerReference;
        }),
        view.getByRole("button", { name: t("widget.submit"), exact: true }).click(),
      ]);
      expect(prepared.ok()).toBe(true);
      const xrechnung = view.getByRole("button", {
        name: t("widget.xrechnung"),
        exact: true,
      });
      await xrechnung.waitFor();
      await saveAdminReviewScreenshots(page, "invoice-e-invoice", locale);
      const [xrechnungFile] = await Promise.all([
        page.waitForEvent("download"),
        xrechnung.click(),
      ]);
      expect(xrechnungFile.suggestedFilename()).toBe(`xrechnung-${number}.xml`);
      const xrechnungXml = await readFile(await xrechnungFile.path(), "utf8");
      expect(xrechnungXml).toContain(
        `<cbc:BuyerReference>${buyerReference}</cbc:BuyerReference>`,
      );
      expect(xrechnungXml).toContain("xrechnung_3.0");
    },
    90_000,
  );
});
