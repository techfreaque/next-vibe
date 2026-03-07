/**
 * Remote Connection by Instance ID Route Handler
 * GET — status, PATCH — rename, DELETE — disconnect
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import {
  disconnectConnection,
  getConnectionById,
  renameConnection,
} from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams }) =>
      getConnectionById(user, logger, urlPathParams.instanceId),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, t, data, urlPathParams }) =>
      renameConnection(
        user,
        logger,
        t,
        urlPathParams.instanceId,
        data.friendlyName,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, logger, t, urlPathParams }) =>
      disconnectConnection(user, logger, t, urlPathParams.instanceId),
  },
});
