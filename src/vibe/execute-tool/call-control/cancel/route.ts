import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import { endpoints } from "./definition";
import { CancelToolRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, user }) =>
      CancelToolRepository.cancel(data, user, logger),
  },
});
