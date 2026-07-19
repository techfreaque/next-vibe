/**
 * Linux Users List Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: async ({ data, logger, user, t }) =>
      (await import("./repository")).LinuxUsersListRepository.list(
        data,
        logger,
        user,
        t,
      ),
  },
});
