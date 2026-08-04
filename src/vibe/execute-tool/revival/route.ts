import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";
import endpoints from "./definition";
import { RevivalRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, toolExecutionContext }) =>
      RevivalRepository.resume(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext.abortSignal,
        toolExecutionContext.subAgentDepth,
      ),
  },
});
