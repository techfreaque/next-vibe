import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { E2E_LOCALE } from "next-vibe/tooling/testing/e2e/config";
import { useE2E } from "next-vibe/tooling/testing/e2e/harness";
import { describe, expect } from "vitest";

import {
  postAtlas,
  prepareAtlasCompany,
  saveWorkflowScreenshots,
} from "@/chart-of-accounts/tests/atlas-workflow-fixture";
import { catalogProducts } from "@/products/db";
import { ProductType } from "@/products/enum";

import {
  stockLevels,
  stockMovements,
  warehouses,
  warehouseTransfers,
} from "../db";
import { scopedTranslation } from "../i18n";
import stockList from "../stock/list/definition";
import warehouseCreate from "../warehouse/create/definition";
import transferGet from "./[transferId]/get/definition";
import transferCreate from "./create/definition";

const { t } = scopedTranslation.scopedT(E2E_LOCALE);

/**
 * A stock clerk's day: create a warehouse in the UI, receive stock, move part
 * of it with a transfer built from the source warehouse's stock, receive it,
 * cancel a second dispatched transfer, and check that stock levels and
 * movements add up.
 */
describe("Stock clerk: warehouse, stock and transfers", () => {
  const e2e = useE2E("inventory/stock-clerk");
  e2e.it(
    "creates a warehouse, transfers stock, receives one transfer and cancels another",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E Stock Clerk Company",
      );
      const productId = randomUUID();
      const product = "E2E Clerk crate";
      fixtures.cleanup(async () => {
        await db
          .delete(warehouseTransfers)
          .where(eq(warehouseTransfers.companyId, companyId));
        await db
          .delete(stockMovements)
          .where(eq(stockMovements.productId, productId));
        await db
          .delete(stockLevels)
          .where(eq(stockLevels.productId, productId));
        await db
          .delete(catalogProducts)
          .where(eq(catalogProducts.id, productId));
        await db.delete(warehouses).where(eq(warehouses.companyId, companyId));
      });
      await db.insert(catalogProducts).values({
        id: productId,
        companyId,
        ownerUserId: userId,
        type: ProductType.PHYSICAL,
        name: product,
        basePrice: 12,
        currency: "EUR",
      });
      const page = fixtures.page;
      await page.setViewportSize({ width: 1440, height: 900 });

      // 1. Create the source warehouse through the form.
      const createForm = await fixtures.open(warehouseCreate.POST, {
        query: { "arg.companyId": companyId },
      });
      await createForm.fill({ name: "E2E Clerk north", code: "CLK-N" });
      const created = await createForm.submit();
      expect(created.sent).toBe(true);
      if (!created.sent) {
        return;
      }
      expect(created.response.success).toBe(true);
      await page
        .getByText(t("warehouseCreate.post.success.title"), { exact: true })
        .waitFor();
      const [north] = await db
        .select()
        .from(warehouses)
        .where(
          and(eq(warehouses.companyId, companyId), eq(warehouses.code, "CLK-N")),
        );
      expect(north?.name).toBe("E2E Clerk north");
      if (!north) {
        return;
      }
      const southResponse = await postAtlas(
        fixtures,
        "inventory/warehouse/create",
        { companyId, name: "E2E Clerk south", code: "CLK-S" },
      );
      expect(southResponse.ok).toBe(true);
      const [south] = await db
        .select()
        .from(warehouses)
        .where(
          and(eq(warehouses.companyId, companyId), eq(warehouses.code, "CLK-S")),
        );
      if (!south) {
        expect(south).toBeDefined();
        return;
      }

      // 2. Receive 10 crates at 4 EUR into the north warehouse.
      expect(
        (
          await postAtlas(fixtures, "inventory/stock/receive", {
            warehouseId: north.id,
            productId,
            quantity: 10,
            unitCost: 4,
            reference: "E2E clerk receipt",
          })
        ).ok,
      ).toBe(true);

      // 3. Build a transfer from what the north warehouse holds.
      const reference = "E2E Clerk move";
      const transferForm = await fixtures.open(transferCreate.POST, {
        query: {
          "arg.companyId": companyId,
          "arg.fromWarehouseId": north.id,
          "arg.toWarehouseId": south.id,
        },
      });
      await transferForm.fill({ reference });
      const quantity = page.getByLabel(product, { exact: true });
      await quantity.waitFor();
      await page
        .getByText(t("transferCreate.post.widget.available", { quantity: "10" }))
        .first()
        .waitFor();
      await quantity.fill("4");
      await saveWorkflowScreenshots(fixtures, "inventory-clerk-transfer-form");
      const transferSent = await transferForm.submit();
      expect(transferSent.sent).toBe(true);
      if (!transferSent.sent) {
        return;
      }
      expect(transferSent.response.success).toBe(true);
      const [moved] = await db
        .select()
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.reference, reference));
      expect(moved?.status).toBe("DRAFT");
      if (!moved) {
        return;
      }

      // 4. Open it, dispatch, receive.
      await page
        .getByRole("button", {
          name: t("transferCreate.post.widget.viewTransfer"),
          exact: true,
        })
        .click();
      await page.getByRole("heading", { name: reference }).waitFor();
      for (const [openLabel, route, state] of [
        [t("transferGet.get.widget.dispatch"), "dispatch", "IN_TRANSIT"],
        [t("transferGet.get.widget.receive"), "receive", "RECEIVED"],
      ] as const) {
        await page.getByRole("button", { name: openLabel, exact: true }).click();
        const submit = page.locator('[data-testid="endpoint-submit"]').first();
        await submit.waitFor();
        const response = page.waitForResponse(
          (r) =>
            r.request().method() === "POST" &&
            new URL(r.url()).pathname.endsWith(
              `/inventory/transfer/${moved.id}/${route}`,
            ),
        );
        await submit.click();
        expect((await response).ok()).toBe(true);
        expect(
          (
            await db
              .select({ status: warehouseTransfers.status })
              .from(warehouseTransfers)
              .where(eq(warehouseTransfers.id, moved.id))
          )[0]?.status,
        ).toBe(state);
      }

      // 5. A second transfer goes out, then gets cancelled in the UI: stock
      // returns to the north warehouse.
      const second = await postAtlas(fixtures, "inventory/transfer/create", {
        companyId,
        fromWarehouseId: north.id,
        toWarehouseId: south.id,
        reference: "E2E Clerk recall",
        items: [{ productId, quantityRequested: 3 }],
      });
      expect(second.ok).toBe(true);
      const [recall] = await db
        .select()
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.reference, "E2E Clerk recall"));
      if (!recall) {
        expect(recall).toBeDefined();
        return;
      }
      expect(
        (
          await postAtlas(
            fixtures,
            `inventory/transfer/${recall.id}/dispatch`,
            {},
          )
        ).ok,
      ).toBe(true);
      await fixtures.open(transferGet.GET, {
        query: { "arg.transferId": recall.id },
        ready: () =>
          page.getByRole("heading", { name: "E2E Clerk recall" }).waitFor(),
      });
      await page
        .getByRole("button", {
          name: t("transferGet.get.widget.cancel"),
          exact: true,
        })
        .click();
      const cancelSubmit = page
        .locator('[data-testid="endpoint-submit"]')
        .first();
      await cancelSubmit.waitFor();
      const cancelled = page.waitForResponse(
        (r) =>
          r.request().method() === "POST" &&
          new URL(r.url()).pathname.endsWith(
            `/inventory/transfer/${recall.id}/cancel`,
          ),
      );
      await cancelSubmit.click();
      expect((await cancelled).ok()).toBe(true);
      await page
        .getByText(t("enums.transferStatus.cancelled"), { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      expect(
        (
          await postAtlas(fixtures, `inventory/transfer/${recall.id}/cancel`, {})
        ).ok,
      ).toBe(false);

      // 6. Stock levels and movements add up.
      const levels = await db
        .select()
        .from(stockLevels)
        .where(eq(stockLevels.productId, productId));
      expect(levels.find((row) => row.warehouseId === north.id)).toMatchObject(
        { quantityOnHand: 6, unitCost: 4 },
      );
      expect(levels.find((row) => row.warehouseId === south.id)).toMatchObject(
        { quantityOnHand: 4, unitCost: 4 },
      );
      const movements = await db
        .select({
          type: stockMovements.type,
          warehouseId: stockMovements.warehouseId,
          quantity: stockMovements.quantity,
        })
        .from(stockMovements)
        .where(eq(stockMovements.productId, productId));
      expect(
        movements
          .map((row) => `${row.type}:${row.warehouseId === north.id ? "N" : "S"}:${row.quantity}`)
          .toSorted(),
      ).toEqual(
        [
          "RECEIPT:N:10",
          "TRANSFER_OUT:N:-4",
          "TRANSFER_IN:S:4",
          "TRANSFER_OUT:N:-3",
          "TRANSFER_IN:N:3",
        ].toSorted(),
      );

      // 7. The stock view shows the same numbers.
      await fixtures.open(stockList.GET, {
        query: { "arg.companyId": companyId },
        ready: () =>
          page
            .getByText("E2E Clerk south", { exact: true })
            .filter({ visible: true })
            .first()
            .waitFor(),
      });
      await saveWorkflowScreenshots(fixtures, "inventory-clerk-stock");
    },
    240_000,
  );
});
