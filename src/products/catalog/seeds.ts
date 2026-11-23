/**
 * Products Catalog Seeds
 * Seeds demo product categories and catalog products for the demo company.
 * Idempotent: skips existing records by company, owner, and name.
 */

import { and, eq } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { companies } from "../../companies/db";
import { DEMO_COMPANY_NAME } from "../../companies/demo-company";
import { catalogProducts, productCategories } from "../db";
import { ProductType } from "../enum";

export const priority = 30; // After companies (80) and users (100)

/**
 * Development seed for the company created by the companies seed.
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;

  const [demoCompany] = await db
    .select({ companyId: companies.id, ownerUserId: companies.ownerUserId })
    .from(companies)
    .where(eq(companies.name, DEMO_COMPANY_NAME))
    .orderBy(companies.createdAt, companies.id)
    .limit(1);

  if (!demoCompany) {
    logger.warn("Products catalog seed requires the demo company", {
      companyName: DEMO_COMPANY_NAME,
    });
    return;
  }

  const { companyId, ownerUserId } = demoCompany;

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
          eq(productCategories.companyId, companyId),
          eq(productCategories.ownerUserId, ownerUserId),
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
        ownerUserId,
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
          eq(catalogProducts.companyId, companyId),
          eq(catalogProducts.ownerUserId, ownerUserId),
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
      ownerUserId,
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
 * Production seed — none. The catalog rows above are demo data (consulting
 * hour, laptop stand, template pack); a production catalog is created by its
 * owner. Running dev() here used to warn on every prod boot because prod's
 * first user is not the demo company's owner.
 */
export async function prod(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;
  logger.debug("Products catalog: no production seed (demo data only)");
}
