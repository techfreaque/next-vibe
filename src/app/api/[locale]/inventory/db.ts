/**
 * Inventory database schema
 * Warehouses, stock levels, stock movements, and warehouse transfers
 *
 * Tables:
 * - warehouses: Physical or virtual storage locations per company
 * - stockLevels: Current on-hand, reserved, and on-order quantities per product per warehouse
 * - stockMovements: Immutable audit log of every stock change
 * - warehouseTransfers: Transfers of stock between warehouses
 * - warehouseTransferItems: Line items within a transfer
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
import { users } from "next-vibe/identity/user/db";
import type { z } from "zod";

import { companies } from "../companies/db";
import { catalogProducts } from "../products/db";
import { StockMovementTypeDB, TransferStatusDB } from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Used for stock quantities and costs - numeric(12, 4) for inventory precision
 */
const numericNumber = customType<{
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
 * Warehouses Table
 * Physical or virtual storage locations per company
 */
export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code").notNull(), // short code e.g. "WH-01"
    address: text("address"),
    isActive: boolean("is_active").notNull().default(true),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_warehouse_company_code").on(table.companyId, table.code),
    index("idx_warehouses_company").on(table.companyId),
  ],
);

/**
 * Stock Levels Table
 * Current on-hand, reserved, and on-order quantities per product per warehouse
 */
export const stockLevels = pgTable(
  "stock_levels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => catalogProducts.id, { onDelete: "cascade" }),
    quantityOnHand: numericNumber("quantity_on_hand").notNull().default(0),
    quantityReserved: numericNumber("quantity_reserved").notNull().default(0),
    quantityOnOrder: numericNumber("quantity_on_order").notNull().default(0),
    reorderPoint: numericNumber("reorder_point"), // trigger low-stock alert below this
    reorderQuantity: numericNumber("reorder_quantity"), // suggested reorder quantity
    unitCost: numericNumber("unit_cost"), // weighted average cost
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_stock_level_warehouse_product").on(
      table.warehouseId,
      table.productId,
    ),
    index("idx_stock_levels_warehouse").on(table.warehouseId),
    index("idx_stock_levels_product").on(table.productId),
  ],
);

/**
 * Stock Movements Table
 * Immutable audit log of every stock change
 * positive quantity = in, negative quantity = out
 */
export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => catalogProducts.id, { onDelete: "cascade" }),
    type: text("type", { enum: StockMovementTypeDB }).notNull(),
    quantity: numericNumber("quantity").notNull(), // positive = in, negative = out
    unitCost: numericNumber("unit_cost"),
    reference: text("reference"), // PO number, order ID, etc.
    sourceId: uuid("source_id"), // FK to source document (soft ref)
    sourceType: text("source_type"), // POS_ORDER|INVOICE|PURCHASE_ORDER|ADJUSTMENT
    notes: text("notes"),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_stock_movements_warehouse").on(table.warehouseId),
    index("idx_stock_movements_product").on(table.productId),
    index("idx_stock_movements_warehouse_product").on(
      table.warehouseId,
      table.productId,
    ),
    index("idx_stock_movements_created_at").on(table.createdAt),
  ],
);

/**
 * Warehouse Transfers Table
 * Transfers of stock between warehouses within the same company
 */
export const warehouseTransfers = pgTable(
  "warehouse_transfers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    fromWarehouseId: uuid("from_warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "restrict" }),
    toWarehouseId: uuid("to_warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "restrict" }),
    status: text("status", { enum: TransferStatusDB })
      .notNull()
      .default("DRAFT"),
    reference: text("reference"),
    notes: text("notes"),
    createdByUserId: uuid("created_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_warehouse_transfers_company").on(table.companyId),
    index("idx_warehouse_transfers_from").on(table.fromWarehouseId),
    index("idx_warehouse_transfers_to").on(table.toWarehouseId),
    index("idx_warehouse_transfers_status").on(table.status),
  ],
);

/**
 * Warehouse Transfer Items Table
 * Line items within a warehouse transfer
 */
export const warehouseTransferItems = pgTable(
  "warehouse_transfer_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    transferId: uuid("transfer_id")
      .notNull()
      .references(() => warehouseTransfers.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => catalogProducts.id, { onDelete: "restrict" }),
    quantityRequested: numericNumber("quantity_requested").notNull(),
    quantityReceived: numericNumber("quantity_received").notNull().default(0),
  },
  (table) => [index("idx_transfer_items_transfer").on(table.transferId)],
);

/**
 * Relations
 */
export const warehousesRelations = relations(warehouses, ({ one, many }) => ({
  company: one(companies, {
    fields: [warehouses.companyId],
    references: [companies.id],
  }),
  stockLevels: many(stockLevels),
  stockMovements: many(stockMovements),
  transfersFrom: many(warehouseTransfers, { relationName: "transferFrom" }),
  transfersTo: many(warehouseTransfers, { relationName: "transferTo" }),
}));

export const stockLevelsRelations = relations(stockLevels, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [stockLevels.warehouseId],
    references: [warehouses.id],
  }),
  product: one(catalogProducts, {
    fields: [stockLevels.productId],
    references: [catalogProducts.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  warehouse: one(warehouses, {
    fields: [stockMovements.warehouseId],
    references: [warehouses.id],
  }),
  product: one(catalogProducts, {
    fields: [stockMovements.productId],
    references: [catalogProducts.id],
  }),
  createdByUser: one(users, {
    fields: [stockMovements.createdByUserId],
    references: [users.id],
  }),
}));

export const warehouseTransfersRelations = relations(
  warehouseTransfers,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [warehouseTransfers.companyId],
      references: [companies.id],
    }),
    fromWarehouse: one(warehouses, {
      fields: [warehouseTransfers.fromWarehouseId],
      references: [warehouses.id],
      relationName: "transferFrom",
    }),
    toWarehouse: one(warehouses, {
      fields: [warehouseTransfers.toWarehouseId],
      references: [warehouses.id],
      relationName: "transferTo",
    }),
    createdByUser: one(users, {
      fields: [warehouseTransfers.createdByUserId],
      references: [users.id],
    }),
    items: many(warehouseTransferItems),
  }),
);

export const warehouseTransferItemsRelations = relations(
  warehouseTransferItems,
  ({ one }) => ({
    transfer: one(warehouseTransfers, {
      fields: [warehouseTransferItems.transferId],
      references: [warehouseTransfers.id],
    }),
    product: one(catalogProducts, {
      fields: [warehouseTransferItems.productId],
      references: [catalogProducts.id],
    }),
  }),
);

/**
 * Zod Schemas
 */
export const selectWarehouseSchema = createSelectSchema(warehouses);
export const insertWarehouseSchema = createInsertSchema(warehouses);

export const selectStockLevelSchema = createSelectSchema(stockLevels);
export const insertStockLevelSchema = createInsertSchema(stockLevels);

export const selectStockMovementSchema = createSelectSchema(stockMovements);
export const insertStockMovementSchema = createInsertSchema(stockMovements);

export const selectWarehouseTransferSchema =
  createSelectSchema(warehouseTransfers);
export const insertWarehouseTransferSchema =
  createInsertSchema(warehouseTransfers);

export const selectWarehouseTransferItemSchema = createSelectSchema(
  warehouseTransferItems,
);
export const insertWarehouseTransferItemSchema = createInsertSchema(
  warehouseTransferItems,
);

/**
 * Types
 */
export type Warehouse = z.infer<typeof selectWarehouseSchema>;
export type NewWarehouse = z.infer<typeof insertWarehouseSchema>;

export type StockLevel = z.infer<typeof selectStockLevelSchema>;
export type NewStockLevel = z.infer<typeof insertStockLevelSchema>;

export type StockMovement = z.infer<typeof selectStockMovementSchema>;
export type NewStockMovement = z.infer<typeof insertStockMovementSchema>;

export type WarehouseTransfer = z.infer<typeof selectWarehouseTransferSchema>;
export type NewWarehouseTransfer = z.infer<
  typeof insertWarehouseTransferSchema
>;

export type WarehouseTransferItem = z.infer<
  typeof selectWarehouseTransferItemSchema
>;
export type NewWarehouseTransferItem = z.infer<
  typeof insertWarehouseTransferItemSchema
>;
