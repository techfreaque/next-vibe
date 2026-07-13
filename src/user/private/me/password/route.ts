/**
 * Password Update Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import passwordEndpoints from "./definition";
import { PasswordUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: passwordEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, data, locale, logger, t }) =>
      PasswordUpdateRepository.updatePassword(user, data, locale, logger, t),
  },
});
