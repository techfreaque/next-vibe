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
