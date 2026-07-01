/**
 * Error Logs Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ErrorLogsRepository } from "./repository";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, t, logger }) =>
      ErrorLogsRepository.getLogs(data, t, logger),
  },
  [Methods.PATCH]: {
    handler: ({ data, t, logger }) =>
      ErrorLogsRepository.updateStatus(data, t, logger),
  },
});
