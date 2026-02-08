/**
 * Password reset confirmation API route
 *
 * This file defines the Next.js API route handler for confirming a password reset.
 * It connects the API endpoint definition with its implementation and email template.
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PasswordRepository } from "../repository";
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
      return await PasswordRepository.confirmPasswordReset(
        data.token,
        data.email,
        data.password,
        locale,
        logger,
      );
    },
  },
});
