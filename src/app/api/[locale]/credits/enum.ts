/**
 * Credits API Enums
 * Defines credit-related enumerations
 */

import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Credit type identifier for tracking which credit pool is being used
 */
export const {
  enum: CreditTypeIdentifier,
  options: CreditTypeIdentifierOptions,
} = createEnumOptions({
  USER_SUBSCRIPTION:
    "app.api.agent.chat.credits.enums.creditType.userSubscription",
  LEAD_FREE: "app.api.agent.chat.credits.enums.creditType.leadFree",
});

/**
 * Credit transaction type for tracking credit movements
 */
export const {
  enum: CreditTransactionType,
  options: CreditTransactionTypeOptions,
  Value: CreditTransactionTypeValues,
} = createEnumOptions({
  FREE_GRANT: "app.api.credits.enums.transactionType.freeGrant",
  PURCHASE: "app.api.credits.enums.transactionType.purchase",
  SUBSCRIPTION: "app.api.credits.enums.transactionType.subscription",
  USAGE: "app.api.credits.enums.transactionType.usage",
  EXPIRY: "app.api.credits.enums.transactionType.expiry",
  REFUND: "app.api.credits.enums.transactionType.refund",
  TRANSFER: "app.api.credits.enums.transactionType.transfer",
  OTHER_DEVICES: "app.api.credits.enums.transactionType.otherDevices",
});

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
] as const;

/**
 * Value types derived directly from DB arrays
 */
export type CreditTypeIdentifierValue = (typeof CreditTypeIdentifierDB)[number];
export type CreditTransactionTypeValue =
  (typeof CreditTransactionTypeDB)[number];
