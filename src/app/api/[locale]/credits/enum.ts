/**
 * Credits API Enums
 * Defines credit-related enumerations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Credit type identifier for tracking which credit pool is being used
 */
export const {
  enum: CreditTypeIdentifier,
  options: CreditTypeIdentifierOptions,
} = createEnumOptions(scopedTranslation, {
  USER_SUBSCRIPTION: "enums.creditType.userSubscription",
  LEAD_FREE: "enums.creditType.leadFree",
});

/**
 * Credit transaction type for tracking credit movements
 */
export const {
  enum: CreditTransactionType,
  options: CreditTransactionTypeOptions,
  Value: CreditTransactionTypeValue,
} = createEnumOptions(scopedTranslation, {
  FREE_GRANT: "enums.transactionType.freeGrant",
  PURCHASE: "enums.transactionType.purchase",
  SUBSCRIPTION: "enums.transactionType.subscription",
  USAGE: "enums.transactionType.usage",
  EXPIRY: "enums.transactionType.expiry",
  REFUND: "enums.transactionType.refund",
  TRANSFER: "enums.transactionType.transfer",
  OTHER_DEVICES: "enums.transactionType.otherDevices",
  REFERRAL_EARNING: "enums.transactionType.referralEarning",
  REFERRAL_PAYOUT: "enums.transactionType.referralPayout",
});

/**
 * Credit pack type for categorizing credit sources
 */
export const {
  enum: CreditPackType,
  options: CreditPackTypeOptions,
  Value: CreditPackTypeValue,
} = createEnumOptions(scopedTranslation, {
  SUBSCRIPTION: "enums.packType.subscription",
  PERMANENT: "enums.packType.permanent",
  BONUS: "enums.packType.bonus",
  EARNED: "enums.packType.earned",
});

export const CreditPackTypeDB = [
  CreditPackType.SUBSCRIPTION,
  CreditPackType.PERMANENT,
  CreditPackType.BONUS,
  CreditPackType.EARNED,
] as const;

export type CreditPackTypeValue = (typeof CreditPackTypeDB)[number];

/**
 * Database enum arrays for Drizzle ORM
 */
export const CreditTypeIdentifierDB = [
  CreditTypeIdentifier.USER_SUBSCRIPTION,
  CreditTypeIdentifier.LEAD_FREE,
] as const;

export const CreditTransactionTypeDB = [
  CreditTransactionType.FREE_GRANT,
  CreditTransactionType.PURCHASE,
  CreditTransactionType.SUBSCRIPTION,
  CreditTransactionType.USAGE,
  CreditTransactionType.EXPIRY,
  CreditTransactionType.REFUND,
  CreditTransactionType.TRANSFER,
  CreditTransactionType.OTHER_DEVICES,
  CreditTransactionType.REFERRAL_EARNING,
  CreditTransactionType.REFERRAL_PAYOUT,
] as const;

/**
 * Value types derived directly from DB arrays
 */
export type CreditTypeIdentifierValue = (typeof CreditTypeIdentifierDB)[number];
export type CreditTransactionTypeValue =
  (typeof CreditTransactionTypeDB)[number];
