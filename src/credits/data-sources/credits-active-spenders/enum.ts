/**
 * Credits Active Spenders - Enums
 * Who used paid-for AI (any credit debit) in a bucket.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

export const {
  enum: SpenderKind,
  options: SpenderKindOptions,
  Value: SpenderKindValue,
} = createEnumOptions(scopedTranslation, {
  /** Distinct accounts (wallet owner, or the account the device was linked to at the time) */
  SIGNED_IN: "enums.who.signedIn",
  /** Distinct guest devices (leads not linked to an account at the time, bots excluded) */
  GUESTS: "enums.who.guests",
});
