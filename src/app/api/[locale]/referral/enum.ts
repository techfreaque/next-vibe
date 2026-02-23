/**
 * Referral API Enums
 * Defines referral-related enumerations using createEnumOptions
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Referral source type - where the referral earning came from
 */
export const {
  enum: ReferralSourceType,
  options: ReferralSourceTypeOptions,
  Value: ReferralSourceTypeValue,
} = createEnumOptions(scopedTranslation, {
  SUBSCRIPTION: "enums.sourceType.subscription",
  CREDIT_PACK: "enums.sourceType.creditPack",
});

/**
 * Referral earning status
 */
export const {
  enum: ReferralEarningStatus,
  options: ReferralEarningStatusOptions,
  Value: ReferralEarningStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.earningStatus.pending",
  CONFIRMED: "enums.earningStatus.confirmed",
  CANCELED: "enums.earningStatus.canceled",
});

/**
 * Payout request status
 */
export const {
  enum: PayoutStatus,
  options: PayoutStatusOptions,
  Value: PayoutStatusValue,
} = createEnumOptions(scopedTranslation, {
  PENDING: "enums.payoutStatus.pending",
  APPROVED: "enums.payoutStatus.approved",
  REJECTED: "enums.payoutStatus.rejected",
  PROCESSING: "enums.payoutStatus.processing",
  COMPLETED: "enums.payoutStatus.completed",
  FAILED: "enums.payoutStatus.failed",
});

/**
 * Payout currency options
 */
export const {
  enum: PayoutCurrency,
  options: PayoutCurrencyOptions,
  Value: PayoutCurrencyValue,
} = createEnumOptions(scopedTranslation, {
  BTC: "enums.payoutCurrency.btc",
  USDC: "enums.payoutCurrency.usdc",
  CREDITS: "enums.payoutCurrency.credits",
});

/**
 * Database enum arrays for Drizzle ORM
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

export const PayoutStatusDB = [
  PayoutStatus.PENDING,
  PayoutStatus.APPROVED,
  PayoutStatus.REJECTED,
  PayoutStatus.PROCESSING,
  PayoutStatus.COMPLETED,
  PayoutStatus.FAILED,
] as const;

export const PayoutCurrencyDB = [
  PayoutCurrency.BTC,
  PayoutCurrency.USDC,
  PayoutCurrency.CREDITS,
] as const;
