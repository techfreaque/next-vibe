/**
 * Payments Checkouts - Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** How a checkout started in the bucket ended up. */
export const {
  enum: CheckoutOutcome,
  options: CheckoutOutcomeOptions,
  Value: CheckoutOutcomeValue,
} = createEnumOptions(scopedTranslation, {
  STARTED: "enums.outcome.started",
  PAID: "enums.outcome.paid",
  ABANDONED: "enums.outcome.abandoned",
});
