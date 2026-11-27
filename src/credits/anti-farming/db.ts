/**
 * Anti-farming tables.
 * - free_pool_claims: which free pools a network has used up this period.
 *   One row per kind + pool + period:
 *   - account: per subnet (IPv4 /24, IPv6 /64) per month
 *   - account_asn: per hosting/VPN ASN ("asn:<n>") per day
 *   - guest: per subnet per day
 *   - newsletter: newsletter bonus per network (subnet, or "asn:<n>") per month
 *   - account_revoked: admin revoked the account's free pool (farm cleanup);
 *     the account gets no free tiers until it buys credits
 * - anti_farming_events: blocked attempts (subnet budget hit, duplicate or
 *   disposable email, per-subnet signup rate limit) for the admin report and
 *   alerts.
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

export const FreePoolClaimKindDB = [
  "account",
  "guest",
  "account_asn",
  "newsletter",
  "account_revoked",
] as const;

/** Observed, not enforced (yet) */
export const shadowEventKinds = [
  "shadow_crawler",
  "shadow_cluster",
  "shadow_model",
  /** random 8+ char plus-tag on a big mail provider (signup-signals.ts) */
  "shadow_random_alias",
  /** same name + UA, 3+ signups in 24 h across 2+ subnets (signup-signals.ts) */
  "shadow_signup_cluster",
] as const;

/** Enforced limits: each one is a free pool or signup that was refused */
export const limitEventKinds = [
  "subnet_account_limit",
  "subnet_guest_limit",
  "duplicate_email",
  "disposable_email",
  "subnet_signup_limit",
  /** hosting/VPN ASN used up its daily account pools */
  "asn_account_limit",
  /** shares an exact IP + UA with an account granted in the last 7 days */
  "ip_link_limit",
  /** the network already got its newsletter bonus this month */
  "newsletter_network_limit",
] as const;

/** Bookkeeping rows that are neither a block nor a signal */
export const markerEventKinds = [
  /** a burst alert mail went out (alerts.ts rate limit) */
  "burst_alert",
] as const;

/** Rows that never count as a blocked attempt */
export const nonBlockingEventKinds = [
  ...shadowEventKinds,
  ...markerEventKinds,
] as const;

export const AntiFarmingEventKindDB = [
  ...limitEventKinds,
  ...shadowEventKinds,
  ...markerEventKinds,
] as const;

export const freePoolClaims = pgTable(
  "free_pool_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: text("kind", { enum: FreePoolClaimKindDB }).notNull(),
    /** IPv4 /24, IPv6 /64, or "asn:<n>" for hosting/VPN networks */
    subnet: text("subnet").notNull(),
    /** "YYYY-MM" for accounts and newsletter, "YYYY-MM-DD" (UTC) for guests and account_asn */
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
