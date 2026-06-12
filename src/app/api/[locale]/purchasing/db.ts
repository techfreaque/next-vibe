/**
 * Purchasing database schema
 * Vendors, Purchase Orders, Receipts
 */

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
import { PurchaseOrderStatusDB } from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 */
const numericNumber = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(14, 4)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

const numericNumber12 = customType<{
  data: number;
  driverData: string;
}>({
  dataType() {
    return "numeric(12, 4)";
  },
  toDriver(value: number): string {
    return value.toString();
  },
  fromDriver(value: string): number {
    return Number(value);
  },
});

/**
 * Vendors table
 * Supplier master data for a company
 */
export const purchasingVendors = pgTable(
  "purchasing_vendors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code"),
    email: text("email"),
    phone: text("phone"),
    website: text("website"),
    vatNumber: text("vat_number"),
    taxId: text("tax_id"),
    // Address
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    region: text("region"),
    postalCode: text("postal_code"),
    country: text("country"),
    // Defaults
    defaultCurrency: text("default_currency").notNull().default("EUR"),
    defaultPaymentTermsDays: integer("default_payment_terms_days").default(30),
    // Soft ref to tax/rates — no FK to avoid cross-module deps
    defaultTaxRateId: uuid("default_tax_rate_id"),
    // Status
    isActive: boolean("is_active").notNull().default(true),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_purchasing_vendors_company").on(table.companyId),
    index("idx_purchasing_vendors_company_active").on(
      table.companyId,
      table.isActive,
    ),
    unique("uq_purchasing_vendors_company_code").on(
      table.companyId,
      table.code,
    ),
  ],
);

/**
 * Purchase Orders table
 */
export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => purchasingVendors.id, { onDelete: "restrict" }),
    poNumber: text("po_number").notNull(),
    status: text("status", { enum: PurchaseOrderStatusDB })
      .notNull()
      .default("DRAFT"),
    currency: text("currency").notNull(),
    expectedDeliveryDate: timestamp("expected_delivery_date"),
    // Soft ref to inventory/warehouses — no FK to avoid cross-module deps
    deliveryWarehouseId: uuid("delivery_warehouse_id"),
    notes: text("notes"),
    subtotal: numericNumber("subtotal").notNull().default(0),
    taxAmount: numericNumber("tax_amount").notNull().default(0),
    total: numericNumber("total").notNull().default(0),
    // Soft ref to payment_bills when converted — no FK
    billId: uuid("bill_id"),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    confirmedAt: timestamp("confirmed_at"),
    receivedAt: timestamp("received_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_purchase_orders_company_status").on(
      table.companyId,
      table.status,
    ),
    index("idx_purchase_orders_company_vendor").on(
      table.companyId,
      table.vendorId,
    ),
    index("idx_purchase_orders_vendor").on(table.vendorId),
    unique("uq_purchase_orders_company_number").on(
      table.companyId,
      table.poNumber,
    ),
  ],
);

/**
 * Purchase Order Lines table
 */
export const purchaseOrderLines = pgTable("purchase_order_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  poId: uuid("po_id")
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: "cascade" }),
  // Soft ref to catalogProducts — no FK to avoid cross-module deps
  productId: uuid("product_id"),
  description: text("description").notNull(),
  quantity: numericNumber12("quantity").notNull(),
  unitPrice: numericNumber12("unit_price").notNull(),
  taxRate: numericNumber12("tax_rate").notNull().default(0),
  taxAmount: numericNumber12("tax_amount").notNull().default(0),
  lineTotal: numericNumber12("line_total").notNull(),
  quantityReceived: numericNumber12("quantity_received").notNull().default(0),
  sortOrder: integer("sort_order").default(0),
});

/**
 * Purchase Receipts table
 * Records a delivery of goods against a PO
 */
export const purchaseReceipts = pgTable(
  "purchase_receipts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    poId: uuid("po_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    // Soft ref to inventory/warehouses — no FK
    warehouseId: uuid("warehouse_id"),
    receivedByUserId: uuid("received_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    receivedAt: timestamp("received_at").defaultNow().notNull(),
    notes: text("notes"),
  },
  (table) => [index("idx_purchase_receipts_po").on(table.poId)],
);

/**
 * Purchase Receipt Lines table
 */
export const purchaseReceiptLines = pgTable("purchase_receipt_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  receiptId: uuid("receipt_id")
    .notNull()
    .references(() => purchaseReceipts.id, { onDelete: "cascade" }),
  poLineId: uuid("po_line_id")
    .notNull()
    .references(() => purchaseOrderLines.id, { onDelete: "cascade" }),
  quantityReceived: numericNumber12("quantity_received").notNull(),
});

// Zod schemas
export const insertPurchasingVendorSchema =
  createInsertSchema(purchasingVendors);
export const selectPurchasingVendorSchema =
  createSelectSchema(purchasingVendors);

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders);
export const selectPurchaseOrderSchema = createSelectSchema(purchaseOrders);

export const insertPurchaseOrderLineSchema =
  createInsertSchema(purchaseOrderLines);
export const selectPurchaseOrderLineSchema =
  createSelectSchema(purchaseOrderLines);

export const insertPurchaseReceiptSchema = createInsertSchema(purchaseReceipts);
export const selectPurchaseReceiptSchema = createSelectSchema(purchaseReceipts);

export const insertPurchaseReceiptLineSchema =
  createInsertSchema(purchaseReceiptLines);
export const selectPurchaseReceiptLineSchema =
  createSelectSchema(purchaseReceiptLines);

// Export types
export type PurchasingVendor = z.infer<typeof selectPurchasingVendorSchema>;
export type NewPurchasingVendor = z.infer<typeof insertPurchasingVendorSchema>;

export type PurchaseOrder = z.infer<typeof selectPurchaseOrderSchema>;
export type NewPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;

export type PurchaseOrderLine = z.infer<typeof selectPurchaseOrderLineSchema>;
export type NewPurchaseOrderLine = z.infer<
  typeof insertPurchaseOrderLineSchema
>;

export type PurchaseReceipt = z.infer<typeof selectPurchaseReceiptSchema>;
export type NewPurchaseReceipt = z.infer<typeof insertPurchaseReceiptSchema>;

export type PurchaseReceiptLine = z.infer<
  typeof selectPurchaseReceiptLineSchema
>;
export type NewPurchaseReceiptLine = z.infer<
  typeof insertPurchaseReceiptLineSchema
>;
