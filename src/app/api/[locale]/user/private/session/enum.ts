import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

import { scopedTranslation } from "./i18n";

/**
 * Session error reason enum
 */
export const {
  enum: SessionErrorReason,
  options: SessionErrorReasonOptions,
  Value: SessionErrorReasonValue,
} = createEnumOptions(scopedTranslation, {
  NO_TOKEN_IN_COOKIES: "enums.sessionErrorReason.noTokenInCookies",
});
