import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definition from "./definition";
import { RecurringListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definition,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      RecurringListRepository.listSchedules(user.id, data, logger, locale),
  },
});
