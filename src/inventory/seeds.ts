import { and, eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import {
  demoRecordId,
  findDemoCompany,
} from "@/companies/demo-company.repository";
import { DEMO_STOCK_SKU } from "@/products/catalog/demo-products";
import { catalogProducts } from "@/products/db";

import {
  stockLevels,
  stockMovements,
  warehouses,
  warehouseTransferItems,
  warehouseTransfers,
} from "./db";
import { DEMO_MAIN_WAREHOUSE_CODE } from "./demo-warehouse";

export const priority = 25;

export async function dev(logger: EndpointLogger): Promise<void> {
  const company = await findDemoCompany();
  if (!company) {
    logger.warn("Inventory seed requires the demo company");
    return;
  }
  const { id: companyId, adminId } = company;
  const overflowCode = "WH-02";
  await db.transaction(async (tx) => {
    await tx
      .insert(warehouses)
      .values([
        {
          companyId,
          name: "Main Warehouse",
          code: DEMO_MAIN_WAREHOUSE_CODE,
          address: "Berlin Studio",
          isDefault: true,
        },
        {
          companyId,
          name: "Secondary Warehouse",
          code: overflowCode,
          address: "Berlin Workshop",
        },
      ])
      .onConflictDoNothing();
    const locations = await tx
      .select({ id: warehouses.id, code: warehouses.code })
      .from(warehouses)
      .where(
        and(eq(warehouses.companyId, companyId), eq(warehouses.isActive, true)),
      );
    const main = locations.find(
      ({ code }) => code === DEMO_MAIN_WAREHOUSE_CODE,
    );
    const overflow = locations.find(({ code }) => code === overflowCode);
    const [product] = await tx
      .select({ id: catalogProducts.id })
      .from(catalogProducts)
      .where(
        and(
          eq(catalogProducts.companyId, companyId),
          eq(catalogProducts.sku, DEMO_STOCK_SKU),
        ),
      )
      .limit(1);
    if (!main || !overflow || !product) {
      return;
    }

    for (const { warehouseId, quantity } of [
      { warehouseId: main.id, quantity: 24 },
      { warehouseId: overflow.id, quantity: 3 },
    ]) {
      const [level] = await tx
        .insert(stockLevels)
        .values({
          warehouseId,
          productId: product.id,
          quantityOnHand: quantity,
          reorderPoint: 5,
          reorderQuantity: 12,
          unitCost: 24,
        })
        .onConflictDoNothing()
        .returning({ id: stockLevels.id });
      if (level) {
        await tx.insert(stockMovements).values({
          warehouseId,
          productId: product.id,
          type: "RECEIPT",
          quantity,
          unitCost: 24,
          reference: "DEMO-OPENING-STOCK",
          createdByUserId: adminId,
        });
      }
    }

    const transferId = demoRecordId(companyId, "transfer:studio-restock");
    const [transfer] = await tx
      .insert(warehouseTransfers)
      .values({
        id: transferId,
        companyId,
        fromWarehouseId: main.id,
        toWarehouseId: overflow.id,
        status: "DRAFT",
        reference: "DEMO-TR-001",
        notes: "Restock the workshop ahead of the next event.",
        createdByUserId: adminId,
      })
      .onConflictDoNothing()
      .returning({ id: warehouseTransfers.id });
    if (transfer) {
      await tx.insert(warehouseTransferItems).values({
        transferId,
        productId: product.id,
        quantityRequested: 5,
      });
    }
  });
  logger.debug("ERP demo inventory is ready", { companyId });
}
