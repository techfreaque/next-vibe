import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { stockLevels, warehouses } from "@/inventory/db";
import { scopedTranslation as inventoryTranslation } from "@/inventory/i18n";
import warehouseDetail from "@/inventory/warehouse/[warehouseId]/get/definition";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";
import { purchaseOrders, purchasingVendors } from "@/purchasing/db";
import { scopedTranslation as purchasingTranslation } from "@/purchasing/i18n";
import orderList from "@/purchasing/order/list/definition";
import vendorDetail from "@/purchasing/vendor/[vendorId]/get/definition";

describe("Warehouse and vendor record details", () => {
  const e2e = useE2E("admin-record-warehouse-vendor");

  e2e.it(
    "shows scoped metrics and opens the corresponding stock and purchase orders",
    async (fixtures) => {
      const { page, baseUrl } = fixtures;
      const companyName = "E2E Record Workshop";
      const warehouseName = "E2E Packing Warehouse";
      const vendorName = "E2E Box Supplier";
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        companyName,
      );
      const other = await prepareAtlasCompany(
        fixtures,
        "E2E Separate Workshop",
      );
      const warehouseId = randomUUID();
      const otherWarehouseId = randomUUID();
      const productId = randomUUID();
      const unvaluedProductId = randomUUID();
      const vendorId = randomUUID();
      const otherVendor = randomUUID();
      const outsideVendor = randomUUID();
      const sentOrder = randomUUID();
      const receivedOrder = randomUUID();
      const orderIds = [sentOrder, receivedOrder, randomUUID(), randomUUID()];
      const vendorIds = [vendorId, otherVendor, outsideVendor];
      const warehouseIds = [warehouseId, otherWarehouseId];
      const productIds = [productId, unvaluedProductId];

      fixtures.cleanup(async () => {
        await db
          .delete(purchaseOrders)
          .where(inArray(purchaseOrders.id, orderIds));
        await db
          .delete(purchasingVendors)
          .where(inArray(purchasingVendors.id, vendorIds));
        await db
          .delete(stockLevels)
          .where(inArray(stockLevels.warehouseId, warehouseIds));
        await db
          .delete(catalogProducts)
          .where(inArray(catalogProducts.id, productIds));
        await db.delete(warehouses).where(inArray(warehouses.id, warehouseIds));
      });

      await db.insert(warehouses).values([
        {
          id: warehouseId,
          companyId,
          code: "PACK",
          name: warehouseName,
          address: "10 Fixture Lane",
          isDefault: true,
        },
        {
          id: otherWarehouseId,
          companyId,
          code: "OTHER",
          name: "E2E Other Warehouse",
        },
      ]);
      await db.insert(catalogProducts).values([
        {
          id: productId,
          companyId,
          ownerUserId: userId,
          name: "E2E Packing Box",
          type: ProductType.PHYSICAL,
        },
        {
          id: unvaluedProductId,
          companyId,
          ownerUserId: userId,
          name: "E2E Empty Stock",
          type: ProductType.PHYSICAL,
        },
      ]);
      await db.insert(stockLevels).values([
        {
          warehouseId,
          productId,
          quantityOnHand: 5,
          quantityReserved: 1,
          unitCost: 10,
        },
        { warehouseId, productId: unvaluedProductId, quantityOnHand: 0 },
        {
          warehouseId: otherWarehouseId,
          productId,
          quantityOnHand: 100,
          unitCost: 200,
        },
      ]);
      await db.insert(purchasingVendors).values([
        {
          id: vendorId,
          companyId,
          name: vendorName,
          code: "BOX",
          email: "boxes@example.invalid",
          defaultCurrency: "EUR",
          defaultPaymentTermsDays: 30,
        },
        { id: otherVendor, companyId, name: "E2E Other Vendor" },
        {
          id: outsideVendor,
          companyId: other.companyId,
          name: "E2E Outside Vendor",
        },
      ]);
      await db.insert(purchaseOrders).values([
        {
          id: sentOrder,
          companyId,
          vendorId,
          poNumber: "RECORD-01",
          currency: "EUR",
          status: "SENT",
          createdByUserId: userId,
        },
        {
          id: receivedOrder,
          companyId,
          vendorId,
          poNumber: "RECORD-02",
          currency: "EUR",
          status: "RECEIVED",
          createdByUserId: userId,
        },
        {
          id: orderIds[2],
          companyId,
          vendorId: otherVendor,
          poNumber: "UNRELATED-01",
          currency: "EUR",
          status: "SENT",
          createdByUserId: userId,
        },
        {
          id: orderIds[3],
          companyId: other.companyId,
          vendorId: outsideVendor,
          poNumber: "OUTSIDE-01",
          currency: "EUR",
          status: "SENT",
          createdByUserId: userId,
        },
      ]);
      const api = (
        path: string,
        query: Record<string, string> = {},
      ): Promise<Response> =>
        getAtlasFixture(`${baseUrl}/api/${E2E_LOCALE}/${path}`, query, headers);

      const warehouseResponse = await api(
        `inventory/warehouse/${warehouseId}/get`,
      );
      expect(warehouseResponse.ok).toBe(true);
      const warehouse = z
        .object({
          success: z.literal(true),
          data: warehouseDetail.GET.responseSchema,
        })
        .parse(await warehouseResponse.json());
      expect(warehouse.data.result).toMatchObject({
        companyName,
        stockedProducts: 1,
        stockValue: 50,
        valuationCurrency: "EUR",
      });
      const vendorResponse = await api(`purchasing/vendor/${vendorId}/get`);
      expect(vendorResponse.ok).toBe(true);
      const vendor = z
        .object({
          success: z.literal(true),
          data: vendorDetail.GET.responseSchema,
        })
        .parse(await vendorResponse.json());
      expect(vendor.data.result).toMatchObject({
        companyName,
        orderCount: 2,
        receivingCount: 1,
      });
      const wrongCompany = await api("purchasing/order/list", {
        companyId: other.companyId,
        vendorId,
      });
      expect(wrongCompany.ok).toBe(true);
      const ordersSchema = z.object({
        success: z.literal(true),
        data: orderList.GET.responseSchema,
      });
      expect(ordersSchema.parse(await wrongCompany.json()).data.result).toEqual(
        [],
      );

      await page.route("**/api/**/inventory/stock/list**", async (route) => {
        const query = new URL(route.request().url()).searchParams;
        if (
          query.get("companyId") !== companyId ||
          query.get("warehouseId") !== warehouseId
        ) {
          await route.abort();
          return;
        }
        await route.continue();
      });
      await page.route("**/api/**/purchasing/order/list**", async (route) => {
        const query = new URL(route.request().url()).searchParams;
        if (
          query.get("companyId") !== companyId ||
          query.get("vendorId") !== vendorId
        ) {
          await route.abort();
          return;
        }
        await route.continue();
      });

      const records = [
        {
          tool: endpointToUrlSegment(warehouseDetail.GET),
          idKey: "warehouseId",
          id: warehouseId,
          name: warehouseName,
          file: "warehouse",
        },
        {
          tool: endpointToUrlSegment(vendorDetail.GET),
          idKey: "vendorId",
          id: vendorId,
          name: vendorName,
          file: "vendor",
        },
      ];
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        for (const record of records) {
          const url = new URL(`/${locale}/tools/${record.tool}`, baseUrl);
          url.searchParams.set(record.idKey, record.id);
          const response = await page.goto(url.toString(), {
            waitUntil: "domcontentloaded",
          });
          expect(response?.ok()).toBe(true);
          await page
            .getByRole("heading", { name: record.name, exact: true })
            .waitFor();
          await page.getByText(new RegExp(companyName, "u")).first().waitFor();
          if (process.env["ADMIN_RECORD_SHOTS"] === "1") {
            await saveAdminViewMatrix(
              page,
              "admin-record-details",
              `${record.file}-${locale}`,
            );
          } else {
            await page.setViewportSize({ width: 390, height: 844 });
          }
          expect(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth + 1,
            ),
          ).toBe(true);

          if (locale !== "en-US") {
            continue;
          }
          if (record.file === "warehouse") {
            const { t } = inventoryTranslation.scopedT(locale);
            await page
              .getByText(t("warehouseGet.get.widget.stockedProducts"), {
                exact: true,
              })
              .waitFor();
            const stock = page.waitForResponse(
              (reply) =>
                reply.ok() &&
                new URL(reply.url()).pathname.endsWith("/inventory/stock/list"),
            );
            await page
              .getByRole("button", {
                name: t("warehouseGet.get.widget.viewStock"),
                exact: true,
              })
              .click();
            await stock;
            await page
              .getByText("E2E Packing Box", { exact: true })
              .filter({ visible: true })
              .first()
              .waitFor();
          } else {
            const { t } = purchasingTranslation.scopedT(locale);
            await page
              .getByText(t("vendorGet.get.widget.receivingCount"), {
                exact: true,
              })
              .waitFor();
            const orders = page.waitForResponse(
              (reply) =>
                reply.ok() &&
                new URL(reply.url()).pathname.endsWith(
                  "/purchasing/order/list",
                ),
            );
            await page
              .getByRole("button", {
                name: t("vendorGet.get.widget.viewOrders"),
                exact: true,
              })
              .click();
            const scopedOrders = ordersSchema.parse(await (await orders).json())
              .data.result;
            expect(scopedOrders.map(({ id }) => id).sort()).toEqual(
              [sentOrder, receivedOrder].sort(),
            );
            await page
              .getByText("RECORD-01", { exact: true })
              .filter({ visible: true })
              .first()
              .waitFor();
            expect(
              await page
                .getByText("UNRELATED-01", { exact: true })
                .filter({ visible: true })
                .count(),
            ).toBe(0);
          }
        }
      }

      await db
        .update(stockLevels)
        .set({ quantityOnHand: 1 })
        .where(eq(stockLevels.productId, unvaluedProductId));
      const incomplete = await api(`inventory/warehouse/${warehouseId}/get`);
      expect(incomplete.ok).toBe(true);
      expect(
        z
          .object({
            success: z.literal(true),
            data: warehouseDetail.GET.responseSchema,
          })
          .parse(await incomplete.json()).data.result,
      ).toMatchObject({ stockedProducts: 2, stockValue: null });
    },
    180_000,
  );
});
