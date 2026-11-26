import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import inventoryDashboard from "@/inventory/dashboard/definition";
import { stockLevels, stockMovements, warehouses } from "@/inventory/db";
import { scopedTranslation as inventoryTranslation } from "@/inventory/i18n";
import { paymentBillLines, paymentBills } from "@/payment/db";
import { BillStatus } from "@/payment/enum";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import { purchaseOrderLines, purchaseOrders, purchaseReceipts, purchasingVendors } from "../db";
import { scopedTranslation } from "../i18n";
import orderDetails from "../order/[poId]/get/definition";
import receiveDefinition from "../order/[poId]/receive/definition";

describe("Purchasing receipt and supplier bill", () => {
  const e2e = useE2E("purchasing/receipt-to-bill");

  e2e.it(
    "receives stock in two partial shipments before converting exactly one supplier bill",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(fixtures, "E2E Purchasing Company");
      const vendorId = randomUUID();
      const warehouseId = randomUUID();
      const productId = randomUUID();
      const poId = randomUUID();
      const poLineId = randomUUID();
      fixtures.cleanup(async () => {
        await db.delete(paymentBills).where(eq(paymentBills.companyId, companyId));
        await db.delete(purchaseOrders).where(eq(purchaseOrders.id, poId));
        await db.delete(stockMovements).where(eq(stockMovements.warehouseId, warehouseId));
        await db.delete(stockLevels).where(eq(stockLevels.warehouseId, warehouseId));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, productId));
        await db.delete(warehouses).where(eq(warehouses.id, warehouseId));
        await db.delete(purchasingVendors).where(eq(purchasingVendors.id, vendorId));
        expect(
          await db.select().from(purchaseReceipts).where(eq(purchaseReceipts.poId, poId)),
        ).toEqual([]);
        expect(
          await db.select().from(stockMovements).where(eq(stockMovements.warehouseId, warehouseId)),
        ).toEqual([]);
      });

      await db
        .insert(purchasingVendors)
        .values({ id: vendorId, companyId, name: "E2E Stock Vendor" });
      await db.insert(warehouses).values({
        id: warehouseId,
        companyId,
        code: "MAIN",
        name: "E2E Main Store",
      });
      await db.insert(catalogProducts).values({
        id: productId,
        companyId,
        ownerUserId: userId,
        type: ProductType.PHYSICAL,
        name: "E2E Packing Box",
        basePrice: 10,
        currency: "EUR",
      });
      await db.insert(purchaseOrders).values({
        id: poId,
        companyId,
        vendorId,
        deliveryWarehouseId: warehouseId,
        poNumber: "E2E-PO-01",
        status: "SENT",
        currency: "EUR",
        createdByUserId: userId,
        subtotal: 50,
        taxAmount: 10,
        total: 60,
      });
      await db.insert(purchaseOrderLines).values({
        id: poLineId,
        poId,
        productId,
        description: "E2E Packing Box",
        quantity: 5,
        unitPrice: 10,
        taxRate: 0.2,
        taxAmount: 10,
        lineTotal: 60,
      });

      const page = fixtures.page;
      await page.route("**/api/**/inventory/**", async (route) => {
        const url = new URL(route.request().url());
        if (
          (url.pathname.endsWith("/inventory/dashboard") ||
            url.pathname.endsWith("/inventory/stock/list")) &&
          url.searchParams.get("companyId") !== companyId
        ) {
          await route.abort();
          return;
        }
        await route.continue();
      });
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const { t: inventoryT } = inventoryTranslation.scopedT(E2E_LOCALE);
      const base = `purchasing/order/${poId}`;
      const receive = (quantityReceived: number, receiptId?: string) =>
        postAtlas(fixtures, `${base}/receive`, {
          ...(receiptId ? { receiptId } : {}),
          lines: [{ poLineId, quantityReceived }],
        });
      const openOrder = () =>
        fixtures.open(orderDetails.GET, {
          query: { poId },
          ready: () => page.getByText("E2E-PO-01", { exact: true }).first().waitFor(),
        });
      const receiveGoods = page.getByRole("button", {
        name: t("orderGet.get.widget.receive"),
        exact: true,
      });
      const createBill = page.getByRole("button", {
        name: t("orderGet.get.widget.convertToBill"),
        exact: true,
      });
      const submitReceipt = async (quantity: string): Promise<string | undefined> => {
        await receiveGoods.click();
        const input = page.getByLabel("E2E Packing Box", { exact: true });
        await input.fill(quantity);
        if (process.env["PURCHASING_WORKFLOW_SHOTS"] === "1" && quantity === "2") {
          await saveAdminViewMatrix(page, "purchasing-receipt-workflow", "partial-receipt");
        }
        const posted = page.waitForResponse((reply) =>
          new URL(reply.url()).pathname.endsWith(`${base}/receive`),
        );
        await page
          .getByRole("button", {
            name: t("orderReceive.post.title"),
            exact: true,
          })
          .last()
          .click();
        const reply = await posted;
        expect(reply.ok()).toBe(true);
        const result = z
          .object({
            success: z.literal(true),
            data: receiveDefinition.POST.responseSchema,
          })
          .safeParse(await reply.json());
        expect(result.success).toBe(true);
        return result.success ? result.data.data.result.receiptId : undefined;
      };
      const visitInventory = async (low: number): Promise<void> => {
        const quantity = page
          .getByText(inventoryT("dashboard.get.widget.kpiInStock"), {
            exact: true,
          })
          .locator("../following-sibling::div[1]")
          .getByText("1", { exact: true });
        const query = new URLSearchParams({ "arg.companyId": companyId });
        await fixtures.gotoReady(
          `/tools/${endpointToUrlSegment(inventoryDashboard.GET)}?${query}`,
          () => quantity.waitFor(),
        );
        await page
          .getByText(inventoryT("dashboard.get.widget.kpiLowStock"), {
            exact: true,
          })
          .locator("../following-sibling::div[1]")
          .getByText(String(low), { exact: true })
          .waitFor();
      };
      const convert = () => postAtlas(fixtures, `${base}/convert-to-bill`, {});
      expect((await receive(6)).ok).toBe(false);
      expect(
        await db.select().from(purchaseReceipts).where(eq(purchaseReceipts.poId, poId)),
      ).toHaveLength(0);
      await openOrder();
      await page
        .getByRole("button", {
          name: t("orderGet.get.widget.confirm"),
          exact: true,
        })
        .click();
      const confirmed = page.waitForResponse((reply) =>
        new URL(reply.url()).pathname.endsWith(`${base}/confirm`),
      );
      await page
        .getByRole("button", {
          name: t("orderConfirm.post.title"),
          exact: true,
        })
        .last()
        .click();
      expect((await confirmed).ok()).toBe(true);
      await openOrder();
      const partialId = await submitReceipt("2");
      expect(partialId).toBeTruthy();
      expect((await receive(2, partialId)).ok).toBe(true);
      expect((await receive(1, partialId)).ok).toBe(false);
      const [partiallyReceived] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, poId));
      expect(partiallyReceived?.status).toBe("PARTIALLY_RECEIVED");
      expect((await convert()).ok).toBe(false);
      expect(
        await db.select().from(paymentBills).where(eq(paymentBills.companyId, companyId)),
      ).toHaveLength(0);

      await openOrder();
      expect(await createBill.count()).toBe(0);
      await visitInventory(1);
      await openOrder();
      const finalId = await submitReceipt("3");
      expect(finalId).toBeTruthy();
      expect((await receive(3, finalId)).ok).toBe(true);
      expect((await receive(3)).ok).toBe(false);
      const [stock] = await db
        .select()
        .from(stockLevels)
        .where(and(eq(stockLevels.warehouseId, warehouseId), eq(stockLevels.productId, productId)));
      expect(stock?.quantityOnHand).toBe(5);
      expect(stock?.unitCost).toBe(10);
      expect(
        await db.select().from(purchaseReceipts).where(eq(purchaseReceipts.poId, poId)),
      ).toHaveLength(2);

      await visitInventory(0);
      if (process.env["PURCHASING_WORKFLOW_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "purchasing-receipt-workflow", "inventory-dashboard");
      }
      const stockReply = page.waitForResponse((reply) => {
        const url = new URL(reply.url());
        return (
          reply.ok() &&
          url.pathname.endsWith("/inventory/stock/list") &&
          url.searchParams.get("companyId") === companyId
        );
      });
      await page
        .locator("#admin-tool-inventory-dashboard")
        .getByRole("button", {
          name: inventoryT("dashboard.get.widget.navStockLevels"),
          exact: true,
        })
        .click();
      await stockReply;
      await page
        .getByText("E2E Packing Box", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      const stockValue = new Intl.NumberFormat(E2E_LOCALE, {
        style: "currency",
        currency: "EUR",
      }).format(50);
      await page.getByText(stockValue, { exact: true }).filter({ visible: true }).first().waitFor();

      await openOrder();
      await createBill.click();
      const converted = page.waitForResponse((reply) =>
        new URL(reply.url()).pathname.endsWith(`${base}/convert-to-bill`),
      );
      await page
        .getByRole("button", {
          name: t("orderConvertToBill.post.title"),
          exact: true,
        })
        .last()
        .click();
      expect((await converted).ok()).toBe(true);
      const duplicates = await Promise.all([convert(), convert()]);
      expect(duplicates.every((response) => !response.ok)).toBe(true);
      const bills = await db
        .select()
        .from(paymentBills)
        .where(eq(paymentBills.companyId, companyId));
      expect(bills).toHaveLength(1);
      const [bill] = bills;
      expect(bill).toMatchObject({
        supplierName: "E2E Stock Vendor",
        billNumber: "E2E-PO-01",
        status: BillStatus.RECEIVED,
        total: 60,
        taxAmount: 10,
        journalEntryId: null,
      });
      await openOrder();
      await saveWorkflowScreenshots(fixtures, "purchasing-received-order");
      const billRead = page.waitForResponse(
        (reply) =>
          reply.ok() && new URL(reply.url()).pathname.endsWith(`/payment/bill/${bill?.id}/get`),
      );
      await page
        .getByRole("button", {
          name: t("orderGet.get.widget.viewBill"),
          exact: true,
        })
        .click();
      await billRead;
      await page
        .getByText("E2E Stock Vendor, E2E Purchasing Company", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      if (process.env["PURCHASING_WORKFLOW_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "purchasing-receipt-workflow", "supplier-bill");
      }
      const [order] = await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, poId));
      expect(order?.billId).toBe(bill?.id);
      if (bill) {
        const [line] = await db
          .select()
          .from(paymentBillLines)
          .where(eq(paymentBillLines.billId, bill.id));
        expect(line).toMatchObject({
          quantity: 5,
          unitPrice: 10,
          taxAmount: 10,
          lineTotal: 60,
        });
      }
    },
    180_000,
  );
});
