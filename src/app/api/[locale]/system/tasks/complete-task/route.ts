/**
 * Complete Task Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { endpoints } from "./definition";
import { CompleteTaskRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t, user, locale, streamContext }) =>
      CompleteTaskRepository.completeTask(
        data,
        logger,
        t,
        user,
        locale,
        streamContext.abortSignal,
      ),
  },
});
