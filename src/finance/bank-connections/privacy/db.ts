import {
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { bankFeedMappings } from "../db";

export const bankPrivacySettings = pgTable("finance_bank_privacy_settings", {
  mappingId: uuid("mapping_id")
    .primaryKey()
    .references(() => bankFeedMappings.id, { onDelete: "cascade" }),
  mode: text("mode", { enum: ["mixed", "business"] })
    .notNull()
    .default("mixed"),
  retentionDays: integer("retention_days").notNull().default(30),
  rulesEncrypted: text("rules_encrypted"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const bankPrivacyReview = pgTable(
  "finance_bank_privacy_review",
  {
    mappingId: uuid("mapping_id")
      .notNull()
      .references(() => bankFeedMappings.id, { onDelete: "cascade" }),
    sourceIdentity: text("source_identity").notNull(),
    state: text("state", {
      enum: ["review", "approving", "private", "business", "expired"],
    })
      .notNull()
      .default("review"),
    bookedDate: date("booked_date"),
    signedAmount: text("signed_amount"),
    currency: text("currency"),
    evidenceEncrypted: text("evidence_encrypted"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.mappingId, table.sourceIdentity] }),
    index("finance_bank_privacy_review_expiry").on(table.expiresAt),
  ],
);
