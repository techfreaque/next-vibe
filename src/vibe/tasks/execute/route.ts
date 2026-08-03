/**
 * Task Execute API Route
 * Handles single task execution by ID
 */

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import taskExecuteEndpoints from "./definition";
import { TaskExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: taskExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t, toolExecutionContext }) =>
      TaskExecuteRepository.executeTask(
        data,
        user,
        locale,
        logger,
        t,
        toolExecutionContext.abortSignal,
      ),
  },
});
