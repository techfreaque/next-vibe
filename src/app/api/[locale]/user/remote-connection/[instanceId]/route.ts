/**
 * Remote Connection by Instance ID Route Handler
 * GET - status of this connection
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { RemoteConnectionInstanceRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams }) =>
      RemoteConnectionInstanceRepository.getConnectionById(
        user,
        logger,
        urlPathParams.instanceId,
      ),
  },
});
