/**
 * Password reset token validation API route
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PasswordRepository } from "../repository";
import resetPasswordValidateEndpoint from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: resetPasswordValidateEndpoint,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, logger }) =>
      PasswordRepository.verifyResetToken(data.tokenInput.token, logger),
  },
});
