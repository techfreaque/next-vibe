import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enum-helpers";

/**
 * Session error reason enum
 */
export const {
  enum: SessionErrorReason,
  options: SessionErrorReasonOptions,
  Value: SessionErrorReasonValue,
} = createEnumOptions({
  NO_TOKEN_IN_COOKIES:
    "app.api.v1.core.user.private.session.enums.sessionErrorReason.noTokenInCookies",
});
