/**
 * Referral program configuration - single source of truth.
 * Both the payout algorithm (repository.ts) and the UI (page-client.tsx)
 * derive all values from these constants.
 */
export const REFERRAL_CONFIG = {
  /** Flat commission always paid to the direct referrer (chain[0]) */
  DIRECT_PERCENTAGE: 0.1,
  /** Total pool paid to the upline (chain[1..MAX_UPLINE_LEVELS]) with decay */
  UPLINE_PERCENTAGE: 0.1,
  /** Each upline level receives DECAY_RATIO × the previous level's share */
  DECAY_RATIO: 0.5,
  /** Max depth of upline chain paid from the upline pool */
  MAX_UPLINE_LEVELS: 5,
  /** Minimum payout threshold in cents ($40) */
  MIN_PAYOUT_CENTS: 4000,
  /** Example subscription price in cents used in UI illustrations */
  EXAMPLE_PRICE_CENTS: 2000,
  /** Crypto payout processing time in hours (used in UI and emails) */
  CRYPTO_PAYOUT_HOURS: 48,
} as const;

/**
 * Compute the commission percentage for each level (0-indexed).
 * Level 0 = direct referrer (always DIRECT_PERCENTAGE).
 * Levels 1..N = upline split with geometric decay.
 */
export function computeLevelPercentages(): number[] {
  const {
    DIRECT_PERCENTAGE,
    UPLINE_PERCENTAGE,
    DECAY_RATIO,
    MAX_UPLINE_LEVELS,
  } = REFERRAL_CONFIG;

  const percentages: number[] = [DIRECT_PERCENTAGE];

  const n: number = MAX_UPLINE_LEVELS;
  if (n === 0) {
    return percentages;
  }
  const q = DECAY_RATIO;
  // Sum of geometric series: S = (1 - q^n) / (1 - q)
  const sum = (1 - Math.pow(q, n)) / (1 - q);

  for (let k = 0; k < n; k++) {
    const weight = Math.pow(q, k);
    percentages.push((UPLINE_PERCENTAGE * weight) / sum);
  }

  return percentages;
}
