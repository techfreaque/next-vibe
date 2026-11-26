import "server-only";

import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { accountNodes } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";
import { paymentBills } from "@/payment/db";
import { purchasingVendors } from "@/purchasing/db";

export const billMailboxReview = pgTable(
  "bill_mailbox_review",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    namespace: text("namespace").notNull(),
    uidValidity: text("uid_validity").notNull(),
    uid: text("uid").notNull(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id),
    vendorId: uuid("vendor_id")
      .notNull()
      .references(() => purchasingVendors.id),
    debitAccountId: uuid("debit_account_id")
      .notNull()
      .references(() => accountNodes.id),
    status: text("status", { enum: ["ready", "review", "posted"] }).notNull(),
    reference: text("reference"),
    documentDate: text("document_date"),
    currency: text("currency"),
    grossAmount: text("gross_amount"),
    taxAmount: text("tax_amount"),
    issue: text("issue", {
      enum: ["missingFields", "conflictingDocuments", "unsupportedContent"],
    }),
    aiReviewRequested: boolean("ai_review_requested").default(false).notNull(),
    evidence: text("evidence").notNull(),
    fileCount: integer("file_count").notNull(),
    billId: uuid("bill_id").references(() => paymentBills.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bill_mailbox_review_imap_uid").on(
      table.namespace,
      table.uidValidity,
      table.uid,
    ),
    index("bill_mailbox_review_company_created").on(
      table.companyId,
      table.createdAt,
    ),
  ],
);
