import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import apiKeysEndpoints from "./definition";
import { ApiKeysRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: apiKeysEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, locale, logger, request, t }) =>
      ApiKeysRepository.list(user, locale, logger, request, t),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t }) =>
      ApiKeysRepository.create(user, data.name, logger, t),
  },
});
