/**
 * Remote Connection List Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { RemoteConnectionListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger }) =>
      RemoteConnectionListRepository.listRemoteConnections(user, logger),
  },
});
