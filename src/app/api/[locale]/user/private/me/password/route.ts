/**
 * Password Update Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import passwordEndpoints from "./definition";
import { PasswordUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: passwordEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, data, locale, logger }) =>
      PasswordUpdateRepository.updatePassword(user, data, locale, logger),
  },
});
