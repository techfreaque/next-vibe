/**
 * Remote Connection Register Route Handler
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import definitions from "./definition";
import { RemoteConnectionRegisterRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, t, locale }) =>
      RemoteConnectionRegisterRepository.registerLocalInstance(
        data,
        user,
        logger,
        t,
        locale,
      ),
  },
});
