import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import v1ModelsEndpoints from "./definition";
import { V1ModelsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: v1ModelsEndpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, request, t, logger }) =>
      V1ModelsRepository.list(user, request, t, logger),
  },
});
