import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { createEndpointLogger } from "next-vibe/logger/server";
import { userRoles } from "next-vibe/identity/user/db";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { createTestUser, deleteTestUser } from "next-vibe/tooling/testing/testing-suite/test-users";
import { formatMoney } from "next-vibe/unified-ui/_shared/format-money";
import { describe, expect } from "vitest";
import { z } from "zod";

import { accountingPeriods, accountNodes, journalEntries, journalEntryLines } from "@/chart-of-accounts/db";
import { AccountSubtype, AccountType, LineType } from "@/chart-of-accounts/enum";
import { postAtlas, prepareAtlasCompany, saveAdminViewMatrix } from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { companies } from "@/companies/db";
import { stockLevels, stockMovements, warehouses } from "@/inventory/db";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";
import { LINE_SETTLEMENT_V1 } from "@/tax/line-settlement";

import { posOrderItems, posOrders, posPayments, posSessions, posTerminals } from "../db";
import { PosOrderStatus, PosPaymentMethod, PosSessionStatus } from "../enum";
import { scopedTranslation } from "../i18n";
import { PosOrderAddItemRepository } from "../order/[orderId]/add-item/repository";
import { PosOrderAddPaymentRepository } from "../order/[orderId]/add-payment/repository";
import { PosOrderCompleteRepository } from "../order/[orderId]/complete/repository";
import { PosOrderCreateRepository } from "../order/create/repository";
import { PosSessionOpenRepository } from "../session/open/repository";

const resultId = z.object({
  success: z.literal(true),
  data: z.object({ result: z.object({ id: z.uuid() }) }),
});

describe("POS operator cash and stock on Atlas", () => {
  const e2e = useE2E("pos/operator-sale");

  e2e.it("clicks through a taxable PLN sale and rolls stock and journal back on a short second SKU", async (fixture) => {
    const { page, baseUrl, cleanup } = fixture;
    const actor = await createTestUser(fixture.uniqueEmail("pos-operator"));
    expect(actor.success).toBe(true);
    if (!actor.success) {
      return;
    }
    const identity = {
      ...actor.data.user,
      roles: [UserPermissionRole.ADMIN, ...actor.data.user.roles],
    };
    cleanup(async () => deleteTestUser(identity.id));
    await db.insert(userRoles).values({ userId: identity.id, role: UserPermissionRole.ADMIN });
    const { companyId, userId, headers } = await prepareAtlasCompany(
      fixture, "Synthetic POS books", identity,
    );
    const origin = new URL(baseUrl).origin;
    const localePaths = ["en-US", "de-DE", "sk-SK"];
    const scopedReads = new Set<string>();
    let receiptSessionId: string | undefined;
    await page.route(
      (target) => target.origin === origin && (
        scopedReads.has(target.pathname) ||
        (receiptSessionId &&
          target.href.includes(receiptSessionId) &&
          localePaths.some((locale) => target.pathname === `/api/${locale}/pos/order/list`)) ||
        (target.searchParams.get("companyId") === companyId &&
          localePaths.some((locale) =>
            [`/api/${locale}/pos/dashboard`, `/api/${locale}/pos/product-lookup`].includes(target.pathname),
          ))
      ),
      async (route) => {
        if (route.request().method() !== "GET") {
          await route.fallback();
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
    const warehouse = randomUUID();
    const productIds = [randomUUID(), randomUUID()].toSorted();
    const [mainProductId, unavailableProductId] = productIds;
    const terminalName = "Fixture PLN Counter";
    const productName = "Fixture stocked notebook";
    const cash = randomUUID();
    const revenue = randomUUID();
    const vat = randomUUID();
    if (!mainProductId || !unavailableProductId) {
      return;
    }

    cleanup(async () => {
      const terminals = await db.select({ id: posTerminals.id }).from(posTerminals).where(eq(posTerminals.companyId, companyId));
      for (const terminal of terminals) {
        const sessions = await db.select({ id: posSessions.id }).from(posSessions).where(eq(posSessions.terminalId, terminal.id));
        for (const session of sessions) {
          await db.delete(posOrders).where(eq(posOrders.sessionId, session.id));
          await db.delete(posSessions).where(eq(posSessions.id, session.id));
        }
        await db.delete(posTerminals).where(eq(posTerminals.id, terminal.id));
      }
      await db.delete(warehouses).where(eq(warehouses.id, warehouse));
      await db.delete(catalogProducts).where(eq(catalogProducts.id, mainProductId));
      await db.delete(catalogProducts).where(eq(catalogProducts.id, unavailableProductId));
    });

    await db.update(companies).set({ currency: "PLN" }).where(eq(companies.id, companyId));
    const now = new Date();
    await db.insert(accountingPeriods).values({
      companyId,
      name: "Fixture open month",
      startDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
      endDate: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0)),
    });
    await db.insert(accountNodes).values([
      { id: cash, companyId, code: "1000", name: "Fixture cash", type: AccountType.ASSET, subtype: AccountSubtype.CASH },
      { id: revenue, companyId, code: "4100", name: "Fixture sales", type: AccountType.REVENUE, subtype: AccountSubtype.REVENUE_SALES },
      { id: vat, companyId, code: "2100", name: "Fixture VAT", type: AccountType.LIABILITY, subtype: AccountSubtype.VAT_PAYABLE },
    ]);
    await db.insert(warehouses).values({
      id: warehouse, companyId, name: "Fixture counter stock", code: "POS-1",
    });
    await db.insert(catalogProducts).values([
      { id: mainProductId, companyId, ownerUserId: userId, name: productName, sku: "FIX-POS-1", type: ProductType.PHYSICAL, basePrice: 19.99, currency: "PLN", defaultTaxRate: 0.23 },
      { id: unavailableProductId, companyId, ownerUserId: userId, name: "Fixture out of stock", sku: "FIX-POS-2", type: ProductType.PHYSICAL, basePrice: 19.99, currency: "PLN", defaultTaxRate: 0.23 },
    ]);
    await db.insert(stockLevels).values([
      { warehouseId: warehouse, productId: mainProductId, quantityOnHand: 5, quantityReserved: 1 },
      { warehouseId: warehouse, productId: unavailableProductId, quantityOnHand: 0 },
    ]);

    const terminalId = randomUUID();
    await db.insert(posTerminals).values({
      id: terminalId,
      companyId,
      name: terminalName,
      currency: "PLN",
      cashAccountNodeId: cash,
      warehouseId: warehouse,
    });

    const { t } = scopedTranslation.scopedT("en-US");
    const click = async (name: string): Promise<void> => {
      await page.getByRole("button", { name, exact: true }).last().click();
    };
    const show = async (label: string): Promise<void> => {
      await page.getByText(label, { exact: true }).filter({ visible: true }).first().waitFor({ timeout: 45_000 });
    };
    const waitForPost = (suffix: string) => page.waitForResponse(
      (reply) => reply.request().method() === "POST" &&
        new URL(reply.url()).pathname.endsWith(suffix),
    );

    const closeDrawer = async (sessionId: string): Promise<void> => {
      await click(t("sessionGet.get.widget.closeSession"));
      await page.getByLabel(t("sessionClose.post.closingFloat.label"), { exact: true }).fill("74.59");
      const closing = waitForPost("/pos/session/close");
      await click(t("sessionGet.get.widget.closeSession"));
      const closed = await closing;
      expect(closed.ok()).toBe(true);
      expect(await closed.json()).toMatchObject({
        success: true, data: { result: { cashSalesTotal: 24.59, expectedFloat: 74.59, variance: 0 } },
      });
      await show(t("sessionClose.post.widget.reconciliationTitle"));
      await show(t("sessionClose.post.success.title"));
      expect(await page.getByText(t("sessionClose.post.success.description"), { exact: true }).count()).toBe(0);
      expect(await page.getByText(sessionId.slice(0, 8).toUpperCase(), { exact: true }).count()).toBe(0);
      await show(t("sessionClose.post.widget.orderCount", { count: "1" }));
      if (process.env["POS_OPERATOR_SHOTS"] === "1") {
        await saveAdminViewMatrix(page, "pos", "operator-drawer-en");
      }
    };

    const verifyDirectReceipts = async (orderId: string, orderNumber: string): Promise<void> => {
      for (const locale of ["de-DE", "sk-SK"] as const) {
        const { t: localized } = scopedTranslation.scopedT(locale);
        await page.goto(`${baseUrl}/${locale}/tools/pos-order-get?orderId=${orderId}`, { waitUntil: "commit", timeout: 60_000 });
        await show(localized("workflow.receiptTitle"));
        const backToOrders = page.getByRole("button", { name: localized("workflow.backToSessionOrders"), exact: true });
        await backToOrders.waitFor({ state: "visible" });
        await show(localized("orderGet.get.widget.completedReadOnly"));
        await show(formatMoney(24.59, "PLN", locale));
        if (process.env["POS_OPERATOR_SHOTS"] === "1") {
          await saveAdminViewMatrix(page, "pos", `operator-receipt-${locale.slice(0, 2)}`);
        }
        await backToOrders.click();
        await page.waitForURL((url) => url.pathname.endsWith("/tools/pos-order-list"));
        await show(`#${orderNumber}`);
      }
    };

    if (process.env["POS_REVIEW_FOCUSED"] === "1") {
      const locale = "en-US";
      const logger = createEndpointLogger(false, locale);
      const opening = await PosSessionOpenRepository.openSession(
        { details: { terminalId, openingFloat: 50 } }, logger, userId, locale,
      );
      const sessionId = resultId.parse(opening).data.result.id;
      const creation = await PosOrderCreateRepository.createOrder(
        { details: { sessionId } }, userId, logger, locale,
      );
      const { id: orderId } = resultId.parse(creation).data.result;
      const added = await PosOrderAddItemRepository.addItem(
        { orderId, item: { productId: mainProductId, quantity: 1 } }, userId, logger, locale, orderId,
      );
      expect(added.success).toBe(true);
      const tender = await PosOrderAddPaymentRepository.addPayment(
        { details: { orderId, method: PosPaymentMethod.CASH, amount: 25 } }, userId, logger, locale, orderId,
      );
      expect(tender.success).toBe(true);
      const completed = await PosOrderCompleteRepository.completeOrder({ orderId }, userId, logger, locale, orderId);
      expect(completed.success).toBe(true);
      const [posted] = await db.select().from(posOrders).where(eq(posOrders.id, orderId));
      expect(posted?.journalEntryId).toBeTruthy();
      const orderNumber = z.string().parse(posted?.orderNumber);
      receiptSessionId = sessionId;
      for (const language of localePaths) {
        scopedReads.add(`/api/${language}/pos/session/${sessionId}/get`);
        scopedReads.add(`/api/${language}/pos/order/${orderId}/get`);
      }
      await page.goto(`${baseUrl}/en-US/tools/pos-dashboard?arg.companyId=${companyId}`, { waitUntil: "commit", timeout: 60_000 });
      await show(terminalName);
      await click(t("dashboard.get.widget.viewSession"));
      await closeDrawer(sessionId);
      await verifyDirectReceipts(orderId, orderNumber);
      return;
    }

    await page.goto(`${baseUrl}/en-US/tools/pos-dashboard?arg.companyId=${companyId}`, { waitUntil: "domcontentloaded" });
    await show(terminalName);
    await click(t("dashboard.get.widget.openSession"));
    await page.getByLabel(t("sessionOpen.post.openingFloat.label"), { exact: true }).fill("50");
    const opening = waitForPost("/pos/session/open");
    await click(t("dashboard.get.widget.openSession"));
    const opened = await opening;
    expect(opened.ok()).toBe(true);
    const sessionId = resultId.parse(await opened.json()).data.result.id;
    receiptSessionId = sessionId;
    for (const locale of localePaths) {
      scopedReads.add(`/api/${locale}/pos/session/${sessionId}/get`);
    }
    await click(t("workflow.openDrawer"));
    await click(t("sessionGet.get.widget.newOrder"));
    await page.getByLabel(t("orderCreate.post.sessionId.label"), { exact: true }).waitFor();
    const creating = waitForPost("/pos/order/create");
    await click(t("sessionGet.get.widget.newOrder"));
    const created = await creating;
    expect(created.ok()).toBe(true);
    const orderId = resultId.parse(await created.json()).data.result.id;
    for (const locale of localePaths) {
      scopedReads.add(`/api/${locale}/pos/order/${orderId}/get`);
    }
    const orderPath = `pos/order/${orderId}`;

    await page.getByRole("button", { name: t("orderCreate.post.widget.addItem") }).last().click();
    await page.getByPlaceholder(t("orderAddItem.post.widget.searchPlaceholder")).fill("FIX-POS-1");
    await click(t("orderAddItem.post.widget.searchButton"));
    await page.getByRole("button", { name: new RegExp(productName, "u") }).click();
    const adding = waitForPost("/add-item");
    await click(t("orderGet.get.widget.addItem"));
    expect((await adding).ok()).toBe(true);
    await show(t("orderAddItem.post.success.title"));
    await click(t("orderAddItem.post.widget.backToOrder"));
    await show(productName);

    await click(t("orderGet.get.widget.addPayment"));
    await show(t("workflow.amountDue"));
    await show(formatMoney(24.59, "PLN", "en-US"));
    await page.getByLabel(t("orderAddPayment.post.amount.label"), { exact: true }).fill("25");
    await show(formatMoney(0.41, "PLN", "en-US"));
    if (process.env["POS_OPERATOR_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "pos", "operator-tender-en");
    }
    const paying = waitForPost("/add-payment");
    await click(t("orderGet.get.widget.addPayment"));
    const paid = await paying;
    expect(paid.ok()).toBe(true);
    expect(await paid.json()).toMatchObject({ success: true, data: { result: { change: 0.41, outstanding: 0 } } });
    await show(t("orderAddPayment.post.success.title"));
    await click(t("orderAddPayment.post.widget.backToOrder"));
    await click(t("orderGet.get.widget.complete"));
    await show(t("orderComplete.post.widget.confirmTitle"));
    const completing = waitForPost("/complete");
    await click(t("orderGet.get.widget.complete"));
    expect((await completing).ok()).toBe(true);
    await click(t("workflow.viewReceipt"));
    await show(t("workflow.receiptTitle"));
    expect(await page.getByRole("button", { name: t("orderGet.get.widget.back"), exact: true }).isVisible()).toBe(true);
    await show(t("orderGet.get.widget.completedReadOnly"));
    await show(formatMoney(24.59, "PLN", "en-US"));
    if (process.env["POS_OPERATOR_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "pos", "operator-receipt-en");
    }
    await click(t("dashboard.get.widget.viewSession"));
    await closeDrawer(sessionId);

    const [drawer] = await db.select().from(posSessions).where(eq(posSessions.id, sessionId));
    expect(drawer).toMatchObject({ status: PosSessionStatus.CLOSED, closingFloat: 74.59 });
    const [order] = await db.select().from(posOrders).where(eq(posOrders.id, orderId));
    expect(order).toMatchObject({ currency: "PLN", subtotal: 19.99, taxAmount: 4.6, total: 24.59, status: PosOrderStatus.COMPLETED });
    const orderNumber = z.string().parse(order?.orderNumber);
    const [payment] = await db.select().from(posPayments).where(eq(posPayments.orderId, orderId));
    expect(payment).toMatchObject({ change: 0.41, amount: 25 });
    expect((await postAtlas(fixture, `${orderPath}/complete`, { orderId })).ok).toBe(false);
    expect(await db.select().from(stockMovements).where(eq(stockMovements.sourceId, orderId))).toMatchObject([
      { productId: mainProductId, warehouseId: warehouse, sourceType: "POS_ORDER", quantity: -1 },
    ]);
    const [entry] = await db.select().from(journalEntries).where(eq(journalEntries.sourceId, orderId));
    expect(entry?.id).toBeTruthy();
    if (entry) {
      const posted = await db.select().from(journalEntryLines).where(eq(journalEntryLines.journalEntryId, entry.id));
      expect(posted).toEqual(expect.arrayContaining([
        expect.objectContaining({ accountId: cash, amount: 24.59, type: LineType.DEBIT }),
        expect.objectContaining({ accountId: revenue, amount: 19.99, type: LineType.CREDIT }),
        expect.objectContaining({ accountId: vat, amount: 4.6, type: LineType.CREDIT }),
      ]));
    }

    const otherSession = await postAtlas(fixture, "pos/session/open", { details: { terminalId, openingFloat: 0 } });
    const failedDrawerId = resultId.parse(await otherSession.json()).data.result.id;
    const otherOrder = await postAtlas(fixture, "pos/order/create", { details: { sessionId: failedDrawerId } });
    const failedOrderId = resultId.parse(await otherOrder.json()).data.result.id;
    const failedPath = `pos/order/${failedOrderId}`;
    for (const productId of productIds) {
      expect((await postAtlas(fixture, `${failedPath}/add-item`, { orderId: failedOrderId, item: { productId, quantity: 1 } })).ok).toBe(true);
    }
    expect((await postAtlas(fixture, `${failedPath}/add-payment`, {
      details: { orderId: failedOrderId, method: PosPaymentMethod.CASH, amount: 50 },
    })).ok).toBe(true);
    expect((await postAtlas(fixture, `${failedPath}/complete`, { orderId: failedOrderId })).ok).toBe(false);
    expect(await db.select().from(stockMovements).where(eq(stockMovements.sourceId, failedOrderId))).toEqual([]);
    expect(await db.select().from(journalEntries).where(eq(journalEntries.sourceId, failedOrderId))).toEqual([]);
    const [untouched] = await db.select().from(posOrders).where(eq(posOrders.id, failedOrderId));
    expect(untouched).toMatchObject({ status: PosOrderStatus.OPEN, journalEntryId: null });
    const levels = await db.select().from(stockLevels).where(eq(stockLevels.warehouseId, warehouse));
    expect(levels.find(({ productId }) => productId === mainProductId)).toMatchObject({ quantityOnHand: 4, quantityReserved: 1 });

    await verifyDirectReceipts(orderId, orderNumber);

    const roundedOrder = await postAtlas(fixture, "pos/order/create", {
      details: { sessionId: failedDrawerId },
    });
    const roundedId = resultId.parse(await roundedOrder.json()).data.result.id;
    const roundedPath = `pos/order/${roundedId}`;
    const addRoundedLine = async (description: string): Promise<string> => {
      const added = await postAtlas(fixture, `${roundedPath}/add-item`, {
        orderId: roundedId,
        item: { description, quantity: 1, unitPrice: 1.07, taxRate: 0.23 },
      });
      const payload: ReturnType<typeof resultId.parse> = resultId.parse(await added.json());
      return payload.data.result.id;
    };
    await addRoundedLine("Synthetic cent line A");
    const removableId = await addRoundedLine("Synthetic cent line B");
    const removed = await postAtlas(fixture, `${roundedPath}/remove-item`, {
      details: { orderId: roundedId, itemId: removableId },
    });
    expect(removed.ok).toBe(true);
    const [afterRemoval] = await db.select().from(posOrders).where(eq(posOrders.id, roundedId));
    expect(afterRemoval).toMatchObject({ subtotal: 1.07, taxAmount: 0.25, total: 1.32 });
    await addRoundedLine("Synthetic cent line B");
    const lineAmounts = await db.select().from(posOrderItems).where(eq(posOrderItems.orderId, roundedId));
    expect(lineAmounts).toHaveLength(2);
    for (const line of lineAmounts) {
      expect(line).toMatchObject({ quantity: 1, unitPrice: 1.07, taxAmount: 0.25, lineTotal: 1.32 });
    }
    for (const amount of [1.32, 1.32]) {
      const tender = await postAtlas(fixture, `${roundedPath}/add-payment`, {
        details: { orderId: roundedId, method: PosPaymentMethod.CASH, amount },
      });
      expect(tender.ok).toBe(true);
    }
    expect((await postAtlas(fixture, `${roundedPath}/complete`, { orderId: roundedId })).ok).toBe(true);
    const [rounded] = await db.select().from(posOrders).where(eq(posOrders.id, roundedId));
    expect(rounded).toMatchObject({
      currency: "PLN", subtotal: 2.14, taxAmount: 0.5, total: 2.64,
      status: PosOrderStatus.COMPLETED, lineSettlement: LINE_SETTLEMENT_V1,
    });
    const roundedEntryId = z.uuid().parse(rounded?.journalEntryId);
    const roundedPosting = await db.select().from(journalEntryLines)
      .where(eq(journalEntryLines.journalEntryId, roundedEntryId));
    expect(roundedPosting).toHaveLength(4);
    expect(roundedPosting.filter((line) => line.type === LineType.DEBIT)).toMatchObject([
      { accountId: cash, amount: 1.32 },
      { accountId: cash, amount: 1.32 },
    ]);
    expect(roundedPosting).toEqual(expect.arrayContaining([
      expect.objectContaining({ accountId: revenue, amount: 2.14, type: LineType.CREDIT }),
      expect.objectContaining({ accountId: vat, amount: 0.5, type: LineType.CREDIT }),
    ]));

    scopedReads.add(`/api/en-US/${roundedPath}/get`);
    await page.goto(`${baseUrl}/en-US/tools/pos-order-get?orderId=${roundedId}`, {
      waitUntil: "commit", timeout: 60_000,
    });
    await show(t("workflow.receiptTitle"));
    await show("Synthetic cent line A");
    await show("Synthetic cent line B");
    await show(formatMoney(1.32, "PLN", "en-US"));
    await show(formatMoney(2.64, "PLN", "en-US"));
    if (process.env["POS_OPERATOR_SHOTS"] === "1") {
      await saveAdminViewMatrix(page, "pos", "operator-cent-receipt-en");
    }
  });
});
