import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { AwaitTaskRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, logger, t, streamContext }) =>
      AwaitTaskRepository.awaitTask(data, user, logger, t, streamContext),
  },
});
