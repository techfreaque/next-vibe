import { randomUUID } from "node:crypto";

import { eq, inArray } from "drizzle-orm";
import { endpointToUrlSegment } from "next-vibe/core/core-utils/path";
import { db } from "next-vibe/database";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import {
  formatMoney,
  formatQuantity,
} from "next-vibe/unified-ui/_shared/format-money";
import type { Locator } from "playwright";
import { describe, expect } from "vitest";

import {
  postAtlas,
  prepareAtlasCompany,
  saveAdminViewMatrix,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";

import { purchaseOrderLines, purchaseOrders, purchasingVendors } from "../../../db";
import { scopedTranslation } from "../../../i18n";
import orderDefinition from "../../[poId]/get/definition";
import remove from "./definition";

async function expectVisibleAmountRow(
  section: Locator,
  label: string,
  amount: string,
): Promise<void> {
  const labelCell = section
    .getByTestId("purchase-removal-amount")
    .getByText(label, { exact: true });
  const row = labelCell.locator("..");
  const amountCell = row.getByText(amount, { exact: true });
  await labelCell.waitFor();
  await amountCell.waitFor();
  const layout = await row.evaluate((node) => {
    const labelNode = node.children.item(0);
    const amountNode = node.children.item(1);
    if (!labelNode || !amountNode) {
      return null;
    }
    const rowBox = node.getBoundingClientRect();
    const labelBox = labelNode.getBoundingClientRect();
    const amountBox = amountNode.getBoundingClientRect();
    return {
      separated: labelBox.left >= rowBox.left - 1 &&
        amountBox.left >= labelBox.right + 4 &&
        amountBox.right <= rowBox.right + 1,
      labelFits: labelNode.scrollWidth <= labelNode.clientWidth + 1,
      amountFits: amountNode.scrollWidth <= amountNode.clientWidth + 1,
    };
  });
  expect(layout, label).toEqual({
    separated: true,
    labelFits: true,
    amountFits: true,
  });
}

describe("Purchase order line removal", () => {
  const e2e = useE2E("purchasing/line-removal");
  for (const locale of ["en-US", "de-DE", "sk-SK"] as const) {
    e2e.it(`${locale}: cancels once, removes one named draft line and sees revised totals`, async (fixtures) => {
      const { page, capture } = fixtures;
      const { companyId, userId, headers } = await prepareAtlasCompany(
        fixtures, "E2E Line Removal Books",
      );
      const poId = randomUUID();
      const sentId = randomUUID();
      const vendorId = randomUUID();
      const lineId = randomUUID();
      const keepId = randomUUID();
      const sentLine = randomUUID();
      const orderNumber = "E2E-PO-REMOVE";
      const selected = "Fixture packing tape";
      const other = "Fixture mailing cartons";
      fixtures.cleanup(async () => {
        await db.delete(purchaseOrders).where(inArray(purchaseOrders.id, [poId, sentId]));
        await db.delete(purchasingVendors).where(eq(purchasingVendors.id, vendorId));
      });
      await db.insert(purchasingVendors).values({
        id: vendorId, companyId, name: "E2E Packaging",
      });
      const order = { companyId, vendorId, currency: "EUR", createdByUserId: userId };
      await db.insert(purchaseOrders).values([
        { ...order, id: poId, poNumber: orderNumber, status: "DRAFT", subtotal: 16.625, taxAmount: 3.325, total: 19.95 },
        { ...order, id: sentId, poNumber: "E2E-PO-SENT", status: "SENT", subtotal: 6, taxAmount: 1.2, total: 7.2 },
      ]);
      const keepLine = { description: other, quantity: 2, unitPrice: 3, taxRate: 0.2, taxAmount: 1.2, lineTotal: 7.2 };
      await db.insert(purchaseOrderLines).values([
        { id: lineId, poId, description: selected, quantity: 2.5, unitPrice: 4.25, taxRate: 0.2, taxAmount: 2.125, lineTotal: 12.75 },
        { ...keepLine, id: keepId, poId },
        { ...keepLine, id: sentLine, poId: sentId },
      ]);
      await page.route(`${fixtures.baseUrl}/**`, async (route) => {
        await route.continue({ headers: { ...route.request().headers(), ...headers } });
      });
      const mutationPath = "purchasing/order/line/remove";

      const { t } = scopedTranslation.scopedT(locale);
      const action = page.getByRole("button", {
        name: `${t("orderLineRemove.post.titleShort")} ${selected}`, exact: true,
      });
      const dialog = page.getByRole("dialog");
      const selection = dialog.getByTestId("purchase-line-confirmation");
      const confirm = dialog.getByRole("button", {
        name: t("orderLineRemove.post.title"), exact: true,
      });
      const cancel = dialog.getByRole("button", {
        name: t("orderLineRemove.post.widget.cancel"), exact: true,
      });
      const trackWrites: string[] = [];
      page.on("request", (request) => {
        if (request.method() === "POST" &&
          new URL(request.url()).pathname.endsWith(mutationPath)) {
          trackWrites.push(request.method());
        }
      });
      const path = `/tools/${endpointToUrlSegment(orderDefinition.GET)}?arg.poId=${poId}`;
      await fixtures.goto(path, locale);
      await action.click();
      await selection.getByText(selected, { exact: true }).waitFor();
      await selection.getByText(formatQuantity(2.5, locale), { exact: true }).waitFor();
      await selection.getByText(formatMoney(12.75, "EUR", locale), { exact: true }).waitFor();
      await cancel.click();
      await dialog.waitFor({ state: "hidden" });
      expect(trackWrites).toEqual([]);
      expect(await db.select().from(purchaseOrderLines).where(eq(purchaseOrderLines.poId, poId))).toHaveLength(2);

      await action.click();
      await saveAdminViewMatrix(page, "purchase-line-removal", `${locale}-confirm`, async () => {
        await selection.getByText(selected, { exact: true }).waitFor();
        await confirm.waitFor();
        await expectVisibleAmountRow(
          selection,
          t("orderLineAdd.post.quantity.label"),
          formatQuantity(2.5, locale),
        );
        await expectVisibleAmountRow(
          selection,
          t("orderGet.get.widget.colLineTotal"),
          formatMoney(12.75, "EUR", locale),
        );
      });
      const removed = await capture(remove.POST, () => confirm.click());
      expect(removed.response).toMatchObject({
        success: true, data: { result: { removedDescription: selected, currency: "EUR", subtotal: 6, taxAmount: 1.2, total: 7.2 } },
      });
      expect(trackWrites).toEqual(["POST"]);
      expect(await db.select().from(purchaseOrderLines).where(eq(purchaseOrderLines.poId, poId))).toMatchObject([
        { ...keepLine, id: keepId },
      ]);
      expect((await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, poId)))[0]).toMatchObject({
        subtotal: 6, taxAmount: 1.2, total: 7.2,
      });
      expect((await postAtlas(fixtures, mutationPath, { poId, lineId })).status).toBe(404);
      const result = dialog.getByTestId("purchase-line-removal-result");
      const success = result.getByText(t("orderLineRemove.post.success.title"), { exact: true });
      const totalsLabel = t("orderLineRemove.post.widget.updatedOrderTotals");
      const totalsGroup = result.getByRole("group", { name: totalsLabel, exact: true });
      const heading = page.getByText(orderNumber, { exact: true });
      const orderTotal = page.getByText(formatMoney(7.2, "EUR", locale), { exact: true })
        .and(page.locator(":not([role=dialog] *)"));
      const revisedSubtotal = page.getByText(formatMoney(6, "EUR", locale), { exact: true })
        .and(page.locator(":not([role=dialog] *)"));
      const revisedTax = page.getByText(formatMoney(1.2, "EUR", locale), { exact: true })
        .and(page.locator(":not([role=dialog] *)"));
      await saveAdminViewMatrix(page, "purchase-line-removal", `${locale}-removed`, async () => {
        await success.waitFor();
        await heading.waitFor();
        await revisedSubtotal.waitFor();
        await revisedTax.waitFor();
        await orderTotal.filter({ visible: true }).first().waitFor();
        await action.waitFor({ state: "hidden" });
        await result.getByText(selected, { exact: true }).waitFor();
        await totalsGroup.getByText(totalsLabel, { exact: true }).waitFor();
        expect(await totalsGroup.getByText(selected, { exact: true }).count()).toBe(0);
        await expectVisibleAmountRow(
          totalsGroup,
          t("orderLineRemove.post.response.subtotal"),
          formatMoney(6, "EUR", locale),
        );
        await expectVisibleAmountRow(
          totalsGroup,
          t("orderLineRemove.post.response.taxAmount"),
          formatMoney(1.2, "EUR", locale),
        );
        await expectVisibleAmountRow(
          totalsGroup,
          t("orderLineRemove.post.response.total"),
          formatMoney(7.2, "EUR", locale),
        );
      });
      await dialog.getByRole("button", {
        name: t("orderLineRemove.post.widget.backToOrder"), exact: true,
      }).click();
      await page.getByText(other, { exact: true }).filter({ visible: true }).first().waitFor();
      await action.waitFor({ state: "hidden" });
      expect(await page.getByText(formatMoney(7.2, "EUR", locale), { exact: true }).count()).toBeGreaterThan(0);
      expect((await postAtlas(fixtures, mutationPath, { poId: sentId, lineId: sentLine })).status).toBe(409);
      expect((await postAtlas(fixtures, mutationPath, { poId, lineId: sentLine })).status).toBe(404);
    });
  }
});
