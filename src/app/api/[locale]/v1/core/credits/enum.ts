/**
 * Credits API Enums
 * Defines credit-related enumerations
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/enum";

/**
 * Credit type identifier for tracking which credit pool is being used
 */
export const {
  enum: CreditTypeIdentifier,
  options: CreditTypeIdentifierOptions,
} = createEnumOptions({
  USER_SUBSCRIPTION:
    "app.api.v1.core.agent.chat.credits.enums.creditType.userSubscription",
  LEAD_FREE: "app.api.v1.core.agent.chat.credits.enums.creditType.leadFree",
});

/**
 * Credit transaction type for tracking credit movements
 */
export const {
  enum: CreditTransactionType,
  options: CreditTransactionTypeOptions,
  Value: CreditTransactionTypeValues,
} = createEnumOptions({
  FREE_GRANT: "app.api.v1.core.credits.enums.transactionType.freeGrant",
  FREE_RESET: "app.api.v1.core.credits.enums.transactionType.freeReset",
  PURCHASE: "app.api.v1.core.credits.enums.transactionType.purchase",
  SUBSCRIPTION: "app.api.v1.core.credits.enums.transactionType.subscription",
  USAGE: "app.api.v1.core.credits.enums.transactionType.usage",
  EXPIRY: "app.api.v1.core.credits.enums.transactionType.expiry",
  REFUND: "app.api.v1.core.credits.enums.transactionType.refund",
  TRANSFER: "app.api.v1.core.credits.enums.transactionType.transfer",
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
  CreditTransactionType.FREE_RESET,
  CreditTransactionType.PURCHASE,
  CreditTransactionType.SUBSCRIPTION,
  CreditTransactionType.USAGE,
  CreditTransactionType.EXPIRY,
  CreditTransactionType.REFUND,
  CreditTransactionType.TRANSFER,
] as const;

/**
 * Value types derived directly from DB arrays
 */
export type CreditTypeIdentifierValue = (typeof CreditTypeIdentifierDB)[number];
export type CreditTransactionTypeValue =
  (typeof CreditTransactionTypeDB)[number];
