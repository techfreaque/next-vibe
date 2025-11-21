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
