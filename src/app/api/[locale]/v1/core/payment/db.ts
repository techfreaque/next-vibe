/**
 * Payment database schema
 * Defines the database tables and schemas for payment-related data
 */

import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { Currencies } from "@/i18n/core/config";

import { users } from "../user/db";
import {
  CheckoutMode,
  CheckoutModeDB,
  DisputeStatusDB,
  InvoiceStatus,
  InvoiceStatusDB,
  PaymentMethodTypeDB,
  PaymentProvider,
  PaymentProviderDB,
  PaymentStatus,
  PaymentStatusDB,
  RefundStatus,
  RefundStatusDB,
} from "./enum";

// Create currency enum from i18n config
const CurrencyDB = Object.values(Currencies) as [string, ...string[]];

/**
 * Payment transactions table
 * Stores payment transaction records
 */
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: PaymentStatusDB }).notNull().default(PaymentStatus.PENDING),
  provider: text("provider", { enum: PaymentProviderDB })
    .notNull()
    .default(PaymentProvider.STRIPE),
  mode: text("mode", { enum: CheckoutModeDB }).notNull().default(CheckoutMode.PAYMENT),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Payment methods table
 * Stores user payment methods
 */
export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  type: text("type", { enum: PaymentMethodTypeDB }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  last4: text("last4"),
  brand: text("brand"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Payment webhooks table
 * Stores webhook events for audit and debugging
 */
export const paymentWebhooks = pgTable("payment_webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeEventId: text("stripe_event_id").notNull().unique(),
  eventType: text("event_type").notNull(),
  processed: boolean("processed").notNull().default(false),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
});

/**
 * Refund status enum
 */

/**
 * Invoice status enum
 */

/**
 * Dispute status enum
 */

/**
 * Payment refunds table
 * Stores refund records
 */
export const paymentRefunds = pgTable("payment_refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => paymentTransactions.id, { onDelete: "cascade" }),
  stripeRefundId: text("stripe_refund_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: RefundStatusDB }).notNull().default(RefundStatus.PENDING),
  reason: text("reason"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Payment invoices table
 * Stores invoice records
 */
export const paymentInvoices = pgTable("payment_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeInvoiceId: text("stripe_invoice_id").notNull(),
  invoiceNumber: text("invoice_number"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: InvoiceStatusDB }).notNull().default(InvoiceStatus.DRAFT),
  invoiceUrl: text("invoice_url"),
  invoicePdf: text("invoice_pdf"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Payment disputes table
 * Stores dispute/chargeback records
 */
export const paymentDisputes = pgTable("payment_disputes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => paymentTransactions.id, { onDelete: "cascade" }),
  stripeDisputeId: text("stripe_dispute_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: DisputeStatusDB }).notNull(),
  reason: text("reason"),
  evidenceDueBy: timestamp("evidence_due_by"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Create Zod schemas for validation
export const insertPaymentTransactionSchema =
  createInsertSchema(paymentTransactions);
export const selectPaymentTransactionSchema =
  createSelectSchema(paymentTransactions);

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods);
export const selectPaymentMethodSchema = createSelectSchema(paymentMethods);

export const insertPaymentWebhookSchema = createInsertSchema(paymentWebhooks);
export const selectPaymentWebhookSchema = createSelectSchema(paymentWebhooks);

export const insertPaymentRefundSchema = createInsertSchema(paymentRefunds);
export const selectPaymentRefundSchema = createSelectSchema(paymentRefunds);

export const insertPaymentInvoiceSchema = createInsertSchema(paymentInvoices);
export const selectPaymentInvoiceSchema = createSelectSchema(paymentInvoices);

export const insertPaymentDisputeSchema = createInsertSchema(paymentDisputes);
export const selectPaymentDisputeSchema = createSelectSchema(paymentDisputes);

// Export types
export type PaymentTransaction = z.infer<typeof selectPaymentTransactionSchema>;
export type NewPaymentTransaction = z.infer<
  typeof insertPaymentTransactionSchema
>;

export type PaymentMethod = z.infer<typeof selectPaymentMethodSchema>;
export type NewPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;

export type PaymentWebhook = z.infer<typeof selectPaymentWebhookSchema>;
export type NewPaymentWebhook = z.infer<typeof insertPaymentWebhookSchema>;

export type PaymentRefund = z.infer<typeof selectPaymentRefundSchema>;
export type NewPaymentRefund = z.infer<typeof insertPaymentRefundSchema>;

export type PaymentInvoice = z.infer<typeof selectPaymentInvoiceSchema>;
export type NewPaymentInvoice = z.infer<typeof insertPaymentInvoiceSchema>;

export type PaymentDispute = z.infer<typeof selectPaymentDisputeSchema>;
export type NewPaymentDispute = z.infer<typeof insertPaymentDisputeSchema>;

