/**
 * Tax database schema
 * Defines the database tables for tax rate management
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { companies } from "../companies/db";
import { TaxTypeDB } from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Used for the tax rate value (e.g. 0.2000 = 20%)
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(5, 4)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * Tax Rates Table
 * Stores tax rates configured per company
 *
 * NOTE: taxPayableAccountId and taxReceivableAccountId are soft references
 * to accountNodes — no FK to avoid circular dependencies.
 *
 * NOTE: Using text() with enum constraint instead of pgEnum() because
 * translation keys exceed PostgreSQL's 63-byte enum label limit.
 */
export const taxRates = pgTable(
  "tax_rates",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Company association
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),

    // Identity
    name: text("name").notNull(),
    code: text("code").notNull(),
    type: text("type", { enum: TaxTypeDB }).notNull(),

    // Rate: 0.2000 = 20%
    rate: numericNumber("rate").notNull(),

    // Geographic scope (optional)
    country: text("country"),
    region: text("region"),

    // Soft references to accountNodes (no FK — avoids circular dependency)
    taxPayableAccountId: uuid("tax_payable_account_id"),
    taxReceivableAccountId: uuid("tax_receivable_account_id"),

    // Flags
    isDefault: boolean("is_default").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    isCompound: boolean("is_compound").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Unique code per company
    unique("uq_tax_rate_company_code").on(table.companyId, table.code),
    // Fast lookups by company + country
    index("idx_tax_rates_company_country").on(table.companyId, table.country),
    // Fast lookups by company
    index("idx_tax_rates_company").on(table.companyId),
  ],
);

/**
 * Relations
 */
export const taxRatesRelations = relations(taxRates, ({ one }) => ({
  company: one(companies, {
    fields: [taxRates.companyId],
    references: [companies.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectTaxRateSchema = createSelectSchema(taxRates);
export const insertTaxRateSchema = createInsertSchema(taxRates);

/**
 * Types
 */
export type TaxRate = z.infer<typeof selectTaxRateSchema>;
export type NewTaxRate = z.infer<typeof insertTaxRateSchema>;
