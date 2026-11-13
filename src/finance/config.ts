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
  /**
   * Minimum hours of gap-free snapshot coverage in the baseline window before a
   * trailing spend RATE can be formed. Snapshots are unreliable early on, so the
   * window can be almost all gaps; under this much clean coverage there is no
   * meaningful rate (insufficient data, NOT a baseline of ~$0), and the relative
   * drain tripwire stays silent - the absolute hourly cap still guards. One clean
   * hour anchors a rate; below that there is no gap-free measurement at all.
   */
  baselineMinCoveredHours: 1,
  /**
   * Hours of missing provider snapshots a fully-tracked day may still have and
   * count as COMPLETE cost coverage (one or two missed hourly cron runs is noise,
   * a wide gap is not). Beyond this a day is PARTIAL.
   */
  costGapToleranceHours: 2,
  /** Hard cap on a single rollup backfill range (days), so one call cannot run away. */
  backfillMaxDays: 400,
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
   * null = no per-unit price: Gab credits come with the flat-rate plan below, so
   * burning them costs nothing extra (only purchased top-ups would, and Gab
   * publishes no per-credit price for those).
   */
  nativeUnitUsd: { gab: null as number | null },

  /**
   * Flat-rate provider plans, USD per month. Added to every tracked day's
   * upstream cost as monthly / days-in-month, so margin carries the real cost
   * even though usage against the plan is $0 per call.
   *
   * Gab AI: the API key rides the "Gab Plus" plan (GET /v1/credits reports
   * is_plus=true, a 2,000 credit monthly_allotment and purchased.available=0).
   * gab.ai/pricing (2026-11-12): Plus $20.00/month or $200.00/year. Set 16.67
   * here if the account is billed yearly.
   */
  fixedMonthlyCostUsd: { gab: 20 },

  /**
   * Usage-priced providers without any spend / balance API (uncensored.ai,
   * FreedomGPT). Spend = billed calls in credit_transactions x the per-call raw
   * price from the model definitions (creditCost of the direct provider entry,
   * 1 credit = $0.01). One assistant turn can be split across several usage rows
   * (free + pack credits); they share a messageId and count once.
   */
  usageLedgerNote:
    "estimated from our own usage log (billed calls x per-call price), no provider API",

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
