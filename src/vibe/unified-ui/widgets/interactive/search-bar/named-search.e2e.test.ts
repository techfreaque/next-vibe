import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import { prepareAtlasCompany } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import billLine from "@/payment/bill/line/add/definition";
import { paymentBills, paymentEstimates, paymentInvoices } from "@/payment/db";
import estimateLine from "@/payment/estimate/line/add/definition";
import invoiceLine from "@/payment/invoice/line/add/definition";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";
import brave from "@/vibe/agent/web-search/brave/definition";

describe("Named admin search inputs", () => {
  const e2e = useE2E("admin/named-search");
  e2e.it(
    "submits the named web search and picks a company product from each document editor",
    async (fixtures) => {
      const { page } = fixtures;
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        "E2E Search Controls",
      );
      const estimateId = randomUUID(),
        billId = randomUUID(),
        invoiceId = randomUUID();
      const productId = randomUUID();
      const sku = "E2E-LOOKUP-" + productId.slice(0, 8);
      const name = "E2E Catalogue design";
      fixtures.cleanup(async () => {
        await db
          .delete(catalogProducts)
          .where(eq(catalogProducts.id, productId));
        await db
          .delete(paymentEstimates)
          .where(eq(paymentEstimates.id, estimateId));
        await db.delete(paymentBills).where(eq(paymentBills.id, billId));
        await db
          .delete(paymentInvoices)
          .where(eq(paymentInvoices.id, invoiceId));
      });
      await db.insert(paymentInvoices).values({
        id: invoiceId,
        userId,
        companyId,
        providerInvoiceId: invoiceId,
        invoiceNumber: "TEST-89",
        amount: "0",
        currency: "EUR",
      });
      await db.insert(paymentBills).values({
        id: billId,
        companyId,
        supplierName: "E2E Print Shop",
        billNumber: "TEST-91",
        billDate: new Date(),
        currency: "EUR",
      });
      await db.insert(paymentEstimates).values({
        id: estimateId,
        companyId,
        estimateNumber: "TEST-94",
        currency: "EUR",
      });
      await db.insert(catalogProducts).values({
        id: productId,
        companyId,
        ownerUserId: userId,
        name,
        sku,
        type: ProductType.SERVICE,
        basePrice: 12.5,
        currency: "EUR",
      });
      await page.route("**/api/*/pos/product-lookup*", (route) =>
        route.continue({
          headers: { ...route.request().headers(), ...headers },
        }),
      );
      for (const record of [
        {
          locale: "en-US",
          endpoint: invoiceLine.POST,
          key: "invoiceId",
          id: invoiceId,
        },
        { locale: "de-DE", endpoint: billLine.POST, key: "billId", id: billId },
        {
          locale: "sk-SK",
          endpoint: estimateLine.POST,
          key: "estimateId",
          id: estimateId,
        },
      ] as const) {
        const { t } = record.endpoint.scopedTranslation.scopedT(record.locale);
        const { t: webT } = brave.GET.scopedTranslation.scopedT(record.locale);
        let submitted = "";
        const webPath =
          "**/api/" + record.locale + "/vibe/agent/web-search/brave*";
        await page.route(webPath, (route) => {
          submitted =
            new URL(route.request().url()).searchParams.get("query") ?? "";
          return route.fulfill({
            json: {
              success: true,
              data: brave.GET.examples.responses?.default,
            },
          });
        });
        await fixtures.goto(
          "/tools/" + endpointToUrlSegment(brave.GET),
          record.locale,
        );
        const query = page
          .getByRole("textbox", {
            name: webT("get.fields.query.title"),
            exact: true,
          })
          .filter({ visible: true })
          .first();
        await query.fill("synthetic query");
        const searched = page.waitForResponse(
          (reply) =>
            reply.url().includes("/vibe/agent/web-search/brave") &&
            reply.request().resourceType() === "fetch",
        );
        await query.press("Enter");
        expect((await searched).status()).toBe(200);
        expect(submitted).toBe("synthetic query");
        await fixtures.goto(
          "/tools/" +
            endpointToUrlSegment(record.endpoint) +
            "?arg." +
            record.key +
            "=" +
            record.id,
          record.locale,
        );
        const product = page
          .getByRole("textbox", {
            name: t("widget.searchProduct"),
            exact: true,
          })
          .filter({ visible: true })
          .first();
        await product.fill(sku);
        const lookup = page.waitForResponse((reply) =>
          new URL(reply.url()).pathname.endsWith("/pos/product-lookup"),
        );
        await product.press("Enter");
        expect((await lookup).status()).toBe(200);
        const found = page
          .getByRole("button", { name: new RegExp(sku) })
          .filter({ visible: true })
          .first();
        await found.click();
        await page
          .getByText(name, { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        expect(
          await page
            .getByRole("button", {
              name: t("widget.clearProduct"),
              exact: true,
            })
            .isVisible(),
        ).toBe(true);
      }
    },
    170000,
  );
});
