/**
 * Password reset confirmation API route
 *
 * This file defines the Next.js API route handler for confirming a password reset.
 * It connects the API endpoint definition with its implementation and email template.
 */

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

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
    handler: async ({ data, logger }) => {
      logger.debug("Password reset confirmation received", {
        email: data.verification.email,
      });

      // Validate passwords match
      if (data.newPassword.password !== data.newPassword.confirmPassword) {
        return createErrorResponse(
          "auth.resetPassword.errors.passwords_do_not_match",
          ErrorResponseTypes.VALIDATION_ERROR,
        );
      }

      // Reset the password
      const response = await passwordRepository.confirmPasswordReset(
        data.verification.token,
        data.verification.email,
        data.newPassword.password,
        logger,
      );
      if (!response.success) {
        return response;
      }

      // Return structured response matching definition
      return createSuccessResponse({
        response: {
          success: true,
          message: "auth.resetPassword.success.password_reset",
          securityTip:
            "Consider enabling two-factor authentication for better security",
          nextSteps: [
            "Log in with your new password",
            "Update saved passwords in your browser",
            "Consider enabling 2FA for added security",
          ],
        },
      });
    },
  },
});
