/**
 * Remote Connection Self Rename Route Handler
 * PATCH - update the friendly name of the current instance's own identity
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { RemoteConnectionSelfRenameRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ user, logger, t, data, locale }) =>
      RemoteConnectionSelfRenameRepository.renameSelf(
        user,
        logger,
        t,
        data.newInstanceId,
        locale,
        data.propagate ?? true,
      ),
  },
});
