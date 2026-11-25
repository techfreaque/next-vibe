/**
 * Credits Spent By Source - Enums
 * Who spent the credits and which kind of credits paid for it.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: UsageSource,
  options: UsageSourceOptions,
  Value: UsageSourceValue,
} = createEnumOptions(scopedTranslation, {
  /** Guests: free allowance spent before the lead was linked to an account */
  PUBLIC: "enums.source.public",
  /** Signed-in free credits: allowance, signup/newsletter bonus, referral credits */
  USERS_FREE: "enums.source.usersFree",
  /** Subscription credits + purchased packs */
  PAID: "enums.source.paid",
  /** Admin-granted bonus packs (testers, creators, goodwill) */
  GIFTED: "enums.source.gifted",
  /** Spend by admin (internal) accounts, any funding */
  INTERNAL: "enums.source.internal",
  /** Historic pack debits whose bucket could not be derived */
  UNATTRIBUTED: "enums.source.unattributed",
});
