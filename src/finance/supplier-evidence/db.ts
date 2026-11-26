import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { journalEntries } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { paymentBills } from "@/payment/db";
import { purchasingVendors } from "@/purchasing/db";

import { ProviderSources } from "../enum";

export const supplierProviderBindings = pgTable(
  "supplier_provider_bindings",
  {
    provider: text("provider", { enum: ProviderSources }).primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => purchasingVendors.id, { onDelete: "restrict" }),
    configuredAt: timestamp("configured_at").defaultNow().notNull(),
    configuredByUserId: uuid("configured_by_user_id").notNull(),
  },
  (table) => [index("idx_supplier_provider_company").on(table.companyId)],
);

export const supplierEvidenceRecords = pgTable(
  "supplier_evidence_records",
  {
    id: uuid("id").primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => purchasingVendors.id, { onDelete: "restrict" }),
    sourceScope: text("source_scope").notNull(),
    provider: text("provider", { enum: ProviderSources }),
    externalReference: text("external_reference").notNull(),
    digest: text("digest").notNull(),
    invoiceReference: text("invoice_reference"),
    servicePeriodStart: timestamp("service_period_start"),
    servicePeriodEnd: timestamp("service_period_end"),
    kind: text("kind").notNull(),
    date: timestamp("date").notNull(),
    grossAmount: text("gross_amount").notNull(),
    taxAmount: text("tax_amount").notNull(),
    currency: text("currency").notNull(),
    description: text("description").notNull(),
    debitAccountId: uuid("debit_account_id").notNull(),
    creditAccountId: uuid("credit_account_id"),
    journalEntryId: uuid("journal_entry_id").references(
      () => journalEntries.id,
      { onDelete: "restrict" },
    ),
    billId: uuid("bill_id").references(() => paymentBills.id, {
      onDelete: "restrict",
    }),
    recordedByUserId: uuid("recorded_by_user_id").notNull(),
    recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_supplier_evidence_source_ref").on(
      table.sourceScope,
      table.externalReference,
    ),
    unique("uq_supplier_evidence_vendor_invoice").on(
      table.companyId,
      table.vendorId,
      table.invoiceReference,
    ),
    index("idx_supplier_evidence_company_date").on(table.companyId, table.date),
  ],
);
