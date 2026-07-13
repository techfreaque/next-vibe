import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import vibeDepsEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeDepsEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).VibeDepsRepository.execute(data, logger, t),
  },
});
