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
 * Database enum arrays for Drizzle ORM
 */
export const CreditTypeIdentifierDB = [
  CreditTypeIdentifier.USER_SUBSCRIPTION,
  CreditTypeIdentifier.LEAD_FREE,
] as const;

/**
 * Value types derived directly from DB arrays
 */
export type CreditTypeIdentifierValue = (typeof CreditTypeIdentifierDB)[number];
