/**
 * Finance Config
 *
 * ONE place for every default the finance monitor uses. Thresholds are
 * admin-editable rows in finance_thresholds; the values here are the defaults
 * seeded and used until a row exists.
 *
 * Client+server safe. No server imports.
 */

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

export const FINANCE_CONFIG = {
  hourMs: HOUR_MS,
  dayMs: DAY_MS,

  /** Revenue window re-pulled on every ingest (late refunds / disputes land here). */
  revenueWindowDays: 3,
  /** Trailing window the drain / cancellation baselines use. */
  baselineDays: 7,
  /** Hard page cap per paginated external list: a runaway account cannot hang a run. */
  maxPages: 50,
  /** Per external request timeout. */
  requestTimeoutMs: 15_000,

  /**
   * Static FX to USD for non-USD revenue. Rough on purpose: monitoring, not
   * accounting. A currency missing here is counted as unconvertible, not guessed.
   */
  fxToUsd: { usd: 1, eur: 1.08, pln: 0.25 } as Readonly<Record<string, number>>,

  /** Internal credit value (1 credit = $0.01), mirrors products CREDIT_VALUE_USD. */
  creditValueUsd: 0.01,

  /**
   * Finance alerts go to the shared ops inbox AND the Thea mailbox
   * (THEA_MAIL_ADDRESS) - never the personal founder address in
   * THEA_MAIL_REPORT_TO (that stays the daily status report's recipient).
   */
  alertInbox: "hi@unbottled.ai",

  /**
   * USD value of one native unit for providers that report a non-USD balance.
   * null = unknown, the provider is tracked but excluded from USD cost.
   */
  nativeUnitUsd: { gab: null as number | null },

  /** Default thresholds. Keyed by ThresholdKey value suffix (see enum.ts). */
  thresholdDefaults: {
    marginFloorPct: 20,
    drainMultiplier: 3,
    hourlySpendCapUsd: 25,
    minSpikeUsd: 2,
    refundRatePct: 10,
    disputeCountDaily: 2,
    cancellationMultiplier: 3,
    cancellationMin: 3,
    billingGapPct: 50,
    alertDedupHours: 12,
    minRevenueUsd: 5,
    minCostUsd: 1,
  },
} as const;
