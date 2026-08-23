/**
 * Inventory seeds
 * Creates seed data for warehouses, companies, and stock levels
 */

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "@/companies/db";
import { CompanyMemberRole, CompanyType } from "@/companies/enum";
import { catalogProducts } from "@/products/db";

import { stockLevels, warehouses } from "./db";

/**
 * Development seed for the inventory module
 * Creates a demo company (if needed), a default warehouse, and sample stock if products exist
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;

  const adminUserId = (
    await db.select({ id: users.id }).from(users).limit(1)
  )[0]?.id;

  if (!adminUserId) {
    logger.debug("No users found — skipping inventory seed");
    return;
  }

  const adminUser = { id: adminUserId };

  // Check if a demo company already exists
  let [demoCompany] = await db
    .select({ id: companies.id })
    .from(companies)
    .where(eq(companies.ownerUserId, adminUser.id))
    .limit(1);

  if (!demoCompany) {
    const [inserted] = await db
      .insert(companies)
      .values({
        name: "Demo Company",
        type: CompanyType.B2B,
        ownerUserId: adminUser.id,
        currency: "EUR",
        isActive: true,
      })
      .returning({ id: companies.id });

    if (!inserted) {
      logger.error("Failed to create demo company");
      return;
    }

    demoCompany = { id: inserted.id };
    logger.debug(`Created demo company: ${demoCompany.id}`);

    await db
      .insert(companyMembers)
      .values({
        companyId: demoCompany.id,
        userId: adminUser.id,
        role: CompanyMemberRole.OWNER,
        isActive: true,
      })
      .onConflictDoNothing();

    logger.debug("Added admin user as company OWNER");
  } else {
    logger.debug(`Using existing company: ${demoCompany.id}`);
  }

  const companyId = demoCompany.id;

  // Ensure admin is a member (in case company existed but not membership)
  const [existingMember] = await db
    .select({ id: companyMembers.id })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.companyId, companyId),
        eq(companyMembers.userId, adminUser.id),
      ),
    )
    .limit(1);

  if (!existingMember) {
    await db.insert(companyMembers).values({
      companyId,
      userId: adminUser.id,
      role: CompanyMemberRole.OWNER,
      isActive: true,
    });
    logger.debug("Added admin user as company OWNER member");
  }

  // Check if main warehouse already exists
  const [existingWarehouse] = await db
    .select({ id: warehouses.id })
    .from(warehouses)
    .where(
      and(eq(warehouses.companyId, companyId), eq(warehouses.code, "WH-01")),
    )
    .limit(1);

  let mainWarehouseId: string;

  if (!existingWarehouse) {
    const [insertedWh] = await db
      .insert(warehouses)
      .values({
        companyId,
        name: "Main Warehouse",
        code: "WH-01",
        address: "1 Storage Drive, Warehouse District",
        isActive: true,
        isDefault: true,
      })
      .returning({ id: warehouses.id });

    if (!insertedWh) {
      logger.error("Failed to create main warehouse");
      return;
    }

    mainWarehouseId = insertedWh.id;
    logger.debug(`Created main warehouse: ${mainWarehouseId}`);

    await db
      .insert(warehouses)
      .values({
        companyId,
        name: "Secondary Warehouse",
        code: "WH-02",
        address: "2 Overflow Road, Storage Park",
        isActive: true,
        isDefault: false,
      })
      .onConflictDoNothing();

    logger.debug("Created secondary warehouse WH-02");
  } else {
    mainWarehouseId = existingWarehouse.id;
    logger.debug(`Main warehouse already exists: ${mainWarehouseId}`);
  }

  // If products exist, seed some stock levels
  const productRows = await db
    .select({ id: catalogProducts.id, name: catalogProducts.name })
    .from(catalogProducts)
    .limit(5);

  if (productRows.length === 0) {
    logger.debug("No products found — skipping stock level seed");
    return;
  }

  for (const product of productRows) {
    const [existingStock] = await db
      .select({ id: stockLevels.id })
      .from(stockLevels)
      .where(
        and(
          eq(stockLevels.warehouseId, mainWarehouseId),
          eq(stockLevels.productId, product.id),
        ),
      )
      .limit(1);

    if (!existingStock) {
      const quantity = Math.floor(Math.random() * 200) + 10;
      const reorder = Math.floor(quantity * 0.2);
      await db.insert(stockLevels).values({
        warehouseId: mainWarehouseId,
        productId: product.id,
        quantityOnHand: quantity,
        quantityReserved: Math.floor(quantity * 0.05),
        quantityOnOrder: 0,
        reorderPoint: reorder,
        reorderQuantity: reorder * 2,
        unitCost: parseFloat((Math.random() * 50 + 5).toFixed(2)),
      });
      logger.debug(
        `Seeded stock for product "${product.name}": ${quantity} units`,
      );
    }
  }
}
