import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import logoutEndpoints from "./definition";
import { LogoutRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: logoutEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ user, logger, platform, locale, t }) =>
      LogoutRepository.logout(user, logger, platform, locale, t),
  },
});
