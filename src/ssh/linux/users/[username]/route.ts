import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";

export const { DELETE, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.DELETE]: {
    handler: async ({ data, logger, urlPathParams, t }) =>
      (await import("./repository")).LinuxUserDeleteRepository.delete(
        data,
        logger,
        urlPathParams?.["username"] ?? "",
        t,
      ),
  },
});
