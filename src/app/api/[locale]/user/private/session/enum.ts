import { createEnumOptions } from "@/app/api/[locale]/system/unified-interface/shared/field/enum";

/**
 * Session error reason enum
 */
export const {
  enum: SessionErrorReason,
  options: SessionErrorReasonOptions,
  Value: SessionErrorReasonValue,
} = createEnumOptions({
  NO_TOKEN_IN_COOKIES:
    "app.api.user.private.session.enums.sessionErrorReason.noTokenInCookies",
});
