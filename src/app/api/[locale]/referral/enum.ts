/**
 * Referral API Enums
 * Defines referral-related enumerations
 *
 * NOTE: Using plain constants instead of createEnumOptions since these are
 * internal database values, not user-facing translations
 */

/**
 * Referral source type - where the referral earning came from
 */
export const ReferralSourceType = {
  SUBSCRIPTION: "SUBSCRIPTION",
  CREDIT_PACK: "CREDIT_PACK",
} as const;

export type ReferralSourceTypeValue =
  (typeof ReferralSourceType)[keyof typeof ReferralSourceType];

/**
 * Referral earning status
 */
export const ReferralEarningStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELED: "CANCELED",
} as const;

export type ReferralEarningStatusValue =
  (typeof ReferralEarningStatus)[keyof typeof ReferralEarningStatus];

/**
 * Database enum arrays for Drizzle ORM
 * Use the same const arrays everywhere - no separate Value types
 */
export const ReferralSourceTypeDB = [
  ReferralSourceType.SUBSCRIPTION,
  ReferralSourceType.CREDIT_PACK,
] as const;

export const ReferralEarningStatusDB = [
  ReferralEarningStatus.PENDING,
  ReferralEarningStatus.CONFIRMED,
  ReferralEarningStatus.CANCELED,
] as const;

/**
 * Payout request status
 */
export const PayoutStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type PayoutStatusValue =
  (typeof PayoutStatus)[keyof typeof PayoutStatus];

export const PayoutStatusDB = [
  PayoutStatus.PENDING,
  PayoutStatus.APPROVED,
  PayoutStatus.REJECTED,
  PayoutStatus.PROCESSING,
  PayoutStatus.COMPLETED,
  PayoutStatus.FAILED,
] as const;

/**
 * Payout currency options
 */
export const PayoutCurrency = {
  BTC: "BTC",
  USDC: "USDC",
  CREDITS: "CREDITS",
} as const;

export type PayoutCurrencyValue =
  (typeof PayoutCurrency)[keyof typeof PayoutCurrency];

export const PayoutCurrencyDB = [
  PayoutCurrency.BTC,
  PayoutCurrency.USDC,
  PayoutCurrency.CREDITS,
] as const;
