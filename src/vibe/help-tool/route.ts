import "server-only";

import { Methods } from "../core/definition/enums";
import { endpointsHandler } from "../core/route/multi";

import helpEndpoints from "./definition";
import { HelpRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: helpEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, platform, locale, logger }) =>
      HelpRepository.getTools(data, user, locale, platform, logger),
  },
});
