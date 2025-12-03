/**
 * Password reset token validation API route
 *
 * This file defines the Next.js API route handler for validating a password reset token.
 * It connects the API endpoint definition with its implementation.
 */

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { simpleT } from "@/i18n/core/shared";

import { passwordRepository } from "../repository";
import { resetPasswordValidateEndpoint } from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: resetPasswordValidateEndpoint,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger, locale }) => {
      const { t } = simpleT(locale);

      const verifyResult = await passwordRepository.verifyResetToken(
        data.tokenInput.token,
        logger,
      );

      if (!verifyResult.success) {
        return verifyResult;
      }

      // verifyResult.data contains the userId (string) when successful
      const userId = verifyResult.data;

      // Return structured response matching definition
      return success({
        response: {
          valid: true,
          message: t(
            "app.api.user.public.resetPassword.validate.response.validationMessage",
          ),
          userId: userId,
          expiresAt: undefined, // Not available from this method
          nextSteps: [
            t(
              "app.api.user.public.resetPassword.validate.response.nextSteps.steps.0",
            ),
            t(
              "app.api.user.public.resetPassword.validate.response.nextSteps.steps.1",
            ),
          ],
        },
      });
    },
  },
});
