/**
 * Password reset token validation API route
 */

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import { PasswordRepository } from "../repository";
import resetPasswordValidateEndpoint from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: resetPasswordValidateEndpoint,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger, t, locale }) =>
      PasswordRepository.verifyResetToken(
        data.tokenInput.token,
        logger,
        t,
        locale,
      ),
  },
});
