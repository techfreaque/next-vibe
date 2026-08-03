/**
 * Client Error Log Route Handler
 */

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";

import endpoints from "./definition";
import { ClientLogRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, locale }) => ClientLogRepository.log(data, locale),
  },
});
