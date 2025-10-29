/**
 * Password reset request API route
 *
 * This file defines the Next.js API route handler for requesting a password reset.
 * It connects the API endpoint definition with its implementation and email template.
 */

import { createSuccessResponse } from "next-vibe/shared/types/response.schema";

// Logger is available via handler parameters
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import resetPasswordRequestEndpoint from "./definition";
import { renderResetPasswordMail } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: resetPasswordRequestEndpoint,
  [Methods.POST]: {
    email: [
      {
        render: renderResetPasswordMail,
        // Ignore email errors to avoid revealing if an email exists
        ignoreErrors: true,
      },
    ],
    handler: ({ data, logger }) => {
      logger.debug("Password reset request received", {
        email: data.emailInput.email,
      });
      // We handle token creation in the email template
      return createSuccessResponse({
        response: {
          success: true,
          message:
            "app.api.v1.core.user.public.resetPassword.request.response.success.message",
          deliveryInfo: {
            emailSent: true,
            estimatedDelivery:
              "app.api.v1.core.user.public.resetPassword.request.response.deliveryInfo.estimatedTime",
            expiresAt:
              "app.api.v1.core.user.public.resetPassword.request.response.deliveryInfo.expiresAt",
            checkSpamFolder: true,
          },
          nextSteps: [
            "app.api.v1.core.user.public.resetPassword.request.response.nextSteps.checkEmail",
            "app.api.v1.core.user.public.resetPassword.request.response.nextSteps.clickLink",
            "app.api.v1.core.user.public.resetPassword.request.response.nextSteps.createPassword",
          ],
        },
      });
    },
  },
});
