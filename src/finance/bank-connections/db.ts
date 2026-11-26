import {
  boolean,
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "next-vibe/identity/user/db";

import { accountNodes } from "@/chart-of-accounts/db";
import { companies } from "@/companies/db";

import { enableBankingConsentAccounts } from "./enable-banking/consent/db";

/** High-water mark for an explicitly bound company bank feed. No access tokens are stored here. */
export const bankFeedCheckpoints = pgTable(
  "finance_bank_feed_checkpoints",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountNodes.id, { onDelete: "cascade" }),
    feedIdentifier: text("feed_identifier").notNull(),
    through: date("through").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.companyId, table.accountId, table.feedIdentifier],
    }),
  ],
);

export const bankFeedMappings = pgTable(
  "finance_bank_feed_mappings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accountNodes.id, { onDelete: "cascade" }),
    consentAccountId: uuid("consent_account_id")
      .notNull()
      .references(() => enableBankingConsentAccounts.id, {
        onDelete: "cascade",
      }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startDay: date("start_day").notNull(),
    daily: boolean("daily").notNull().default(false),
  },
  (table) => [
    unique("uq_finance_bank_consent_mapping").on(
      table.companyId,
      table.consentAccountId,
    ),
  ],
);
