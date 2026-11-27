import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { RecurringToggleRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      RecurringToggleRepository.toggle(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
