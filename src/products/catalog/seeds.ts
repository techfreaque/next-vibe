/**
 * Products Catalog Seeds
 * Seeds demo product categories and catalog products for the demo company.
 * Idempotent: skips existing records by name+ownerUserId.
 */

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import { users } from "next-vibe/identity/user/db";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies, companyMembers } from "../../companies/db";
import { catalogProducts, productCategories } from "../db";
import { ProductType } from "../enum";

export const priority = 30; // After companies (80) and users (100)

/**
 * Development seed — creates demo categories and products for the first admin user's company
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;

  const firstUserRow = (
    await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .orderBy(users.createdAt)
      .limit(1)
  )[0];

  if (!firstUserRow) {
    logger.warn("No users found — skipping products catalog seed");
    return;
  }

  const adminUser = firstUserRow;

  // Find the demo company for this user
  const memberRows = await db
    .select({ companyId: companyMembers.companyId })
    .from(companyMembers)
    .where(
      and(
        eq(companyMembers.userId, adminUser.id),
        eq(companyMembers.isActive, true),
      ),
    )
    .limit(1);

  let companyId: string | null = null;

  if (memberRows.length > 0) {
    companyId = memberRows[0].companyId;
  } else {
    const ownedCompanies = await db
      .select({ id: companies.id })
      .from(companies)
      .where(eq(companies.ownerUserId, adminUser.id))
      .limit(1);

    if (ownedCompanies.length > 0) {
      companyId = ownedCompanies[0].id;
    }
  }

  if (!companyId) {
    logger.warn(
      "No company found for admin user — skipping products catalog seed",
    );
    return;
  }

  // ---- Seed product categories ----
  const categoryDefs = [
    { name: "Services" },
    { name: "Physical Goods" },
    { name: "Digital Products" },
  ];

  const categoryIds: Record<string, string> = {};

  for (const cat of categoryDefs) {
    const existing = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(
        and(
          eq(productCategories.ownerUserId, adminUser.id),
          eq(productCategories.name, cat.name),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      categoryIds[cat.name] = existing[0].id;
      logger.debug(`Category already exists: ${cat.name} — skipping`);
      continue;
    }

    const [inserted] = await db
      .insert(productCategories)
      .values({
        ownerUserId: adminUser.id,
        companyId,
        name: cat.name,
        isActive: true,
      })
      .returning({ id: productCategories.id });

    if (!inserted) {
      logger.warn(`Failed to retrieve category id after insert: ${cat.name}`);
      continue;
    }
    categoryIds[cat.name] = inserted.id;
    logger.debug(`Seeded category: ${cat.name}`);
  }

  // ---- Seed catalog products ----
  const productDefs = [
    {
      name: "Consulting Hour",
      type: ProductType.SERVICE,
      sku: "CONSULT-1H",
      basePrice: 150.0,
      currency: "EUR",
      unit: "hour",
      categoryName: "Services",
    },
    {
      name: "Laptop Stand",
      type: ProductType.PHYSICAL,
      sku: "STAND-01",
      basePrice: 49.99,
      currency: "EUR",
      unit: "piece",
      categoryName: "Physical Goods",
    },
    {
      name: "Design Template Pack",
      type: ProductType.DIGITAL,
      sku: "TMPL-PACK-01",
      basePrice: 29.0,
      currency: "EUR",
      unit: "license",
      categoryName: "Digital Products",
    },
  ];

  for (const productDef of productDefs) {
    const existing = await db
      .select({ id: catalogProducts.id })
      .from(catalogProducts)
      .where(
        and(
          eq(catalogProducts.ownerUserId, adminUser.id),
          eq(catalogProducts.name, productDef.name),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      logger.debug(`Product already exists: ${productDef.name} — skipping`);
      continue;
    }

    const categoryId = categoryIds[productDef.categoryName];

    await db.insert(catalogProducts).values({
      ownerUserId: adminUser.id,
      companyId,
      categoryId,
      name: productDef.name,
      type: productDef.type,
      sku: productDef.sku,
      basePrice: productDef.basePrice,
      currency: productDef.currency,
      unit: productDef.unit,
      isActive: true,
    });

    logger.debug(`Seeded product: ${productDef.name}`);
  }

  logger.debug("✅ Products catalog seed complete");
}

/**
 * Production seed — same as dev
 */
export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  return dev(logger, locale);
}
