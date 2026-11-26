import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { accountNodes } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";

export const enableBankingAttempts = pgTable(
  "finance_enable_banking_attempts",
  {
    id: uuid("id").primaryKey(),
    nonceDigest: text("nonce_digest").notNull().unique(),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    ledgerAccountId: uuid("ledger_account_id")
      .notNull()
      .references(() => accountNodes.id, { onDelete: "cascade" }),
    bankName: text("bank_name").notNull(),
    bankCountry: text("bank_country").notNull(),
    personal: boolean("personal").notNull(),
    callbackOrigin: text("callback_origin").notNull(),
    requestedUntil: timestamp("requested_until", {
      withTimezone: true,
    }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
  },
  (table) => [index("idx_enable_banking_attempt_expiry").on(table.expiresAt)],
);

export const enableBankingConsents = pgTable(
  "finance_enable_banking_consents",
  {
    id: uuid("id").primaryKey(),
    attemptId: uuid("attempt_id")
      .notNull()
      .unique()
      .references(() => enableBankingAttempts.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    bankName: text("bank_name").notNull(),
    bankCountry: text("bank_country").notNull(),
    sessionEncrypted: text("session_encrypted").notNull(),
    consentUntil: timestamp("consent_until", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    remindedAt: timestamp("reminded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_enable_banking_consent_company").on(
      table.companyId,
      table.actorId,
    ),
    index("idx_enable_banking_consent_expiry").on(table.consentUntil),
  ],
);

export const enableBankingConsentAccounts = pgTable(
  "finance_enable_banking_consent_accounts",
  {
    id: uuid("id").primaryKey(),
    consentId: uuid("consent_id")
      .notNull()
      .references(() => enableBankingConsents.id, { onDelete: "cascade" }),
    ordinal: integer("ordinal").notNull(),
    currency: text("currency"),
    identifiersEncrypted: text("identifiers_encrypted").notNull(),
  },
  (table) => [
    unique("uq_enable_banking_consent_account_ordinal").on(
      table.consentId,
      table.ordinal,
    ),
  ],
);
