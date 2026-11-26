/**
 * Products Catalog Seeds
 * Seeds demo product categories and catalog products for the demo company.
 * Idempotent: skips existing records by company, owner, and name.
 */

import { and, eq, inArray } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { accountNodes } from "@/chart-of-accounts/db";
import { AccountSubtype } from "@/chart-of-accounts/enum";
import { lockLedgerCompany } from "@/chart-of-accounts/shared/ledger-write";
import { paymentAccountingOffers } from "@/payment/accounting/db";
import { PaymentProvider } from "@/payment/enum";

import { DEMO_COMPANY_NAME } from "../../companies/demo-company";
import { findDemoCompany } from "../../companies/demo-company.repository";
import { catalogProducts, productCategories, productPrices } from "../db";
import { ProductType } from "../enum";
import {
  DEMO_CREDIT_PACK_SKU,
  DEMO_STOCK_SKU,
  DEMO_SUBSCRIPTION_SKU,
} from "./demo-products";

export const priority = 30; // After companies (80) and users (100)

/**
 * Development seed for the company created by the companies seed.
 */
export async function dev(
  logger: EndpointLogger,
  locale: CountryLanguage,
): Promise<void> {
  void locale;

  const demoCompany = await findDemoCompany();

  if (!demoCompany) {
    logger.warn("Products catalog seed requires the demo company", {
      companyName: DEMO_COMPANY_NAME,
    });
    return;
  }

  const { id: companyId, adminId: ownerUserId } = demoCompany;

  await db.transaction(async (tx) => {
    if (!(await lockLedgerCompany(tx, companyId))) {
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
      const existing = await tx
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

      const [inserted] = await tx
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
        sku: DEMO_STOCK_SKU,
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
      {
        name: "Studio Monthly Membership",
        type: ProductType.SERVICE,
        sku: DEMO_SUBSCRIPTION_SKU,
        basePrice: 39,
        currency: "EUR",
        unit: "month",
        categoryName: "Services",
      },
      {
        name: "Studio Credits, 100 Pack",
        type: ProductType.DIGITAL,
        sku: DEMO_CREDIT_PACK_SKU,
        basePrice: 15,
        currency: "EUR",
        unit: "pack",
        categoryName: "Digital Products",
      },
    ];

    for (const productDef of productDefs) {
      const existing = await tx
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

      await tx.insert(catalogProducts).values({
        ownerUserId,
        companyId,
        categoryId,
        name: productDef.name,
        type: productDef.type,
        sku: productDef.sku,
        basePrice: productDef.basePrice,
        currency: productDef.currency,
        unit: productDef.unit,
        defaultTaxRate: 0.19,
        isSubscription: productDef.sku === DEMO_SUBSCRIPTION_SKU,
        billingInterval:
          productDef.sku === DEMO_SUBSCRIPTION_SKU ? "MONTHLY" : null,
        isActive: true,
      });

      logger.debug(`Seeded product: ${productDef.name}`);
    }

    const offers = await tx
      .select({ id: catalogProducts.id, sku: catalogProducts.sku })
      .from(catalogProducts)
      .where(
        and(
          eq(catalogProducts.companyId, companyId),
          inArray(catalogProducts.sku, [
            DEMO_SUBSCRIPTION_SKU,
            DEMO_CREDIT_PACK_SKU,
          ]),
        ),
      );
    const accounts = await tx
      .select({
        id: accountNodes.id,
        code: accountNodes.code,
        subtype: accountNodes.subtype,
      })
      .from(accountNodes)
      .where(
        and(
          eq(accountNodes.companyId, companyId),
          eq(accountNodes.isActive, true),
          eq(accountNodes.isPostable, true),
        ),
      )
      .orderBy(accountNodes.code);
    const receivable = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.ACCOUNTS_RECEIVABLE,
    );
    const clearing = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.CURRENT_ASSET,
    );
    const revenue = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.REVENUE_SERVICE,
    );
    const liability = accounts.find(
      ({ subtype, code }) =>
        subtype === AccountSubtype.ACCRUED_LIABILITY && code === "2135",
    );
    const vat = accounts.find(
      ({ subtype }) => subtype === AccountSubtype.VAT_PAYABLE,
    );
    for (const offer of offers) {
      const subscription = offer.sku === DEMO_SUBSCRIPTION_SKU;
      const consideration = subscription ? revenue : liability;
      await tx
        .insert(productPrices)
        .values({
          productId: offer.id,
          currency: "EUR",
          tierName: "standard",
          price: subscription ? 39 : 15,
        })
        .onConflictDoNothing();
      if (receivable && clearing && consideration) {
        await tx
          .insert(paymentAccountingOffers)
          .values({
            companyId,
            productId: offer.id,
            provider: PaymentProvider.STRIPE,
            merchantId: `erp-demo-${companyId}`,
            offerId: subscription
              ? "price_demo_studio_monthly"
              : "price_demo_studio_credits",
            currency: "EUR",
            recognition: subscription ? "immediate" : "deferred",
            receivableAccountId: receivable.id,
            clearingAccountId: clearing.id,
            considerationAccountId: consideration.id,
            vatAccountId: vat?.id,
            active: true,
          })
          .onConflictDoNothing();
      }
    }
  });

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
