import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { pathToAliasMap } from "@/generated/endpoints/alias-map";
import {
  paymentEstimateLines,
  paymentEstimates,
  paymentInvoiceLines,
  paymentInvoices,
} from "@/payment/db";
import invoiceGet from "@/payment/invoice/[invoiceId]/get/definition";
import { scopedTranslation as invoiceCopy } from "@/payment/invoice/[invoiceId]/get/i18n";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import convert from "./[estimateId]/convert-to-invoice/definition";
import { scopedTranslation as convertCopy } from "./[estimateId]/convert-to-invoice/i18n";
import { scopedTranslation as detailCopy } from "./[estimateId]/get/i18n";
import create from "./create/definition";

describe("Quote line settlement", () => {
  const e2e = useE2E("payment/quote-line-settlement");
  for (const [locale, item, title] of [
    ["en-US", "Studio print", "Print order"],
    ["de-DE", "Kunstdruck", "Druckauftrag"],
    ["sk-SK", "Umelecká tlač", "Objednávka tlače"],
  ] as const) {
    const suffix = locale === "en-US" ? "" : "-" + locale;
    e2e.it(
      "carries both rounded quote rows into its converted invoice in " + locale,
      async (fixtures) => {
        const { page } = fixtures;
        const { companyId, headers } = await prepareAtlasCompany(
          fixtures,
          "E2E Mira Studio",
        );
        fixtures.cleanup(async () => {
          await db
            .delete(paymentEstimates)
            .where(eq(paymentEstimates.companyId, companyId));
          await db
            .delete(paymentInvoices)
            .where(eq(paymentInvoices.companyId, companyId));
        });
        const line = {
          description: item,
          quantity: 1,
          unitPrice: 1.07,
          taxRate: 0.23,
        };
        const created = await postAtlas(fixtures, "payment/estimate/create", {
          companyId,
          currency: "EUR",
          customerName: "Mira Studio",
          title,
          lines: [line],
        });
        const parsed = z
          .object({
            success: z.literal(true),
            data: create.POST.responseSchema,
          })
          .parse(await created.json());
        const id = parsed.data.estimate.id;
        expect(parsed.data.estimate).toMatchObject({
          subtotal: 1.07,
          taxAmount: 0.25,
          total: 1.32,
        });
        const added = await postAtlas(fixtures, "payment/estimate/line/add", {
          estimateId: id,
          ...line,
        });
        expect(added.status).toBe(200);
        const [estimate] = await db
          .select()
          .from(paymentEstimates)
          .where(eq(paymentEstimates.id, id));
        expect(estimate).toMatchObject({
          subtotal: 2.14,
          taxAmount: 0.5,
          total: 2.64,
          metadata: { lineSettlement: LINE_SETTLEMENT_V1 },
        });
        const quoteLines = await db
          .select()
          .from(paymentEstimateLines)
          .where(eq(paymentEstimateLines.estimateId, id));
        expect(quoteLines.map((row) => [row.taxAmount, row.lineTotal])).toEqual(
          [
            [0.25, 1.32],
            [0.25, 1.32],
          ],
        );
        const sent = await postAtlas(
          fixtures,
          "payment/estimate/" + id + "/send",
          {},
        );
        expect(sent.status).toBe(200);
        const t = detailCopy.scopedT(locale).t;
        await fixtures.goto(
          "/tools/" +
            pathToAliasMap.payment_estimate_estimateId_get_GET +
            "?arg.estimateId=" +
            id,
          locale,
        );
        await page
          .getByText(formatMoney(2.64, "EUR", locale), { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        await saveAdminViewMatrix(
          page,
          "businessDocuments",
          "quote-rounded-lines" + suffix,
          async () => {
            await page
              .getByRole("button", {
                name: t("widget.convertToInvoice"),
                exact: true,
              })
              .waitFor();
          },
        );
        await page
          .getByRole("button", {
            name: t("widget.convertToInvoice"),
            exact: true,
          })
          .click();
        const [response] = await Promise.all([
          page.waitForResponse(
            (r) =>
              r.request().method() === "POST" &&
              new URL(r.url()).pathname.endsWith(
                "/" + id + "/convert-to-invoice",
              ),
          ),
          page
            .getByRole("dialog")
            .getByRole("button", {
              name: convertCopy.scopedT(locale).t("widget.submit"),
              exact: true,
            })
            .click(),
        ]);
        const converted = z
          .object({
            success: z.literal(true),
            data: convert.POST.responseSchema,
          })
          .parse(await response.json());
        const [invoice] = await db
          .select()
          .from(paymentInvoices)
          .where(eq(paymentInvoices.id, converted.data.invoiceId));
        expect(invoice).toMatchObject({
          amount: "2.64",
          currency: "EUR",
          metadata: { estimateId: id, lineSettlement: LINE_SETTLEMENT_V1 },
        });
        const invoiceLines = await db
          .select()
          .from(paymentInvoiceLines)
          .where(eq(paymentInvoiceLines.invoiceId, invoice.id));
        expect(
          invoiceLines.map((row) => [row.taxAmount, row.lineTotal]),
        ).toEqual([
          [0.25, 1.32],
          [0.25, 1.32],
        ]);
        const getSource = async (): Promise<ReturnType<typeof invoiceGet.GET.responseSchema.parse>["sourceEstimate"]> => {
          const reply = await getAtlasFixture(
            `${fixtures.baseUrl}/api/${locale}/payment/invoice/${invoice.id}/get`,
            {},
            headers,
          );
          expect(reply.ok).toBe(true);
          const { data } = z.object({ data: invoiceGet.GET.responseSchema })
            .parse(await reply.json());
          return data.sourceEstimate;
        };
        const expectedSource = { id, number: estimate.estimateNumber };
        expect(await getSource()).toEqual(expectedSource);
        if (locale === "en-US") {
          const { companyId: foreignCompany } = await prepareAtlasCompany(
            fixtures, "E2E Unrelated Quote Scope",
          );
          fixtures.cleanup(async () => {
            await db.update(paymentEstimates).set({ companyId }).where(eq(paymentEstimates.id, id));
          });
          try {
            await db.update(paymentEstimates).set({ companyId: foreignCompany })
              .where(eq(paymentEstimates.id, id));
            expect(await getSource()).toBeUndefined();
            await db.update(paymentEstimates).set({ companyId, invoiceId: null })
              .where(eq(paymentEstimates.id, id));
            expect(await getSource()).toBeUndefined();
          } finally {
            await db.update(paymentEstimates).set({ companyId, invoiceId: invoice.id })
              .where(eq(paymentEstimates.id, id));
          }
          expect(await getSource()).toEqual(expectedSource);
        }
        const sourceLink = page.getByRole("button", {
          name: `${invoiceCopy.scopedT(locale).t("widget.openSourceQuote")} ${estimate.estimateNumber}`,
          exact: true,
        });
        const viewInvoice = page.getByRole("dialog").getByRole("button", {
          name: convertCopy.scopedT(locale).t("widget.viewInvoice"),
          exact: true,
        });
        await saveAdminViewMatrix(
          page,
          "businessDocuments",
          "quote-converted-confirmation" + suffix,
          async () => {
            await viewInvoice.waitFor();
            await page
              .getByRole("dialog")
              .getByText(
                convertCopy.scopedT(locale).t("widget.savedDraftNumber", {
                  number: invoice.invoiceSequenceNumber ?? 0,
                }),
                { exact: true },
              )
              .waitFor();
            await page
              .getByRole("dialog")
              .getByText(
                convertCopy.scopedT(locale).t("widget.convertedNumber", {
                  number: estimate.estimateNumber,
                }),
                { exact: true },
              )
              .waitFor();
          },
        );
        await viewInvoice.click();
        await saveAdminViewMatrix(
          page,
          "businessDocuments",
          "quote-converted-draft" + suffix,
          async () => {
            await sourceLink.waitFor();
            await page
              .getByRole("button", {
                name: invoiceCopy.scopedT(locale).t("widget.addLine"),
                exact: true,
              })
              .waitFor();
            await page
              .getByText(formatMoney(2.64, "EUR", locale), { exact: true })
              .filter({ visible: true })
              .first()
              .waitFor();
          },
        );
        await saveAdminViewMatrix(
          page,
          "businessDocuments",
          "quote-converted-items" + suffix,
          async () => {
            const lineTotals = page
              .getByText(formatMoney(1.32, "EUR", locale), { exact: true })
              .filter({ visible: true });
            expect(await lineTotals.count()).toBe(2);
            await lineTotals
              .last()
              .evaluate((element) =>
                element.scrollIntoView({
                  block: "center",
                  behavior: "instant",
                }),
              );
            for (const total of await lineTotals.all()) {
              const box = await total.boundingBox();
              expect(
                box &&
                  box.y > 0 &&
                  box.y + box.height <= (page.viewportSize()?.height ?? 0),
              ).toBe(true);
            }
          },
        );
        await sourceLink.click();
        await page.getByRole("heading", { name: estimate.estimateNumber, exact: false })
          .filter({ visible: true }).first().waitFor();
        expect(new URL(page.url()).searchParams.get("arg.estimateId")).toBe(id);
      },
      100000,
    );
  }
});
