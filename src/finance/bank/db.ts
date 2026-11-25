import {
  date,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { accountNodes, journalEntryLines } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";

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
    importedByUserId: uuid("imported_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    importedAt: timestamp("imported_at").defaultNow().notNull(),
    matchedJournalLineId: uuid("matched_journal_line_id").references(
      () => journalEntryLines.id,
      { onDelete: "restrict" },
    ),
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
