import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import definitions from "./definition";
import { ReverseConnectionUpdateRepository } from "./repository";

export const { PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      ReverseConnectionUpdateRepository.updateReverseEntry(
        user,
        logger,
        data,
        locale,
      ),
  },
});
