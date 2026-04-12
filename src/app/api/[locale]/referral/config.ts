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
 * Hardcoded upline level shares using simple halving.
 * Level 1 gets UPLINE_PERCENTAGE / 2, each subsequent level halves,
 * the last level receives whatever remains from the upline pool.
 *
 * With UPLINE_PERCENTAGE=0.1 and MAX_UPLINE_LEVELS=5:
 *   level 1: 5%  (0.1 / 2)
 *   level 2: 2.5%
 *   level 3: 1.25%
 *   level 4: 0.625%
 *   level 5: 0.625% (remainder - same as level 4 here)
 */
export function computeLevelPercentages(): number[] {
  const { DIRECT_PERCENTAGE, UPLINE_PERCENTAGE, MAX_UPLINE_LEVELS } =
    REFERRAL_CONFIG;

  const percentages: number[] = [DIRECT_PERCENTAGE];

  const n: number = MAX_UPLINE_LEVELS;
  if (n === 0) {
    return percentages;
  }

  let remaining = UPLINE_PERCENTAGE;
  for (let k = 0; k < n; k++) {
    const isLast = k === n - 1;
    if (isLast) {
      // Last level gets whatever is left
      percentages.push(remaining);
    } else {
      const share = remaining / 2;
      percentages.push(share);
      remaining -= share;
    }
  }

  return percentages;
}
