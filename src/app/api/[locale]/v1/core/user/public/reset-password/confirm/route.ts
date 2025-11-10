/**
 * Password reset confirmation API route
 *
 * This file defines the Next.js API route handler for confirming a password reset.
 * It connects the API endpoint definition with its implementation and email template.
 */

import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { simpleT } from "@/i18n/core/shared";

import { passwordRepository } from "../repository";
import resetPasswordConfirmEndpoints from "./definition";
import { renderResetPasswordConfirmMail } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: resetPasswordConfirmEndpoints,
  [Methods.POST]: {
    email: [
      {
        render: renderResetPasswordConfirmMail,
        // Ignore email errors to avoid blocking the API response
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, logger, locale }) => {
      const { t } = simpleT(locale);

      logger.debug("Password reset confirmation received", {
        email: data.verification.email,
      });

      // Validate passwords match
      if (data.newPassword.password !== data.newPassword.confirmPassword) {
        return fail({
          message:
            "app.api.v1.core.user.public.resetPassword.confirm.errors.validation.passwordsDoNotMatch",
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      // Reset the password
      const response = await passwordRepository.confirmPasswordReset(
        data.verification.token,
        data.verification.email,
        data.newPassword.password,
        locale,
        logger,
      );
      if (!response.success) {
        return response;
      }

      // Return structured response matching definition
      return success({
        response: {
          success: true,
          message:
            "app.api.v1.core.user.auth.resetPassword.success.password_reset",
          securityTip: t(
            "app.api.v1.core.user.public.resetPassword.confirm.response.securityTip",
          ),
          nextSteps: [
            t(
              "app.api.v1.core.user.public.resetPassword.confirm.response.nextSteps.0",
            ),
            t(
              "app.api.v1.core.user.public.resetPassword.confirm.response.nextSteps.1",
            ),
            t(
              "app.api.v1.core.user.public.resetPassword.confirm.response.nextSteps.2",
            ),
          ],
        },
      });
    },
  },
});
