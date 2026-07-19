/**
 * SSH Connections List Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ConnectionsListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ logger, user, t }) =>
      ConnectionsListRepository.list(logger, user, t),
  },
});
