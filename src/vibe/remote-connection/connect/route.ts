/**
 * Remote Connection Connect Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import definitions from "./definition";
import { RemoteConnectionConnectRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, locale }) =>
      RemoteConnectionConnectRepository.connectRemote(
        data,
        user,
        logger,
        t,
        locale,
      ),
  },
});
