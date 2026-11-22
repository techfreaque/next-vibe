/**
 * Credits API Enums
 * Defines credit-related enumerations
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

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
 * Stable id of a usage charge that has no endpoint of its own, stored in
 * credit_transactions.feature and translated in the viewer's locale when
 * shown. Charges made by an endpoint store that endpoint's preferred tool
 * name instead (see feature-label.ts).
 */
export const {
  enum: CreditFeature,
  options: CreditFeatureOptions,
  Value: CreditFeatureValue,
} = createEnumOptions(scopedTranslation, {
  TEXT_TO_SPEECH: "enums.creditFeature.textToSpeech",
  SPEECH_TO_TEXT: "enums.creditFeature.speechToText",
  MEMORY_WRITE: "enums.creditFeature.memoryWrite",
  MEMORY_EDIT: "enums.creditFeature.memoryEdit",
  MEMORY_SEARCH: "enums.creditFeature.memorySearch",
  MEMORY_EMBEDDING: "enums.creditFeature.memoryEmbedding",
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
export type CreditTransactionTypeValue =
  (typeof CreditTransactionTypeDB)[number];

/**
 * Whether a pool gets its free monthly credits (credits balance + UI message)
 */
export const {
  enum: FreeCreditsStatus,
  options: FreeCreditsStatusOptions,
  Value: FreeCreditsStatusValue,
} = createEnumOptions(scopedTranslation, {
  ACTIVE: "enums.freeStatus.active",
  VERIFY_EMAIL: "enums.freeStatus.verifyEmail",
  SUBNET_LIMIT: "enums.freeStatus.subnetLimit",
});

/**
 * Which funding bucket paid a usage debit (credit_transactions.funding_type),
 * stamped at write time by the deduction walk. Null on non-usage rows.
 * FREE_UNKNOWN / PACK_UNKNOWN only label historical rows whose bucket could
 * not be derived exactly.
 */
export const {
  enum: CreditFundingType,
  options: CreditFundingTypeOptions,
  Value: CreditFundingTypeValue,
} = createEnumOptions(scopedTranslation, {
  FREE_ALLOWANCE: "enums.fundingType.freeAllowance",
  FREE_BONUS: "enums.fundingType.freeBonus",
  REFERRAL: "enums.fundingType.referral",
  PURCHASED: "enums.fundingType.purchased",
  SUBSCRIPTION: "enums.fundingType.subscription",
  ADMIN_GRANT: "enums.fundingType.adminGrant",
  FREE_UNKNOWN: "enums.fundingType.freeUnknown",
  PACK_UNKNOWN: "enums.fundingType.packUnknown",
});

export const CreditFundingTypeDB = [
  CreditFundingType.FREE_ALLOWANCE,
  CreditFundingType.FREE_BONUS,
  CreditFundingType.REFERRAL,
  CreditFundingType.PURCHASED,
  CreditFundingType.SUBSCRIPTION,
  CreditFundingType.ADMIN_GRANT,
  CreditFundingType.FREE_UNKNOWN,
  CreditFundingType.PACK_UNKNOWN,
] as const;

export type CreditFundingTypeDBValue = (typeof CreditFundingTypeDB)[number];
