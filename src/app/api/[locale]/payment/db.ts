/**
 * Payment database schema
 * Defines the database tables and schemas for payment-related data
 */

import {
  boolean,
  customType,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Custom numeric type that returns numbers instead of strings
 * Used for monetary amounts in bill/estimate/invoice line tables
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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { CurrenciesArr } from "next-vibe/core/i18n/core/config";
import type { z } from "zod";

import { companies } from "../companies/db";
import { users } from "../user/db";
import {
  BillStatus,
  BillStatusDB,
  CheckoutMode,
  CheckoutModeDB,
  DisputeStatusDB,
  EstimateStatus,
  EstimateStatusDB,
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
const CurrencyDB = CurrenciesArr;

/**
 * Payment transactions table
 * Stores payment transaction records
 */
export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerSessionId: text("provider_session_id"),
  providerPaymentIntentId: text("provider_payment_intent_id"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: PaymentStatusDB })
    .notNull()
    .default(PaymentStatus.PENDING),
  provider: text("provider", { enum: PaymentProviderDB })
    .notNull()
    .default(PaymentProvider.STRIPE),
  mode: text("mode", { enum: CheckoutModeDB })
    .notNull()
    .default(CheckoutMode.PAYMENT),
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
  providerPaymentMethodId: text("provider_payment_method_id").notNull(),
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
  providerEventId: text("provider_event_id").notNull().unique(),
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
  providerRefundId: text("provider_refund_id").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: RefundStatusDB })
    .notNull()
    .default(RefundStatus.PENDING),
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
  companyId: uuid("company_id").references(() => companies.id, {
    onDelete: "set null",
  }),
  providerInvoiceId: text("provider_invoice_id").notNull(),
  invoiceNumber: text("invoice_number"),
  invoiceSequenceNumber: integer("invoice_sequence_number"),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency", { enum: CurrencyDB }).notNull(),
  status: text("status", { enum: InvoiceStatusDB })
    .notNull()
    .default(InvoiceStatus.DRAFT),
  invoiceUrl: text("invoice_url"),
  invoicePdf: text("invoice_pdf"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  callbackToken: text("callback_token").unique(),
  notes: text("notes"),
  journalEntryId: uuid("journal_entry_id"),
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
  providerDisputeId: text("provider_dispute_id").notNull(),
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

/**
 * Payment invoice lines table
 * Individual line items on an invoice
 */
export const paymentInvoiceLines = pgTable("payment_invoice_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => paymentInvoices.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  productId: uuid("product_id"),
  quantity: numericNumber("quantity").notNull().default(1),
  unitPrice: numericNumber("unit_price").notNull().default(0),
  taxRate: numericNumber("tax_rate").notNull().default(0),
  taxAmount: numericNumber("tax_amount").notNull().default(0),
  lineTotal: numericNumber("line_total").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * AP Bills table
 * Accounts Payable bills received from suppliers
 */
export const paymentBills = pgTable("payment_bills", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  supplierName: text("supplier_name").notNull(),
  supplierVatNumber: text("supplier_vat_number"),
  billNumber: text("bill_number"),
  billDate: timestamp("bill_date").notNull(),
  dueDate: timestamp("due_date"),
  currency: text("currency", { enum: CurrencyDB }).notNull().default("EUR"),
  status: text("status", { enum: BillStatusDB })
    .notNull()
    .default(BillStatus.DRAFT),
  subtotal: numericNumber("subtotal").notNull().default(0),
  taxAmount: numericNumber("tax_amount").notNull().default(0),
  total: numericNumber("total").notNull().default(0),
  notes: text("notes"),
  journalEntryId: uuid("journal_entry_id"),
  paidAt: timestamp("paid_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * AP Bill lines table
 * Individual line items on a bill
 */
export const paymentBillLines = pgTable("payment_bill_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  billId: uuid("bill_id")
    .notNull()
    .references(() => paymentBills.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  productId: uuid("product_id"),
  expenseAccountId: uuid("expense_account_id"),
  quantity: numericNumber("quantity").notNull().default(1),
  unitPrice: numericNumber("unit_price").notNull().default(0),
  taxRate: numericNumber("tax_rate").notNull().default(0),
  taxAmount: numericNumber("tax_amount").notNull().default(0),
  lineTotal: numericNumber("line_total").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Estimates table
 * Sales estimates / quotes sent to customers
 */
export const paymentEstimates = pgTable("payment_estimates", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companies.id, { onDelete: "cascade" }),
  estimateNumber: text("estimate_number").notNull(),
  status: text("status", { enum: EstimateStatusDB })
    .notNull()
    .default(EstimateStatus.DRAFT),
  customerId: uuid("customer_id"),
  customerEmail: text("customer_email"),
  customerName: text("customer_name"),
  currency: text("currency", { enum: CurrencyDB }).notNull().default("EUR"),
  validUntil: timestamp("valid_until"),
  title: text("title"),
  notes: text("notes"),
  terms: text("terms"),
  subtotal: numericNumber("subtotal").notNull().default(0),
  taxAmount: numericNumber("tax_amount").notNull().default(0),
  total: numericNumber("total").notNull().default(0),
  sentAt: timestamp("sent_at"),
  acceptedAt: timestamp("accepted_at"),
  declinedAt: timestamp("declined_at"),
  invoiceId: uuid("invoice_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Estimate lines table
 * Individual line items on an estimate
 */
export const paymentEstimateLines = pgTable("payment_estimate_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  estimateId: uuid("estimate_id")
    .notNull()
    .references(() => paymentEstimates.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  productId: uuid("product_id"),
  quantity: numericNumber("quantity").notNull().default(1),
  unitPrice: numericNumber("unit_price").notNull().default(0),
  taxRate: numericNumber("tax_rate").notNull().default(0),
  taxAmount: numericNumber("tax_amount").notNull().default(0),
  lineTotal: numericNumber("line_total").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod schemas for new tables
export const insertPaymentInvoiceLineSchema =
  createInsertSchema(paymentInvoiceLines);
export const selectPaymentInvoiceLineSchema =
  createSelectSchema(paymentInvoiceLines);

export const insertPaymentBillSchema = createInsertSchema(paymentBills);
export const selectPaymentBillSchema = createSelectSchema(paymentBills);

export const insertPaymentBillLineSchema = createInsertSchema(paymentBillLines);
export const selectPaymentBillLineSchema = createSelectSchema(paymentBillLines);

export const insertPaymentEstimateSchema = createInsertSchema(paymentEstimates);
export const selectPaymentEstimateSchema = createSelectSchema(paymentEstimates);

export const insertPaymentEstimateLineSchema =
  createInsertSchema(paymentEstimateLines);
export const selectPaymentEstimateLineSchema =
  createSelectSchema(paymentEstimateLines);

// Types for new tables
export type PaymentInvoiceLine = z.infer<typeof selectPaymentInvoiceLineSchema>;
export type NewPaymentInvoiceLine = z.infer<
  typeof insertPaymentInvoiceLineSchema
>;

export type PaymentBill = z.infer<typeof selectPaymentBillSchema>;
export type NewPaymentBill = z.infer<typeof insertPaymentBillSchema>;

export type PaymentBillLine = z.infer<typeof selectPaymentBillLineSchema>;
export type NewPaymentBillLine = z.infer<typeof insertPaymentBillLineSchema>;

export type PaymentEstimate = z.infer<typeof selectPaymentEstimateSchema>;
export type NewPaymentEstimate = z.infer<typeof insertPaymentEstimateSchema>;

export type PaymentEstimateLine = z.infer<
  typeof selectPaymentEstimateLineSchema
>;
export type NewPaymentEstimateLine = z.infer<
  typeof insertPaymentEstimateLineSchema
>;
