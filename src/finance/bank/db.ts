import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import {
  accountNodes,
  journalEntries,
  journalEntryLines,
} from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { paymentBills } from "@/payment/db";

import { bankStatementFormats } from "./statement-format";

export const bankStatementLines = pgTable(
  "bank_statement_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "restrict" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountNodes.id, { onDelete: "restrict" }),
    transactionId: text("transaction_id").notNull(),
    bookedDate: date("booked_date").notNull(),
    amount: numeric("amount", { precision: 14, scale: 4 }).notNull(),
    currency: text("currency").notNull(),
    valueDate: date("value_date"),
    nativeAmount: numeric("native_amount", { precision: 14, scale: 4 }),
    nativeCurrency: text("native_currency"),
    feeAmount: numeric("fee_amount", { precision: 14, scale: 4 }),
    feeCurrency: text("fee_currency"),
    sourceFormat: text("source_format", {
      enum: [...bankStatementFormats, "api"],
    }),
    sourceFeed: text("source_feed"),
    sourceReference: text("source_reference"),
    stableFingerprint: text("stable_fingerprint"),
    description: text("description"),
    counterparty: text("counterparty"),
    importedByUserId: uuid("imported_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    importedAt: timestamp("imported_at").defaultNow().notNull(),
    matchedJournalLineId: uuid("matched_journal_line_id").references(
      () => journalEntryLines.id,
      { onDelete: "restrict" },
    ),
    adjustmentJournalEntryId: uuid("adjustment_journal_entry_id").references(
      () => journalEntries.id,
      { onDelete: "restrict" },
    ),
    adjustmentReversalEntryId: uuid("adjustment_reversal_entry_id").references(
      () => journalEntries.id,
      { onDelete: "restrict" },
    ),
    supplierBillId: uuid("supplier_bill_id").references(() => paymentBills.id, {
      onDelete: "restrict",
    }),
    matchKind: text("match_kind", { enum: ["exact", "fee", "fx"] }),
    matchedByUserId: uuid("matched_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    matchedAt: timestamp("matched_at"),
  },
  (table) => [
    unique("uq_bank_statement_line_transaction").on(
      table.companyId,
      table.accountId,
      table.transactionId,
    ),
    unique("uq_bank_statement_line_journal_leg").on(table.matchedJournalLineId),
    index("idx_bank_statement_lines_open").on(
      table.companyId,
      table.accountId,
      table.matchedAt,
      table.bookedDate,
    ),
  ],
);

export const bankAccountReconciliationSettings = pgTable(
  "bank_account_reconciliation_settings",
  {
    accountId: uuid("account_id")
      .primaryKey()
      .references(() => accountNodes.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    bookedCurrency: text("booked_currency").notNull(),
    foreignCurrency: text("foreign_currency"),
    maxFxDifference: numeric("max_fx_difference", { precision: 14, scale: 4 }),
    maxFxBps: integer("max_fx_bps"),
    maxDateDistanceDays: integer("max_date_distance_days").notNull().default(7),
    gainAccountId: uuid("gain_account_id").references(() => accountNodes.id, {
      onDelete: "restrict",
    }),
    lossAccountId: uuid("loss_account_id").references(() => accountNodes.id, {
      onDelete: "restrict",
    }),
    feeAccountId: uuid("fee_account_id").references(() => accountNodes.id, {
      onDelete: "restrict",
    }),
    configuredByUserId: uuid("configured_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_bank_reconciliation_settings_company").on(table.companyId),
  ],
);
