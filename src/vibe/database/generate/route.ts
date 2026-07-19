import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import generateEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: generateEndpoints,
  [Methods.POST]: {
    handler: async ({ logger }) =>
      (await import("./repository")).DatabaseGenerateRepository.runGenerate(
        logger,
      ),
  },
});
