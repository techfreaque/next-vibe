import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { accountNodes, journalEntries } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { catalogProducts } from "@/products/db";

import { paymentInvoices, paymentTransactions } from "../db";
import { PaymentProviderDB } from "../enum";
import { accountingSourceKinds, recognitionPolicies } from "./constants";

export const paymentAccountingOffers = pgTable(
  "payment_accounting_offers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => catalogProducts.id),
    provider: text("provider", { enum: PaymentProviderDB }).notNull(),
    merchantId: text("merchant_id").notNull(),
    offerId: text("offer_id").notNull(),
    currency: text("currency").notNull(),
    recognition: text("recognition", { enum: recognitionPolicies }).notNull(),
    receivableAccountId: uuid("receivable_account_id")
      .notNull()
      .references(() => accountNodes.id),
    clearingAccountId: uuid("clearing_account_id")
      .notNull()
      .references(() => accountNodes.id),
    considerationAccountId: uuid("consideration_account_id")
      .notNull()
      .references(() => accountNodes.id),
    vatAccountId: uuid("vat_account_id").references(() => accountNodes.id),
    expenseAccountId: uuid("expense_account_id").references(
      () => accountNodes.id,
    ),
    allowUnstatedZeroTax: boolean("allow_unstated_zero_tax")
      .notNull()
      .default(false),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("payment_accounting_offer_identity").on(
      table.provider,
      table.merchantId,
      table.offerId,
      table.currency,
    ),
  ],
);

export const paymentAccountingPostings = pgTable(
  "payment_accounting_postings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    mappingId: uuid("mapping_id")
      .notNull()
      .references(() => paymentAccountingOffers.id),
    transactionId: uuid("transaction_id").references(
      () => paymentTransactions.id,
      { onDelete: "set null" },
    ),
    invoiceId: uuid("invoice_id").references(() => paymentInvoices.id, {
      onDelete: "set null",
    }),
    journalEntryId: uuid("journal_entry_id")
      .notNull()
      .references(() => journalEntries.id),
    receiptEntryId: uuid("receipt_entry_id").references(
      () => journalEntries.id,
    ),
    provider: text("provider", { enum: PaymentProviderDB }).notNull(),
    merchantId: text("merchant_id").notNull(),
    sourceKind: text("source_kind", { enum: accountingSourceKinds }).notNull(),
    externalId: text("external_id").notNull(),
    currency: text("currency").notNull(),
    grossMinor: bigint("gross_minor", { mode: "number" }).notNull(),
    netMinor: bigint("net_minor", { mode: "number" }).notNull(),
    taxMinor: bigint("tax_minor", { mode: "number" }).notNull(),
    feeMinor: bigint("fee_minor", { mode: "number" }),
    sourceDate: timestamp("source_date").notNull(),
    evidenceDigest: text("evidence_digest").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("payment_accounting_sale_per_transaction")
      .on(table.transactionId)
      .where(sql`${table.sourceKind} = 'sale'`),
    unique("payment_accounting_posting_identity").on(
      table.provider,
      table.merchantId,
      table.sourceKind,
      table.externalId,
    ),
  ],
);

/** Captured only after the provider signature verifier has accepted the body. */
export const paymentAccountingEvidence = pgTable(
  "payment_accounting_evidence",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider", { enum: PaymentProviderDB }).notNull(),
    merchantId: text("merchant_id").notNull(),
    sourceKind: text("source_kind", { enum: accountingSourceKinds }).notNull(),
    externalId: text("external_id").notNull(),
    checkoutId: text("checkout_id"),
    invoiceReference: text("invoice_reference"),
    paymentIntentId: text("payment_intent_id"),
    offerId: text("offer_id"),
    currency: text("currency").notNull(),
    grossMinor: bigint("gross_minor", { mode: "number" }).notNull(),
    taxMinor: bigint("tax_minor", { mode: "number" }),
    feeMinor: bigint("fee_minor", { mode: "number" }),
    servicePeriodStart: timestamp("service_period_start", {
      withTimezone: true,
    }),
    servicePeriodEnd: timestamp("service_period_end", { withTimezone: true }),
    serviceNetMinor: bigint("service_net_minor", { mode: "number" }),
    servicePeriodConflict: boolean("service_period_conflict")
      .notNull()
      .default(false),
    sourceDate: timestamp("source_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("payment_accounting_evidence_identity").on(
      table.provider,
      table.merchantId,
      table.sourceKind,
      table.externalId,
    ),
  ],
);

/** A company's elected recognition accounts apply from this UTC accounting day. */
export const paymentAccountingRecognitionPolicies = pgTable(
  "payment_accounting_recognition_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mappingId: uuid("mapping_id")
      .notNull()
      .references(() => paymentAccountingOffers.id),
    effectiveFrom: date("effective_from").notNull(),
    revenueAccountId: uuid("revenue_account_id")
      .notNull()
      .references(() => accountNodes.id),
    recognizeServicePeriods: boolean("recognize_service_periods")
      .notNull()
      .default(false),
    recognizeExpiry: boolean("recognize_expiry").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("payment_accounting_recognition_policy_day").on(
      table.mappingId,
      table.effectiveFrom,
    ),
  ],
);

/** Immutable native allocation of one eligible ledger movement on a paid pack. */
export const paymentAccountingRecognitions = pgTable(
  "payment_accounting_recognitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postingId: uuid("posting_id")
      .notNull()
      .references(() => paymentAccountingPostings.id),
    policyId: uuid("policy_id")
      .notNull()
      .references(() => paymentAccountingRecognitionPolicies.id),
    creditTransactionId: uuid("credit_transaction_id").notNull(),
    creditsAtomic: text("credits_atomic").notNull(),
    netMinor: bigint("net_minor", { mode: "number" }).notNull(),
    journalEntryId: uuid("journal_entry_id").references(
      () => journalEntries.id,
    ),
    sourceDate: timestamp("source_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("payment_accounting_recognition_credit_transaction").on(
      table.creditTransactionId,
    ),
  ],
);

/** Cumulative service releases serialized on the original posting's company ledger. */
export const paymentAccountingServiceRecognitions = pgTable(
  "payment_accounting_service_recognitions",
  {
    id: uuid("id").primaryKey(),
    postingId: uuid("posting_id")
      .notNull()
      .references(() => paymentAccountingPostings.id),
    policyId: uuid("policy_id")
      .notNull()
      .references(() => paymentAccountingRecognitionPolicies.id),
    sourceDate: timestamp("source_date").notNull(),
    serviceFrom: timestamp("service_from", { withTimezone: true }).notNull(),
    serviceThrough: timestamp("service_through", {
      withTimezone: true,
    }).notNull(),
    netMinor: bigint("net_minor", { mode: "number" }).notNull(),
    journalEntryId: uuid("journal_entry_id").references(
      () => journalEntries.id,
    ),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("payment_accounting_service_recognition_boundary").on(
      table.postingId,
      table.serviceThrough,
    ),
  ],
);
