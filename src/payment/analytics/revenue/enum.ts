/**
 * Revenue report filters.
 */

import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** What a payment paid for. */
export const {
  enum: RevenueKind,
  options: RevenueKindOptions,
  Value: RevenueKindValue,
} = createEnumOptions(scopedTranslation, {
  ALL: "enums.kind.all",
  PACK: "enums.kind.pack",
  NEW_SUBSCRIPTION: "enums.kind.newSubscription",
  RENEWAL: "enums.kind.renewal",
});
