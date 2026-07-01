import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import vibeDepsEndpoints from "./definition";
import { VibeDepsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeDepsEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      VibeDepsRepository.execute(data, logger, t),
  },
});
