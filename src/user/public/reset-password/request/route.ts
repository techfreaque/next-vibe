/**
 * Password reset request API route
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
