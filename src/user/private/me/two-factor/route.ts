/**
 * Two-factor route handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import twoFactorEndpoints from "./definition";
import { TwoFactorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: twoFactorEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, data, logger, t }) =>
      TwoFactorRepository.handle(user, data, logger, t),
  },
});
