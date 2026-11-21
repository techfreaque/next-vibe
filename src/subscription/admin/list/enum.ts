import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Summary-card drill: which upcoming change to show. */
export const {
  enum: SubscriptionFocus,
  options: SubscriptionFocusOptions,
  Value: SubscriptionFocusValue,
} = createEnumOptions(scopedTranslation, {
  RENEWING_SOON: "enums.focus.renewingSoon",
  ENDING: "enums.focus.ending",
});
