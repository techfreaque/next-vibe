/**
 * Products catalog database schema
 * Defines the database tables for business owner product/service catalog management
 *
 * Tables:
 * - productCategories: Hierarchical category tree for organizing catalog products
 * - catalogProducts: Core product/service definitions with pricing
 * - productPrices: Multi-currency price tiers per product
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { companies } from "../companies/db";
import { users } from "../user/db";
import { ProductTypeDB } from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Copied locally to avoid circular dependencies with credits/db.ts
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(16, 6)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * Product Categories Table
 * Hierarchical category tree for organizing catalog products
 * Supports both company-scoped and personal (ownerUserId) categories
 */
export const productCategories = pgTable(
  "product_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    parentId: uuid("parent_id"), // Self-reference defined via relations below
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_product_categories_owner").on(table.ownerUserId),
    index("idx_product_categories_company").on(table.companyId),
  ],
);

/**
 * Catalog Products Table
 * Core product/service definitions — the business owner's product catalog
 */
export const catalogProducts = pgTable(
  "catalog_products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    ownerUserId: uuid("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id").references(() => productCategories.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    description: text("description"),
    sku: text("sku"),
    type: text("type", { enum: ProductTypeDB }).notNull(),
    unit: text("unit"), // e.g. "hour", "piece", "license"
    basePrice: numericNumber("base_price").notNull().default(0),
    currency: text("currency").notNull().default("EUR"),
    defaultTaxRate: numericNumber("default_tax_rate").default(0),
    isActive: boolean("is_active").notNull().default(true),
    imageUrl: text("image_url"),
    isSubscription: boolean("is_subscription").default(false),
    billingInterval: text("billing_interval"), // "MONTHLY" | "YEARLY" | null
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_catalog_products_company_owner").on(
      table.companyId,
      table.ownerUserId,
    ),
    index("idx_catalog_products_company").on(table.companyId),
    index("idx_catalog_products_owner").on(table.ownerUserId),
    index("idx_catalog_products_category").on(table.categoryId),
  ],
);

/**
 * Product Prices Table
 * Multi-currency price tiers per product
 * Supports standard, wholesale, VIP, and other pricing tiers
 */
export const productPrices = pgTable(
  "product_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => catalogProducts.id, { onDelete: "cascade" }),
    currency: text("currency").notNull(),
    price: numericNumber("price").notNull(),
    tierName: text("tier_name"), // e.g. "standard", "wholesale", "vip"
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_product_price_tier").on(
      table.productId,
      table.currency,
      table.tierName,
    ),
  ],
);

/**
 * Relations
 */
export const productCategoriesRelations = relations(
  productCategories,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [productCategories.companyId],
      references: [companies.id],
    }),
    owner: one(users, {
      fields: [productCategories.ownerUserId],
      references: [users.id],
      relationName: "categoryOwner",
    }),
    parent: one(productCategories, {
      fields: [productCategories.parentId],
      references: [productCategories.id],
      relationName: "categoryChildren",
    }),
    children: many(productCategories, {
      relationName: "categoryChildren",
    }),
    products: many(catalogProducts),
  }),
);

export const catalogProductsRelations = relations(
  catalogProducts,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [catalogProducts.companyId],
      references: [companies.id],
    }),
    owner: one(users, {
      fields: [catalogProducts.ownerUserId],
      references: [users.id],
      relationName: "catalogProductOwner",
    }),
    category: one(productCategories, {
      fields: [catalogProducts.categoryId],
      references: [productCategories.id],
    }),
    prices: many(productPrices),
  }),
);

export const productPricesRelations = relations(productPrices, ({ one }) => ({
  product: one(catalogProducts, {
    fields: [productPrices.productId],
    references: [catalogProducts.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectProductCategorySchema =
  createSelectSchema(productCategories);
export const insertProductCategorySchema =
  createInsertSchema(productCategories);

export const selectCatalogProductSchema = createSelectSchema(catalogProducts);
export const insertCatalogProductSchema = createInsertSchema(catalogProducts);

export const selectProductPriceSchema = createSelectSchema(productPrices);
export const insertProductPriceSchema = createInsertSchema(productPrices);

/**
 * Types
 */
export type ProductCategory = z.infer<typeof selectProductCategorySchema>;
export type NewProductCategory = z.infer<typeof insertProductCategorySchema>;

export type CatalogProduct = z.infer<typeof selectCatalogProductSchema>;
export type NewCatalogProduct = z.infer<typeof insertCatalogProductSchema>;

export type ProductPrice = z.infer<typeof selectProductPriceSchema>;
export type NewProductPrice = z.infer<typeof insertProductPriceSchema>;
