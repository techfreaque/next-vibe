/**
 * Password reset request API route
 */

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import { PasswordRepository } from "../repository";
import resetPasswordRequestEndpoint from "./definition";
import { passwordResetRequestEmailTemplate } from "./email";

export const { POST, tools } = endpointsHandler({
  endpoint: resetPasswordRequestEndpoint,
  [Methods.POST]: {
    email: [
      {
        template: passwordResetRequestEmailTemplate,
        ignoreErrors: true,
      },
    ],
    handler: ({ logger }) => PasswordRepository.handleResetRequest(logger),
  },
});
