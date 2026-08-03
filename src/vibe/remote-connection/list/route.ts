/**
 * Remote Connection List Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import endpoints from "./definition";
import { RemoteConnectionListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, data, logger }) =>
      RemoteConnectionListRepository.listRemoteConnections(
        user,
        logger,
        data.activeOnly ?? false,
      ),
  },
});
