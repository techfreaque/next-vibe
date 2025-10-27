/**
 * Password reset token validation API route
 *
 * This file defines the Next.js API route handler for validating a password reset token.
 * It connects the API endpoint definition with its implementation.
 */

import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
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
      return createSuccessResponse({
        response: {
          valid: true,
          message: t(
            "app.api.v1.core.user.public.resetPassword.validate.response.validationMessage",
          ),
          userId: userId,
          expiresAt: undefined, // Not available from this method
          nextSteps: [
            t(
              "app.api.v1.core.user.public.resetPassword.validate.response.nextSteps.steps.0",
            ),
            t(
              "app.api.v1.core.user.public.resetPassword.validate.response.nextSteps.steps.1",
            ),
          ],
        },
      });
    },
  },
});
