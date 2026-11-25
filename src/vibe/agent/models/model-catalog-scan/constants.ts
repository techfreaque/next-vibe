/**
 * Model Catalog Scan - tunables.
 * The scan runs from a daily cron but only does real work every
 * SCAN_INTERVAL_DAYS (guarded by the last stored scan), so a missed day or a
 * restart never shifts the cadence by more than one day.
 */

export const MODEL_CATALOG_SCAN_CRON_ID = "model-catalog-scan";

/** Daily at 06:40 UTC; the repository skips unless the last scan is old enough. */
export const MODEL_CATALOG_SCAN_CRON_SCHEDULE = "40 6 * * *";

export const SCAN_INTERVAL_DAYS = 5;

/** Grace so a scan that ran a few minutes late yesterday does not slip a day. */
export const SCAN_INTERVAL_GRACE_HOURS = 2;

/** First scan ever: report upstream models created in this window. */
export const FIRST_SCAN_LOOKBACK_DAYS = 30;

/** Overlap with the previous scan so boundary models are never missed. */
export const LOOKBACK_MARGIN_HOURS = 24;

/** Relative price/context change (percent) that counts as a change. */
export const PRICE_CHANGE_THRESHOLD_PERCENT = 1;

/**
 * A jump this large is almost always a broken fetcher (scraped plan price,
 * unit mix-up), not a real price change. Flagged, never trusted blindly.
 */
export const PRICE_CHANGE_SUSPECT_PERCENT = 500;

/**
 * Observed-cost check: what assistant turns REALLY cost (upstream cost x
 * markup, stored as the message creditCost) vs what the listed token prices
 * say for the same tokens. Catches listed prices below the real upstream
 * cost, which the no-cost-reported fallback and pre-flight estimates bill.
 */
export const OBSERVED_COST_WINDOW_DAYS = 14;

/** Rows read per scan (newest first), so a busy prod DB stays cheap. */
export const OBSERVED_COST_MAX_ROWS = 20_000;

/** A model needs this many usable turns before a gap is reported. */
export const OBSERVED_COST_MIN_SAMPLES = 10;

/** Turns cheaper than this are dominated by the 0.1-credit rounding. */
export const OBSERVED_COST_MIN_CREDITS = 0.5;

/** Charges round UP to this step; subtracted so rounding never reads as a gap. */
export const OBSERVED_COST_ROUNDING_CREDITS = 0.1;

/** Median observed/listed ratio from which a model is reported. */
export const OBSERVED_COST_GAP_RATIO = 1.15;

/** Per-fetcher timeout so one hanging provider never stalls the scan. */
export const SOURCE_TIMEOUT_MS = 60_000;

/** Ops inboxes only. Never a personal address. */
export const MODEL_CATALOG_REPORT_RECIPIENTS = [
  "hi@unbottled.ai",
  "thea@unbottled.ai",
] as const;

/** Max rows per section in the email body (the stored report keeps all). */
export const EMAIL_SECTION_LIMIT = 40;

/** How many past scans GET returns in its history list. */
export const HISTORY_LIMIT = 10;

/** Upstream ids/names that hint at an uncensored or roleplay model. */
export const UNCENSORED_HINT_PATTERN =
  /uncensor|abliterat|heretic|unfilter|nsfw|lewd|roleplay|dolphin|hermes-|venice/i;

/** NanoGPT categories that mark uncensored / roleplay models. */
export const NANO_GPT_UNCENSORED_CATEGORIES: readonly string[] = [
  "Uncensored",
  "Roleplay/storytelling models",
];
