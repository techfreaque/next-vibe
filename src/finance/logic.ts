/**
 * Finance Logic
 *
 * Pure functions: currency conversion, margin computation, spike / drain /
 * refund / cancellation detection, alert dedup. No I/O, so the thresholds are
 * unit-testable. Alert text is operator-facing (mail + error log), English only.
 */

/* eslint-disable i18next/no-literal-string */

import { FINANCE_CONFIG } from "./config";
import {
  AlertSeverity,
  type AlertSeverityValue,
  CostCoverage,
  type CostCoverageValue,
  FinanceAlertType,
  type FinanceAlertTypeValue,
  ThresholdKey,
  type ThresholdKeyValue,
} from "./enum";

// ─── Thresholds ──────────────────────────────────────────────────────────────

export interface Thresholds {
  marginFloorPct: number;
  drainMultiplier: number;
  hourlySpendCapUsd: number;
  minSpikeUsd: number;
  refundRatePct: number;
  disputeCountDaily: number;
  cancellationMultiplier: number;
  cancellationMin: number;
  billingGapPct: number;
  alertDedupHours: number;
  minRevenueUsd: number;
  minCostUsd: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  ...FINANCE_CONFIG.thresholdDefaults,
};

/** ThresholdKey -> Thresholds field. */
export const THRESHOLD_FIELD: Readonly<
  Record<typeof ThresholdKeyValue, keyof Thresholds>
> = {
  [ThresholdKey.MARGIN_FLOOR_PCT]: "marginFloorPct",
  [ThresholdKey.DRAIN_MULTIPLIER]: "drainMultiplier",
  [ThresholdKey.HOURLY_SPEND_CAP_USD]: "hourlySpendCapUsd",
  [ThresholdKey.MIN_SPIKE_USD]: "minSpikeUsd",
  [ThresholdKey.REFUND_RATE_PCT]: "refundRatePct",
  [ThresholdKey.DISPUTE_COUNT_DAILY]: "disputeCountDaily",
  [ThresholdKey.CANCELLATION_MULTIPLIER]: "cancellationMultiplier",
  [ThresholdKey.CANCELLATION_MIN]: "cancellationMin",
  [ThresholdKey.BILLING_GAP_PCT]: "billingGapPct",
  [ThresholdKey.ALERT_DEDUP_HOURS]: "alertDedupHours",
  [ThresholdKey.MIN_REVENUE_USD]: "minRevenueUsd",
  [ThresholdKey.MIN_COST_USD]: "minCostUsd",
};

export interface ThresholdOverride {
  key: typeof ThresholdKeyValue;
  value: number;
  enabled: boolean;
}

/** Defaults overlaid with enabled admin rows. A disabled row falls back to the default. */
export function resolveThresholds(rows: ThresholdOverride[]): Thresholds {
  const resolved: Thresholds = { ...DEFAULT_THRESHOLDS };
  for (const row of rows) {
    if (row.enabled) {
      resolved[THRESHOLD_FIELD[row.key]] = row.value;
    }
  }
  return resolved;
}

// ─── Money ───────────────────────────────────────────────────────────────────

/** Minor units (cents) of any currency to USD; null for a currency without a rate. */
export function minorToUsd(
  amountMinor: number,
  currency: string,
): number | null {
  const rate = FINANCE_CONFIG.fxToUsd[currency.toLowerCase()];
  if (rate === undefined) {
    return null;
  }
  return round2((amountMinor / 100) * rate);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function startOfUtcHour(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
    ),
  );
}

export function dayKey(date: Date): string {
  return startOfUtcDay(date).toISOString().slice(0, 10);
}

// ─── Cost coverage ─────────────────────────────────────────────────────────────

const HOUR_MS = FINANCE_CONFIG.hourMs;

/**
 * How trustworthy a day's upstream-cost figure is, from the provider-snapshot
 * coverage of that UTC day. Pure so it is unit-testable.
 *
 *  - NONE:     no snapshot in the day (every day before cost tracking began, or
 *              a day the cron never ran) - cost is genuinely unknown.
 *  - PARTIAL:  the day straddles the start of tracking, or has a wide gap in its
 *              hourly readings - we have *some* cost but not the whole day.
 *  - COMPLETE: the day is fully inside the tracked period and its elapsed hours
 *              are covered (within a small gap tolerance) - cost is trustworthy.
 *
 * A not-yet-finished "today" is judged against the hours elapsed so far, so a
 * fully-tracked today reads COMPLETE for the margin-to-date.
 */
export function classifyCostCoverage(input: {
  /** Distinct hour buckets in [dayStart, dayEnd) that have a provider snapshot. */
  snapshotHours: number;
  dayStart: Date;
  /** Exclusive end of the UTC day (dayStart + 24h). */
  dayEnd: Date;
  /** Hour-floored earliest provider snapshot ever, or null when none exist. */
  firstSnapshotHour: Date | null;
  now: Date;
  gapToleranceHours: number;
}): typeof CostCoverageValue {
  if (input.firstSnapshotHour === null || input.snapshotHours <= 0) {
    return CostCoverage.NONE;
  }
  // The day must begin at or after tracking started to be fully coverable.
  if (input.dayStart.getTime() < input.firstSnapshotHour.getTime()) {
    return CostCoverage.PARTIAL;
  }
  // Hours we could expect to see so far: the day up to min(dayEnd, now).
  const horizon = Math.min(input.dayEnd.getTime(), input.now.getTime());
  const expectedHours = Math.max(
    0,
    Math.floor((horizon - input.dayStart.getTime()) / HOUR_MS),
  );
  if (expectedHours <= 1) {
    // Barely into the day: one reading is all we could have.
    return input.snapshotHours >= expectedHours
      ? CostCoverage.COMPLETE
      : CostCoverage.PARTIAL;
  }
  return input.snapshotHours >= expectedHours - input.gapToleranceHours
    ? CostCoverage.COMPLETE
    : CostCoverage.PARTIAL;
}

// ─── Margin ──────────────────────────────────────────────────────────────────

export interface MarginInput {
  grossRevenueUsd: number;
  refundsUsd: number;
  disputesUsd: number;
  upstreamCostUsd: number;
  internalBilledUsd: number;
}

export interface MarginResult {
  netRevenueUsd: number;
  grossMarginUsd: number;
  /** null when there is no net revenue to divide by */
  grossMarginPct: number | null;
  /** (upstream - billed) / billed * 100, null when nothing was billed */
  billingGapPct: number | null;
}

export function computeMargin(input: MarginInput): MarginResult {
  const netRevenueUsd = round2(
    input.grossRevenueUsd - input.refundsUsd - input.disputesUsd,
  );
  const grossMarginUsd = round2(netRevenueUsd - input.upstreamCostUsd);
  const grossMarginPct =
    netRevenueUsd > 0 ? round2((grossMarginUsd / netRevenueUsd) * 100) : null;
  const billingGapPct =
    input.internalBilledUsd > 0
      ? round2(
          ((input.upstreamCostUsd - input.internalBilledUsd) /
            input.internalBilledUsd) *
            100,
        )
      : null;
  return { netRevenueUsd, grossMarginUsd, grossMarginPct, billingGapPct };
}

// ─── Provider spend ──────────────────────────────────────────────────────────

export interface ProviderReading {
  balanceUsd: number | null;
  cumulativeUsageUsd: number | null;
}

export interface SpendDelta {
  spendUsd: number;
  elapsedHours: number;
}

/**
 * Spend between two readings. A provider usage counter wins (it ignores
 * top-ups); otherwise a balance drop counts and a balance rise (top-up) is 0.
 * null when the readings cannot be compared.
 */
export function spendBetween(
  previous: ProviderReading & { at: Date },
  current: ProviderReading & { at: Date },
): SpendDelta | null {
  const elapsedHours = Math.max(
    (current.at.getTime() - previous.at.getTime()) / FINANCE_CONFIG.hourMs,
    0,
  );
  if (elapsedHours === 0) {
    return null;
  }
  if (
    previous.cumulativeUsageUsd !== null &&
    current.cumulativeUsageUsd !== null
  ) {
    return {
      spendUsd: round6(
        Math.max(current.cumulativeUsageUsd - previous.cumulativeUsageUsd, 0),
      ),
      elapsedHours,
    };
  }
  if (previous.balanceUsd !== null && current.balanceUsd !== null) {
    return {
      spendUsd: round6(Math.max(previous.balanceUsd - current.balanceUsd, 0)),
      elapsedHours,
    };
  }
  return null;
}

function round6(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export interface AlertCandidate {
  type: typeof FinanceAlertTypeValue;
  severity: typeof AlertSeverityValue;
  subject: string;
  dedupKey: string;
  message: string;
  metadata: Record<string, string | number | boolean | null>;
}

const money = (value: number): string => `$${value.toFixed(2)}`;

/**
 * Stolen-key detector. Two independent tripwires on the spend since the last
 * reading, scaled to dollars per hour:
 *  - hard cap: more than hourlySpendCapUsd per hour
 *  - drain: more than drainMultiplier x the trailing hourly average
 * Both ignore spends below minSpikeUsd (noise on a quiet account).
 */
export function detectProviderAnomalies(input: {
  provider: string;
  providerLabel: string;
  spendUsd: number;
  elapsedHours: number;
  trailingAvgHourlyUsd: number;
  balanceUsd: number | null;
  thresholds: Thresholds;
}): AlertCandidate[] {
  const { thresholds: th } = input;
  if (input.elapsedHours <= 0 || input.spendUsd < th.minSpikeUsd) {
    return [];
  }
  const perHour = input.spendUsd / input.elapsedHours;
  const out: AlertCandidate[] = [];
  const metadata = {
    provider: input.provider,
    spendUsd: round2(input.spendUsd),
    elapsedHours: round2(input.elapsedHours),
    perHourUsd: round2(perHour),
    trailingAvgHourlyUsd: round2(input.trailingAvgHourlyUsd),
    balanceUsd: input.balanceUsd === null ? null : round2(input.balanceUsd),
  };
  if (perHour > th.hourlySpendCapUsd) {
    out.push({
      type: FinanceAlertType.SPEND_SPIKE,
      severity: AlertSeverity.CRITICAL,
      subject: input.provider,
      dedupKey: `${FinanceAlertType.SPEND_SPIKE}:${input.provider}`,
      message: `Possible key compromise: ${input.providerLabel}. ${money(input.spendUsd)} spent in ${input.elapsedHours.toFixed(1)}h (${money(perHour)}/h, cap ${money(th.hourlySpendCapUsd)}/h).`,
      metadata,
    });
  }
  if (
    input.trailingAvgHourlyUsd > 0 &&
    perHour > input.trailingAvgHourlyUsd * th.drainMultiplier
  ) {
    out.push({
      type: FinanceAlertType.BALANCE_DRAIN,
      severity: AlertSeverity.CRITICAL,
      subject: input.provider,
      dedupKey: `${FinanceAlertType.BALANCE_DRAIN}:${input.provider}`,
      message: `Possible key compromise: ${input.providerLabel}. Spending ${money(perHour)}/h is ${(perHour / input.trailingAvgHourlyUsd).toFixed(1)}x the trailing average of ${money(input.trailingAvgHourlyUsd)}/h (limit ${th.drainMultiplier}x).`,
      metadata,
    });
  }
  return out;
}

export interface DayFacts {
  day: string;
  grossRevenueUsd: number;
  refundsUsd: number;
  disputesUsd: number;
  refundCount: number;
  disputeCount: number;
  cancellationCount: number;
  trailingAvgCancellations: number;
  upstreamCostUsd: number;
  internalBilledUsd: number;
}

/** Margin, refund / dispute / cancellation and billing-gap tripwires for one UTC day. */
export function detectDayAnomalies(
  facts: DayFacts,
  th: Thresholds,
): AlertCandidate[] {
  const out: AlertCandidate[] = [];
  const margin = computeMargin(facts);

  // Cost coverage, credit-prepaid + free-tier safe. On this platform most usage
  // is prepaid credits or the free tier, so same-day *sales* revenue (recognized
  // at credit purchase, and $0 for free-tier usage) is the wrong yardstick for a
  // per-use margin: judging cost against it fires NEGATIVE_MARGIN on every dollar
  // of inference while revenue is $0, which is normal loss-leader economics, not a
  // leak. The economic unit that actually covers a turn's cost is the credit-value
  // users consumed on it (internalBilled); calculateCreditCost bills upstream x
  // markup per turn, so this is always >= cost for real user usage. Use whichever
  // basis is larger so real sales revenue still counts once it flows.
  const coverageUsd = round2(
    Math.max(margin.netRevenueUsd, facts.internalBilledUsd),
  );
  const coverageMarginUsd = round2(coverageUsd - facts.upstreamCostUsd);
  const coverageMarginPct =
    coverageUsd > 0 ? round2((coverageMarginUsd / coverageUsd) * 100) : null;
  // Only judge margin / billing-gap when a substantive amount was actually billed
  // to compare the measured cost against. A tiny billed figure next to a measured
  // cost is a sampling / day-boundary artifact (sparse provider balance readings
  // lumped across UTC midnight, platform-overhead spend that bills no user), not a
  // per-use loss - and billing can never structurally fall below cost for real
  // usage. This is what made the cold-start "net $0 vs cost $1.05" / "cost $4.36 vs
  // billed $0.04" alerts cry wolf.
  const billingMeasurable = facts.internalBilledUsd >= th.minCostUsd;
  const base = {
    day: facts.day,
    netRevenueUsd: margin.netRevenueUsd,
    internalBilledUsd: round2(facts.internalBilledUsd),
    upstreamCostUsd: round2(facts.upstreamCostUsd),
    coverageMarginUsd,
    coverageMarginPct,
  };

  if (
    coverageMarginUsd < 0 &&
    facts.upstreamCostUsd >= th.minCostUsd &&
    billingMeasurable
  ) {
    out.push({
      type: FinanceAlertType.NEGATIVE_MARGIN,
      severity: AlertSeverity.CRITICAL,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.NEGATIVE_MARGIN}:${facts.day}`,
      message: `Negative margin on ${facts.day}: upstream cost ${money(facts.upstreamCostUsd)} exceeds credits billed ${money(facts.internalBilledUsd)} (net sales ${money(margin.netRevenueUsd)}, shortfall ${money(coverageMarginUsd)}). Mis-pricing, not free-tier.`,
      metadata: base,
    });
  } else if (
    coverageMarginPct !== null &&
    billingMeasurable &&
    coverageUsd >= th.minRevenueUsd &&
    coverageMarginPct < th.marginFloorPct
  ) {
    out.push({
      type: FinanceAlertType.THIN_MARGIN,
      severity: AlertSeverity.WARNING,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.THIN_MARGIN}:${facts.day}`,
      message: `Thin margin on ${facts.day}: ${coverageMarginPct.toFixed(1)}% (floor ${th.marginFloorPct}%). Credits billed ${money(facts.internalBilledUsd)}, net sales ${money(margin.netRevenueUsd)}, upstream cost ${money(facts.upstreamCostUsd)}.`,
      metadata: base,
    });
  }

  if (facts.grossRevenueUsd >= th.minRevenueUsd) {
    const refundRate = (facts.refundsUsd / facts.grossRevenueUsd) * 100;
    if (refundRate > th.refundRatePct) {
      out.push({
        type: FinanceAlertType.REFUND_SPIKE,
        severity: AlertSeverity.WARNING,
        subject: facts.day,
        dedupKey: `${FinanceAlertType.REFUND_SPIKE}:${facts.day}`,
        message: `Refund spike on ${facts.day}: ${money(facts.refundsUsd)} refunded of ${money(facts.grossRevenueUsd)} charged (${refundRate.toFixed(1)}%, limit ${th.refundRatePct}%).`,
        metadata: {
          day: facts.day,
          refundsUsd: round2(facts.refundsUsd),
          grossRevenueUsd: round2(facts.grossRevenueUsd),
          refundRatePct: round2(refundRate),
          refundCount: facts.refundCount,
        },
      });
    }
  }

  if (facts.disputeCount >= th.disputeCountDaily) {
    out.push({
      type: FinanceAlertType.DISPUTE_SPIKE,
      severity: AlertSeverity.CRITICAL,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.DISPUTE_SPIKE}:${facts.day}`,
      message: `Dispute spike on ${facts.day}: ${facts.disputeCount} disputes (${money(facts.disputesUsd)}), limit ${th.disputeCountDaily}.`,
      metadata: {
        day: facts.day,
        disputeCount: facts.disputeCount,
        disputesUsd: round2(facts.disputesUsd),
      },
    });
  }

  if (
    facts.cancellationCount >= th.cancellationMin &&
    facts.cancellationCount >
      facts.trailingAvgCancellations * th.cancellationMultiplier
  ) {
    out.push({
      type: FinanceAlertType.CANCELLATION_SPIKE,
      severity: AlertSeverity.WARNING,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.CANCELLATION_SPIKE}:${facts.day}`,
      message: `Cancellation spike on ${facts.day}: ${facts.cancellationCount} subscriptions cancelled vs ${facts.trailingAvgCancellations.toFixed(1)}/day average (limit ${th.cancellationMultiplier}x).`,
      metadata: {
        day: facts.day,
        cancellationCount: facts.cancellationCount,
        trailingAvg: round2(facts.trailingAvgCancellations),
      },
    });
  }

  if (
    margin.billingGapPct !== null &&
    margin.billingGapPct > th.billingGapPct &&
    facts.upstreamCostUsd >= th.minCostUsd &&
    billingMeasurable
  ) {
    out.push({
      type: FinanceAlertType.BILLING_GAP,
      severity: AlertSeverity.WARNING,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.BILLING_GAP}:${facts.day}`,
      message: `Billing gap on ${facts.day}: upstream spent ${money(facts.upstreamCostUsd)} but users were billed ${money(facts.internalBilledUsd)} (+${margin.billingGapPct.toFixed(0)}%, limit ${th.billingGapPct}%). Mis-pricing or leakage.`,
      metadata: base,
    });
  }
  return out;
}

/** True when the same dedup key already alerted inside the window. */
export function isDuplicateAlert(
  lastAlertAt: Date | null,
  now: Date,
  dedupHours: number,
): boolean {
  if (lastAlertAt === null) {
    return false;
  }
  return (
    now.getTime() - lastAlertAt.getTime() < dedupHours * FINANCE_CONFIG.hourMs
  );
}
