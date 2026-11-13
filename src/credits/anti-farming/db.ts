/**
 * Anti-farming tables.
 * - free_pool_claims: which free pools a subnet has used up this period
 *   (accounts per month, guests per day). One row per pool + period.
 * - anti_farming_events: blocked attempts (subnet budget hit, duplicate or
 *   disposable email) for the admin report and alerts.
 */

import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const FreePoolClaimKindDB = ["account", "guest"] as const;
export const AntiFarmingEventKindDB = [
  "subnet_account_limit",
  "subnet_guest_limit",
  "duplicate_email",
  "disposable_email",
] as const;

export const freePoolClaims = pgTable(
  "free_pool_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind", { enum: FreePoolClaimKindDB }).notNull(),
    /** IPv4 /24 or IPv6 /64 */
    subnet: text("subnet").notNull(),
    /** "YYYY-MM" for accounts, "YYYY-MM-DD" (UTC) for guests */
    period: text("period").notNull(),
    /** user:<id> or lead:<id> */
    poolKey: text("pool_key").notNull(),
    /** false = the subnet budget was full: this pool gets no free credits this period */
    granted: boolean("granted").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("uq_free_pool_claims_pool_period").on(
      table.kind,
      table.period,
      table.poolKey,
    ),
    index("idx_free_pool_claims_subnet").on(
      table.kind,
      table.subnet,
      table.period,
    ),
  ],
);

export const antiFarmingEvents = pgTable(
  "anti_farming_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind", { enum: AntiFarmingEventKindDB }).notNull(),
    subnet: text("subnet"),
    emailDomain: text("email_domain"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_anti_farming_events_created").on(table.createdAt),
    index("idx_anti_farming_events_kind").on(table.kind, table.createdAt),
  ],
);

export type FreePoolClaimKind = (typeof FreePoolClaimKindDB)[number];
export type AntiFarmingEventKind = (typeof AntiFarmingEventKindDB)[number];
