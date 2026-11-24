/**
 * Verify Email route handler.
 * Signed-in resends share the login challenge and its delivery limits.
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import verifyEmailEndpoints from "./definition";
import { VerifyEmailRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: verifyEmailEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, locale }) =>
      VerifyEmailRepository.handle(data, user, logger, t, locale),
  },
});
