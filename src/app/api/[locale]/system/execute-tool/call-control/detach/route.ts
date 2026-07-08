import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { DetachCallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, user, t }) =>
      DetachCallRepository.detach(data, logger, user, t),
  },
});
