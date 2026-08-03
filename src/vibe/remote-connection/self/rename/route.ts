/**
 * Remote Connection Self Rename Route Handler
 * PATCH - update the friendly name of the current instance's own identity
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import definition from "./definition";
import { RemoteConnectionSelfRenameRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, t, data, locale, platform }) =>
      RemoteConnectionSelfRenameRepository.renameSelf(
        user,
        logger,
        t,
        data.newInstanceId,
        locale,
        data.propagate ?? true,
        platform,
      ),
  },
});
