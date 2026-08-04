import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import vibeDepsEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeDepsEndpoints,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import("./repository")).VibeDepsRepository.execute(
        data,
        logger,
        t,
      ),
  },
});
