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

import { companies } from "@/companies/db";

import { paymentInvoices } from "../../../db";

export const invoiceReminderDrafts = pgTable(
  "payment_invoice_reminder_drafts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => paymentInvoices.id, { onDelete: "cascade" }),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "cascade",
    }),
    preparedBy: uuid("prepared_by").references(() => users.id, {
      onDelete: "set null",
    }),
    preparedAt: timestamp("prepared_at").defaultNow().notNull(),
    draftDay: date("draft_day").notNull(),
    signature: text("signature").notNull(),
    invoiceNumber: text("invoice_number").notNull(),
    issuerName: text("issuer_name"),
    dueDate: date("due_date").notNull(),
    currency: text("currency").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    note: text("note"),
  },
  (table) => [
    unique("uq_invoice_reminder_draft_snapshot").on(
      table.invoiceId,
      table.draftDay,
      table.signature,
    ),
    index("idx_invoice_reminder_draft_history").on(
      table.invoiceId,
      table.preparedAt,
    ),
  ],
);
