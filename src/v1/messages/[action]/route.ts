import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1CountTokensEndpoints from "./definition";
import { V1CountTokensRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: v1CountTokensEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, request, t, logger }) =>
      V1CountTokensRepository.count({ data, user, request, t, logger }),
  },
});
