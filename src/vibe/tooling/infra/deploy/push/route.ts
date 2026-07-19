import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import deployPushEndpoints from "./definition";

export const { tools } = endpointsHandler({
  endpoint: deployPushEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).DeployPushRepository.push(data, logger, t),
  },
});
