import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { MediaHistoryRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger, t }) =>
      MediaHistoryRepository.list(data, user, logger, t),
  },
});
