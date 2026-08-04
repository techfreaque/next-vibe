/**
 * Pulse History API Route Handler
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import endpoints from "./definition";
import { PulseHistoryRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ data, logger, t }) =>
      PulseHistoryRepository.getHistory(data, logger, t),
  },
});
