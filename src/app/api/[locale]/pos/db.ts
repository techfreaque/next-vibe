/**
 * POS (Point of Sale) database schema
 * Terminals, sessions, orders, order items, and payments
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
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { users } from "../user/db";
import {
  PosOrderStatus,
  PosOrderStatusDB,
  PosPaymentMethodDB,
  PosSessionStatus,
  PosSessionStatusDB,
} from "./enum";

/**
 * Custom numeric type that returns numbers instead of strings
 * Used for monetary amounts - numeric(12, 4) for POS precision
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
 * POS Terminals table
 * Physical or virtual terminals per company
 */
export const posTerminals = pgTable(
  "pos_terminals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id").notNull(),
    name: text("name").notNull(),
    location: text("location"),
    currency: text("currency").notNull().default("EUR"),
    isActive: boolean("is_active").notNull().default(true),
    // Soft ref — no FK — points to the cash drawer accountNode
    cashAccountNodeId: uuid("cash_account_node_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_pos_terminals_company").on(table.companyId)],
);

/**
 * POS Sessions table
 * A cashier's shift on a terminal
 */
export const posSessions = pgTable(
  "pos_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    terminalId: uuid("terminal_id")
      .notNull()
      .references(() => posTerminals.id, { onDelete: "restrict" }),
    cashierUserId: uuid("cashier_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: text("status", { enum: PosSessionStatusDB })
      .notNull()
      .default(PosSessionStatus.OPEN),
    openedAt: timestamp("opened_at").defaultNow().notNull(),
    closedAt: timestamp("closed_at"),
    openingFloat: numericNumber("opening_float").notNull().default(0),
    closingFloat: numericNumber("closing_float"),
  },
  (table) => [
    index("idx_pos_sessions_terminal_status").on(
      table.terminalId,
      table.status,
    ),
  ],
);

/**
 * POS Orders table
 * A sales transaction within a session
 */
export const posOrders = pgTable(
  "pos_orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionId: uuid("session_id")
      .notNull()
      .references(() => posSessions.id, { onDelete: "restrict" }),
    // Soft ref — no FK — points to users.id — the customer
    customerId: uuid("customer_id"),
    status: text("status", { enum: PosOrderStatusDB })
      .notNull()
      .default(PosOrderStatus.OPEN),
    orderNumber: text("order_number").notNull(),
    currency: text("currency").notNull().default("EUR"),
    subtotal: numericNumber("subtotal").notNull().default(0),
    taxAmount: numericNumber("tax_amount").notNull().default(0),
    total: numericNumber("total").notNull().default(0),
    // Soft ref — no FK — points to journalEntries.id
    journalEntryId: uuid("journal_entry_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_pos_orders_session").on(table.sessionId),
    index("idx_pos_orders_number").on(table.orderNumber),
    index("idx_pos_orders_status").on(table.status),
  ],
);

/**
 * POS Order Items table
 * Line items within an order
 */
export const posOrderItems = pgTable(
  "pos_order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => posOrders.id, { onDelete: "cascade" }),
    // Soft ref — no FK — points to a product
    productId: uuid("product_id"),
    description: text("description").notNull(),
    quantity: numericNumber("quantity").notNull().default(1),
    unitPrice: numericNumber("unit_price").notNull(),
    taxRate: numericNumber("tax_rate").notNull().default(0),
    taxAmount: numericNumber("tax_amount").notNull().default(0),
    lineTotal: numericNumber("line_total").notNull(),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("idx_pos_order_items_order").on(table.orderId)],
);

/**
 * POS Payments table
 * Payment records for an order (can be split across methods)
 */
export const posPayments = pgTable(
  "pos_payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => posOrders.id, { onDelete: "cascade" }),
    method: text("method", { enum: PosPaymentMethodDB }).notNull(),
    amount: numericNumber("amount").notNull(),
    change: numericNumber("change").notNull().default(0),
    reference: text("reference"),
    // Soft ref — no FK — which account received payment
    accountNodeId: uuid("account_node_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("idx_pos_payments_order").on(table.orderId)],
);

/**
 * Relations
 */
export const posTerminalsRelations = relations(posTerminals, ({ many }) => ({
  sessions: many(posSessions),
}));

export const posSessionsRelations = relations(posSessions, ({ one, many }) => ({
  terminal: one(posTerminals, {
    fields: [posSessions.terminalId],
    references: [posTerminals.id],
  }),
  cashier: one(users, {
    fields: [posSessions.cashierUserId],
    references: [users.id],
  }),
  orders: many(posOrders),
}));

export const posOrdersRelations = relations(posOrders, ({ one, many }) => ({
  session: one(posSessions, {
    fields: [posOrders.sessionId],
    references: [posSessions.id],
  }),
  items: many(posOrderItems),
  payments: many(posPayments),
}));

export const posOrderItemsRelations = relations(posOrderItems, ({ one }) => ({
  order: one(posOrders, {
    fields: [posOrderItems.orderId],
    references: [posOrders.id],
  }),
}));

export const posPaymentsRelations = relations(posPayments, ({ one }) => ({
  order: one(posOrders, {
    fields: [posPayments.orderId],
    references: [posOrders.id],
  }),
}));

/**
 * Zod Schemas
 */
export const selectPosTerminalSchema = createSelectSchema(posTerminals);
export const insertPosTerminalSchema = createInsertSchema(posTerminals);

export const selectPosSessionSchema = createSelectSchema(posSessions);
export const insertPosSessionSchema = createInsertSchema(posSessions);

export const selectPosOrderSchema = createSelectSchema(posOrders);
export const insertPosOrderSchema = createInsertSchema(posOrders);

export const selectPosOrderItemSchema = createSelectSchema(posOrderItems);
export const insertPosOrderItemSchema = createInsertSchema(posOrderItems);

export const selectPosPaymentSchema = createSelectSchema(posPayments);
export const insertPosPaymentSchema = createInsertSchema(posPayments);

/**
 * Types
 */
export type PosTerminal = z.infer<typeof selectPosTerminalSchema>;
export type NewPosTerminal = z.infer<typeof insertPosTerminalSchema>;

export type PosSession = z.infer<typeof selectPosSessionSchema>;
export type NewPosSession = z.infer<typeof insertPosSessionSchema>;

export type PosOrder = z.infer<typeof selectPosOrderSchema>;
export type NewPosOrder = z.infer<typeof insertPosOrderSchema>;

export type PosOrderItem = z.infer<typeof selectPosOrderItemSchema>;
export type NewPosOrderItem = z.infer<typeof insertPosOrderItemSchema>;

export type PosPayment = z.infer<typeof selectPosPaymentSchema>;
export type NewPosPayment = z.infer<typeof insertPosPaymentSchema>;
