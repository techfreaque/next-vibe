import { scopedTranslation } from "./i18n";
import { createEnumOptions } from "../../unified-ui/_shared/enum";

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
