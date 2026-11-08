/**
 * Finance Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Everything the monitor reads from: revenue processors and inference providers. */
export const {
  enum: FinanceSource,
  options: FinanceSourceOptions,
  Value: FinanceSourceValue,
} = createEnumOptions(scopedTranslation, {
  STRIPE: "enums.source.stripe",
  NOWPAYMENTS: "enums.source.nowpayments",
  OPENROUTER: "enums.source.openrouter",
  NANO_GPT: "enums.source.nanoGpt",
  VENICE: "enums.source.venice",
  UNCENSORED_AI: "enums.source.uncensoredAi",
  GAB: "enums.source.gab",
  FREEDOM_GPT: "enums.source.freedomGpt",
});

export const FinanceSourceDB = [
  FinanceSource.STRIPE,
  FinanceSource.NOWPAYMENTS,
  FinanceSource.OPENROUTER,
  FinanceSource.NANO_GPT,
  FinanceSource.VENICE,
  FinanceSource.UNCENSORED_AI,
  FinanceSource.GAB,
  FinanceSource.FREEDOM_GPT,
] as const;

export const RevenueSources = [
  FinanceSource.STRIPE,
  FinanceSource.NOWPAYMENTS,
] as const;

export const ProviderSources = [
  FinanceSource.OPENROUTER,
  FinanceSource.NANO_GPT,
  FinanceSource.VENICE,
  FinanceSource.UNCENSORED_AI,
  FinanceSource.GAB,
  FinanceSource.FREEDOM_GPT,
] as const;

/** Provider filter for per-provider series: one provider or all. */
export const {
  enum: ProviderFilter,
  options: ProviderFilterOptions,
  Value: ProviderFilterValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.provider.all",
  OPENROUTER: "enums.source.openrouter",
  NANO_GPT: "enums.source.nanoGpt",
  VENICE: "enums.source.venice",
  UNCENSORED_AI: "enums.source.uncensoredAi",
  GAB: "enums.source.gab",
  FREEDOM_GPT: "enums.source.freedomGpt",
});

/** What one raw revenue row is. */
export const {
  enum: RevenueEventKind,
  options: RevenueEventKindOptions,
  Value: RevenueEventKindValue,
} = createEnumOptions(scopedTranslation, {
  CHARGE: "enums.eventKind.charge",
  REFUND: "enums.eventKind.refund",
  DISPUTE: "enums.eventKind.dispute",
  CANCELLATION: "enums.eventKind.cancellation",
  PAYOUT: "enums.eventKind.payout",
});

export const RevenueEventKindDB = [
  RevenueEventKind.CHARGE,
  RevenueEventKind.REFUND,
  RevenueEventKind.DISPUTE,
  RevenueEventKind.CANCELLATION,
  RevenueEventKind.PAYOUT,
] as const;

/** How the last run of one source ended. */
export const {
  enum: SourceRunStatus,
  options: SourceRunStatusOptions,
  Value: SourceRunStatusValue,
} = createEnumOptions(scopedTranslation, {
  OK: "enums.runStatus.ok",
  SKIPPED: "enums.runStatus.skipped",
  FAILED: "enums.runStatus.failed",
});

export const SourceRunStatusDB = [
  SourceRunStatus.OK,
  SourceRunStatus.SKIPPED,
  SourceRunStatus.FAILED,
] as const;

/** Anomaly classes the monitor alerts on. */
export const {
  enum: FinanceAlertType,
  options: FinanceAlertTypeOptions,
  Value: FinanceAlertTypeValue,
} = createEnumOptions(scopedTranslation, {
  NEGATIVE_MARGIN: "enums.alertType.negativeMargin",
  THIN_MARGIN: "enums.alertType.thinMargin",
  BALANCE_DRAIN: "enums.alertType.balanceDrain",
  SPEND_SPIKE: "enums.alertType.spendSpike",
  REFUND_SPIKE: "enums.alertType.refundSpike",
  DISPUTE_SPIKE: "enums.alertType.disputeSpike",
  CANCELLATION_SPIKE: "enums.alertType.cancellationSpike",
  BILLING_GAP: "enums.alertType.billingGap",
});

export const FinanceAlertTypeDB = [
  FinanceAlertType.NEGATIVE_MARGIN,
  FinanceAlertType.THIN_MARGIN,
  FinanceAlertType.BALANCE_DRAIN,
  FinanceAlertType.SPEND_SPIKE,
  FinanceAlertType.REFUND_SPIKE,
  FinanceAlertType.DISPUTE_SPIKE,
  FinanceAlertType.CANCELLATION_SPIKE,
  FinanceAlertType.BILLING_GAP,
] as const;

export const {
  enum: AlertSeverity,
  options: AlertSeverityOptions,
  Value: AlertSeverityValue,
} = createEnumOptions(scopedTranslation, {
  WARNING: "enums.severity.warning",
  CRITICAL: "enums.severity.critical",
});

export const AlertSeverityDB = [
  AlertSeverity.WARNING,
  AlertSeverity.CRITICAL,
] as const;

/** Editable threshold keys (finance_thresholds.key). */
export const {
  enum: ThresholdKey,
  options: ThresholdKeyOptions,
  Value: ThresholdKeyValue,
} = createEnumOptions(scopedTranslation, {
  MARGIN_FLOOR_PCT: "enums.threshold.marginFloorPct",
  DRAIN_MULTIPLIER: "enums.threshold.drainMultiplier",
  HOURLY_SPEND_CAP_USD: "enums.threshold.hourlySpendCapUsd",
  MIN_SPIKE_USD: "enums.threshold.minSpikeUsd",
  REFUND_RATE_PCT: "enums.threshold.refundRatePct",
  DISPUTE_COUNT_DAILY: "enums.threshold.disputeCountDaily",
  CANCELLATION_MULTIPLIER: "enums.threshold.cancellationMultiplier",
  CANCELLATION_MIN: "enums.threshold.cancellationMin",
  BILLING_GAP_PCT: "enums.threshold.billingGapPct",
  ALERT_DEDUP_HOURS: "enums.threshold.alertDedupHours",
  MIN_REVENUE_USD: "enums.threshold.minRevenueUsd",
  MIN_COST_USD: "enums.threshold.minCostUsd",
});

export const ThresholdKeyDB = [
  ThresholdKey.MARGIN_FLOOR_PCT,
  ThresholdKey.DRAIN_MULTIPLIER,
  ThresholdKey.HOURLY_SPEND_CAP_USD,
  ThresholdKey.MIN_SPIKE_USD,
  ThresholdKey.REFUND_RATE_PCT,
  ThresholdKey.DISPUTE_COUNT_DAILY,
  ThresholdKey.CANCELLATION_MULTIPLIER,
  ThresholdKey.CANCELLATION_MIN,
  ThresholdKey.BILLING_GAP_PCT,
  ThresholdKey.ALERT_DEDUP_HOURS,
  ThresholdKey.MIN_REVENUE_USD,
  ThresholdKey.MIN_COST_USD,
] as const;

/** Which part of an ingest to run. */
export const {
  enum: IngestScope,
  options: IngestScopeOptions,
  Value: IngestScopeValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.scope.all",
  BALANCES: "enums.scope.balances",
  REVENUE: "enums.scope.revenue",
});

/** Series a Finance data source node can chart. */
export const {
  enum: FinanceMetric,
  options: FinanceMetricOptions,
  Value: FinanceMetricValue,
} = createEnumOptions(scopedTranslation, {
  STRIPE_REVENUE: "enums.metric.stripeRevenue",
  NOWPAYMENTS_REVENUE: "enums.metric.nowpaymentsRevenue",
  NET_REVENUE: "enums.metric.netRevenue",
  REFUNDS: "enums.metric.refunds",
  UPSTREAM_COST: "enums.metric.upstreamCost",
  INTERNAL_BILLED: "enums.metric.internalBilled",
  GROSS_MARGIN_USD: "enums.metric.grossMarginUsd",
  GROSS_MARGIN_PCT: "enums.metric.grossMarginPct",
  PROVIDER_SPEND: "enums.metric.providerSpend",
  PROVIDER_BALANCE: "enums.metric.providerBalance",
  ALERTS: "enums.metric.alerts",
});
