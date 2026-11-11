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

/**
 * Derived free-credit totals for a USER pool (additive model).
 *
 * A user pool stacks its lead's guest allowance ON TOP of the signed-in grant:
 * every signed-in user started as a guest lead, so the two accumulate rather than
 * the guest 20 being subsumed into the signed-in 50.
 *
 * - signedInTotal: guest + signedIn = the free credits a signed-in account holds
 *   per month before any newsletter bonus (70).
 * - maxTotal: guest + signedIn + newsletterBonus = the ceiling once a confirmed
 *   newsletter subscription is attached (90).
 *
 * These are the numbers all "signed-in free credits" copy must state. The raw
 * FREE_CREDIT_ALLOWANCE.signedIn (50) is only the grant delta, not a displayable
 * total.
 */
export const FREE_CREDIT_SIGNED_IN_TOTAL =
  FREE_CREDIT_ALLOWANCE.guest + FREE_CREDIT_ALLOWANCE.signedIn;

export const FREE_CREDIT_MAX_TOTAL =
  FREE_CREDIT_SIGNED_IN_TOTAL + FREE_CREDIT_ALLOWANCE.newsletterBonus;
