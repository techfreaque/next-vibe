import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { db } from "next-vibe/database";
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
  warehouseTransferItems,
  warehouseTransfers,
} from "../db";
import list from "./list/definition";

describe("Warehouse transfer", () => {
  const e2e = useE2E("inventory/transfer");
  e2e.it(
    "dispatches and receives a draft using its reference and preserves stock value",
    async (fixtures) => {
      const { companyId, userId } = await prepareAtlasCompany(
        fixtures,
        "E2E Transfer Company",
      );
      const from = randomUUID(),
        to = randomUUID(),
        productId = randomUUID();
      const reference = "E2E Stock Transfer";
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
        await db.delete(warehouses).where(inArray(warehouses.id, [from, to]));
      });
      await db.insert(warehouses).values([
        { id: from, companyId, code: "SOURCE", name: "E2E North warehouse" },
        { id: to, companyId, code: "DEST", name: "E2E South warehouse" },
      ]);
      await db
        .insert(catalogProducts)
        .values({
          id: productId,
          companyId,
          ownerUserId: userId,
          type: ProductType.PHYSICAL,
          name: "E2E Stock case",
          basePrice: 7,
          currency: "EUR",
        });
      await db
        .insert(stockLevels)
        .values({
          warehouseId: from,
          productId,
          quantityOnHand: 5,
          unitCost: 3,
        });
      const next = await postAtlas(fixtures, "inventory/transfer/create", {
        companyId,
        fromWarehouseId: from,
        toWarehouseId: to,
        reference,
        items: [{ productId, quantityRequested: 2 }],
      });
      expect(next.ok).toBe(true);
      const [transfer] = await db
        .select()
        .from(warehouseTransfers)
        .where(eq(warehouseTransfers.companyId, companyId));
      expect(transfer?.status).toBe("DRAFT");
      const page = fixtures.page;
      await page.setViewportSize({ width: 1440, height: 900 });
      await fixtures.open(list.GET, {
        query: { "arg.companyId": companyId },
        ready: () => page.getByRole("button", { name: reference }).waitFor(),
      });
      await page.getByRole("button", { name: reference }).click();
      await page.getByRole("heading", { name: reference }).waitFor();
      await page
        .getByText("E2E Stock case", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      for (const [openLabel, submitLabel, route, state] of [
        ["Dispatch transfer", "Dispatch", "dispatch", "IN_TRANSIT"],
        ["Mark received", "Receive Transfer", "receive", "RECEIVED"],
      ] as const) {
        await page
          .getByRole("button", { name: openLabel, exact: true })
          .click();
        const submit = page.getByRole("button", {
          name: submitLabel,
          exact: true,
        });
        await submit.waitFor();
        await page
          .getByText("E2E South warehouse", { exact: true })
          .filter({ visible: true })
          .first()
          .waitFor();
        const response = page.waitForResponse(
          (r) =>
            r.request().method() === "POST" &&
            new URL(r.url()).pathname.endsWith(
              `/inventory/transfer/${transfer.id}/${route}`,
            ),
        );
        await submit.click();
        expect((await response).ok()).toBe(true);
        expect(
          (
            await db
              .select()
              .from(warehouseTransfers)
              .where(eq(warehouseTransfers.id, transfer.id))
          )[0]?.status,
        ).toBe(state);
        expect(
          (
            await postAtlas(
              fixtures,
              `inventory/transfer/${transfer.id}/${route}`,
              {},
            )
          ).ok,
        ).toBe(false);
      }
      const levels = await db
        .select()
        .from(stockLevels)
        .where(eq(stockLevels.productId, productId));
      expect(levels.find((row) => row.warehouseId === from)).toMatchObject({
        quantityOnHand: 3,
        unitCost: 3,
      });
      expect(levels.find((row) => row.warehouseId === to)).toMatchObject({
        quantityOnHand: 2,
        unitCost: 3,
      });
      expect(
        await db
          .select()
          .from(stockMovements)
          .where(eq(stockMovements.sourceId, transfer.id)),
      ).toHaveLength(2);
      expect(
        (
          await db
            .select()
            .from(warehouseTransferItems)
            .where(eq(warehouseTransferItems.transferId, transfer.id))
        )[0]?.quantityReceived,
      ).toBe(2);
      await page.getByRole("heading", { name: reference }).waitFor();
      await page
        .getByText("Received", { exact: true })
        .filter({ visible: true })
        .first()
        .waitFor();
      await saveWorkflowScreenshots(fixtures, "inventory-received");
    },
    150_000,
  );
});
