/**
 * Password reset token validation API route
 *
 * This file defines the Next.js API route handler for validating a password reset token.
 * It connects the API endpoint definition with its implementation.
 */

import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { passwordRepository } from "../repository";
import { resetPasswordValidateEndpoint } from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: resetPasswordValidateEndpoint,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ data, logger }) => {
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
          message: "Reset token validation completed",
          userId: userId,
          expiresAt: undefined, // Not available from this method
          nextSteps: [
            "Proceed to set your new password",
            "Choose a strong, unique password",
          ],
        },
      });
    },
  },
});
