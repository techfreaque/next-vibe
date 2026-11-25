/**
 * Payments Revenue - Enums
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** What the payment paid for. */
export const {
  enum: RevenueSeriesKind,
  options: RevenueSeriesKindOptions,
  Value: RevenueSeriesKindValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.kind.all",
  PACK: "enums.kind.pack",
  SUBSCRIPTION: "enums.kind.subscription",
  NEW_SUBSCRIPTION: "enums.kind.newSubscription",
  RENEWAL: "enums.kind.renewal",
});

/** Which payment processor collected it. */
export const {
  enum: RevenueSeriesProvider,
  options: RevenueSeriesProviderOptions,
  Value: RevenueSeriesProviderValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.provider.all",
  STRIPE: "enums.provider.stripe",
  NOWPAYMENTS: "enums.provider.nowpayments",
});
