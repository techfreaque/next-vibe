import "server-only";

import { and, eq } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { UserRole } from "next-vibe/identity/roles/enum";
import { userRoles } from "next-vibe/identity/user/db";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import {
  getAtlasFixture,
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { stockLevels, stockMovements, warehouses } from "@/inventory/db";
import { scopedTranslation as inventoryTranslation } from "@/inventory/i18n";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/inventory/stock/list/threshold";
import stockDefinition from "@/inventory/stock/list/definition";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import { paymentBills } from "@/payment/db";

import { purchaseOrderLines, purchaseOrders, purchaseReceipts, purchasingVendors } from "../db";
import { scopedTranslation } from "../i18n";
import orderDefinition from "../order/[poId]/get/definition";
import receiveDefinition from "../order/[poId]/receive/definition";
import createOrder from "../order/create/definition";
import listOrders from "../order/list/definition";
import createVendor from "../vendor/create/definition";
import deactivateVendor from "../vendor/[vendorId]/deactivate/definition";
import updateVendor from "../vendor/[vendorId]/update/definition";

const companyName = "E2E Purchase Workshop";
const vendorName = "E2E Birch Components";
const warehouseName = "E2E Receiving Workshop";
const productName = "E2E Bearing Kit";
const units = 4;
const unitCost = 12.375;
const orderGross = 59.4;
const stockValue = 49.5;

describe("E2E: vendor, purchase order and warehouse stock", () => {
  const e2e = useE2E("purchasing/vendor-order-stock");

  e2e.it(
    "creates the supplier and order, receives a catalog product once, and verifies stock against its source order",
    async (fixtures) => {
      let testUserId: string | undefined;
      fixtures.cleanup(async () => {
        if (testUserId) await deleteTestUser(testUserId);
      });
      const user = await createTestUser(fixtures.uniqueEmail("fresh-purchasing"));
      expect(user.success).toBe(true);
      if (!user.success) return;
      testUserId = user.data.user.id;
      await db.insert(userRoles).values({ userId: testUserId, role: UserRole.ADMIN });
      const identity = {
        ...user.data.user,
        roles: [...user.data.user.roles, UserRole.ADMIN],
      };
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures,
        companyName,
        identity,
      );
      const warehouseId = crypto.randomUUID();
      const productId = crypto.randomUUID();
      fixtures.cleanup(async () => {
        await db.delete(purchaseOrders).where(eq(purchaseOrders.companyId, companyId));
        await db.delete(paymentBills).where(eq(paymentBills.companyId, companyId));
        await db.delete(stockMovements).where(eq(stockMovements.warehouseId, warehouseId));
        await db.delete(stockLevels).where(eq(stockLevels.warehouseId, warehouseId));
        await db.delete(catalogProducts).where(eq(catalogProducts.id, productId));
        await db.delete(warehouses).where(eq(warehouses.id, warehouseId));
        await db.delete(purchasingVendors).where(eq(purchasingVendors.companyId, companyId));
      });
      await db.insert(warehouses).values({
        id: warehouseId,
        companyId,
        code: "RECV",
        name: warehouseName,
      });
      await db.insert(catalogProducts).values({
        id: productId,
        companyId,
        ownerUserId: userId,
        name: productName,
        sku: "E2E-BEARING-SET",
        type: ProductType.PHYSICAL,
        currency: "EUR",
        basePrice: unitCost,
      });

      const { page, baseUrl } = fixtures;
      await page.route(`${baseUrl}/**`, async (route) => {
        await route.continue({
          headers: { ...route.request().headers(), ...headers },
        });
      });
      const { t } = scopedTranslation.scopedT(E2E_LOCALE);
      const submit = (label: string) =>
        page.getByRole("button", { name: label, exact: true }).filter({ visible: true }).last();
      const visibleText = (label: string) =>
        page.getByText(label, { exact: true }).filter({ visible: true }).first();
      const picker = async (label: string, name: string): Promise<void> => {
        await page.getByRole("button", { name: label }).filter({ visible: true }).last().click();
        await visibleText(name).click();
        await visibleText(name).waitFor();
      };
      const submitAction = async (
        label: string,
        path: string,
      ): Promise<Awaited<ReturnType<typeof page.waitForResponse>>> => {
        const response = page.waitForResponse(
          (reply) =>
            reply.request().method() === "POST" && new URL(reply.url()).pathname.endsWith(path),
        );
        await submit(label).click();
        const reply = await response;
        expect(reply.ok()).toBe(true);
        return reply;
      };
      await fixtures.open(createVendor.POST, {
        query: { companyId },
        ready: () => submit(t("vendorCreate.post.title")).waitFor(),
      });
      await page
        .getByRole("textbox", {
          name: t("vendorCreate.name.label"),
          exact: true,
        })
        .fill(vendorName);
      await submitAction(t("vendorCreate.post.title"), "/purchasing/vendor/create");
      const [vendor] = await db
        .select()
        .from(purchasingVendors)
        .where(eq(purchasingVendors.companyId, companyId));
      expect(vendor).toMatchObject({ name: vendorName, email: null });
      if (!vendor) return;
      const [vendorDetail] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "GET" &&
            new URL(response.url()).pathname.endsWith(
              `/purchasing/vendor/${vendor.id}/get`,
            ),
        ),
        submit(t("vendorCreate.post.widget.viewVendor")).click(),
      ]);
      expect(vendorDetail.ok()).toBe(true);
      expect(await vendorDetail.finished()).toBeNull();
      await visibleText(vendorName).waitFor();

      await fixtures.open(createOrder.POST, {
        query: { companyId },
        ready: () => submit(t("orderCreate.post.title")).waitFor(),
      });
      await picker(t("orderCreate.vendorId.label"), vendorName);
      await picker(t("orderCreate.deliveryWarehouseId.label"), warehouseName);
      await submitAction(t("orderCreate.post.title"), "/purchasing/order/create");
      const [draft] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.companyId, companyId));
      expect(draft).toMatchObject({
        vendorId: vendor.id,
        deliveryWarehouseId: warehouseId,
        status: "DRAFT",
        currency: "EUR",
      });
      if (!draft) return;
      await submit(t("orderCreate.post.widget.viewOrder")).click();
      await submit(t("orderGet.get.widget.addLine")).click();
      await page
        .getByRole("textbox", {
          name: t("orderLineAdd.post.widget.productSearch"),
          exact: true,
        })
        .fill(productName);
      await submit(t("orderLineAdd.post.widget.search")).click();
      await page
        .getByRole("button", { name: productName })
        .filter({ visible: true })
        .first()
        .click();
      await page
        .getByLabel(t("orderLineAdd.post.itemDescription.label"), {
          exact: true,
        })
        .fill(productName);
      await page
        .getByLabel(t("orderLineAdd.post.quantity.label"), { exact: true })
        .fill(String(units));
      await page
        .getByLabel(t("orderLineAdd.post.unitPrice.label"), { exact: true })
        .fill(String(unitCost));
      await page.getByLabel(t("orderLineAdd.post.taxRate.label"), { exact: true }).fill("20");
      const apiOrder = `/purchasing/order/${draft.id}`;
      await submitAction(t("orderLineAdd.post.title"), "/purchasing/order/line/add");
      const [line] = await db
        .select()
        .from(purchaseOrderLines)
        .where(eq(purchaseOrderLines.poId, draft.id));
      expect(line).toMatchObject({
        productId,
        quantity: units,
        unitPrice: unitCost,
        taxRate: 0.2,
        lineTotal: orderGross,
      });
      if (!line) return;

      const openOrder = async (ready: () => Promise<void>): Promise<void> => {
        await fixtures.open(orderDefinition.GET, {
          query: { poId: draft.id },
          ready,
        });
      };
      const send = submit(t("orderGet.get.widget.send"));
      await openOrder(() => send.waitFor());
      await send.click();
      await visibleText(t("orderSend.post.widget.consequence")).waitFor();
      await submitAction(t("orderSend.post.title"), `${apiOrder}/send`);
      const confirm = submit(t("orderGet.get.widget.confirm"));
      await openOrder(() => confirm.waitFor());
      await confirm.click();
      await submitAction(t("orderConfirm.post.title"), `${apiOrder}/confirm`);
      const receive = submit(t("orderGet.get.widget.receive"));
      await openOrder(() => receive.waitFor());
      await receive.click();
      // The order's delivery warehouse is the receipt default; no override needed.
      await page.getByLabel(productName, { exact: true }).fill(String(units));
      const receiptReply = await submitAction(t("orderReceive.post.title"), `${apiOrder}/receive`);
      const receipt = z
        .object({
          success: z.literal(true),
          data: receiveDefinition.POST.responseSchema,
        })
        .parse(await receiptReply.json()).data.result;
      expect(receipt.receiptId).toBeTruthy();

      const retry = await postAtlas(fixtures, `purchasing/order/${draft.id}/receive`, {
        receiptId: receipt.receiptId,
        warehouseId,
        lines: [{ poLineId: line.id, quantityReceived: units }],
      });
      expect(retry.ok).toBe(true);
      const mismatchedRetry = await postAtlas(fixtures, `purchasing/order/${draft.id}/receive`, {
        receiptId: receipt.receiptId,
        warehouseId,
        lines: [{ poLineId: line.id, quantityReceived: units - 1 }],
      });
      expect(mismatchedRetry.ok).toBe(false);
      const storedReceipts = await db
        .select()
        .from(purchaseReceipts)
        .where(eq(purchaseReceipts.poId, draft.id));
      expect(storedReceipts).toHaveLength(1);
      expect(storedReceipts[0]).toMatchObject({
        id: receipt.receiptId,
        warehouseId,
      });
      const [stock] = await db
        .select()
        .from(stockLevels)
        .where(and(eq(stockLevels.warehouseId, warehouseId), eq(stockLevels.productId, productId)));
      expect(stock).toMatchObject({ quantityOnHand: units, reorderPoint: null, unitCost });
      if (!stock) return;
      const movements = await db
        .select()
        .from(stockMovements)
        .where(eq(stockMovements.warehouseId, warehouseId));
      expect(movements).toHaveLength(1);
      expect(movements[0]).toMatchObject({
        sourceType: "purchase_receipt",
        sourceId: receipt.receiptId,
        reference: draft.poNumber,
        quantity: units,
        unitCost,
      });
      const [received] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, draft.id));
      expect(received).toMatchObject({
        status: "RECEIVED",
        subtotal: stockValue,
        taxAmount: 9.9,
        total: orderGross,
      });

      const lateNumber = "PO-FIXTURE-OVERDUE";
      await db.insert(purchaseOrders).values({
        companyId,
        vendorId: draft.vendorId,
        poNumber: lateNumber,
        status: "CONFIRMED",
        currency: "EUR",
        createdByUserId: userId,
        expectedDeliveryDate: new Date("2020-01-01"),
      });
      const readStock = async (): Promise<z.infer<typeof stockDefinition.GET.responseSchema>> => {
        const reply = await getAtlasFixture(
          `${baseUrl}/api/${E2E_LOCALE}/inventory/stock/list`,
          { companyId, warehouseId },
          headers,
        );
        expect(reply.status).toBe(200);
        return z.object({
          success: z.literal(true),
          data: stockDefinition.GET.responseSchema,
        }).parse(await reply.json()).data;
      };
      expect((await readStock()).stockLevels).toMatchObject([{
        id: stock.id,
        quantityAvailable: units,
        reorderPoint: null,
        stockValue,
        isLowStock: true,
      }]);

      const orderPath = endpointToUrlSegment(orderDefinition.GET);
      const stockPath = endpointToUrlSegment(stockDefinition.GET);
      const stockQuery = new URLSearchParams({
        "arg.companyId": companyId,
        "arg.warehouseId": warehouseId,
      });
      for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
        const { t: localized } = scopedTranslation.scopedT(locale);
        const { t: stockT } = inventoryTranslation.scopedT(locale);
        const orderReady = async (): Promise<void> => {
          await visibleText(draft.poNumber).waitFor();
          const badge = visibleText(localized("enums.poStatus.received"));
          await badge.waitFor();
          expect(await badge.getAttribute("class")).toContain("bg-success");
          await visibleText(localized("orderGet.get.widget.precision")).waitFor();
          await visibleText(formatMoney(orderGross, "EUR", locale)).waitFor();
        };
        const listQuery = new URLSearchParams({ "arg.companyId": companyId });
        await fixtures.goto(`/tools/${endpointToUrlSegment(listOrders.GET)}?${listQuery}`, locale);
        const list = page.locator(`#admin-tool-${endpointToUrlSegment(listOrders.GET)}`);
        await page.setViewportSize({ width: 390, height: 844 });
        const statusSelect = list.getByRole("combobox", {
          name: localized("orderList.get.status.label"),
          exact: true,
        });
        await statusSelect.waitFor({ timeout: 75_000 });
        await list.getByText(localized("orderList.get.widget.attentionCount", { count: 2 }), {
          exact: true,
        }).waitFor();
        await list.getByText(localized("dashboard.get.widget.overdue"), { exact: true }).waitFor();
        await list.getByText(localized("orderList.get.widget.readyToBill"), { exact: true }).waitFor();
        const openAttentionOrder = list.getByRole("button", {
          name: localized("orderList.get.widget.openAttentionOrder", { reference: draft.poNumber }),
          exact: true,
        });
        expect(await openAttentionOrder.count()).toBe(0);
        const billed = localized("enums.poStatus.billed");
        const receivedStatus = localized("enums.poStatus.received");
        await statusSelect.click();
        await page.getByRole("option", { name: billed, exact: true }).click();
        await list.getByText(localized("orderList.get.widget.empty"), { exact: true }).waitFor();
        expect(await statusSelect.innerText()).toBe(billed);
        await statusSelect.click();
        await page.getByRole("option", { name: receivedStatus, exact: true }).click();
        expect(await statusSelect.innerText()).toBe(receivedStatus);
        const openOrder = list
          .getByRole("button", { name: draft.poNumber, exact: true })
          .filter({ visible: true })
          .first();
        await openOrder.waitFor();
        await saveAdminViewMatrix(
          page,
          "fresh-purchasing-workflow",
          `${locale}-received-order-list`,
          async () => {
            await openOrder.waitFor();
            await openAttentionOrder.waitFor();
            await list
              .getByText(localized("orderList.get.widget.attentionCount", { count: 1 }), {
                exact: true,
              })
              .waitFor();
            await list.getByText(localized("orderList.get.widget.readyToBill"), { exact: true }).waitFor();
            expect(await list.getByText(localized("dashboard.get.widget.overdue"), { exact: true }).count()).toBe(0);
          },
        );
        await openAttentionOrder.click();
        await page.waitForURL((url) =>
          url.pathname.endsWith("/tools/" + orderPath) &&
          url.searchParams.get("arg.poId") === draft.id,
        );
        await saveAdminViewMatrix(
          page,
          "fresh-purchasing-workflow",
          `${locale}-received-source-order`,
          orderReady,
        );
        await fixtures.goto(`/tools/${stockPath}?${stockQuery}`, locale);
        await saveAdminViewMatrix(
          page,
          "fresh-purchasing-workflow",
          `${locale}-warehouse-stock`,
          async () => {
            await visibleText(productName).waitFor();
            await visibleText(formatMoney(stockValue, "EUR", locale)).waitFor();
            await visibleText(formatMoney(unitCost, "EUR", locale)).waitFor();
            await visibleText(stockT("stockList.get.widget.defaultLowStockRule", {
              threshold: String(DEFAULT_LOW_STOCK_THRESHOLD),
            })).waitFor();
            await visibleText(stockT("stockList.get.widget.stockValuePrecision")).waitFor();
            await visibleText(stockT("stockList.get.widget.onHand")).waitFor();
          },
        );
      }
      await db.update(stockLevels).set({
        quantityOnHand: DEFAULT_LOW_STOCK_THRESHOLD,
        unitCost: 12.38,
      }).where(eq(stockLevels.id, stock.id));
      expect((await readStock()).stockLevels).toMatchObject([{
        quantityAvailable: DEFAULT_LOW_STOCK_THRESHOLD,
        reorderPoint: null,
        isLowStock: false,
      }]);
      await db.update(stockLevels).set({
        reorderPoint: DEFAULT_LOW_STOCK_THRESHOLD,
      }).where(eq(stockLevels.id, stock.id));
      expect((await readStock()).stockLevels).toMatchObject([{
        quantityAvailable: DEFAULT_LOW_STOCK_THRESHOLD,
        reorderPoint: DEFAULT_LOW_STOCK_THRESHOLD,
        isLowStock: true,
      }]);
      const { t: stockT } = inventoryTranslation.scopedT("en-US");
      await fixtures.goto(`/tools/${stockPath}?${stockQuery}`, "en-US");
      await visibleText(stockT("stockList.get.widget.reorderPointRule", {
        threshold: String(DEFAULT_LOW_STOCK_THRESHOLD),
      })).waitFor();
      await visibleText(stockT("stockList.get.widget.lowStock")).waitFor();
      expect(await visibleText(stockT("stockList.get.widget.stockValuePrecision")).count()).toBe(0);

      // Received order -> supplier bill through the confirmation page.
      const convertToBill = submit(t("orderGet.get.widget.convertToBill"));
      await openOrder(() => convertToBill.waitFor());
      await convertToBill.click();
      await visibleText(t("orderConvertToBill.post.widget.consequence")).waitFor();
      await submitAction(t("orderConvertToBill.post.title"), `${apiOrder}/convert-to-bill`);
      const [billedOrder] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, draft.id));
      expect(billedOrder?.status).toBe("BILLED");
      expect(billedOrder?.billId).toBeTruthy();
      const bills = await db.select().from(paymentBills).where(eq(paymentBills.companyId, companyId));
      expect(bills).toHaveLength(1);
      expect(bills[0]).toMatchObject({
        id: billedOrder?.billId,
        supplierName: vendorName,
        total: orderGross,
        journalEntryId: null,
      });
      expect((await postAtlas(fixtures, `purchasing/order/${draft.id}/convert-to-bill`, {})).ok).toBe(false);

      // A second draft: sending it empty is refused, cancelling it works.
      const secondReply = await postAtlas(fixtures, "purchasing/order/create", {
        companyId,
        vendorId: vendor.id,
        currency: "EUR",
      });
      expect(secondReply.ok).toBe(true);
      const [second] = await db
        .select()
        .from(purchaseOrders)
        .where(and(eq(purchaseOrders.companyId, companyId), eq(purchaseOrders.status, "DRAFT")));
      expect(second).toBeTruthy();
      if (!second) return;
      expect((await postAtlas(fixtures, `purchasing/order/${second.id}/send`, {})).ok).toBe(false);
      const cancelOrder = submit(t("orderGet.get.widget.cancel"));
      await fixtures.open(orderDefinition.GET, {
        query: { poId: second.id },
        ready: () => cancelOrder.waitFor(),
      });
      await cancelOrder.click();
      await visibleText(t("orderCancel.post.widget.warning")).waitFor();
      await submitAction(t("orderCancel.post.title"), `/purchasing/order/${second.id}/cancel`);
      const [cancelled] = await db
        .select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.id, second.id));
      expect(cancelled?.status).toBe("CANCELLED");

      // Deactivate the vendor, prove new orders refuse it, then reactivate it.
      await fixtures.open(deactivateVendor.POST, {
        query: { vendorId: vendor.id },
        ready: () => visibleText(t("vendorDeactivate.post.widget.warning")).waitFor(),
      });
      await submitAction(
        t("vendorDeactivate.post.title"),
        `/purchasing/vendor/${vendor.id}/deactivate`,
      );
      const vendorActive = async (): Promise<boolean | undefined> =>
        (
          await db
            .select({ isActive: purchasingVendors.isActive })
            .from(purchasingVendors)
            .where(eq(purchasingVendors.id, vendor.id))
        )[0]?.isActive;
      expect(await vendorActive()).toBe(false);
      const refused = await postAtlas(fixtures, "purchasing/order/create", {
        companyId,
        vendorId: vendor.id,
        currency: "EUR",
      });
      expect(refused.ok).toBe(false);
      await fixtures.open(updateVendor.PATCH, {
        query: { vendorId: vendor.id },
        ready: () => page.getByLabel(t("vendorUpdate.patch.name.label"), { exact: true }).waitFor(),
      });
      const nameInput = page.getByLabel(t("vendorUpdate.patch.name.label"), { exact: true });
      for (let attempt = 0; attempt < 60; attempt++) {
        if ((await nameInput.inputValue()) === vendorName) break;
        await page.waitForTimeout(250);
      }
      expect(await nameInput.inputValue()).toBe(vendorName);
      await page.getByLabel(t("vendorUpdate.patch.isActive.label"), { exact: true }).click();
      const saved = page.waitForResponse(
        (reply) =>
          reply.request().method() === "PATCH" &&
          new URL(reply.url()).pathname.endsWith(`/purchasing/vendor/${vendor.id}/update`),
      );
      await submit(t("vendorUpdate.patch.widget.save")).click();
      expect((await saved).ok()).toBe(true);
      expect(await vendorActive()).toBe(true);
      const [stillNamed] = await db
        .select()
        .from(purchasingVendors)
        .where(eq(purchasingVendors.id, vendor.id));
      expect(stillNamed).toMatchObject({ name: vendorName, email: null });
    },
    300_000,
  );
});
