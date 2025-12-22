/**
 * Password reset request API route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PasswordRepository } from "../repository";
import resetPasswordRequestEndpoint from "./definition";
import { renderResetPasswordMail } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: resetPasswordRequestEndpoint,
  [Methods.POST]: {
    email: [
      {
        render: renderResetPasswordMail,
        ignoreErrors: true,
      },
    ],
    handler: ({ logger }) => PasswordRepository.handleResetRequest(logger),
  },
});
