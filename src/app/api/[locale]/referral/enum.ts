/**
 * Referral API Enums
 * Defines referral-related enumerations using createEnumOptions
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Referral source type - where the referral earning came from
 */
export const {
  enum: ReferralSourceType,
  options: ReferralSourceTypeOptions,
  Value: ReferralSourceTypeValue,
} = createEnumOptions({
  SUBSCRIPTION: "app.api.referral.enums.sourceType.subscription",
  CREDIT_PACK: "app.api.referral.enums.sourceType.creditPack",
});

/**
 * Referral earning status
 */
export const {
  enum: ReferralEarningStatus,
  options: ReferralEarningStatusOptions,
  Value: ReferralEarningStatusValue,
} = createEnumOptions({
  PENDING: "app.api.referral.enums.earningStatus.pending",
  CONFIRMED: "app.api.referral.enums.earningStatus.confirmed",
  CANCELED: "app.api.referral.enums.earningStatus.canceled",
});

/**
 * Payout request status
 */
export const {
  enum: PayoutStatus,
  options: PayoutStatusOptions,
  Value: PayoutStatusValue,
} = createEnumOptions({
  PENDING: "app.api.referral.enums.payoutStatus.pending",
  APPROVED: "app.api.referral.enums.payoutStatus.approved",
  REJECTED: "app.api.referral.enums.payoutStatus.rejected",
  PROCESSING: "app.api.referral.enums.payoutStatus.processing",
  COMPLETED: "app.api.referral.enums.payoutStatus.completed",
  FAILED: "app.api.referral.enums.payoutStatus.failed",
});

/**
 * Payout currency options
 */
export const {
  enum: PayoutCurrency,
  options: PayoutCurrencyOptions,
  Value: PayoutCurrencyValue,
} = createEnumOptions({
  BTC: "app.api.referral.enums.payoutCurrency.btc",
  USDC: "app.api.referral.enums.payoutCurrency.usdc",
  CREDITS: "app.api.referral.enums.payoutCurrency.credits",
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
