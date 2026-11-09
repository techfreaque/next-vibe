/**
 * Finance Database Schema
 *
 * - finance_revenue_events:    raw per-object revenue rows (idempotent by source + external id)
 * - finance_revenue_snapshots: per source per UTC day aggregate of those rows
 * - finance_provider_snapshots: one balance / usage reading per provider per hour
 * - finance_daily_rollups:     per UTC day revenue, upstream cost, margin
 * - finance_source_status:     last run / skip reason per source
 * - finance_alerts:            every raised alert with its delivery outcome
 * - finance_thresholds:        admin-editable alert thresholds
 */

import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import {
  AlertSeverityDB,
  CostCoverage,
  CostCoverageDB,
  FinanceAlertTypeDB,
  FinanceSourceDB,
  RevenueEventKindDB,
  SourceRunStatusDB,
  ThresholdKeyDB,
} from "./enum";

export type AlertMetadata = Record<string, string | number | boolean | null>;
export type ProviderSpendMap = Record<string, number>;

export const financeRevenueEvents = pgTable(
  "finance_revenue_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source", { enum: FinanceSourceDB }).notNull(),
    kind: text("kind", { enum: RevenueEventKindDB }).notNull(),
    /** Stripe balance transaction / subscription event / NOWPayments payment id */
    externalId: text("external_id").notNull(),
    /** Positive magnitude in USD; the kind carries the direction. */
    amountUsd: doublePrecision("amount_usd").notNull().default(0),
    feeUsd: doublePrecision("fee_usd").notNull().default(0),
    currency: text("currency").notNull().default("usd"),
    occurredAt: timestamp("occurred_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_finance_revenue_events_source_ext").on(
      table.source,
      table.kind,
      table.externalId,
    ),
    index("idx_finance_revenue_events_occurred").on(table.occurredAt),
  ],
);

export const financeRevenueSnapshots = pgTable(
  "finance_revenue_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: text("source", { enum: FinanceSourceDB }).notNull(),
    /** UTC midnight of the day */
    day: timestamp("day").notNull(),
    grossUsd: doublePrecision("gross_usd").notNull().default(0),
    refundsUsd: doublePrecision("refunds_usd").notNull().default(0),
    disputesUsd: doublePrecision("disputes_usd").notNull().default(0),
    netUsd: doublePrecision("net_usd").notNull().default(0),
    payoutsUsd: doublePrecision("payouts_usd").notNull().default(0),
    paymentCount: integer("payment_count").notNull().default(0),
    refundCount: integer("refund_count").notNull().default(0),
    disputeCount: integer("dispute_count").notNull().default(0),
    cancellationCount: integer("cancellation_count").notNull().default(0),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique("uq_finance_revenue_snapshots_source_day").on(
      table.source,
      table.day,
    ),
    index("idx_finance_revenue_snapshots_day").on(table.day),
  ],
);

export const financeProviderSnapshots = pgTable(
  "finance_provider_snapshots",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider", { enum: FinanceSourceDB }).notNull(),
    /** Hour bucket (UTC) this reading belongs to: re-runs in the hour overwrite. */
    bucketAt: timestamp("bucket_at").notNull(),
    capturedAt: timestamp("captured_at").defaultNow().notNull(),
    /** Remaining balance in USD (null when the provider reports non-USD units) */
    balanceUsd: doublePrecision("balance_usd"),
    /** Remaining balance in the provider's own unit */
    balanceNative: doublePrecision("balance_native"),
    unit: text("unit").notNull().default("usd"),
    /** Provider-reported cumulative spend, when it has such a counter */
    cumulativeUsageUsd: doublePrecision("cumulative_usage_usd"),
    /** Spend in USD since the previous reading */
    spendUsd: doublePrecision("spend_usd"),
    /** Hours between the previous reading and this one */
    elapsedHours: doublePrecision("elapsed_hours"),
  },
  (table) => [
    unique("uq_finance_provider_snapshots_provider_bucket").on(
      table.provider,
      table.bucketAt,
    ),
    index("idx_finance_provider_snapshots_bucket").on(table.bucketAt),
  ],
);

export const financeDailyRollups = pgTable("finance_daily_rollups", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** UTC midnight of the day */
  day: timestamp("day").notNull().unique(),
  grossRevenueUsd: doublePrecision("gross_revenue_usd").notNull().default(0),
  refundsUsd: doublePrecision("refunds_usd").notNull().default(0),
  disputesUsd: doublePrecision("disputes_usd").notNull().default(0),
  netRevenueUsd: doublePrecision("net_revenue_usd").notNull().default(0),
  /**
   * Measured upstream cost. NULL when cost coverage is NONE (no provider
   * snapshots that day): the cost is unknown, never faked to 0. When coverage is
   * PARTIAL the value is a real but incomplete lower bound - read costCoverage.
   */
  upstreamCostUsd: doublePrecision("upstream_cost_usd"),
  /** NULL unless costCoverage is COMPLETE - a margin off incomplete cost misleads. */
  grossMarginUsd: doublePrecision("gross_margin_usd"),
  /** null when there is no revenue to divide by, or cost coverage is not COMPLETE */
  grossMarginPct: doublePrecision("gross_margin_pct"),
  /** How trustworthy upstreamCostUsd / the margin are for this day. */
  costCoverage: text("cost_coverage", { enum: CostCoverageDB })
    .notNull()
    .default(CostCoverage.NONE),
  /** Credits users burned (USAGE transactions) valued at the credit price */
  internalBilledUsd: doublePrecision("internal_billed_usd")
    .notNull()
    .default(0),
  /** (upstream - billed) / billed * 100; null when nothing was billed */
  billingGapPct: doublePrecision("billing_gap_pct"),
  cancellationCount: integer("cancellation_count").notNull().default(0),
  perProviderSpend: jsonb("per_provider_spend")
    .$type<ProviderSpendMap>()
    .notNull()
    .default({}),
  computedAt: timestamp("computed_at").defaultNow().notNull(),
});

export const financeSourceStatus = pgTable("finance_source_status", {
  source: text("source", { enum: FinanceSourceDB }).primaryKey(),
  lastRunAt: timestamp("last_run_at").notNull(),
  lastStatus: text("last_status", { enum: SourceRunStatusDB }).notNull(),
  /** Why a source was skipped or failed; also notes on partial data. */
  lastReason: text("last_reason"),
  lastOkAt: timestamp("last_ok_at"),
});

export const financeAlerts = pgTable(
  "finance_alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type", { enum: FinanceAlertTypeDB }).notNull(),
    severity: text("severity", { enum: AlertSeverityDB }).notNull(),
    /** Provider, source or day the alert is about */
    subject: text("subject").notNull(),
    dedupKey: text("dedup_key").notNull(),
    message: text("message").notNull(),
    metadata: jsonb("metadata").$type<AlertMetadata>().notNull().default({}),
    /** "sent" | "skipped: <reason>" | "failed: <reason>" */
    delivery: text("delivery").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_finance_alerts_dedup").on(table.dedupKey, table.createdAt),
    index("idx_finance_alerts_created").on(table.createdAt),
  ],
);

export const financeThresholds = pgTable("finance_thresholds", {
  key: text("key", { enum: ThresholdKeyDB }).primaryKey(),
  value: doublePrecision("value").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  note: text("note"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type FinanceRevenueEventRow = typeof financeRevenueEvents.$inferSelect;
export type FinanceRevenueSnapshotRow =
  typeof financeRevenueSnapshots.$inferSelect;
export type FinanceProviderSnapshotRow =
  typeof financeProviderSnapshots.$inferSelect;
export type FinanceDailyRollupRow = typeof financeDailyRollups.$inferSelect;
export type FinanceAlertRow = typeof financeAlerts.$inferSelect;
export type FinanceThresholdRow = typeof financeThresholds.$inferSelect;
