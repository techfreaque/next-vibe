/**
 * Newsletter credit bonus offer state for a signed-in account.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * - AVAILABLE: not subscribed, never had the bonus: offer it
 * - PENDING_CONFIRMATION: subscribed, confirm link not clicked yet
 * - ACTIVE: confirmed subscription in the account's pool, bonus is live
 * - NOT_ELIGIBLE: had the bonus before, or the account
 *   email's subscription belongs to someone else. Never offered again.
 */
export const {
  enum: NewsletterCreditOffer,
  options: NewsletterCreditOfferOptions,
  Value: NewsletterCreditOfferValue,
} = createEnumOptions(scopedTranslation, {
  AVAILABLE: "enum.offer.available",
  PENDING_CONFIRMATION: "enum.offer.pendingConfirmation",
  ACTIVE: "enum.offer.active",
  NOT_ELIGIBLE: "enum.offer.notEligible",
});
