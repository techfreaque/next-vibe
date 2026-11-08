/**
 * Shared pricing constants.
 * Extracted here so models.ts and other modules can import them
 * without pulling in the full products/repository-client module,
 * which avoids ESM circular dependency TDZ errors in Vite SSR.
 */

/** 1 credit = €0.01 = $0.01 = 0.24 PLN */
export const CREDIT_VALUE_USD = 0.01;

/** Standard markup percentage applied to all external API costs */
export const STANDARD_MARKUP_PERCENTAGE = 0.3; // 30% markup

/**
 * Monthly free credit allowance by tier.
 * Single source of truth for the free-credit cap math (credits/free-allowance.ts)
 * and every piece of copy that states free amounts (getPricingParams).
 * - guest: public lead pool (linked leads share one cap)
 * - signedIn: user pool (user + all linked leads share one cap)
 * - newsletterBonus: added on top once the pool holds a CONFIRMED newsletter subscription
 */
export const FREE_CREDIT_ALLOWANCE = {
  guest: 20,
  signedIn: 50,
  newsletterBonus: 20,
} as const;
