/**
 * Password reset confirmation API route
 *
 * This file defines the Next.js API route handler for confirming a password reset.
 * It connects the API endpoint definition with its implementation and email template.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { PasswordRepository } from "../repository";
import resetPasswordConfirmEndpoints from "./definition";
import { passwordResetConfirmEmailTemplate } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: resetPasswordConfirmEndpoints,
  [Methods.POST]: {
    email: [
      {
        template: passwordResetConfirmEmailTemplate,
        // Ignore email errors to avoid blocking the API response
        ignoreErrors: true,
      },
    ],
    handler: async ({ data, logger, locale, t }) =>
      PasswordRepository.confirmPasswordReset(
        data.token,
        data.email,
        data.password,
        data.confirmPassword,
        locale,
        logger,
        t,
      ),
  },
});
