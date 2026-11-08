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
  const base = {
    day: facts.day,
    netRevenueUsd: margin.netRevenueUsd,
    upstreamCostUsd: round2(facts.upstreamCostUsd),
    grossMarginUsd: margin.grossMarginUsd,
    grossMarginPct: margin.grossMarginPct,
  };

  if (margin.grossMarginUsd < 0 && facts.upstreamCostUsd >= th.minCostUsd) {
    out.push({
      type: FinanceAlertType.NEGATIVE_MARGIN,
      severity: AlertSeverity.CRITICAL,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.NEGATIVE_MARGIN}:${facts.day}`,
      message: `Negative margin on ${facts.day}: net revenue ${money(margin.netRevenueUsd)} vs upstream cost ${money(facts.upstreamCostUsd)} (${money(margin.grossMarginUsd)}).`,
      metadata: base,
    });
  } else if (
    margin.grossMarginPct !== null &&
    margin.netRevenueUsd >= th.minRevenueUsd &&
    margin.grossMarginPct < th.marginFloorPct
  ) {
    out.push({
      type: FinanceAlertType.THIN_MARGIN,
      severity: AlertSeverity.WARNING,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.THIN_MARGIN}:${facts.day}`,
      message: `Thin margin on ${facts.day}: ${margin.grossMarginPct.toFixed(1)}% (floor ${th.marginFloorPct}%). Net revenue ${money(margin.netRevenueUsd)}, upstream cost ${money(facts.upstreamCostUsd)}.`,
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
    facts.upstreamCostUsd >= th.minCostUsd
  ) {
    out.push({
      type: FinanceAlertType.BILLING_GAP,
      severity: AlertSeverity.WARNING,
      subject: facts.day,
      dedupKey: `${FinanceAlertType.BILLING_GAP}:${facts.day}`,
      message: `Billing gap on ${facts.day}: upstream spent ${money(facts.upstreamCostUsd)} but users were billed ${money(facts.internalBilledUsd)} (+${margin.billingGapPct.toFixed(0)}%, limit ${th.billingGapPct}%). Mis-pricing or leakage.`,
      metadata: { ...base, internalBilledUsd: round2(facts.internalBilledUsd) },
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
