import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/**
 * What the Stripe sync did (or would do, in a dry run) to one subscription row.
 */
export const {
  enum: SubscriptionSyncAction,
  options: SubscriptionSyncActionOptions,
  Value: SubscriptionSyncActionValue,
} = createEnumOptions(scopedTranslation, {
  UPDATED: "enums.action.updated",
  UNCHANGED: "enums.action.unchanged",
  EXPIRED: "enums.action.expired",
  MISSING_IN_STRIPE: "enums.action.missingInStripe",
  SKIPPED: "enums.action.skipped",
  ERROR: "enums.action.error",
});

export const SubscriptionSyncActionDB = [
  SubscriptionSyncAction.UPDATED,
  SubscriptionSyncAction.UNCHANGED,
  SubscriptionSyncAction.EXPIRED,
  SubscriptionSyncAction.MISSING_IN_STRIPE,
  SubscriptionSyncAction.SKIPPED,
  SubscriptionSyncAction.ERROR,
] as const;
