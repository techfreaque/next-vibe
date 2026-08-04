/**
 * Remote Connection by Instance ID Route Handler
 * GET    - full connection status + settings
 * PATCH  - update settings (rename, reauth, behavior, sync scope)
 * DELETE - disconnect (delete row, close WS, archive subfolder, notify remote)
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import definitions from "./definition";
import { RemoteConnectionInstanceRepository } from "./repository";

export const { GET, PATCH, DELETE, tools } = endpointsHandler({
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
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams, data, locale, platform }) =>
      RemoteConnectionInstanceRepository.updateConnection(
        user,
        logger,
        urlPathParams.instanceId,
        data,
        locale,
        platform,
      ),
  },
  [Methods.DELETE]: {
    email: undefined,
    handler: ({ user, logger, urlPathParams, locale }) =>
      RemoteConnectionInstanceRepository.disconnectConnection(
        user,
        logger,
        urlPathParams.instanceId,
        locale,
      ),
  },
});
